import { FaSearch, FaGraduationCap, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface OpportunityCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  to: string;
}

const OpportunityCard = ({ title, description, icon, buttonText, to }: OpportunityCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        <Link
          to={to}
          className="inline-flex items-center justify-center px-4 py-2 border  text-sm font-medium rounded-md shadow-sm text-black bg-gradient-to-r from-[#0033FF] to-[#000333DD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}

const OpportunitiesPage = () => {
  const opportunities = [
    {
      title: 'Search and Match',
      description: 'Find your dream job with our advanced search and matching system.',
      icon: <FaSearch className="h-6 w-6" />,
      buttonText: 'Search Jobs',
      to: '/youth/jobs'
    },
    {
      title: 'Training Programs',
      description: 'Enhance your skills with our comprehensive training programs.',
      icon: <FaGraduationCap className="h-6 w-6" />,
      buttonText: 'View Trainings',
      to: '/youth/trainings'
    },
    {
      title: 'Groups',
      description: 'Connect with like-minded professionals and join groups.',
      icon: <FaUsers className="h-6 w-6" />,
      buttonText: 'Explore Groups',
      to: '/youth/groups'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Opportunities</h1>
        <p className="text-gray-600">Explore various opportunities to grow your career</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {opportunities.map((opp, index) => (
          <OpportunityCard
            key={index}
            title={opp.title}
            description={opp.description}
            icon={opp.icon}
            buttonText={opp.buttonText}
            to={opp.to}
          />
        ))}
      </div>
    </div>
  );
};

export default OpportunitiesPage;
