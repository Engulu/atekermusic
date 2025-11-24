import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search, TrendingUp, Music, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import SEOHead from "@/components/SEOHead";
import { DEFAULT_SEO } from "@/lib/seo";
import { supabase, Song } from "@/lib/supabase";
import SongCard from "@/components/SongCard";
import { toast } from "sonner";
import { useEffect } from "react";
import FeaturedPlaylists from "@/components/FeaturedPlaylists";
// import AdBanner from "@/components/AdBanner"; // Commented out until database is configured

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);

  useEffect(() => {
    fetchTrendingSongs();
  }, []);

  const fetchTrendingSongs = async () => {
    try {
      // Try to use the trending algorithm function
      const { data, error } = await supabase.rpc('get_trending_songs', {
        days_back: 30,
        result_limit: 20
      });

      if (error) {
        // Fallback: just get recent approved songs if function doesn't exist
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('songs')
          .select(`
            *,
            artist:profiles!artist_id(*)
          `)
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(20);

        if (fallbackError) throw fallbackError;
        setTrendingSongs(fallbackData || []);
      } else {
        setTrendingSongs(data || []);
      }
    } catch (error) {
      console.error('Error fetching trending songs:', error);
      // Silently fail - just show empty state
    } finally {
      setLoadingTrending(false);
    }
  };

  return (
    <Layout>
      <SEOHead {...DEFAULT_SEO.home} />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Discover <span className="text-primary">Eastern Uganda</span> Music
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Stream and download the best of Teso, Bukedi, Busoga, and beyond. Free music for everyone.
            </p>
            
            {/* Search Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
                }
              }}
              className="relative max-w-2xl mx-auto"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for songs, artists, or genres..."
                className="pl-12 pr-4 py-6 text-lg rounded-xl"
              />
            </form>

            {/* Quick Genre Chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {['Akogo', 'Gospel', 'Ajosi', 'Afrobeat', 'Kadodi', 'Reggae'].map((genre) => (
                <Button
                  key={genre}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => setLocation(`/search?q=${encodeURIComponent(genre)}`)}
                >
                  {genre}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement Banner - Disabled until database is configured */}
      {/* <section className="container py-8">
        <AdBanner type="featured" />
      </section> */}

      {/* Featured Playlists Section */}
      <section className="py-16">
        <div className="container">
          <FeaturedPlaylists />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Music className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">Free Downloads</h3>
              <p className="text-muted-foreground">
                Download your favorite songs in high quality MP3 format, completely free.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">Trending Music</h3>
              <p className="text-muted-foreground">
                Discover what's hot in Eastern Uganda with our trending charts and playlists.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">Support Artists</h3>
              <p className="text-muted-foreground">
                Help local artists grow by streaming, downloading, and sharing their music.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Placeholder sections for trending content */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-foreground mb-8">Top 20 Trending Songs</h2>
          {loadingTrending ? (
            <div className="text-center text-muted-foreground py-12">
              <p>Loading trending songs...</p>
            </div>
          ) : trendingSongs.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No trending songs yet. Be the first to upload!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingSongs.map((song: Song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
