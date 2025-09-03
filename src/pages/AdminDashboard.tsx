import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Users,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  School,
  Activity,
  Mail,
  Clock,
  Eye,
  UserCheck,
  UserX,
  Settings,
  Database,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockUsers, mockYeargroups } from '@/data/enhancedMockData';
import { medicalSchools } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers] = useState(mockUsers);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    approvedUsers: 0,
    rejectedUsers: 0,
    totalYeargroups: 0,
    totalSchools: 0,
  });

  useEffect(() => {
    // Calculate statistics
    setStats({
      totalUsers: users.filter(u => u.role !== 'superadmin').length,
      pendingApprovals: users.filter(u => u.status === 'pending' && u.role !== 'superadmin').length,
      approvedUsers: users.filter(u => u.status === 'approved' && u.role !== 'superadmin').length,
      rejectedUsers: users.filter(u => u.status === 'rejected').length,
      totalYeargroups: mockYeargroups.length,
      totalSchools: medicalSchools.length,
    });
  }, [users]);

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.gmcNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
    
    return matchesSearch && matchesStatus && u.role !== 'superadmin';
  });

  const handleApproveUser = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, status: 'approved' as const, approvedAt: new Date(), approvedBy: user?.id }
        : u
    ));
    
    toast({
      title: "User Approved",
      description: "The user has been approved and can now access the platform.",
    });
    
    setSelectedUser(null);
  };

  const handleRejectUser = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, status: 'rejected' as const }
        : u
    ));
    
    toast({
      title: "User Rejected",
      description: "The user's registration has been rejected.",
      variant: "destructive",
    });
    
    setSelectedUser(null);
  };

  const handleSuspendUser = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, status: 'suspended' as const }
        : u
    ));
    
    toast({
      title: "User Suspended",
      description: "The user's account has been suspended.",
      variant: "destructive",
    });
    
    setSelectedUser(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Rejected</Badge>;
      case 'suspended':
        return <Badge className="bg-gray-500/10 text-gray-600 border-gray-500/20">Suspended</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="medical-gradient w-12 h-12 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage users, approvals, and platform settings</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-soft">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3 inline mr-1 text-green-500" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Approvals
                </CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Requires attention
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Yeargroups
                </CardTitle>
                <School className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalYeargroups}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {stats.totalSchools} schools
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Approval Rate
                </CardTitle>
                <Activity className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.totalUsers > 0 
                  ? Math.round((stats.approvedUsers / stats.totalUsers) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.approvedUsers} approved users
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Review and manage user registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search by name, email, or GMC number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users Table */}
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>GMC Number</TableHead>
                        <TableHead>School & Year</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No users found matching your criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((u) => {
                          const school = medicalSchools.find(s => s.id === u.medicalSchoolId);
                          return (
                            <TableRow key={u.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={u.profileImageUrl} />
                                    <AvatarFallback>
                                      {u.firstName[0]}{u.lastName[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">
                                      {u.firstName} {u.lastName}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {u.email}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <code className="text-sm">{u.gmcNumber}</code>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="text-sm">{school?.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    Class of {u.graduationYear}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{getStatusBadge(u.status)}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {u.createdAt.toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => setSelectedUser(u)}
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      View
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>User Details</DialogTitle>
                                      <DialogDescription>
                                        Review user information and take action
                                      </DialogDescription>
                                    </DialogHeader>
                                    
                                    {selectedUser && (
                                      <div className="space-y-6">
                                        {/* User Info */}
                                        <div className="flex items-start space-x-4">
                                          <Avatar className="h-16 w-16">
                                            <AvatarImage src={selectedUser.profileImageUrl} />
                                            <AvatarFallback>
                                              {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="flex-1">
                                            <h3 className="text-lg font-semibold">
                                              Dr. {selectedUser.firstName} {selectedUser.lastName}
                                            </h3>
                                            <p className="text-muted-foreground">{selectedUser.email}</p>
                                            <div className="mt-2">
                                              {getStatusBadge(selectedUser.status)}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Professional Details */}
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label className="text-muted-foreground">GMC Number</Label>
                                            <p className="font-medium">{selectedUser.gmcNumber}</p>
                                          </div>
                                          <div>
                                            <Label className="text-muted-foreground">Specialty</Label>
                                            <p className="font-medium">{selectedUser.specialty}</p>
                                          </div>
                                          <div>
                                            <Label className="text-muted-foreground">Medical School</Label>
                                            <p className="font-medium">
                                              {medicalSchools.find(s => s.id === selectedUser.medicalSchoolId)?.name}
                                            </p>
                                          </div>
                                          <div>
                                            <Label className="text-muted-foreground">Graduation Year</Label>
                                            <p className="font-medium">{selectedUser.graduationYear}</p>
                                          </div>
                                          <div>
                                            <Label className="text-muted-foreground">Current Position</Label>
                                            <p className="font-medium">{selectedUser.currentPosition || 'Not specified'}</p>
                                          </div>
                                          <div>
                                            <Label className="text-muted-foreground">Location</Label>
                                            <p className="font-medium">{selectedUser.location || 'Not specified'}</p>
                                          </div>
                                        </div>

                                        {/* Bio */}
                                        {selectedUser.bio && (
                                          <div>
                                            <Label className="text-muted-foreground">Bio</Label>
                                            <p className="text-sm mt-1">{selectedUser.bio}</p>
                                          </div>
                                        )}

                                        {/* Timestamps */}
                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                          <div>
                                            <Label className="text-muted-foreground">Registered</Label>
                                            <p className="text-sm">{selectedUser.createdAt.toLocaleString()}</p>
                                          </div>
                                          <div>
                                            <Label className="text-muted-foreground">Last Login</Label>
                                            <p className="text-sm">{selectedUser.lastLogin.toLocaleString()}</p>
                                          </div>
                                        </div>

                                        {/* GMC Verification Alert */}
                                        {selectedUser.status === 'pending' && (
                                          <Alert className="border-yellow-500/20 bg-yellow-500/5">
                                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                                            <AlertDescription>
                                              Please verify the GMC number with the official GMC registry before approving.
                                            </AlertDescription>
                                          </Alert>
                                        )}
                                      </div>
                                    )}
                                    
                                    <DialogFooter className="gap-2">
                                      {selectedUser?.status === 'pending' && (
                                        <>
                                          <Button
                                            variant="outline"
                                            onClick={() => handleRejectUser(selectedUser.id)}
                                            className="text-red-600 hover:text-red-700"
                                          >
                                            <UserX className="h-4 w-4 mr-1" />
                                            Reject
                                          </Button>
                                          <Button
                                            variant="medical"
                                            onClick={() => handleApproveUser(selectedUser.id)}
                                          >
                                            <UserCheck className="h-4 w-4 mr-1" />
                                            Approve
                                          </Button>
                                        </>
                                      )}
                                      {selectedUser?.status === 'approved' && (
                                        <Button
                                          variant="outline"
                                          onClick={() => handleSuspendUser(selectedUser.id)}
                                          className="text-red-600 hover:text-red-700"
                                        >
                                          <UserX className="h-4 w-4 mr-1" />
                                          Suspend
                                        </Button>
                                      )}
                                      {selectedUser?.status === 'suspended' && (
                                        <Button
                                          variant="medical"
                                          onClick={() => handleApproveUser(selectedUser.id)}
                                        >
                                          <UserCheck className="h-4 w-4 mr-1" />
                                          Reactivate
                                        </Button>
                                      )}
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schools Tab */}
          <TabsContent value="schools" className="space-y-4">
            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle>Medical Schools</CardTitle>
                <CardDescription>
                  Manage the list of medical schools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Current Schools ({medicalSchools.length})</h3>
                    <Button variant="medical" size="sm">
                      <School className="h-4 w-4 mr-1" />
                      Add School
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {medicalSchools.map((school) => {
                      const yeargroups = mockYeargroups.filter(yg => yg.medicalSchoolId === school.id);
                      const members = users.filter(u => u.medicalSchoolId === school.id && u.status === 'approved');
                      
                      return (
                        <Card key={school.id} className="border shadow-soft">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">{school.name}</CardTitle>
                            <CardDescription>{school.location}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Yeargroups:</span>
                              <span className="font-medium">{yeargroups.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Members:</span>
                              <span className="font-medium">{members.length}</span>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>
                  Configure platform-wide settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Email Notifications
                  </h3>
                  <div className="space-y-3 pl-7">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New Registration Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Receive email when new users register
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weekly Reports</p>
                        <p className="text-sm text-muted-foreground">
                          Get weekly platform activity summary
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Data Management
                  </h3>
                  <div className="space-y-3 pl-7">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Export User Data</p>
                        <p className="text-sm text-muted-foreground">
                          Download all user data in CSV format
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Export</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Backup Database</p>
                        <p className="text-sm text-muted-foreground">
                          Create a backup of the entire database
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Backup</Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Registration Settings
                  </h3>
                  <div className="space-y-3 pl-7">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto-approval</p>
                        <p className="text-sm text-muted-foreground">
                          Automatically approve verified GMC numbers
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Disabled</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">GMC Verification API</p>
                        <p className="text-sm text-muted-foreground">
                          Connect to GMC registry for automatic verification
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Setup</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}