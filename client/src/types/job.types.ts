export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: {
    min: number;
    max: number;
    currency: string;
    period: string;
  };
  description: string;
  postedDate: string;
  deadline: string;
  isRemote: boolean;
  experienceLevel: string;
  applicationCount: number;
  views: number;
  category: string;
  requiredSkills?: string[];
  requiredEducation?: string;
  skills: string[];
  requirements: string[];
  responsibilities: string[];
  
  // Application specific fields
  status?: 'Applied' | 'Under Review' | 'Interview Scheduled' | 'Offered' | 'Rejected' | 'Hired';
  appliedDate?: string;
  interviewDate?: string;
  rejectionReason?: string;
  applicationId?: string;
}

export interface JobFilters {
  searchQuery: string;
  location: string;
  jobType: string[];
  experienceLevel: string[];
  salaryRange: [number, number];
  isRemote: boolean;
  category: string;
  deadline: string;
}
