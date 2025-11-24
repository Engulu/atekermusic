import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import SongCard from '@/components/SongCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, Music, User, FileText, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Song } from '@/lib/supabase';
import { toast } from 'sonner';

interface Artist {
  id: string;
  display_name: string;
  bio: string | null;
  profile_image_url: string | null;
  district: string | null;
}

interface Article {
  id: string;
  title: string;
  body: string;
  category: string;
  cover_url: string | null;
  created_at: string;
}

export default function Search() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'songs' | 'artists' | 'news'>('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    songs: Song[];
    artists: Artist[];
    articles: Article[];
  }>({
    songs: [],
    artists: [],
    articles: [],
  });

  // Get query from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, []);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    setLoading(true);

    try {
      const searchTerm = `%${searchQuery}%`;

      // Search songs
      const { data: songs, error: songsError } = await supabase
        .from('songs')
        .select('*')
        .or(`title.ilike.${searchTerm},artist_name.ilike.${searchTerm},genre.ilike.${searchTerm}`)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(20);

      if (songsError) throw songsError;

      // Search artists
      const { data: artists, error: artistsError } = await supabase
        .from('profiles')
        .select('id, display_name, bio, profile_image_url, district')
        .or(`display_name.ilike.${searchTerm},bio.ilike.${searchTerm},district.ilike.${searchTerm}`)
        .eq('role', 'artist')
        .eq('is_approved', true)
        .order('display_name', { ascending: true })
        .limit(20);

      if (artistsError) throw artistsError;

      // Search news articles
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .or(`title.ilike.${searchTerm},body.ilike.${searchTerm}`)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(20);

      if (articlesError) throw articlesError;

      setResults({
        songs: songs || [],
        artists: artists || [],
        articles: articles || [],
      });
    } catch (error: any) {
      console.error('Search error:', error);
      toast.error('Failed to perform search');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
    // Update URL
    window.history.pushState({}, '', `/search?q=${encodeURIComponent(query)}`);
  };

  const totalResults = results.songs.length + results.artists.length + results.articles.length;

  return (
    <Layout>
      <SEOHead
        title={query ? `Search Results for "${query}"` : 'Search'}
        description="Search for songs, artists, and news on Ateker Music"
        keywords={["search", "find music", "artists", "news", "Eastern Uganda"]}
      />

      <div className="container py-8">
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for songs, artists, or news..."
              className="pl-12 pr-24 h-14 text-lg"
            />
            <Button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Search'
              )}
            </Button>
          </form>
        </div>

        {query && (
          <>
            {/* Results Summary */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Search Results for "{query}"
              </h1>
              <p className="text-muted-foreground">
                Found {totalResults} result{totalResults !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-border overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All ({totalResults})
              </button>
              <button
                onClick={() => setActiveTab('songs')}
                className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'songs'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Music className="w-4 h-4 inline mr-1" />
                Songs ({results.songs.length})
              </button>
              <button
                onClick={() => setActiveTab('artists')}
                className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'artists'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <User className="w-4 h-4 inline mr-1" />
                Artists ({results.artists.length})
              </button>
              <button
                onClick={() => setActiveTab('news')}
                className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'news'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-1" />
                News ({results.articles.length})
              </button>
            </div>

            {/* Results */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : totalResults === 0 ? (
              <div className="text-center py-12">
                <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">No results found</h2>
                <p className="text-muted-foreground">
                  Try different keywords or check your spelling
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Songs */}
                {(activeTab === 'all' || activeTab === 'songs') && results.songs.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <Music className="w-5 h-5" />
                      Songs
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {results.songs.map((song) => (
                        <SongCard key={song.id} song={song} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Artists */}
                {(activeTab === 'all' || activeTab === 'artists') && results.artists.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Artists
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.artists.map((artist) => (
                        <div
                          key={artist.id}
                          onClick={() => setLocation(`/artist/${artist.id}`)}
                          className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            {artist.profile_image_url ? (
                              <img
                                src={artist.profile_image_url}
                                alt={artist.display_name}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="w-8 h-8 text-primary" />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="font-semibold text-card-foreground">{artist.display_name}</h3>
                              {artist.district && (
                                <p className="text-sm text-muted-foreground">{artist.district}</p>
                              )}
                            </div>
                          </div>
                          {artist.bio && (
                            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                              {artist.bio}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* News Articles */}
                {(activeTab === 'all' || activeTab === 'news') && results.articles.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      News
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.articles.map((article) => (
                        <div
                          key={article.id}
                          onClick={() => setLocation(`/news/${article.id}`)}
                          className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        >
                          {article.cover_url && (
                            <img
                              src={article.cover_url}
                              alt={article.title}
                              className="w-full h-48 object-cover"
                            />
                          )}
                          <div className="p-4">
                            <span className="text-xs font-medium text-primary uppercase">
                              {article.category}
                            </span>
                            <h3 className="font-semibold text-card-foreground mt-1 line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                              {article.body.substring(0, 150)}...
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(article.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {!query && (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Search Ateker Music</h2>
            <p className="text-muted-foreground">
              Find your favorite songs, discover new artists, and stay updated with the latest news
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
