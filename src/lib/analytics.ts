import { collection, addDoc, query, where, getDocs, Timestamp, orderBy, doc, getDoc, updateDoc } from 'firebase/firestore';
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

export interface ABTest {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  variants: {
    id: string;
    name: string;
    description: string;
    config: Record<string, any>;
  }[];
  metrics: string[];
  status: 'active' | 'completed' | 'draft';
  results?: {
    variantId: string;
    impressions: number;
    conversions: number;
    conversionRate: number;
    confidence: number;
  }[];
}

export interface EventNotification {
  id: string;
  type: 'concert' | 'release' | 'meetup' | 'workshop';
  title: string;
  description: string;
  date: Date;
  location?: string;
  attendees: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface Cohort {
  id: string;
  name: string;
  description: string;
  criteria: {
    startDate: Date;
    endDate: Date;
    userProperties?: Record<string, any>;
    events?: string[];
  };
  users: string[];
  metrics: {
    retention: Record<string, number>;
    engagement: Record<string, number>;
    conversion: Record<string, number>;
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

export const createABTest = async (test: Omit<ABTest, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'abTests'), {
      ...test,
      createdAt: new Date(),
      status: 'draft'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating A/B test:', error);
    throw error;
  }
};

export const trackABTestVariant = async (testId: string, variantId: string, userId: string) => {
  try {
    await addDoc(collection(db, 'abTestImpressions'), {
      testId,
      variantId,
      userId,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error tracking A/B test variant:', error);
  }
};

export const trackABTestConversion = async (testId: string, variantId: string, userId: string) => {
  try {
    await addDoc(collection(db, 'abTestConversions'), {
      testId,
      variantId,
      userId,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error tracking A/B test conversion:', error);
  }
};

export const getABTestResults = async (testId: string) => {
  const impressionsRef = collection(db, 'abTestImpressions');
  const conversionsRef = collection(db, 'abTestConversions');
  
  const [impressionsSnapshot, conversionsSnapshot] = await Promise.all([
    getDocs(query(impressionsRef, where('testId', '==', testId))),
    getDocs(query(conversionsRef, where('testId', '==', testId)))
  ]);

  const impressions = impressionsSnapshot.docs.map(doc => doc.data());
  const conversions = conversionsSnapshot.docs.map(doc => doc.data());

  // Calculate results for each variant
  const results = await Promise.all(
    impressions.map(async (impression) => {
      const variantConversions = conversions.filter(
        conv => conv.variantId === impression.variantId
      );
      
      const conversionRate = variantConversions.length / impressions.length;
      const confidence = calculateConfidenceInterval(
        variantConversions.length,
        impressions.length
      );

      return {
        variantId: impression.variantId,
        impressions: impressions.length,
        conversions: variantConversions.length,
        conversionRate,
        confidence
      };
    })
  );

  return results;
};

function calculateConfidenceInterval(conversions: number, impressions: number): number {
  // Implement Wilson score interval calculation
  const z = 1.96; // 95% confidence level
  const p = conversions / impressions;
  const denominator = 1 + z * z / impressions;
  const center = (p + z * z / (2 * impressions)) / denominator;
  const interval = z * Math.sqrt((p * (1 - p) + z * z / (4 * impressions)) / impressions) / denominator;
  return interval;
}

export const createCohort = async (cohort: Omit<Cohort, 'id' | 'users' | 'metrics'>) => {
  try {
    const docRef = await addDoc(collection(db, 'cohorts'), {
      ...cohort,
      users: [],
      metrics: {
        retention: {},
        engagement: {},
        conversion: {}
      },
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating cohort:', error);
    throw error;
  }
};

export const analyzeCohort = async (cohortId: string) => {
  const cohortRef = doc(db, 'cohorts', cohortId);
  const cohortDoc = await getDoc(cohortRef);
  const cohort = cohortDoc.data() as Cohort;

  // Get user behavior data for the cohort
  const behaviorRef = collection(db, 'userBehavior');
  const q = query(
    behaviorRef,
    where('userId', 'in', cohort.users),
    where('timestamp', '>=', cohort.criteria.startDate),
    where('timestamp', '<=', cohort.criteria.endDate)
  );

  const snapshot = await getDocs(q);
  const behaviors = snapshot.docs.map(doc => doc.data());

  // Calculate cohort metrics
  const metrics = {
    retention: calculateRetention(behaviors),
    engagement: calculateEngagement(behaviors),
    conversion: calculateConversion(behaviors)
  };

  // Update cohort with metrics
  await updateDoc(cohortRef, { metrics });

  return metrics;
};

function calculateRetention(behaviors: any[]) {
  const retention: Record<string, number> = {};
  const userSessions = groupByUser(behaviors);

  // Calculate retention for different time periods (7d, 14d, 30d, etc.)
  [7, 14, 30, 60, 90].forEach(days => {
    const retainedUsers = userSessions.filter(session => {
      const firstActivity = new Date(session[0].timestamp.toDate());
      const lastActivity = new Date(session[session.length - 1].timestamp.toDate());
      const daysActive = (lastActivity.getTime() - firstActivity.getTime()) / (1000 * 60 * 60 * 24);
      return daysActive >= days;
    }).length;

    retention[`${days}d`] = (retainedUsers / userSessions.length) * 100;
  });

  return retention;
}

function calculateEngagement(behaviors: any[]) {
  const engagement: Record<string, number> = {};
  
  // Calculate average session duration
  const sessionDurations = behaviors.reduce((acc, curr) => {
    if (curr.eventType === 'session_end' && curr.metadata?.duration) {
      acc.push(curr.metadata.duration);
    }
    return acc;
  }, [] as number[]);

  engagement.averageSessionDuration = 
    sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length;

  // Calculate events per user
  const userEvents = groupByUser(behaviors);
  engagement.eventsPerUser = 
    behaviors.length / userEvents.length;

  return engagement;
}

function calculateConversion(behaviors: any[]) {
  const conversion: Record<string, number> = {};
  
  // Calculate conversion rates for different events
  const eventTypes = ['music_play', 'download', 'share', 'comment'];
  eventTypes.forEach(eventType => {
    const eventCount = behaviors.filter(b => b.eventType === eventType).length;
    conversion[eventType] = (eventCount / behaviors.length) * 100;
  });

  return conversion;
}

function groupByUser(behaviors: any[]) {
  return Object.values(
    behaviors.reduce((acc, curr) => {
      if (!acc[curr.userId]) {
        acc[curr.userId] = [];
      }
      acc[curr.userId].push(curr);
      return acc;
    }, {} as Record<string, any[]>)
  );
} 