import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiMapPin, 
  FiBriefcase, 
  FiClock, 
  FiDollarSign, 
  FiUsers, 
  FiBookOpen,
  FiCalendar,
  FiX,
  FiMail,
  FiPhone,
  FiLinkedin,
  FiGithub
} from 'react-icons/fi';
import { FiChevronDown } from 'react-icons/fi';

// Modal component for candidate details
const CandidateModal: React.FC<{
  candidate: Candidate | null;
  onClose: () => void;
}> = ({ candidate, onClose }) => {
  if (!candidate) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{candidate.name}</h2>
              <p className="text-lg text-gray-600">{candidate.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                {candidate.email && (
                  <div className="flex items-center">
                    <FiMail className="text-gray-400 mr-3 flex-shrink-0" />
                    <a href={`mailto:${candidate.email}`} className="text-blue-600 hover:underline">
                      {candidate.email}
                    </a>
                  </div>
                )}
                {candidate.phone && (
                  <div className="flex items-center">
                    <FiPhone className="text-gray-400 mr-3 flex-shrink-0" />
                    <a href={`tel:${candidate.phone}`} className="text-gray-700">
                      {candidate.phone}
                    </a>
                  </div>
                )}
                {candidate.linkedin && (
                  <div className="flex items-center">
                    <FiLinkedin className="text-gray-400 mr-3 flex-shrink-0" />
                    <a 
                      href={`https://${candidate.linkedin}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {candidate.linkedin}
                    </a>
                  </div>
                )}
                {candidate.github && (
                  <div className="flex items-center">
                    <FiGithub className="text-gray-400 mr-3 flex-shrink-0" />
                    <a 
                      href={`https://${candidate.github}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:underline"
                    >
                      {candidate.github}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience:</span>
                  <span className="font-medium">{candidate.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{candidate.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Availability:</span>
                  <span className="font-medium">{candidate.availability}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Active:</span>
                  <span className="font-medium">{candidate.lastActive}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill, index) => (
                <div 
                  key={index} 
                  className="inline-flex flex-col items-center px-3 py-1.5 bg-blue-50 rounded-full"
                >
                  <span className="text-sm font-medium text-blue-800">{skill.name}</span>
                  <span className="text-xs text-blue-600">{skill.level}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <a
              href={`mailto:${candidate.email}`}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Contact {candidate.name.split(' ')[0]}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Types
interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface Candidate {
  id: number;
  name: string;
  title: string;
  experience: string;
  location: string;
  availability: 'Immediate' | '1-2 weeks' | '1 month+';
  skills: Skill[];
  matchPercentage: number;
  lastActive: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
}

// Sample data for job opportunities
const jobOpportunities = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'Tech Solutions Inc.',
    location: 'Kigali, Rwanda',
    type: 'Full-time',
    salary: 'RWF 1,500,000 - 2,000,000',
    posted: '2 days ago',
    description: 'We are looking for an experienced Frontend Developer with React experience...',
    skills: ['React', 'TypeScript', 'CSS', 'Redux']
  },
  {
    id: 2,
    title: 'UX/UI Designer',
    company: 'Design Hub Africa',
    location: 'Remote',
    type: 'Contract',
    salary: 'Negotiable',
    posted: '1 week ago',
    description: 'Looking for a creative UX/UI Designer to join our remote team...',
    skills: ['Figma', 'UI/UX', 'Prototyping', 'User Research']
  },
  {
    id: 3,
    title: 'Backend Engineer',
    company: 'Data Systems Ltd',
    location: 'Kigali, Rwanda',
    type: 'Full-time',
    salary: 'RWF 2,000,000 - 2,500,000',
    posted: '3 days ago',
    description: 'Join our engineering team to build scalable backend services...',
    skills: ['Node.js', 'Python', 'PostgreSQL', 'Docker']
  }
];

// Sample data for candidates
const candidates: Candidate[] = [
  {
    id: 1,
    name: 'Alice Murekatete',
    title: 'Senior Frontend Developer',
    experience: '5+ years',
    location: 'Kigali, Rwanda',
    availability: 'Immediate',
    matchPercentage: 95,
    lastActive: '2 hours ago',
    email: 'alice.m@example.com',
    phone: '+250 78 123 4567',
    linkedin: 'linkedin.com/in/alice-m',
    github: 'github.com/alicem',
    skills: [
      { name: 'React', level: 'Expert' },
      { name: 'TypeScript', level: 'Expert' },
      { name: 'Redux', level: 'Advanced' },
      { name: 'Node.js', level: 'Intermediate' },
      { name: 'GraphQL', level: 'Intermediate' }
    ]
  },
  {
    id: 2,
    name: 'Jean de Dieu Niyonsaba',
    title: 'Full Stack Developer',
    experience: '3+ years',
    location: 'Kigali, Rwanda',
    availability: '1-2 weeks',
    matchPercentage: 88,
    lastActive: '1 day ago',
    email: 'jean.nd@example.com',
    phone: '+250 78 234 5678',
    linkedin: 'linkedin.com/in/jean-nd',
    github: 'github.com/jeandieu',
    skills: [
      { name: 'React', level: 'Advanced' },
      { name: 'Node.js', level: 'Advanced' },
      { name: 'MongoDB', level: 'Intermediate' },
      { name: 'AWS', level: 'Intermediate' },
      { name: 'Docker', level: 'Beginner' }
    ]
  },
  {
    id: 3,
    name: 'Marie Claire Uwamahoro',
    title: 'UI/UX Designer',
    experience: '4+ years',
    location: 'Remote',
    availability: 'Immediate',
    matchPercentage: 92,
    lastActive: '5 hours ago',
    email: 'marie.uw@example.com',
    phone: '+250 78 345 6789',
    linkedin: 'linkedin.com/in/marie-uw',
    skills: [
      { name: 'Figma', level: 'Expert' },
      { name: 'UI/UX', level: 'Expert' },
      { name: 'Prototyping', level: 'Advanced' },
      { name: 'User Research', level: 'Advanced' },
      { name: 'Design Systems', level: 'Intermediate' }
    ]
  }
];

const SearchAndMatchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Filter job opportunities based on search and filters
  const filteredJobs = jobOpportunities.filter(job => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchLower) ||
      job.company.toLowerCase().includes(searchLower) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchLower));
      
    const matchesStatus = statusFilter === 'All Status' || job.type === statusFilter;
    const matchesLocation = locationFilter === 'All Locations' || 
      job.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesLocation;
  });

  // Filter and sort candidates
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [sortBy, setSortBy] = useState<'match' | 'availability' | 'experience'>('match');
  
  useEffect(() => {
    let result = [...candidates];
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(candidate => 
        candidate.name.toLowerCase().includes(searchLower) ||
        candidate.title.toLowerCase().includes(searchLower) ||
        candidate.skills.some(skill => skill.name.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'match') {
        return b.matchPercentage - a.matchPercentage;
      } else if (sortBy === 'availability') {
        const availabilityOrder = { 'Immediate': 0, '1-2 weeks': 1, '1 month+': 2 };
        return availabilityOrder[a.availability] - availabilityOrder[b.availability];
      } else { // experience
        return parseInt(b.experience) - parseInt(a.experience);
      }
    });
    
    setFilteredCandidates(result);
  }, [searchTerm, sortBy]);

  // Show empty state if no filters are active and no jobs match
  const showEmptyState = filteredJobs.length === 0 && 
    (searchTerm !== '' || statusFilter !== 'All Status' || locationFilter !== 'All Locations');
    
  // Handle contact candidate
  const handleContact = (candidate: Candidate) => {
    // In a real app, this would open a contact form or email client
    const emailSubject = encodeURIComponent(`Regarding your profile - ${candidate.title} position`);
    const emailBody = encodeURIComponent(`Hello ${candidate.name},\n\nI came across your profile and would like to discuss potential opportunities.`);
    window.open(`mailto:${candidate.email}?subject=${emailSubject}&body=${emailBody}`);
  };
  
  // Handle view details
  const handleViewDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  // Close modal
  const closeModal = () => {
    setSelectedCandidate(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Search and Match</h1>
      </div>

      {/* Tabs */}
      <div className="bg-[#D9D9D9] rounded-t-lg flex mb-6">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-6 py-3 font-medium text-sm ${activeTab === 'jobs' ? 'bg-white text-blue-600' : 'text-gray-600'}`}
        >
          Job Opportunities
        </button>
        <button
          onClick={() => setActiveTab('candidates')}
          className={`px-6 py-3 font-medium text-sm ${activeTab === 'candidates' ? 'bg-white text-blue-600' : 'text-gray-600'}`}
        >
          Candidate Matching
        </button>
        <button
          onClick={() => setActiveTab('training')}
          className={`px-6 py-3 font-medium text-sm ${activeTab === 'training' ? 'bg-white text-blue-600' : 'text-gray-600'}`}
        >
          Training Programs
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search by Name/Skill */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by name or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              type="button"
              className="w-full bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm flex justify-between items-center"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              <span>{statusFilter}</span>
              <FiChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {showStatusDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {['All Status', 'Full-time', 'Part-time', 'Contract', 'Internship'].map((status) => (
                  <button
                    key={status}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setStatusFilter(status);
                      setShowStatusDropdown(false);
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Location Filter */}
          <div className="relative">
            <button
              type="button"
              className="w-full bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm flex justify-between items-center"
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            >
              <span>{locationFilter}</span>
              <FiChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {showLocationDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm max-h-60 overflow-auto">
                {['All Locations', 'Kigali', 'Remote', 'Huye', 'Musanze', 'Rubavu'].map((location) => (
                  <button
                    key={location}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setLocationFilter(location);
                      setShowLocationDropdown(false);
                    }}
                  >
                    {location}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {/* Tab Content */}
      {activeTab === 'jobs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-gray-600">{job.company}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {job.type}
                    </span>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiMapPin className="mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiDollarSign className="mr-2" />
                      {job.salary}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiClock className="mr-2" />
                      {job.posted}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Required Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <p className="mt-4 text-sm text-gray-600 line-clamp-2">
                    {job.description}
                  </p>
                </div>
                
                <div className="bg-gray-50 px-5 py-3 flex justify-between items-center border-t border-gray-200">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                    View Details
                  </button>
                  <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                    Find Matches
                  </button>
                </div>
              </div>
            ))
          ) : showEmptyState ? (
            <div className="col-span-3 py-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <FiSearch className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No matching jobs found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('All Status');
                  setLocationFilter('All Locations');
                }}
                className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="col-span-3 py-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <FiBriefcase className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No job opportunities available</h3>
              <p className="mt-1 text-sm text-gray-500">Check back later for new opportunities</p>
            </div>
          )}
        </div>
      )}

      {/* Candidate Matching Tab Content */}
      {activeTab === 'candidates' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-medium text-gray-900">Matching Candidates</h2>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">Sort by:</span>
              <select 
                className="border-0 bg-transparent text-blue-600 font-medium focus:ring-0 focus:outline-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'match' | 'availability' | 'experience')}
              >
                <option value="match">Best Match</option>
                <option value="availability">Availability</option>
                <option value="experience">Experience</option>
              </select>
            </div>
          </div>

          {filteredCandidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCandidates.map((candidate) => (
                <div key={candidate.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl mr-3">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{candidate.name}</h3>
                          <p className="text-sm text-gray-500">{candidate.title}</p>
                        </div>
                      </div>
                      <div className={`flex items-center ${candidate.matchPercentage > 90 ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                        <div className={`w-2 h-2 rounded-full ${candidate.matchPercentage > 90 ? 'bg-green-500' : 'bg-blue-500'} mr-1.5`}></div>
                        {candidate.matchPercentage}% Match
                      </div>
                    </div>

                    <div className="space-y-3 mt-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <FiBriefcase className="mr-2 text-gray-400 flex-shrink-0" />
                        <span>{candidate.experience} experience</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FiMapPin className="mr-2 text-gray-400 flex-shrink-0" />
                        <span>{candidate.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FiCalendar className="mr-2 text-gray-400 flex-shrink-0" />
                        <span>Available: {candidate.availability}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FiClock className="mr-2 text-gray-400 flex-shrink-0" />
                        <span>Active {candidate.lastActive}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Top Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.slice(0, 3).map((skill, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {skill.name}
                          </span>
                        ))}
                        {candidate.skills.length > 3 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{candidate.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 px-5 py-3 flex justify-between items-center border-t border-gray-200">
                    <button 
                      onClick={() => handleViewDetails(candidate)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleContact(candidate)}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Contact
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <FiUsers className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No matching candidates found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria</p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Training Programs Tab Content */}
      {activeTab === 'training' && (
        <div className="py-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <FiBookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Training Programs Coming Soon</h3>
          <p className="mt-1 text-sm text-gray-500">Check back later for available training programs</p>
        </div>
      )}

      {/* Candidate Details Modal */}
      <CandidateModal 
        candidate={selectedCandidate} 
        onClose={closeModal} 
      />
    </div>
  );
};

export default SearchAndMatchPage;
