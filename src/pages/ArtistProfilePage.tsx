import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Music, Users, Calendar, Heart } from 'lucide-react';
import ArtistFollowButton from '../components/ArtistFollowButton';
import type { Song } from '../types';

interface ArtistStats {
  totalPlays: number;
  totalDownloads: number;
  totalLikes: number;
  followers: number;
}

export default function ArtistProfilePage() {
  const { id } = useParams();
  const [artist] = useState({
    id,
    name: 'Peter Eddy',
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070',
    bio: 'Award-winning Teso artist known for blending traditional Akogo with modern sounds.',
    genre: 'Traditional / Modern Fusion',
    location: 'Soroti, Uganda',
    verified: true,
    followers: 5000
  });
  const [isFollowing, setIsFollowing] = useState(false);
  const [songs] = useState<Song[]>([
    {
      id: '1',
      title: 'Akello',
      artistId: id!,
      artistName: 'Peter Eddy',
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070',
      songUrl: '#',
      downloadCount: 15234,
      playCount: 25678,
      likeCount: 8901,
      createdAt: new Date().toISOString(),
      price: 2000,
      isPaid: true
    },
    {
      id: '2',
      title: 'Etop Lokaala',
      artistId: id!,
      artistName: 'Peter Eddy',
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070',
      songUrl: '#',
      downloadCount: 12345,
      playCount: 22789,
      likeCount: 7901,
      createdAt: new Date().toISOString(),
      price: 2000,
      isPaid: true
    }
  ]);

  const stats: ArtistStats = {
    totalPlays: 250000,
    totalDownloads: 50000,
    totalLikes: 15000,
    followers: 5000
  };


  return (
    <main className="min-h-screen bg-navy-900 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Artist Header */}
        <div className="bg-navy-800 rounded-lg overflow-hidden mb-8">
          <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500" />
          <div className="p-6 relative">
            <img
              src={artist.imageUrl}
              alt={artist.name}
              className="w-32 h-32 rounded-full border-4 border-navy-800 absolute -top-16"
            />
            <div className="ml-36">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{artist.name}</h1>
                {artist.verified && (
                  <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                    Verified Artist
                  </span>
                )}
              </div>
              <p className="text-gray-400 mb-4">{artist.bio}</p>
              <div className="flex items-center gap-4">
                <ArtistFollowButton
                  artistId={artist.id}
                  isFollowing={isFollowing}
                  followersCount={artist.followers}
                  onFollowChange={setIsFollowing}
                />
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span>{artist.genre}</span>
                <span>•</span>
                <span>{artist.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-navy-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Music className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400">Total Plays</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.totalPlays.toLocaleString()}
            </p>
          </div>
          <div className="bg-navy-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-green-400" />
              <span className="text-gray-400">Downloads</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.totalDownloads.toLocaleString()}
            </p>
          </div>
          <div className="bg-navy-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="text-gray-400">Likes</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.totalLikes.toLocaleString()}
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

        {/* Songs */}
        <div className="bg-navy-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Songs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {songs.map(song => (
              <div
                key={song.id}
                className="bg-navy-900 rounded-lg overflow-hidden hover:scale-[1.02] transition group"
              >
                <img 
                  src={song.coverUrl} 
                  alt={song.title} 
                  className="w-full aspect-square object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-white mb-1">{song.title}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{song.playCount.toLocaleString()} plays</span>
                    <span className="text-gray-400">{song.downloadCount.toLocaleString()} downloads</span>
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