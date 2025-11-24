import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://dyklzvlrngvnuvaiceyr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5a2x6dmxybmd2bnV2YWljZXlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MjUxNjEsImV4cCI6MjA3ODEwMTE2MX0.oJPnc-q8VmqyvztE5n7-oUz8rkwN_0UrskzHnW2Yr_M';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types
export interface Profile {
  id: string;
  display_name: string;
  email: string;
  bio?: string;
  phone?: string;
  nin?: string;
  district?: string;
  sub_county?: string;
  parish?: string;
  village?: string;
  website?: string;
  avatar_url?: string;
  role: 'artist' | 'admin';
  is_approved: boolean;
  is_verified?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Song {
  id: string;
  artist_id: string;
  title: string;
  album?: string;
  genre: string;
  language?: string;
  release_date?: string;
  duration?: number;
  mp3_url?: string;
  cover_url?: string;
  file_size?: number;
  lyrics?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_note?: string;
  is_premium: boolean;
  premium_price?: number;
  likes: number;
  downloads: number;
  listens: number;
  created_at: string;
  updated_at: string;
  // Joined data
  artist?: Profile;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: 'Teso' | 'National' | 'East Africa' | 'Africa' | 'International' | 'Football';
  cover_url?: string;
  body: string;
  excerpt?: string;
  author_id?: string;
  likes: number;
  reads: number;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  author?: Profile;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  event_type: 'concert' | 'booking' | 'festival' | 'workshop' | 'other';
  artist_id?: string;
  venue?: string;
  location?: string;
  district?: string;
  event_date: string;
  end_date?: string;
  ticket_price: number;
  is_free: boolean;
  cover_image_url?: string;
  contact_phone?: string;
  contact_email?: string;
  booking_link?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';
  is_featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  // Joined data
  artist?: Profile;
}

export interface Advertisement {
  id: string;
  title: string;
  description?: string;
  advertiser_name: string;
  advertiser_email: string;
  advertiser_phone?: string;
  ad_type: 'banner' | 'sidebar' | 'featured' | 'popup';
  image_url: string;
  link_url?: string;
  start_date: string;
  end_date: string;
  display_on_homepage: boolean;
  display_priority: number;
  status: 'pending' | 'approved' | 'active' | 'paused' | 'expired' | 'rejected';
  impressions: number;
  clicks: number;
  created_at: string;
  updated_at: string;
}

export interface EventBooking {
  id: string;
  event_id: string;
  user_id: string;
  attendee_name: string;
  attendee_email: string;
  attendee_phone?: string;
  number_of_tickets: number;
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  booking_reference: string;
  created_at: string;
  // Joined data
  event?: Event;
}

export interface SongLike {
  id: string;
  song_id: string;
  user_id: string;
  created_at: string;
}

export interface ArticleLike {
  id: string;
  article_id: string;
  user_id: string;
  created_at: string;
}

export interface Follow {
  id: string;
  artist_id: string;
  follower_id: string;
  created_at: string;
}

export interface Approval {
  id: string;
  target_table: string;
  target_id: string;
  admin_id?: string;
  action: 'approved' | 'rejected';
  note?: string;
  created_at: string;
}

export interface TrendingSong {
  id: string;
  song_id: string;
  score: number;
  rank: number;
  period: 'daily' | 'weekly' | 'monthly';
  calculated_at: string;
  song?: Song;
}

// Genre list
export const GENRES = [
  'Akogo',
  'Traditional Gospel',
  'Ajosi',
  'Ekiriakiria',
  'Kadodi',
  'Bax Ragga',
  'Lugaflow',
  'Reggae',
  'Raggaeton',
  'Afrobeat',
  'Country',
  'Dancehall',
  'R&B',
  'Hip-Hop',
  'Gospel',
  'Other',
] as const;

// Uganda districts (focusing on Eastern region)
export const DISTRICTS = [
  // Teso Region
  'Soroti',
  'Katakwi',
  'Amuria',
  'Kaberamaido',
  'Ngora',
  'Serere',
  'Kumi',
  'Bukedea',
  // Bukedi Region
  'Tororo',
  'Busia',
  'Butaleja',
  'Pallisa',
  'Budaka',
  'Kibuku',
  // Busoga Region
  'Jinja',
  'Iganga',
  'Kamuli',
  'Bugiri',
  'Mayuge',
  'Namutumba',
  'Luuka',
  'Kaliro',
  'Buyende',
  // Bugisu Region
  'Mbale',
  'Sironko',
  'Manafwa',
  'Bududa',
  'Bulambuli',
  'Namisindwa',
  // Sebei Region
  'Kapchorwa',
  'Bukwo',
  'Kween',
  // Karamoja Region
  'Moroto',
  'Kotido',
  'Abim',
  'Kaabong',
  'Amudat',
  'Napak',
  'Nakapiripirit',
  // Other regions
  'Kampala',
  'Wakiso',
  'Mukono',
  'Other',
] as const;

// News categories
export const NEWS_CATEGORIES = [
  'Teso',
  'National',
  'East Africa',
  'Africa',
  'International',
  'Football',
] as const;

// Helper functions
export function getDeviceId(): string {
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
