import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
} from 'lucide-react';
import { formatDuration } from '@/lib/audioUtils';

export default function AudioPlayer() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    pause,
    resume,
    seek,
    setVolume,
    next,
    previous,
  } = useAudioPlayer();

  if (!currentSong) return null;

  const handleSeek = (value: number[]) => {
    seek(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const toggleMute = () => {
    setVolume(volume > 0 ? 0 : 0.8);
  };

  return (
    <Card className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm">
      <div className="container py-4">
        <div className="flex items-center gap-4">
          {/* Song Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 bg-muted rounded flex-shrink-0 overflow-hidden">
              {currentSong.cover_url ? (
                <img
                  src={currentSong.cover_url}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-card-foreground truncate">
                {currentSong.title}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {currentSong.artist?.display_name || 'Unknown Artist'}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={previous}
                className="h-8 w-8"
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                variant="default"
                size="icon"
                onClick={isPlaying ? pause : resume}
                className="h-10 w-10"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={next}
                className="h-8 w-8"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2 w-full max-w-md">
              <span className="text-xs text-muted-foreground w-10 text-right">
                {formatDuration(Math.floor(currentTime))}
              </span>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-10">
                {formatDuration(Math.floor(duration))}
              </span>
            </div>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="h-8 w-8"
            >
              {volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
