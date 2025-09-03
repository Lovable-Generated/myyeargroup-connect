import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/layout/Navbar';
import { mockDoctors, specialties } from '@/data/mockData';
import {
  Search as SearchIcon,
  Users,
  MapPin,
  UserPlus,
  Filter,
  Stethoscope,
} from 'lucide-react';

export default function Search() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    
    if (!isAuthenticated || !userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  // Filter doctors based on search criteria
  const filteredDoctors = mockDoctors
    .filter(doctor => doctor.isApproved)
    .filter(doctor => {
      const matchesSearch = !searchQuery || 
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.medicalSchool.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
      const matchesLocation = !selectedLocation || doctor.location.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchesYear = !selectedYear || doctor.graduationYear.toString() === selectedYear;

      return matchesSearch && matchesSpecialty && matchesLocation && matchesYear;
    });

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 50 }, (_, i) => currentYear - i);
  const locations = ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Cambridge', 'Oxford'];

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
                <SearchIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  Search Members
                </h1>
                <p className="text-muted-foreground">
                  Find and connect with medical professionals in your network
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-3">
              <div className="relative">
                <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, specialty, school, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base medical-input"
                />
              </div>
            </div>
            <Button variant="medical" size="lg" className="h-12">
              <SearchIcon className="w-4 h-4" />
              Search
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="space-y-6">
              <Card className="shadow-soft border-0">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                  </h3>
                  
                  <div className="space-y-4">
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

                    {/* Graduation Year Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Graduation Year</label>
                      <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Years" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Years</SelectItem>
                          {graduationYears.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
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
                        setSelectedYear('');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Results Count */}
              <Card className="shadow-soft border-0">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {filteredDoctors.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Members Found
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              {filteredDoctors.length === 0 ? (
                <Card className="p-8 text-center shadow-soft border-0">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No members found</h3>
                  <p className="text-muted-foreground">
                    {mockDoctors.filter(d => d.isApproved).length === 0 
                      ? "No approved members in the network yet." 
                      : "Try adjusting your search criteria to find more results."
                    }
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredDoctors.map((doctor) => (
                    <Card key={doctor.id} className="shadow-soft border-0 hover:shadow-medium transition-all duration-200">
                      <CardContent className="p-6">
                        {/* Member Header */}
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-lg font-medium text-primary-foreground">
                              {doctor.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground mb-1">
                              {doctor.name}
                            </h3>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Stethoscope className="w-4 h-4 text-primary" />
                                <span className="text-sm text-foreground">{doctor.specialty}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{doctor.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Medical Details */}
                        <div className="space-y-2 mb-4 p-3 bg-muted/50 rounded-lg">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">School:</span>
                              <p className="font-medium text-foreground truncate">
                                {doctor.medicalSchool.split(' University')[0]}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Year:</span>
                              <p className="font-medium text-foreground">{doctor.graduationYear}</p>
                            </div>
                          </div>
                        </div>

                        {/* Bio */}
                        {doctor.bio && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                            {doctor.bio}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="medical" 
                            size="sm"
                            className="flex-1"
                            onClick={() => handleSendFriendRequest(doctor.id)}
                          >
                            <UserPlus className="w-4 h-4" />
                            Connect
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/profile/${doctor.id}`)}
                          >
                            View Profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}