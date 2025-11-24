import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Music, Play, TrendingUp, Sparkles, Disc } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Link } from 'wouter';
import { toast } from 'sonner';

interface FeaturedPlaylist {
  id: string;
  title: string;
  description: string;
  cover_url: string | null;
  playlist_type: string;
  genre: string | null;
  song_count: number;
  display_order: number;
}

export default function FeaturedPlaylists() {
  const [playlists, setPlaylists] = useState<FeaturedPlaylist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedPlaylists();
  }, []);

  const fetchFeaturedPlaylists = async () => {
    try {
      const { data, error } = await supabase.rpc('get_featured_playlists');

      if (error) throw error;

      setPlaylists(data || []);
    } catch (error) {
      console.error('Error fetching featured playlists:', error);
      toast.error('Failed to load featured playlists');
    } finally {
      setLoading(false);
    }
  };

  const getPlaylistIcon = (type: string) => {
    switch (type) {
      case 'auto_trending':
        return <TrendingUp className="w-5 h-5" />;
      case 'auto_new':
        return <Sparkles className="w-5 h-5" />;
      case 'auto_genre':
        return <Music className="w-5 h-5" />;
      default:
        return <Disc className="w-5 h-5" />;
    }
  };

  const getDefaultCover = (type: string, genre: string | null) => {
    // Generate gradient based on playlist type
    const gradients = {
      auto_trending: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      auto_new: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      auto_genre: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      manual: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    };

    return gradients[type as keyof typeof gradients] || gradients.manual;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Featured Playlists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="aspect-square bg-muted rounded-lg mb-4" />
              <div className="h-6 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (playlists.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Featured Playlists</h2>
        <Link href="/playlists">
          <Button variant="ghost">View All</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden">
              {/* Cover Image */}
              <div className="relative aspect-square overflow-hidden">
                {playlist.cover_url ? (
                  <img
                    src={playlist.cover_url}
                    alt={playlist.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      background: getDefaultCover(playlist.playlist_type, playlist.genre),
                    }}
                  >
                    <div className="text-white/90">
                      {getPlaylistIcon(playlist.playlist_type)}
                    </div>
                  </div>
                )}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="rounded-full w-16 h-16 shadow-lg"
                  >
                    <Play className="w-6 h-6 fill-current" />
                  </Button>
                </div>

                {/* Type Badge */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                  <div className="flex items-center gap-1.5 text-white text-xs font-medium">
                    {getPlaylistIcon(playlist.playlist_type)}
                    <span className="capitalize">
                      {playlist.playlist_type.replace('auto_', '').replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">
                  {playlist.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {playlist.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{playlist.song_count} songs</span>
                  {playlist.genre && (
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {playlist.genre}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
