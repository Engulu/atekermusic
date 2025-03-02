import { useState, useEffect } from 'react';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebaseService';
import { followArtist, unfollowArtist, isFollowingArtist } from '../services/artistService';

interface ArtistFollowButtonProps {
  artistId: string;
  isFollowing: boolean;
  followersCount: number;
  onFollowChange?: (isFollowing: boolean) => void;
}

export default function ArtistFollowButton({
  artistId,
  isFollowing,
  followersCount,
  onFollowChange
}: ArtistFollowButtonProps) {
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkFollowStatus = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const isFollowing = await isFollowingArtist(currentUser.uid, artistId);
        setFollowing(isFollowing);
      }
    };

    checkFollowStatus();
  }, [artistId]);

  const handleFollowClick = async () => {
    setLoading(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setLoading(false);
        navigate('/signin');
        return;
      }

      try {
        if (following) {
          await unfollowArtist(currentUser.uid, artistId);
        } else {
          await followArtist(currentUser.uid, artistId);
        }
        
        setFollowing(!following);
        onFollowChange?.(!following);
      } catch (error) {
        console.error('Follow operation failed:', error);
        // Optionally show error to user
        throw error;
      }
    } catch (err) {
      console.error('Follow error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleFollowClick}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
          following
            ? 'bg-navy-700 text-gray-300 hover:bg-navy-600'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : following ? (
          <UserMinus className="w-5 h-5" />
        ) : (
          <UserPlus className="w-5 h-5" />
        )}
        <span>{following ? 'Following' : 'Follow'}</span>
        <span className="text-sm">({followersCount.toLocaleString()})</span>
      </button>
    </div>
  );
}