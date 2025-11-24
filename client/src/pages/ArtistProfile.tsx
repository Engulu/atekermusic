import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import SongCard from '@/components/SongCard';
import VerifiedBadge from '@/components/VerifiedBadge';
import ShareButtons from '@/components/ShareButtons';
import FollowButton from '@/components/FollowButton';
import ActivityFeed from '@/components/ActivityFeed';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase, Profile, Song } from '@/lib/supabase';
import { Music, MapPin, Calendar, Globe, Phone, Mail, Users, Download, Heart, Play, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ArtistProfile() {
  const [, params] = useRoute('/artist/:id');
  const artistId = params?.id;

  const [artist, setArtist] = useState<Profile | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSongs: 0,
    totalDownloads: 0,
    totalLikes: 0,
    totalListens: 0,
  });

  useEffect(() => {
    if (artistId) {
      fetchArtistData();
    }
  }, [artistId]);

  const fetchArtistData = async () => {
    if (!artistId) return;

    setLoading(true);
    try {
      // Fetch artist profile
      const { data: artistData, error: artistError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', artistId)
        .single();

      if (artistError) throw artistError;
      setArtist(artistData);

      // Fetch artist's songs
      const { data: songsData, error: songsError } = await supabase
        .from('songs')
        .select(`
          *,
          artist:profiles!artist_id(*)
        `)
        .eq('artist_id', artistId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (songsError) throw songsError;
      setSongs(songsData || []);

      // Calculate stats
      if (songsData) {
        const totalDownloads = songsData.reduce((sum, song) => sum + (song.downloads || 0), 0);
        const totalLikes = songsData.reduce((sum, song) => sum + (song.likes || 0), 0);
        const totalListens = songsData.reduce((sum, song) => sum + (song.listens || 0), 0);

        setStats({
          totalSongs: songsData.length,
          totalDownloads,
          totalLikes,
          totalListens,
        });
      }
    } catch (error) {
      console.error('Error fetching artist data:', error);
      toast.error('Failed to load artist profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-12 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!artist) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Artist Not Found</h1>
          <p className="text-muted-foreground">The artist you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title={`${artist.display_name} - Artist Profile`}
        description={artist.bio || `Discover music by ${artist.display_name} on Ateker Music`}
        keywords={[artist.display_name, 'artist', 'Eastern Uganda music', artist.district || '']}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-background border-b border-border">
        <div className="container py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {artist.avatar_url ? (
                <img
                  src={artist.avatar_url}
                  alt={artist.display_name}
                  className="w-48 h-48 rounded-full object-cover border-4 border-primary/20 shadow-xl"
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20 shadow-xl">
                  <Users className="w-24 h-24 text-primary/40" />
                </div>
              )}
            </div>

            {/* Artist Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-bold text-foreground">
                  {artist.display_name}
                </h1>
                {artist.is_verified && <VerifiedBadge size="lg" />}
              </div>

              {/* Location */}
              {artist.district && (
                <p className="text-lg text-muted-foreground flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5" />
                  {[artist.district, artist.sub_county, artist.parish, artist.village]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4 text-center">
                  <Music className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-card-foreground">{stats.totalSongs}</p>
                  <p className="text-sm text-muted-foreground">Songs</p>
                </Card>
                <Card className="p-4 text-center">
                  <Download className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-card-foreground">
                    {stats.totalDownloads.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Downloads</p>
                </Card>
                <Card className="p-4 text-center">
                  <Heart className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-card-foreground">
                    {stats.totalLikes.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Likes</p>
                </Card>
                <Card className="p-4 text-center">
                  <Play className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-card-foreground">
                    {stats.totalListens.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Plays</p>
                </Card>
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-3 mb-6">
                {artist.website && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={artist.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
                {artist.phone && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${artist.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      {artist.phone}
                    </a>
                  </Button>
                )}
                {artist.email && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${artist.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </a>
                  </Button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <FollowButton
                  userId={artist.id}
                  userName={artist.display_name}
                  size="lg"
                />
                <ShareButtons
                  title={`${artist.display_name} on Ateker Music`}
                  text={`Check out ${artist.display_name}'s music on Ateker Music`}
                  url={window.location.href}
                  variant="outline"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container py-8">
        <Tabs defaultValue="songs" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="songs">
              <Music className="w-4 h-4 mr-2" />
              Songs ({stats.totalSongs})
            </TabsTrigger>
            <TabsTrigger value="about">
              <Users className="w-4 h-4 mr-2" />
              About
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Music className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Songs Tab */}
          <TabsContent value="songs">
            {songs.length === 0 ? (
              <div className="text-center py-12">
                <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No songs yet</h3>
                <p className="text-muted-foreground">
                  This artist hasn't uploaded any songs yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {songs.map((song) => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-card-foreground mb-4">About {artist.display_name}</h2>
              
              {artist.bio ? (
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                  {artist.bio}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  No biography available for this artist.
                </p>
              )}

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-semibold text-card-foreground mb-3">Artist Information</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground mb-1">Member Since</dt>
                    <dd className="text-card-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(artist.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </dd>
                  </div>
                  {artist.district && (
                    <div>
                      <dt className="text-muted-foreground mb-1">Location</dt>
                      <dd className="text-card-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {artist.district}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-muted-foreground mb-1">Total Songs</dt>
                    <dd className="text-card-foreground flex items-center gap-2">
                      <Music className="w-4 h-4" />
                      {stats.totalSongs}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground mb-1">Verification Status</dt>
                    <dd className="text-card-foreground flex items-center gap-2">
                      {artist.is_verified ? (
                        <>
                          <VerifiedBadge size="sm" showTooltip={false} />
                          <span>Verified Artist</span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Not verified</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">Recent Activity</h2>
              <ActivityFeed userId={artist.id} limit={20} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
