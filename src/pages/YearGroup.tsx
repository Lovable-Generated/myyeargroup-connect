import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Users,
  MessageSquare,
  Calendar,
  Send,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Image,
  FileText,
  Globe,
  Lock,
  UserPlus,
  MapPin,
  Briefcase,
  School,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  mockUsers, 
  mockPosts, 
  mockComments, 
  mockYeargroups, 
  mockEvents,
  Post,
  Comment,
  User,
  Event as EventType
} from '@/data/enhancedMockData';
import { medicalSchools } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function YearGroup() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newPost, setNewPost] = useState('');
  const [postVisibility, setPostVisibility] = useState<'yeargroup' | 'friends'>('yeargroup');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState('');
  
  // Get yeargroup info from URL params or user's yeargroup
  const yeargroupId = searchParams.get('id') || 
    (user && mockYeargroups.find(yg => 
      yg.medicalSchoolId === user.medicalSchoolId && 
      yg.graduationYear === user.graduationYear
    )?.id);
  
  const yeargroup = mockYeargroups.find(yg => yg.id === yeargroupId);
  const school = yeargroup && medicalSchools.find(s => s.id === yeargroup.medicalSchoolId);
  
  // Get yeargroup members
  const yeargroupMembers = mockUsers.filter(u => 
    u.medicalSchoolId === yeargroup?.medicalSchoolId && 
    u.graduationYear === yeargroup?.graduationYear &&
    u.status === 'approved'
  );
  
  // Get yeargroup posts
  const yeargroupPosts = posts.filter(p => p.yeargroupId === yeargroupId);
  
  // Get yeargroup events
  const yeargroupEvents = mockEvents.filter(e => e.yeargroupId === yeargroupId);

  const handleCreatePost = () => {
    if (!newPost.trim() || !user) return;
    
    const post: Post = {
      id: `p${Date.now()}`,
      userId: user.id,
      yeargroupId: yeargroupId || '',
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
      description: "Your post has been shared with your yeargroup.",
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

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedPost || !user) return;
    
    const comment: Comment = {
      id: `c${Date.now()}`,
      postId: selectedPost.id,
      userId: user.id,
      content: newComment,
      createdAt: new Date(),
    };
    
    setComments([...comments, comment]);
    setPosts(posts.map(p => 
      p.id === selectedPost.id 
        ? { ...p, commentsCount: p.commentsCount + 1 }
        : p
    ));
    setNewComment('');
    
    toast({
      title: "Comment added",
      description: "Your comment has been posted.",
    });
  };

  const getPostAuthor = (userId: string) => {
    return mockUsers.find(u => u.id === userId);
  };

  const getPostComments = (postId: string) => {
    return comments.filter(c => c.postId === postId);
  };

  if (!yeargroup) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto text-center p-8">
            <School className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No Yeargroup Found</h2>
            <p className="text-muted-foreground">
              Please select a valid yeargroup or ensure you're logged in.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />
      
      {/* Enhanced Yeargroup Header */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <div className="absolute inset-0 medical-gradient" />
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30"
          style={{ backgroundImage: `url('${yeargroup.coverImageUrl}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
          <div className="text-white space-y-4 w-full">
            <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
              <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">{yeargroup.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <span className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <School className="h-5 w-5 mr-2" />
                  {school?.name}
                </span>
                <span className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Users className="h-5 w-5 mr-2" />
                  {yeargroupMembers.length} members
                </span>
                <span className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Calendar className="h-5 w-5 mr-2" />
                  Class of {yeargroup.graduationYear}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="feed">Feed</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>

              {/* Feed Tab */}
              <TabsContent value="feed" className="space-y-4">
                {/* Create Post */}
                {user && (
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
                            placeholder="Share something with your yeargroup..."
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
                                      Friends
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
                )}

                {/* Posts */}
                {yeargroupPosts.length === 0 ? (
                  <Card className="border-0 shadow-soft p-8 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground">
                      Be the first to share something with your yeargroup!
                    </p>
                  </Card>
                ) : (
                  yeargroupPosts.map((post) => {
                    const author = getPostAuthor(post.userId);
                    const postComments = getPostComments(post.id);
                    const isLiked = user && post.likedBy.includes(user.id);
                    
                    return (
                      <Card key={post.id} className="border-0 shadow-soft">
                        <CardContent className="p-4">
                          {/* Post Header */}
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

                          {/* Post Content */}
                          <div className="mb-4">
                            <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
                            {post.imageUrls.length > 0 && (
                              <div className="mt-3 grid grid-cols-2 gap-2">
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
                          </div>

                          {/* Post Actions */}
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
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedPost(post)}
                                  >
                                    <MessageCircle className="h-4 w-4 mr-1" />
                                    {post.commentsCount}
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Comments</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    {/* Original Post */}
                                    <div className="pb-4 border-b">
                                      <div className="flex items-start space-x-3">
                                        <Avatar className="h-8 w-8">
                                          <AvatarImage src={author?.profileImageUrl} />
                                          <AvatarFallback>
                                            {author?.firstName[0]}{author?.lastName[0]}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                          <p className="font-medium text-sm">
                                            Dr. {author?.firstName} {author?.lastName}
                                          </p>
                                          <p className="text-sm mt-1">{post.content}</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Comments */}
                                    {postComments.length === 0 ? (
                                      <p className="text-center text-muted-foreground py-4">
                                        No comments yet. Be the first to comment!
                                      </p>
                                    ) : (
                                      postComments.map((comment) => {
                                        const commentAuthor = getPostAuthor(comment.userId);
                                        return (
                                          <div key={comment.id} className="flex items-start space-x-3">
                                            <Avatar className="h-8 w-8">
                                              <AvatarImage src={commentAuthor?.profileImageUrl} />
                                              <AvatarFallback>
                                                {commentAuthor?.firstName[0]}{commentAuthor?.lastName[0]}
                                              </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                              <div className="bg-muted rounded-lg p-3">
                                                <p className="font-medium text-sm">
                                                  Dr. {commentAuthor?.firstName} {commentAuthor?.lastName}
                                                </p>
                                                <p className="text-sm mt-1">{comment.content}</p>
                                              </div>
                                              <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(comment.createdAt).toLocaleString()}
                                              </p>
                                            </div>
                                          </div>
                                        );
                                      })
                                    )}

                                    {/* Add Comment */}
                                    {user && (
                                      <div className="flex items-start space-x-3 pt-4 border-t">
                                        <Avatar className="h-8 w-8">
                                          <AvatarImage src={user.profileImageUrl} />
                                          <AvatarFallback>
                                            {user.firstName[0]}{user.lastName[0]}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 flex space-x-2">
                                          <Input
                                            placeholder="Write a comment..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            onKeyPress={(e) => {
                                              if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleAddComment();
                                              }
                                            }}
                                          />
                                          <Button
                                            variant="medical"
                                            size="sm"
                                            onClick={handleAddComment}
                                            disabled={!newComment.trim()}
                                          >
                                            <Send className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
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

              {/* Members Tab */}
              <TabsContent value="members" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {yeargroupMembers.map((member) => (
                    <Card key={member.id} className="border-0 shadow-soft">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.profileImageUrl} />
                            <AvatarFallback>
                              {member.firstName[0]}{member.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold">
                              Dr. {member.firstName} {member.lastName}
                            </h4>
                            <p className="text-sm text-muted-foreground">{member.specialty}</p>
                            <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                              {member.currentPosition && (
                                <>
                                  <Briefcase className="h-3 w-3" />
                                  <span>{member.currentPosition}</span>
                                </>
                              )}
                              {member.location && (
                                <>
                                  <MapPin className="h-3 w-3" />
                                  <span>{member.location}</span>
                                </>
                              )}
                            </div>
                            {member.bio && (
                              <p className="text-sm mt-2 line-clamp-2">{member.bio}</p>
                            )}
                          </div>
                          {user && user.id !== member.id && (
                            <Button variant="outline" size="sm">
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Events Tab */}
              <TabsContent value="events" className="space-y-4">
                {yeargroupEvents.length === 0 ? (
                  <Card className="border-0 shadow-soft p-8 text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No upcoming events</h3>
                    <p className="text-muted-foreground">
                      Check back later for yeargroup events and reunions.
                    </p>
                  </Card>
                ) : (
                  yeargroupEvents.map((event) => {
                    const organizer = getPostAuthor(event.organizerId);
                    const userAttendance = event.attendees.find(a => a.userId === user?.id);
                    
                    return (
                      <Card key={event.id} className="border-0 shadow-soft">
                        <CardContent className="p-0">
                          {event.imageUrl && (
                            <img 
                              src={event.imageUrl} 
                              alt={event.title}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                          )}
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-lg font-semibold">{event.title}</h3>
                                <div className="flex items-center space-x-3 text-sm text-muted-foreground mt-1">
                                  <span className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {new Date(event.eventDate).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {new Date(event.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  <span className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {event.location}
                                  </span>
                                </div>
                              </div>
                              <Badge className="bg-primary/10 text-primary">
                                {event.attendees.filter(a => a.status === 'attending').length} attending
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4">
                              {event.description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-muted-foreground">
                                Organized by Dr. {organizer?.firstName} {organizer?.lastName}
                              </p>
                              <div className="flex items-center space-x-2">
                                {userAttendance?.status === 'attending' ? (
                                  <Badge className="bg-green-500/10 text-green-600">
                                    You're attending
                                  </Badge>
                                ) : (
                                  <Button variant="medical" size="sm">
                                    RSVP
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Yeargroup Info */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-base">About This Yeargroup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {yeargroup.description || `Connect with fellow medical graduates from ${school?.name}, Class of ${yeargroup.graduationYear}.`}
                </p>
                <div className="pt-3 border-t space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Members</span>
                    <span className="font-medium">{yeargroupMembers.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Posts this month</span>
                    <span className="font-medium">
                      {yeargroupPosts.filter(p => {
                        const postDate = new Date(p.createdAt);
                        const now = new Date();
                        return postDate.getMonth() === now.getMonth() && 
                               postDate.getFullYear() === now.getFullYear();
                      }).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Upcoming events</span>
                    <span className="font-medium">
                      {yeargroupEvents.filter(e => new Date(e.eventDate) > new Date()).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Members */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-base">Active Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {yeargroupMembers.slice(0, 5).map((member) => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.profileImageUrl} />
                        <AvatarFallback>
                          {member.firstName[0]}{member.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          Dr. {member.firstName} {member.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.specialty}
                        </p>
                      </div>
                      {new Date().getTime() - member.lastLogin.getTime() < 300000 && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </div>
                  ))}
                </div>
                {yeargroupMembers.length > 5 && (
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    View all {yeargroupMembers.length} members
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-base">Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Invite Members
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Start Discussion
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}