import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, mockUsers, mockNotifications } from '@/data/enhancedMockData';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  notifications: typeof mockNotifications;
  markNotificationAsRead: (notificationId: string) => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gmcNumber: string;
  medicalSchoolId: string;
  graduationYear: number;
  specialty: string;
  currentPosition?: string;
  location?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState(mockNotifications);
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(
      u => u.email === email && u.password === password
    );
    
    if (!foundUser) {
      setIsLoading(false);
      throw new Error('Invalid email or password');
    }
    
    if (!foundUser.emailVerified) {
      setIsLoading(false);
      throw new Error('Please verify your email first');
    }
    
    if (foundUser.status === 'suspended') {
      setIsLoading(false);
      throw new Error('Your account has been suspended');
    }
    
    if (foundUser.status === 'rejected') {
      setIsLoading(false);
      throw new Error('Your registration was not approved');
    }
    
    if (foundUser.status === 'pending' && foundUser.role !== 'superadmin') {
      setIsLoading(false);
      throw new Error('Your account is pending approval');
    }
    
    // Update last login
    foundUser.lastLogin = new Date();
    
    setUser(foundUser);
    localStorage.setItem('currentUser', JSON.stringify(foundUser));
    
    // Load user-specific notifications
    const userNotifications = mockNotifications.filter(n => n.userId === foundUser.id);
    setNotifications(userNotifications);
    
    toast({
      title: "Welcome back!",
      description: `Logged in as ${foundUser.firstName} ${foundUser.lastName}`,
    });
    
    setIsLoading(false);
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if user already exists
    const existingUser = mockUsers.find(
      u => u.email === userData.email || u.gmcNumber === userData.gmcNumber
    );
    
    if (existingUser) {
      setIsLoading(false);
      throw new Error('User already exists with this email or GMC number');
    }
    
    // Create new user
    const newUser: User = {
      id: `u${Date.now()}`,
      email: userData.email,
      password: userData.password,
      role: 'member',
      status: 'pending',
      firstName: userData.firstName,
      lastName: userData.lastName,
      gmcNumber: userData.gmcNumber,
      medicalSchoolId: userData.medicalSchoolId,
      graduationYear: userData.graduationYear,
      specialty: userData.specialty,
      currentPosition: userData.currentPosition || '',
      location: userData.location || '',
      bio: '',
      profileImageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.firstName}`,
      emailVerified: false,
      createdAt: new Date(),
      lastLogin: new Date(),
    };
    
    // Add to mock database
    mockUsers.push(newUser);
    
    // Create admin notification
    mockNotifications.push({
      id: `n${Date.now()}`,
      userId: 'admin1',
      type: 'admin_approval',
      title: 'New Member Pending Approval',
      message: `${newUser.firstName} ${newUser.lastName} (${newUser.gmcNumber}) has registered and needs approval`,
      data: { userId: newUser.id },
      isRead: false,
      createdAt: new Date(),
    });
    
    toast({
      title: "Registration successful!",
      description: "Please check your email for verification and await admin approval.",
    });
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    setNotifications([]);
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update in mock database
    const userIndex = mockUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = updatedUser;
    }
    
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
    
    setIsLoading(false);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        notifications,
        markNotificationAsRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};