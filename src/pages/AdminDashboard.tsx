import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import { mockDoctors, medicalSchools, Doctor } from '@/data/mockData';
import {
  Shield,
  Users,
  CheckCircle,
  XCircle,
  School,
  Plus,
  Search,
  Eye,
  Settings,
  BarChart3,
  AlertTriangle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('pending');
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    
    if (!isAuthenticated || !userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    // Check if user is admin (mock check)
    if (parsedUser.email !== 'admin@myyeargroup.com') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
      navigate('/dashboard');
      return;
    }

    setUser(parsedUser);
  }, [navigate, toast]);

  const handleApproveDoctor = (doctorId: string) => {
    setDoctors(prev => 
      prev.map(doctor => 
        doctor.id === doctorId 
          ? { ...doctor, isApproved: true }
          : doctor
      )
    );
    toast({
      title: "Doctor Approved",
      description: "The doctor has been successfully approved and can now access the platform.",
    });
  };

  const handleRejectDoctor = (doctorId: string) => {
    setDoctors(prev => prev.filter(doctor => doctor.id !== doctorId));
    toast({
      title: "Doctor Rejected",
      description: "The doctor's application has been rejected.",
      variant: "destructive",
    });
  };

  const pendingDoctors = doctors.filter(doctor => !doctor.isApproved);
  const approvedDoctors = doctors.filter(doctor => doctor.isApproved);

  const filteredPending = pendingDoctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.gmcNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredApproved = approvedDoctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.gmcNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalMembers: doctors.length,
    pendingApproval: pendingDoctors.length,
    approvedMembers: approvedDoctors.length,
    totalSchools: medicalSchools.length,
    recentSignups: doctors.filter(d => {
      const daysDiff = Math.floor((new Date().getTime() - d.joinedAt.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7;
    }).length,
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="medical-gradient w-12 h-12 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Manage members, approvals, and platform settings
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <Card className="p-4 text-center shadow-soft border-0">
                <div className="text-2xl font-bold text-primary mb-1">{stats.totalMembers}</div>
                <div className="text-xs text-muted-foreground">Total Members</div>
              </Card>
              <Card className="p-4 text-center shadow-soft border-0">
                <div className="text-2xl font-bold text-warning mb-1">{stats.pendingApproval}</div>
                <div className="text-xs text-muted-foreground">Pending Approval</div>
              </Card>
              <Card className="p-4 text-center shadow-soft border-0">
                <div className="text-2xl font-bold text-success mb-1">{stats.approvedMembers}</div>
                <div className="text-xs text-muted-foreground">Approved</div>
              </Card>
              <Card className="p-4 text-center shadow-soft border-0">
                <div className="text-2xl font-bold text-primary mb-1">{stats.totalSchools}</div>
                <div className="text-xs text-muted-foreground">Medical Schools</div>
              </Card>
              <Card className="p-4 text-center shadow-soft border-0">
                <div className="text-2xl font-bold text-accent-foreground mb-1">{stats.recentSignups}</div>
                <div className="text-xs text-muted-foreground">This Week</div>
              </Card>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or GMC number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 medical-input"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
              <TabsTrigger value="pending" className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Pending Approval ({stats.pendingApproval})</span>
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Approved Members</span>
              </TabsTrigger>
              <TabsTrigger value="schools" className="flex items-center space-x-2">
                <School className="w-4 h-4" />
                <span>Medical Schools</span>
              </TabsTrigger>
            </TabsList>

            {/* Pending Approval Tab */}
            <TabsContent value="pending" className="space-y-4">
              {filteredPending.length === 0 ? (
                <Card className="p-8 text-center shadow-soft border-0">
                  <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                  <p className="text-muted-foreground">
                    {pendingDoctors.length === 0 
                      ? "No pending doctor applications at the moment." 
                      : "No doctors match your search criteria."
                    }
                  </p>
                </Card>
              ) : (
                filteredPending.map((doctor) => (
                  <Card key={doctor.id} className="shadow-soft border-0">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-foreground">
                                {doctor.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">{doctor.name}</h3>
                              <p className="text-sm text-muted-foreground">{doctor.email}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <label className="text-xs font-medium text-muted-foreground">Medical School</label>
                              <p className="text-sm text-foreground">{doctor.medicalSchool}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted-foreground">Graduation Year</label>
                              <p className="text-sm text-foreground">{doctor.graduationYear}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted-foreground">Specialty</label>
                              <p className="text-sm text-foreground">{doctor.specialty}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted-foreground">GMC Number</label>
                              <p className="text-sm font-mono text-foreground">{doctor.gmcNumber}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted-foreground">Location</label>
                              <p className="text-sm text-foreground">{doctor.location}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted-foreground">Applied</label>
                              <p className="text-sm text-foreground">{doctor.joinedAt.toLocaleDateString()}</p>
                            </div>
                          </div>

                          {doctor.bio && (
                            <div className="mb-4">
                              <label className="text-xs font-medium text-muted-foreground">Bio</label>
                              <p className="text-sm text-foreground mt-1">{doctor.bio}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleApproveDoctor(doctor.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRejectDoctor(doctor.id)}
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            <Eye className="w-4 h-4" />
                            Review
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Approved Members Tab */}
            <TabsContent value="approved" className="space-y-4">
              {filteredApproved.length === 0 ? (
                <Card className="p-8 text-center shadow-soft border-0">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No approved members found</h3>
                  <p className="text-muted-foreground">
                    {approvedDoctors.length === 0 
                      ? "No approved members yet." 
                      : "No members match your search criteria."
                    }
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredApproved.map((doctor) => (
                    <Card key={doctor.id} className="shadow-soft border-0 hover:shadow-medium transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-success-foreground">
                              {doctor.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground text-sm">{doctor.name}</h4>
                            <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                          </div>
                          <Badge variant="secondary" className="bg-success text-success-foreground">
                            Active
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">School:</span>
                            <span className="text-foreground">{doctor.medicalSchool.split(' ')[0]}...</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Year:</span>
                            <span className="text-foreground">{doctor.graduationYear}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span className="text-foreground">{doctor.location}</span>
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm" className="w-full mt-3">
                          <Eye className="w-3 h-3" />
                          View Profile
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Medical Schools Tab */}
            <TabsContent value="schools" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Medical Schools</h2>
                <Button variant="medical">
                  <Plus className="w-4 h-4" />
                  Add School
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {medicalSchools.map((school) => {
                  const memberCount = doctors.filter(d => d.medicalSchool === school.name && d.isApproved).length;
                  
                  return (
                    <Card key={school.id} className="shadow-soft border-0">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="medical-gradient w-10 h-10 rounded-lg flex items-center justify-center">
                            <School className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground text-sm">{school.name}</h4>
                            <p className="text-xs text-muted-foreground">{school.location}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            {memberCount} member{memberCount !== 1 ? 's' : ''}
                          </span>
                          <Button variant="outline" size="sm">
                            <Settings className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}