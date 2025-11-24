/**
 * SEO Utilities for Ateker Music
 * Handles meta tags, Open Graph, Twitter Cards, and JSON-LD schema markup
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'music.song' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Update document meta tags for SEO
 */
export function updateMetaTags(config: SEOConfig) {
  const {
    title,
    description,
    keywords = [],
    image = '/logo.svg',
    url = window.location.href,
    type = 'website',
    author,
    publishedTime,
    modifiedTime,
  } = config;

  // Title
  document.title = `${title} | Ateker Music`;

  // Meta description
  setMetaTag('description', description);

  // Keywords
  if (keywords.length > 0) {
    setMetaTag('keywords', keywords.join(', '));
  }

  // Author
  if (author) {
    setMetaTag('author', author);
  }

  // Open Graph
  setMetaTag('og:title', title, 'property');
  setMetaTag('og:description', description, 'property');
  setMetaTag('og:image', image, 'property');
  setMetaTag('og:url', url, 'property');
  setMetaTag('og:type', type, 'property');
  setMetaTag('og:site_name', 'Ateker Music', 'property');

  // Twitter Card
  setMetaTag('twitter:card', 'summary_large_image');
  setMetaTag('twitter:title', title);
  setMetaTag('twitter:description', description);
  setMetaTag('twitter:image', image);

  // Article meta (if applicable)
  if (publishedTime) {
    setMetaTag('article:published_time', publishedTime, 'property');
  }
  if (modifiedTime) {
    setMetaTag('article:modified_time', modifiedTime, 'property');
  }

  // Canonical URL
  setLinkTag('canonical', url);
}

/**
 * Helper to set meta tag
 */
function setMetaTag(name: string, content: string, attribute: string = 'name') {
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.content = content;
}

/**
 * Helper to set link tag
 */
function setLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  
  element.href = href;
}

/**
 * Generate JSON-LD schema markup for a music song
 */
export function generateSongSchema(song: {
  title: string;
  artist: string;
  genre?: string;
  duration?: number;
  url: string;
  image?: string;
  description?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MusicRecording',
    name: song.title,
    byArtist: {
      '@type': 'MusicGroup',
      name: song.artist,
    },
    genre: song.genre,
    duration: song.duration ? `PT${song.duration}S` : undefined,
    url: song.url,
    image: song.image,
    description: song.description,
    inLanguage: 'en',
    publisher: {
      '@type': 'Organization',
      name: 'Ateker Music',
      url: 'https://atekermusic.com',
    },
  };

  injectJSONLD(schema);
}

/**
 * Generate JSON-LD schema markup for an artist profile
 */
export function generateArtistSchema(artist: {
  name: string;
  description?: string;
  image?: string;
  genre?: string[];
  url: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: artist.name,
    description: artist.description,
    image: artist.image,
    genre: artist.genre,
    url: artist.url,
    sameAs: [], // Add social media links if available
  };

  injectJSONLD(schema);
}

/**
 * Generate JSON-LD schema markup for the website
 */
export function generateWebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ateker Music',
    description: 'Celebrating Eastern Uganda\'s Musical Heritage - Free music downloads, streaming, and artist promotion',
    url: 'https://atekermusic.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://atekermusic.com/music?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'YOGASWAM I.T SOLUTIONS',
      email: 'info@atekermusic.com',
      telephone: '+256787168666',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Soroti',
        addressRegion: 'Eastern Uganda',
        addressCountry: 'UG',
      },
    },
  };

  injectJSONLD(schema);
}

/**
 * Generate JSON-LD schema markup for an article/news
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  image?: string;
  url: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate || article.publishedDate,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ateker Music',
      logo: {
        '@type': 'ImageObject',
        url: 'https://atekermusic.com/logo.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };

  injectJSONLD(schema);
}

/**
 * Inject JSON-LD script into document head
 */
function injectJSONLD(schema: object) {
  const scriptId = 'jsonld-schema';
  let script = document.getElementById(scriptId) as HTMLScriptElement;
  
  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  
  script.textContent = JSON.stringify(schema);
}

/**
 * Default SEO configurations for different pages
 */
export const DEFAULT_SEO = {
  home: {
    title: 'Home',
    description: 'Discover, stream, and download the best music from Eastern Uganda. Free music from Teso, Bukedi, Busoga, Bugisu, and beyond.',
    keywords: ['Eastern Uganda music', 'Ugandan music', 'Teso music', 'free music download', 'African music', 'Ateker music'],
  },
  music: {
    title: 'Browse Music',
    description: 'Explore thousands of songs from talented Eastern Ugandan artists. Stream and download for free.',
    keywords: ['browse music', 'Uganda songs', 'free MP3 download', 'African music', 'Eastern Uganda'],
  },
  artists: {
    title: 'Artists',
    description: 'Discover talented artists from Eastern Uganda. Support local musicians and explore their music.',
    keywords: ['Ugandan artists', 'Eastern Uganda musicians', 'African artists', 'music artists'],
  },
  news: {
    title: 'News & Updates',
    description: 'Stay updated with the latest music news, artist features, and entertainment updates from Eastern Uganda.',
    keywords: ['music news', 'Uganda entertainment', 'artist updates', 'Eastern Uganda news'],
  },
  about: {
    title: 'About Us',
    description: 'Learn about Ateker Music - the premier platform for celebrating and promoting Eastern Uganda\'s musical heritage.',
    keywords: ['about Ateker Music', 'Eastern Uganda music platform', 'music promotion'],
  },
};

/**
 * Generate sitemap data
 */
export function generateSitemapData() {
  const baseUrl = 'https://atekermusic.com';
  const pages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/music', priority: 0.9, changefreq: 'daily' },
    { url: '/artists', priority: 0.9, changefreq: 'daily' },
    { url: '/news', priority: 0.8, changefreq: 'daily' },
    { url: '/about', priority: 0.7, changefreq: 'monthly' },
    { url: '/contact', priority: 0.6, changefreq: 'monthly' },
    { url: '/terms', priority: 0.5, changefreq: 'yearly' },
    { url: '/privacy', priority: 0.5, changefreq: 'yearly' },
    { url: '/dmca', priority: 0.5, changefreq: 'yearly' },
    { url: '/artist-agreement', priority: 0.5, changefreq: 'yearly' },
  ];

  return pages.map((page) => ({
    ...page,
    url: `${baseUrl}${page.url}`,
    lastmod: new Date().toISOString(),
  }));
}
