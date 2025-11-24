import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Music,
  CheckCircle,
  XCircle,
  Eye,
  TrendingUp,
  Download,
  Heart,
} from 'lucide-react';
import { supabase, Profile, Song } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

function AdminContent() {
  const [pendingArtists, setPendingArtists] = useState<Profile[]>([]);
  const [pendingSongs, setPendingSongs] = useState<Song[]>([]);
  const [stats, setStats] = useState({
    totalArtists: 0,
    totalSongs: 0,
    totalListens: 0,
    totalDownloads: 0,
    totalPremiumRevenue: 0,
    platformRevenue: 0,
    artistPayouts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch pending artists
      const { data: artists } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'artist')
        .eq('is_approved', false)
        .order('created_at', { ascending: false });

      setPendingArtists(artists || []);

      // Fetch pending songs
      const { data: songs } = await supabase
        .from('songs')
        .select(`
          *,
          artist:profiles(*)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      setPendingSongs(songs || []);

      // Fetch stats
      const { data: allArtists } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'artist')
        .eq('is_approved', true);

      const { data: allSongs } = await supabase
        .from('songs')
        .select('listens, downloads')
        .eq('status', 'approved');

      const totals = allSongs?.reduce(
        (acc, song) => ({
          totalListens: acc.totalListens + song.listens,
          totalDownloads: acc.totalDownloads + song.downloads,
        }),
        { totalListens: 0, totalDownloads: 0 }
      );

      setStats({
        totalArtists: allArtists?.length || 0,
        totalSongs: allSongs?.length || 0,
        totalListens: totals?.totalListens || 0,
        totalDownloads: totals?.totalDownloads || 0,
        totalPremiumRevenue: 0,
        platformRevenue: 0,
        artistPayouts: 0,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const approveArtist = async (artistId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_approved: true })
        .eq('id', artistId);

      if (error) throw error;

      // Log approval
      await supabase.from('approvals').insert({
        target_table: 'profiles',
        target_id: artistId,
        action: 'approved',
      });

      toast.success('Artist approved successfully');
      fetchData();
    } catch (error: any) {
      console.error('Error approving artist:', error);
      toast.error(error.message || 'Failed to approve artist');
    }
  };

  const rejectArtist = async (artistId: string) => {
    try {
      // For now, we'll just mark as rejected by not approving
      // In a real app, you might want to delete or add a rejected status
      await supabase.from('approvals').insert({
        target_table: 'profiles',
        target_id: artistId,
        action: 'rejected',
        note: 'Artist registration rejected',
      });

      toast.success('Artist rejected');
      fetchData();
    } catch (error: any) {
      console.error('Error rejecting artist:', error);
      toast.error(error.message || 'Failed to reject artist');
    }
  };

  const approveSong = async (songId: string) => {
    try {
      const { error } = await supabase
        .from('songs')
        .update({ status: 'approved', admin_note: null })
        .eq('id', songId);

      if (error) throw error;

      // Log approval
      await supabase.from('approvals').insert({
        target_table: 'songs',
        target_id: songId,
        action: 'approved',
      });

      toast.success('Song approved successfully');
      fetchData();
    } catch (error: any) {
      console.error('Error approving song:', error);
      toast.error(error.message || 'Failed to approve song');
    }
  };

  const rejectSong = async () => {
    if (!selectedSong) return;

    try {
      const { error } = await supabase
        .from('songs')
        .update({ status: 'rejected', admin_note: rejectionNote })
        .eq('id', selectedSong.id);

      if (error) throw error;

      // Log rejection
      await supabase.from('approvals').insert({
        target_table: 'songs',
        target_id: selectedSong.id,
        action: 'rejected',
        note: rejectionNote,
      });

      toast.success('Song rejected');
      setShowRejectDialog(false);
      setSelectedSong(null);
      setRejectionNote('');
      fetchData();
    } catch (error: any) {
      console.error('Error rejecting song:', error);
      toast.error(error.message || 'Failed to reject song');
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage artists, songs, and content</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Artists</p>
                <p className="text-3xl font-bold text-card-foreground">{stats.totalArtists}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

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
        </div>

        {/* Premium Revenue Analytics */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-green-500/5 to-green-500/10 border-green-500/20">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            Premium Revenue Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card p-6 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-2">Total Premium Revenue</p>
              <p className="text-3xl font-bold text-card-foreground">
                UGX {stats.totalPremiumRevenue.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">From all premium downloads</p>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-muted-foreground">Platform (45%)</span>
                  <span className="text-sm font-semibold text-card-foreground">
                    UGX {stats.platformRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Artists (55%)</span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    UGX {stats.artistPayouts.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-2">Platform Revenue (45%)</p>
              <p className="text-3xl font-bold text-primary">
                UGX {stats.platformRevenue.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Hosting, operations & payment processing</p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Used for server costs, bandwidth, payment gateway fees, and platform maintenance
                </p>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-2">Artist Payouts (55%)</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                UGX {stats.artistPayouts.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Total earnings distributed to artists</p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Paid monthly via Mobile Money when artists reach UGX 50,000 minimum
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Revenue Split Model
              </h3>
              <p className="text-sm text-muted-foreground">
                Artists receive <strong className="text-green-600 dark:text-green-400">55%</strong> of premium sales, 
                while the platform retains <strong className="text-primary">45%</strong> for operations. 
                This ensures sustainable platform growth while fairly compensating creators.
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Payout Information
              </h3>
              <p className="text-sm text-muted-foreground">
                Artists can request payouts monthly when they reach UGX 50,000. 
                Payments are processed via Mobile Money (MTN/Airtel) within 5-7 business days.
              </p>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="songs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="songs">
              Pending Songs
              {pendingSongs.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingSongs.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="artists">
              Pending Artists
              {pendingArtists.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingArtists.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="songs" className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : pendingSongs.length === 0 ? (
              <Card className="p-12 text-center">
                <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  No pending songs
                </h3>
                <p className="text-muted-foreground">All songs have been reviewed</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingSongs.map((song) => (
                  <Card key={song.id} className="p-6">
                    <div className="flex gap-4">
                      {/* Cover */}
                      <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                        {song.cover_url ? (
                          <img
                            src={song.cover_url}
                            alt={song.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Music className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-card-foreground mb-1">
                          {song.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          by {song.artist?.display_name}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
                            {song.genre}
                          </span>
                          {song.album && <span>{song.album}</span>}
                          {song.language && <span>{song.language}</span>}
                        </div>
                        {song.lyrics && (
                          <details className="text-sm text-muted-foreground">
                            <summary className="cursor-pointer hover:text-card-foreground">
                              View lyrics
                            </summary>
                            <p className="mt-2 whitespace-pre-wrap">{song.lyrics}</p>
                          </details>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          onClick={() => approveSong(song.id)}
                          className="whitespace-nowrap"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedSong(song);
                            setShowRejectDialog(true);
                          }}
                          className="whitespace-nowrap"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                        {song.mp3_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(song.mp3_url!, '_blank')}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="artists" className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : pendingArtists.length === 0 ? (
              <Card className="p-12 text-center">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  No pending artists
                </h3>
                <p className="text-muted-foreground">All artist registrations have been reviewed</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingArtists.map((artist) => (
                  <Card key={artist.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-card-foreground mb-2">
                          {artist.display_name}
                        </h3>
                        <div className="space-y-1 text-sm text-muted-foreground mb-3">
                          <p>Email: {artist.email}</p>
                          {artist.phone && <p>Phone: {artist.phone}</p>}
                          {artist.nin && <p>NIN: {artist.nin}</p>}
                          {artist.district && (
                            <p>
                              Location: {artist.district}
                              {artist.sub_county && `, ${artist.sub_county}`}
                              {artist.parish && `, ${artist.parish}`}
                            </p>
                          )}
                        </div>
                        {artist.bio && (
                          <p className="text-sm text-muted-foreground">{artist.bio}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" onClick={() => approveArtist(artist.id)}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectArtist(artist.id)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Song</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this song. The artist will see this message.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={rejectSong} disabled={!rejectionNote}>
                Reject Song
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

export default function Admin() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminContent />
    </ProtectedRoute>
  );
}
