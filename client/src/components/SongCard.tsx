import { Song, supabase } from '@/lib/supabase';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { Play, Download, Heart, Share2, Eye, Music } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { formatDuration, formatFileSize } from '@/lib/supabase';
import { Link } from 'wouter';

interface SongCardProps {
  song: Song;
}

export default function SongCard({ song }: SongCardProps) {
  const { play, currentSong, isPlaying } = useAudioPlayer();
  const isCurrentSong = currentSong?.id === song.id;

  const handleDownload = async () => {
    if (!song.mp3_url) return;
    
    try {
      // Track download
      await supabase.rpc('increment_downloads', { song_id: song.id });
      
      // Download file
      const link = document.createElement('a');
      link.href = song.mp3_url;
      link.download = `${song.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading song:', error);
    }
  };

  const handleLike = async () => {
    try {
      await supabase.rpc('increment_likes', { song_id: song.id });
    } catch (error) {
      console.error('Error liking song:', error);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: song.title,
      text: `Listen to ${song.title} by ${song.artist?.display_name || 'Unknown Artist'}`,
      url: window.location.origin + `/song/${song.id}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareData.url);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Cover Art */}
        <div className="relative w-full sm:w-32 h-32 flex-shrink-0 bg-muted rounded-lg overflow-hidden group">
          {song.cover_url ? (
            <img
              src={song.cover_url}
              alt={song.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          
          {/* Play Button Overlay */}
          <button
            onClick={() => play(song)}
            className={`absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${isCurrentSong && isPlaying ? 'bg-primary/20' : ''}`}
          >
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground ml-1" />
            </div>
          </button>
        </div>

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg text-card-foreground truncate">
                {song.title}
              </h3>
              <Link href={`/artist/${song.artist_id}`}>
                <a className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {song.artist?.display_name || 'Unknown Artist'}
                </a>
              </Link>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
            {song.genre && (
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
                {song.genre}
              </span>
            )}
            {song.duration && (
              <span className="flex items-center gap-1">
                <Music className="w-3 h-3" />
                {formatDuration(song.duration)}
              </span>
            )}
            {song.language && (
              <span>{song.language}</span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {song.listens.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {song.likes.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {song.downloads.toLocaleString()}
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleDownload}
              className="flex-1 sm:flex-none"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
              {song.file_size && (
                <span className="ml-2 text-xs opacity-80">
                  ({formatFileSize(song.file_size)})
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLike}
            >
              <Heart className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
