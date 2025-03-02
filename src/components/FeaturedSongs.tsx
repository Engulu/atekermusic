import { Play, Download, Heart } from 'lucide-react';
import type { Song } from '../types';

interface SongCardProps {
  song: Song;
}

function SongCard({ song }: SongCardProps) {
  return (
    <div className="bg-navy-800 rounded-lg overflow-hidden hover:scale-[1.02] transition">
      <img 
        src={song.coverUrl} 
        alt={song.title} 
        className="w-full aspect-square object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg text-white mb-1">{song.title}</h3>
        <p className="text-gray-400 text-sm mb-4">{song.artistName}</p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
              <Play className="w-4 h-4" />
              <span>{song.playCount}</span>
            </button>
            <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
              <Download className="w-4 h-4" />
              <span>{song.downloadCount}</span>
            </button>
          </div>
          <button className="flex items-center gap-1 text-red-400 hover:text-red-300">
            <Heart className="w-4 h-4" />
            <span>{song.likeCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedSongs() {
  const featuredSongs: Song[] = [
    {
      id: '1',
      title: 'Akello',
      artistId: '1',
      artistName: 'Peter Eddy',
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070',
      songUrl: '#',
      downloadCount: 1234,
      playCount: 5678,
      likeCount: 890,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Etop Lokaala',
      artistId: '2',
      artistName: 'Sarah Apio',
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070',
      songUrl: '#',
      downloadCount: 2345,
      playCount: 6789,
      likeCount: 901,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Emali',
      artistId: '3',
      artistName: 'John Otim',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070',
      songUrl: '#',
      downloadCount: 3456,
      playCount: 7890,
      likeCount: 123,
      createdAt: new Date().toISOString()
    }
  ];

  return (
    <section className="py-16 bg-navy-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-8">Featured Songs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSongs.map(song => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </div>
    </section>
  );
}