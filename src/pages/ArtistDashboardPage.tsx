import { useState, useEffect } from 'react';
import { Music, Download, DollarSign, Users, Upload, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfilePicture from '../components/ProfilePicture';
import { auth, db } from '../services/firebaseService';
import { doc, getDoc } from 'firebase/firestore';
import type { Song, User } from '../types';

export default function ArtistDashboardPage() {
  const [stats, setStats] = useState({
    totalSongs: 0,
    totalDownloads: 0,
    totalRevenue: 0,
    followers: 0
  });

  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkArtistAccess = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/signin');
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data() as User;
      
      if (userData?.role !== 'artist') {
        navigate('/');
        return;
      }

      loadDashboardData(user.uid);
    };

    checkArtistAccess();
  }, [navigate]);

  const loadDashboardData = async (artistId: string) => {
    try {
      // In a real app, fetch this data from your Firestore collections
      const mockSongs: Song[] = [
        {
          id: '1',
          title: 'Akello',
          artistId,
          artistName: 'Your Artist Name',
          coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070',
          songUrl: '#',
          downloadCount: 1234,
          playCount: 5678,
          likeCount: 890,
          price: 2000,
          isPaid: true,
          createdAt: new Date().toISOString()
        }
      ];

      setSongs(mockSongs);
      setStats({
        totalSongs: mockSongs.length,
        totalDownloads: mockSongs.reduce((sum, song) => sum + song.downloadCount, 0),
        totalRevenue: mockSongs.reduce((sum, song) => sum + (song.price || 0) * song.downloadCount, 0),
        followers: 500 // Mock data
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-navy-900 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
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
              <h1 className="text-3xl font-bold text-white">Artist Dashboard</h1>
              <p className="text-gray-400">Manage your music and profile</p>
            </div>
          </div>
          <button
            onClick={() => {}} // Implement upload functionality
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Song</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-navy-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Music className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400">Total Songs</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.totalSongs}
            </p>
          </div>

          <div className="bg-navy-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Download className="w-5 h-5 text-green-400" />
              <span className="text-gray-400">Total Downloads</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.totalDownloads.toLocaleString()}
            </p>
          </div>

          <div className="bg-navy-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-400">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.totalRevenue.toLocaleString()} UGX
            </p>
          </div>

          <div className="bg-navy-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-gray-400">Followers</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.followers.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Songs List */}
        <div className="bg-navy-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Your Songs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {songs.map(song => (
              <div
                key={song.id}
                className="bg-navy-900 rounded-lg overflow-hidden"
              >
                <img 
                  src={song.coverUrl} 
                  alt={song.title} 
                  className="w-full aspect-square object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-2">{song.title}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      {song.downloadCount.toLocaleString()} downloads
                    </span>
                    <span className="text-yellow-400">
                      {song.price?.toLocaleString()} UGX
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}