import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  genre: string;
  followers: number;
}

export default function ArtistsPage() {
  const artists: Artist[] = [
    {
      id: '1',
      name: 'Peter Eddy',
      imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070',
      genre: 'Traditional',
      followers: 5678
    },
    {
      id: '2',
      name: 'Sarah Apio',
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070',
      genre: 'Gospel',
      followers: 4321
    },
    {
      id: '3',
      name: 'John Otim',
      imageUrl: 'https://images.unsplash.com/photo-1534385842125-8c9ad0bd123c?q=80&w=2070',
      genre: 'Hip Hop',
      followers: 3456
    }
  ];

  return (
    <main className="min-h-screen bg-navy-900 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Featured Artists</h1>
            <p className="text-gray-400">Discover talented Teso musicians</p>
          </div>

          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder="Search artists..."
              className="w-full px-12 py-3 bg-navy-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artists.map(artist => (
            <Link
              key={artist.id}
              to={`/artists/${artist.id}`}
              className="bg-navy-800 rounded-lg overflow-hidden hover:scale-[1.02] transition group"
            >
              <div className="relative">
                <img
                  src={artist.imageUrl}
                  alt={artist.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-white text-lg mb-1">{artist.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{artist.genre}</p>
                <p className="text-blue-400 text-sm">{artist.followers.toLocaleString()} followers</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}