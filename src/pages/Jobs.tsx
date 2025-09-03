import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/layout/Navbar';
import { mockJobs, mockDoctors, specialties, getDoctorById } from '@/data/mockData';
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  DollarSign,
  Plus,
  Filter,
  Building2,
  Star,
  BookmarkPlus,
  ExternalLink,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Jobs() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    
    if (!isAuthenticated || !userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  // Filter jobs based on search criteria
  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = !searchQuery || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = !selectedSpecialty || job.specialty === selectedSpecialty;
    const matchesLocation = !selectedLocation || job.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesType = !selectedType || job.type === selectedType;

    return matchesSearch && matchesSpecialty && matchesLocation && matchesType;
  });

  const handleSaveJob = (jobId: string) => {
    toast({
      title: "Job Saved",
      description: "Job has been added to your saved jobs.",
    });
  };

  const handleApplyToJob = (jobId: string) => {
    toast({
      title: "Application Started",
      description: "Redirecting to application form...",
    });
  };

  const formatSalary = (salary?: string) => {
    if (!salary) return 'Salary not specified';
    return salary;
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const locations = ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Cambridge', 'Oxford'];
  const jobTypes = ['permanent', 'locum', 'fellowship'];

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
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  Job Opportunities
                </h1>
              </div>
              <p className="text-muted-foreground">
                Discover career opportunities shared by your professional network
              </p>
            </div>
            <Button variant="medical">
              <Plus className="w-4 h-4" />
              Post a Job
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-soft border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Filter className="w-5 h-5" />
                    <span>Filters</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search Jobs</label>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Job title, hospital..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 medical-input"
                      />
                    </div>
                  </div>

                  {/* Specialty Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Specialty</label>
                    <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Specialties" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Specialties</SelectItem>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Locations</SelectItem>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Job Type Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Type</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Types</SelectItem>
                        {jobTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedSpecialty('');
                      setSelectedLocation('');
                      setSelectedType('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="shadow-soft border-0">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {filteredJobs.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Available Positions
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Job Listings */}
            <div className="lg:col-span-3 space-y-4">
              {filteredJobs.length === 0 ? (
                <Card className="p-8 text-center shadow-soft border-0">
                  <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or check back later for new opportunities.
                  </p>
                  <Button variant="medical">
                    <Plus className="w-4 h-4" />
                    Post a Job
                  </Button>
                </Card>
              ) : (
                filteredJobs.map((job) => {
                  const poster = getDoctorById(job.postedById);
                  
                  return (
                    <Card key={job.id} className="shadow-soft border-0 hover:shadow-medium transition-all duration-200">
                      <CardContent className="p-6">
                        {/* Job Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h2 className="text-xl font-semibold text-foreground">
                                {job.title}
                              </h2>
                              <span className="medical-badge">
                                {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center space-x-1">
                                <Building2 className="w-4 h-4" />
                                <span>{job.hospital}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{job.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{formatRelativeTime(job.postedAt)}</span>
                              </div>
                            </div>

                            {job.salary && (
                              <div className="flex items-center space-x-1 text-sm text-success mb-3">
                                <DollarSign className="w-4 h-4" />
                                <span className="font-medium">{formatSalary(job.salary)}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSaveJob(job.id)}
                            >
                              <BookmarkPlus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Job Description */}
                        <div className="mb-4">
                          <p className="text-foreground leading-relaxed">
                            {job.description}
                          </p>
                        </div>

                        {/* Specialty Tag */}
                        <div className="mb-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {job.specialty}
                          </span>
                        </div>

                        {/* Posted By */}
                        {poster && (
                          <div className="flex items-center space-x-3 mb-4 p-3 bg-muted/50 rounded-lg">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-primary-foreground">
                                {poster.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                Posted by {poster.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {poster.specialty} • {poster.location}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-3 pt-4 border-t border-border">
                          <Button 
                            variant="medical"
                            onClick={() => handleApplyToJob(job.id)}
                            className="flex-1"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Apply Now
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => navigate(`/jobs/${job.id}`)}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSaveJob(job.id)}
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                        </div>
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