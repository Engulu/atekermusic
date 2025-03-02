import { Search } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative min-h-[500px] flex items-center justify-center bg-gradient-to-b from-navy-900 to-navy-800 text-white">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10" 
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070)'
        }}
      />
      
      <div className="relative container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Discover Teso & Ugandan Music
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Your ultimate destination for the best Eastern Ugandan music, news, and culture.
          Download, stream, and stay connected with your favorite artists.
        </p>

        <div className="max-w-2xl mx-auto relative">
          <input
            type="text"
            placeholder="Search for songs, artists, or news..."
            className="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-400 hover:text-blue-300">
            <Search className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}