import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ScheduledContent {
  id: string;
  title: string;
  type: 'music' | 'video' | 'article' | 'event';
  content: any;
  schedule: {
    publishDate: Date;
    unpublishDate?: Date;
    timezone: string;
    repeat?: 'daily' | 'weekly' | 'monthly' | 'none';
  };
  status: 'scheduled' | 'published' | 'unpublished' | 'failed';
  targetAudience?: {
    segments: string[];
    locations?: string[];
    devices?: string[];
  };
  analytics?: {
    views: number;
    engagement: number;
    conversion: number;
  };
}

export function ContentScheduler() {
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<ScheduledContent | null>(null);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'published' | 'unpublished'>('all');

  useEffect(() => {
    loadScheduledContent();
  }, [filter]);

  const loadScheduledContent = async () => {
    setLoading(true);
    try {
      const contentRef = collection(db, 'scheduledContent');
      let q = query(contentRef, orderBy('schedule.publishDate', 'desc'));
      
      if (filter !== 'all') {
        q = query(q, where('status', '==', filter));
      }

      const snapshot = await getDocs(q);
      setScheduledContent(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        schedule: {
          ...doc.data().schedule,
          publishDate: doc.data().schedule.publishDate.toDate(),
          unpublishDate: doc.data().schedule.unpublishDate?.toDate()
        }
      })) as ScheduledContent[]);
    } catch (error) {
      console.error('Error loading scheduled content:', error);
    } finally {
      setLoading(false);
    }
  };

  const scheduleContent = async (content: Omit<ScheduledContent, 'id' | 'status' | 'analytics'>) => {
    try {
      const docRef = await addDoc(collection(db, 'scheduledContent'), {
        ...content,
        status: 'scheduled',
        analytics: {
          views: 0,
          engagement: 0,
          conversion: 0
        },
        createdAt: new Date()
      });
      await loadScheduledContent();
      return docRef.id;
    } catch (error) {
      console.error('Error scheduling content:', error);
      throw error;
    }
  };

  const updateSchedule = async (contentId: string, schedule: ScheduledContent['schedule']) => {
    try {
      const contentRef = doc(db, 'scheduledContent', contentId);
      await updateDoc(contentRef, { schedule });
      await loadScheduledContent();
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Content Scheduler</h2>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-4 py-2 border rounded"
          >
            <option value="all">All Content</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4">
          {scheduledContent.map(content => (
            <div key={content.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{content.title}</h3>
                  <p className="text-sm text-gray-500">
                    Type: {content.type}
                  </p>
                  <p className="text-sm text-gray-500">
                    Publish Date: {content.schedule.publishDate.toLocaleString()}
                  </p>
                  {content.schedule.unpublishDate && (
                    <p className="text-sm text-gray-500">
                      Unpublish Date: {content.schedule.unpublishDate.toLocaleString()}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedContent(content)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <span className={`px-3 py-1 rounded ${
                    content.status === 'published' ? 'bg-green-100 text-green-800' :
                    content.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                    content.status === 'unpublished' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                  </span>
                </div>
              </div>

              {content.analytics && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Views</p>
                    <p className="font-semibold">{content.analytics.views}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Engagement</p>
                    <p className="font-semibold">{content.analytics.engagement}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Conversion</p>
                    <p className="font-semibold">{content.analytics.conversion}%</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <h3 className="text-xl font-bold mb-4">Edit Schedule</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Publish Date</label>
                <input
                  type="datetime-local"
                  value={format(selectedContent.schedule.publishDate, "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) => setSelectedContent({
                    ...selectedContent,
                    schedule: {
                      ...selectedContent.schedule,
                      publishDate: new Date(e.target.value)
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Unpublish Date</label>
                <input
                  type="datetime-local"
                  value={selectedContent.schedule.unpublishDate ? 
                    format(selectedContent.schedule.unpublishDate, "yyyy-MM-dd'T'HH:mm") : ''}
                  onChange={(e) => setSelectedContent({
                    ...selectedContent,
                    schedule: {
                      ...selectedContent.schedule,
                      unpublishDate: e.target.value ? new Date(e.target.value) : undefined
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Repeat</label>
                <select
                  value={selectedContent.schedule.repeat || 'none'}
                  onChange={(e) => setSelectedContent({
                    ...selectedContent,
                    schedule: {
                      ...selectedContent.schedule,
                      repeat: e.target.value as 'daily' | 'weekly' | 'monthly' | 'none'
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="none">No Repeat</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setSelectedContent(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updateSchedule(selectedContent.id, selectedContent.schedule);
                    setSelectedContent(null);
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 