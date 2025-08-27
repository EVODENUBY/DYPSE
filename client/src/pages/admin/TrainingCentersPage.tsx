import React, { useState } from 'react';
import { FiSearch, FiMapPin, FiStar, FiUsers, FiPhone, FiGlobe } from 'react-icons/fi';

interface TrainingCenter {
  id: string;
  name: string;
  description: string;
  type: 'tech' | 'vocational' | 'art' | 'design';
  location: 'north' | 'south' | 'east' | 'west' | 'kigali';
  director: string;
  phone: string;
  website: string;
  participants: number;
  rating: number;
  image?: string;
}

const trainingCenters: TrainingCenter[] = [
  {
    id: '1',
    name: 'Kigali Tech Institute',
    description: 'Leading technical training center offering cutting-edge technology programs in software development, cybersecurity, and data science.',
    type: 'tech',
    location: 'kigali',
    director: 'Dr. Jean de Dieu',
    phone: '+250 788 123 456',
    website: 'www.kti.rw',
    participants: 350,
    rating: 4.7,
  },
  {
    id: '2',
    name: 'Rwanda Vocational Training Center',
    description: 'Comprehensive vocational training programs in construction, automotive, and electrical engineering.',
    type: 'vocational',
    location: 'south',
    director: 'Ms. Marie Claire',
    phone: '+250 788 654 321',
    website: 'www.rvtc.rw',
    participants: 420,
    rating: 4.5,
  },
  {
    id: '3',
    name: 'Kigali Art & Design Academy',
    description: 'Premier institution for creative arts, graphic design, and multimedia studies.',
    type: 'art',
    location: 'kigali',
    director: 'Mr. Patrick Niyitanga',
    phone: '+250 788 987 654',
    website: 'www.kada.rw',
    participants: 210,
    rating: 4.8,
  },
  {
    id: '4',
    name: 'Northern Technical College',
    description: 'Specialized technical training in renewable energy and environmental technologies.',
    type: 'tech',
    location: 'north',
    director: 'Dr. Samuel Niyomugabo',
    phone: '+250 788 123 789',
    website: 'www.notc.rw',
    participants: 280,
    rating: 4.6,
  },
  {
    id: '5',
    name: 'Western Creative Arts Center',
    description: 'Center of excellence for performing arts, music, and cultural studies.',
    type: 'art',
    location: 'west',
    director: 'Ms. Grace Uwase',
    phone: '+250 788 456 123',
    website: 'www.wcac.rw',
    participants: 180,
    rating: 4.4,
  },
  {
    id: '6',
    name: 'Eastern Vocational Training Institute',
    description: 'Specialized training in agriculture, food processing, and agribusiness.',
    type: 'vocational',
    location: 'east',
    director: 'Mr. Eric Nsabimana',
    phone: '+250 788 789 123',
    website: 'www.evti.rw',
    participants: 320,
    rating: 4.3,
  },
];

const TrainingCentersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  const filteredCenters = trainingCenters.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        center.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || center.type === selectedType;
    const matchesLocation = selectedLocation === 'all' || center.location === selectedLocation;
    
    return matchesSearch && matchesType && matchesLocation;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Training Centers</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          + Add New Center
        </button>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search by Name */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by name or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="tech">Technical Trainings</option>
              <option value="vocational">Vocational Trainings</option>
              <option value="art">Art and Design</option>
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="all">All Locations</option>
              <option value="kigali">Kigali City</option>
              <option value="north">Northern Province</option>
              <option value="south">Southern Province</option>
              <option value="east">Eastern Province</option>
              <option value="west">Western Province</option>
            </select>
          </div>
        </div>
      </div>

      {/* Training Centers Grid */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          Showing {filteredCenters.length} of {trainingCenters.length} training centers
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCenters.length > 0 ? (
          filteredCenters.map((center) => (
            <TrainingCenterCard key={center.id} center={center} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No training centers found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Training Center Card Component
const TrainingCenterCard: React.FC<{ center: TrainingCenter }> = ({ center }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{center.name}</h2>
          <div className="flex items-center bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
            <FiStar className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">{center.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{center.description}</p>
        
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center">
            <FiMapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span className="capitalize">{center.location} Province</span>
          </div>
          
          <div className="flex items-center">
            <FiUsers className="h-4 w-4 mr-2 text-gray-400" />
            <span>Director: {center.director}</span>
          </div>
          
          <div className="flex items-center">
            <FiPhone className="h-4 w-4 mr-2 text-gray-400" />
            <a href={`tel:${center.phone}`} className="hover:text-blue-600">
              {center.phone}
            </a>
          </div>
          
          {center.website && (
            <div className="flex items-center">
              <FiGlobe className="h-4 w-4 mr-2 text-gray-400" />
              <a 
                href={`https://${center.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {center.website}
              </a>
            </div>
          )}
          
          <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-500">{center.participants} participants</span>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              View Programs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingCentersPage;
