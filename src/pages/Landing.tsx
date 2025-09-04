import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  UserCheck,
  Heart,
  Globe,
  Award,
  TrendingUp,
  BookOpen,
  MessageCircle,
  Star,
  ChevronRight,
  Sparkles,
  Building2,
  GraduationCap,
  Handshake,
  Lock,
  Bell,
  BarChart3,
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
      title: 'Professional Network',
      description: 'Connect with verified medical professionals from your graduating class.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Shield,
      title: 'GMC Verified',
      description: 'All members are verified through GMC registration for authenticity.',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Briefcase,
      title: 'Career Opportunities',
      description: 'Share and discover locum positions, permanent roles, and fellowships.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: Home,
      title: 'Property Exchange',
      description: 'Find property swaps and rentals within your trusted medical network.',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: Calendar,
      title: 'Reunion Planning',
      description: 'Organize and attend yeargroup reunions and professional events.',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
    },
    {
      icon: MessageCircle,
      title: 'Private Discussions',
      description: 'Engage in meaningful conversations with your medical cohort.',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
    },
  ];

  const stats = [
    { number: '15,000+', label: 'Verified Doctors' },
    { number: '42', label: 'Medical Schools' },
    { number: '500+', label: 'Active Jobs' },
    { number: '98%', label: 'Satisfaction Rate' },
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Mitchell',
      role: 'Consultant Cardiologist',
      school: "King's College London",
      year: '2010',
      content: 'MyYearGroup helped me reconnect with classmates I hadn\'t seen in years. The platform is professional and secure.',
      rating: 5,
    },
    {
      name: 'Dr. James Chen',
      role: 'GP Partner',
      school: 'Imperial College',
      year: '2015',
      content: 'Found my current locum position through a yeargroup connection. The job board is incredibly valuable.',
      rating: 5,
    },
    {
      name: 'Dr. Emma Thompson',
      role: 'Registrar',
      school: 'UCL Medical School',
      year: '2018',
      content: 'The property swap feature saved me thousands when relocating for my specialty training.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Enhanced Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="medical-gradient w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">MyYearGroup</h1>
                <p className="text-xs text-muted-foreground">Medical Professional Network</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                How it Works
              </a>
              <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Testimonials
              </a>
              <a href="#join" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Join Now
              </a>
            </nav>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="hidden sm:flex"
              >
                Sign In
              </Button>
              <Button 
                variant="medical" 
                onClick={() => navigate('/register')}
                className="shadow-lg"
              >
                Join Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Animated Background */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
        
        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              Trusted by 15,000+ UK Medical Professionals
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Reconnect with Your
              <span className="text-primary block mt-2">Medical School Cohort</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              The exclusive professional network for UK doctors to connect with their graduation yeargroup, 
              share opportunities, and build lasting professional relationships.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                variant="medical" 
                onClick={() => navigate('/register')}
                className="shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <UserCheck className="w-5 h-5 mr-2" />
                Start Your Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Lock className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">GMC Verified</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Award className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium">NHS Approved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built specifically for UK medical professionals to maintain and grow their professional network
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in fade-in-0 slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`w-7 h-7 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Join Your Professional Circle in Minutes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our streamlined verification process ensures only genuine medical professionals join the network
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
            
            {[
              { icon: GraduationCap, title: 'Register', desc: 'Sign up with your medical school details' },
              { icon: UserCheck, title: 'GMC Verification', desc: 'We verify your GMC registration' },
              { icon: Handshake, title: 'Get Approved', desc: 'Admin team reviews and approves' },
              { icon: Globe, title: 'Connect', desc: 'Access your yeargroup network' },
            ].map((step, index) => (
              <div key={index} className="relative text-center animate-in fade-in-0 slide-in-from-bottom-4" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4 relative z-10 border-4 border-primary/20">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by Medical Professionals
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what your colleagues are saying about MyYearGroup
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg animate-in fade-in-0 slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.school}, Class of {testimonial.year}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="join" className="py-20 px-4 bg-gradient-to-r from-primary to-primary/90">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto text-white animate-in fade-in-0 slide-in-from-bottom-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Join Your Medical Community?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Start connecting with your yeargroup today. No credit card required for the free trial.
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
              <div className="space-y-4">
                <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                  <SelectTrigger className="bg-white text-foreground">
                    <SelectValue placeholder="Select your medical school" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicalSchools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="bg-white text-foreground">
                    <SelectValue placeholder="Select graduation year" />
                  </SelectTrigger>
                  <SelectContent>
                    {graduationYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        Class of {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="w-full bg-white text-primary hover:bg-white/90"
                  onClick={handleJoinYearGroup}
                  disabled={!selectedSchool || !selectedYear}
                >
                  Find My Yeargroup
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
            
            <p className="mt-6 text-sm text-white/70">
              Already a member? 
              <Button 
                variant="link" 
                className="text-white underline ml-1 p-0"
                onClick={() => navigate('/login')}
              >
                Sign in here
              </Button>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="medical-gradient w-8 h-8 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-foreground">MyYearGroup</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The trusted professional network for UK medical doctors.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 MyYearGroup. All rights reserved. | Built for medical professionals, by medical professionals.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function User({ className }: { className?: string }) {
  return <Users className={className} />;
}