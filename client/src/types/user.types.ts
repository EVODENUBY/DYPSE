export interface Education {
  degree: string;
  fieldOfStudy: string;
  institution: string;
  startDate: Date;
  endDate?: Date;
  isCurrent?: boolean;
}

export interface Experience {
  title: string;
  company: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent?: boolean;
  description?: string;
}

export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profilePicture?: string;
  bio?: string;
  address?: string;
  district?: string;
  country?: string;
  dateOfBirth?: Date;
  gender?: string;
  education?: Education[];
  experience?: Experience[];
  skills?: Skill[];
  languages?: string[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
  resume?: string;
  updatedAt?: Date;
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'youth' | 'employer' | 'admin';
  isVerified: boolean;
  profile?: UserProfile;
  applications?: any[]; // Replace 'any' with a more specific type if available
  interviews?: any[];   // Replace 'any' with a more specific type if available
  createdAt: Date;
  updatedAt: Date;
}
