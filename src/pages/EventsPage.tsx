import { Search, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import type { Event } from '../types';

export default function EventsPage() {
  const events: Event[] = [
    {
      id: '1',
      title: 'Teso Music Festival 2024',
      description: 'Join us for the biggest celebration of Teso music and culture.',
      imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070',
      date: new Date('2024-07-15').toISOString(),
      location: 'Soroti Stadium',
      artistId: '1',
      artistName: 'Various Artists',
      isPublished: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Gospel Night Concert',
      description: 'A night of worship and praise with top gospel artists.',
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070',
      date: new Date('2024-08-20').toISOString(),
      location: 'Soroti Hotel',
      artistId: '2',
      artistName: 'Sarah Apio',
      isPublished: true,
      createdAt: new Date().toISOString()
    }
  ];

  return (
    <main className="min-h-screen bg-navy-900 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Upcoming Events</h1>
            <p className="text-gray-400">Don't miss out on these amazing events</p>
          </div>

          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder="Search events..."
              className="w-full px-12 py-3 bg-navy-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map(event => (
            <div
              key={event.id}
              className="bg-navy-800 rounded-lg overflow-hidden hover:scale-[1.01] transition group"
            >
              <div className="relative h-48">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-400 text-sm mb-2">
                  {event.description}
                </p>
                <Link
                  to={`/events/${event.id}`}
                  className="inline-block text-blue-400 hover:text-blue-300 mb-4"
                >
                  Read more →
                </Link>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}