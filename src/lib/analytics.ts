import { collection, addDoc, query, where, getDocs, Timestamp, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export interface AnalyticsEvent {
  type: 'page_view' | 'artist_application' | 'artist_approval' | 'artist_rejection' | 
        'login' | 'music_play' | 'profile_update' | 'search';
  userId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AnalyticsData {
  totalUsers: number;
  totalArtists: number;
  pendingApplications: number;
  approvedArtists: number;
  rejectedApplications: number;
  genres: Record<string, number>;
  dailyEvents: Record<string, number>;
  monthlyEvents: Record<string, number>;
  popularSearches: string[];
  userEngagement: {
    averageSessionDuration: number;
    pagesPerSession: number;
    bounceRate: number;
  };
}

export const trackEvent = async (event: AnalyticsEvent) => {
  try {
    await addDoc(collection(db, 'analytics'), {
      ...event,
      timestamp: Timestamp.fromDate(event.timestamp)
    });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

export const getAnalyticsData = async (startDate: Date, endDate: Date): Promise<AnalyticsData> => {
  const analyticsRef = collection(db, 'analytics');
  const q = query(
    analyticsRef,
    where('timestamp', '>=', Timestamp.fromDate(startDate)),
    where('timestamp', '<=', Timestamp.fromDate(endDate)),
    orderBy('timestamp', 'desc')
  );

  const snapshot = await getDocs(q);
  const events = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  // Process analytics data
  const analyticsData: AnalyticsData = {
    totalUsers: 0,
    totalArtists: 0,
    pendingApplications: 0,
    approvedArtists: 0,
    rejectedApplications: 0,
    genres: {},
    dailyEvents: {},
    monthlyEvents: {},
    popularSearches: [],
    userEngagement: {
      averageSessionDuration: 0,
      pagesPerSession: 0,
      bounceRate: 0
    }
  };

  // Calculate metrics
  events.forEach(event => {
    switch (event.type) {
      case 'artist_application':
        analyticsData.pendingApplications++;
        break;
      case 'artist_approval':
        analyticsData.approvedArtists++;
        break;
      case 'artist_rejection':
        analyticsData.rejectedApplications++;
        break;
      // Add more event type processing
    }
  });

  return analyticsData;
}; 