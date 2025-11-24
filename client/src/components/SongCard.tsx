import { useState } from 'react';
import { Song, supabase } from '@/lib/supabase';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { Play, Pause, Download, Heart, Eye, Music, Clock, FileText, ListPlus } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { formatDuration, formatFileSize } from '@/lib/supabase';
import { Link } from 'wouter';
import { toast } from 'sonner';
import PremiumPurchaseDialog from './PremiumPurchaseDialog';
import ShareButtons from './ShareButtons';
import VerifiedBadge from './VerifiedBadge';
import LyricsDialog from './LyricsDialog';
import AddToPlaylistDialog from './AddToPlaylistDialog';

interface SongCardProps {
  song: Song;
}

export default function SongCard({ song }: SongCardProps) {
  const { play, pause, currentSong, isPlaying } = useAudioPlayer();
  const isCurrentSong = currentSong?.id === song.id;
  const isCurrentlyPlaying = isCurrentSong && isPlaying;
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [showLyricsDialog, setShowLyricsDialog] = useState(false);
  const [showPlaylistDialog, setShowPlaylistDialog] = useState(false);

  const handleDownload = async () => {
    if (!song.mp3_url) return;
    
    // Check if song is premium
    if (song.is_premium) {
      setShowPurchaseDialog(true);
      return;
    }
    
    try {
      // Track download count
      await supabase.rpc('increment_downloads', { song_id: song.id });
      
      // Track in download history if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('download_history').insert({
          user_id: user.id,
          song_id: song.id,
        });
      }
      
      // Download file
      const link = document.createElement('a');
      link.href = song.mp3_url;
      link.download = `${song.title} - ${song.artist?.display_name || 'Unknown'}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download started!');
    } catch (error) {
      console.error('Error downloading song:', error);
      toast.error('Failed to download song');
    }
  };

  const handleLike = async () => {
    try {
      await supabase.rpc('increment_likes', { song_id: song.id });
      toast.success('Added to favorites!');
    } catch (error) {
      console.error('Error liking song:', error);
      toast.error('Failed to like song');
    }
  };



  const togglePlay = () => {
    if (isCurrentlyPlaying) {
      pause();
    } else {
      play(song);
    }
  };

  return (
    <>
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30">
      <div className="flex flex-col sm:flex-row gap-0 sm:gap-6">
        {/* Cover Art */}
        <div className="relative w-full sm:w-48 h-48 flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden group">
          {song.cover_url ? (
            <img
              src={song.cover_url}
              alt={song.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="w-16 h-16 text-primary/40" />
            </div>
          )}
          
          {/* Play Button Overlay */}
          <button
            onClick={togglePlay}
            className={`absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
              isCurrentlyPlaying ? 'opacity-100 bg-black/70' : ''
            }`}
            aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
          >
            <div className={`w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg transform ${
              isCurrentlyPlaying ? 'scale-110' : 'group-hover:scale-110'
            } transition-transform duration-200`}>
              {isCurrentlyPlaying ? (
                <Pause className="w-8 h-8 text-primary-foreground fill-primary-foreground" />
              ) : (
                <Play className="w-8 h-8 text-primary-foreground fill-primary-foreground ml-1" />
              )}
            </div>
          </button>

          {/* Genre Badge */}
          {song.genre && (
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-semibold rounded-full backdrop-blur-sm">
                {song.genre}
              </span>
            </div>
          )}
          
          {/* Premium Badge */}
          {song.is_premium && (
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 bg-yellow-500/90 text-black text-xs font-bold rounded-full backdrop-blur-sm flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                PREMIUM
              </span>
            </div>
          )}
        </div>

        {/* Song Info */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          {/* Title and Artist */}
          <div className="mb-4">
            <h3 className="font-bold text-xl text-card-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
              {song.title}
            </h3>
            <Link href={`/artist/${song.artist_id}`}>
              <a className="text-base text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2">
                {song.artist?.display_name || 'Unknown Artist'}
                {song.artist?.is_verified && <VerifiedBadge size="sm" />}
              </a>
            </Link>
          </div>

          {/* Metadata Tags */}
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
            {song.duration && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-muted/50 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                {formatDuration(song.duration)}
              </span>
            )}
            {song.language && (
              <span className="px-2.5 py-1 bg-muted/50 rounded-full">
                {song.language}
              </span>
            )}
            {song.file_size && (
              <span className="px-2.5 py-1 bg-muted/50 rounded-full">
                {formatFileSize(song.file_size)}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-5">
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="font-medium">{song.listens.toLocaleString()}</span>
            </span>
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="font-medium">{song.likes.toLocaleString()}</span>
            </span>
            <span className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="font-medium">{song.downloads.toLocaleString()}</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Download Button - Prominent and Long */}
            <Button
              onClick={handleDownload}
              size="lg"
              className={`flex-1 sm:flex-[2] h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200 ${
                song.is_premium ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : ''
              }`}
            >
              <Download className="w-5 h-5 mr-2.5" />
              {song.is_premium ? (
                <>
                  Download - UGX {song.premium_price?.toLocaleString() || '0'}
                </>
              ) : (
                'Free Download'
              )}
            </Button>

            {/* Secondary Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                onClick={handleLike}
                className="flex-1 sm:flex-none h-12 px-4 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all duration-200"
                aria-label="Like"
              >
                <Heart className="w-5 h-5" />
              </Button>
              {song.lyrics && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowLyricsDialog(true)}
                  className="flex-1 sm:flex-none h-12 px-4 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all duration-200"
                  aria-label="View Lyrics"
                >
                  <FileText className="w-5 h-5" />
                </Button>
              )}
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowPlaylistDialog(true)}
                className="flex-1 sm:flex-none h-12 px-4 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all duration-200"
                aria-label="Add to Playlist"
              >
                <ListPlus className="w-5 h-5" />
              </Button>
              <ShareButtons
                title={song.title}
                text={`Listen to ${song.title} by ${song.artist?.display_name || 'Unknown Artist'} on Ateker Music`}
                url={`${window.location.origin}/song/${song.id}`}
                variant="outline"
                size="lg"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>

    {/* Premium Purchase Dialog */}
    <PremiumPurchaseDialog
      song={song}
      open={showPurchaseDialog}
      onOpenChange={setShowPurchaseDialog}
    />

    {/* Lyrics Dialog */}
    <LyricsDialog
      song={song}
      open={showLyricsDialog}
      onOpenChange={setShowLyricsDialog}
    />

    {/* Add to Playlist Dialog */}
    <AddToPlaylistDialog
      song={song}
      open={showPlaylistDialog}
      onOpenChange={setShowPlaylistDialog}
    />
    </>
  );
}
