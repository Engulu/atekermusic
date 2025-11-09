# Deployment Guide - Ateker Music

This guide will help you deploy the Ateker Music platform to production.

## Prerequisites

- Supabase account with project created
- Your Supabase Project URL and API keys
- Hosting platform account (Vercel, Netlify, or similar)
- Domain name (optional)

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Name: `ateker-music`
   - Database Password: (create a strong password)
   - Region: Choose closest to Uganda (e.g., Frankfurt, London)
4. Wait for project to be created (2-3 minutes)

### 1.2 Get Your Credentials

From your Supabase project dashboard:

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL**: `https://your-project.supabase.co`
   - **anon public key**: `eyJ...` (long string)

### 1.3 Set Up Database

1. Go to **SQL Editor** in Supabase dashboard
2. Create a new query
3. Copy and paste contents of `sql/01_schema.sql`
4. Click "Run"
5. Repeat for `sql/02_rls_policies.sql`

### 1.4 Create Storage Buckets

1. Go to **Storage** in Supabase dashboard
2. Click "New bucket"
3. Create two buckets:

**Bucket 1: songs**
- Name: `songs`
- Public: ✅ Yes
- File size limit: 10MB
- Allowed MIME types: `audio/mpeg, audio/mp3`

**Bucket 2: covers**
- Name: `covers`
- Public: ✅ Yes
- File size limit: 2MB
- Allowed MIME types: `image/jpeg, image/jpg, image/png, image/webp`

### 1.5 Enable Google OAuth (Optional)

1. Go to **Authentication** → **Providers**
2. Enable Google
3. Follow Supabase instructions to set up Google OAuth
4. Add your production domain to authorized redirect URLs

### 1.6 Create First Admin User

After deploying, you'll need to manually set the first admin:

1. Register as an artist through the website
2. Go to Supabase **Table Editor** → **profiles**
3. Find your user record
4. Edit:
   - `role`: Change to `admin`
   - `is_approved`: Change to `true`
5. Save

## Step 2: Build the Application

### 2.1 Update Environment Variables

Create `.env.production`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2.2 Build

```bash
pnpm install
pnpm build
```

This creates optimized files in `client/dist/`

## Step 3: Deploy to Hosting

### Option A: Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd client
   vercel
   ```

3. **Set Environment Variables**:
   - Go to Vercel dashboard → Your project → Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **Redeploy**:
   ```bash
   vercel --prod
   ```

### Option B: Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   cd client
   netlify deploy
   ```

3. **Set Environment Variables**:
   - Go to Netlify dashboard → Site settings → Environment variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **Deploy to Production**:
   ```bash
   netlify deploy --prod
   ```

### Option C: GitHub Pages

1. **Update `vite.config.ts`**:
   ```ts
   export default defineConfig({
     base: '/ateker-music/', // Your repo name
     // ... rest of config
   })
   ```

2. **Build**:
   ```bash
   pnpm build
   ```

3. **Deploy**:
   ```bash
   cd client/dist
   git init
   git add -A
   git commit -m 'deploy'
   git push -f git@github.com:yourusername/ateker-music.git main:gh-pages
   ```

4. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: `gh-pages` branch
   - Save

## Step 4: Configure Custom Domain (Optional)

### For Vercel:
1. Go to project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### For Netlify:
1. Go to Site settings → Domain management
2. Add custom domain
3. Update DNS records as instructed

## Step 5: Post-Deployment Checklist

- [ ] Test user registration
- [ ] Test artist login
- [ ] Create first admin user (see Step 1.6)
- [ ] Test song upload as artist
- [ ] Test admin approval workflow
- [ ] Test music playback
- [ ] Test downloads
- [ ] Test on mobile devices
- [ ] Test dark/light mode
- [ ] Verify PWA installation
- [ ] Check all legal pages load correctly
- [ ] Test contact form

## Step 6: Ongoing Maintenance

### Monitor Supabase Usage

1. Go to Supabase dashboard → Settings → Usage
2. Monitor:
   - Database size
   - Storage size
   - Bandwidth
   - Authentication users

### Backup Database

Regular backups:
```bash
# From Supabase dashboard → Database → Backups
# Enable daily backups
```

### Update Dependencies

Monthly:
```bash
pnpm update
pnpm build
# Test locally
# Deploy
```

## Troubleshooting

### Issue: Songs won't upload

**Solution**:
- Check storage bucket permissions
- Verify file size limits
- Check browser console for errors
- Ensure RLS policies are applied

### Issue: Users can't register

**Solution**:
- Check Supabase authentication is enabled
- Verify email templates are configured
- Check RLS policies on profiles table

### Issue: Admin panel not accessible

**Solution**:
- Verify user role is set to `admin` in database
- Check `is_approved` is `true`
- Clear browser cache

### Issue: Images not loading

**Solution**:
- Check storage bucket is public
- Verify CORS settings in Supabase
- Check image URLs in database

## Security Recommendations

1. **Never commit `.env` files** to Git
2. **Enable email verification** in Supabase Auth settings
3. **Set up rate limiting** in Supabase dashboard
4. **Monitor for suspicious activity** regularly
5. **Keep dependencies updated**
6. **Use HTTPS only** (enforced by most hosting platforms)
7. **Regularly review RLS policies**

## Performance Optimization

1. **Enable Supabase CDN** for storage
2. **Use image optimization** (already implemented)
3. **Enable gzip compression** (automatic on most hosts)
4. **Monitor Core Web Vitals** with Lighthouse
5. **Consider adding a CDN** like Cloudflare

## Support

For deployment issues:
- Email: enochaengulu@gmail.com
- Phone: +256 787 168666

---

**Good luck with your deployment! 🚀**
