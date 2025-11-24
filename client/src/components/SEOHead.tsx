import { useEffect } from 'react';
import { updateMetaTags, SEOConfig, generateWebsiteSchema } from '@/lib/seo';

interface SEOHeadProps extends SEOConfig {}

/**
 * SEO Head Component
 * Dynamically updates meta tags and schema markup for each page
 */
export default function SEOHead(props: SEOHeadProps) {
  useEffect(() => {
    updateMetaTags(props);
    
    // Add website schema on initial load
    if (!document.getElementById('website-schema')) {
      generateWebsiteSchema();
    }
  }, [props]);

  return null; // This component doesn't render anything
}
