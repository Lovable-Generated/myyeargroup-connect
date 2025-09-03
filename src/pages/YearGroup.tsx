import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/layout/Navbar';
import { mockDoctors, mockPosts, getPostsByYearGroup, getDoctorById } from '@/data/mockData';
import {
  Users,
  Search,
  UserPlus,
  Calendar,
  MapPin,
  Stethoscope,
  Heart,
  MessageCircle,
  Share2,
  Filter,
} from 'lucide-react';

export default function YearGroup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('feed');

  const selectedSchool = searchParams.get('school') || 'University of Oxford';
  const selectedYear = parseInt(searchParams.get('year') || '2018');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    
    if (!isAuthenticated || !userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  // Get yeargroup members
  const yearGroupMembers = mockDoctors.filter(
    doctor => doctor.medicalSchool === selectedSchool && 
              doctor.graduationYear === selectedYear && 
              doctor.isApproved
  );

  // Get yeargroup posts
  const yearGroupPosts = getPostsByYearGroup(selectedYear)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Filter members based on search
  const filteredMembers = yearGroupMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const handleSendFriendRequest = (doctorId: string) => {
    // Mock friend request functionality
    console.log('Sending friend request to:', doctorId);
  };

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
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="medical-gradient w-12 h-12 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  {selectedSchool} - Class of {selectedYear}
                </h1>
                <p className="text-muted-foreground">
                  {yearGroupMembers.length} verified medical professionals
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 text-center shadow-soft border-0">
                <div className="text-2xl font-bold text-primary mb-1">{yearGroupMembers.length}</div>
                <div className="text-sm text-muted-foreground">Members</div>
              </Card>
              <Card className="p-4 text-center shadow-soft border-0">
                <div className="text-2xl font-bold text-success mb-1">{yearGroupPosts.length}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </Card>
              <Card className="p-4 text-center shadow-soft border-0">
                <div className="text-2xl font-bold text-warning mb-1">3</div>
                <div className="text-sm text-muted-foreground">Events</div>
              </Card>
              <Card className="p-4 text-center shadow-soft border-0">
                <div className="text-2xl font-bold text-primary mb-1">12</div>
                <div className="text-sm text-muted-foreground">Specialties</div>
              </Card>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
              <TabsTrigger value="feed" className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>Feed</span>
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Members</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Events</span>
              </TabsTrigger>
            </TabsList>

            {/* Feed Tab */}
            <TabsContent value="feed" className="space-y-4">
              {yearGroupPosts.length === 0 ? (
                <Card className="p-8 text-center shadow-soft border-0">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to share an update with your yeargroup!
                  </p>
                  <Button variant="medical" onClick={() => navigate('/dashboard')}>
                    Create a Post
                  </Button>
                </Card>
              ) : (
                yearGroupPosts.map((post) => {
                  const author = getDoctorById(post.authorId);
                  if (!author) return null;

                  return (
                    <Card key={post.id} className="shadow-soft border-0">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-3 mb-4">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-foreground">
                              {author.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-foreground">{author.name}</h4>
                              <span className="medical-badge">
                                {author.specialty}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>{formatRelativeTime(post.createdAt)}</span>
                              <MapPin className="w-3 h-3" />
                              <span>{author.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-foreground leading-relaxed">{post.content}</p>
                        </div>

                        <div className="flex items-center space-x-6 pt-3 border-t border-border">
                          <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:text-red-500">
                            <Heart className="w-4 h-4" />
                            <span>{post.likes}</span>
                          </Button>
                          
                          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments.length}</span>
                          </Button>
                          
                          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-6">
              {/* Search */}
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search members by name, specialty, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 medical-input"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>

              {/* Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => (
                  <Card key={member.id} className="shadow-soft border-0 hover:shadow-medium transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-lg font-medium text-primary-foreground">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">{member.name}</h3>
                        <div className="space-y-1">
                          <span className="medical-badge">
                            {member.specialty}
                          </span>
                          <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{member.location}</span>
                          </div>
                        </div>
                      </div>

                      {member.bio && (
                        <p className="text-sm text-muted-foreground text-center mb-4 line-clamp-2">
                          {member.bio}
                        </p>
                      )}

                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="medical" 
                          size="sm"
                          className="flex-1"
                          onClick={() => handleSendFriendRequest(member.id)}
                        >
                          <UserPlus className="w-3 h-3" />
                          Connect
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/profile/${member.id}`)}
                        >
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredMembers.length === 0 && (
                <Card className="p-8 text-center shadow-soft border-0">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No members found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria
                  </p>
                </Card>
              )}
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-4">
              <div className="grid gap-4">
                {/* Upcoming Events */}
                <Card className="shadow-soft border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span>Class Reunion 2024</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Saturday, March 15, 2024 at 7:00 PM</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>The Grand Hotel, Oxford</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Join us for our annual class reunion! Catch up with old friends, 
                      share career updates, and enjoy an evening of networking.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-success">23 attending</span>
                      <Button variant="medical" size="sm">
                        RSVP
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-soft border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Stethoscope className="w-5 h-5 text-primary" />
                      <span>Medical Conference Meetup</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Monday, April 8, 2024 at 6:30 PM</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>Royal College of Physicians, London</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Informal networking session during the Annual Medical Conference. 
                      Great opportunity to discuss latest research and career developments.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-success">15 attending</span>
                      <Button variant="medical" size="sm">
                        RSVP
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}