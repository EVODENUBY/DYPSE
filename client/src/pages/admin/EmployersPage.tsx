import React, { useState } from 'react';
import { FiSearch, FiTrash2, FiMail, FiEye, FiCheckCircle, FiXCircle, FiExternalLink, FiX } from 'react-icons/fi';
import EmployerProfileModal from '../../components/modals/EmployerProfileModal';

// Types
export interface Employer {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  industry: string;
  isVerified: boolean;
  activeJobs: number;
  logo: string;
}

// Mock data
const mockEmployers: Employer[] = [
  {
    id: '1',
    companyName: 'Tech Solutions Inc.',
    contactName: 'John Doe',
    email: 'john@techsolutions.com',
    phone: '+250 788 123 456',
    address: 'Kigali, Rwanda',
    website: 'techsolutions.rw',
    industry: 'Information Technology',
    isVerified: true,
    activeJobs: 5,
    logo: 'https://via.placeholder.com/40'
  },
  {
    id: '2',
    companyName: 'HealthCare Plus',
    contactName: 'Jane Smith',
    email: 'jane@healthcare.rw',
    phone: '+250 789 456 789',
    address: 'Kigali, Rwanda',
    website: 'healthcare.rw',
    industry: 'Healthcare',
    isVerified: false,
    activeJobs: 3,
    logo: 'https://via.placeholder.com/40'
  },
];

const industries = ['Information Technology', 'Healthcare', 'Finance', 'Education', 'Other'];

const EmployersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);
  const [employers, setEmployers] = useState<Employer[]>(mockEmployers);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this employer?')) {
      setEmployers(employers.filter(employer => employer.id !== id));
    }
  };

  const filteredEmployers = employers.filter(employer => {
    const matchesSearch = employer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employer.contactName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !selectedIndustry || employer.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedIndustry('');
  };

  const toggleVerification = (employerId: string) => {
    // In a real app, this would update the employer's verification status via API
    mockEmployers.forEach(employer => {
      if (employer.id === employerId) {
        employer.isVerified = !employer.isVerified;
      }
    });
    
    // Update the selected employer in the modal if it's the one being toggled
    if (selectedEmployer?.id === employerId) {
      setSelectedEmployer(prev => prev ? { ...prev, isVerified: !prev.isVerified } : null);
    }
    
    console.log(`Toggled verification for employer ${employerId}`);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Registered Employers</h1>
        <p className="text-gray-600">Manage employer profiles and job opportunities</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              placeholder="Search employer name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
          >
            <option value="">All Industries</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>

          <button
            onClick={clearFilters}
            className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            <FiX className="mr-2" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Employers Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Industry
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jobs
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployers.map((employer) => (
                <tr key={employer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={employer.logo} alt={employer.companyName} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employer.companyName}</div>
                        <a 
                          href={`https://${employer.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center"
                        >
                          {employer.website} <FiExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{employer.contactName}</div>
                    <div className="text-sm text-gray-500">{employer.email}</div>
                    <div className="text-sm text-gray-500">{employer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employer.industry}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${
                      employer.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {employer.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full bg-blue-100 text-blue-800">
                      {employer.activeJobs} Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-1">
                      <a
                        href={`mailto:${employer.email}`}
                        className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-full"
                        title="Send email"
                      >
                        <FiMail className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => setSelectedEmployer(employer)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
                        title="View details"
                      >
                        <FiEye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleVerification(employer.id)}
                        className={`p-1.5 rounded-full ${
                          employer.isVerified 
                            ? 'text-green-600 hover:bg-green-50' 
                            : 'text-yellow-600 hover:bg-yellow-50'
                        }`}
                        title={employer.isVerified ? 'Mark as unverified' : 'Mark as verified'}
                      >
                        {employer.isVerified ? (
                          <FiCheckCircle className="h-4 w-4" />
                        ) : (
                          <FiXCircle className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(employer.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
                        title="Delete employer"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employer Profile Modal */}
      <EmployerProfileModal
        employer={selectedEmployer}
        onClose={() => setSelectedEmployer(null)}
        onToggleVerification={toggleVerification}
      />
    </div>
  );
};

export default EmployersPage;
