import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Plus,
  Check,
  X,
  Stethoscope,
  Wine,
  GraduationCap,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  organizer: string;
  attendees: number;
  maxAttendees?: number;
  type: 'reunion' | 'networking' | 'conference' | 'social';
  isAttending: boolean;
  yearGroup?: number;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Oxford Medical School Class of 2018 Reunion',
    description: 'Annual reunion for Oxford Medical School graduates. Join us for dinner, drinks, and catching up with old friends. Share your career journey and make new connections.',
    date: new Date('2024-03-15'),
    time: '7:00 PM',
    location: 'The Grand Hotel, Oxford',
    organizer: 'Dr. Sarah Johnson',
    attendees: 23,
    maxAttendees: 50,
    type: 'reunion',
    isAttending: true,
    yearGroup: 2018,
  },
  {
    id: '2',
    title: 'Medical Conference Networking Session',
    description: 'Informal networking session during the Annual Medical Conference. Great opportunity to discuss latest research and career developments.',
    date: new Date('2024-04-08'),
    time: '6:30 PM',
    location: 'Royal College of Physicians, London',
    organizer: 'Dr. Michael Chen',
    attendees: 15,
    maxAttendees: 30,
    type: 'networking',
    isAttending: false,
    yearGroup: 2018,
  },
  {
    id: '3',
    title: 'Cambridge Medical Society Dinner',
    description: 'Quarterly dinner for Cambridge medical graduates. Distinguished guest speaker and formal dining.',
    date: new Date('2024-05-20'),
    time: '7:30 PM',
    location: 'Trinity College, Cambridge',
    organizer: 'Dr. Emily Rodriguez',
    attendees: 35,
    maxAttendees: 40,
    type: 'social',
    isAttending: false,
    yearGroup: 2019,
  },
  {
    id: '4',
    title: 'Young Doctors Career Development Workshop',
    description: 'Interactive workshop focusing on career advancement, leadership skills, and work-life balance for early career doctors.',
    date: new Date('2024-06-12'),
    time: '9:00 AM',
    location: 'BMA House, London',
    organizer: 'British Medical Association',
    attendees: 67,
    maxAttendees: 100,
    type: 'conference',
    isAttending: true,
  },
];

