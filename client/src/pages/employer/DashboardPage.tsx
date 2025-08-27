import React from 'react';
import { 
  FiUsers, 
  FiAward, 
  FiSearch, 
  FiCalendar, 
  FiDollarSign, 
  FiBell,
  FiArrowRight,
  FiTrendingUp,
} from 'react-icons/fi';
import { FaUserGraduate, FaChartLine } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EmployerDashboardPage: React.FC = () => {
  // Chart data
  const employmentData = [
    { month: 'Jan', employed: 65 },
    { month: 'Feb', employed: 59 },
    { month: 'Mar', employed: 80 },
    { month: 'Apr', employed: 81 },
    { month: 'May', employed: 76 },
    { month: 'Jun', employed: 85 },
  ];

  // Updates data
  const updates = [
    { id: 1, text: '5 new candidates matched your job requirements', time: '2 min ago' },
    { id: 2, text: '3 interviews scheduled for tomorrow', time: '1 hour ago' },
  ];

  // Stats data
  const stats = [
    { 
      title: 'Total Youth Registered', 
      value: '1,245', 
      icon: FaUserGraduate, 
      change: '+12%', 
      changeType: 'increase',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-gray-600'
    },
    { 
      title: 'Unemployed', 
      value: '32%', 
      icon: FiUsers, 
      change: '-5%', 
      changeType: 'decrease',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      textColor: 'text-gray-600'
    },
    { 
      title: 'Top 3 Demand Skills', 
      value: 'Digital Marketing', 
      icon: FiAward, 
      subtitle: 'Web Dev, Data Analysis',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      textColor: 'text-gray-600'
    },
    { 
      title: 'Youth Employment Trend', 
      value: '85%', 
      icon: FaChartLine, 
      trend: 'up',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-gray-600',
      showChart: true,
      change: '+5%',
      changeType: 'increase'
    },
    { 
      title: 'Search & Match', 
      value: '24', 
      icon: FiSearch, 
      change: 'New Matches', 
      changeType: 'info',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      textColor: 'text-gray-600'
    },
    { 
      title: 'Interview Scheduled', 
      value: '8', 
      icon: FiCalendar, 
      change: 'Today', 
      changeType: 'info',
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      textColor: 'text-gray-600'
    },
    { 
      title: 'Billing', 
      value: 'Current Plan', 
      icon: FiDollarSign, 
      subtitle: 'Premium',
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-600',
      textColor: 'text-gray-600'
    },
  ];

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
        </div>
        
        {/* Updates Card */}
        <div className="relative group">
          <button className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="relative">
              <FiBell className="h-6 w-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {updates.length}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700">Check All Updates</span>
            <FiArrowRight className="h-4 w-4 text-gray-500" />
          </button>
          
          {/* Dropdown Updates */}
          <div 
            className="hidden group-hover:block absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10"
            onMouseOver={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Recent Updates</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {updates.map((update) => (
                <div key={update.id} className="p-4 hover:bg-gray-50">
                  <p className="text-sm text-gray-700">{update.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{update.time}</p>
                </div>
              ))}
            </div>
            <div className="p-3 bg-gray-50 text-center">
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                View all updates
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 ${index === 3 ? 'lg:col-span-2' : ''}`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className={`p-3 rounded-lg ${stat.bgColor} mr-4`}>
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${stat.textColor}`}>{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    {stat.subtitle && (
                      <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
                    )}
                    {stat.change && (
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                          stat.changeType === 'increase' ? 'bg-green-100 text-green-800' : 
                          stat.changeType === 'decrease' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {stat.change}
                      </span>
                    )}
                  </div>
                </div>
                {stat.trend === 'up' && !stat.showChart && (
                  <div className="text-green-500">
                    <FiTrendingUp className="h-8 w-8" />
                  </div>
                )}
              </div>
              
              {stat.showChart && (
                <div className="mt-4 h-40 -mx-2 -mb-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={employmentData}
                      margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorEmployed" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        width={30}
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          border: 'none',
                          padding: '0.5rem',
                        }}
                        labelStyle={{ color: '#374151', fontWeight: 600, fontSize: '0.75rem' }}
                        itemStyle={{ color: '#6B7280', fontSize: '0.75rem' }}
                        formatter={(value: number) => [`${value}%`, 'Employment Rate']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="employed" 
                        stroke="#10B981" 
                        fillOpacity={1} 
                        fill="url(#colorEmployed)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployerDashboardPage;
