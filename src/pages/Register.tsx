import { useState, useEffect } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    medicalSchoolId: '',
    graduationYear: '',
    specialty: '',
    gmcNumber: '',
    currentPosition: '',
    location: '',
    password: '',
    confirmPassword: '',
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    if (formData.gmcNumber.length < 7) {
      setError("Please enter a valid GMC registration number");
      setIsLoading(false);
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gmcNumber: formData.gmcNumber,
        medicalSchoolId: formData.medicalSchoolId,
        graduationYear: parseInt(formData.graduationYear),
        specialty: formData.specialty,
        currentPosition: formData.currentPosition,
        location: formData.location,
      });
      
      navigate('/login?registered=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = 
    formData.firstName && 
    formData.lastName && 
    formData.email && 
    formData.medicalSchoolId && 
    formData.graduationYear && 
    formData.specialty && 
    formData.gmcNumber && 
    formData.password && 
    formData.confirmPassword;

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
              {/* Info Alert */}
              <div className="mb-6">
                <Alert className="border-primary/20 bg-primary/5">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <AlertDescription>
                    All registrations are verified by our admin team. You'll need a valid GMC number to join.
                  </AlertDescription>
                </Alert>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="medical-input"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="medical-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@nhs.uk"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="medical-input"
                      required
                    />
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Professional Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="medicalSchool">Medical School *</Label>
                      <Select value={formData.medicalSchoolId} onValueChange={(value) => handleInputChange('medicalSchoolId', value)}>
                        <SelectTrigger className="medical-input">
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="graduationYear">Graduation Year *</Label>
                      <Select value={formData.graduationYear} onValueChange={(value) => handleInputChange('graduationYear', value)}>
                        <SelectTrigger className="medical-input">
                          <SelectValue placeholder="Select graduation year" />
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty *</Label>
                      <Select value={formData.specialty} onValueChange={(value) => handleInputChange('specialty', value)}>
                        <SelectTrigger className="medical-input">
                          <SelectValue placeholder="Select your specialty" />
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

                    <div className="space-y-2">
                      <Label htmlFor="gmcNumber">GMC Number *</Label>
                      <Input
                        id="gmcNumber"
                        type="text"
                        placeholder="1234567"
                        value={formData.gmcNumber}
                        onChange={(e) => handleInputChange('gmcNumber', e.target.value)}
                        className="medical-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPosition">Current Position</Label>
                      <Input
                        id="currentPosition"
                        type="text"
                        placeholder="Consultant, Registrar, etc."
                        value={formData.currentPosition}
                        onChange={(e) => handleInputChange('currentPosition', e.target.value)}
                        className="medical-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        type="text"
                        placeholder="London, Manchester, etc."
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="medical-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Set Password</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="medical-input"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Minimum 8 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
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
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Submit Registration
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

          {/* Information Box */}
          <div className="mt-8 p-6 bg-accent/50 rounded-lg border border-accent-foreground/20">
            <h3 className="font-semibold mb-2 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span>What happens next?</span>
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Your GMC number will be verified by our admin team</li>
              <li>• You'll receive an email to verify your address</li>
              <li>• Once approved, you'll be able to access your yeargroup</li>
              <li>• Approval usually takes 1-2 business days</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}