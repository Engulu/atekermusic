# Ateker Music - Project TODO

## Phase 1: Project Setup
- [x] Initialize web project structure
- [x] Create TODO tracking file

## Phase 2: Database & Backend
- [x] Create Supabase schema SQL files (profiles, songs, articles, song_likes, follows, approvals)
- [x] Create RLS policies for all tables
- [x] Create storage bucket configuration (songs, avatars, covers, news)
- [x] Add Supabase client configuration

## Phase 3: Core UI Framework
- [x] Set up color palette (Orange #FF8C00, Black, White)
- [x] Configure theme system (light/dark mode)
- [x] Create main navigation component
- [x] Create footer with YOGASWAM branding
- [x] Set up typography (Poppins/Inter)

## Phase 4: Public Pages
- [ ] Home page with hero, search, trending songs, trending artists, new releases
- [ ] Music page with search, filters, and song grid
- [ ] Artists page with artist listing
- [ ] Individual artist profile page
- [ ] News page with categories (Teso, National, East Africa, Africa, International, Football)
- [ ] Individual article page
- [ ] Football news page
- [ ] About page with developer bio
- [ ] Contact page with form

## Phase 5: Authentication
- [ ] Login page (email/password and Google OAuth)
- [ ] Register page (artists only with NIN, phone, email, location)
- [ ] Auth context and Supabase auth integration
- [ ] Protected route wrapper

## Phase 6: Artist Dashboard
- [ ] Dashboard layout
- [ ] Profile edit section (bio, avatar, contact)
- [ ] Song upload form with drag & drop
- [ ] Client-side MP3 validation (8MB limit)
- [ ] Client-side image cropping and compression (square, 1MB limit)
- [ ] Upload progress tracking
- [ ] Uploaded songs list with status
- [ ] Artist stats (listens, likes, downloads)

## Phase 7: Admin Panel
- [ ] Admin dashboard layout
- [ ] Artist approval interface
- [ ] Song approval interface
- [ ] News article management
- [ ] Site analytics view
- [ ] Content moderation tools

## Phase 8: Audio Player & Analytics
- [ ] Custom audio player component
- [ ] Play/pause controls
- [ ] Progress bar and seeking
- [ ] Volume control
- [ ] Listen count tracking (sessionStorage deduplication)
- [ ] Like functionality (localStorage + DB)
- [ ] Download button with count tracking
- [ ] Share functionality (Web Share API)

## Phase 9: Advanced Features
- [ ] Image cropping utility (canvas-based)
- [ ] Image compression utility
- [ ] Trending calculation logic
- [ ] PWA manifest
- [ ] Service worker for offline support
- [ ] SEO meta tags and Open Graph
- [ ] JSON-LD structured data
- [ ] Sitemap generation

## Phase 10: Documentation
- [ ] README.md with setup instructions
- [ ] Supabase deployment guide
- [ ] Environment variables documentation
- [ ] Storage bucket setup guide
- [ ] OAuth configuration guide
- [ ] Seed data examples
- [ ] DMCA policy page
- [ ] Terms & Conditions page
- [ ] Privacy Policy page
- [ ] Artist User Agreement page

## Phase 11: Packaging
- [ ] Test all features
- [ ] Create deployment checklist
- [ ] Package as ZIP for GitHub
- [ ] Final delivery
