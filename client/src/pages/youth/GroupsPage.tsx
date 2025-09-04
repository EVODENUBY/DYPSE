import { useState, useEffect } from 'react';
import { FiSearch, FiUsers, FiCheck } from 'react-icons/fi';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

interface Group {
  id: string;
  name: string;
  description: string;
  logo: string;
  tips?: string[];
  rules?: string;
  createdAt: string;
  participants: string[];
}

const GROUPS_STORAGE_KEY = 'admin_groups';
const YOUTH_JOINED_GROUPS_KEY = 'youth_joined_groups';

const GroupsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);
  const [modalGroup, setModalGroup] = useState<Group | null>(null);
  const [acceptRules, setAcceptRules] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(GROUPS_STORAGE_KEY);
    if (stored) {
      setGroups(JSON.parse(stored));
    }
    const joined = localStorage.getItem(YOUTH_JOINED_GROUPS_KEY);
    if (joined) {
      setJoinedGroups(JSON.parse(joined));
    }
  }, []);

  const handleJoin = (group: Group) => {
    setModalGroup(group);
    setAcceptRules(false);
  };
  const confirmJoin = () => {
    if (modalGroup && !joinedGroups.includes(modalGroup.id)) {
      const updated = [...joinedGroups, modalGroup.id];
      setJoinedGroups(updated);
      localStorage.setItem(YOUTH_JOINED_GROUPS_KEY, JSON.stringify(updated));
      // Update participants in group
      const updatedGroups = groups.map(g =>
        g.id === modalGroup.id ? { ...g, participants: [...(g.participants || []), 'youth'] } : g
      );
      setGroups(updatedGroups);
      localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(updatedGroups));
      setModalGroup(null);
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Link to="/youth/dashboard" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Groups</h1>
        </div>
        <p className="text-gray-600">Find and join groups created by the admin. Grow your network and collaborate!</p>
      </div>
      {/* Search */}
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
        </div>
      </div>
      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <div key={group.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="h-40 bg-gray-100 relative flex items-center justify-center">
              {group.logo ? (
                <img 
                  src={group.logo} 
                  alt={group.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {group.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{group.name}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Created
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{group.description}</p>
              {group.tips && group.tips.length > 0 && (
                <div className="text-xs text-blue-500 mb-2">
                  <h4 className="text-xs font-semibold text-gray-700 mb-1">Core Activities/Skills:</h4>
                  <ul className="list-disc list-inside text-xs text-gray-600">
                    {group.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Removed rules and regulations display from group card */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <FiUsers className="mr-1 h-4 w-4 text-blue-600" />
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full mr-2">
                    {group.participants.length}
                  </span>
                  Participants
                </div>
                {joinedGroups.includes(group.id) ? (
                  <button
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 cursor-default"
                    disabled
                  >
                    <FiCheck className="mr-1" /> Joined
                  </button>
                ) : (
                  <button
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => handleJoin(group)}
                  >
                    Join Group
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-1">No groups found</h3>
          <p className="text-gray-500">Try adjusting your search to find what you're looking for.</p>
        </div>
      )}
      {modalGroup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={e => {
            if (e.target === e.currentTarget) setModalGroup(null);
          }}
        >
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setModalGroup(null)}>&times;</button>
            <div className="flex items-center mb-4">
              {modalGroup.logo && <img src={modalGroup.logo} alt={modalGroup.name} className="h-12 w-12 rounded-full object-cover mr-3" />}
              <div>
                <h2 className="text-xl font-bold text-gray-900">{modalGroup.name}</h2>
                <p className="text-gray-600 text-sm">{modalGroup.description}</p>
              </div>
            </div>
            {modalGroup.tips && modalGroup.tips.length > 0 && (
              <div className="mb-2">
                <h4 className="text-xs font-semibold text-gray-700 mb-1">Core Activities/Skills:</h4>
                <ul className="list-disc list-inside text-xs text-gray-600">
                  {modalGroup.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
            {modalGroup.rules && (
              <div className="mb-2">
                <h4 className="text-xs font-semibold text-purple-700 mb-1">Rules & Regulations:</h4>
                <div className="text-xs text-gray-700 whitespace-pre-line border p-2 rounded bg-purple-50">{modalGroup.rules}</div>
              </div>
            )}
            <div className="flex items-center mt-4 mb-2">
              <input
                type="checkbox"
                id="acceptRules"
                checked={acceptRules}
                onChange={e => setAcceptRules(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="acceptRules" className="text-xs text-gray-700">I accept the rules and regulations of this group</label>
            </div>
            <button
              className={`w-full py-2 px-4 rounded-md flex items-center justify-center ${
                acceptRules ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
              } text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              disabled={!acceptRules}
              onClick={confirmJoin}
            >
              Join Group
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsPage;
