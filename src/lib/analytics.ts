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

export interface UserBehavior {
  userId: string;
  sessionId: string;
  timestamp: Date;
  eventType: 'page_view' | 'music_play' | 'search' | 'download' | 'share' | 'comment';
  duration?: number;
  metadata: {
    pageUrl?: string;
    musicId?: string;
    searchQuery?: string;
    deviceType?: string;
    location?: string;
    timeOfDay?: string;
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

export const trackUserBehavior = async (behavior: UserBehavior) => {
  try {
    await addDoc(collection(db, 'userBehavior'), {
      ...behavior,
      timestamp: Timestamp.fromDate(behavior.timestamp)
    });
  } catch (error) {
    console.error('Error tracking user behavior:', error);
  }
};

export const getUserBehaviorAnalytics = async (startDate: Date, endDate: Date) => {
  const behaviorRef = collection(db, 'userBehavior');
  const q = query(
    behaviorRef,
    where('timestamp', '>=', Timestamp.fromDate(startDate)),
    where('timestamp', '<=', Timestamp.fromDate(endDate))
  );

  const snapshot = await getDocs(q);
  const behaviors = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  return {
    totalSessions: new Set(behaviors.map(b => b.sessionId)).size,
    averageSessionDuration: calculateAverageSessionDuration(behaviors),
    popularPages: getPopularPages(behaviors),
    userEngagement: calculateUserEngagement(behaviors),
    deviceUsage: getDeviceUsage(behaviors),
    timeDistribution: getTimeDistribution(behaviors)
  };
};

// Helper functions
function calculateAverageSessionDuration(behaviors: any[]) {
  const sessions = groupBySession(behaviors);
  const durations = sessions.map(session => {
    const start = Math.min(...session.map(b => b.timestamp.toDate()));
    const end = Math.max(...session.map(b => b.timestamp.toDate()));
    return end - start;
  });
  return durations.reduce((a, b) => a + b, 0) / durations.length;
}

function getPopularPages(behaviors: any[]) {
  const pageViews = behaviors.filter(b => b.eventType === 'page_view');
  const pageCounts = pageViews.reduce((acc, curr) => {
    acc[curr.metadata.pageUrl] = (acc[curr.metadata.pageUrl] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  return Object.entries(pageCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([page, count]) => ({ page, count }));
}

function calculateUserEngagement(behaviors: any[]) {
  const engagement = {
    musicPlays: behaviors.filter(b => b.eventType === 'music_play').length,
    downloads: behaviors.filter(b => b.eventType === 'download').length,
    shares: behaviors.filter(b => b.eventType === 'share').length,
    comments: behaviors.filter(b => b.eventType === 'comment').length
  };
  return engagement;
}

function getDeviceUsage(behaviors: any[]) {
  return behaviors.reduce((acc, curr) => {
    acc[curr.metadata.deviceType] = (acc[curr.metadata.deviceType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

function getTimeDistribution(behaviors: any[]) {
  return behaviors.reduce((acc, curr) => {
    acc[curr.metadata.timeOfDay] = (acc[curr.metadata.timeOfDay] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
} 