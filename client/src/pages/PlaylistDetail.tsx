import { useEffect, useState } from 'react';
import { useParams, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Play, Music, TrendingUp, Sparkles, Disc, Share2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import SongCard from '@/components/SongCard';
import { PageLoadingSkeleton } from '@/components/SkeletonLoaders';

interface Playlist {
  id: string;
  title: string;
  description: string;
  cover_url: string | null;
  playlist_type: string;
  genre: string | null;
  song_count: number;
}

interface PlaylistSong {
  id: string;
  title: string;
  artist_id: string;
  artist_name: string;
  cover_url: string | null;
  audio_url: string;
  genre: string;
  language: string;
  duration: number;
  listens: number;
  downloads: number;
  likes: number;
  position: number;
}

export default function PlaylistDetail() {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [songs, setSongs] = useState<PlaylistSong[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPlaylistDetails();
    }
  }, [id]);

  const fetchPlaylistDetails = async () => {
    try {
      // Fetch playlist info
      const { data: playlistData, error: playlistError } = await supabase
        .from('featured_playlists')
        .select('*')
        .eq('id', id)
        .single();

      if (playlistError) throw playlistError;

      setPlaylist(playlistData);

      // Fetch playlist songs
      const { data: songsData, error: songsError } = await supabase.rpc(
        'get_featured_playlist_songs',
        { playlist_uuid: id }
      );

      if (songsError) throw songsError;

      setSongs(songsData || []);
    } catch (error) {
      console.error('Error fetching playlist:', error);
      toast.error('Failed to load playlist');
    } finally {
      setLoading(false);
    }
  };

  const getPlaylistIcon = (type: string) => {
    switch (type) {
      case 'auto_trending':
        return <TrendingUp className="w-6 h-6" />;
      case 'auto_new':
        return <Sparkles className="w-6 h-6" />;
      case 'auto_genre':
        return <Music className="w-6 h-6" />;
      default:
        return <Disc className="w-6 h-6" />;
    }
  };

  const getDefaultCover = (type: string) => {
    const gradients = {
      auto_trending: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      auto_new: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      auto_genre: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      manual: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    };

    return gradients[type as keyof typeof gradients] || gradients.manual;
  };

  const handleShare = async () => {
    const shareData = {
      title: playlist?.title || 'Playlist',
      text: playlist?.description || '',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return <PageLoadingSkeleton />;
  }

  if (!playlist) {
    return (
      <div className="container py-12">
        <Card className="p-12 text-center">
          <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Playlist Not Found</h2>
          <p className="text-muted-foreground mb-6">
            This playlist doesn't exist or has been removed.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 to-background">
        <div className="container py-12">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Playlist Cover */}
            <div className="w-full md:w-64 flex-shrink-0">
              {playlist.cover_url ? (
                <img
                  src={playlist.cover_url}
                  alt={playlist.title}
                  className="w-full aspect-square rounded-lg shadow-2xl object-cover"
                />
              ) : (
                <div
                  className="w-full aspect-square rounded-lg shadow-2xl flex items-center justify-center"
                  style={{ background: getDefaultCover(playlist.playlist_type) }}
                >
                  <div className="text-white/90">
                    {getPlaylistIcon(playlist.playlist_type)}
                  </div>
                </div>
              )}
            </div>

            {/* Playlist Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                {getPlaylistIcon(playlist.playlist_type)}
                <span className="capitalize">
                  {playlist.playlist_type.replace('auto_', '').replace('_', ' ')} Playlist
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {playlist.title}
              </h1>

              <p className="text-lg text-muted-foreground mb-6">
                {playlist.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="font-medium">{songs.length} songs</span>
                {playlist.genre && (
                  <>
                    <span>•</span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">
                      {playlist.genre}
                    </span>
                  </>
                )}
              </div>

              <div className="flex gap-3">
                <Button size="lg" className="gap-2">
                  <Play className="w-5 h-5 fill-current" />
                  Play All
                </Button>
                <Button size="lg" variant="outline" onClick={handleShare}>
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Songs List */}
      <div className="container py-12">
        {songs.length === 0 ? (
          <Card className="p-12 text-center">
            <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold text-foreground mb-2">No Songs Yet</h3>
            <p className="text-muted-foreground">
              This playlist is empty. Check back later!
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Songs</h2>
            <div className="space-y-4">
              {songs.map((song, index) => (
                <div key={song.id} className="flex items-start gap-4">
                  <div className="w-8 text-center text-muted-foreground font-medium pt-6">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <SongCard
                      song={{
                        id: song.id,
                        artist_id: song.artist_id,
                        title: song.title,
                        genre: song.genre,
                        language: song.language || undefined,
                        duration: song.duration,
                        cover_url: song.cover_url || undefined,
                        mp3_url: song.audio_url,
                        lyrics: undefined,
                        status: 'approved' as const,
                        is_premium: false,
                        likes: song.likes,
                        downloads: song.downloads,
                        listens: song.listens,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        artist: {
                          id: song.artist_id,
                          display_name: song.artist_name,
                          email: '',
                          role: 'artist' as const,
                          is_approved: true,
                          created_at: '',
                          updated_at: '',
                        },
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
