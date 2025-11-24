import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, Song } from '@/lib/supabase';
import { Plus, Music, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Playlist {
  id: string;
  name: string;
  description: string | null;
  song_count?: number;
}

interface AddToPlaylistDialogProps {
  song: Song;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddToPlaylistDialog({ song, open, onOpenChange }: AddToPlaylistDialogProps) {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [selectedPlaylists, setSelectedPlaylists] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open && user) {
      fetchPlaylists();
      checkExistingPlaylists();
    }
  }, [open, user]);

  const fetchPlaylists = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select('*, playlist_songs(count)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const playlistsWithCount = (data || []).map((playlist: any) => ({
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        song_count: playlist.playlist_songs?.[0]?.count || 0,
      }));

      setPlaylists(playlistsWithCount);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkExistingPlaylists = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('playlist_songs')
        .select('playlist_id')
        .eq('song_id', song.id);

      if (error) throw error;

      const existingPlaylistIds = new Set(data?.map((ps: any) => ps.playlist_id) || []);
      setSelectedPlaylists(existingPlaylistIds);
    } catch (error) {
      console.error('Error checking existing playlists:', error);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!user || !newPlaylistName.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }

    setCreating(true);
    try {
      const { data: newPlaylist, error: playlistError } = await supabase
        .from('playlists')
        .insert({
          user_id: user.id,
          name: newPlaylistName.trim(),
          description: newPlaylistDescription.trim() || null,
        })
        .select()
        .single();

      if (playlistError) throw playlistError;

      // Add song to the new playlist
      const { error: songError } = await supabase
        .from('playlist_songs')
        .insert({
          playlist_id: newPlaylist.id,
          song_id: song.id,
          position: 0,
        });

      if (songError) throw songError;

      toast.success(`Created playlist "${newPlaylistName}" and added song`);
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      setShowCreateForm(false);
      fetchPlaylists();
      checkExistingPlaylists();
    } catch (error: any) {
      console.error('Error creating playlist:', error);
      toast.error('Failed to create playlist');
    } finally {
      setCreating(false);
    }
  };

  const togglePlaylist = async (playlistId: string) => {
    if (!user) return;

    const isCurrentlySelected = selectedPlaylists.has(playlistId);

    try {
      if (isCurrentlySelected) {
        // Remove from playlist
        const { error } = await supabase
          .from('playlist_songs')
          .delete()
          .eq('playlist_id', playlistId)
          .eq('song_id', song.id);

        if (error) throw error;

        setSelectedPlaylists((prev) => {
          const newSet = new Set(prev);
          newSet.delete(playlistId);
          return newSet;
        });

        toast.success('Removed from playlist');
      } else {
        // Add to playlist
        const { error } = await supabase
          .from('playlist_songs')
          .insert({
            playlist_id: playlistId,
            song_id: song.id,
            position: 0,
          });

        if (error) throw error;

        setSelectedPlaylists((prev) => new Set(prev).add(playlistId));
        toast.success('Added to playlist');
      }
    } catch (error: any) {
      console.error('Error toggling playlist:', error);
      if (error.code === '23505') {
        toast.error('Song is already in this playlist');
      } else {
        toast.error('Failed to update playlist');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Playlist</DialogTitle>
          <DialogDescription>
            {song.title} - {song.artist?.display_name || 'Unknown Artist'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Create New Playlist Button */}
          {!showCreateForm && (
            <Button
              onClick={() => setShowCreateForm(true)}
              variant="outline"
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Playlist
            </Button>
          )}

          {/* Create Playlist Form */}
          {showCreateForm && (
            <div className="space-y-3 p-4 border border-border rounded-lg bg-muted/30">
              <div>
                <Label htmlFor="playlist-name">Playlist Name</Label>
                <Input
                  id="playlist-name"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="My Awesome Playlist"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="playlist-description">Description (Optional)</Label>
                <Textarea
                  id="playlist-description"
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  placeholder="Describe your playlist..."
                  rows={2}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCreatePlaylist}
                  disabled={creating || !newPlaylistName.trim()}
                  className="flex-1"
                >
                  {creating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Create
                </Button>
                <Button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewPlaylistName('');
                    setNewPlaylistDescription('');
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Existing Playlists */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : playlists.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Music className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No playlists yet. Create one above!</p>
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {playlists.map((playlist) => {
                  const isSelected = selectedPlaylists.has(playlist.id);
                  return (
                    <div
                      key={playlist.id}
                      onClick={() => togglePlaylist(playlist.id)}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-center w-5 h-5">
                        {isSelected ? (
                          <Check className="w-5 h-5 text-primary" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-muted-foreground rounded" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {playlist.name}
                        </p>
                        {playlist.description && (
                          <p className="text-xs text-muted-foreground truncate">
                            {playlist.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {playlist.song_count || 0} song{playlist.song_count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
