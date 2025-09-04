import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Heart,
  MessageCircle,
  Share2,
  Users,
  Briefcase,
  Home,
  Calendar,
  MapPin,
  Clock,
  Send,
  Image,
  FileText,
  Lock,
  Globe,
  TrendingUp,
  Award,
  BookOpen,
  UserPlus,
  Bell,
  Settings,
  ChevronRight,
  Stethoscope,
  School,
  MoreHorizontal,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  mockUsers,
  mockPosts, 
  mockJobs, 
  mockProperties,
  mockEvents,
  mockYeargroups,
  mockFriendships,
  mockNotifications,
  Post,
  Comment
} from '@/data/enhancedMockData';
import { medicalSchools } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, notifications } = useAuth();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPost, setNewPost] = useState('');
  const [postVisibility, setPostVisibility] = useState<'yeargroup' | 'friends'>('yeargroup');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get user's yeargroup
  const userYeargroup = user && mockYeargroups.find(yg => 
    yg.medicalSchoolId === user.medicalSchoolId && 
    yg.graduationYear === user.graduationYear
  );
  
  const userSchool = user && medicalSchools.find(s => s.id === user.medicalSchoolId);
  
  // Get user's friends
  const userFriends = mockFriendships
    .filter(f => 
      (f.userId === user?.id || f.friendId === user?.id) && 
      f.status === 'accepted'
    )
    .map(f => f.userId === user?.id ? f.friendId : f.userId);
  
  // Get feed posts (from friends and yeargroup)
  const feedPosts = posts
    .filter(p => 
      (p.yeargroupId === userYeargroup?.id && p.visibility === 'yeargroup') ||
      (userFriends.includes(p.userId) && p.visibility === 'friends') ||
      p.userId === user?.id
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  // Get recent jobs
  const recentJobs = mockJobs
    .filter(j => j.isActive)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  // Get recent properties
  const recentProperties = mockProperties
    .filter(p => p.isActive)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2);
  
  // Get upcoming events
  const upcomingEvents = mockEvents
    .filter(e => 
      e.yeargroupId === userYeargroup?.id && 
      new Date(e.eventDate) > new Date()
    )
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 2);
  
  // Get unread notifications count
  const unreadNotifications = notifications?.filter(n => !n.isRead).length || 0;

  const handleCreatePost = () => {
    if (!newPost.trim() || !user || !userYeargroup) return;
    
    const post: Post = {
      id: `p${Date.now()}`,
      userId: user.id,
      yeargroupId: userYeargroup.id,
      content: newPost,
      visibility: postVisibility,
      imageUrls: [],
      documentUrls: [],
      likesCount: 0,
      commentsCount: 0,
      likedBy: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setPosts([post, ...posts]);
    setNewPost('');
    
    toast({
      title: "Post created",
      description: "Your post has been shared successfully.",
    });
  };

  const handleLikePost = (postId: string) => {
    if (!user) return;
    
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const isLiked = p.likedBy.includes(user.id);
        return {
          ...p,
          likesCount: isLiked ? p.likesCount - 1 : p.likesCount + 1,
          likedBy: isLiked 
            ? p.likedBy.filter(id => id !== user.id)
            : [...p.likedBy, user.id]
        };
      }
      return p;
    }));
  };

  const getPostAuthor = (userId: string) => {
    return mockUsers.find(u => u.id === userId);
  };

  // Calculate profile completion
  const profileCompletion = user ? [
    user.bio ? 20 : 0,
    user.currentPosition ? 20 : 0,
    user.location ? 20 : 0,
    user.profileImageUrl ? 20 : 0,
    user.emailVerified ? 20 : 0,
  ].reduce((a, b) => a + b, 0) : 0;

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="animate-in fade-in-0 slide-in-from-top-4 duration-700">
          <Card className="medical-gradient text-white overflow-hidden shadow-2xl border-0">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <Avatar className="h-20 w-20 border-4 border-white/20 shadow-xl">
                    <AvatarImage src={user.profileImageUrl} />
                    <AvatarFallback className="text-primary text-lg font-bold bg-white">
                      {user.firstName[0]}{user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-3">
                    <div>
                      <h1 className="text-4xl font-bold tracking-tight">
                        Welcome back, Dr. {user.firstName}!
                      </h1>
                      <div className="flex items-center space-x-4 text-white/90 mt-2">
                        <span className="flex items-center bg-white/10 rounded-full px-3 py-1">
                          <Stethoscope className="h-4 w-4 mr-2" />
                          {user.specialty}
                        </span>
                        <span className="flex items-center bg-white/10 rounded-full px-3 py-1">
                          <School className="h-4 w-4 mr-2" />
                          {userSchool?.name}
                        </span>
                        <span className="flex items-center bg-white/10 rounded-full px-3 py-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          Class of {user.graduationYear}
                        </span>
                      </div>
                    </div>
                    
                    {/* Stats Row */}
                    <div className="flex items-center space-x-8 text-sm bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="text-center">
                        <div className="font-bold text-2xl">{userFriends.length}</div>
                        <div className="text-white/70">connections</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-2xl">{posts.filter(p => p.userId === user.id).length}</div>
                        <div className="text-white/70">posts</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-2xl">{upcomingEvents.length}</div>
                        <div className="text-white/70">events</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-2xl">{profileCompletion}%</div>
                        <div className="text-white/70">complete</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button variant="secondary" size="sm" onClick={() => navigate('/search')} className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Find Colleagues
                  </Button>
                  <Button variant="secondary" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-200">

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feed Column */}
          <div className="lg:col-span-2 space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* Create Post */}
                <Card className="border-0 shadow-soft">
                  <CardContent className="p-4">
                    <div className="flex space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profileImageUrl} />
                        <AvatarFallback>
                          {user.firstName[0]}{user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <Textarea
                          placeholder="Share an update with your network..."
                          value={newPost}
                          onChange={(e) => setNewPost(e.target.value)}
                          className="min-h-[80px] resize-none"
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Image className="h-4 w-4 mr-1" />
                              Photo
                            </Button>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              Document
                            </Button>
                            <Select value={postVisibility} onValueChange={(v: any) => setPostVisibility(v)}>
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yeargroup">
                                  <div className="flex items-center">
                                    <Users className="h-3 w-3 mr-1" />
                                    Yeargroup
                                  </div>
                                </SelectItem>
                                <SelectItem value="friends">
                                  <div className="flex items-center">
                                    <Lock className="h-3 w-3 mr-1" />
                                    Friends Only
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button 
                            variant="medical" 
                            size="sm"
                            onClick={handleCreatePost}
                            disabled={!newPost.trim()}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity Feed */}
                {feedPosts.length === 0 ? (
                  <Card className="border-0 shadow-soft p-8 text-center">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground">
                      Connect with colleagues to see their updates here
                    </p>
                  </Card>
                ) : (
                  feedPosts.map((post) => {
                    const author = getPostAuthor(post.userId);
                    const isLiked = post.likedBy.includes(user.id);
                    
                    return (
                      <Card key={post.id} className="border-0 shadow-soft">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={author?.profileImageUrl} />
                                <AvatarFallback>
                                  {author?.firstName[0]}{author?.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold">
                                  Dr. {author?.firstName} {author?.lastName}
                                  {author?.id === user.id && <Badge className="ml-2 text-xs">You</Badge>}
                                </h4>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <span>{author?.specialty}</span>
                                  <span>•</span>
                                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                  {post.visibility === 'friends' && (
                                    <>
                                      <span>•</span>
                                      <Lock className="h-3 w-3" />
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <p className="text-foreground mb-3">{post.content}</p>
                          
                          {post.imageUrls.length > 0 && (
                            <div className="mb-3 grid grid-cols-2 gap-2">
                              {post.imageUrls.map((url, idx) => (
                                <img 
                                  key={idx}
                                  src={url}
                                  alt=""
                                  className="rounded-lg w-full h-48 object-cover"
                                />
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between pt-3 border-t">
                            <div className="flex items-center space-x-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLikePost(post.id)}
                                className={isLiked ? 'text-red-500' : ''}
                              >
                                <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                                {post.likesCount}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MessageCircle className="h-4 w-4 mr-1" />
                                {post.commentsCount}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4 mr-1" />
                                Share
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <Card className="border-0 shadow-soft">
                  <CardHeader>
                    <CardTitle>Your Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="font-medium">Joined MyYearGroup</p>
                          <p className="text-sm text-muted-foreground">
                            {user.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {user.approvedAt && (
                        <div className="flex space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="font-medium">Account Approved</p>
                            <p className="text-sm text-muted-foreground">
                              {user.approvedAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                      {posts.filter(p => p.userId === user.id).slice(0, 3).map(post => (
                        <div key={post.id} className="flex space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="font-medium">Posted an update</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm mt-1 line-clamp-2">{post.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card className="border-0 shadow-soft">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium">Profile views this week</p>
                            <p className="text-sm text-muted-foreground">12 medical professionals viewed your profile</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Heart className="h-5 w-5 text-red-500" />
                          <div>
                            <p className="font-medium">Post engagement</p>
                            <p className="text-sm text-muted-foreground">Your posts received 34 likes this month</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Users className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium">New connections</p>
                            <p className="text-sm text-muted-foreground">3 new colleagues connected with you</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Upcoming Events</CardTitle>
                    <Link to="/events">
                      <Button variant="ghost" size="sm">
                        View all
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="space-y-2">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                        <MapPin className="h-3 w-3 ml-2" />
                        <span>{event.location}</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        RSVP
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Latest Opportunities */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Latest Opportunities</CardTitle>
                  <Link to="/jobs">
                    <Button variant="ghost" size="sm">
                      View all
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentJobs.slice(0, 2).map(job => (
                  <div key={job.id} className="space-y-1">
                    <h4 className="font-medium text-sm line-clamp-1">{job.title}</h4>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Briefcase className="h-3 w-3" />
                      <span>{job.hospital}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/jobs')}>
                  Browse all jobs
                </Button>
              </CardContent>
            </Card>

            {/* Property Exchange */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Property Exchange</CardTitle>
                  <Link to="/properties">
                    <Button variant="ghost" size="sm">
                      View all
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentProperties.slice(0, 2).map(property => (
                  <div key={property.id} className="space-y-1">
                    <h4 className="font-medium text-sm line-clamp-1">{property.title}</h4>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Home className="h-3 w-3" />
                      <span>{property.type === 'swap' ? 'House Swap' : 'For Rent'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => navigate('/yeargroup')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Visit Your Yeargroup
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => navigate('/search')}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Find Colleagues
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => navigate('/events')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}