import type { JobPosting } from '../types/job.types';

export interface ScrapedJob {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  postedDate: string;
  deadline: string;
  jobType?: string;
  salary?: string;
  experienceLevel?: string;
  isRemote?: boolean;
  applicationCount?: number;
  views?: number;
  category?: string;
  skills?: string[];
  requiredEducation?: string;
  status?: 'Applied' | 'Under Review' | 'Interview Scheduled' | 'Offered' | 'Rejected' | 'Hired';
  appliedDate?: string;
  interviewDate?: string;
  rejectionReason?: string;
  applicationId?: string;
}

// Helper function to safely parse date string to Date object
const parseDate = (dateString: string | Date | null | undefined): Date | null => {
  if (!dateString) return null;
  if (dateString instanceof Date) return dateString;
  if (dateString === 'N/A') return null;
  
  // Handle relative dates like "2 days ago" or "in 5 days"
  const relativeMatch = dateString.match(/(\d+)\s+(day|week|month|year)s?\s+(ago|from now)/i);
  if (relativeMatch) {
    const [, numStr, unit, direction] = relativeMatch;
    const num = parseInt(numStr, 10);
    const date = new Date();
    
    if (unit.toLowerCase().startsWith('day')) {
      date.setDate(direction === 'ago' ? date.getDate() - num : date.getDate() + num);
    } else if (unit.toLowerCase().startsWith('week')) {
      date.setDate(direction === 'ago' ? date.getDate() - (num * 7) : date.getDate() + (num * 7));
    } else if (unit.toLowerCase().startsWith('month')) {
      date.setMonth(direction === 'ago' ? date.getMonth() - num : date.getMonth() + num);
    } else if (unit.toLowerCase().startsWith('year')) {
      date.setFullYear(direction === 'ago' ? date.getFullYear() - num : date.getFullYear() + num);
    }
    
    return date;
  }
  
  // Handle ISO date strings or other formats
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

// Helper function to parse salary range from string (e.g., "RWF 500,000 - 1,000,000")
const parseSalaryRange = (salaryString?: string) => {
  if (!salaryString) return undefined;
  
  try {
    // Remove currency symbols and commas, then extract numbers
    const numbers = salaryString
      .replace(/[^0-9\-\s]/g, '')
      .split(/\s+/)
      .filter(Boolean)
      .map(Number);
      
    if (numbers.length >= 2) {
      return {
        min: Math.min(...numbers),
        max: Math.max(...numbers),
        currency: salaryString.match(/[A-Za-z]+/)?.[0] || 'RWF',
        period: salaryString.toLowerCase().includes('year') ? 'year' : 'month'
      };
    } else if (numbers.length === 1) {
      return {
        min: numbers[0],
        max: numbers[0],
        currency: salaryString.match(/[A-Za-z]+/)?.[0] || 'RWF',
        period: salaryString.toLowerCase().includes('year') ? 'year' : 'month'
      };
    }
  } catch (error) {
    console.error('Error parsing salary range:', error);
  }
  return { 
    min: 0, 
    max: 0, 
    currency: 'RWF', 
    period: 'month' 
  };
};

export const mapToJobPosting = (job: ScrapedJob): JobPosting => {
  // Parse dates
  const postedDate = parseDate(job.postedDate) || new Date();
  const deadline = parseDate(job.deadline);
  
  // Parse salary if available
  const salary = job.salary ? parseSalaryRange(job.salary) : undefined;
  
  return {
    id: job._id,
    title: job.title,
    company: job.company || 'Company Not Specified',
    location: job.location || 'Location Not Specified',
    type: job.jobType || 'Full-time',
    jobType: job.jobType || 'Full-time',
    salary: salary ? {
      min: salary.min,
      max: salary.max,
      currency: salary.currency,
      period: salary.period
    } : undefined,
    description: job.description || 'No description available',
    postedDate: postedDate,
    deadline: deadline,
    isRemote: job.isRemote || false,
    experienceLevel: job.experienceLevel || 'Not Specified',
    applicationCount: job.applicationCount || 0,
    views: job.views || 0,
    category: job.category || 'General',
    requiredSkills: job.requiredEducation ? [job.requiredEducation] : [],
    requiredEducation: job.requiredEducation,
    skills: job.skills || [],
    requirements: job.requirements || [],
    responsibilities: job.responsibilities || [],
    status: job.status,
    appliedDate: job.appliedDate,
    interviewDate: job.interviewDate
  };
};
