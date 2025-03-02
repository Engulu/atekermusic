import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Content {
  id: string;
  title: string;
  type: 'music' | 'video' | 'article';
  status: 'published' | 'draft' | 'flagged' | 'rejected';
  createdAt: Date;
  userId: string;
  reports: Report[];
  moderationNotes: string[];
}

interface Report {
  id: string;
  userId: string;
  reason: string;
  timestamp: Date;
  status: 'pending' | 'reviewed' | 'resolved';
}

export function ContentModeration() {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [filter, setFilter] = useState<'all' | 'flagged' | 'reported'>('flagged');

  useEffect(() => {
    loadContent();
  }, [filter]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const contentRef = collection(db, 'content');
      let q = query(contentRef, orderBy('createdAt', 'desc'));
      
      if (filter === 'flagged') {
        q = query(q, where('status', '==', 'flagged'));
      } else if (filter === 'reported') {
        q = query(q, where('reports', '!=', []));
      }

      const snapshot = await getDocs(q);
      setContent(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Content[]);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContentStatus = async (contentId: string, status: Content['status'], note?: string) => {
    try {
      const contentRef = doc(db, 'content', contentId);
      const updates: any = { status };
      
      if (note) {
        updates.moderationNotes = arrayUnion({
          note,
          timestamp: new Date(),
          moderatorId: currentUser?.uid
        });
      }

      await updateDoc(contentRef, updates);
      await loadContent();
    } catch (error) {
      console.error('Error updating content status:', error);
    }
  };

  const handleReport = async (reportId: string, status: Report['status'], note?: string) => {
    try {
      const contentRef = doc(db, 'content', selectedContent?.id);
      await updateDoc(contentRef, {
        [`reports.${reportId}.status`]: status,
        [`reports.${reportId}.resolutionNote`]: note
      });
      await loadContent();
    } catch (error) {
      console.error('Error handling report:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Content Moderation</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}
          >
            All Content
          </button>
          <button
            onClick={() => setFilter('flagged')}
            className={`px-4 py-2 rounded ${
              filter === 'flagged' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}
          >
            Flagged Content
          </button>
          <button
            onClick={() => setFilter('reported')}
            className={`px-4 py-2 rounded ${
              filter === 'reported' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}
          >
            Reported Content
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4">
          {content.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500">
                    Type: {item.type}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created: {item.createdAt?.toLocaleDateString()}
                  </p>
                  {item.reports?.length > 0 && (
                    <div className="mt-2">
                      <h4 className="font-medium">Reports:</h4>
                      {item.reports.map(report => (
                        <div key={report.id} className="ml-4">
                          <p className="text-sm">Reason: {report.reason}</p>
                          <p className="text-sm">Status: {report.status}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedContent(item)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Review
                  </button>
                  <select
                    value={item.status}
                    onChange={(e) => updateContentStatus(item.id, e.target.value as Content['status'])}
                    className="rounded border-gray-300"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="flagged">Flagged</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <h3 className="text-xl font-bold mb-4">Review Content</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Content Details</h4>
                <p>Title: {selectedContent.title}</p>
                <p>Type: {selectedContent.type}</p>
                <p>Status: {selectedContent.status}</p>
              </div>
              
              {selectedContent.reports?.length > 0 && (
                <div>
                  <h4 className="font-medium">Reports</h4>
                  {selectedContent.reports.map(report => (
                    <div key={report.id} className="ml-4">
                      <p>Reason: {report.reason}</p>
                      <p>Status: {report.status}</p>
                      {report.status === 'pending' && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleReport(report.id, 'reviewed')}
                            className="bg-green-500 text-white px-3 py-1 rounded"
                          >
                            Mark as Reviewed
                          </button>
                          <button
                            onClick={() => handleReport(report.id, 'resolved')}
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                          >
                            Resolve
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <div>
                <h4 className="font-medium">Moderation Notes</h4>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={4}
                  placeholder="Add a note..."
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setSelectedContent(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
                <button
                  onClick={() => updateContentStatus(selectedContent.id, 'published')}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateContentStatus(selectedContent.id, 'rejected')}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 