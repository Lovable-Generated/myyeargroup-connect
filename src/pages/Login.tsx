import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/layout/Navbar';
import { LogIn, Stethoscope, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, user } = useAuth();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    }
  }, [user, navigate, location]);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      toast({
        title: "Registration Successful!",
        description: "Your application has been submitted and is pending approval.",
      });
    }
  }, [searchParams, toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(formData.email, formData.password);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.email && formData.password;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 relative">
        <div className="max-w-md mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-10 animate-in fade-in-0 slide-in-from-top-4 duration-700">
            <div className="medical-gradient w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-heading font-bold text-foreground mb-3 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-muted-foreground text-lg">
              Sign in to your MyYearGroup account
            </p>
          </div>

          <Card className="shadow-2xl border-0 backdrop-blur-sm bg-card/95 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Stethoscope className="w-5 h-5 text-primary" />
                <span>Professional Login</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@nhs.uk"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="medical-input"
                      required
                    />
                  </div>

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
                </div>

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
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </>
                  )}
                </Button>

                {/* Demo Credentials */}
                <div className="bg-accent rounded-lg p-4 border border-accent-foreground/20">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Demo Accounts</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Try these demo accounts to explore the platform:
                      </p>
                      <div className="space-y-2">
                        <div className="text-xs font-mono bg-background rounded p-2 border">
                          <strong>Member Account:</strong><br />
                          Email: sarah.johnson@nhs.uk<br />
                          Password: password123
                        </div>
                        <div className="text-xs font-mono bg-background rounded p-2 border">
                          <strong>Admin Account:</strong><br />
                          Email: admin@myyeargroup.com<br />
                          Password: admin123
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Register Link */}
                <div className="text-center pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary hover:underline font-medium">
                      Register here
                    </Link>
                  </p>
                </div>

                {/* Forgot Password */}
                <div className="text-center">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-muted-foreground hover:text-primary hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}