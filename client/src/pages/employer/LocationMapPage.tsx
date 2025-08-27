import React from 'react';
import { 
  FiArrowUpRight,
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock data for the charts
const employmentData = [
  { name: 'Jan', employed: 4000, unemployed: 2400, inTraining: 2400 },
  { name: 'Feb', employed: 3000, unemployed: 1398, inTraining: 2210 },
  { name: 'Mar', employed: 2000, unemployed: 9800, inTraining: 2290 },
  { name: 'Apr', employed: 2780, unemployed: 3908, inTraining: 2000 },
  { name: 'May', employed: 1890, unemployed: 4800, inTraining: 2181 },
  { name: 'Jun', employed: 2390, unemployed: 3800, inTraining: 2500 },
  { name: 'Jul', employed: 3490, unemployed: 4300, inTraining: 2100 },
];

const demandData = [
  { name: 'IT & Software', value: 35 },
  { name: 'Healthcare', value: 25 },
  { name: 'Construction', value: 20 },
  { name: 'Education', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const jobReadinessData = [
  {
    id: 1,
    name: 'Jean de Dieu',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    readiness: 'high',
    lastUpdated: '2 days ago'
  },
  {
    id: 2,
    name: 'Marie Claire',
    skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
    readiness: 'medium',
    lastUpdated: '1 week ago'
  },
  {
    id: 3,
    name: 'Eric Niyonshuti',
    skills: ['Java', 'Spring Boot', 'MySQL', 'AWS'],
    readiness: 'high',
    lastUpdated: '3 days ago'
  },
  {
    id: 4,
    name: 'Alice Uwase',
    skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'Sketch'],
    readiness: 'medium',
    lastUpdated: '5 days ago'
  }
];

const LocationMapPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Location Map</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Employment Prediction Graph */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">AI Prediction: Employment, Unemployment & Training</h2>
              <div className="flex space-x-2 text-sm">
                <span className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div> Employed</span>
                <span className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div> Unemployed</span>
                <span className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div> In Training</span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={employmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="employed" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="unemployed" stroke="#EF4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="inTraining" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Predicted Demand Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Predicted Demand for Groups (Next 6 Months)</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={demandData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {demandData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Demand']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right side - Job Readiness Index */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Job Readiness Index</h2>
              <button className="text-blue-600 text-sm flex items-center">
                See All <FiArrowUpRight className="ml-1" />
              </button>
            </div>
            
            <div className="space-y-4">
              {jobReadinessData.slice(0, 2).map((candidate) => (
                <div key={candidate.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{candidate.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-1 mb-2">
                        {candidate.skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 3 && (
                          <span className="text-xs text-gray-500">+{candidate.skills.length - 3} more</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      {candidate.readiness === 'high' ? (
                        <span className="flex items-center text-sm text-green-600 bg-green-50 px-2 py-0.5 rounded">
                          <FiCheckCircle className="mr-1" /> High
                        </span>
                      ) : (
                        <span className="flex items-center text-sm text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">
                          <FiAlertCircle className="mr-1" /> Medium
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>Updated {candidate.lastUpdated}</span>
                    <button className="text-blue-600 hover:underline">View Profile</button>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="mt-4 w-full text-center text-blue-600 text-sm font-medium py-2 hover:bg-blue-50 rounded">
              View All Candidates
            </button>
          </div>

          {/* Second Card - Additional Metrics */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Key Metrics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-full mr-3">
                    <FiUsers className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active Job Seekers</p>
                    <p className="font-semibold">1,234</p>
                  </div>
                </div>
                <div className="text-green-500 flex items-center">
                  <FiTrendingUp className="mr-1" /> 12%
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-full mr-3">
                    <FiCheckCircle className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Placement Rate</p>
                    <p className="font-semibold">78%</p>
                  </div>
                </div>
                <div className="text-green-500 flex items-center">
                  <FiTrendingUp className="mr-1" /> 5%
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-full mr-3">
                    <FiClock className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Avg. Time to Hire</p>
                    <p className="font-semibold">23 days</p>
                  </div>
                </div>
                <div className="text-red-500 flex items-center">
                  <FiTrendingDown className="mr-1" /> 3%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMapPage;
