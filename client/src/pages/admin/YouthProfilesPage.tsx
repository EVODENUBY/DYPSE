import React, { useState } from 'react';
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

// Sample data - in a real app, this would come from an API
const sampleYouths = [
  {
    id: 1,
    profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
    firstName: 'Jean',
    lastName: 'Niyonshuti',
    location: 'Kigali',
    dob: '1995-05-15',
    education: 'Bachelor in Computer Science',
    skills: ['JavaScript', 'React', 'Node.js'],
    jobStatus: 'Employed',
    updatedAt: '2023-06-15',
    phone: '+250788123456',
    isVerified: true
  },
  ...Array(10).fill(0).map((_, i) => ({
    id: i + 2,
    profilePicture: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i + 10}.jpg`,
    firstName: ['Eric', 'Alice', 'David', 'Grace', 'Samuel', 'Olivia', 'James', 'Sophia', 'Daniel', 'Emma'][i % 10],
    lastName: ['Uwimana', 'Uwamahoro', 'Niyongabo', 'Mukamana', 'Hakizimana', 'Mukamurenzi', 'Niyonshuti', 'Uwineza', 'Ndahiro', 'Uwamahoro'][i % 10],
    location: ['Kigali', 'Musanze', 'Rubavu', 'Huye', 'Nyagatare', 'Rusizi', 'Karongi', 'Nyamagabe', 'Ngoma', 'Kayonza'][i % 10],
    dob: `199${i % 10}-${(i % 12) + 1 < 10 ? '0' + ((i % 12) + 1) : (i % 12) + 1}-${(i % 28) + 1 < 10 ? '0' + ((i % 28) + 1) : (i % 28) + 1}`,
    education: ['High School', 'Bachelor', 'Masters', 'Diploma', 'Certificate', 'PhD', 'High School', 'Bachelor', 'Masters', 'Diploma'][i % 10],
    skills: [['Carpentry'], ['Tailoring'], ['Masonry'], ['Plumbing'], ['Electrical'], ['Driving'], ['Cooking'], ['Hair Dressing'], ['ICT'], ['Farming']][i % 10],
    jobStatus: ['Employed', 'Unemployed', 'Self-Employed', 'Employed', 'Unemployed', 'Self-Employed', 'Employed', 'Unemployed', 'Self-Employed', 'Employed'][i % 10],
    updatedAt: `2023-${(i % 12) + 1 < 10 ? '0' + ((i % 12) + 1) : (i % 12) + 1}-${(i % 28) + 1 < 10 ? '0' + ((i % 28) + 1) : (i % 28) + 1}`,
    phone: `+25078${Math.floor(1000000 + Math.random() * 9000000)}`,
    isVerified: Math.random() > 0.5
  }))
];

const districtsOfRwanda = [
  'All Locations', 'Kigali City', 'Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana',
  'Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo', 'Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe',
  'Nyanza', 'Nyaruguru', 'Ruhango', 'Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rusizi', 'Rutsiro'
];

interface ViewYouthModalProps {
  youth: any;
  onClose: () => void;
  onToggleVerification: (id: number) => void;
  onEdit: (youth: any) => void;
}

const ViewYouthModal: React.FC<ViewYouthModalProps> = ({ 
  youth, 
  onClose, 
  onToggleVerification,
  onEdit 
}) => {
  if (!youth) return null;

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
                <img
                  className="h-40 w-40 rounded-full object-cover mb-4"
                  src={youth.profilePicture}
                  alt={`${youth.firstName} ${youth.lastName}`}
                />
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
                    <span>DOB: {new Date(youth.dob).toLocaleDateString()}</span>
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
                      <p className="font-medium">
                        {new Date(youth.updatedAt).toLocaleDateString()}
                      </p>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleVerification(youth.id);
                      }}
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
              onClick={(e) => {
                e.stopPropagation();
                onEdit(youth);
                onClose();
              }}
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
  const [selectedYouth, setSelectedYouth] = useState<any>(null);
  const [youths, setYouths] = useState([...sampleYouths]);
  
  const itemsPerPage = 8;
  
  // Toggle verification status
  const toggleVerification = (id: number) => {
    const updatedYouths = youths.map(youth => 
      youth.id === id ? { ...youth, isVerified: !youth.isVerified } : youth
    );
    setYouths(updatedYouths);
    
    // Update selectedYouth if it's the one being toggled
    if (selectedYouth && selectedYouth.id === id) {
      setSelectedYouth({
        ...selectedYouth,
        isVerified: !selectedYouth.isVerified
      });
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

  // Filter youths based on search and filters
  const filteredYouths = youths.filter(youth => {
    const matchesSearch = searchTerm === '' || 
      youth.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      youth.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      youth.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
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
                  <tr key={youth.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full" src={youth.profilePicture} alt={`${youth.firstName} ${youth.lastName}`} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{youth.firstName} {youth.lastName}</div>
                          <div className="text-xs text-gray-500">{youth.dob}</div>
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
                        onClick={() => toggleVerification(youth.id)}
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
                      {youth.updatedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
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
                        >
                          <FiEdit className="h-5 w-5" />
                        </button>
                        <button
                          title="Delete"
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                        <a
                          href={`tel:${youth.phone}`}
                          title="Call"
                          className="text-green-600 hover:text-green-900"
                        >
                          <FiPhone className="h-5 w-5" />
                        </a>
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
