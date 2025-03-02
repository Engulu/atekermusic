import { useState } from 'react';
import { Search, Music2 } from 'lucide-react';
import type { Song } from '../types';

const genres = [
  'All',
  // Teso Gospel Music
  'Teso Gospel',
  'Teso Worship',
  'Teso Praise',
  // Teso Secular Music
  'Teso Secular',
  'Modern Akogo',
  'Akogo',
  'Ajosi',
  'Drama',
  // Modern Teso
  'Teso Afrobeats',
  'Teso Pop',
  'Teso Hip Hop',
  // Ugandan Music
  'Kadongo Kamu',
  'Band Music',
  'Afrobeats',
  'Dancehall',
  'Hip Hop',
  'RnB',
  'Gospel',
  'Urban Gospel'
];

export default function MusicPage() {
  const [selectedGenre, setSelectedGenre] = useState('All');
  
  const songs: Song[] = [
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
    }
  ];

  return (
    <main className="min-h-screen bg-navy-900 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Discover Music</h1>
            <p className="text-gray-400">Find and enjoy the best Teso music</p>
          </div>

          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder="Search music..."
              className="w-full px-12 py-3 bg-navy-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Teso Gospel</h2>
            <div className="flex overflow-x-auto gap-2 pb-4">
              {genres.slice(1, 4).map(genre => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-6 py-2 rounded-full whitespace-nowrap transition ${
                    selectedGenre === genre
                      ? 'bg-blue-500 text-white'
                      : 'bg-navy-800 text-gray-400 hover:bg-navy-700'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Teso Secular</h2>
            <div className="flex overflow-x-auto gap-2 pb-4">
              {genres.slice(4, 9).map(genre => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-6 py-2 rounded-full whitespace-nowrap transition ${
                    selectedGenre === genre
                      ? 'bg-blue-500 text-white'
                      : 'bg-navy-800 text-gray-400 hover:bg-navy-700'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Ugandan Music</h2>
            <div className="flex overflow-x-auto gap-2 pb-4">
              {genres.slice(9).map(genre => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-6 py-2 rounded-full whitespace-nowrap transition ${
                    selectedGenre === genre
                      ? 'bg-blue-500 text-white'
                      : 'bg-navy-800 text-gray-400 hover:bg-navy-700'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {songs.map(song => (
            <div
              key={song.id}
              className="bg-navy-800 rounded-lg overflow-hidden hover:scale-[1.02] transition group"
            >
              <div className="relative">
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-full aspect-square object-cover"
                />
                <button className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <Music2 className="w-12 h-12 text-white" />
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-white mb-1">{song.title}</h3>
                <p className="text-gray-400 text-sm">{song.artistName}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}