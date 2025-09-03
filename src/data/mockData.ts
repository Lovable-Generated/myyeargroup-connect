// Mock Data for MyYearGroup MVP

export interface Doctor {
  id: string;
  name: string;
  email: string;
  medicalSchool: string;
  graduationYear: number;
  specialty: string;
  gmcNumber: string;
  location: string;
  avatar?: string;
  bio?: string;
  isApproved: boolean;
  friends: string[];
  joinedAt: Date;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  images?: string[];
  visibility: 'yeargroup' | 'friends';
  likes: number;
  comments: Comment[];
  createdAt: Date;
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

export interface Job {
  id: string;
  title: string;
  hospital: string;
  location: string;
  specialty: string;
  description: string;
  postedById: string;
  salary?: string;
  type: 'permanent' | 'locum' | 'fellowship';
  postedAt: Date;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  type: 'swap' | 'rent';
  description: string;
  images: string[];
  availability: Date[];
  postedById: string;
  price?: number;
  postedAt: Date;
}

export interface MedicalSchool {
  id: string;
  name: string;
  location: string;
}

export const medicalSchools: MedicalSchool[] = [
  { id: '1', name: 'University of Oxford', location: 'Oxford' },
  { id: '2', name: 'University of Cambridge', location: 'Cambridge' },
  { id: '3', name: 'Imperial College London', location: 'London' },
  { id: '4', name: 'University College London', location: 'London' },
  { id: '5', name: "King's College London", location: 'London' },
  { id: '6', name: 'University of Edinburgh', location: 'Edinburgh' },
  { id: '7', name: 'University of Glasgow', location: 'Glasgow' },
  { id: '8', name: 'University of Manchester', location: 'Manchester' },
  { id: '9', name: 'University of Birmingham', location: 'Birmingham' },
  { id: '10', name: 'University of Bristol', location: 'Bristol' },
];

export const specialties = [
  'General Practice',
  'Internal Medicine',
  'Surgery',
  'Paediatrics',
  'Psychiatry',
  'Obstetrics & Gynaecology',
  'Anaesthetics',
  'Radiology',
  'Pathology',
  'Emergency Medicine',
  'Cardiology',
  'Neurology',
  'Orthopaedics',
  'Ophthalmology',
  'Dermatology',
];

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@nhs.uk',
    medicalSchool: 'University of Oxford',
    graduationYear: 2018,
    specialty: 'Cardiology',
    gmcNumber: 'GMC7891234',
    location: 'London',
    bio: 'Consultant Cardiologist at St. Bartholomew\'s Hospital. Interested in interventional cardiology and research.',
    isApproved: true,
    friends: ['2', '3'],
    joinedAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@nhs.uk',
    medicalSchool: 'University of Cambridge',
    graduationYear: 2018,
    specialty: 'Surgery',
    gmcNumber: 'GMC7891235',
    location: 'Cambridge',
    bio: 'Orthopaedic surgeon specializing in sports medicine and trauma.',
    isApproved: true,
    friends: ['1', '4'],
    joinedAt: new Date('2023-02-10'),
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@nhs.uk',
    medicalSchool: 'Imperial College London',
    graduationYear: 2019,
    specialty: 'Paediatrics',
    gmcNumber: 'GMC7891236',
    location: 'London',
    bio: 'Paediatric consultant with interests in neonatology and child development.',
    isApproved: true,
    friends: ['1', '5'],
    joinedAt: new Date('2023-03-05'),
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    email: 'james.wilson@nhs.uk',
    medicalSchool: 'University College London',
    graduationYear: 2017,
    specialty: 'Emergency Medicine',
    gmcNumber: 'GMC7891237',
    location: 'Manchester',
    bio: 'A&E consultant passionate about trauma care and medical education.',
    isApproved: false,
    friends: ['2'],
    joinedAt: new Date('2023-04-12'),
  },
];

export const mockPosts: Post[] = [
  {
    id: '1',
    authorId: '1',
    content: 'Exciting news! Just published a paper on minimally invasive cardiac procedures. Great collaboration with the team at Oxford. Looking forward to discussing this at our next reunion!',
    visibility: 'yeargroup',
    likes: 12,
    comments: [
      {
        id: '1',
        authorId: '2',
        content: 'Congratulations Sarah! Can\'t wait to read it.',
        createdAt: new Date('2024-01-15T10:30:00'),
      }
    ],
    createdAt: new Date('2024-01-15T09:00:00'),
  },
  {
    id: '2',
    authorId: '3',
    content: 'Wonderful experience at the Paediatric Conference in Edinburgh. Met so many inspiring colleagues. The session on childhood obesity was particularly insightful.',
    visibility: 'friends',
    likes: 8,
    comments: [],
    createdAt: new Date('2024-01-10T14:20:00'),
  },
];

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Consultant Cardiologist',
    hospital: 'Royal London Hospital',
    location: 'London',
    specialty: 'Cardiology',
    description: 'We are seeking a dynamic Consultant Cardiologist to join our established team. The successful candidate will contribute to all aspects of the cardiology service including outpatient clinics, inpatient care, and interventional procedures.',
    postedById: '1',
    salary: '£88,364 - £119,133',
    type: 'permanent',
    postedAt: new Date('2024-01-08'),
  },
  {
    id: '2',
    title: 'ST6 Orthopaedic Surgery',
    hospital: 'Addenbrooke\'s Hospital',
    location: 'Cambridge',
    specialty: 'Surgery',
    description: 'Exciting opportunity for an ST6 trainee in Orthopaedic Surgery. Excellent training opportunities in trauma and elective surgery.',
    postedById: '2',
    type: 'fellowship',
    postedAt: new Date('2024-01-05'),
  },
];

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Beautiful 2-bed flat in Canary Wharf',
    location: 'London',
    type: 'rent',
    description: 'Modern apartment close to major hospitals. Perfect for medical professionals. Fully furnished with great transport links.',
    images: ['/placeholder-property1.jpg'],
    availability: [new Date('2024-02-01'), new Date('2024-02-15'), new Date('2024-03-01')],
    postedById: '1',
    price: 2800,
    postedAt: new Date('2024-01-12'),
  },
  {
    id: '2',
    title: 'House swap: Edinburgh to London',
    location: 'Edinburgh',
    type: 'swap',
    description: 'Looking to swap my 3-bed house in Edinburgh for similar in London for 6 months. Great for someone doing a rotation.',
    images: ['/placeholder-property2.jpg'],
    availability: [new Date('2024-03-01'), new Date('2024-04-01')],
    postedById: '3',
    postedAt: new Date('2024-01-08'),
  },
];

// Helper functions
export const getDoctorById = (id: string): Doctor | undefined => {
  return mockDoctors.find(doctor => doctor.id === id);
};

export const getPostsByYearGroup = (graduationYear: number): Post[] => {
  const yearGroupDoctorIds = mockDoctors
    .filter(doctor => doctor.graduationYear === graduationYear && doctor.isApproved)
    .map(doctor => doctor.id);
  
  return mockPosts.filter(post => 
    yearGroupDoctorIds.includes(post.authorId) && post.visibility === 'yeargroup'
  );
};

export const getFriendsPosts = (doctorId: string): Post[] => {
  const doctor = getDoctorById(doctorId);
  if (!doctor) return [];
  
  return mockPosts.filter(post => 
    doctor.friends.includes(post.authorId) || post.authorId === doctorId
  );
};