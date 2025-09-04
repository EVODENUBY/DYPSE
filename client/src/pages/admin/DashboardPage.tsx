import { useEffect, useState } from 'react';
import { FiUsers, FiTrendingUp, FiRefreshCw, FiSearch, FiDownload, FiPlus, FiClock, FiArrowRight } from 'react-icons/fi';
import { dashboardApi } from '@/lib/dashboardApi';
import { toast } from 'react-hot-toast';
import type { FC, ReactNode } from 'react';



interface StatCard {
  title: string;
  value: string | number;
  change?: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  isLoading?: boolean;
}

interface Group {
  title: string;
  field: string;
  bio: string;
  lastActive: string;
}

interface QuickLink {
  icon: ReactNode;
  title: string;
  link: string;
}

interface AIPrediction {
  skill: string;
  percentage: number;
}

const AdminDashboardPage: FC = (): React.ReactElement => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<StatCard[]>([
    {
      title: 'Youth Registered',
      value: 'Loading...',
      change: 'Fetching data...',
      icon: <FiUsers size={20} />,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Unemployment Rate',
      value: 'Loading...',
      change: 'Fetching data...',
      icon: <FiTrendingUp size={20} />,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Employers',
      value: 'Loading...',
      change: 'Fetching data...',
      icon: <FiUsers size={20} />,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Groups',
      value: 'Loading...',
      change: 'Fetching data...',
      icon: <FiUsers size={20} />,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    }
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get groups from Storage
        const storedGroups = localStorage.getItem('admin_groups');
        const groups = storedGroups ? JSON.parse(storedGroups) : [];
        
        //keep the API call for other stats
        const statsResponse = await dashboardApi.getDashboardStats();
        
        if (statsResponse.data) {
          const statsData = statsResponse.data;
          
          // Calculate percentage changes for other stats
          const youthChange = statsData.previousMonthYouths > 0 ? 
            Math.round(((statsData.totalYouths - statsData.previousMonthYouths) / statsData.previousMonthYouths) * 100) : 0;
            
          const employerChange = statsData.previousMonthEmployers > 0 ? 
            Math.round(((statsData.totalEmployers - statsData.previousMonthEmployers) / statsData.previousMonthEmployers) * 100) : 0;
            
          // Update stats for display
          const updatedStats: StatCard[] = [
            {
              title: 'Youth Registered',
              value: statsData.totalYouths?.toLocaleString() || '0',
              change: statsData.previousMonthYouths > 0 ? 
                `${youthChange >= 0 ? '+' : ''}${youthChange}% from last month` : 
                'No previous data',
              icon: <FiUsers size={20} />,
              iconBg: 'bg-blue-100',
              iconColor: 'text-blue-600'
            },
            {
              title: 'Unemployment Rate',
              value: `${statsData.unemploymentRate?.toFixed(1) || '0'}%`,
              change: 'Based on registered profiles',
              icon: <FiTrendingUp size={20} />,
              iconBg: 'bg-green-100',
              iconColor: 'text-green-600'
            },
            {
              title: 'Employers',
              value: statsData.totalEmployers?.toLocaleString() || '0',
              change: statsData.previousMonthEmployers > 0 ? 
                `${employerChange >= 0 ? '+' : ''}${employerChange}% from last month` : 
                'No previous data',
              icon: <FiUsers size={20} />,
              iconBg: 'bg-purple-100',
              iconColor: 'text-purple-600'
            },
            {
              title: 'Groups',
              value: groups.length.toString(),
              change: groups.length === 1 ? '1 group' : `${groups.length} groups`,
              icon: <FiUsers size={20} />,
              iconBg: 'bg-yellow-100',
              iconColor: 'text-yellow-600'
            }
          ];
          
          setStats(updatedStats);
        }
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
        
        // Set error state for other stats, but still show groups from localStorage
        const storedGroups = localStorage.getItem('admin_groups');
        const groups = storedGroups ? JSON.parse(storedGroups) : [];
        
        const errorStats: StatCard[] = [
          {
            title: 'Youth Registered',
            value: 'Error',
            change: 'Failed to load',
            icon: <FiUsers size={20} />,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600'
          },
          {
            title: 'Unemployment Rate',
            value: 'Error',
            change: 'Failed to load',
            icon: <FiTrendingUp size={20} />,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600'
          },
          {
            title: 'Employers',
            value: '0',
            change: 'Error loading data',
            icon: <FiUsers size={20} />,
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600'
          },
          {
            title: 'Groups',
            value: groups.length.toString(),
            change: groups.length === 1 ? '1 group' : `${groups.length} groups`,
            icon: <FiUsers size={20} />,
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600'
          }
        ];
        setStats(errorStats);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Quick Links
  const quickLinks: QuickLink[] = [
    { icon: <FiTrendingUp size={20} />, title: 'Youth Insights Dashboard', link: 'https://dtp3.plotly.app/' },
    { icon: <FiUsers size={20} />, title: 'View All Registered Youths', link: '/admin/youth-profiles' },
    { icon: <FiUsers size={20} />, title: 'View All Groups', link: '/admin/groups' }
  ];

  // AI predictions
  const aiPredictions: AIPrediction[] = [
    { skill: 'Tech skills', percentage: 75 },
    { skill: 'Business skills', percentage: 65 },
    { skill: 'Soft skills', percentage: 80 }
  ];

  const groups: Group[] = [
    {
      title: 'Tech Innovators',
      field: 'Technology & Innovation',
      bio: 'A group focused on technology startups and digital innovation',
      lastActive: '2h ago'
    },
    {
      title: 'Business Starters',
      field: 'Entrepreneurship',
      bio: 'For aspiring entrepreneurs starting their business journey',
      lastActive: '5h ago'
    },
    {
      title: 'Green Entrepreneurs',
      field: 'Sustainability',
      bio: 'Eco-friendly business initiatives and sustainable solutions',
      lastActive: '1d ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button 
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
              onClick={() => window.location.reload()}
            >
              <FiRefreshCw className="mr-2" />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  {isLoading ? (
                    <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mt-2"></div>
                  ) : (
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.iconBg} ${stat.iconColor}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Predictions and Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Future Skill Demand</h3>
            {aiPredictions.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.skill}</span>
                  <span>{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Quick Actions</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                index === 0 ? (
                  <li key={index} className="flex items-center justify-between p-3 rounded-lg">
                    <a
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center bg-blue-600 text-white py-3 px-4 rounded-md text-base font-semibold shadow hover:bg-blue-700 transition-colors"
                    >
                      <span className="mr-3">{link.icon}</span>
                      {link.title}
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7m0 0v7m0-7L10 14m-7 7h7a2 2 0 002-2v-7" /></svg>
                    </a>
                  </li>
                ) : (
                  <li key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <a href={link.link} className="flex items-center w-full text-sm text-gray-700 hover:text-blue-600 transition-colors">
                      <span className="text-blue-500 mr-3">{link.icon}</span>
                      <span>{link.title}</span>
                    </a>
                  </li>
                )
              ))}
            </ul>
          </div>
        </div>

        {/* Entrepreneur Groups */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Entrepreneur Groups</h2>
            <button className="text-blue-600 text-sm flex items-center hover:underline">
              View all <FiArrowRight className="ml-1" size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {groups.map((group, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                <h3 className="font-medium text-gray-900">{group.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{group.field}</p>
                <p className="text-sm text-gray-600 my-2 line-clamp-2">{group.bio}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="flex items-center">
                    <FiClock className="mr-1" size={12} /> {group.lastActive}
                  </span>
                  <a href="#" className="text-blue-500 flex items-center hover:underline">
                    View group <FiArrowRight className="ml-1" size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow">
            <h3 className="font-medium text-gray-900 mb-2">Find New Talents</h3>
            <p className="text-sm text-gray-600 mb-4">Search and connect with potential candidates</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700 flex items-center justify-center">
              <FiSearch className="mr-2" /> Search Talents
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow">
            <h3 className="font-medium text-gray-900 mb-2">Generate Reports</h3>
            <p className="text-sm text-gray-600 mb-4">Create detailed reports and analytics</p>
            <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm hover:bg-gray-50 flex items-center justify-center">
              <FiDownload className="mr-2" /> Export Report
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow">
            <h3 className="font-medium text-gray-900 mb-2">Add Notification</h3>
            <p className="text-sm text-gray-600 mb-4">Send updates and announcements to users</p>
            <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm hover:bg-gray-50 flex items-center justify-center">
              <FiPlus className="mr-2" /> Create Notification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;