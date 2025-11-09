import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SongCard from '@/components/SongCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { supabase, Song, GENRES } from '@/lib/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Music() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    fetchSongs();
  }, [selectedGenre, sortBy]);

  const fetchSongs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('songs')
        .select(`
          *,
          artist:profiles(*)
        `)
        .eq('status', 'approved');

      // Apply genre filter
      if (selectedGenre !== 'all') {
        query = query.eq('genre', selectedGenre);
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'most_played':
          query = query.order('listens', { ascending: false });
          break;
        case 'most_downloaded':
          query = query.order('downloads', { ascending: false });
          break;
        case 'most_liked':
          query = query.order('likes', { ascending: false });
          break;
      }

      const { data, error } = await query;

      if (error) throw error;
      setSongs(data || []);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSongs = songs.filter((song) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      song.title.toLowerCase().includes(query) ||
      song.artist?.display_name?.toLowerCase().includes(query) ||
      song.genre?.toLowerCase().includes(query)
    );
  });

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Browse Music</h1>
          <p className="text-muted-foreground">
            Discover and download the best music from Eastern Uganda
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-lg border border-border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search songs, artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Genre Filter */}
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger>
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {GENRES.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="most_played">Most Played</SelectItem>
                <SelectItem value="most_downloaded">Most Downloaded</SelectItem>
                <SelectItem value="most_liked">Most Liked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          {loading ? (
            'Loading...'
          ) : (
            `${filteredSongs.length} song${filteredSongs.length !== 1 ? 's' : ''} found`
          )}
        </div>

        {/* Songs Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading songs...</p>
          </div>
        ) : filteredSongs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No songs found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredSongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
