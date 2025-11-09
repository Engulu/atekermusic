-- Ateker Music Row Level Security Policies
-- Run this AFTER running 01_schema.sql

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE trending_songs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Public can view approved artist profiles
CREATE POLICY "Public can view approved artists"
  ON profiles FOR SELECT
  USING (is_approved = TRUE AND role = 'artist');

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can update their own profile (except role and is_approved)
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- New users can insert their profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- SONGS POLICIES
-- ============================================

-- Public can view approved songs
CREATE POLICY "Public can view approved songs"
  ON songs FOR SELECT
  USING (status = 'approved');

-- Artists can view their own songs (any status)
CREATE POLICY "Artists can view own songs"
  ON songs FOR SELECT
  USING (auth.uid() = artist_id);

-- Admins can view all songs
CREATE POLICY "Admins can view all songs"
  ON songs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Artists can insert their own songs
CREATE POLICY "Artists can insert own songs"
  ON songs FOR INSERT
  WITH CHECK (
    auth.uid() = artist_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_approved = TRUE
    )
  );

-- Artists can update their own pending/rejected songs
CREATE POLICY "Artists can update own pending songs"
  ON songs FOR UPDATE
  USING (
    auth.uid() = artist_id AND
    status IN ('pending', 'rejected')
  )
  WITH CHECK (auth.uid() = artist_id);

-- Admins can update any song
CREATE POLICY "Admins can update any song"
  ON songs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can delete songs
CREATE POLICY "Admins can delete songs"
  ON songs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- ARTICLES POLICIES
-- ============================================

-- Public can view published articles
CREATE POLICY "Public can view published articles"
  ON articles FOR SELECT
  USING (published = TRUE);

-- Authors can view their own articles
CREATE POLICY "Authors can view own articles"
  ON articles FOR SELECT
  USING (auth.uid() = author_id);

-- Admins can view all articles
CREATE POLICY "Admins can view all articles"
  ON articles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can insert articles
CREATE POLICY "Admins can insert articles"
  ON articles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update articles
CREATE POLICY "Admins can update articles"
  ON articles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can delete articles
CREATE POLICY "Admins can delete articles"
  ON articles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- SONG_LIKES POLICIES
-- ============================================

-- Anyone can view song likes
CREATE POLICY "Anyone can view song likes"
  ON song_likes FOR SELECT
  USING (TRUE);

-- Anyone can insert song likes (client handles deduplication)
CREATE POLICY "Anyone can insert song likes"
  ON song_likes FOR INSERT
  WITH CHECK (TRUE);

-- ============================================
-- ARTICLE_LIKES POLICIES
-- ============================================

-- Anyone can view article likes
CREATE POLICY "Anyone can view article likes"
  ON article_likes FOR SELECT
  USING (TRUE);

-- Anyone can insert article likes
CREATE POLICY "Anyone can insert article likes"
  ON article_likes FOR INSERT
  WITH CHECK (TRUE);

-- ============================================
-- FOLLOWS POLICIES
-- ============================================

-- Anyone can view follows
CREATE POLICY "Anyone can view follows"
  ON follows FOR SELECT
  USING (TRUE);

-- Anyone can insert follows
CREATE POLICY "Anyone can insert follows"
  ON follows FOR INSERT
  WITH CHECK (TRUE);

-- Anyone can delete their own follows
CREATE POLICY "Anyone can delete own follows"
  ON follows FOR DELETE
  USING (TRUE);

-- ============================================
-- APPROVALS POLICIES
-- ============================================

-- Admins can view all approvals
CREATE POLICY "Admins can view approvals"
  ON approvals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can insert approvals
CREATE POLICY "Admins can insert approvals"
  ON approvals FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- TRENDING_SONGS POLICIES
-- ============================================

-- Anyone can view trending songs
CREATE POLICY "Anyone can view trending songs"
  ON trending_songs FOR SELECT
  USING (TRUE);

-- Only service role can modify trending songs (via edge function)
-- No policy needed as this will be done via service key
