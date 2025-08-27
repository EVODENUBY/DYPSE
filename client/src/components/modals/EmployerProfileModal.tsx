import React from 'react';
import { FiX, FiMail, FiPhone, FiGlobe, FiBriefcase, FiMapPin, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import type { Employer } from '../../pages/admin/EmployersPage';

interface EmployerProfileModalProps {
  employer: Employer | null;
  onClose: () => void;
  onToggleVerification: (employerId: string) => void;
}

const EmployerProfileModal: React.FC<EmployerProfileModalProps> = ({
  employer,
  onClose,
  onToggleVerification,
}) => {
  if (!employer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                className="h-16 w-16 rounded-full object-cover"
                src={employer.logo}
                alt={employer.companyName}
              />
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">{employer.companyName}</h2>
                <div className="flex items-center mt-1">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    employer.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {employer.isVerified ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Company Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <FiBriefcase className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Industry</p>
                    <p className="text-sm text-gray-900">{employer.industry}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiMapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-sm text-gray-900">{employer.address}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiGlobe className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Website</p>
                    <a
                      href={`https://${employer.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {employer.website}
                    </a>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FiMail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <a
                      href={`mailto:${employer.email}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {employer.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiPhone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">{employer.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Active Jobs</h3>
                <div className="bg-white p-4 rounded-md shadow">
                  <div className="text-3xl font-bold text-blue-600">{employer.activeJobs}</div>
                  <p className="text-sm text-gray-500 mt-1">Currently active job postings</p>
                  <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View all jobs →
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => onToggleVerification(employer.id)}
                    className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${
                      employer.isVerified
                        ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                        : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                    }`}
                  >
                    {employer.isVerified ? (
                      <>
                        <FiXCircle className="mr-2 h-4 w-4" />
                        Revoke Verification
                      </>
                    ) : (
                      <>
                        <FiCheckCircle className="mr-2 h-4 w-4" />
                        Verify Employer
                      </>
                    )}
                  </button>

                  <a
                    href={`mailto:${employer.email}`}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <FiMail className="mr-2 h-4 w-4" />
                    Send Email
                  </a>

                  <a
                    href={`tel:${employer.phone}`}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <FiPhone className="mr-2 h-4 w-4" />
                    Call Employer
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfileModal;
