import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Song } from '@/lib/supabase';
import { Music, FileText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LyricsDialogProps {
  song: Song;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LyricsDialog({ song, open, onOpenChange }: LyricsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Lyrics
          </DialogTitle>
          <DialogDescription>
            {song.title} - {song.artist?.display_name || 'Unknown Artist'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          {song.lyrics ? (
            <div className="space-y-4">
              {/* Song Info */}
              <div className="flex items-center gap-4 pb-4 border-b border-border">
                {song.cover_url ? (
                  <img
                    src={song.cover_url}
                    alt={song.title}
                    className="w-16 h-16 rounded object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded bg-primary/10 flex items-center justify-center">
                    <Music className="w-8 h-8 text-primary/40" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-foreground">{song.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {song.artist?.display_name || 'Unknown Artist'}
                  </p>
                  {song.genre && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {song.genre} {song.language && `• ${song.language}`}
                    </p>
                  )}
                </div>
              </div>

              {/* Lyrics Content */}
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed">
                  {song.lyrics}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Lyrics Available
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Lyrics for this song haven't been added yet. Check back later!
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
