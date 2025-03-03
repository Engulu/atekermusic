import { useState, useEffect } from 'react';
import { Users, Music, DollarSign, ChevronDown, Search, Shield, Bell, Settings, Trash2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import ProfilePicture from '../components/ProfilePicture';
import { auth, db } from '../services/firebaseService';
import { getAdminStats, getUnapprovedArtists, getPendingSongs, approveArtist, approveSong, deleteArtist, deleteSong } from '../services/adminService';
import type { User, Song } from '../types';
import { useAuth } from '../contexts/AuthContext';

type Tab = 'overview' | 'artists' | 'songs' | 'reports' | 'settings';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArtists: 0,
    totalSongs: 0,
    totalDownloads: 0,
    totalRevenue: 0,
    pendingApprovals: 0
  });

  const [unapprovedArtists, setUnapprovedArtists] = useState<User[]>([]);
  const [pendingSongs, setPendingSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        if (!currentUser) {
          navigate('/signin');
          return;
        }

        if (currentUser.role !== 'admin') {
          navigate('/');
          return;
        }

        await loadDashboardData();
      } catch (error) {
        console.error('Error checking admin access:', error);
      }
    };

    checkAdminAccess();
  }, [currentUser, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      const [statsData, artists, songs] = await Promise.all([
        getAdminStats(),
        getUnapprovedArtists(),
        getPendingSongs()
      ]);

      setStats({
        ...statsData,
        pendingApprovals: artists.length + songs.length
      });
      setUnapprovedArtists(artists);
      setPendingSongs(songs);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveArtist = async (artistId: string) => {
    try {
      setLoadingAction(`approve-artist-${artistId}`);
      setError(null); // Clear any previous errors
      await approveArtist(artistId);
      setUnapprovedArtists(prev => prev.filter(artist => artist.id !== artistId));
      await loadDashboardData();
    } catch (error) {
      console.error('Error approving artist:', error);
      setError('Failed to approve artist. Please try again.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleApproveSong = async (songId: string) => {
    try {
      setLoadingAction(`approve-song-${songId}`);
      setError(null); // Clear any previous errors
      await approveSong(songId);
      setPendingSongs(prev => prev.filter(song => song.id !== songId));
      await loadDashboardData();
    } catch (error) {
      console.error('Error approving song:', error);
      setError('Failed to approve song. Please try again.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteArtist = async (artistId: string) => {
    if (!window.confirm('Are you sure you want to delete this artist? This action cannot be undone.')) {
      return;
    }

    try {
      setLoadingAction(`delete-artist-${artistId}`);
      setError(null); // Clear any previous errors
      await deleteArtist(artistId);
      setUnapprovedArtists(prev => prev.filter(artist => artist.id !== artistId));
      await loadDashboardData();
    } catch (error) {
      console.error('Error deleting artist:', error);
      setError('Failed to delete artist. Please try again.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteSong = async (songId: string) => {
    if (!window.confirm('Are you sure you want to delete this song? This action cannot be undone.')) {
      return;
    }

    try {
      setLoadingAction(`delete-song-${songId}`);
      setError(null); // Clear any previous errors
      await deleteSong(songId);
      setPendingSongs(prev => prev.filter(song => song.id !== songId));
      await loadDashboardData();
    } catch (error) {
      console.error('Error deleting song:', error);
      setError('Failed to delete song. Please try again.');
    } finally {
      setLoadingAction(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 pt-24 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-navy-900 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <ProfilePicture
              imageUrl={currentUser?.profilePicture}
              size="lg"
              editable
              onUpdate={(url) => {
                // Profile picture will be updated automatically via AuthContext
              }}
            />
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400">Manage your platform</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-white">
              <Bell className="w-6 h-6" />
              {stats.pendingApprovals > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {stats.pendingApprovals}
                </span>
              )}
            </button>
            <button className="p-2 text-gray-400 hover:text-white">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-4 mb-8 pb-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition ${
              activeTab === 'overview'
                ? 'bg-blue-500 text-white'
                : 'bg-navy-800 text-gray-400 hover:bg-navy-700'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('artists')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition ${
              activeTab === 'artists'
                ? 'bg-blue-500 text-white'
                : 'bg-navy-800 text-gray-400 hover:bg-navy-700'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Artists</span>
            {unapprovedArtists.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unapprovedArtists.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('songs')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition ${
              activeTab === 'songs'
                ? 'bg-blue-500 text-white'
                : 'bg-navy-800 text-gray-400 hover:bg-navy-700'
            }`}
          >
            <Music className="w-5 h-5" />
            <span>Songs</span>
            {pendingSongs.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {pendingSongs.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition ${
              activeTab === 'reports'
                ? 'bg-blue-500 text-white'
                : 'bg-navy-800 text-gray-400 hover:bg-navy-700'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            <span>Reports</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition ${
              activeTab === 'settings'
                ? 'bg-blue-500 text-white'
                : 'bg-navy-800 text-gray-400 hover:bg-navy-700'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md w-full mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search artists, songs, or users..."
            className="w-full px-12 py-3 bg-navy-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Content */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
              <div className="bg-navy-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-400">Total Users</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {stats.totalUsers.toLocaleString()}
                </p>
              </div>

              <div className="bg-navy-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Music className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-400">Total Artists</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {stats.totalArtists.toLocaleString()}
                </p>
              </div>

              <div className="bg-navy-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Music className="w-5 h-5 text-green-400" />
                  <span className="text-gray-400">Total Songs</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {stats.totalSongs.toLocaleString()}
                </p>
              </div>

              <div className="bg-navy-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Download className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-400">Downloads</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {stats.totalDownloads.toLocaleString()}
                </p>
              </div>

              <div className="bg-navy-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-400">Revenue</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {stats.totalRevenue.toLocaleString()} UGX
                </p>
              </div>

              <div className="bg-navy-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="text-gray-400">Pending</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {stats.pendingApprovals}
                </p>
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Unapproved Artists */}
              <div className="bg-navy-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  Pending Artist Approvals
                </h2>

                <div className="space-y-4">
                  {unapprovedArtists.map(artist => (
                    <div key={artist.id} className="bg-navy-900 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-medium">{artist.displayName}</h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApproveArtist(artist.id)}
                            disabled={loadingAction === `approve-artist-${artist.id}`}
                            className={`flex items-center gap-1 px-3 py-1 ${
                              loadingAction === `approve-artist-${artist.id}`
                                ? 'bg-green-500/5 text-green-400/50'
                                : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                            } rounded`}
                          >
                            {loadingAction === `approve-artist-${artist.id}` ? (
                              <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            <span>{loadingAction === `approve-artist-${artist.id}` ? 'Approving...' : 'Approve'}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteArtist(artist.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">{artist.email}</p>
                      <div className="mt-2 text-sm">
                        <span className="text-gray-500">NIN: </span>
                        <span className="text-gray-400">{artist.nin?.number}</span>
                      </div>
                    </div>
                  ))}

                  {unapprovedArtists.length === 0 && (
                    <p className="text-gray-400 text-center py-4">
                      No pending artist approvals
                    </p>
                  )}
                </div>
              </div>

              {/* Pending Songs */}
              <div className="bg-navy-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Music className="w-5 h-5 text-purple-400" />
                  Pending Song Reviews
                </h2>

                <div className="space-y-4">
                  {pendingSongs.map(song => (
                    <div key={song.id} className="bg-navy-900 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-white font-medium">{song.title}</h3>
                          <p className="text-gray-400 text-sm">{song.artistName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApproveSong(song.id)}
                            disabled={loadingAction === `approve-song-${song.id}`}
                            className={`flex items-center gap-1 px-3 py-1 ${
                              loadingAction === `approve-song-${song.id}`
                                ? 'bg-green-500/5 text-green-400/50'
                                : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                            } rounded`}
                          >
                            {loadingAction === `approve-song-${song.id}` ? (
                              <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            <span>{loadingAction === `approve-song-${song.id}` ? 'Approving...' : 'Approve'}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteSong(song.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                      {song.isPaid && (
                        <div className="mt-2 text-sm">
                          <span className="text-gray-500">Price: </span>
                          <span className="text-gray-400">{song.price} UGX</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {pendingSongs.length === 0 && (
                    <p className="text-gray-400 text-center py-4">
                      No pending song reviews
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'artists' && (
          <div className="bg-navy-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Manage Artists</h2>
            {/* Artist management interface */}
          </div>
        )}

        {activeTab === 'songs' && (
          <div className="bg-navy-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Manage Songs</h2>
            {/* Song management interface */}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-navy-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Financial Reports</h2>
            {/* Reports interface */}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-navy-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Platform Settings</h2>
            {/* Settings interface */}
          </div>
        )}
      </div>
    </main>
  );
}