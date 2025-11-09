# Supabase Storage Bucket Setup

This guide explains how to set up the required storage buckets in Supabase for the Ateker Music platform.

## Required Buckets

You need to create **4 storage buckets** in your Supabase project:

1. **songs** - For MP3 audio files
2. **avatars** - For artist profile pictures
3. **covers** - For song cover art
4. **news** - For news article images

## Setup Instructions

### Step 1: Access Storage in Supabase Dashboard

1. Go to your Supabase project: https://dyklzvlrngvnuvaiceyr.supabase.co
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket** button

### Step 2: Create Each Bucket

For each bucket, use these settings:

#### 1. Songs Bucket
- **Name**: `songs`
- **Public bucket**: ✅ Checked (so approved songs can be streamed/downloaded)
- **File size limit**: 10 MB (10485760 bytes)
- **Allowed MIME types**: `audio/mpeg, audio/mp3`

#### 2. Avatars Bucket
- **Name**: `avatars`
- **Public bucket**: ✅ Checked
- **File size limit**: 1 MB (1048576 bytes)
- **Allowed MIME types**: `image/jpeg, image/png, image/webp`

#### 3. Covers Bucket
- **Name**: `covers`
- **Public bucket**: ✅ Checked
- **File size limit**: 1 MB (1048576 bytes)
- **Allowed MIME types**: `image/jpeg, image/png, image/webp`

#### 4. News Bucket
- **Name**: `news`
- **Public bucket**: ✅ Checked
- **File size limit**: 2 MB (2097152 bytes)
- **Allowed MIME types**: `image/jpeg, image/png, image/webp`

### Step 3: Set Bucket Policies

After creating the buckets, you need to set up policies for each one.

Go to **Storage** → Click on a bucket → **Policies** tab

#### Songs Bucket Policies

```sql
-- Allow authenticated artists to upload
CREATE POLICY "Artists can upload songs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'songs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated artists to update their own songs
CREATE POLICY "Artists can update own songs"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'songs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public to read songs
CREATE POLICY "Public can read songs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'songs');
```

#### Avatars Bucket Policies

```sql
-- Allow authenticated users to upload avatars
CREATE POLICY "Users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own avatars
CREATE POLICY "Users can update own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public to read avatars
CREATE POLICY "Public can read avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

#### Covers Bucket Policies

```sql
-- Allow authenticated artists to upload covers
CREATE POLICY "Artists can upload covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'covers' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow artists to update their own covers
CREATE POLICY "Artists can update own covers"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'covers' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public to read covers
CREATE POLICY "Public can read covers"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'covers');
```

#### News Bucket Policies

```sql
-- Allow admins to upload news images
CREATE POLICY "Admins can upload news images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'news' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow admins to update news images
CREATE POLICY "Admins can update news images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'news' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow public to read news images
CREATE POLICY "Public can read news images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'news');
```

## Verification

After setup, verify that:

1. All 4 buckets are visible in the Storage section
2. Each bucket shows as "Public" in the list
3. Policies are active (green checkmark)
4. You can upload a test file to each bucket

## File Organization

Files will be organized in buckets using this structure:

```
songs/
  {artist_id}/
    {song_id}.mp3

avatars/
  {user_id}/
    avatar.jpg

covers/
  {artist_id}/
    {song_id}.jpg

news/
  {article_id}/
    cover.jpg
```

## Next Steps

After setting up storage:

1. Configure your `.env` file with Supabase credentials
2. Test file uploads from the artist dashboard
3. Verify public access to approved content
