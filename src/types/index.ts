export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'user' | 'artist' | 'admin';
  isVerified: boolean;
  isEmailVerified: boolean;
  isApproved: boolean;
  nin?: {
    number: string;
    cardNumber: string;
    dateOfBirth: string;
  };
  gender: 'male' | 'female';
  phoneNumber: string;
  whatsappNumber?: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
  };
  createdAt: string;
  followers: number;
  following: string[];
}

export interface Song {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  coverUrl: string;
  songUrl: string;
  downloadCount: number;
  playCount: number;
  likeCount: number;
  price: number;
  isPaid: boolean;
  createdAt: string;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    startDate: string;
    endDate: string;
    code?: string;
  };
  artistPaymentInfo?: {
    mtnNumber?: string;
    airtelNumber?: string;
  };
  revenue?: {
    daily: number;
    weekly: number;
    monthly: number;
    total: number;
  };
}

export interface ArtistProfile extends User {
  bio: string;
  genres: string[];
  location: string;
  stats: {
    totalPlays: number;
    totalDownloads: number;
    totalLikes: number;
    totalRevenue: number;
    monthlyRevenue: number;
  };
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  type: 'bundle' | 'discount' | 'flash';
  discount: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  startDate: string;
  endDate: string;
  imageUrl?: string;
  conditions?: string[];
  code?: string;
  minimumPurchase?: number;
  appliesTo: {
    type: 'all' | 'genre' | 'artist' | 'songs';
    value?: string[];
  };
}

export interface PaymentInfo {
  provider: 'MTN' | 'AIRTEL';
  phoneNumber: string;
  amount: number;
  currency: 'UGX';
  reference: string;
  description?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  status: 'pending' | 'completed' | 'failed';
  amount?: number;
  currency?: string;
  paymentDate?: string;
}

export interface GuestUser {
  email?: string;
  phoneNumber?: string;
  createdAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl?: string;
  authorId: string;
  authorName: string;
  likeCount: number;
  readCount: number;
  createdAt: string;
  isPublished: boolean;
  category: 'local' | 'international' | 'entertainment' | 'football' | 'politics' | 'education';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  date: string;
  location: string;
  artistId: string;
  artistName: string;
  isPublished: boolean;
  createdAt: string;
}