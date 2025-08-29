import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { youthApi } from '../../lib/api';
import { 
  FiSearch,
  FiEye, 
  FiEdit, 
  FiTrash2, 
  FiPhone, 
  FiMail,
  FiCalendar,
  FiMapPin,
  FiBriefcase,
  FiAward,
  FiUserCheck,
  FiXCircle,
  FiChevronDown, 
  FiChevronLeft, 
  FiChevronRight,
  FiCheck,
  FiX
} from 'react-icons/fi';

// Interface for Youth Profile
export interface YouthProfile {
  _id: string;
  id?: string; // Alias for _id for compatibility
  profilePicture?: string;
  firstName: string;
  lastName: string;
  location: string;
  dob: string | Date | null;
  education?: string;
  skills: string[];
  jobStatus: 'Employed' | 'Unemployed' | 'Self-Employed' | 'unemployed' | 'employed' | 'self_employed';
  updatedAt: string | Date;
  phone: string;
  email?: string;
  isVerified: boolean;
  district?: string;
  city?: string;
  country?: string;
  bio?: string;
  resume?: string;
  cvUrl?: string;
  profileCompletion?: number;
  experience?: Array<{
    title: string;
    company: string;
    location: string;
    startDate: Date;
    endDate?: Date;
    isCurrent: boolean;
    description?: string;
  }>;
  educationHistory?: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: Date;
    endDate?: Date;
    isCurrent: boolean;
  }>;
}

const districtsOfRwanda = [
  'All Locations', 'Kigali City', 'Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana',
  'Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo', 'Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe',
  'Nyanza', 'Nyaruguru', 'Ruhango', 'Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rusizi', 'Rutsiro'
];

interface ViewYouthModalProps {
  youth: YouthProfile | null;
  onClose: () => void;
  onToggleVerification: (id: string) => Promise<void>;
  onEdit: (youth: YouthProfile) => void;
}

