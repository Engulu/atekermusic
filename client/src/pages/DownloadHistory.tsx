import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Download, Music, Calendar, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface DownloadRecord {
  id: string;
  song_id: string;
  song_title: string;
  artist_name: string;
  cover_url: string | null;
  downloaded_at: string;
}

export default function DownloadHistory() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      toast.error('Please log in to view your download history');
      setLocation('/login');
      return;
    }

    fetchDownloadHistory();
  }, [user]);

  const fetchDownloadHistory = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_user_download_history', {
        user_uuid: user.id,
        result_limit: 100,
      });

      if (error) {
        // If function doesn't exist yet, fallback to direct query
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('download_history')
          .select(`
            id,
            song_id,
            downloaded_at,
            songs:song_id (
              title,
              cover_url,
              artist:profiles!artist_id (
                display_name
              )
            )
          `)
          .eq('user_id', user.id)
          .order('downloaded_at', { ascending: false })
          .limit(100);

        if (fallbackError) throw fallbackError;

        // Transform fallback data to match expected format
        const transformedData = (fallbackData || []).map((record: any) => ({
          id: record.id,
          song_id: record.song_id,
          song_title: record.songs?.title || 'Unknown Song',
          artist_name: record.songs?.artist?.display_name || 'Unknown Artist',
          cover_url: record.songs?.cover_url || null,
          downloaded_at: record.downloaded_at,
        }));

        setDownloads(transformedData);
      } else {
        setDownloads(data || []);
      }
    } catch (error) {
      console.error('Error fetching download history:', error);
      toast.error('Failed to load download history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <Layout>
      <SEOHead
        title="Download History"
        description="View your download history on Ateker Music"
        keywords={['download history', 'my downloads', 'music history']}
      />

      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Download className="w-8 h-8 text-primary" />
            Download History
          </h1>
          <p className="text-muted-foreground">
            View all the songs you've downloaded
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : downloads.length === 0 ? (
          <Card className="p-12 text-center">
            <Download className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No Downloads Yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Start exploring and downloading your favorite songs!
            </p>
            <Button onClick={() => setLocation('/music')}>
              Browse Music
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Stats */}
            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Downloads</p>
                  <p className="text-3xl font-bold text-foreground">{downloads.length}</p>
                </div>
                <Download className="w-12 h-12 text-primary/20" />
              </div>
            </Card>

            {/* Download List */}
            <div className="grid grid-cols-1 gap-4">
              {downloads.map((download) => (
                <Card
                  key={download.id}
                  className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setLocation(`/song/${download.song_id}`)}
                >
                  <div className="flex items-center gap-4">
                    {/* Cover Image */}
                    {download.cover_url ? (
                      <img
                        src={download.cover_url}
                        alt={download.song_title}
                        className="w-16 h-16 rounded object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Music className="w-8 h-8 text-primary/40" />
                      </div>
                    )}

                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-card-foreground truncate">
                        {download.song_title}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {download.artist_name}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(download.downloaded_at)}
                      </p>
                    </div>

                    {/* Download Icon */}
                    <Download className="w-5 h-5 text-primary flex-shrink-0" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
