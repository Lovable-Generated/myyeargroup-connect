import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import { mockProperties, getDoctorById } from '@/data/mockData';
import {
  Home,
  Search,
  MapPin,
  Calendar,
  DollarSign,
  Plus,
  Filter,
  Heart,
  Share2,
  ExternalLink,
  Repeat,
  Clock,
  Star,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Properties() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
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

  // Filter properties based on search criteria
  const filteredProperties = mockProperties.filter(property => {
    const matchesSearch = !searchQuery || 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = !selectedLocation || property.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesType = !selectedType || property.type === selectedType;

    return matchesSearch && matchesLocation && matchesType;
  });

  const handleSaveProperty = (propertyId: string) => {
    toast({
      title: "Property Saved",
      description: "Property has been added to your saved properties.",
    });
  };

  const handleContactOwner = (propertyId: string) => {
    toast({
      title: "Contact Sent",
      description: "Your inquiry has been sent to the property owner.",
    });
  };

  const formatPrice = (price?: number, type?: string) => {
    if (type === 'swap') return 'House Swap';
    if (!price) return 'Price on request';
    return `£${price}/month`;
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
                  <Home className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  Property Exchange
                </h1>
              </div>
              <p className="text-muted-foreground">
                Find house swaps and rental properties from fellow medical professionals
              </p>
            </div>
            <Button variant="medical">
              <Plus className="w-4 h-4" />
              List Property
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
                    <label className="text-sm font-medium">Search Properties</label>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Location, description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 medical-input"
                      />
                    </div>
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

                  {/* Property Type Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Types</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                        <SelectItem value="swap">House Swap</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setSearchQuery('');
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
                      {filteredProperties.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Available Properties
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Property Types */}
              <Card className="shadow-soft border-0">
                <CardHeader>
                  <CardTitle>Browse by Type</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="professional" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => setSelectedType('rent')}
                  >
                    <DollarSign className="w-4 h-4" />
                    Rental Properties
                  </Button>
                  <Button 
                    variant="professional" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => setSelectedType('swap')}
                  >
                    <Repeat className="w-4 h-4" />
                    House Swaps
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Property Listings */}
            <div className="lg:col-span-3 space-y-4">
              {filteredProperties.length === 0 ? (
                <Card className="p-8 text-center shadow-soft border-0">
                  <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No properties found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or be the first to list a property.
                  </p>
                  <Button variant="medical">
                    <Plus className="w-4 h-4" />
                    List Your Property
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredProperties.map((property) => {
                    const owner = getDoctorById(property.postedById);
                    
                    return (
                      <Card key={property.id} className="shadow-soft border-0 hover:shadow-medium transition-all duration-200 overflow-hidden">
                        {/* Property Image */}
                        <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <Home className="w-12 h-12 text-primary/40" />
                        </div>

                        <CardContent className="p-6">
                          {/* Property Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                                  {property.title}
                                </h3>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{property.location}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{formatRelativeTime(property.postedAt)}</span>
                                </div>
                              </div>

                              {/* Price and Type */}
                              <div className="flex items-center space-x-2 mb-3">
                                <Badge 
                                  variant={property.type === 'swap' ? 'secondary' : 'default'}
                                  className={property.type === 'swap' ? 'bg-primary text-primary-foreground' : ''}
                                >
                                  {property.type === 'swap' ? (
                                    <Repeat className="w-3 h-3 mr-1" />
                                  ) : (
                                    <DollarSign className="w-3 h-3 mr-1" />
                                  )}
                                  {formatPrice(property.price, property.type)}
                                </Badge>
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSaveProperty(property.id)}
                            >
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Property Description */}
                          <div className="mb-4">
                            <p className="text-sm text-foreground line-clamp-3 leading-relaxed">
                              {property.description}
                            </p>
                          </div>

                          {/* Availability */}
                          {property.availability.length > 0 && (
                            <div className="mb-4 p-3 bg-accent rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">Next Available</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {property.availability[0].toLocaleDateString()}
                              </span>
                            </div>
                          )}

                          {/* Posted By */}
                          {owner && (
                            <div className="flex items-center space-x-3 mb-4 p-3 bg-muted/50 rounded-lg">
                              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-primary-foreground">
                                  {owner.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-foreground">
                                  {owner.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {owner.specialty} • {owner.location}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="medical"
                              size="sm"
                              onClick={() => handleContactOwner(property.id)}
                              className="flex-1"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Contact Owner
                            </Button>
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/properties/${property.id}`)}
                            >
                              Details
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {}}
                            >
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}