import { useState, useEffect } from 'react';
import { Event, supabase } from '@/lib/supabase';
import { UNIQUE_DISTRICTS } from '@/lib/ugandaData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Ticket, Clock, User, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import SEOHead from '@/components/SEOHead';
import { Link } from 'wouter';

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      let query = supabase
        .from('events')
        .select(`
          *,
          artist:profiles!artist_id(*)
        `)
        .eq('status', 'approved')
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true });

      const { data, error } = await query;

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleViewEvent = async (eventId: string) => {
    try {
      await supabase.rpc('increment_event_views', { event_id: eventId });
    } catch (error) {
      console.error('Error tracking event view:', error);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.artist?.display_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = eventTypeFilter === 'all' || event.event_type === eventTypeFilter;
    const matchesDistrict = districtFilter === 'all' || event.district === districtFilter;

    return matchesSearch && matchesType && matchesDistrict;
  });

  const featuredEvents = filteredEvents.filter(e => e.is_featured);
  const regularEvents = filteredEvents.filter(e => !e.is_featured);

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('en-GB', { day: '2-digit' }),
      month: date.toLocaleDateString('en-GB', { month: 'short' }),
      year: date.toLocaleDateString('en-GB', { year: 'numeric' }),
      time: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const EventCard = ({ event, featured = false }: { event: Event; featured?: boolean }) => {
    const eventDate = formatEventDate(event.event_date);

    return (
      <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 ${featured ? 'border-primary border-2' : ''}`}>
        <div className="flex flex-col md:flex-row">
          {/* Event Image */}
          <div className="relative md:w-80 h-64 md:h-auto flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/5">
            {event.cover_image_url ? (
              <img
                src={event.cover_image_url}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Calendar className="w-20 h-20 text-primary/40" />
              </div>
            )}
            
            {/* Date Badge */}
            <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-3 rounded-lg shadow-lg text-center">
              <div className="text-2xl font-bold">{eventDate.day}</div>
              <div className="text-xs uppercase">{eventDate.month}</div>
            </div>

            {featured && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                FEATURED
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-2 uppercase">
                  {event.event_type}
                </span>
                <h3 className="text-2xl font-bold text-card-foreground mb-2">{event.title}</h3>
                {event.artist && (
                  <Link href={`/artists/${event.artist.id}`}>
                    <a className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <User className="w-4 h-4" />
                      {event.artist.display_name}
                    </a>
                  </Link>
                )}
              </div>
            </div>

            <p className="text-muted-foreground mb-4 line-clamp-2">{event.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{eventDate.day} {eventDate.month} {eventDate.year}</span>
                <Clock className="w-4 h-4 text-primary ml-4" />
                <span>{eventDate.time}</span>
              </div>
              
              {event.venue && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{event.venue}, {event.location || event.district}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <Ticket className="w-4 h-4 text-primary" />
                {event.is_free ? (
                  <span className="font-semibold text-green-600 dark:text-green-400">FREE EVENT</span>
                ) : (
                  <span className="font-semibold text-primary">UGX {event.ticket_price.toLocaleString()}</span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              {event.booking_link ? (
                <Button
                  onClick={() => {
                    handleViewEvent(event.id);
                    window.open(event.booking_link, '_blank');
                  }}
                  className="flex-1"
                >
                  <Ticket className="w-4 h-4 mr-2" />
                  Book Tickets
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    handleViewEvent(event.id);
                    if (event.contact_phone) {
                      window.open(`tel:${event.contact_phone}`, '_blank');
                    } else if (event.contact_email) {
                      window.open(`mailto:${event.contact_email}`, '_blank');
                    } else {
                      toast.info('Contact information not available');
                    }
                  }}
                  className="flex-1"
                >
                  Contact Organizer
                </Button>
              )}
              <Button variant="outline" onClick={() => {
                const shareText = `Check out ${event.title} on Ateker Music!`;
                if (navigator.share) {
                  navigator.share({
                    title: event.title,
                    text: shareText,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(shareText + ' ' + window.location.href);
                  toast.success('Link copied to clipboard!');
                }
              }}>
                Share
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Events - Concerts, Festivals & Bookings"
        description="Discover upcoming music events, concerts, festivals, and artist bookings in Eastern Uganda. Book tickets and connect with local artists."
        keywords={["Uganda music events", "concerts", "festivals", "artist bookings", "Teso events", "Eastern Uganda entertainment"]}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-12">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Upcoming <span className="text-primary">Events</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover concerts, festivals, workshops, and artist bookings happening across Eastern Uganda
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search events, artists, or venues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="concert">Concerts</SelectItem>
              <SelectItem value="festival">Festivals</SelectItem>
              <SelectItem value="booking">Bookings</SelectItem>
              <SelectItem value="workshop">Workshops</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={districtFilter} onValueChange={setDistrictFilter}>
            <SelectTrigger className="w-full md:w-48">
              <MapPin className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              <SelectItem value="all">All Locations</SelectItem>
              {UNIQUE_DISTRICTS.map((district: string) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">No upcoming events found</p>
            <p className="text-sm text-muted-foreground mt-2">Check back later for new events!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured Events */}
            {featuredEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-yellow-500">★</span> Featured Events
                </h2>
                <div className="space-y-6">
                  {featuredEvents.map(event => (
                    <EventCard key={event.id} event={event} featured />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Events */}
            {regularEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">All Events</h2>
                <div className="space-y-6">
                  {regularEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
