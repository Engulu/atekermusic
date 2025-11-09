import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { Song, supabase } from '@/lib/supabase';

interface AudioPlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  play: (song: Song) => void;
  pause: () => void;
  resume: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  next: () => void;
  previous: () => void;
  queue: Song[];
  setQueue: (songs: Song[]) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [queue, setQueue] = useState<Song[]>([]);
  const [hasTrackedListen, setHasTrackedListen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    // Event listeners
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
      
      // Track listen after 30 seconds
      if (!hasTrackedListen && audio.currentTime > 30 && currentSong) {
        trackListen(currentSong.id);
        setHasTrackedListen(true);
      }
    });

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      next();
    });

    audio.addEventListener('play', () => {
      setIsPlaying(true);
    });

    audio.addEventListener('pause', () => {
      setIsPlaying(false);
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const trackListen = async (songId: string) => {
    try {
      await supabase.rpc('increment_listens', { song_id: songId });
    } catch (error) {
      console.error('Error tracking listen:', error);
    }
  };

  const play = (song: Song) => {
    if (!audioRef.current || !song.mp3_url) return;

    setCurrentSong(song);
    setHasTrackedListen(false);
    audioRef.current.src = song.mp3_url;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
  };

  const next = () => {
    if (queue.length === 0 || !currentSong) return;
    
    const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    play(queue[nextIndex]);
  };

  const previous = () => {
    if (queue.length === 0 || !currentSong) return;
    
    const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    play(queue[prevIndex]);
  };

  const value = {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    play,
    pause,
    resume,
    seek,
    setVolume,
    next,
    previous,
    queue,
    setQueue,
  };

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>;
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
}
