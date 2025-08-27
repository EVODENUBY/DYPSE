import React from 'react';
import { 
  FiUsers, 
  FiTrendingUp, 
  FiBriefcase, 
  FiFileText,
  FiMapPin,
  FiBarChart2,
  FiActivity,
  FiPlus,
  FiAward,
  FiSearch,
  FiDownload,
  FiClock,
  FiArrowRight
} from 'react-icons/fi';

const AdminDashboardPage: React.FC = () => {
  // Stats data
  const stats = [
    {
      title: 'Total Youth Registered',
      value: '1,234',
      change: '+12.5% from last month',
      icon: <FiUsers size={20} />,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Unemployment Rate',
      value: '24.5%',
      change: '-2.1% from last quarter',
      icon: <FiTrendingUp size={20} />,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Top Demand',
      value: 'IT Skills',
      change: 'Most sought after',
      icon: <FiBriefcase size={20} />,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'New Business This Month',
      value: '45',
      change: '+8 from last month',
      icon: <FiAward size={20} />,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Group Reports',
      value: '15',
      change: 'Generated this week',
      icon: <FiFileText size={20} />,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    }
  ];

  // Quick links data
  const quickLinks = [
    {
      icon: <FiActivity size={18} />,
      title: 'Employment Status',
      link: 'View distribution'
    },
    {
      icon: <FiBarChart2 size={18} />,
      title: 'Skill Gap Analysis',
      link: 'View analysis'
    },
    {
      icon: <FiTrendingUp size={18} />,
      title: 'Employment Trends',
      link: 'View trends'
    },
    {
      icon: <FiMapPin size={18} />,
      title: 'Location Map',
      link: 'View map'
    }
  ];

  // AI Predictions data
  const aiPredictions = [
    { skill: 'Job Readiness', percentage: 75 },
    { skill: 'Technical Skills', percentage: 65 },
    { skill: 'Soft Skills', percentage: 82 }
  ];

  // Entrepreneur groups data
  const groups = [
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
    <div className="p-6">
      {/* Header - Welcome Message */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, Admin</h1>
        <p className="text-gray-600">Here's what's happening with your platform today.</p>
      </div>

      {/* First Row - 5 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${stat.iconBg} ${stat.iconColor} mr-3`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-lg font-semibold">{stat.value}</p>
                {stat.change && <p className="text-xs text-green-500">{stat.change}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Second Row - 4 Small Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickLinks.map((link, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                {link.icon}
              </div>
              <div>
                <p className="text-sm font-medium">{link.title}</p>
                <p className="text-xs text-blue-500">{link.link}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Third Row - AI Predictions */}
      <div className="bg-[#D9D9D9] rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">AI Predictions and Insights</h2>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-md text-sm font-medium border border-gray-300">
            Live AI
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">Future Skill Demand</h3>
            {aiPredictions.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.skill}</span>
                  <span>{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                Review pending applications
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                Schedule monthly report generation
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                Check system updates
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Fourth Row - Entrepreneur Groups */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Entrepreneur Groups and Activities</h2>
          <button className="text-blue-600 text-sm flex items-center">
            View all <FiArrowRight className="ml-1" size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {groups.map((group, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              <h3 className="font-medium">{group.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{group.field}</p>
              <p className="text-sm text-gray-600 my-2">{group.bio}</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span className="flex items-center">
                  <FiClock className="mr-1" size={12} /> {group.lastActive}
                </span>
                <a href="#" className="text-blue-500 flex items-center">
                  See updates <FiArrowRight className="ml-1" size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fifth Row - Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#D9D9D9] rounded-lg p-6">
          <h3 className="font-medium mb-2">Find New Talents</h3>
          <p className="text-sm text-gray-600 mb-4">Search and connect with potential candidates</p>
          <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm hover:bg-gray-50 flex items-center justify-center">
            <FiSearch className="mr-2" /> Search
          </button>
        </div>
        
        <div className="bg-[#D9D9D9] rounded-lg p-6">
          <h3 className="font-medium mb-2">Generate Reports</h3>
          <p className="text-sm text-gray-600 mb-4">Create detailed reports and analytics</p>
          <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm hover:bg-gray-50 flex items-center justify-center">
            <FiDownload className="mr-2" /> Export
          </button>
        </div>
        
        <div className="bg-[#D9D9D9] rounded-lg p-6">
          <h3 className="font-medium mb-2">Add Notification</h3>
          <p className="text-sm text-gray-600 mb-4">Send updates and announcements to users</p>
          <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm hover:bg-gray-50 flex items-center justify-center">
            <FiPlus className="mr-2" /> Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;