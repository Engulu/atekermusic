import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Music, Heart, Download, UserPlus, ListMusic } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'wouter';
import { toast } from 'sonner';
import VerifiedBadge from './VerifiedBadge';

interface Activity {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  is_verified: boolean;
  activity_type: string;
  related_id: string | null;
  metadata: any;
  created_at: string;
}

interface ActivityFeedProps {
  userId?: string; // If provided, show only this user's activity
  showFollowing?: boolean; // If true, show activity from followed users
  limit?: number;
}

export default function ActivityFeed({
  userId,
  showFollowing = false,
  limit = 20,
}: ActivityFeedProps) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [userId, showFollowing, user]);

  const fetchActivities = async () => {
    try {
      setLoading(true);

      let data, error;

      if (showFollowing && user) {
        // Get activity from followed users
        const result = await supabase.rpc('get_following_activity', {
          p_user_id: user.id,
          p_limit: limit,
        });
        data = result.data;
        error = result.error;
      } else if (userId) {
        // Get activity for specific user
        const result = await supabase.rpc('get_user_activity', {
          p_user_id: userId,
          p_limit: limit,
        });
        data = result.data;
        error = result.error;

        // Fetch user info for each activity
        if (data) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, display_name, avatar_url, is_verified')
            .eq('id', userId)
            .single();

          if (profile) {
            data = data.map((activity: any) => ({
              ...activity,
              user_id: profile.id,
              user_name: profile.display_name,
              user_avatar: profile.avatar_url,
              is_verified: profile.is_verified,
            }));
          }
        }
      } else {
        // Get all recent activity (public feed)
        const result = await supabase
          .from('activity_feed')
          .select(`
            *,
            profiles:user_id (
              id,
              display_name,
              avatar_url,
              is_verified
            )
          `)
          .order('created_at', { ascending: false })
          .limit(limit);

        data = result.data?.map((item: any) => ({
          id: item.id,
          user_id: item.profiles.id,
          user_name: item.profiles.display_name,
          user_avatar: item.profiles.avatar_url,
          is_verified: item.profiles.is_verified,
          activity_type: item.activity_type,
          related_id: item.related_id,
          metadata: item.metadata,
          created_at: item.created_at,
        }));
        error = result.error;
      }

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activity feed');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'song_upload':
        return <Music className="w-5 h-5 text-primary" />;
      case 'song_like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'song_download':
        return <Download className="w-5 h-5 text-blue-500" />;
      case 'follow_artist':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'playlist_create':
        return <ListMusic className="w-5 h-5 text-purple-500" />;
      default:
        return <Music className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getActivityText = (activity: Activity) => {
    const metadata = activity.metadata || {};

    switch (activity.activity_type) {
      case 'song_upload':
        return (
          <>
            uploaded a new song{' '}
            <span className="font-semibold">{metadata.song_title}</span>
            {metadata.genre && (
              <span className="text-muted-foreground"> · {metadata.genre}</span>
            )}
          </>
        );
      case 'song_like':
        return 'liked a song';
      case 'song_download':
        return 'downloaded a song';
      case 'follow_artist':
        return 'followed an artist';
      case 'playlist_create':
        return (
          <>
            created a playlist{' '}
            {metadata.playlist_name && (
              <span className="font-semibold">{metadata.playlist_name}</span>
            )}
          </>
        );
      default:
        return 'did something';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Music className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground">
          {showFollowing
            ? 'No activity from people you follow yet'
            : 'No activity yet'}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <Card key={activity.id} className="p-4 hover:bg-muted/30 transition-colors">
          <div className="flex gap-3">
            {/* User Avatar */}
            <Link href={`/artist/${activity.user_id}`}>
              <Avatar className="w-10 h-10 cursor-pointer">
                <AvatarImage src={activity.user_avatar || undefined} />
                <AvatarFallback>
                  {activity.user_name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Link>

            {/* Activity Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <Link href={`/artist/${activity.user_id}`}>
                    <span className="font-medium text-foreground hover:underline cursor-pointer">
                      {activity.user_name}
                    </span>
                  </Link>
                  {activity.is_verified && (
                    <span className="inline-block ml-1">
                      <VerifiedBadge size="sm" />
                    </span>
                  )}
                  <span className="text-muted-foreground ml-2">
                    {getActivityText(activity)}
                  </span>
                </div>
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.activity_type)}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {getTimeAgo(activity.created_at)}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
