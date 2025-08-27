
import { FiBell, FiUser, FiBriefcase, FiBook, FiCheckCircle, FiClock } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : 'Good afternoon';
  const profileCompletion = 33; 
  const jobReadiness = 30;
  const applicationsCount = 5;
  const interviewsCount = 2;

  const recentActivities = [
    { id: 1, text: 'Updated your profile information', time: '2 hours ago', icon: <FiUser className="text-blue-500" /> },
    { id: 2, text: 'Applied for Software Developer at Tech Corp', time: '1 day ago', icon: <FiBriefcase className="text-green-500" /> },
    { id: 3, text: 'Completed Web Development course', time: '3 days ago', icon: <FiCheckCircle className="text-purple-500" /> },
    { id: 4, text: 'Profile viewed by 5 employers', time: '1 week ago', icon: <FiUser className="text-yellow-500" /> },
  ];

  const dashboardCards = [
    { 
      title: 'Find Jobs', 
      description: 'Browse and apply for jobs', 
      icon: <FiBriefcase className="w-8 h-8 text-blue-600" />,
      link: '/youth/jobs'
    },
    { 
      title: 'Update Profile', 
      description: 'Keep your profile up to date', 
      icon: <FiUser className="w-8 h-8 text-green-600" />,
      link: '/youth/profile'
    },
    { 
      title: 'Training', 
      description: 'Enhance your skills', 
      icon: <FiBook className="w-8 h-8 text-purple-600" />,
      link: '/youth/trainings'
    },
    { 
      title: 'Job Matches', 
      description: 'Jobs matching your profile', 
      icon: <FiCheckCircle className="w-8 h-8 text-yellow-600" />,
      link: '/youth/jobs?matches=true'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Greeting Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {greeting}, {user?.firstName} {user?.lastName}
        </h1>
      </div>

      {/* First Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Notifications Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-full mr-3">
              <FiBell className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>
          <p className="text-gray-600">Find your notifications here</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4 overflow-hidden">
              {user?.profile?.profilePicture ? (
                <img src={user.profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />              ) : (
                <FiUser className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
              <p className="text-gray-600">Computer Science</p>
              <p className="text-gray-500 text-sm">Kigali, Rwanda</p>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">Last updated: 2 days ago</p>
            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
              Seeking for opportunities
            </span>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
          
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Profile Completion</span>
              <span className="text-sm font-medium text-gray-700">{profileCompletion}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Job Readiness</span>
              <span className="text-sm font-medium text-gray-700">{jobReadiness}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{ width: `${jobReadiness}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-700">{applicationsCount}</p>
              <p className="text-sm text-gray-600">Applications</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-700">{interviewsCount}</p>
              <p className="text-sm text-gray-600">Interviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row - Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardCards.map((card, index) => (
          <a 
            key={index} 
            href={card.link}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center"
          >
            <div className="p-3 bg-blue-50 rounded-full mb-4">
              {card.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
            <p className="text-gray-600 text-sm">{card.description}</p>
          </a>
        ))}
      </div>

      {/* Third Row - Recent Activities */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Recent Activities</h2>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="p-2 bg-gray-100 rounded-full mr-4">
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="text-gray-800">{activity.text}</p>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <FiClock className="w-3.5 h-3.5 mr-1" />
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;