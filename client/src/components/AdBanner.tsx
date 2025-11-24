import { useState, useEffect } from 'react';
import { Advertisement, supabase } from '@/lib/supabase';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface AdBannerProps {
  type?: 'banner' | 'sidebar' | 'featured';
  limit?: number;
}

export default function AdBanner({ type = 'banner', limit = 1 }: AdBannerProps) {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchAds();
  }, [type]);

  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
      }, 10000); // Rotate every 10 seconds

      return () => clearInterval(interval);
    }
  }, [ads.length]);

  const fetchAds = async () => {
    try {
      const now = new Date().toISOString();
      
      let query = supabase
        .from('advertisements')
        .select('*')
        .eq('status', 'active')
        .eq('display_on_homepage', true)
        .lte('start_date', now)
        .gte('end_date', now)
        .order('display_priority', { ascending: false });

      if (type) {
        query = query.eq('ad_type', type);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      if (data && data.length > 0) {
        setAds(data);
        // Track impressions for all ads
        data.forEach(ad => trackImpression(ad.id));
      }
    } catch (error: any) {
      // Silently fail if table doesn't exist yet (during initial setup)
      // Only log if it's not a "relation does not exist" error
      if (!error?.message?.includes('relation') && !error?.message?.includes('does not exist')) {
        console.error('Error fetching ads:', error);
      }
    }
  };

  const trackImpression = async (adId: string) => {
    try {
      await supabase.rpc('increment_ad_impressions', { ad_id: adId });
    } catch (error: any) {
      // Silently fail if function doesn't exist yet
      if (!error?.message?.includes('function') && !error?.message?.includes('does not exist')) {
        console.error('Error tracking ad impression:', error);
      }
    }
  };

  const trackClick = async (ad: Advertisement) => {
    try {
      await supabase.rpc('increment_ad_clicks', { ad_id: ad.id });
      if (ad.link_url) {
        window.open(ad.link_url, '_blank');
      }
    } catch (error: any) {
      // Silently fail if function doesn't exist yet
      if (!error?.message?.includes('function') && !error?.message?.includes('does not exist')) {
        console.error('Error tracking ad click:', error);
      }
    }
  };

  if (dismissed || ads.length === 0) {
    return null;
  }

  const currentAd = ads[currentAdIndex];

  if (type === 'banner') {
    return (
      <div className="relative w-full bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg overflow-hidden shadow-lg mb-8">
        <div className="relative">
          <img
            src={currentAd.image_url}
            alt={currentAd.title}
            className="w-full h-32 md:h-48 object-cover cursor-pointer"
            onClick={() => trackClick(currentAd)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
            <div className="text-white">
              <h3 className="text-lg md:text-2xl font-bold mb-1">{currentAd.title}</h3>
              {currentAd.description && (
                <p className="text-sm md:text-base text-white/90 line-clamp-2">{currentAd.description}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
            onClick={() => setDismissed(true)}
          >
            <X className="w-4 h-4" />
          </Button>
          {ads.length > 1 && (
            <div className="absolute bottom-2 right-2 flex gap-1">
              {ads.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentAdIndex ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (type === 'sidebar') {
    return (
      <div className="relative bg-card rounded-lg overflow-hidden shadow-lg border border-border">
        <div className="relative">
          <img
            src={currentAd.image_url}
            alt={currentAd.title}
            className="w-full h-64 object-cover cursor-pointer"
            onClick={() => trackClick(currentAd)}
          />
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2">{currentAd.title}</h3>
            {currentAd.description && (
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{currentAd.description}</p>
            )}
            {currentAd.link_url && (
              <Button
                onClick={() => trackClick(currentAd)}
                className="w-full"
                size="sm"
              >
                Learn More
              </Button>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
            onClick={() => setDismissed(true)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (type === 'featured') {
    return (
      <div className="relative w-full bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl overflow-hidden shadow-2xl mb-8">
        <div className="grid md:grid-cols-2 gap-6 p-8">
          <div className="flex flex-col justify-center">
            <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full mb-4 w-fit">
              SPONSORED
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{currentAd.title}</h2>
            {currentAd.description && (
              <p className="text-lg text-muted-foreground mb-6">{currentAd.description}</p>
            )}
            {currentAd.link_url && (
              <Button
                onClick={() => trackClick(currentAd)}
                size="lg"
                className="w-fit"
              >
                Learn More
              </Button>
            )}
          </div>
          <div className="relative">
            <img
              src={currentAd.image_url}
              alt={currentAd.title}
              className="w-full h-full object-cover rounded-lg cursor-pointer"
              onClick={() => trackClick(currentAd)}
            />
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
          onClick={() => setDismissed(true)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return null;
}
