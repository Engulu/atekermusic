import { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { getAnalyticsData } from '../lib/analytics';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = timeRange === 'day' 
        ? subDays(endDate, 1)
        : timeRange === 'week'
        ? subDays(endDate, 7)
        : startOfMonth(endDate);

      const data = await getAnalyticsData(startDate, endDate);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading analytics...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('day')}
            className={`px-4 py-2 rounded ${
              timeRange === 'day' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded ${
              timeRange === 'week' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded ${
              timeRange === 'month' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold">{analytics?.totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Artists</h3>
          <p className="text-3xl font-bold">{analytics?.totalArtists}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Pending Applications</h3>
          <p className="text-3xl font-bold">{analytics?.pendingApplications}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Approved Artists</h3>
          <p className="text-3xl font-bold">{analytics?.approvedArtists}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Genre Distribution</h3>
          <Pie
            data={{
              labels: Object.keys(analytics?.genres || {}),
              datasets: [{
                data: Object.values(analytics?.genres || {}),
                backgroundColor: [
                  '#4F46E5',
                  '#10B981',
                  '#F59E0B',
                  '#EF4444',
                  '#8B5CF6'
                ]
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'right'
                }
              }
            }}
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Daily Events</h3>
          <Line
            data={{
              labels: Object.keys(analytics?.dailyEvents || {}),
              datasets: [{
                label: 'Events',
                data: Object.values(analytics?.dailyEvents || {}),
                borderColor: '#4F46E5',
                tension: 0.1
              }]
            }}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
} 