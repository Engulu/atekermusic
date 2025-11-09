# Ateker Music - Eastern Uganda Music Platform

![Ateker Music](https://img.shields.io/badge/Version-1.0.0-orange)
![License](https://img.shields.io/badge/License-MIT-blue)
![Supabase](https://img.shields.io/badge/Backend-Supabase-green)

**Ateker Music** is a free music download platform dedicated to promoting and preserving the rich musical heritage of Eastern Uganda. The platform allows artists to upload their music and provides free downloads to music lovers worldwide.

## 🎵 Features

### For Public Users
- ✅ Browse and search music without login
- ✅ Stream songs with built-in audio player
- ✅ Free MP3 downloads
- ✅ Filter by genre, district, and artist
- ✅ View artist profiles and biographies
- ✅ Read news and updates
- ✅ Light/Dark mode support
- ✅ Responsive mobile-friendly design
- ✅ PWA support for offline access

### For Artists
- ✅ Artist registration with NIN verification
- ✅ Upload songs (MP3, max 8MB)
- ✅ Upload cover art (auto-cropped to square, max 1MB)
- ✅ Add lyrics and song metadata
- ✅ Track analytics (plays, downloads, likes)
- ✅ Artist dashboard
- ✅ Profile management
- ✅ Approval workflow

### For Administrators
- ✅ Artist approval system
- ✅ Song approval workflow
- ✅ Content moderation
- ✅ Platform analytics
- ✅ Rejection with notes

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Routing**: Wouter
- **Backend**: Supabase
  - PostgreSQL Database
  - Authentication (Email/Password + Google OAuth)
  - Storage (Songs + Cover Images)
  - Row Level Security (RLS)
- **Build Tool**: Vite
- **Package Manager**: pnpm

## 📋 Prerequisites

- Node.js 18+ and pnpm
- Supabase account
- Git

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ateker-music.git
cd ateker-music
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Supabase

#### 3.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your Project URL and API Keys

#### 3.2 Run Database Migrations

Execute the SQL files in order:

1. **Create Tables**: Run `sql/01_schema.sql` in Supabase SQL Editor
2. **Set Up RLS**: Run `sql/02_rls_policies.sql`
3. **Create Storage Buckets**: Follow instructions in `sql/03_storage_setup.md`

#### 3.3 Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
ateker-music/
├── client/
│   ├── public/              # Static assets
│   │   ├── manifest.json    # PWA manifest
│   │   └── ...
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── SongCard.tsx
│   │   │   ├── AudioPlayer.tsx
│   │   │   └── ...
│   │   ├── contexts/        # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ThemeContext.tsx
│   │   │   └── AudioPlayerContext.tsx
│   │   ├── lib/             # Utilities and helpers
│   │   │   ├── supabase.ts  # Supabase client
│   │   │   ├── audioUtils.ts
│   │   │   └── imageUtils.ts
│   │   ├── pages/           # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Music.tsx
│   │   │   ├── Artists.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Admin.tsx
│   │   │   └── ...
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   └── index.html
├── sql/                     # Database scripts
│   ├── 01_schema.sql
│   ├── 02_rls_policies.sql
│   └── 03_storage_setup.md
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

## 🎨 Design System

### Colors
- **Primary**: Orange (#FF8C00)
- **Background**: White (light mode) / Black (dark mode)
- **Text**: Black (light mode) / White (dark mode)

### Typography
- **Font**: Poppins (Google Fonts)

### Supported Genres
- Akogo
- Ajosi
- Ekiriakiria
- Kadodi
- Gospel
- Afrobeat
- Reggae
- Dancehall
- RnB
- Hip Hop
- Traditional
- Contemporary

### Supported Districts
Eastern Uganda districts including:
- Teso Region: Soroti, Katakwi, Amuria, Kaberamaido, Ngora, Serere, Kumi, Bukedea
- Bukedi Region: Tororo, Busia, Pallisa, Budaka, Butaleja, Kibuku
- Busoga Region: Jinja, Iganga, Kamuli, Bugiri, Mayuge, Luuka, Kaliro, Namutumba, Buyende, Namayingo
- Bugisu Region: Mbale, Sironko, Manafwa, Bududa, Bulambuli, Namisindwa
- Sebei Region: Kapchorwa, Bukwo, Kween
- Karamoja Region: Moroto, Kotido, Abim, Kaabong, Amudat, Napak, Nakapiripirit

## 🔐 Authentication

### User Roles
1. **Public**: Can browse and download music (no login required)
2. **Artist**: Can upload songs and manage profile (requires approval)
3. **Admin**: Can approve artists and songs, moderate content

### Artist Registration
Artists must provide:
- Display Name (Artist Name)
- Email
- Password
- Phone Number
- National ID Number (NIN)
- District
- Sub-County (optional)
- Parish (optional)
- Village (optional)
- Bio (optional)

## 📤 Upload Specifications

### Audio Files
- Format: MP3 only
- Maximum Size: 8MB
- Required: Title, Genre
- Optional: Album, Language, Release Date, Lyrics

### Cover Art
- Formats: JPEG, PNG, WebP
- Automatically cropped to square
- Compressed to max 1MB
- Recommended: 800x800px or higher

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Authentication required for artist and admin actions
- File uploads validated client-side and server-side
- NIN verification for artist registration
- Admin approval required for all content

## 📊 Analytics

The platform tracks:
- Song plays (after 30 seconds)
- Downloads
- Likes
- Artist statistics

## 🌐 Deployment

### Build for Production

```bash
pnpm build
```

### Deploy to Hosting

The built files will be in `client/dist/`. Deploy to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

### Environment Variables for Production

Ensure these are set in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Developer

**YOGASWAM I.T SOLUTIONS**

- **Developer**: Enocha Engulu
- **Role**: I.T Specialist, Web Developer, App Developer & Software Engineer
- **Location**: Soroti, Eastern Uganda
- **Email**: enochaengulu@gmail.com, info@atekermusic.com
- **Phone**: +256 787 168666 / +256 757 566144

## 🙏 Acknowledgments

- Eastern Uganda music community
- All contributing artists
- Supabase for backend infrastructure
- shadcn/ui for beautiful components

## 📞 Support

For support, email info@atekermusic.com or call +256 787 168666

---

**Made with ❤️ by YOGASWAM I.T SOLUTIONS**

*Promoting Eastern Uganda Music to the World*
