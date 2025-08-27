import React, { useState, useEffect } from 'react';
import type { JobPosting } from '../../../types/job.types';
import { 
  ClockIcon, 
  CurrencyDollarIcon, 
  MapPinIcon, 
  BriefcaseIcon, 
  CalendarIcon,
  EyeIcon,
  UserGroupIcon 
} from '@heroicons/react/24/outline';

interface JobCardProps {
  job: JobPosting;
  onApply: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update current time every minute for the countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSalary = () => {
    const { min, currency, period } = job.salary;
    return `${currency}${min.toLocaleString()} - ${currency}${job.salary.max.toLocaleString()} / ${period}`;
  };

  const getDaysRemaining = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const diffInMs = deadlineDate.getTime() - currentTime.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 3600 * 24));
    
    if (diffInMs < 0) return { text: 'Expired', className: 'bg-red-100 text-red-800' };
    if (diffInDays === 0) return { text: 'Ends today', className: 'bg-yellow-100 text-yellow-800' };
    if (diffInDays === 1) return { text: '1 day left', className: 'bg-yellow-100 text-yellow-800' };
    if (diffInDays <= 3) return { text: `${diffInDays} days left`, className: 'bg-yellow-100 text-yellow-800' };
    return { text: `${diffInDays} days left`, className: 'bg-green-100 text-green-800' };
  };

  const deadlineInfo = getDaysRemaining(job.deadline);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 m-2">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                <p className="text-md font-medium text-gray-700">at {job.company}</p>
                <div className="flex items-center mt-1 text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span>{job.location} {job.isRemote && '(Remote)'}</span>
                </div>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${deadlineInfo.className}`}>
                <ClockIcon className="h-3 w-3 mr-1" />
                {deadlineInfo.text}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 mb-4 flex flex-wrap gap-2 items-center text-sm">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1 text-blue-500" />
            <span className="text-blue-600 font-medium">Posted: {formatDate(job.postedDate)}</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-blue-600 font-medium">Deadline: {formatDate(job.deadline)}</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span>{formatSalary()}</span>
          </div>
          <div className="flex items-center">
            <BriefcaseIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span>{job.category}</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-between items-center pt-3 px-2 pb-2 border-t border-gray-100">
        <div className="flex space-x-3 text-sm text-gray-500">
          <span className="flex items-center">
            <EyeIcon className="h-4 w-4 mr-1" />
            {job.views} views
          </span>
          <span className="text-gray-300">•</span>
          <span className="flex items-center">
            <UserGroupIcon className="h-4 w-4 mr-1" />
            {job.applicationCount} {job.applicationCount === 1 ? 'application' : 'applications'}
          </span>
        </div>
        <button 
          onClick={() => onApply(job.id)}
          disabled={deadlineInfo.text === 'Expired'}
          className={`inline-flex items-center px-5 py-2.5 rounded-md text-sm font-semibold shadow-sm transition-colors duration-200 mb-1 mr-1 ${
            deadlineInfo.text === 'Expired' 
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          {deadlineInfo.text === 'Expired' ? 'Application Closed' : 'Apply Now'}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
