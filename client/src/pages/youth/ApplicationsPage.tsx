import React, { useState, useEffect } from 'react';
import type { JobPosting } from '../../types/job.types';
import { 
  BriefcaseIcon, 
  ClockIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as ClockIconSolid
} from '@heroicons/react/24/outline';

// Mock data for applied jobs
const mockAppliedJobs: JobPosting[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'Tech Corp',
    location: 'Muhanga, Rwanda',
    type: 'Full-time',
    salary: { min: 80000, max: 120000, currency: '$', period: 'year' },
    description: 'We are looking for a skilled Frontend Developer to join our team...',
    postedDate: '2025-05-15',
    deadline: '2025-06-15',
    isRemote: true,
    experienceLevel: 'Mid Level',
    applicationCount: 24,
    views: 156,
    category: 'Software Development',
    requiredSkills: ['React', 'JavaScript', 'Redux'],
    skills: ['React', 'TypeScript', 'Redux', 'HTML', 'CSS'],
    requirements: ['3+ years of React experience', 'Strong JavaScript skills', 'Experience with Redux'],
    responsibilities: ['Develop user interfaces', 'Collaborate with design team', 'Write clean and maintainable code'],
    status: 'Under Review',
    appliedDate: '2023-05-20',
    applicationId: 'APP-001'
  },
  {
    id: '2',
    title: 'UX/UI Designer',
    company: 'Design Hub',
    location: 'Remote',
    type: 'Contract',
    salary: { min: 45, max: 65, currency: '$', period: 'hour' },
    description: 'Looking for a creative UX/UI Designer to create amazing user experiences...',
    postedDate: '2025-07-20',
    deadline: '2025-08-20',
    isRemote: true,
    experienceLevel: 'Mid Level',
    applicationCount: 18,
    views: 145,
    category: 'Design',
    requiredSkills: ['Figma', 'Sketch', 'UI/UX'],
    skills: ['Figma', 'Sketch', 'User Research', 'Prototyping', 'UI/UX'],
    requirements: ['Portfolio required', '3+ years of design experience', 'Figma/Sketch'],
    responsibilities: ['Create wireframes and prototypes', 'Design user interfaces', 'Conduct user research'],
    status: 'Interview Scheduled',
    appliedDate: '2023-05-12',
    applicationId: 'APP-002',
    interviewDate: '2023-06-05 14:30'
  },
  {
    id: '3',
    title: 'Backend Engineer',
    company: 'Data Systems Ltd',
    location: 'Nyarugenge, Rwanda',
    type: 'Full-time',
    salary: { min: 95000, max: 140000, currency: '$', period: 'year' },
    description: 'Seeking an experienced Backend Engineer to develop and maintain our server infrastructure...',
    postedDate: '2025-05-20',
    deadline: '2025-06-20',
    isRemote: true,
    experienceLevel: 'Senior',
    applicationCount: 19,
    views: 203,
    category: 'Software Engineering',
    requiredSkills: ['Node.js', 'Python', 'Java', 'Database Design'],
    skills: ['Node.js', 'Python', 'REST APIs', 'SQL', 'Microservices'],
    requirements: ['5+ years of backend development', 'Node.js/Python/Java', 'Database design'],
    responsibilities: ['Develop APIs', 'Optimize performance', 'Ensure system reliability'],
    status: 'Rejected',
    appliedDate: '2025-05-25',
    applicationId: 'APP-003',
    rejectionReason: 'Position was filled internally'
  }
];

const ApplicationsPage: React.FC = () => {
  const [appliedJobs, setAppliedJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchAppliedJobs = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setAppliedJobs(mockAppliedJobs);
      } catch (error) {
        console.error('Error fetching applied jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  const getStatusBadge = (status: string | undefined) => {
    if (!status) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <ClockIconSolid className="-ml-0.5 mr-1.5 h-3 w-3 text-gray-400" />
          Unknown
        </span>
      );
    }
    
    switch (status.toLowerCase()) {
      case 'under review':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <ClockIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-blue-400" />
            Under Review
          </span>
        );
      case 'interview scheduled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <CheckCircleIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-purple-500" />
            Interview Scheduled
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-green-500" />
            Application Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="-ml-0.5 mr-1.5 h-3 w-3 text-red-400" />
            Application Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <ClockIconSolid className="-ml-0.5 mr-1.5 h-3 w-3 text-gray-400" />
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const viewApplicationDetails = (job: JobPosting) => {
    setSelectedJob(job);
    setIsDetailOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="mt-2 text-gray-600">Track the status of your job applications</p>
        </div>

        {/* Applications List */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {appliedJobs.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {appliedJobs.map((job, index) => (
                <li 
                  key={job.id} 
                  className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <div className="px-6 py-5 sm:px-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-12 w-12 rounded-lg flex items-center justify-center ${
                          job.status === 'Rejected' ? 'bg-red-100' : 
                          job.status === 'Interview Scheduled' ? 'bg-purple-100' : 
                          job.status === 'Under Review' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <BriefcaseIcon className={`h-6 w-6 ${
                            job.status === 'Rejected' ? 'text-red-600' : 
                            job.status === 'Interview Scheduled' ? 'text-purple-600' : 
                            job.status === 'Under Review' ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                          <p className="text-sm text-gray-500">{job.company} • {job.location}</p>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        {getStatusBadge(job.status)}
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <span>Applied on {formatDate(job.appliedDate)}</span>
                        </p>
                        {job.interviewDate && (
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            <ClockIconSolid className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            Interview: {formatDate(job.interviewDate.split(' ')[0])} at {job.interviewDate.split(' ')[1]}
                          </p>
                        )}
                      </div>
                      <div className="mt-3 sm:mt-0">
                        <button
                          onClick={() => viewApplicationDetails(job)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                        >
                          View Application
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
              <p className="mt-1 text-sm text-gray-500">You haven't applied to any jobs yet.</p>
              <div className="mt-6">
                <a
                  href="/youth/jobs"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Browse Jobs
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      {isDetailOpen && selectedJob && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {selectedJob.title} - {selectedJob.company}
                      </h3>
                      <button
                        type="button"
                        className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={() => setIsDetailOpen(false)}
                      >
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <span>{selectedJob.location} • {selectedJob.type}</span>
                      </div>
                      
                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <h4 className="font-medium text-gray-900">Application Status</h4>
                        <div className="mt-2">
                          {getStatusBadge(selectedJob.status)}
                        </div>
                        {selectedJob.rejectionReason && (
                          <div className="mt-2 text-sm text-red-600">
                            <p><span className="font-medium">Reason:</span> {selectedJob.rejectionReason}</p>
                          </div>
                        )}
                        {selectedJob.interviewDate && (
                          <div className="mt-2 text-sm text-gray-600">
                            <p><span className="font-medium">Interview Scheduled:</span> {formatDate(selectedJob.interviewDate.split(' ')[0])} at {selectedJob.interviewDate.split(' ')[1]}</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <h4 className="font-medium text-gray-900">Application Details</h4>
                        <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Application ID</p>
                            <p className="font-medium">{selectedJob.applicationId}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Applied On</p>
                            <p className="font-medium">{formatDate(selectedJob.appliedDate)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Position</p>
                            <p className="font-medium">{selectedJob.title}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Company</p>
                            <p className="font-medium">{selectedJob.company}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <h4 className="font-medium text-gray-900">Job Description</h4>
                        <p className="mt-2 text-sm text-gray-600">{selectedJob.description}</p>
                        
                        <h4 className="mt-4 font-medium text-gray-900">Requirements</h4>
                        <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                          {selectedJob.requirements?.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsDetailOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
