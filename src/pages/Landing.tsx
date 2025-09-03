import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/enhanced-button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/layout/Navbar';
import { medicalSchools, mockJobs, mockProperties } from '@/data/mockData';
import {
  Stethoscope,
  Users,
  Calendar,
  Briefcase,
  Home,
  Shield,
  CheckCircle,
  ArrowRight,
  Search,
  MapPin,
  Clock,
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const handleJoinYearGroup = () => {
    if (selectedSchool && selectedYear) {
      navigate(`/yeargroup?school=${selectedSchool}&year=${selectedYear}`);
    }
  };

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from(
    { length: 50 }, 
    (_, i) => currentYear - i
  );

  const features = [
    {
      icon: Users,
      title: 'Connect with Your Yeargroup',
      description: 'Reconnect with fellow doctors from your graduation year and medical school.',
    },
    {
      icon: Shield,
      title: 'Private & Secure',
      description: 'GMC-verified members only. Your professional network stays professional.',
    },
    {
      icon: Briefcase,
      title: 'Job Opportunities',
      description: 'Access exclusive job postings shared by your trusted network.',
    },
    {
      icon: Home,
      title: 'Property Exchange',
      description: 'Find house swaps and rental opportunities from fellow medics.',
    },
    {
      icon: Calendar,
      title: 'Events & Reunions',
      description: 'Stay updated on yeargroup events, conferences, and social gatherings.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 mb-6">
                <div className="medical-gradient w-12 h-12 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-heading font-bold text-foreground">
                  MyYearGroup
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
                Your Professional Medical Network
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Connect with fellow doctors from your graduation year. Share opportunities, 
                find property swaps, and stay connected with your medical community.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Button 
                  variant="hero" 
                  size="xl"
                  onClick={() => navigate('/register')}
                  className="w-full sm:w-auto"
                >
                  Join Your Yeargroup
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="xl"
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto"
                >
                  Sign In
                </Button>
              </div>
            </div>

            {/* Search Box */}
            <div className="max-w-2xl mx-auto">
              <Card className="p-6 shadow-strong border-0 card-gradient">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  Find Your Yeargroup
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Medical School" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicalSchools.map((school) => (
                        <SelectItem key={school.id} value={school.name}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Graduation Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {graduationYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="medical" 
                  size="lg"
                  onClick={handleJoinYearGroup}
                  disabled={!selectedSchool || !selectedYear}
                  className="w-full"
                >
                  <Search className="w-4 h-4" />
                  Explore Yeargroup
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Everything You Need to Stay Connected
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive platform designed specifically for the medical community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 text-center shadow-soft hover:shadow-medium transition-all duration-200 border-0">
                  <div className="medical-gradient w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Teaser Cards Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
            See What's Happening
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Jobs Teaser */}
            <Card className="p-6 shadow-medium border-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-success w-10 h-10 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-success-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Latest Job Opportunities</h3>
              </div>
              
              <div className="space-y-4">
                {mockJobs.slice(0, 2).map((job) => (
                  <div key={job.id} className="border-l-4 border-success pl-4">
                    <h4 className="font-medium text-foreground">{job.title}</h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{job.hospital}, {job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{job.postedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                View All Jobs
              </Button>
            </Card>

            {/* Properties Teaser */}
            <Card className="p-6 shadow-medium border-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Property Exchange</h3>
              </div>
              
              <div className="space-y-4">
                {mockProperties.slice(0, 2).map((property) => (
                  <div key={property.id} className="border-l-4 border-primary pl-4">
                    <h4 className="font-medium text-foreground">{property.title}</h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{property.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span className="medical-badge">
                        {property.type === 'swap' ? 'House Swap' : `£${property.price}/month`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                View All Properties
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8">
              <div className="bg-success w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success-foreground" />
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Trusted by Medical Professionals
              </h2>
              <p className="text-xl text-muted-foreground">
                Every member is verified through GMC registration, ensuring a secure 
                and professional environment for all doctors.
              </p>
            </div>
            
            <Button 
              variant="medical" 
              size="xl"
              onClick={() => navigate('/register')}
            >
              Join MyYearGroup Today
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="medical-gradient w-8 h-8 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-heading font-semibold">MyYearGroup</span>
            </div>
            <p className="text-muted-foreground">
              Connecting medical professionals across the UK
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}