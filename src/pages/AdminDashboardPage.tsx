import { useState, useEffect } from 'react';
import { Users, Music, AlertTriangle, Ban, ChevronDown, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebaseService';
import { getAdminStats, getUnapprovedArtists, getPendingSongs, deleteArtist, deleteSong } from '../services/adminService';
import type { User, Song } from '../types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArtists: 0,
    totalSongs: 0,
    totalDownloads: 0,
    totalRevenue: 0
  });

  const [unapprovedArtists, setUnapprovedArtists] = useState<User[]>([]);
  const [pendingSongs, setPendingSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/signin');
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      if (userData?.role !== 'admin') {
        navigate('/');
        return;
      }

      loadDashboardData();
    };

    checkAdminAccess();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      const [statsData, artists, songs] = await Promise.all([
        getAdminStats(),
        getUnapprovedArtists(),
        getPendingSongs()
      ]);

      setStats(statsData);
      setUnapprovedArtists(artists);
      setPendingSongs(songs);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArtist = async (artistId: string) => {
    if (!window.confirm('Are you sure you want to delete this artist? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteArtist(artistId);
      setUnapprovedArtists(prev => prev.filter(artist => artist.id !== artistId));
    } catch (error) {
      console.error('Error deleting artist:', error);
    }
  };

  const handleDeleteSong = async (songId: string) => {
    if (!window.confirm('Are you sure you want to delete this song? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteSong(songId);
      setPendingSongs(prev => prev.filter(song => song.id !== songId));
    } catch (error) {
      console.error('Error deleting song:', error);
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
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
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
                        className="px-3 py-1 bg-green-500/10 text-green-400 rounded hover:bg-green-500/20"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDeleteArtist(artist.id)}
                        className="px-3 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20"
                      >
                        Delete
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
                        className="px-3 py-1 bg-green-500/10 text-green-400 rounded hover:bg-green-500/20"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDeleteSong(song.id)}
                        className="px-3 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20"
                      >
                        Delete
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
      </div>
    </main>
  );
}