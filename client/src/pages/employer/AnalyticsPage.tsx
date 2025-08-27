import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const AnalyticsPage = () => {
  // Sample data for 6-month employment trend (line chart)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const employmentTrendData = {
    labels: months,
    datasets: [
      {
        label: 'Job Openings',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: 'blue',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Applications',
        data: [28, 48, 40, 19, 86, 27],
        borderColor: 'green',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3,
      },
    ],
  };

  // Sample data for skills gap analysis (bar chart)
  const skills = ['JavaScript', 'Python', 'React', 'Node.js', 'Data Analysis'];
  const skillsGapData = {
    labels: skills,
    datasets: [
      {
        label: 'Demand',
        data: [12, 19, 8, 15, 10],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Supply',
        data: [8, 12, 5, 10, 15],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Sample data for employment status (pie chart)
  const employmentStatusData = {
    labels: ['Employed', 'Unemployed', 'Self-Employed'],
    datasets: [
      {
        data: [63, 27, 10],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Skill Gap in Demand</h1>
      
      {/* 6-Month Employment Trend */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">6-Month Employment Trend</h2>
        <div className="h-80">
          <Line data={employmentTrendData} options={chartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skills Gap Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Skills Gap Analysis</h2>
          <div className="h-80">
            <Bar data={skillsGapData} options={chartOptions} />
          </div>
        </div>

        {/* Employment Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Employment Status Distribution</h2>
          <div className="h-80 flex items-center justify-center">
            <div className="w-64 h-64">
              <Pie data={employmentStatusData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
