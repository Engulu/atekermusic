import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Upload, User, TrendingUp, Download, Heart, Eye, Plus } from 'lucide-react';
import { supabase, Song } from '@/lib/supabase';
import { Link } from 'wouter';

function DashboardContent() {
  const { profile } = useAuth();
  const [songs, setSongs] = useState<Song[]>([]);
  const [stats, setStats] = useState({
    totalSongs: 0,
    totalListens: 0,
    totalDownloads: 0,
    totalLikes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchSongs();
      fetchStats();
    }
  }, [profile]);

  const fetchSongs = async () => {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('artist_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSongs(data || []);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('listens, downloads, likes')
        .eq('artist_id', profile?.id)
        .eq('status', 'approved');

      if (error) throw error;

      const totals = data?.reduce(
        (acc, song) => ({
          totalListens: acc.totalListens + song.listens,
          totalDownloads: acc.totalDownloads + song.downloads,
          totalLikes: acc.totalLikes + song.likes,
        }),
        { totalListens: 0, totalDownloads: 0, totalLikes: 0 }
      );

      setStats({
        totalSongs: data?.length || 0,
        ...totals,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
      approved: 'bg-green-500/10 text-green-600 dark:text-green-400',
      rejected: 'bg-red-500/10 text-red-600 dark:text-red-400',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Welcome, {profile?.display_name}!
            </h1>
            <p className="text-muted-foreground">Manage your music and profile</p>
          </div>
          <Link href="/upload">
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Upload Song
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Songs</p>
                <p className="text-3xl font-bold text-card-foreground">{stats.totalSongs}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Music className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Listens</p>
                <p className="text-3xl font-bold text-card-foreground">
                  {stats.totalListens.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Eye className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Downloads</p>
                <p className="text-3xl font-bold text-card-foreground">
                  {stats.totalDownloads.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Download className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Likes</p>
                <p className="text-3xl font-bold text-card-foreground">
                  {stats.totalLikes.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="songs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="songs">My Songs</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="songs" className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading songs...</p>
              </div>
            ) : songs.length === 0 ? (
              <Card className="p-12 text-center">
                <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  No songs yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start sharing your music with the world
                </p>
                <Link href="/upload">
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Your First Song
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {songs.map((song) => (
                  <Card key={song.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-card-foreground">
                            {song.title}
                          </h3>
                          {getStatusBadge(song.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {song.genre} • {song.album || 'Single'}
                        </p>
                        {song.admin_note && song.status === 'rejected' && (
                          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                            <p className="text-sm text-red-600 dark:text-red-400">
                              <strong>Admin Note:</strong> {song.admin_note}
                            </p>
                          </div>
                        )}
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {song.listens}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            {song.downloads}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {song.likes}
                          </span>
                        </div>
                      </div>
                      {song.status === 'pending' || song.status === 'rejected' ? (
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      ) : null}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-card-foreground mb-4">
                Profile Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-card-foreground">Artist Name</label>
                  <p className="text-muted-foreground">{profile?.display_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-card-foreground">Email</label>
                  <p className="text-muted-foreground">{profile?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-card-foreground">Phone</label>
                  <p className="text-muted-foreground">{profile?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-card-foreground">Location</label>
                  <p className="text-muted-foreground">
                    {profile?.district || 'Not provided'}
                    {profile?.sub_county && `, ${profile.sub_county}`}
                  </p>
                </div>
                {profile?.bio && (
                  <div>
                    <label className="text-sm font-medium text-card-foreground">Bio</label>
                    <p className="text-muted-foreground">{profile.bio}</p>
                  </div>
                )}
                <Button variant="outline">Edit Profile</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute requireApproval>
      <DashboardContent />
    </ProtectedRoute>
  );
}
