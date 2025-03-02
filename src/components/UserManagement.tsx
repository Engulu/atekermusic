import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
  lastLogin?: Date;
  status: 'active' | 'suspended' | 'banned';
  profile: {
    name?: string;
    avatar?: string;
    bio?: string;
    location?: string;
  };
  preferences: {
    emailNotifications: boolean;
    marketingEmails: boolean;
    language: string;
  };
  stats: {
    totalPlays: number;
    totalDownloads: number;
    followers: number;
    following: number;
  };
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filter, setFilter] = useState<'all' | 'artists' | 'suspended' | 'banned'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, [filter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersRef = collection(db, 'users');
      let q = query(usersRef, orderBy('createdAt', 'desc'));
      
      if (filter === 'artists') {
        q = query(q, where('role', '==', 'artist'));
      } else if (filter === 'suspended') {
        q = query(q, where('status', '==', 'suspended'));
      } else if (filter === 'banned') {
        q = query(q, where('status', '==', 'banned'));
      }

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

  const updateUserStatus = async (userId: string, status: User['status'], reason?: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        status,
        statusUpdatedAt: new Date(),
        statusReason: reason
      });
      await loadUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const updateUserPreferences = async (userId: string, preferences: Partial<User['preferences']>) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        preferences: {
          ...users.find(u => u.id === userId)?.preferences,
          ...preferences
        }
      });
      await loadUsers();
    } catch (error) {
      console.error('Error updating user preferences:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profile.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-4 py-2 border rounded"
          >
            <option value="all">All Users</option>
            <option value="artists">Artists</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <img
                    src={user.profile.avatar || '/default-avatar.png'}
                    alt={user.profile.name || 'User'}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{user.profile.name || user.email}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      Role: {user.role} | Status: {user.status}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <select
                    value={user.status}
                    onChange={(e) => updateUserStatus(user.id, e.target.value as User['status'])}
                    className="rounded border-gray-300"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Total Plays</p>
                  <p className="font-semibold">{user.stats.totalPlays}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Downloads</p>
                  <p className="font-semibold">{user.stats.totalDownloads}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Followers</p>
                  <p className="font-semibold">{user.stats.followers}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Following</p>
                  <p className="font-semibold">{user.stats.following}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <h3 className="text-xl font-bold mb-4">Edit User</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Profile</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={selectedUser.profile.name || ''}
                      onChange={(e) => setSelectedUser({
                        ...selectedUser,
                        profile: { ...selectedUser.profile, name: e.target.value }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={selectedUser.profile.location || ''}
                      onChange={(e) => setSelectedUser({
                        ...selectedUser,
                        profile: { ...selectedUser.profile, location: e.target.value }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium">Preferences</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUser.preferences.emailNotifications}
                      onChange={(e) => setSelectedUser({
                        ...selectedUser,
                        preferences: {
                          ...selectedUser.preferences,
                          emailNotifications: e.target.checked
                        }
                      })}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2">Email Notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUser.preferences.marketingEmails}
                      onChange={(e) => setSelectedUser({
                        ...selectedUser,
                        preferences: {
                          ...selectedUser.preferences,
                          marketingEmails: e.target.checked
                        }
                      })}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2">Marketing Emails</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updateUserPreferences(selectedUser.id, selectedUser.preferences);
                    setSelectedUser(null);
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