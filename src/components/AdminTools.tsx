import { useState, useEffect } from 'react';
import { useFirebase } from '../contexts/FirebaseContext';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
  lastLogin?: Date;
  status: 'active' | 'suspended';
}

interface Content {
  id: string;
  title: string;
  type: 'music' | 'video' | 'article';
  status: 'published' | 'draft' | 'flagged';
  createdAt: Date;
  userId: string;
}

export function AdminTools() {
  const [activeTab, setActiveTab] = useState<'users' | 'content' | 'reports'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'content') loadContent();
  }, [activeTab]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setUsers(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as User[]);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadContent = async () => {
    setLoading(true);
    try {
      const contentRef = collection(db, 'content');
      const q = query(contentRef, orderBy('createdAt', 'desc'));
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

  const updateUserStatus = async (userId: string, status: 'active' | 'suspended') => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { status });
      await loadUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const updateContentStatus = async (contentId: string, status: 'published' | 'draft' | 'flagged') => {
    try {
      const contentRef = doc(db, 'content', contentId);
      await updateDoc(contentRef, { status });
      await loadContent();
    } catch (error) {
      console.error('Error updating content status:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContent = content.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Tools</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded ${
              activeTab === 'users' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 rounded ${
              activeTab === 'content' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded ${
              activeTab === 'reports' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}
          >
            Reports
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : activeTab === 'users' ? (
        <div className="grid gap-4">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{user.email}</h3>
                  <p className="text-sm text-gray-500">
                    Role: {user.role}
                  </p>
                  <p className="text-sm text-gray-500">
                    Joined: {user.createdAt?.toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={user.status}
                    onChange={(e) => updateUserStatus(user.id, e.target.value as 'active' | 'suspended')}
                    className="rounded border-gray-300"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === 'content' ? (
        <div className="grid gap-4">
          {filteredContent.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500">
                    Type: {item.type}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created: {item.createdAt?.toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={item.status}
                    onChange={(e) => updateContentStatus(item.id, e.target.value as 'published' | 'draft' | 'flagged')}
                    className="rounded border-gray-300"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="flagged">Flagged</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>Reports coming soon...</div>
      )}
    </div>
  );
} 