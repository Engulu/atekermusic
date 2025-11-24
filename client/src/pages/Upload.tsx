import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload as UploadIcon, Music, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { supabase, GENRES } from '@/lib/supabase';
import { validateMP3, getAudioMetadata } from '@/lib/audioUtils';
import { validateImage, cropAndCompressImage, createPreviewUrl } from '@/lib/imageUtils';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function UploadContent() {
  const { profile } = useAuth();
  const [, setLocation] = useLocation();
  const [uploading, setUploading] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    album: '',
    genre: '',
    language: '',
    release_date: '',
    lyrics: '',
    is_premium: false,
    price: '',
  });

  const handleAudioDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleAudioFile(file);
    }
  }, []);

  const handleAudioFile = async (file: File) => {
    const validation = validateMP3(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    try {
      const metadata = await getAudioMetadata(file);
      setAudioFile(file);
      setAudioDuration(metadata.duration);
      toast.success(`Audio file loaded: ${metadata.sizeFormatted}, ${Math.floor(metadata.duration / 60)}:${(metadata.duration % 60).toString().padStart(2, '0')}`);
    } catch (error) {
      toast.error('Failed to load audio file');
    }
  };

  const handleCoverFile = async (file: File) => {
    const validation = validateImage(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    try {
      // Crop and compress to square, max 1MB
      const processedFile = await cropAndCompressImage(file, 1024, 800);
      setCoverFile(processedFile);
      
      // Create preview
      const preview = createPreviewUrl(processedFile);
      setCoverPreview(preview);
      
      toast.success('Cover image processed successfully');
    } catch (error) {
      toast.error('Failed to process cover image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!audioFile) {
      toast.error('Please select an audio file');
      return;
    }

    if (!formData.title || !formData.genre) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUploading(true);

    try {
      // Upload audio file
      const audioFileName = `${profile?.id}/${Date.now()}_${audioFile.name}`;
      const { error: audioError } = await supabase.storage
        .from('songs')
        .upload(audioFileName, audioFile);

      if (audioError) throw audioError;

      const { data: audioUrlData } = supabase.storage
        .from('songs')
        .getPublicUrl(audioFileName);

      // Upload cover image if provided
      let coverUrl = null;
      if (coverFile) {
        const coverFileName = `${profile?.id}/${Date.now()}_cover.jpg`;
        const { error: coverError } = await supabase.storage
          .from('covers')
          .upload(coverFileName, coverFile);

        if (coverError) throw coverError;

        const { data: coverUrlData } = supabase.storage
          .from('covers')
          .getPublicUrl(coverFileName);
        
        coverUrl = coverUrlData.publicUrl;
      }

      // Validate premium pricing
      if (formData.is_premium && (!formData.price || (formData.price !== '500' && formData.price !== '1000'))) {
        toast.error('Please select a price: UGX 500 or UGX 1,000');
        setUploading(false);
        return;
      }

      // Insert song record
      const { error: dbError } = await supabase.from('songs').insert({
        artist_id: profile?.id,
        title: formData.title,
        album: formData.album || null,
        genre: formData.genre,
        language: formData.language || null,
        release_date: formData.release_date || null,
        lyrics: formData.lyrics || null,
        duration: audioDuration,
        mp3_url: audioUrlData.publicUrl,
        cover_url: coverUrl,
        file_size: audioFile.size,
        is_premium: formData.is_premium,
        price: formData.is_premium ? Number(formData.price) : null,
        status: 'pending',
      });

      if (dbError) throw dbError;

      toast.success('Song uploaded successfully! Awaiting admin approval.');
      setLocation('/dashboard');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload song');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Upload Song</h1>
          <p className="text-muted-foreground">
            Share your music with the world. All uploads are reviewed by our admin team.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Audio File Upload */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Audio File</h3>
            <div
              onDrop={handleAudioDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
              onClick={() => document.getElementById('audio-input')?.click()}
            >
              {audioFile ? (
                <div className="space-y-2">
                  <Music className="w-12 h-12 text-primary mx-auto" />
                  <p className="font-medium text-card-foreground">{audioFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                    {audioDuration && ` • ${Math.floor(audioDuration / 60)}:${(audioDuration % 60).toString().padStart(2, '0')}`}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAudioFile(null);
                      setAudioDuration(null);
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <UploadIcon className="w-12 h-12 text-muted-foreground mx-auto" />
                  <p className="text-card-foreground font-medium">
                    Drop MP3 file here or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Maximum file size: 8MB
                  </p>
                </div>
              )}
            </div>
            <input
              id="audio-input"
              type="file"
              accept="audio/mpeg,audio/mp3"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAudioFile(file);
              }}
            />
          </Card>

          {/* Song Details */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Song Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Song Title *</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter song title"
                />
              </div>

              <div>
                <Label htmlFor="album">Album/EP</Label>
                <Input
                  id="album"
                  value={formData.album}
                  onChange={(e) => setFormData({ ...formData, album: e.target.value })}
                  placeholder="Album or single"
                />
              </div>

              <div>
                <Label htmlFor="genre">Genre *</Label>
                <Select
                  value={formData.genre}
                  onValueChange={(value) => setFormData({ ...formData, genre: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENRES.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  placeholder="e.g., Ateso, English"
                />
              </div>

              <div>
                <Label htmlFor="release_date">Release Date</Label>
                <Input
                  id="release_date"
                  type="date"
                  value={formData.release_date}
                  onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="lyrics">Lyrics (Optional)</Label>
              <Textarea
                id="lyrics"
                value={formData.lyrics}
                onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
                placeholder="Enter song lyrics..."
                rows={6}
              />
            </div>

            {/* Premium/Free Toggle */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-card-foreground">Premium Music</h4>
                  <p className="text-sm text-muted-foreground">
                    Make this a premium download (you earn 55% of the price)
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_premium}
                    onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked, price: e.target.checked ? formData.price : '' })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {formData.is_premium && (
                <div>
                  <Label>Select Price (UGX) *</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        value="500"
                        checked={formData.price === '500'}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-4 h-4 text-primary focus:ring-primary"
                        required={formData.is_premium}
                      />
                      <span className="text-card-foreground font-medium">UGX 500</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        value="1000"
                        checked={formData.price === '1000'}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-4 h-4 text-primary focus:ring-primary"
                        required={formData.is_premium}
                      />
                      <span className="text-card-foreground font-medium">UGX 1,000</span>
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    You'll receive 55% (UGX {formData.price ? Math.floor(Number(formData.price) * 0.55).toLocaleString() : '0'})
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Cover Art */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Cover Art (Optional)
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Image will be automatically cropped to square and compressed to max 1MB
            </p>
            <div className="flex gap-4 items-start">
              {coverPreview && (
                <div className="relative">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2"
                    onClick={() => {
                      setCoverFile(null);
                      setCoverPreview(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div
                className="flex-1 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
                onClick={() => document.getElementById('cover-input')?.click()}
              >
                <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-card-foreground">
                  {coverFile ? 'Change cover art' : 'Upload cover art'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPEG, PNG, or WebP
                </p>
              </div>
            </div>
            <input
              id="cover-input"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleCoverFile(file);
              }}
            />
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="submit" disabled={uploading} size="lg">
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadIcon className="w-5 h-5 mr-2" />
                  Upload Song
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setLocation('/dashboard')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default function Upload() {
  return (
    <ProtectedRoute requireApproval>
      <UploadContent />
    </ProtectedRoute>
  );
}