const formatDate = (dateInput: string | Date | null | undefined): string => {
  if (!dateInput) return 'N/A';
  try {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return isNaN(date.getTime()) 
      ? 'N/A' 
      : date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
};

const ViewYouthModal: React.FC<ViewYouthModalProps> = ({ 
  youth, 
  onClose, 
  onToggleVerification,
  onEdit 
}) => {
  if (!youth) return null;

  const handleToggleVerification = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await onToggleVerification(youth._id);
      toast.success(`User verification ${youth.isVerified ? 'removed' : 'added'} successfully`);
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Failed to update verification status');
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(youth);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {youth.firstName} {youth.lastName}'s Profile
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiXCircle className="h-6 w-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Profile Picture and Basic Info */}
            <div className="md:col-span-1">
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4">
                  {youth.profilePicture ? (
                    <img
                      className="h-full w-full object-cover"
                      src={youth.profilePicture}
                      alt={`${youth.firstName} ${youth.lastName}`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = 'h-full w-full flex items-center justify-center bg-gray-200 text-gray-500 text-2xl';
                          fallback.textContent = (youth.firstName?.[0] + (youth.lastName?.[0] || '')).toUpperCase() || '';
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500 text-2xl">
                      {(youth.firstName?.[0] + (youth.lastName?.[0] || '')).toUpperCase() || ''}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    youth.isVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {youth.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    youth.jobStatus === 'Employed' ? 'bg-green-100 text-green-800' :
                    youth.jobStatus === 'Unemployed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {youth.jobStatus}
                  </span>
                </div>
                <h4 className="text-lg font-semibold">{youth.firstName} {youth.lastName}</h4>
                <p className="text-gray-600">{youth.education}</p>
                
                <div className="mt-4 w-full space-y-3">
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="mr-2" />
                    <span>{youth.location}, Rwanda</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="mr-2" />
                    <span>DOB: {youth.dob ? formatDate(youth.dob) : 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiPhone className="mr-2" />
                    <a href={`tel:${youth.phone}`} className="hover:text-blue-600">
                      {youth.phone}
                    </a>
                  </div>
                  {youth.email && (
                    <div className="flex items-center text-gray-600">
                      <FiMail className="mr-2" />
                      <a href={`mailto:${youth.email}`} className="hover:text-blue-600">
                        {youth.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Column - Detailed Information */}
            <div className="md:col-span-2 space-y-6">
              {/* Skills Section */}
              <div>
                <h4 className="text-lg font-semibold mb-3 flex items-center">
                  <FiAward className="mr-2" />
                  Skills & Competencies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {youth.skills.map((skill: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Employment History */}
              <div>
                <h4 className="text-lg font-semibold mb-3 flex items-center">
                  <FiBriefcase className="mr-2" />
                  Employment Status
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Current Status</p>
                      <p className="font-medium">{youth.jobStatus}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="font-medium">{formatDate(youth.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Verification Status */}
              <div>
                <h4 className="text-lg font-semibold mb-3 flex items-center">
                  <FiUserCheck className="mr-2" />
                  Verification Status
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Account Status</p>
                      <p className={`font-medium ${youth.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                        {youth.isVerified ? 'Verified' : 'Not Verified'}
                      </p>
                    </div>
                    <button
                      onClick={handleToggleVerification}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        youth.isVerified 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {youth.isVerified ? 'Mark as Unverified' : 'Verify Profile'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={handleEditClick}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const YouthProfilesPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [verificationFilter, setVerificationFilter] = useState('All');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showVerificationDropdown, setShowVerificationDropdown] = useState(false);
  const [selectedYouth, setSelectedYouth] = useState<YouthProfile | null>(null);
  const [youths, setYouths] = useState<YouthProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const itemsPerPage = 8;
  
  // Fetch youth profiles from the API
  const fetchYouths = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await youthApi.getAllYouths();
      if (response.success) {
        // The backend now returns the data directly in response.data
        setYouths(response.data || []);
      } else {
        const errorMsg = response.message || 'Failed to load youth profiles';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Error fetching youth profiles:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchYouths();
  }, []);

  // Toggle verification status
  const toggleVerification = async (id: string) => {
    try {
      const youth = youths.find(y => y._id === id);
      if (!youth) {
        toast.error('Youth profile not found');
        return;
      }
      
      const response = await youthApi.updateVerification(id, !youth.isVerified);
      
      if (response.success && response.data?.user) {
        const updatedUser = response.data.user;
        
        // Update the specific youth's data including skills and verification status
        setYouths(prevYouths => 
          prevYouths.map(y => {
            if (y._id === id) {
              // Construct profile picture URL if needed
              const profilePicture = updatedUser.profilePicture 
                ? updatedUser.profilePicture.startsWith('http')
                  ? updatedUser.profilePicture
                  : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}${updatedUser.profilePicture.startsWith('/') ? '' : '/'}${updatedUser.profilePicture}`
                : y.profilePicture;
              
              return {
                ...y,
                isVerified: updatedUser.isVerified,
                skills: Array.isArray(updatedUser.skills) ? updatedUser.skills : (y.skills || []),
                profilePicture,
                // Update other fields if needed
                ...(updatedUser.firstName && { firstName: updatedUser.firstName }),
                ...(updatedUser.lastName && { lastName: updatedUser.lastName }),
                ...(updatedUser.education && { education: updatedUser.education }),
                ...(updatedUser.jobStatus && { jobStatus: updatedUser.jobStatus })
              };
            }
            return y;
          })
        );
        
        // Update selectedYouth if it's currently open
        if (selectedYouth && selectedYouth._id === id) {
          setSelectedYouth({
            ...selectedYouth,
            isVerified: updatedUser.isVerified,
            skills: Array.isArray(updatedUser.skills) ? updatedUser.skills : (selectedYouth.skills || []),
            ...(updatedUser.firstName && { firstName: updatedUser.firstName }),
            ...(updatedUser.lastName && { lastName: updatedUser.lastName }),
            ...(updatedUser.education && { education: updatedUser.education }),
            ...(updatedUser.jobStatus && { jobStatus: updatedUser.jobStatus as YouthProfile['jobStatus'] })
          });
        }
        
        toast.success(`Profile ${!youth.isVerified ? 'verified' : 'unverified'} successfully`);
        
        toast.success(`Verification ${!youth.isVerified ? 'added' : 'removed'} successfully`);
      } else {
        throw new Error('Failed to refresh youth profiles');
      }
    } catch (error) {
      console.error('Error toggling verification:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update verification status';
      toast.error(errorMessage);
      
      // Revert the UI state on error
      const updatedYouths = youths.map(y => 
        y._id === id ? { ...y, isVerified: !y.isVerified } : y
      );
      setYouths(updatedYouths);
    }
  };
  
  // Open view modal for a youth
  const handleViewYouth = (youth: any) => {
    setSelectedYouth(youth);
  };
  
  // Close view modal
  const handleCloseModal = () => {
    setSelectedYouth(null);
  };
  
  // Handle edit action
  const handleEditYouth = (youth: any) => {
    // In a real app, you would navigate to an edit page or open an edit form
    // For now, we'll just show an alert
    alert(`Edit youth profile: ${youth.firstName} ${youth.lastName}`);
    // Example of how you might implement navigation:
    // navigate(`/admin/youth-profiles/edit/${youth.id}`);
  };

  // Handle delete action
  const handleDeleteYouth = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this youth profile? This action cannot be undone.')) {
      try {
        await youthApi.deleteYouth(id);
        
        // Update local state
        const updatedYouths = youths.filter(youth => youth._id !== id);
        setYouths(updatedYouths);
        
        // Close modal if the deleted youth is currently being viewed
        if (selectedYouth && selectedYouth._id === id) {
          setSelectedYouth(null);
        }
        
        toast.success('Youth profile deleted successfully');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete profile';
        toast.error(errorMessage);
      }
    }
  };

  // Filter youths based on search and filters
  const filteredYouths = youths.filter(youth => {
    const matchesSearch = searchTerm === '' || 
      (youth.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      youth.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      youth.skills?.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase())));
      
    const matchesStatus = statusFilter === 'All Status' || youth.jobStatus === statusFilter;
    const matchesLocation = locationFilter === 'All Locations' || youth.location === locationFilter;
    const matchesVerification = 
      verificationFilter === 'All' || 
      (verificationFilter === 'Verified' && youth.isVerified) ||
      (verificationFilter === 'Unverified' && !youth.isVerified);
    
    return matchesSearch && matchesStatus && matchesLocation && matchesVerification;
  });
  
  // Get current youths for pagination
  const indexOfLastYouth = currentPage * itemsPerPage;
  const indexOfFirstYouth = indexOfLastYouth - itemsPerPage;
  const currentYouths = filteredYouths.slice(indexOfFirstYouth, indexOfLastYouth);
  const totalPages = Math.ceil(filteredYouths.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading youth profiles...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchYouths}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show empty state
  if (youths.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Youth Profiles Found</h3>
          <p className="text-gray-600">There are currently no youth profiles in the system.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Youth Profiles Management System</h1>
        <p className="text-gray-600">Profile of all youths in the district</p>
      </div>
      
      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Search by name or skill */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search by name or skill"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Status Filter */}
        <div className="relative">
          <button
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          >
            <span>{statusFilter}</span>
            <FiChevronDown className="ml-2" />
          </button>
          {showStatusDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1">
              {['All Status', 'Employed', 'Unemployed', 'Self-Employed'].map((status) => (
                <div
                  key={status}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setStatusFilter(status);
                    setShowStatusDropdown(false);
                  }}
                >
                  {status}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Location Filter */}
        <div className="relative">
          <button
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
          >
            <span className="truncate">{locationFilter}</span>
            <FiChevronDown className="ml-2" />
          </button>
          {showLocationDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 max-h-60 overflow-y-auto">
              {districtsOfRwanda.map((district) => (
                <div
                  key={district}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setLocationFilter(district);
                    setShowLocationDropdown(false);
                  }}
                >
                  {district}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Verification Status Filter */}
        <div className="relative">
          <button
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onClick={() => setShowVerificationDropdown(!showVerificationDropdown)}
          >
            <span>Verification: {verificationFilter}</span>
            <FiChevronDown className="ml-2" />
          </button>
          {showVerificationDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1">
              {['All', 'Verified', 'Unverified'].map((status) => (
                <div
                  key={status}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setVerificationFilter(status);
                    setShowVerificationDropdown(false);
                  }}
                >
                  {status}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Table */}
      <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profile
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Education
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skills
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentYouths.length > 0 ? (
                currentYouths.map((youth) => (
                  <tr key={youth._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {youth.profilePicture ? (
                            <img 
                              className="h-full w-full object-cover"
                              src={youth.profilePicture.startsWith('http') 
                                ? youth.profilePicture 
                                : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}${youth.profilePicture.startsWith('/') ? '' : '/'}${youth.profilePicture}`
                              } 
                              alt={`${youth.firstName} ${youth.lastName}`}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  const fallback = document.createElement('div');
                                  fallback.className = 'h-full w-full flex items-center justify-center bg-gray-200 text-gray-500';
                                  fallback.textContent = youth.firstName?.[0]?.toUpperCase() || '';
                                  parent.appendChild(fallback);
                                }
                              }}
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500">
                              {youth.firstName?.[0]?.toUpperCase() || ''}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{youth.firstName} {youth.lastName}</div>
                          <div className="text-xs text-gray-500">{youth.dob ? formatDate(youth.dob) : 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {youth.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {youth.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {youth.education}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {youth.skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        youth.jobStatus === 'Employed' ? 'bg-green-100 text-green-800' :
                        youth.jobStatus === 'Unemployed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {youth.jobStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleVerification(youth._id)}
                        className={`px-2 py-1 text-xs rounded-full flex items-center ${
                          youth.isVerified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                        title={youth.isVerified ? 'Verified' : 'Not Verified'}
                      >
                        {youth.isVerified ? (
                          <>
                            <FiCheck className="mr-1" /> Verified
                          </>
                        ) : (
                          <>
                            <FiX className="mr-1" /> Unverified
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(youth.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          title="View"
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleViewYouth(youth)}
                        >
                          <FiEye className="h-5 w-5" />
                        </button>
                        <button
                          title="Edit"
                          className="text-yellow-600 hover:text-yellow-900"
                          onClick={() => handleEditYouth(youth)}
                        >
                          <FiEdit className="h-5 w-5" />
                        </button>
                        <button
                          title="Delete"
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteYouth(youth._id)}
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                        {youth.phone && (
                          <a
                            href={`tel:${youth.phone}`}
                            title={`Call ${youth.phone}`}
                            className="text-green-600 hover:text-green-900"
                          >
                            <FiPhone className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No youth profiles found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredYouths.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
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
                  Showing <span className="font-medium">{indexOfFirstYouth + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastYouth, filteredYouths.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredYouths.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <FiChevronLeft className="h-5 w-5" />
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
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <FiChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* View Youth Modal */}
      {selectedYouth && (
        <ViewYouthModal 
          youth={selectedYouth} 
          onClose={handleCloseModal}
          onToggleVerification={toggleVerification}
          onEdit={handleEditYouth}
        />
      )}
    </div>
  );
};

export default YouthProfilesPage;
