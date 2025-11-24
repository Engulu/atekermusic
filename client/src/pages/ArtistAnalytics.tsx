import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import {
  TrendingUp,
  Download,
  Heart,
  Music,
  DollarSign,
  Users,
  BarChart3,
  Calendar,
  Smartphone,
  Monitor,
  Tablet,
  Download as DownloadIcon,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Link } from 'wouter';
import { DashboardStatsSkeleton } from '@/components/SkeletonLoaders';

interface AnalyticsSummary {
  total_plays: number;
  total_downloads: number;
  total_likes: number;
  total_songs: number;
  total_earnings: number;
  avg_completion_rate: number;
  unique_listeners: number;
  top_song_id: string | null;
  top_song_title: string | null;
  top_song_plays: number | null;
}

interface TopSong {
  song_id: string;
  title: string;
  total_plays: number;
  total_downloads: number;
  total_likes: number;
  avg_completion_rate: number;
}

interface Demographics {
  device_type: string;
  play_count: number;
  percentage: number;
}

interface Earnings {
  total_earnings: number;
  pending_earnings: number;
  paid_earnings: number;
  total_sales: number;
}

export default function ArtistAnalytics() {
  const { user, profile } = useAuth();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [topSongs, setTopSongs] = useState<TopSong[]>([]);
  const [demographics, setDemographics] = useState<Demographics[]>([]);
  const [earnings, setEarnings] = useState<Earnings | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30); // days

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, timeRange]);

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch analytics summary
      const { data: summaryData, error: summaryError } = await supabase.rpc(
        'get_artist_analytics',
        {
          p_artist_id: user.id,
          p_days_back: timeRange,
        }
      );

      if (summaryError) throw summaryError;
      if (summaryData && summaryData.length > 0) {
        setSummary(summaryData[0]);
      }

      // Fetch top songs
      const { data: topSongsData, error: topSongsError } = await supabase.rpc(
        'get_artist_top_songs',
        {
          p_artist_id: user.id,
          p_limit: 10,
        }
      );

      if (topSongsError) throw topSongsError;
      setTopSongs(topSongsData || []);

      // Fetch demographics
      const { data: demoData, error: demoError } = await supabase.rpc(
        'get_listener_demographics',
        {
          p_artist_id: user.id,
          p_days_back: timeRange,
        }
      );

      if (demoError) throw demoError;
      setDemographics(demoData || []);

      // Fetch earnings
      const { data: earningsData, error: earningsError } = await supabase.rpc(
        'calculate_artist_earnings',
        {
          p_artist_id: user.id,
        }
      );

      if (earningsError) throw earningsError;
      if (earningsData && earningsData.length > 0) {
        setEarnings(earningsData[0]);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return 'UGX 0';
    return `UGX ${amount.toLocaleString()}`;
  };

  if (profile?.role !== 'artist') {
    return (
      <Layout>
        <div className="container py-12">
          <Card className="p-12 text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Artist Access Only
            </h2>
            <p className="text-muted-foreground mb-6">
              Analytics dashboard is only available for artist accounts.
            </p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track your music performance and earnings
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2">
            {[7, 30, 90, 365].map((days) => (
              <Button
                key={days}
                variant={timeRange === days ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(days)}
              >
                {days === 365 ? '1 Year' : `${days} Days`}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <DashboardStatsSkeleton />
        ) : (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total Plays</span>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {formatNumber(summary?.total_plays)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatNumber(summary?.unique_listeners)} unique listeners
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Downloads</span>
                  <Download className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {formatNumber(summary?.total_downloads)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Across {summary?.total_songs || 0} songs
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total Likes</span>
                  <Heart className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {formatNumber(summary?.total_likes)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {summary?.avg_completion_rate?.toFixed(1) || 0}% completion rate
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total Earnings</span>
                  <DollarSign className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {formatCurrency(earnings?.total_earnings)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(earnings?.pending_earnings)} pending
                </p>
              </Card>
            </div>

            {/* Top Song Highlight */}
            {summary?.top_song_title && (
              <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <Music className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">
                      Your Top Performing Song
                    </p>
                    <h3 className="text-2xl font-bold text-foreground mb-1">
                      {summary.top_song_title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {formatNumber(summary.top_song_plays)} plays in the last {timeRange} days
                    </p>
                  </div>
                  <Link href={`/dashboard`}>
                    <Button>View Details</Button>
                  </Link>
                </div>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Top Songs */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Top Performing Songs
                </h3>
                <div className="space-y-4">
                  {topSongs.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No songs yet. Upload your first song!
                    </p>
                  ) : (
                    topSongs.map((song, index) => (
                      <div
                        key={song.song_id}
                        className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground line-clamp-1">
                            {song.title}
                          </p>
                          <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                            <span>{formatNumber(song.total_plays)} plays</span>
                            <span>{formatNumber(song.total_downloads)} downloads</span>
                            <span>{formatNumber(song.total_likes)} likes</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">
                            {song.avg_completion_rate?.toFixed(0) || 0}%
                          </p>
                          <p className="text-xs text-muted-foreground">completion</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Listener Demographics */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Listener Demographics
                </h3>
                <div className="space-y-4">
                  {demographics.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No listener data yet
                    </p>
                  ) : (
                    demographics.map((demo) => (
                      <div key={demo.device_type} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getDeviceIcon(demo.device_type)}
                            <span className="font-medium text-foreground capitalize">
                              {demo.device_type || 'Unknown'}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {demo.percentage?.toFixed(1)}% ({formatNumber(demo.play_count)} plays)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${demo.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            {/* Earnings Breakdown */}
            {earnings && earnings.total_earnings > 0 && (
              <Card className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Earnings Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 rounded-lg bg-green-500/10">
                    <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(earnings.total_earnings)}
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-yellow-500/10">
                    <p className="text-sm text-muted-foreground mb-1">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {formatCurrency(earnings.pending_earnings)}
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-blue-500/10">
                    <p className="text-sm text-muted-foreground mb-1">Paid Out</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(earnings.paid_earnings)}
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-purple-500/10">
                    <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {earnings.total_sales}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button variant="outline" className="gap-2">
                    <DownloadIcon className="w-4 h-4" />
                    Export Report
                  </Button>
                </div>
              </Card>
            )}

            {/* No Data State */}
            {!loading && summary?.total_plays === 0 && (
              <Card className="p-12 text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  No Analytics Data Yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Upload your first song and start building your audience!
                </p>
                <Link href="/upload">
                  <Button size="lg">
                    <Music className="w-4 h-4 mr-2" />
                    Upload Your First Song
                  </Button>
                </Link>
              </Card>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
