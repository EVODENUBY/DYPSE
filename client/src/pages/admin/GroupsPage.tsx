import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { FiUsers, FiAlertCircle } from 'react-icons/fi';

interface GroupForm {
  name: string;
  description: string;
  logo: string; // base64 or url
  tips: string[]; 
  rules?: string;
}

interface GroupFormErrors {
  name?: string;
  description?: string;
  logo?: string;
}

interface Group extends GroupForm {
  id: string;
  createdAt: string;
  participants: string[];
}

const GROUPS_STORAGE_KEY = 'admin_groups';

const AdminGroupsPage: React.FC = () => {
  const [formData, setFormData] = useState<GroupForm>({
    name: '',
    description: '',
    logo: '',
    tips: [],
    rules: '',
  });
  const [errors, setErrors] = useState<GroupFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [editGroupId, setEditGroupId] = useState<string | null>(null);
  // Add a new state for the current tip being typed
  const [currentTip, setCurrentTip] = useState('');
  const [participantsModalGroup, setParticipantsModalGroup] = useState<Group | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(GROUPS_STORAGE_KEY);
    if (stored) {
      setGroups(JSON.parse(stored));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof GroupFormErrors]) {
      setErrors(prev => ({ ...prev, [name as keyof GroupFormErrors]: undefined }));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: GroupFormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Group name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.logo) newErrors.logo = 'Logo is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      if (editGroupId) {
        // Edit mode: update existing group
        const updatedGroups = groups.map(g =>
          g.id === editGroupId
            ? { ...g, ...formData }
            : g
        );
        setGroups(updatedGroups);
        localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(updatedGroups));
        setEditGroupId(null);
        setSubmitSuccess(true);
      } else {
        // Create mode: add new group
        const newGroup: Group = {
          ...formData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          participants: [],
        };
        const updatedGroups = [newGroup, ...groups];
        setGroups(updatedGroups);
        localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(updatedGroups));
        setSubmitSuccess(true);
      }
      setFormData({ name: '', description: '', logo: '', tips: [], rules: '' });
      setTimeout(() => setSubmitSuccess(false), 2000);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <div className="flex items-center">
          <Link to="/admin/dashboard" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Groups Management</h1>
        </div>
        <div className="mt-2 ml-9 text-sm text-gray-600">
          {groups.length} group{groups.length !== 1 ? 's' : ''} created
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Create Group Form */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create Group</h2>
              {submitSuccess && (
                <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  Group created!
                </span>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Group Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Enter group name"
                  maxLength={100}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FiAlertCircle className="mr-1" /> {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Enter group description"
                  maxLength={500}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FiAlertCircle className="mr-1" /> {errors.description}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                  Logo <span className="text-red-500">*</span>
                </label>
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="w-full p-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.logo && (
                  <img src={formData.logo} alt="Group Logo Preview" className="mt-2 h-16 w-16 object-cover rounded-full border" />
                )}
                {errors.logo && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FiAlertCircle className="mr-1" /> {errors.logo}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="tips" className="block text-sm font-medium text-gray-700 mb-1">
                  Core Skills/Advantages (optional)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tips.map((tip, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                      {tip}
                      <button
                        type="button"
                        onClick={() => {
                          const updatedTips = formData.tips.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, tips: updatedTips }));
                        }}
                        className="ml-1 text-blue-800 hover:text-blue-900"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  name="currentTip"
                  value={currentTip}
                  onChange={e => setCurrentTip(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (currentTip.trim()) {
                        setFormData(prev => ({ ...prev, tips: [...prev.tips, currentTip.trim()] }));
                        setCurrentTip('');
                      }
                    }
                  }}
                  className="w-full p-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type a core skill/activity and press Enter"
                  maxLength={100}
                />
              </div>
              <div>
                <label htmlFor="rules" className="block text-sm font-medium text-gray-700 mb-1">
                  Rules and Regulations (optional)
                </label>
                <textarea
                  id="rules"
                  name="rules"
                  value={formData.rules}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter rules and regulations for this group (optional)"
                  maxLength={1000}
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2 px-4 rounded-md flex items-center justify-center ${
                    isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  } text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isSubmitting ? (editGroupId ? 'Saving...' : 'Creating...') : (editGroupId ? 'Save Changes' : 'Create Group')}
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Recent Groups */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Recent Groups</h2>
                <span className="text-sm text-gray-500">{groups.length} group{groups.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="divide-y divide-gray-200 max-h-[calc(100vh-250px)] overflow-y-auto">
              {groups.length > 0 ? (
                groups.map((group) => (
                  <div key={group.id} className="p-4 hover:bg-gray-50 transition-colors duration-150 flex items-center">
                    <img src={group.logo} alt={group.name} className="h-12 w-12 rounded-full object-cover border mr-4" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-900 truncate pr-2">{group.name}</h3>
                        <span className="text-xs text-gray-500">{new Date(group.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">{group.description}</p>
                      {group.tips && group.tips.length > 0 && (
                        <div className="mt-2">
                          <h4 className="text-xs font-semibold text-gray-700 mb-1">Core Activities/Skills:</h4>
                          <ul className="list-disc list-inside text-xs text-gray-600">
                            {group.tips.map((tip, index) => (
                              <li key={index}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {group.rules && <div className="mt-1 text-xs text-purple-500">Rules: {group.rules}</div>}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditGroupId(group.id);
                          setFormData({
                            name: group.name,
                            description: group.description,
                            logo: group.logo,
                            tips: group.tips,
                            rules: group.rules || '',
                          });
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          // Implement delete logic here
                          const updatedGroups = groups.filter(g => g.id !== group.id);
                          setGroups(updatedGroups);
                          localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(updatedGroups));
                          console.log('Deleted group:', group);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.166L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.166m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                      <button
                        className="ml-2 text-blue-600 hover:text-blue-900 text-xs underline"
                        onClick={() => setParticipantsModalGroup(group)}
                      >
                        <FiUsers className="mr-1 h-4 w-4 text-blue-600" />
                        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full mr-2">
                          {group.participants.length}
                        </span>
                        Participants
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 px-4">
                  <FiUsers className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No groups yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Groups you create will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {participantsModalGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setParticipantsModalGroup(null)}>&times;</button>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Participants</h2>
            {participantsModalGroup.participants.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700 text-sm">
                {participantsModalGroup.participants.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 text-sm">No participants yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGroupsPage;
