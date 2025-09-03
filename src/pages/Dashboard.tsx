import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/layout/Navbar';
import { mockDoctors, mockPosts, mockJobs, mockProperties, getDoctorById, getFriendsPosts, Post } from '@/data/mockData';
import {
  Heart,
  MessageCircle,
  Share2,
  Plus,
  Users,
  Briefcase,
  Home,
  Calendar,
  MapPin,
  Clock,
  PenTool,
  Image as ImageIcon,
  Send,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [postVisibility, setPostVisibility] = useState<'yeargroup' | 'friends'>('yeargroup');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    
    if (!isAuthenticated || !userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Load user's feed (yeargroup + friends posts)
    const userDoc = getDoctorById(parsedUser.id) || mockDoctors[0];
    const friendsPosts = getFriendsPosts(userDoc.id);
    setPosts(friendsPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
  }, [navigate]);

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    
    setIsPosting(true);
    
    // Simulate post creation
    setTimeout(() => {
      const post: Post = {
        id: Date.now().toString(),
        authorId: user.id,
        content: newPost,
        visibility: postVisibility,
        likes: 0,
        comments: [],
        createdAt: new Date(),
      };
      
      setPosts(prev => [post, ...prev]);
      setNewPost('');
      setIsPosting(false);
      
      toast({
        title: "Post Created!",
        description: `Your post has been shared with your ${postVisibility}.`,
      });
    }, 1000);
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const quickStats = {
    yearGroupMembers: mockDoctors.filter(d => d.graduationYear === 2018 && d.isApproved).length,
    friendsCount: user ? (getDoctorById(user.id)?.friends.length || 0) : 0,
    activeJobs: mockJobs.length,
    availableProperties: mockProperties.length,
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
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Welcome back, {user.name}
            </h1>
            <p className="text-muted-foreground">
              Stay connected with your medical community
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Create Post */}
              <Card className="shadow-soft border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PenTool className="w-5 h-5 text-primary" />
                    <span>Share an Update</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="What's on your mind? Share news, insights, or ask questions..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-[100px] medical-input"
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm">
                        <ImageIcon className="w-4 h-4" />
                        Add Photo
                      </Button>
                      
                      <Select value={postVisibility} onValueChange={(value: 'yeargroup' | 'friends') => setPostVisibility(value)}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yeargroup">Year Group</SelectItem>
                          <SelectItem value="friends">Friends Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button
                      variant="medical"
                      onClick={handleCreatePost}
                      disabled={!newPost.trim() || isPosting}
                    >
                      {isPosting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      {isPosting ? 'Posting...' : 'Post'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Posts Feed */}
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <Card className="p-8 text-center shadow-soft border-0">
                    <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Be the first to share an update with your community!
                    </p>
                    <Button variant="medical" onClick={() => document.querySelector('textarea')?.focus()}>
                      Create Your First Post
                    </Button>
                  </Card>
                ) : (
                  posts.map((post) => {
                    const author = getDoctorById(post.authorId);
                    if (!author) return null;

                    return (
                      <Card key={post.id} className="shadow-soft border-0">
                        <CardContent className="p-6">
                          {/* Post Header */}
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
                                <Clock className="w-3 h-3" />
                                <span>{formatRelativeTime(post.createdAt)}</span>
                                <span>•</span>
                                <span className="capitalize">{post.visibility}</span>
                              </div>
                            </div>
                          </div>

                          {/* Post Content */}
                          <div className="mb-4">
                            <p className="text-foreground leading-relaxed">{post.content}</p>
                          </div>

                          {/* Post Actions */}
                          <div className="flex items-center space-x-6 pt-3 border-t border-border">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLikePost(post.id)}
                              className="flex items-center space-x-1 hover:text-red-500"
                            >
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
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="shadow-soft border-0">
                <CardHeader>
                  <CardTitle>Your Network</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm">Year Group</span>
                    </div>
                    <span className="font-semibold">{quickStats.yearGroupMembers}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-success" />
                      <span className="text-sm">Friends</span>
                    </div>
                    <span className="font-semibold">{quickStats.friendsCount}</span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate('/yeargroup')}
                  >
                    View Year Group
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-soft border-0">
                <CardHeader>
                  <CardTitle>Quick Access</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="professional" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => navigate('/jobs')}
                  >
                    <Briefcase className="w-4 h-4" />
                    Browse Jobs ({quickStats.activeJobs})
                  </Button>
                  
                  <Button 
                    variant="professional" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => navigate('/properties')}
                  >
                    <Home className="w-4 h-4" />
                    Properties ({quickStats.availableProperties})
                  </Button>
                  
                  <Button 
                    variant="professional" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => navigate('/events')}
                  >
                    <Calendar className="w-4 h-4" />
                    Upcoming Events
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="shadow-soft border-0">
                <CardHeader>
                  <CardTitle>Recent Jobs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockJobs.slice(0, 2).map((job) => (
                    <div key={job.id} className="border-l-4 border-success pl-3 pb-3 border-b border-border last:border-b-0 last:pb-0">
                      <h4 className="font-medium text-sm text-foreground mb-1">{job.title}</h4>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground mb-1">
                        <MapPin className="w-3 h-3" />
                        <span>{job.location}</span>
                      </div>
                      <span className="text-xs text-success font-medium">{job.type}</span>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate('/jobs')}
                  >
                    View All Jobs
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