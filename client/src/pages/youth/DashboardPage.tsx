
import { useState, useEffect } from 'react';
import { FiUser, FiBriefcase, FiBook, FiCheckCircle, FiClock, FiBell, FiActivity } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { profileAPI } from '@/lib/profileApi';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { UserActivity } from '@/lib/activitiesApi';
import { formatActivitiesForDisplay } from '@/lib/activityUtils';
import type { FormattedActivity } from '@/lib/activityUtils';
import ActivityFeed from '@/components/ActivityFeed';
import { API_BASE_URL } from '../../lib/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [profileInsights, setProfileInsights] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<FormattedActivity[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';
  
  // Helper function to create absolute URLs for uploaded files
  const uploadsBase = API_BASE_URL.replace(/\/api\/?$/, '');
  const toAbsolute = (p: string | null): string | null => {
    if (!p) return null;
    return p.startsWith('/uploads/') ? `${uploadsBase}${p}` : p;
  };
  
  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Load all dashboard data concurrently
        const [profileResponse, insightsData, applicationsData, interviewsData, activitiesData] = await Promise.allSettled([
          profileAPI.getMyProfile(),
          profileAPI.getProfileInsights(),
          profileAPI.getMyApplications(),
          profileAPI.getMyInterviews(),
          profileAPI.getRecentActivities({ limit: 8 }) // Fetch last 8 activities
        ]);
        
        // Handle profile data
        if (profileResponse.status === 'fulfilled' && profileResponse.value) {
          const me = profileResponse.value;
          const processedProfile = {
            firstName: me.firstName || user?.firstName || '',
            lastName: me.lastName || user?.lastName || '',
            phoneNumber: me.phoneNumber || user?.phone || '',
            profilePicture: toAbsolute(me.profilePicture || null),
            profileCompletion: me.profileCompletion || 0,
            bio: me.bio || '',
            address: me.address || '',
            city: me.city || '',
            district: me.district || '',
            country: me.country || '',
            postalCode: me.postalCode || '',
            jobStatus: me.jobStatus || 'unemployed',
            education: (me.education || []).map((ed: any) => ({
              id: ed._id,
              degree: ed.degree || '',
              institution: ed.institution || '',
              fieldOfStudy: ed.fieldOfStudy || '',
              startDate: ed.startDate ? new Date(ed.startDate).toISOString() : '',
              endDate: ed.endDate ? new Date(ed.endDate).toISOString() : '',
            })),
            experience: (me.experience || []).map((exp: any) => ({
              id: exp._id,
              company: exp.company || '',
              title: exp.title || '',
              startDate: exp.startDate ? new Date(exp.startDate).toISOString() : '',
              endDate: exp.endDate ? new Date(exp.endDate).toISOString() : '',
              isCurrent: exp.isCurrent || false,
              description: exp.description || '',
            })),
            updatedAt: me.updatedAt
          };
          setProfileData(processedProfile);
        } else {
          console.warn('Failed to load profile data:', profileResponse.status === 'rejected' ? profileResponse.reason : 'No data');
          // Set fallback profile data
          setProfileData({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            phoneNumber: user?.phone || '',
            profilePicture: null,
            profileCompletion: 0,
            bio: '',
            address: '',
            city: '',
            district: '',
            country: '',
            postalCode: '',
            jobStatus: 'unemployed',
            education: [],
            experience: [],
            updatedAt: null
          });
        }
        
        // Handle insights data
        if (insightsData.status === 'fulfilled') {
          setProfileInsights(insightsData.value);
        } else {
          console.warn('Failed to load profile insights:', insightsData.reason);
        }
        
        // Handle applications data
        if (applicationsData.status === 'fulfilled') {
          setApplications(applicationsData.value || []);
        } else {
          console.warn('Failed to load applications:', applicationsData.reason);
          setApplications([]);
        }
        
        // Handle interviews data
        if (interviewsData.status === 'fulfilled') {
          setInterviews(interviewsData.value || []);
        } else {
          console.warn('Failed to load interviews:', interviewsData.reason);
          setInterviews([]);
        }
        
        // Handle activities data
        if (activitiesData.status === 'fulfilled') {
          const activities = activitiesData.value || [];
          const formattedActivities = formatActivitiesForDisplay(activities);
          setRecentActivities(formattedActivities);
        } else {
          console.warn('Failed to load activities:', activitiesData.reason);
          // Fallback to default activities when endpoint is not available
          setRecentActivities([
            { 
              id: '1', 
              text: `Welcome to DYPSE, ${user?.firstName || 'User'}!`, 
              time: 'recently', 
              icon: <FiActivity className="text-green-500" />,
              activityType: 'account_created'
            },
            { 
              id: '2', 
              text: 'Complete your profile to start tracking activities', 
              time: '1 minute ago', 
              icon: <FiUser className="text-blue-500" />,
              activityType: 'profile_update'
            },
            { 
              id: '3', 
              text: 'Browse available jobs and opportunities', 
              time: 'Just now', 
              icon: <FiBriefcase className="text-purple-500" />,
              activityType: 'other'
            },
          ]);
        }
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load dashboard data. Please refresh the page.');
        
        // Set fallback data
        setApplications([]);
        setInterviews([]);
        const fallbackUpdateTime = user?.profile?.updatedAt || Date.now();
        setRecentActivities([
          { 
            id: '1', 
            text: 'Profile completion updated', 
            time: formatDistanceToNow(new Date(fallbackUpdateTime), { addSuffix: true }), 
            icon: <FiUser className="text-blue-500" />,
            activityType: 'profile_update'
          },
          { 
            id: '2', 
            text: 'Welcome to DYPSE platform', 
            time: 'recently', 
            icon: <FiActivity className="text-green-500" />,
            activityType: 'account_created'
          },
        ]);
        // Set fallback profile data
        setProfileData({
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          phoneNumber: user?.phone || '',
          profilePicture: null,
          profileCompletion: 0,
          bio: '',
          address: '',
          city: '',
          district: '',
          country: '',
          postalCode: '',
          jobStatus: 'unemployed',
          education: [],
          experience: [],
          updatedAt: null
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, [user]);
  
  // Get latest education info from profile data
  const latestEducation = profileData?.education?.length > 0
    ? [...(profileData.education || [])].sort((a: { startDate: string | Date }, b: { startDate: string | Date }) => 
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      )[0]
    : null;
    
  // Use profile completion from insights or profile data
  const profileCompletion = profileInsights?.profileCompletion ?? profileData?.profileCompletion ?? 0;
  const jobReadiness = profileInsights?.employabilityScore ?? Math.min(profileCompletion + 20, 100);
  
  // Format location string
  const getLocation = () => {
    if (!profileData) return 'Location not set';
    const { district, city, country } = profileData;
    return [district, city, country].filter(Boolean).join(', ') || 'Location not set';
  };
  
  const applicationsCount = applications?.length || 0;
  const interviewsCount = interviews?.length || 0;
  
  // Show loading state
  if (loading && !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" className="text-indigo-600" />
          <span className="ml-3 text-lg text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

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
          <p className="text-gray-600">You have no new notifications</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mr-4 overflow-hidden">
              {profileData?.profilePicture ? (
                <img 
                  src={profileData.profilePicture} 
                  alt={`${profileData?.firstName || user?.firstName || ''} ${profileData?.lastName || user?.lastName || ''}`.trim() || 'Profile'} 
                  className="w-full h-full object-cover rounded-full" 
                  onError={(e) => {
                    // Fallback to user initials if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.querySelector('.profile-initials-fallback');
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`profile-initials-fallback ${profileData?.profilePicture ? 'hidden' : ''} w-full h-full flex items-center justify-center text-white font-bold text-2xl rounded-full`}>
                {((profileData?.firstName || user?.firstName || '') + ' ' + (profileData?.lastName || user?.lastName || '')).split(' ').map(name => name[0]).join('').toUpperCase() || 'U'}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">
                {profileData?.firstName || user?.firstName || ''} {profileData?.lastName || user?.lastName || ''}
              </h2>
              <p className="text-gray-500 text-xs font-medium mb-1">
                {profileData?.jobStatus === 'employed' ? 'Employed' : 
                 profileData?.jobStatus === 'self_employed' ? 'Freelancer' : 'Job Seeker'}
              </p>
              <p className="text-gray-600">
                {latestEducation ? `${latestEducation.degree} in ${latestEducation.fieldOfStudy}` : 'No education added'}
              </p>
              <p className="text-gray-500 text-sm">
                {getLocation()}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-500">
              <FiClock className="mr-1" />
              <span>
                Updated {profileData?.updatedAt ? 
                  formatDistanceToNow(new Date(profileData.updatedAt), { addSuffix: true }) : 
                  'recently'}
              </span>
            </div>
            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
              Seeking for opportunities
            </span>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Profile Completion</span>
              <span>{profileCompletion}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  profileCompletion < 30 ? 'bg-red-500' : 
                  profileCompletion < 70 ? 'bg-yellow-500' : 'bg-green-500'
                }`} 
                style={{ width: `${profileCompletion}%` }}
                role="progressbar"
                aria-valuenow={profileCompletion}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
            {profileCompletion < 100 && (
              <p className="text-xs text-gray-500 mt-1">
                Complete your profile to increase your job readiness
              </p>
            )}
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
      <ActivityFeed 
        activities={recentActivities}
        title="Recent Activities"
        emptyMessage="Start by completing your profile or applying for jobs to see your activities here."
        maxItems={6}
      />
    </div>
  );
};

export default DashboardPage;