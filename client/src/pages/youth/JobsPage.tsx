import React, { useState, useEffect } from 'react';
import type { JobPosting, JobFilters } from '../../types/job.types';
import JobCard from '../../components/youth/jobs/JobCard';
import { ApplyModal } from '../../components/modals/ApplyModal';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

// Helper function to add days to a date
const addDays = (date: Date, days: number): string => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split('T')[0];
};

const today = new Date();

// Mock data with diverse job listings to test
const mockJobs: JobPosting[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'Muhanga, Rwanda',
    type: 'Full-time',
    salary: { min: 80000, max: 120000, currency: '$', period: 'year' },
    description: 'We are looking for a skilled Frontend Developer to join our team...',
    requirements: ['3+ years of React experience', 'Strong JavaScript/TypeScript skills', 'Experience with Redux'],
    responsibilities: ['Develop user interfaces', 'Collaborate with design team', 'Write clean and maintainable code'],
    postedDate: addDays(today, -5), // Posted 5 days ago
    deadline: addDays(today, 10),    // 15 days from posting
    experienceLevel: 'Mid Level',
    skills: ['React', 'TypeScript', 'Redux', 'HTML', 'CSS'],
    isRemote: true,
    applicationCount: 24,
    views: 156,
    category: 'Software Development',
  },
  {
    id: '2',
    title: 'Data Scientist',
    company: 'DataInsights',
    location: 'Gicumbi, Rwanda',
    type: 'Full-time',
    salary: { min: 100000, max: 150000, currency: '$', period: 'year' },
    description: 'Join our data science team to analyze complex datasets and build predictive models...',
    requirements: ['MS/PhD in Computer Science or related field', 'Experience with Python and ML libraries', 'Strong statistical knowledge'],
    responsibilities: ['Develop machine learning models', 'Analyze large datasets', 'Present findings to stakeholders'],
    postedDate: addDays(today, -10), // Posted 10 days ago
    deadline: addDays(today, 5),     // 15 days from posting
    experienceLevel: 'Senior',
    skills: ['Python', 'Machine Learning', 'Pandas', 'TensorFlow', 'SQL'],
    isRemote: false,
    applicationCount: 18,
    views: 210,
    category: 'Data Science',
  },
  {
    id: '3',
    title: 'UX/UI Designer',
    company: 'DesignHub',
    location: 'Kicukiro, Rwanda',
    type: 'Contract',
    salary: { min: 45, max: 65, currency: '$', period: 'hour' },
    description: 'Looking for a creative UX/UI Designer to design beautiful and intuitive user experiences...',
    requirements: ['3+ years of UX/UI design experience', 'Portfolio of design projects', 'Proficiency in design tools'],
    responsibilities: ['Create wireframes and prototypes', 'Design user interfaces', 'Conduct user research'],
    postedDate: addDays(today, -2), // Posted 2 days ago
    deadline: addDays(today, 28),   // 30 days from posting
    experienceLevel: 'Mid Level',
    skills: ['Figma', 'Sketch', 'User Research', 'Prototyping', 'UI/UX'],
    isRemote: true,
    applicationCount: 32,
    views: 189,
    category: 'Design',
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'CloudScale',
    location: 'Gasabo, Rwanda',
    type: 'Full-time',
    salary: { min: 110000, max: 160000, currency: '$', period: 'year' },
    description: 'Join our team to build and maintain our cloud infrastructure and CI/CD pipelines...',
    requirements: ['Experience with AWS/Azure/GCP', 'Containerization (Docker, Kubernetes)', 'CI/CD tools'],
    responsibilities: ['Maintain cloud infrastructure', 'Automate deployment processes', 'Ensure system reliability'],
    postedDate: addDays(today, -1), // Posted 1 day ago
    deadline: addDays(today, 14),   // 15 days from posting
    experienceLevel: 'Senior',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    isRemote: true,
    applicationCount: 15,
    views: 201,
    category: 'DevOps',
  },
  {
    id: '5',
    title: 'Marketing Manager',
    company: 'GrowthMasters',
    location: 'Rwamagana, Rwanda',
    type: 'Full-time',
    salary: { min: 70000, max: 95000, currency: '$', period: 'year' },
    description: 'Lead our marketing team and develop strategies to drive customer acquisition and engagement...',
    requirements: ['5+ years of marketing experience', 'Digital marketing expertise', 'Team leadership'],
    responsibilities: ['Develop marketing strategies', 'Manage marketing campaigns', 'Analyze market trends'],
    postedDate: addDays(today, -7), // Posted 7 days ago
    deadline: addDays(today, 0),    // Today is the deadline
    experienceLevel: 'Mid Level',
    skills: ['Digital Marketing', 'SEO', 'Social Media', 'Content Strategy', 'Analytics'],
    isRemote: false,
    applicationCount: 22,
    views: 145,
    category: 'Marketing',
  },
  {
    id: '6',
    title: 'Product Manager',
    company: 'ProductLabs',
    location: 'Nyarugenge, Rwanda',
    type: 'Full-time',
    salary: { min: 90000, max: 140000, currency: '$', period: 'year' },
    description: 'Lead product development from concept to launch, working with cross-functional teams...',
    requirements: ['3+ years of product management', 'Technical background', 'Agile methodology experience'],
    responsibilities: ['Define product vision', 'Gather requirements', 'Work with development teams'],
    postedDate: addDays(today, -14), // Posted 14 days ago
    deadline: addDays(today, -1),    // Expired 1 day ago
    experienceLevel: 'Senior',
    skills: ['Product Management', 'Agile', 'User Stories', 'Roadmapping', 'JIRA'],
    isRemote: true,
    applicationCount: 28,
    views: 198,
    category: 'Product',
  },
  {
    id: '7',
    title: 'Security Engineer',
    company: 'SecureNet',
    location: 'Rubavu, Rwanda',
    type: 'Full-time',
    salary: { min: 120000, max: 180000, currency: '$', period: 'year' },
    description: 'Help us secure our systems and protect against cyber threats...',
    requirements: ['Cybersecurity experience', 'Knowledge of security protocols', 'Certifications a plus'],
    responsibilities: ['Implement security measures', 'Monitor for security breaches', 'Conduct security audits'],
    postedDate: addDays(today, -20), // Posted 20 days ago
    deadline: addDays(today, -5),    // Expired 5 days ago
    experienceLevel: 'Senior',
    skills: ['Cybersecurity', 'Network Security', 'Penetration Testing', 'SIEM', 'Firewalls'],
    isRemote: false,
    applicationCount: 12,
    views: 167,
    category: 'Security',
  },
  {
    id: '8',
    title: 'Backend Developer',
    company: 'API Masters',
    location: 'Huye, Rwanda',
    type: 'Full-time',
    salary: { min: 95000, max: 140000, currency: '$', period: 'year' },
    description: 'Build scalable backend services and APIs for our growing platform...',
    requirements: ['5+ years of backend development', 'Node.js/Python/Java', 'Database design'],
    responsibilities: ['Develop APIs', 'Optimize performance', 'Ensure system reliability'],
    postedDate: addDays(today, -3), // Posted 3 days ago
    deadline: addDays(today, 27),   // 30 days from posting
    experienceLevel: 'Senior',
    skills: ['Node.js', 'Python', 'REST APIs', 'SQL', 'Microservices'],
    isRemote: true,
    applicationCount: 19,
    views: 203,
    category: 'Software Engineering',
  }
];

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const jobsPerPage = 10;
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState<boolean>(false);
  const [requirementsMet, setRequirementsMet] = useState<boolean>(false);
  const [filters, setFilters] = useState<JobFilters>({
    searchQuery: '',
    location: '',
    jobType: [],
    experienceLevel: [],
    salaryRange: [0, 200000],
    isRemote: false,
    category: '',
    deadline: ''
  });
  
  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(mockJobs.map(job => job.category)));
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Filter jobs based on current filters
  const filterJobs = (jobsToFilter: JobPosting[]) => {
    return jobsToFilter.filter(job => {
      // Search query filter (title, company, or description)
      const matchesSearch = !filters.searchQuery || 
        job.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      // Location filter
      const matchesLocation = !filters.location || 
        job.location.toLowerCase().includes(filters.location.toLowerCase());
      
      // Job type filter
      const matchesJobType = filters.jobType.length === 0 || 
        filters.jobType.includes(job.type);
      
      // Experience level filter
      const matchesExperience = filters.experienceLevel.length === 0 || 
        (job.experienceLevel && filters.experienceLevel.includes(job.experienceLevel));
      
      // Salary range filter
      const matchesSalary = job.salary && 
        job.salary.min >= filters.salaryRange[0] && 
        job.salary.max <= filters.salaryRange[1];
      
      // Remote filter
      const matchesRemote = !filters.isRemote || job.isRemote;
      
      // Category filter
      const matchesCategory = !filters.category || 
        (job.category && job.category.toLowerCase() === filters.category.toLowerCase());
      
      // Deadline filter
      const matchesDeadline = !filters.deadline || 
        (job.deadline && new Date(job.deadline) >= new Date(filters.deadline));

      return matchesSearch && matchesLocation && matchesJobType && 
             matchesExperience && matchesSalary && matchesRemote && matchesCategory && matchesDeadline;
    });
  };

  // Fetch jobs (replace with actual API call)
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setJobs(mockJobs);
        setFilteredJobs(mockJobs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Update filtered jobs when filters or jobs change
  useEffect(() => {
    const filtered = filterJobs(jobs);
    setFilteredJobs(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, jobs]);

  // Get current jobs for pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Find matching jobs based on user's skills and education
  const findMatchingJobs = async () => {
    try {
      // In a real app, you would fetch user data from your backend/API
      const userSkills = ['React', 'TypeScript', 'JavaScript'];
      const userEducation = 'Computer Science';
      
      const matchedJobs = jobs.filter(job => {
        // Check if job requires any of the user's skills
        const hasMatchingSkill = job.requiredSkills?.some(skill => 
          userSkills.some(userSkill => 
            skill.toLowerCase().includes(userSkill.toLowerCase())
          )
        );
        
        // Check if job's required education matches user's education
        const hasMatchingEducation = job.requiredEducation?.toLowerCase().includes(
          userEducation.toLowerCase()
        );
        
        return hasMatchingSkill || hasMatchingEducation;
      });
      
      setFilteredJobs(matchedJobs);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error finding matching jobs:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The useEffect will automatically trigger the filter when filters state changes
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFilters(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'select-multiple') {
      const options = Array.from((e.target as HTMLSelectElement).selectedOptions, option => option.value);
      setFilters(prev => ({
        ...prev,
        [name]: options
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      location: '',
      jobType: [],
      experienceLevel: [],
      salaryRange: [0, 200000],
      isRemote: false,
      category: '',
      deadline: ''
    });
  };

  const handleApply = () => {
    if (selectedJob) {
      console.log('Submitting application for job:', selectedJob.id);
      // TODO: Implement actual application submission
      alert(`Application submitted for ${selectedJob.title} at ${selectedJob.company}`);
      setIsApplicationOpen(false);
    }
  };

  const openApplicationModal = (job: JobPosting) => {
    setSelectedJob(job);
    setRequirementsMet(false);
    setIsApplicationOpen(true);
  };

  const closeApplicationModal = () => {
    setIsApplicationOpen(false);
    setSelectedJob(null);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Find Your Dream Job</h1>
            <p className="mt-2 text-gray-600">Browse through our latest job listings and find the perfect match for your skills</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={findMatchingJobs}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Find Matching Jobs
            </button>
            <button
              type="button"
              onClick={toggleFilters}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FunnelIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="searchQuery"
                  value={filters.searchQuery}
                  onChange={handleFilterChange}
                  placeholder="Job title, keywords, or company"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="Location"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Search
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                    <div className="space-y-2">
                      {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                        <div key={type} className="flex items-center">
                          <input
                            id={`type-${type}`}
                            name="jobType"
                            type="checkbox"
                            value={type}
                            checked={filters.jobType.includes(type)}
                            onChange={handleFilterChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`type-${type}`} className="ml-2 text-sm text-gray-700">
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                    <div className="space-y-2">
                      {['Entry Level', 'Mid Level', 'Senior', 'Executive'].map((level) => (
                        <div key={level} className="flex items-center">
                          <input
                            id={`level-${level}`}
                            name="experienceLevel"
                            type="checkbox"
                            value={level}
                            checked={filters.experienceLevel.includes(level)}
                            onChange={handleFilterChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`level-${level}`} className="ml-2 text-sm text-gray-700">
                            {level}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">Salary Range</label>
                      <span className="text-sm text-gray-500">
                        ${filters.salaryRange[0].toLocaleString()} - ${filters.salaryRange[1].toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="px-2">
                        <input
                          type="range"
                          min="0"
                          max="200000"
                          step="1000"
                          value={filters.salaryRange[1]}
                          onChange={(e) => {
                            setFilters(prev => ({
                              ...prev,
                              salaryRange: [prev.salaryRange[0], parseInt(e.target.value)]
                            }));
                          }}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>$0</span>
                        <span>$200K+</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center">
                        <input
                          id="remote"
                          name="isRemote"
                          type="checkbox"
                          checked={filters.isRemote}
                          onChange={handleFilterChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remote" className="ml-2 text-sm text-gray-700">
                          Remote Only
                        </label>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                      <input
                        type="date"
                        name="deadline"
                        value={filters.deadline}
                        onChange={handleFilterChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      />
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <XMarkIcon className="h-4 w-4 mr-1" />
                        Clear all filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredJobs.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-medium">{(currentPage - 1) * jobsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * jobsPerPage, filteredJobs.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredJobs.length}</span> results
                  </p>
                  <div className="flex items-center">
                    <label htmlFor="sort" className="mr-2 text-sm text-gray-600">
                      Sort by:
                    </label>
                    <select
                      id="sort"
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option>Most Recent</option>
                      <option>Most Relevant</option>
                      <option>Highest Salary</option>
                      <option>Most Applications</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">
                      {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
                    </h2>
                    
                  </div>
                  
                  {currentJobs.map((job) => (
                    <div key={job.id} className="mb-4">
                      <JobCard 
                        job={job} 
                        onApply={() => {
                          const selectedJob = mockJobs.find(j => j.id === job.id);
                          if (selectedJob) {
                            openApplicationModal(selectedJob);
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {filteredJobs.length > 0 && (
                  <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                          currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                        disabled={currentPage === totalPages}
                        className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                          currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{(currentPage - 1) * jobsPerPage + 1}</span> to{' '}
                          <span className="font-medium">
                            {Math.min(currentPage * jobsPerPage, filteredJobs.length)}
                          </span>{' '}
                          of <span className="font-medium">{filteredJobs.length}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                              currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            <span className="sr-only">Previous</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>

                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            
                            return (
                              <button
                                key={pageNum}
                                onClick={() => paginate(pageNum)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  currentPage === pageNum
                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}

                          <button
                            onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                            disabled={currentPage === totalPages}
                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                              currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            <span className="sr-only">Next</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {jobs.length === 0 
                    ? 'No job listings available at the moment.'
                    : 'No jobs match your search criteria. Try adjusting your search or filter to find what you\'re looking for.'}
                </p>
              </div>
            )}
          </div>
      
      {/* Apply Modal */}
      <ApplyModal
        isOpen={isApplicationOpen}
        onClose={closeApplicationModal}
        job={selectedJob}
        onApply={handleApply}
        requirementsMet={requirementsMet}
        setRequirementsMet={setRequirementsMet}
      />
    </div>
  </div>
  )
};



export default JobsPage;
