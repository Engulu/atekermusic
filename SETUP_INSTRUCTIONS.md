# Quick Setup Instructions - Ateker Music

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
pnpm install
```

If you don't have pnpm:
```bash
npm install -g pnpm
```

### Step 2: Configure Supabase

You already have your Supabase project! Use these credentials:

**Project URL**: `https://dyklzvlrngvnuvaiceyr.supabase.co`

**Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5a2x6dmxybmd2bnV2YWljZXlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MjUxNjEsImV4cCI6MjA3ODEwMTE2MX0.oJPnc-q8VmqyvztE5n7-oUz8rkwN_0UrskzHnW2Yr_M`

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://dyklzvlrngvnuvaiceyr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5a2x6dmxybmd2bnV2YWljZXlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MjUxNjEsImV4cCI6MjA3ODEwMTE2MX0.oJPnc-q8VmqyvztE5n7-oUz8rkwN_0UrskzHnW2Yr_M
```

### Step 3: Set Up Database

Go to your Supabase project: https://supabase.com/dashboard/project/dyklzvlrngvnuvaiceyr

1. Click **SQL Editor** in the left sidebar
2. Create a new query
3. Copy and paste the contents of `sql/01_schema.sql`
4. Click **Run** (bottom right)
5. Wait for "Success" message
6. Repeat for `sql/02_rls_policies.sql`

### Step 4: Create Storage Buckets

1. Go to **Storage** in Supabase dashboard
2. Click **New bucket**
3. Create first bucket:
   - Name: `songs`
   - Public: ✅ Check this box
   - Click **Create bucket**
4. Create second bucket:
   - Name: `covers`
   - Public: ✅ Check this box
   - Click **Create bucket**

### Step 5: Run Development Server

```bash
pnpm dev
```

Open http://localhost:3000 in your browser!

## ✅ What's Working

After setup, you can:
- ✅ Browse the website
- ✅ Register as an artist
- ✅ Login with your account
- ✅ Upload songs (after admin approval)
- ✅ Download music
- ✅ Play music with the audio player

## 🔑 Create Your First Admin Account

1. Register as an artist through the website
2. Go to Supabase → **Table Editor** → **profiles**
3. Find your user (search by email)
4. Click the row to edit
5. Change:
   - `role` from `artist` to `admin`
   - `is_approved` from `false` to `true`
6. Click **Save**
7. Refresh the website and login

Now you can access the admin panel at `/admin`!

## 📚 Need More Help?

- **Full Documentation**: See `README.md`
- **Deployment Guide**: See `DEPLOYMENT.md`
- **Contact**: enochaengulu@gmail.com

## 🎵 Test the Platform

1. **As Public User**: Browse `/music` and `/artists`
2. **As Artist**: Register → Upload a song → View dashboard
3. **As Admin**: Approve artists and songs at `/admin`

---

**Made with ❤️ by YOGASWAM I.T SOLUTIONS**
