import { Play, Download, Heart, Music4 } from 'lucide-react';
import type { Song } from '../types';

const topAkogoSongs: Song[] = [
  {
    id: '4',
    title: 'Akogo Master',
    artistId: '4',
    artistName: 'Opio James',
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070',
    songUrl: '#',
    downloadCount: 9876,
    playCount: 15678,
    likeCount: 4321,
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Traditional Vibes',
    artistId: '5',
    artistName: 'Akol Mary',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070',
    songUrl: '#',
    downloadCount: 8765,
    playCount: 14567,
    likeCount: 3210,
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    title: 'Modern Akogo',
    artistId: '6',
    artistName: 'Okello Peter',
    coverUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2070',
    songUrl: '#',
    downloadCount: 7654,
    playCount: 13456,
    likeCount: 2109,
    createdAt: new Date().toISOString()
  }
].sort((a, b) => b.downloadCount - a.downloadCount);

export default function TopAkogoSongs() {
  return (
    <section className="py-16 bg-navy-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Music4 className="w-6 h-6 text-green-400" />
            <h2 className="text-3xl font-bold text-white">Top Akogo Songs</h2>
          </div>
          <a href="/songs" className="text-blue-400 hover:text-blue-300">
            View All Akogo Songs →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topAkogoSongs.map((song, index) => (
            <div
              key={song.id}
              className="bg-navy-800 rounded-lg overflow-hidden hover:scale-[1.02] transition group relative"
            >
              <div className="absolute top-4 left-4 z-10">
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-navy-900 font-bold">
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