export default function Events() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [filter, setFilter] = useState<'all' | 'attending' | 'available'>('all');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    
    if (!isAuthenticated || !userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleRSVP = (eventId: string, attending: boolean) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { 
              ...event, 
              isAttending: attending,
              attendees: attending ? event.attendees + 1 : Math.max(0, event.attendees - 1)
            }
          : event
      )
    );
    
    toast({
      title: attending ? "RSVP Confirmed" : "RSVP Cancelled",
      description: attending 
        ? "You're registered for this event. Details will be sent to your email."
        : "Your RSVP has been cancelled.",
    });
  };

  const filteredEvents = events.filter(event => {
    switch (filter) {
      case 'attending':
        return event.isAttending;
      case 'available':
        return !event.isAttending && event.date > new Date();
      default:
        return true;
    }
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'reunion':
        return GraduationCap;
      case 'networking':
        return Users;
      case 'conference':
        return Stethoscope;
      case 'social':
        return Wine;
      default:
        return Calendar;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'reunion':
        return 'bg-primary text-primary-foreground';
      case 'networking':
        return 'bg-success text-success-foreground';
      case 'conference':
        return 'bg-warning text-warning-foreground';
      case 'social':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const upcomingEvents = events.filter(event => event.date > new Date()).length;
  const attendingCount = events.filter(event => event.isAttending).length;

  if (!user) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={true} user={user} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="medical-gradient w-12 h-12 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  Events & Reunions
                </h1>
              </div>
              <p className="text-muted-foreground">
                Stay connected through yeargroup events, conferences, and social gatherings
              </p>
            </div>
            <Button variant="medical">
              <Plus className="w-4 h-4" />
              Create Event
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="shadow-soft border-0">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {upcomingEvents}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Upcoming Events
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success mb-1">
                        {attendingCount}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        You're Attending
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Filters */}
              <Card className="shadow-soft border-0">
                <CardHeader>
                  <CardTitle>Filter Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant={filter === 'all' ? 'medical' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setFilter('all')}
                  >
                    <Calendar className="w-4 h-4" />
                    All Events
                  </Button>
                  <Button
                    variant={filter === 'attending' ? 'medical' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setFilter('attending')}
                  >
                    <Check className="w-4 h-4" />
                    Attending
                  </Button>
                  <Button
                    variant={filter === 'available' ? 'medical' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setFilter('available')}
                  >
                    <Plus className="w-4 h-4" />
                    Available
                  </Button>
                </CardContent>
              </Card>

              {/* Event Types */}
              <Card className="shadow-soft border-0">
                <CardHeader>
                  <CardTitle>Event Types</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span>Reunions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                    <span>Networking</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-warning rounded-full"></div>
                    <span>Conferences</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>Social Events</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Events List */}
            <div className="lg:col-span-3 space-y-4">
              {filteredEvents.length === 0 ? (
                <Card className="p-8 text-center shadow-soft border-0">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No events found</h3>
                  <p className="text-muted-foreground mb-4">
                    {filter === 'all' 
                      ? "No events available at the moment."
                      : filter === 'attending'
                      ? "You're not attending any events yet."
                      : "No available events to join right now."
                    }
                  </p>
                  <Button variant="medical">
                    <Plus className="w-4 h-4" />
                    Create Your First Event
                  </Button>
                </Card>
              ) : (
                filteredEvents.map((event) => {
                  const EventIcon = getEventIcon(event.type);
                  const isPastEvent = event.date < new Date();
                  
                  return (
                    <Card key={event.id} className="shadow-soft border-0 hover:shadow-medium transition-all duration-200">
                      <CardContent className="p-6">
                        {/* Event Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getEventColor(event.type)}`}>
                              <EventIcon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-xl font-semibold text-foreground">
                                  {event.title}
                                </h3>
                                <Badge 
                                  variant="secondary"
                                  className={`capitalize ${getEventColor(event.type)}`}
                                >
                                  {event.type}
                                </Badge>
                              </div>
                              
                              <div className="space-y-2 mb-3">
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(event.date)}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{event.time}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                  <MapPin className="w-4 h-4" />
                                  <span>{event.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* RSVP Status */}
                          {event.isAttending && (
                            <Badge variant="secondary" className="bg-success text-success-foreground">
                              <Check className="w-3 h-3 mr-1" />
                              Attending
                            </Badge>
                          )}
                        </div>

                        {/* Event Description */}
                        <div className="mb-4">
                          <p className="text-foreground leading-relaxed">
                            {event.description}
                          </p>
                        </div>

                        {/* Event Details */}
                        <div className="flex items-center justify-between mb-4 p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4 text-primary" />
                              <span>{event.attendees} attending</span>
                              {event.maxAttendees && (
                                <span className="text-muted-foreground">/ {event.maxAttendees}</span>
                              )}
                            </div>
                            <div className="text-muted-foreground">
                              Organized by {event.organizer}
                            </div>
                          </div>
                          
                          {event.yearGroup && (
                            <Badge variant="outline">
                              Class of {event.yearGroup}
                            </Badge>
                          )}
                        </div>

                        {/* Action Buttons */}
                        {!isPastEvent && (
                          <div className="flex items-center space-x-3">
                            {event.isAttending ? (
                              <Button
                                variant="outline"
                                onClick={() => handleRSVP(event.id, false)}
                                className="flex-1"
                              >
                                <X className="w-4 h-4" />
                                Cancel RSVP
                              </Button>
                            ) : (
                              <Button
                                variant="medical"
                                onClick={() => handleRSVP(event.id, true)}
                                className="flex-1"
                                disabled={event.maxAttendees ? event.attendees >= event.maxAttendees : false}
                              >
                                <Check className="w-4 h-4" />
                                {event.maxAttendees && event.attendees >= event.maxAttendees ? 'Event Full' : 'RSVP'}
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              onClick={() => navigate(`/events/${event.id}`)}
                            >
                              View Details
                            </Button>
                          </div>
                        )}

                        {isPastEvent && (
                          <div className="text-center py-2">
                            <Badge variant="secondary" className="bg-muted text-muted-foreground">
                              Event Completed
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}