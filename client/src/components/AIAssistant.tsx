import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Sparkles, Loader2, Info } from 'lucide-react';
import { generateBiography, isAIAvailable, AI_GUIDELINES } from '@/lib/aiService';
import { toast } from 'sonner';
import { Alert, AlertDescription } from './ui/alert';

interface AIAssistantProps {
  artistName: string;
  genre?: string;
  onBiographyGenerated: (biography: string) => void;
}

export default function AIAssistant({ artistName, genre, onBiographyGenerated }: AIAssistantProps) {
  const [open, setOpen] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedBio, setGeneratedBio] = useState('');

  const handleGenerate = async () => {
    if (!keywords.trim()) {
      toast.error('Please provide some keywords about yourself');
      return;
    }

    setGenerating(true);
    try {
      const biography = await generateBiography(keywords, artistName, genre);
      setGeneratedBio(biography);
      toast.success('Biography generated successfully!');
    } catch (error) {
      toast.error('Failed to generate biography. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleUse = () => {
    if (generatedBio) {
      onBiographyGenerated(generatedBio);
      toast.success('Biography added to your profile!');
      setOpen(false);
      setKeywords('');
      setGeneratedBio('');
    }
  };

  const aiAvailable = isAIAvailable();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Sparkles className="w-4 h-4" />
          AI Biography Generator
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {AI_GUIDELINES.biography.title}
          </DialogTitle>
          <DialogDescription>
            {AI_GUIDELINES.biography.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* AI Status */}
          {!aiAvailable && (
            <Alert>
              <Info className="w-4 h-4" />
              <AlertDescription>
                AI is in template mode. A basic biography will be generated from your keywords.
              </AlertDescription>
            </Alert>
          )}

          {/* Tips */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm font-medium text-card-foreground mb-2">Tips for best results:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {AI_GUIDELINES.biography.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Keywords Input */}
          <div className="space-y-2">
            <Label htmlFor="keywords">Your Keywords</Label>
            <Textarea
              id="keywords"
              placeholder="Example: Gospel artist, started singing in church choir, released 3 albums, won Best New Artist 2023, passionate about uplifting messages..."
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Provide key information about your musical journey, achievements, and style
            </p>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={generating || !keywords.trim()}
            className="w-full"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Biography...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Biography
              </>
            )}
          </Button>

          {/* Generated Biography */}
          {generatedBio && (
            <div className="space-y-2">
              <Label>Generated Biography</Label>
              <div className="bg-muted/30 p-4 rounded-lg border border-border">
                <p className="text-sm text-card-foreground whitespace-pre-wrap">
                  {generatedBio}
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUse} className="flex-1">
                  Use This Biography
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setGeneratedBio('')}
                  className="flex-1"
                >
                  Generate Again
                </Button>
              </div>
            </div>
          )}

          {/* Guidelines */}
          <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg">
            <p className="text-xs font-medium text-amber-900 dark:text-amber-100 mb-1">
              AI Usage Guidelines:
            </p>
            <ul className="text-xs text-amber-800 dark:text-amber-200 space-y-0.5">
              {AI_GUIDELINES.restrictions.map((restriction, index) => (
                <li key={index}>• {restriction}</li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
