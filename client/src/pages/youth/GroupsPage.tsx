import { useState } from 'react';
import { FiSearch, FiFilter, FiUsers, FiLock } from 'react-icons/fi';

interface Group {
  id: string;
  name: string;
  memberCount: number;
  isPrivate: boolean;
  description: string;
  category: string;
  image: string;
}

const GroupsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Technology', 'Business', 'Design', 'Marketing', 'Other'];
  
  // Mock data for groups
  // Using placeholder images from a reliable source
  const getPlaceholderImage = (category: string, id: number) => {
    const baseUrl = 'https://source.unsplash.com/random/400x200/?';
    const categories: Record<string, string> = {
      'Technology': 'web,development,programming',
      'Marketing': 'marketing,social,media',
      'Design': 'design,ui,ux,graphic',
      'Business': 'business,meeting,office',
      'Other': 'network,community,group'
    };
    const searchTerm = categories[category] || 'group';
    return `${baseUrl}${searchTerm}&sig=${id}`; // Add unique ID to prevent caching
  };

  const groups: Group[] = [
    {
      id: '1',
      name: 'Web Developers Community',
      memberCount: 1243,
      isPrivate: false,
      description: 'A community for web developers to share knowledge and collaborate on projects.',
      category: 'Technology',
      image: getPlaceholderImage('Technology', 1)
    },
    {
      id: '2',
      name: 'Digital Marketing Pros',
      memberCount: 856,
      isPrivate: false,
      description: 'For marketing professionals to discuss trends and strategies in digital marketing.',
      category: 'Marketing',
      image: getPlaceholderImage('Marketing', 2)
    },
    {
      id: '3',
      name: 'UX/UI Designers Hub',
      memberCount: 621,
      isPrivate: true,
      description: 'Exclusive group for UX/UI designers to share work and get feedback.',
      category: 'Design',
      image: getPlaceholderImage('Design', 3)
    },
    {
      id: '4',
      name: 'Startup Founders',
      memberCount: 432,
      isPrivate: true,
      description: 'Networking and knowledge sharing for startup founders and entrepreneurs.',
      category: 'Business',
      image: getPlaceholderImage('Business', 4)
    },
    {
      id: '5',
      name: 'Data Science Enthusiasts',
      memberCount: 1102,
      isPrivate: false,
      description: 'For data scientists and analysts to discuss tools, techniques, and career growth.',
      category: 'Technology',
      image: getPlaceholderImage('Technology', 5)
    },
    {
      id: '6',
      name: 'Freelance Network',
      memberCount: 723,
      isPrivate: false,
      description: 'Connect with other freelancers and find collaboration opportunities.',
      category: 'Business',
      image: getPlaceholderImage('Business', 6)
    },
  ];

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || group.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Groups</h1>
        <p className="text-gray-600">Join groups to connect with like-minded professionals and grow your network</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'All' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <div key={group.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="h-40 bg-gray-100 relative">
              <img 
                src={group.image} 
                alt={group.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to gradient background if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '';
                  target.parentElement!.innerHTML = `
                    <div class="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span class="text-white text-2xl font-bold">
                        ${group.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  `;
                }}
              />
              {group.isPrivate && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <FiLock className="mr-1 h-3 w-3" />
                  Private
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{group.name}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {group.category}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{group.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <FiUsers className="mr-1 h-4 w-4" />
                  {group.memberCount.toLocaleString()} members
                </div>
                <button
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Join Group
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-1">No groups found</h3>
          <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

export default GroupsPage;
