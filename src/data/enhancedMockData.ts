// Enhanced Mock Data System for MyYearGroup MVP
import { medicalSchools, specialties } from './mockData';

export interface User {
  id: string;
  email: string;
  password: string; // For demo purposes only
  role: 'member' | 'superadmin';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  
  // Profile
  firstName: string;
  lastName: string;
  gmcNumber: string;
  medicalSchoolId: string;
  graduationYear: number;
  specialty: string;
  currentPosition: string;
  location: string;
  bio: string;
  profileImageUrl: string;
  
  // Meta
  emailVerified: boolean;
  createdAt: Date;
  lastLogin: Date;
  approvedAt?: Date;
  approvedBy?: string;
}

export interface Yeargroup {
  id: string;
  medicalSchoolId: string;
  graduationYear: number;
  name: string;
  description: string;
  coverImageUrl: string;
  memberCount: number;
  createdAt: Date;
}

export interface Post {
  id: string;
  userId: string;
  yeargroupId: string;
  content: string;
  visibility: 'yeargroup' | 'friends' | 'public';
  imageUrls: string[];
  documentUrls: string[];
  likesCount: number;
  commentsCount: number;
  likedBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface Friendship {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'blocked';
  requestedAt: Date;
  acceptedAt?: Date;
}

export interface Job {
  id: string;
  userId: string;
  title: string;
  hospital: string;
  department: string;
  location: string;
  jobType: 'permanent' | 'locum' | 'fellowship' | 'training';
  description: string;
  requirements: string;
  salaryRange: string;
  applicationDeadline: Date;
  contactEmail: string;
  isActive: boolean;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Property {
  id: string;
  userId: string;
  title: string;
  type: 'swap' | 'rent';
  location: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  price?: number;
  availableFrom: Date;
  availableTo: Date;
  imageUrls: string[];
  amenities: string[];
  swapPreferences?: string;
  isActive: boolean;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  yeargroupId: string;
  organizerId: string;
  title: string;
  description: string;
  eventDate: Date;
  location: string;
  maxAttendees: number;
  rsvpDeadline: Date;
  imageUrl: string;
  attendees: EventAttendee[];
  createdAt: Date;
}

export interface EventAttendee {
  userId: string;
  status: 'attending' | 'maybe' | 'not_attending';
  respondedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'friend_request' | 'post_like' | 'comment' | 'event_invite' | 'admin_approval' | 'job_posted' | 'property_listed';
  title: string;
  message: string;
  data: any;
  isRead: boolean;
  createdAt: Date;
}

// Mock Users Database
export const mockUsers: User[] = [
  {
    id: 'admin1',
    email: 'admin@myyeargroup.com',
    password: 'admin123',
    role: 'superadmin',
    status: 'approved',
    firstName: 'Admin',
    lastName: 'User',
    gmcNumber: 'GMC0000000',
    medicalSchoolId: '1',
    graduationYear: 2010,
    specialty: 'Administration',
    currentPosition: 'Platform Administrator',
    location: 'London',
    bio: 'Managing the MyYearGroup platform',
    profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    emailVerified: true,
    createdAt: new Date('2023-01-01'),
    lastLogin: new Date('2024-01-20'),
  },
  {
    id: 'u1',
    email: 'sarah.johnson@nhs.uk',
    password: 'password123',
    role: 'member',
    status: 'approved',
    firstName: 'Sarah',
    lastName: 'Johnson',
    gmcNumber: 'GMC7891234',
    medicalSchoolId: '1',
    graduationYear: 2018,
    specialty: 'Cardiology',
    currentPosition: 'Consultant Cardiologist',
    location: 'London',
    bio: 'Consultant Cardiologist at St. Bartholomew\'s Hospital. Interested in interventional cardiology and research.',
    profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    emailVerified: true,
    createdAt: new Date('2023-01-15'),
    lastLogin: new Date('2024-01-20'),
    approvedAt: new Date('2023-01-16'),
    approvedBy: 'admin1',
  },
  {
    id: 'u2',
    email: 'michael.chen@nhs.uk',
    password: 'password123',
    role: 'member',
    status: 'approved',
    firstName: 'Michael',
    lastName: 'Chen',
    gmcNumber: 'GMC7891235',
    medicalSchoolId: '2',
    graduationYear: 2018,
    specialty: 'Surgery',
    currentPosition: 'Orthopaedic Surgeon',
    location: 'Cambridge',
    bio: 'Orthopaedic surgeon specializing in sports medicine and trauma.',
    profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    emailVerified: true,
    createdAt: new Date('2023-02-10'),
    lastLogin: new Date('2024-01-19'),
    approvedAt: new Date('2023-02-11'),
    approvedBy: 'admin1',
  },
  {
    id: 'u3',
    email: 'emily.rodriguez@nhs.uk',
    password: 'password123',
    role: 'member',
    status: 'approved',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    gmcNumber: 'GMC7891236',
    medicalSchoolId: '3',
    graduationYear: 2019,
    specialty: 'Paediatrics',
    currentPosition: 'Paediatric Consultant',
    location: 'London',
    bio: 'Paediatric consultant with interests in neonatology and child development.',
    profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    emailVerified: true,
    createdAt: new Date('2023-03-05'),
    lastLogin: new Date('2024-01-18'),
    approvedAt: new Date('2023-03-06'),
    approvedBy: 'admin1',
  },
  {
    id: 'u4',
    email: 'james.wilson@nhs.uk',
    password: 'password123',
    role: 'member',
    status: 'pending',
    firstName: 'James',
    lastName: 'Wilson',
    gmcNumber: 'GMC7891237',
    medicalSchoolId: '4',
    graduationYear: 2017,
    specialty: 'Emergency Medicine',
    currentPosition: 'A&E Consultant',
    location: 'Manchester',
    bio: 'A&E consultant passionate about trauma care and medical education.',
    profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    emailVerified: true,
    createdAt: new Date('2024-01-18'),
    lastLogin: new Date('2024-01-18'),
  },
  {
    id: 'u5',
    email: 'priya.patel@nhs.uk',
    password: 'password123',
    role: 'member',
    status: 'approved',
    firstName: 'Priya',
    lastName: 'Patel',
    gmcNumber: 'GMC7891238',
    medicalSchoolId: '1',
    graduationYear: 2018,
    specialty: 'Psychiatry',
    currentPosition: 'Consultant Psychiatrist',
    location: 'Oxford',
    bio: 'Specializing in adult psychiatry with focus on mood disorders.',
    profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    emailVerified: true,
    createdAt: new Date('2023-04-20'),
    lastLogin: new Date('2024-01-17'),
    approvedAt: new Date('2023-04-21'),
    approvedBy: 'admin1',
  },
];

// Mock Yeargroups
export const mockYeargroups: Yeargroup[] = [
  {
    id: 'yg1',
    medicalSchoolId: '1',
    graduationYear: 2018,
    name: 'Oxford Class of 2018',
    description: 'Connect with fellow Oxford medical graduates from 2018',
    coverImageUrl: 'https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=1200',
    memberCount: 45,
    createdAt: new Date('2023-01-01'),
  },
  {
    id: 'yg2',
    medicalSchoolId: '2',
    graduationYear: 2018,
    name: 'Cambridge Class of 2018',
    description: 'Cambridge medical graduates of 2018',
    coverImageUrl: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1200',
    memberCount: 38,
    createdAt: new Date('2023-01-01'),
  },
  {
    id: 'yg3',
    medicalSchoolId: '3',
    graduationYear: 2019,
    name: 'Imperial Class of 2019',
    description: 'Imperial College London medical graduates of 2019',
    coverImageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200',
    memberCount: 52,
    createdAt: new Date('2023-01-01'),
  },
];

// Mock Posts
export const mockPosts: Post[] = [
  {
    id: 'p1',
    userId: 'u1',
    yeargroupId: 'yg1',
    content: 'Exciting news! Just published a paper on minimally invasive cardiac procedures in the BMJ. Great collaboration with the team at Oxford. Looking forward to discussing this at our next reunion!',
    visibility: 'yeargroup',
    imageUrls: ['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800'],
    documentUrls: [],
    likesCount: 24,
    commentsCount: 5,
    likedBy: ['u2', 'u3', 'u5'],
    createdAt: new Date('2024-01-15T09:00:00'),
    updatedAt: new Date('2024-01-15T09:00:00'),
  },
  {
    id: 'p2',
    userId: 'u3',
    yeargroupId: 'yg3',
    content: 'Wonderful experience at the Paediatric Conference in Edinburgh. Met so many inspiring colleagues. The session on childhood obesity was particularly insightful. Anyone else attending the London conference next month?',
    visibility: 'friends',
    imageUrls: [],
    documentUrls: [],
    likesCount: 18,
    commentsCount: 3,
    likedBy: ['u1', 'u2'],
    createdAt: new Date('2024-01-10T14:20:00'),
    updatedAt: new Date('2024-01-10T14:20:00'),
  },
  {
    id: 'p3',
    userId: 'u2',
    yeargroupId: 'yg2',
    content: 'Just completed my first marathon! Training while maintaining hospital schedules was challenging but worth it. Thanks to everyone who supported the charity fundraiser - we raised £5,000 for medical equipment!',
    visibility: 'yeargroup',
    imageUrls: ['https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800'],
    documentUrls: [],
    likesCount: 42,
    commentsCount: 12,
    likedBy: ['u1', 'u3', 'u5'],
    createdAt: new Date('2024-01-08T16:45:00'),
    updatedAt: new Date('2024-01-08T16:45:00'),
  },
];

// Mock Comments
export const mockComments: Comment[] = [
  {
    id: 'c1',
    postId: 'p1',
    userId: 'u2',
    content: 'Congratulations Sarah! Can\'t wait to read it. This is exactly the kind of innovation we need.',
    createdAt: new Date('2024-01-15T10:30:00'),
  },
  {
    id: 'c2',
    postId: 'p1',
    userId: 'u5',
    content: 'Amazing work! Would love to discuss potential applications in psychiatric settings.',
    createdAt: new Date('2024-01-15T11:15:00'),
  },
  {
    id: 'c3',
    postId: 'p3',
    userId: 'u1',
    content: 'Incredible achievement Michael! Which charity did you run for?',
    createdAt: new Date('2024-01-08T17:30:00'),
  },
];

// Mock Friendships
export const mockFriendships: Friendship[] = [
  {
    id: 'f1',
    userId: 'u1',
    friendId: 'u2',
    status: 'accepted',
    requestedAt: new Date('2023-02-01'),
    acceptedAt: new Date('2023-02-02'),
  },
  {
    id: 'f2',
    userId: 'u1',
    friendId: 'u3',
    status: 'accepted',
    requestedAt: new Date('2023-03-10'),
    acceptedAt: new Date('2023-03-11'),
  },
  {
    id: 'f3',
    userId: 'u2',
    friendId: 'u5',
    status: 'pending',
    requestedAt: new Date('2024-01-15'),
  },
];

// Mock Jobs
export const mockJobs: Job[] = [
  {
    id: 'j1',
    userId: 'u1',
    title: 'Consultant Cardiologist',
    hospital: 'Royal London Hospital',
    department: 'Cardiology',
    location: 'London',
    jobType: 'permanent',
    description: 'We are seeking a dynamic Consultant Cardiologist to join our established team. The successful candidate will contribute to all aspects of the cardiology service including outpatient clinics, inpatient care, and interventional procedures.',
    requirements: 'CCT in Cardiology, GMC registration, excellent communication skills',
    salaryRange: '£88,364 - £119,133',
    applicationDeadline: new Date('2024-02-28'),
    contactEmail: 'recruitment@royallondon.nhs.uk',
    isActive: true,
    viewsCount: 156,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },
  {
    id: 'j2',
    userId: 'u2',
    title: 'ST6 Orthopaedic Surgery',
    hospital: 'Addenbrooke\'s Hospital',
    department: 'Orthopaedics',
    location: 'Cambridge',
    jobType: 'fellowship',
    description: 'Exciting opportunity for an ST6 trainee in Orthopaedic Surgery. Excellent training opportunities in trauma and elective surgery.',
    requirements: 'MRCS, ST5 completion, interest in sports medicine',
    salaryRange: '£51,017 - £58,398',
    applicationDeadline: new Date('2024-03-15'),
    contactEmail: 'ortho.training@addenbrookes.nhs.uk',
    isActive: true,
    viewsCount: 89,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: 'j3',
    userId: 'u3',
    title: 'Locum Paediatric Consultant',
    hospital: 'Great Ormond Street Hospital',
    department: 'Paediatrics',
    location: 'London',
    jobType: 'locum',
    description: '3-month locum position covering maternity leave. Join our world-renowned paediatric team.',
    requirements: 'CCT in Paediatrics, experience in complex cases',
    salaryRange: '£500-650 per day',
    applicationDeadline: new Date('2024-02-01'),
    contactEmail: 'locums@gosh.nhs.uk',
    isActive: true,
    viewsCount: 234,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
];

// Mock Properties
export const mockProperties: Property[] = [
  {
    id: 'prop1',
    userId: 'u1',
    title: 'Beautiful 2-bed flat in Canary Wharf',
    type: 'rent',
    location: 'London, E14',
    description: 'Modern apartment on the 15th floor with stunning river views. Close to major hospitals including Royal London and Barts. Fully furnished with high-end appliances.',
    bedrooms: 2,
    bathrooms: 2,
    price: 2800,
    availableFrom: new Date('2024-02-01'),
    availableTo: new Date('2025-02-01'),
    imageUrls: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1558442074-3c19ca6acd6b?w=800',
    ],
    amenities: ['Gym', 'Concierge', 'Parking', 'Balcony', 'Dishwasher'],
    isActive: true,
    viewsCount: 342,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: 'prop2',
    userId: 'u3',
    title: 'House swap: Edinburgh to London',
    type: 'swap',
    location: 'Edinburgh, EH3',
    description: 'Beautiful Victorian 3-bed house in New Town Edinburgh. Looking to swap for similar in London for 6-month rotation. Perfect for family, close to Royal Infirmary.',
    bedrooms: 3,
    bathrooms: 2,
    availableFrom: new Date('2024-03-01'),
    availableTo: new Date('2024-09-01'),
    imageUrls: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
      'https://images.unsplash.com/photo-1565538420870-da08ff96a207?w=800',
    ],
    amenities: ['Garden', 'Parking', 'Study', 'Storage'],
    swapPreferences: 'Looking for 2-3 bedroom property in London zones 1-3',
    isActive: true,
    viewsCount: 178,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },
];

// Mock Events
export const mockEvents: Event[] = [
  {
    id: 'e1',
    yeargroupId: 'yg1',
    organizerId: 'u1',
    title: 'Oxford Class of 2018 - 5 Year Reunion',
    description: 'Join us for dinner and drinks to celebrate 5 years since graduation! Venue: The Randolph Hotel, Oxford',
    eventDate: new Date('2024-03-15T19:00:00'),
    location: 'The Randolph Hotel, Oxford',
    maxAttendees: 60,
    rsvpDeadline: new Date('2024-03-01'),
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
    attendees: [
      { userId: 'u1', status: 'attending', respondedAt: new Date('2024-01-10') },
      { userId: 'u5', status: 'attending', respondedAt: new Date('2024-01-11') },
      { userId: 'u2', status: 'maybe', respondedAt: new Date('2024-01-12') },
    ],
    createdAt: new Date('2024-01-05'),
  },
  {
    id: 'e2',
    yeargroupId: 'yg2',
    organizerId: 'u2',
    title: 'Cambridge Medical Alumni Conference',
    description: 'Annual conference featuring talks on latest medical innovations and networking opportunities.',
    eventDate: new Date('2024-04-20T09:00:00'),
    location: 'Cambridge University Medical School',
    maxAttendees: 150,
    rsvpDeadline: new Date('2024-04-10'),
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    attendees: [
      { userId: 'u2', status: 'attending', respondedAt: new Date('2024-01-08') },
    ],
    createdAt: new Date('2024-01-03'),
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 'u1',
    type: 'friend_request',
    title: 'New Friend Request',
    message: 'Dr. James Wilson wants to connect with you',
    data: { fromUserId: 'u4' },
    isRead: false,
    createdAt: new Date('2024-01-18T10:00:00'),
  },
  {
    id: 'n2',
    userId: 'u1',
    type: 'post_like',
    title: 'Your post was liked',
    message: 'Dr. Priya Patel liked your post about cardiac procedures',
    data: { postId: 'p1', likedBy: 'u5' },
    isRead: true,
    createdAt: new Date('2024-01-15T11:00:00'),
  },
  {
    id: 'n3',
    userId: 'admin1',
    type: 'admin_approval',
    title: 'New Member Pending Approval',
    message: 'Dr. James Wilson (GMC7891237) has registered and needs approval',
    data: { userId: 'u4' },
    isRead: false,
    createdAt: new Date('2024-01-18T09:00:00'),
  },
];