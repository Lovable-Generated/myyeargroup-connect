import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/layout/Navbar';
import { medicalSchools, specialties } from '@/data/mockData';
import { Stethoscope, UserPlus, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    medicalSchool: '',
    graduationYear: '',
    specialty: '',
    gmcNumber: '',
    password: '',
    confirmPassword: '',
  });

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Please ensure both passwords match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (formData.gmcNumber.length < 7) {
      toast({
        title: "Invalid GMC Number",
        description: "Please enter a valid GMC registration number.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate registration process
    setTimeout(() => {
      toast({
        title: "Registration Submitted!",
        description: "Your application is pending approval from our admin team. You'll receive an email once approved.",
      });
      setIsLoading(false);
      navigate('/login?registered=true');
    }, 2000);
  };

  const isFormValid = Object.values(formData).every(value => value.trim() !== '');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="medical-gradient w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Join MyYearGroup
            </h1>
            <p className="text-muted-foreground">
              Connect with your medical school yeargroup
            </p>
          </div>

          <Card className="shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Stethoscope className="w-5 h-5 text-primary" />
                <span>Medical Professional Registration</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Dr. John Smith"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="medical-input"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.smith@nhs.uk"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="medical-input"
                      required
                    />
                  </div>
                </div>

                {/* Medical Qualifications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Medical Qualifications</h3>
                  
                  <div className="space-y-2">
                    <Label>Medical School</Label>
                    <Select value={formData.medicalSchool} onValueChange={(value) => handleInputChange('medicalSchool', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your medical school" />
                      </SelectTrigger>
                      <SelectContent>
                        {medicalSchools.map((school) => (
                          <SelectItem key={school.id} value={school.name}>
                            {school.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Graduation Year</Label>
                      <Select value={formData.graduationYear} onValueChange={(value) => handleInputChange('graduationYear', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Year" />
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

                    <div className="space-y-2">
                      <Label>Current Specialty</Label>
                      <Select value={formData.specialty} onValueChange={(value) => handleInputChange('specialty', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialties.map((specialty) => (
                            <SelectItem key={specialty} value={specialty}>
                              {specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gmcNumber">GMC Registration Number</Label>
                    <Input
                      id="gmcNumber"
                      type="text"
                      placeholder="GMC7891234"
                      value={formData.gmcNumber}
                      onChange={(e) => handleInputChange('gmcNumber', e.target.value)}
                      className="medical-input"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Required for verification. Your GMC number will be verified by our admin team.
                    </p>
                  </div>
                </div>

                {/* Security */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Account Security</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="medical-input"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="medical-input"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Verification Notice */}
                <div className="bg-accent rounded-lg p-4 border border-accent-foreground/20">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Verification Process</h4>
                      <p className="text-sm text-muted-foreground">
                        Your application will be reviewed by our admin team. We'll verify your GMC registration 
                        and medical school details. You'll receive an email notification once approved.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="medical"
                  size="lg"
                  className="w-full"
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Application...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Submit Application
                    </>
                  )}
                </Button>

                {/* Login Link */}
                <div className="text-center pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}