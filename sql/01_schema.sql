-- Ateker Music Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (Artists and Admins)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  display_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  bio TEXT,
  phone TEXT,
  nin TEXT, -- National Identification Number
  district TEXT, -- District of origin/residence
  sub_county TEXT,
  parish TEXT,
  village TEXT,
  website TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'artist' CHECK (role IN ('artist', 'admin')),
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Songs table
CREATE TABLE IF NOT EXISTS songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  album TEXT,
  genre TEXT NOT NULL,
  language TEXT,
  release_date DATE,
  duration INTEGER, -- in seconds
  mp3_url TEXT,
  cover_url TEXT,
  file_size INTEGER, -- in bytes
  lyrics TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note TEXT, -- Admin feedback on rejection
  likes INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  listens INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- News articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Teso', 'National', 'East Africa', 'Africa', 'International', 'Football')),
  cover_url TEXT,
  body TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  likes INTEGER DEFAULT 0,
  reads INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Song likes tracking (prevent duplicate likes)
CREATE TABLE IF NOT EXISTS song_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL, -- session id or device id for anonymous users
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(song_id, user_id)
);

-- Article likes tracking
CREATE TABLE IF NOT EXISTS article_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(article_id, user_id)
);

-- Artist followers
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  follower_id TEXT NOT NULL, -- device id or user id
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(artist_id, follower_id)
);

-- Admin approvals log
CREATE TABLE IF NOT EXISTS approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_table TEXT NOT NULL,
  target_id UUID NOT NULL,
  admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN ('approved', 'rejected')),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trending songs cache (updated by cron/edge function)
CREATE TABLE IF NOT EXISTS trending_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL,
  rank INTEGER NOT NULL,
  period TEXT DEFAULT 'weekly' CHECK (period IN ('daily', 'weekly', 'monthly')),
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(song_id, period)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_songs_artist_id ON songs(artist_id);
CREATE INDEX IF NOT EXISTS idx_songs_status ON songs(status);
CREATE INDEX IF NOT EXISTS idx_songs_genre ON songs(genre);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_song_likes_song_id ON song_likes(song_id);
CREATE INDEX IF NOT EXISTS idx_follows_artist_id ON follows(artist_id);
CREATE INDEX IF NOT EXISTS idx_trending_songs_period ON trending_songs(period, rank);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON songs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
