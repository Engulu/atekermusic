import { useState } from 'react';
import { Upload, Music, BarChart2, Users, Image, DollarSign, TrendingUp, Calendar, Globe2, Clock } from 'lucide-react';

interface RevenueStats {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  trend: number;
}

interface UploadFormData {
  title: string;
  genres: string[];
  price: number;
  isPaid: boolean;
  mtnNumber: string;
  airtelNumber: string;
  file: File | null;
  coverImage: File | null;
}

const genres = [
  'Teso Gospel',
  'Teso Worship',
  'Teso Praise',
  'Teso Secular',
  'Modern Akogo',
  'Akogo',
  'Ajosi',
  'Drama',
  'Teso Afrobeats',
  'Teso Pop',
  'Teso Hip Hop',
  'Reggae',
  'Ragga',
  'Lugaflow',
  'Kadongo Kamu',
  'Band Music',
  'Afrobeats',
  'Dancehall',
  'Hip Hop',
  'RnB',
  'Gospel',
  'Urban Gospel',
  'Traditional'
];

export default function ArtistDashboardPage() {
  const [activeTab, setActiveTab] = useState('upload');
  const [revenueTimeframe, setRevenueTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [selectedSong, setSelectedSong] = useState<string | null>(null);
  const [revenueStats] = useState<RevenueStats>({
    daily: 45000,
    weekly: 315000,
    monthly: 1350000,
    yearly: 16200000,
    trend: 12.5
  });
  
  const [revenueHistory] = useState([
    { date: '2024-03-01', amount: 42000, downloads: 21 },
    { date: '2024-03-02', amount: 38000, downloads: 19 },
    { date: '2024-03-03', amount: 51000, downloads: 25 },
    { date: '2024-03-04', amount: 45000, downloads: 22 },
    { date: '2024-03-05', amount: 49000, downloads: 24 },
    { date: '2024-03-06', amount: 53000, downloads: 26 },
    { date: '2024-03-07', amount: 37000, downloads: 18 }
  ]);

  const [revenueByLocation] = useState([
    { location: 'Soroti', amount: 450000, percentage: 35 },
    { location: 'Kampala', amount: 320000, percentage: 25 },
    { location: 'Mbale', amount: 260000, percentage: 20 },
    { location: 'Lira', amount: 160000, percentage: 12 },
    { location: 'Others', amount: 100000, percentage: 8 }
  ]);

  const [revenueByTime] = useState([
    { time: 'Morning (6AM-12PM)', amount: 380000, percentage: 30 },
    { time: 'Afternoon (12PM-6PM)', amount: 420000, percentage: 33 },
    { time: 'Evening (6PM-12AM)', amount: 350000, percentage: 27 },
    { time: 'Night (12AM-6AM)', amount: 130000, percentage: 10 }
  ]);
  const [uploadData, setUploadData] = useState<UploadFormData>({
    title: '',
    genres: [],
    price: 1000,
    isPaid: false,
    mtnNumber: '',
    airtelNumber: '',
    file: null,
    coverImage: null
  });
  
  const [recentSongs] = useState([
    {
      id: '1',
      title: 'Akello',
      plays: 25678,
      downloads: 15234,
      revenue: 450000,
      analytics: {
        playsByRegion: [
          { region: 'Soroti', count: 12000 },
          { region: 'Kampala', count: 8000 },
          { region: 'Mbale', count: 5678 }
        ],
        playsByTime: [
          { hour: '6AM-12PM', count: 8000 },
          { hour: '12PM-6PM', count: 10000 },
          { hour: '6PM-12AM', count: 7678 }
        ]
      }
    },
    {
      id: '2',
      title: 'Etop Lokaala',
      plays: 22789,
      downloads: 12345,
      revenue: 350000,
      analytics: {
        playsByRegion: [
          { region: 'Soroti', count: 10000 },
          { region: 'Kampala', count: 7000 },
          { region: 'Mbale', count: 5789 }
        ],
        playsByTime: [
          { hour: '6AM-12PM', count: 7000 },
          { hour: '12PM-6PM', count: 9000 },
          { hour: '6PM-12AM', count: 6789 }
        ]
      }
    }
  ]);

  const [monthlyRevenue] = useState([
    { month: 'Jan', revenue: 650000, downloads: 2300, plays: 15000 },
    { month: 'Feb', revenue: 720000, downloads: 2800, plays: 18000 },
    { month: 'Mar', revenue: 800000, downloads: 3200, plays: 20000 }
  ]);

  const [revenueByGenre] = useState([
    { genre: 'Teso Gospel', revenue: 350000 },
    { genre: 'Modern Akogo', revenue: 280000 },
    { genre: 'Teso Pop', revenue: 170000 }
  ]);

  const [followers] = useState([
    {
      id: '1',
      name: 'Sarah Apio',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864',
      location: 'Soroti',
      followedOn: new Date().toISOString()
    },
    {
      id: '2',
      name: 'John Otim',
      imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2662',
      location: 'Kampala',
      followedOn: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Mary Akello',
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2662',
      location: 'Mbale',
      followedOn: new Date().toISOString()
    }
  ]);
  const [monthlyStats] = useState({
    plays: 48467, downloads: 27579, revenue: 800000, followers: 5000
  });

  const [profile, setProfile] = useState({
    displayName: '',
    bio: '',
    nin: {
      number: '',
      cardNumber: '',
      dateOfBirth: ''
    },
    gender: 'male',
    phoneNumber: '',
    whatsappNumber: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      tiktok: '',
      youtube: ''
    }
  });

  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (e.target.name === 'songFile') {
        if (file.type !== 'audio/mpeg') {
          alert('Please upload MP3 files only');
          return;
        }
        setUploadData(prev => ({ ...prev, file }));
        setPreviewUrl(URL.createObjectURL(file));
      } else if (e.target.name === 'coverImage') {
        setUploadData(prev => ({ ...prev, coverImage: file }));
        setCoverPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement file upload to storage
    console.log('Uploading:', uploadData);
  };

  return (
    <main className="min-h-screen bg-navy-900 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Stats Overview */}
          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-navy-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Music className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">Total Plays</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {monthlyStats.plays.toLocaleString()}
              </p>
            </div>
            <div className="bg-navy-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Download className="w-5 h-5 text-green-400" />
                <span className="text-gray-400">Downloads</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {monthlyStats.downloads.toLocaleString()}
              </p>
            </div>
            <div className="bg-navy-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-400">Revenue</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {monthlyStats.revenue.toLocaleString()} UGX
              </p>
            </div>
            <div className="bg-navy-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-gray-400">Followers</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {monthlyStats.followers.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-navy-800 rounded-lg p-6">
              <nav className="space-y-4">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex items-center gap-3 w-full text-left ${
                    activeTab === 'upload' ? 'text-blue-400' : 'text-gray-400 hover:text-blue-300'
                  }`}
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Music</span>
                </button>
                <button
                  onClick={() => setActiveTab('songs')}
                  className={`flex items-center gap-3 w-full text-left ${
                    activeTab === 'songs' ? 'text-blue-400' : 'text-gray-400 hover:text-blue-300'
                  }`}
                >
                  <Music className="w-5 h-5" />
                  <span>My Songs</span>
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`flex items-center gap-3 w-full text-left ${
                    activeTab === 'stats' ? 'text-blue-400' : 'text-gray-400 hover:text-blue-300'
                  }`}
                >
                  <BarChart2 className="w-5 h-5" />
                  <span>Statistics</span>
                </button>
                <button
                  onClick={() => setActiveTab('followers')}
                  className={`flex items-center gap-3 w-full text-left ${
                    activeTab === 'followers' ? 'text-blue-400' : 'text-gray-400 hover:text-blue-300'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span>Followers</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'upload' && (
              <div className="bg-navy-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Upload New Song</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Song Title
                  </label>
                  <input
                    type="text"
                    value={uploadData.title}
                    onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 bg-navy-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter song title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Genres (Select up to 3)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {genres.map(genre => (
                      <label
                        key={genre}
                        className="flex items-center space-x-2 p-2 rounded hover:bg-navy-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={uploadData.genres.includes(genre)}
                          onChange={(e) => {
                            if (e.target.checked && uploadData.genres.length < 3) {
                              setUploadData(prev => ({
                                ...prev,
                                genres: [...prev.genres, genre]
                              }));
                            } else if (!e.target.checked) {
                              setUploadData(prev => ({
                                ...prev,
                                genres: prev.genres.filter(g => g !== genre)
                              }));
                            }
                          }}
                          className="text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-gray-400">{genre}</span>
                      </label>
                    ))}
                  </div>
                  {uploadData.genres.length > 0 && (
                    <p className="mt-2 text-sm text-gray-400">
                      Selected: {uploadData.genres.join(', ')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Pricing
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="free"
                        checked={!uploadData.isPaid}
                        onChange={() => setUploadData(prev => ({ ...prev, isPaid: false }))}
                        className="mr-2"
                      />
                      <label htmlFor="free" className="text-gray-400">Free Download</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="paid"
                        checked={uploadData.isPaid}
                        onChange={() => setUploadData(prev => ({ ...prev, isPaid: true }))}
                        className="mr-2"
                      />
                      <label htmlFor="paid" className="text-gray-400">Paid Download</label>
                    </div>
                  </div>
                </div>

                {/* NIN Details (Admin Only) */}
                <div className="space-y-4">
                  <h4 className="text-white font-medium">National ID Details (Admin Only)</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      NIN Number
                    </label>
                    <input
                      type="text"
                      placeholder="CM12345678ABCD"
                      value={profile.nin.number}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        nin: {
                          ...prev.nin,
                          number: e.target.value
                        }
                      }))}
                      className="w-full px-4 py-2 bg-navy-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="123456789"
                      value={profile.nin.cardNumber}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        nin: {
                          ...prev.nin,
                          cardNumber: e.target.value
                        }
                      }))}
                      className="w-full px-4 py-2 bg-navy-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={profile.nin.dateOfBirth}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        nin: {
                          ...prev.nin,
                          dateOfBirth: e.target.value
                        }
                      }))}
                      className="w-full px-4 py-2 bg-navy-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {uploadData.isPaid && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Price (UGX)
                      </label>
                      <input
                        type="number"
                        min="500"
                        step="500"
                        value={uploadData.price}
                        onChange={(e) => setUploadData(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                        className="w-full px-4 py-2 bg-navy-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter price in UGX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Payment Information
                      </label>
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={uploadData.mtnNumber}
                          onChange={(e) => setUploadData(prev => ({ ...prev, mtnNumber: e.target.value }))}
                          className="w-full px-4 py-2 bg-navy-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="MTN Mobile Money Number"
                        />
                        <input
                          type="text"
                          value={uploadData.airtelNumber}
                          onChange={(e) => setUploadData(prev => ({ ...prev, airtelNumber: e.target.value }))}
                          className="w-full px-4 py-2 bg-navy-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Airtel Money Number"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Song File (MP3 only)
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-navy-900 hover:bg-navy-800">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Music className="w-10 h-10 text-gray-400 mb-3" />
                        <p className="mb-2 text-sm text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">MP3 (MAX. 10MB)</p>
                      </div>
                      <input
                        type="file"
                        name="songFile"
                        accept=".mp3,audio/mpeg"
                        className="hidden"
                        onChange={handleFileChange}
                        required
                      />
                    </label>
                  </div>
                  {previewUrl && (
                    <audio controls className="mt-4 w-full">
                      <source src={previewUrl} type="audio/mpeg" />
                    </audio>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Cover Image
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-navy-900 hover:bg-navy-800">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Image className="w-10 h-10 text-gray-400 mb-3" />
                        <p className="mb-2 text-sm text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG (MAX. 2MB)</p>
                      </div>
                      <input
                        type="file"
                        name="coverImage"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        required
                      />
                    </label>
                  </div>
                  {coverPreviewUrl && (
                    <img
                      src={coverPreviewUrl}
                      alt="Cover preview"
                      className="mt-4 w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
                >
                  Upload Song
                </button>
                
                <div className="mt-8 pt-8 border-t border-gray-700">
                  <h4 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h4>
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete all your songs? This action cannot be undone.')) {
                          // TODO: Implement delete all songs
                        }
                      }}
                      className="w-full py-3 px-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition"
                    >
                      Delete All Songs
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                          // TODO: Implement account deletion
                        }
                      }}
                      className="w-full py-3 px-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </form>
            
              {/* Artist Profile Section */}
              <div className="mt-12">
                <h3 className="text-xl font-bold text-white mb-6">Artist Profile</h3>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Gender
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="male"
                          checked={profile.gender === 'male'}
                          onChange={(e) => setProfile(prev => ({
                            ...prev,
                            gender: e.target.value as 'male' | 'female'
                          }))}
                          className="mr-2"
                        />
                        <span className="text-gray-400">Male</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="female"
                          checked={profile.gender === 'female'}
                          onChange={(e) => setProfile(prev => ({
                            ...prev,
                            gender: e.target.value as 'male' | 'female'
                          }))}
                          className="mr-2"
                        />
                        <span className="text-gray-400">Female</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Phone Number (Ugandan)
                    </label>
                    <input
                      type="tel"
                      pattern="^(\+256|0)[1-9]\d{8}$"
                      placeholder="+256 or 0..."
                      value={profile.phoneNumber}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        phoneNumber: e.target.value
                      }))}
                      className="w-full px-4 py-2 bg-navy-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      WhatsApp Number (Optional)
                    </label>
                    <input
                      type="tel"
                      pattern="^(\+256|0)[1-9]\d{8}$"
                      placeholder="+256 or 0..."
                      value={profile.whatsappNumber}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        whatsappNumber: e.target.value
                      }))}
                      className="w-full px-4 py-2 bg-navy-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        bio: e.target.value
                      }))}
                      rows={4}
                      className="w-full px-4 py-2 bg-navy-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Social Media Links</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Facebook
                      </label>
                      <input
                        type="url"
                        placeholder="https://facebook.com/..."
                        value={profile.socialLinks.facebook}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          socialLinks: {
                            ...prev.socialLinks,
                            facebook: e.target.value
                          }
                        }))}
                        className="w-full px-4 py-2 bg-navy-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        X (Twitter)
                      </label>
                      <input
                        type="url"
                        placeholder="https://x.com/..."
                        value={profile.socialLinks.twitter}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          socialLinks: {
                            ...prev.socialLinks,
                            twitter: e.target.value
                          }
                        }))}
                        className="w-full px-4 py-2 bg-navy-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        TikTok
                      </label>
                      <input
                        type="url"
                        placeholder="https://tiktok.com/@..."
                        value={profile.socialLinks.tiktok}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          socialLinks: {
                            ...prev.socialLinks,
                            tiktok: e.target.value
                          }
                        }))}
                        className="w-full px-4 py-2 bg-navy-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        YouTube
                      </label>
                      <input
                        type="url"
                        placeholder="https://youtube.com/@..."
                        value={profile.socialLinks.youtube}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          socialLinks: {
                            ...prev.socialLinks,
                            youtube: e.target.value
                          }
                        }))}
                        className="w-full px-4 py-2 bg-navy-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
                  >
                    Update Profile
                  </button>
                </form>
              </div>
            </div>
            )}

            {activeTab === 'songs' && (
              <div className="bg-navy-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-6">My Songs</h2>
                <div className="space-y-6">
                  {recentSongs.map((song, index) => (
                    <div key={index} className="bg-navy-900 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-white font-medium text-lg mb-1">{song.title}</h3>
                          <div className="flex items-center gap-6 text-sm text-gray-400">
                            <span>{song.plays.toLocaleString()} plays</span>
                            <span>{song.downloads.toLocaleString()} downloads</span>
                            <span className="text-yellow-400">{song.revenue.toLocaleString()} UGX</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedSong(selectedSong === song.id ? null : song.id)}
                          className={`px-4 py-2 rounded-lg transition ${
                            selectedSong === song.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-navy-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          View Analytics
                        </button>
                      </div>
                      
                      {selectedSong === song.id && (
                        <div className="mt-6 pt-6 border-t border-gray-700">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-white font-medium mb-4">Plays by Region</h4>
                              <div className="space-y-4">
                                {song.analytics.playsByRegion.map((region, idx) => (
                                  <div key={idx} className="bg-navy-800 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-gray-400">{region.region}</span>
                                      <span className="text-white">{region.count.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full h-2 bg-navy-700 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{
                                          width: `${(region.count / Math.max(...song.analytics.playsByRegion.map(r => r.count))) * 100}%`
                                        }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-white font-medium mb-4">Plays by Time</h4>
                              <div className="space-y-4">
                                {song.analytics.playsByTime.map((time, idx) => (
                                  <div key={idx} className="bg-navy-800 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-gray-400">{time.hour}</span>
                                      <span className="text-white">{time.count.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full h-2 bg-navy-700 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{
                                          width: `${(time.count / Math.max(...song.analytics.playsByTime.map(t => t.count))) * 100}%`
                                        }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="bg-navy-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Statistics</h2>
                
                {/* Revenue Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-navy-900 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>Today's Revenue</span>
                    </div>
                    <p className="text-xl font-bold text-white">
                      {revenueStats.daily.toLocaleString()} UGX
                    </p>
                  </div>
                  <div className="bg-navy-900 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>This Week</span>
                    </div>
                    <p className="text-xl font-bold text-white">
                      {revenueStats.weekly.toLocaleString()} UGX
                    </p>
                  </div>
                  <div className="bg-navy-900 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>This Month</span>
                    </div>
                    <p className="text-xl font-bold text-white">
                      {revenueStats.monthly.toLocaleString()} UGX
                    </p>
                  </div>
                  <div className="bg-navy-900 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>Growth</span>
                    </div>
                    <p className="text-xl font-bold text-green-400">
                      +{revenueStats.trend}%
                    </p>
                  </div>
                </div>

                {/* Revenue History Graph */}
                <div className="bg-navy-900 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Revenue History</h3>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {revenueHistory.map((day, index) => {
                      const height = (day.amount / Math.max(...revenueHistory.map(d => d.amount))) * 100;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full relative">
                            <div
                              className="absolute bottom-0 w-full bg-blue-500/20 rounded-t-lg"
                              style={{ height: `${height}%` }}
                            >
                              <div
                                className="w-full bg-blue-500 rounded-t-lg transition-all duration-500"
                                style={{ height: `${height}%` }}
                              />
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </p>
                          <p className="text-xs text-gray-400">{day.downloads} sales</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Revenue by Location */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="bg-navy-900 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Globe2 className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">Revenue by Location</h3>
                    </div>
                    <div className="space-y-4">
                      {revenueByLocation.map((location, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-gray-400">{location.location}</span>
                            <span className="text-white">{location.amount.toLocaleString()} UGX</span>
                          </div>
                          <div className="w-full h-2 bg-navy-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${location.percentage}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{location.percentage}% of total</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Revenue by Time */}
                  <div className="bg-navy-900 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-purple-400" />
                      <h3 className="text-lg font-semibold text-white">Revenue by Time</h3>
                    </div>
                    <div className="space-y-4">
                      {revenueByTime.map((time, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-gray-400">{time.time}</span>
                            <span className="text-white">{time.amount.toLocaleString()} UGX</span>
                          </div>
                          <div className="w-full h-2 bg-navy-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-500 rounded-full"
                              style={{ width: `${time.percentage}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{time.percentage}% of total</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Revenue Overview */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Revenue Overview</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setRevenueTimeframe('week')}
                        className={`px-3 py-1 rounded-lg ${
                          revenueTimeframe === 'week'
                            ? 'bg-blue-500 text-white'
                            : 'bg-navy-900 text-gray-400 hover:bg-navy-700'
                        }`}
                      >
                        Week
                      </button>
                      <button
                        onClick={() => setRevenueTimeframe('month')}
                        className={`px-3 py-1 rounded-lg ${
                          revenueTimeframe === 'month'
                            ? 'bg-blue-500 text-white'
                            : 'bg-navy-900 text-gray-400 hover:bg-navy-700'
                        }`}
                      >
                        Month
                      </button>
                      <button
                        onClick={() => setRevenueTimeframe('year')}
                        className={`px-3 py-1 rounded-lg ${
                          revenueTimeframe === 'year'
                            ? 'bg-blue-500 text-white'
                            : 'bg-navy-900 text-gray-400 hover:bg-navy-700'
                        }`}
                      >
                        Year
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-navy-900 rounded-lg p-6">
                    <div className="grid grid-cols-3 gap-6 mb-6">
                      {monthlyRevenue.map((item, index) => (
                        <div key={index} className="text-center">
                          <p className="text-gray-400 mb-2">{item.month}</p>
                          <p className="text-xl font-bold text-white">
                            {item.revenue.toLocaleString()} UGX
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="h-48 flex items-end justify-between gap-2">
                      {monthlyRevenue.map((item, index) => {
                        const height = (item.revenue / Math.max(...monthlyRevenue.map(i => i.revenue))) * 100;
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <div
                              className="w-full bg-blue-500/20 rounded-t-lg"
                              style={{ height: `${height}%` }}
                            >
                              <div
                                className="w-full bg-blue-500 rounded-t-lg transition-all duration-500"
                                style={{ height: `${height}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Revenue by Genre */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Revenue by Genre</h3>
                  <div className="space-y-4">
                    {revenueByGenre.map((item, index) => (
                      <div key={index} className="bg-navy-900 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400">{item.genre}</span>
                          <span className="text-white font-medium">
                            {item.revenue.toLocaleString()} UGX
                          </span>
                        </div>
                        <div className="w-full h-2 bg-navy-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{
                              width: `${(item.revenue / Math.max(...revenueByGenre.map(i => i.revenue))) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Top Performing Songs */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Top Performing Songs</h3>
                  <div className="space-y-4">
                    {recentSongs.map((song, index) => (
                      <div key={index} className="bg-navy-900 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium">{song.title}</h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                              <span>{song.plays.toLocaleString()} plays</span>
                              <span>{song.downloads.toLocaleString()} downloads</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-yellow-400 font-medium">
                              {song.revenue.toLocaleString()} UGX
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'followers' && (
              <div className="bg-navy-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Followers</h2>
                <div className="space-y-4">
                  {followers.map(follower => (
                    <div key={follower.id} className="bg-navy-900 rounded-lg p-4 flex items-center gap-4">
                      <img
                        src={follower.imageUrl}
                        alt={follower.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{follower.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{follower.location}</span>
                          <span>•</span>
                          <span>Followed {formatDistanceToNow(new Date(follower.followedOn), { addSuffix: true })}</span>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-navy-800 text-gray-400 hover:text-white rounded-lg transition">
                        View Profile
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}