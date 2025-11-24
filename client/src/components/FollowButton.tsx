import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { UserPlus, UserCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface FollowButtonProps {
  userId: string;
  userName?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  showIcon?: boolean;
}

export default function FollowButton({
  userId,
  userName,
  variant = 'default',
  size = 'default',
  showIcon = true,
}: FollowButtonProps) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (user && userId) {
      checkFollowStatus();
    } else {
      setChecking(false);
    }
  }, [user, userId]);

  const checkFollowStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('is_following', {
        p_follower_id: user.id,
        p_following_id: userId,
      });

      if (error) throw error;
      setIsFollowing(data || false);
    } catch (error) {
      console.error('Error checking follow status:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      toast.error('Please log in to follow artists');
      return;
    }

    if (user.id === userId) {
      toast.error("You can't follow yourself");
      return;
    }

    setLoading(true);

    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase.rpc('unfollow_user', {
          p_following_id: userId,
        });

        if (error) throw error;

        setIsFollowing(false);
        toast.success(`Unfollowed ${userName || 'artist'}`);
      } else {
        // Follow
        const { error } = await supabase.rpc('follow_user', {
          p_following_id: userId,
        });

        if (error) throw error;

        setIsFollowing(true);
        toast.success(`Following ${userName || 'artist'}!`);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error('Failed to update follow status');
    } finally {
      setLoading(false);
    }
  };

  // Don't show button for own profile
  if (user?.id === userId) {
    return null;
  }

  // Don't show button if not logged in
  if (!user) {
    return null;
  }

  if (checking) {
    return (
      <Button variant={variant} size={size} disabled>
        Loading...
      </Button>
    );
  }

  return (
    <Button
      variant={isFollowing ? 'outline' : variant}
      size={size}
      onClick={handleFollow}
      disabled={loading}
      className="gap-2"
    >
      {showIcon && (
        isFollowing ? (
          <UserCheck className="w-4 h-4" />
        ) : (
          <UserPlus className="w-4 h-4" />
        )
      )}
      {loading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
}
