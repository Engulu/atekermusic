import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Upload, User, TrendingUp, Download, Heart, Eye, Plus, BarChart3 } from 'lucide-react';
import { supabase, Song } from '@/lib/supabase';
import { Link } from 'wouter';
import AIAssistant from '@/components/AIAssistant';

function DashboardContent() {
  const { profile } = useAuth();
  const [songs, setSongs] = useState<Song[]>([]);
  const [stats, setStats] = useState({
    totalSongs: 0,
    totalListens: 0,
    totalDownloads: 0,
    totalLikes: 0,
    premiumSales: 0,
    artistEarnings: 0,
    platformShare: 0,
    pendingPayout: 0,
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
        premiumSales: 0,
        artistEarnings: 0,
        platformShare: 0,
        pendingPayout: 0,
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
          <div className="flex gap-3">
            {profile?.role === 'artist' && (
              <Link href="/analytics">
                <Button variant="outline" size="lg">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Analytics
                </Button>
              </Link>
            )}
            <Link href="/download-history">
              <Button variant="outline" size="lg">
                <Download className="w-5 h-5 mr-2" />
                My Downloads
              </Button>
            </Link>
            <Link href="/upload">
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Upload Song
              </Button>
            </Link>
          </div>
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

        {/* Premium Earnings Section */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Premium Earnings Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Total Premium Sales</p>
              <p className="text-2xl font-bold text-card-foreground">
                UGX {stats.premiumSales.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">From premium downloads</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Your Earnings (55%)</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                UGX {stats.artistEarnings.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Artist share</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Platform Share (45%)</p>
              <p className="text-2xl font-bold text-card-foreground">
                UGX {stats.platformShare.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Hosting & operations</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Pending Payout</p>
              <p className="text-2xl font-bold text-primary">
                UGX {stats.pendingPayout.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.pendingPayout >= 50000 ? 'Ready for payout!' : `Need UGX ${(50000 - stats.pendingPayout).toLocaleString()} more`}
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Payout Info:</strong> Earnings are paid monthly via Mobile Money when you reach UGX 50,000. 
              Update your Mobile Money details in your profile to receive payments.
            </p>
          </div>
        </Card>

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
