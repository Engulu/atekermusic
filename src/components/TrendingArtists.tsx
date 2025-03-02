import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TrendingArtist {
  id: string;
  name: string;
  imageUrl: string;
  genre: string;
  monthlyListeners: number;
  isVerified: boolean;
}

const trendingArtists: TrendingArtist[] = [
  {
    id: '1',
    name: 'Peter Eddy',
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070',
    genre: 'Traditional',
    monthlyListeners: 25678,
    isVerified: true
  },
  {
    id: '2',
    name: 'Sarah Apio',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070',
    genre: 'Gospel',
    monthlyListeners: 20321,
    isVerified: true
  },
  {
    id: '3',
    name: 'John Otim',
    imageUrl: 'https://images.unsplash.com/photo-1534385842125-8c9ad0bd123c?q=80&w=2070',
    genre: 'Hip Hop',
    monthlyListeners: 18456,
    isVerified: true
  },
  {
    id: '4',
    name: 'Mary Akello',
    imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=2070',
    genre: 'Teso Pop',
    monthlyListeners: 15789,
    isVerified: true
  }
].sort((a, b) => b.monthlyListeners - a.monthlyListeners);

export default function TrendingArtists() {
  return (
    <section className="py-16 bg-navy-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-purple-400" />
            <h2 className="text-3xl font-bold text-white">Trending Artists</h2>
          </div>
          <Link to="/artists" className="text-blue-400 hover:text-blue-300">
            View All Artists →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingArtists.map(artist => (
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
                <p className="text-purple-400 text-sm">
                  {artist.monthlyListeners.toLocaleString()} monthly listeners
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}