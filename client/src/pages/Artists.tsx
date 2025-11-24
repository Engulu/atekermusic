import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Music, MapPin, Users } from 'lucide-react';
import VerifiedBadge from '@/components/VerifiedBadge';
import { supabase, Profile } from '@/lib/supabase';
import { Link } from 'wouter';

export default function Artists() {
  const [artists, setArtists] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'artist')
        .eq('is_approved', true)
        .order('display_name');

      if (error) throw error;
      setArtists(data || []);
    } catch (error) {
      console.error('Error fetching artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArtists = artists.filter((artist) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      artist.display_name.toLowerCase().includes(query) ||
      artist.district?.toLowerCase().includes(query)
    );
  });

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Artists</h1>
          <p className="text-muted-foreground">
            Discover talented artists from Eastern Uganda
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          {loading ? (
            'Loading...'
          ) : (
            `${filteredArtists.length} artist${filteredArtists.length !== 1 ? 's' : ''} found`
          )}
        </div>

        {/* Artists Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading artists...</p>
          </div>
        ) : filteredArtists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No artists found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtists.map((artist) => (
              <Link key={artist.id} href={`/artist/${artist.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    {artist.avatar_url ? (
                      <img
                        src={artist.avatar_url}
                        alt={artist.display_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="w-16 h-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-card-foreground mb-1 truncate flex items-center gap-2">
                      <span className="truncate">{artist.display_name}</span>
                      {artist.is_verified && <VerifiedBadge size="sm" />}
                    </h3>
                    {artist.district && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3" />
                        {artist.district}
                      </p>
                    )}
                    {artist.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {artist.bio}
                      </p>
                    )}
                    <Button variant="outline" size="sm" className="w-full">
                      <Music className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
