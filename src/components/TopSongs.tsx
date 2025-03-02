import { Play, Download, Heart, Crown } from 'lucide-react';
import type { Song } from '../types';

const topSongs: Song[] = [
  {
    id: '1',
    title: 'Akello',
    artistId: '1',
    artistName: 'Peter Eddy',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070',
    songUrl: '#',
    downloadCount: 15234,
    playCount: 25678,
    likeCount: 8901,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Etop Lokaala',
    artistId: '2',
    artistName: 'Sarah Apio',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070',
    songUrl: '#',
    downloadCount: 12345,
    playCount: 22789,
    likeCount: 7901,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Emali',
    artistId: '3',
    artistName: 'John Otim',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070',
    songUrl: '#',
    downloadCount: 11456,
    playCount: 20890,
    likeCount: 6123,
    createdAt: new Date().toISOString()
  }
].sort((a, b) => b.downloadCount - a.downloadCount);

export default function TopSongs() {
  return (
    <section className="py-16 bg-gradient-to-b from-navy-800 to-navy-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-yellow-400" />
            <h2 className="text-3xl font-bold text-white">Top 10 Downloads</h2>
          </div>
          <a href="/songs" className="text-blue-400 hover:text-blue-300">
            View All Songs →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topSongs.map((song, index) => (
            <div
              key={song.id}
              className="bg-navy-800 rounded-lg overflow-hidden hover:scale-[1.02] transition group relative"
            >
              <div className="absolute top-4 left-4 z-10">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-navy-900 font-bold">
                  {index + 1}
                </div>
              </div>
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
                      <span>{song.playCount.toLocaleString()}</span>
                    </button>
                    <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
                      <Download className="w-4 h-4" />
                      <span>{song.downloadCount.toLocaleString()}</span>
                    </button>
                  </div>
                  <button className="flex items-center gap-1 text-red-400 hover:text-red-300">
                    <Heart className="w-4 h-4" />
                    <span>{song.likeCount.toLocaleString()}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}