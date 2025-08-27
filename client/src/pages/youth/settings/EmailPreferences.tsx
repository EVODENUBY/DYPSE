import { useState } from 'react';

type EmailPreference = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
};

const EmailPreferences = () => {
  const [preferences, setPreferences] = useState<EmailPreference[]>([
    {
      id: 'newsletter',
      name: 'Newsletter',
      description: 'Receive our monthly newsletter with updates and news.',
      enabled: true,
    },
    {
      id: 'notifications',
      name: 'Notifications',
      description: 'Receive email notifications for important updates.',
      enabled: true,
    },
    {
      id: 'promotions',
      name: 'Promotions',
      description: 'Receive special offers and promotions.',
      enabled: false,
    },
    {
      id: 'events',
      name: 'Events',
      description: 'Get notified about upcoming events and webinars.',
      enabled: true,
    },
  ]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const togglePreference = (id: string) => {
    setPreferences(prev => 
      prev.map(pref => 
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
  };

  const savePreferences = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, you would call your API here
      // await api.updateEmailPreferences(preferences);
      
      setSaveStatus({
        type: 'success',
        message: 'Your email preferences have been updated!'
      });
    } catch (error) {
      setSaveStatus({
        type: 'error',
        message: 'Failed to update preferences. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = preferences.some(pref => 
    pref.enabled !== (preferences.find(p => p.id === pref.id)?.enabled)
  );

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">Email Preferences</h2>
      
      {saveStatus && (
        <div className={`mb-6 p-4 rounded-md ${
          saveStatus.type === 'success' 
            ? 'bg-green-50 text-green-800' 
            : 'bg-red-50 text-red-800'
        }`}>
          {saveStatus.message}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {preferences.map((preference) => (
            <li key={preference.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {preference.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {preference.description}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button
                    type="button"
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      preference.enabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                    role="switch"
                    aria-checked={preference.enabled}
                    onClick={() => togglePreference(preference.id)}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                        preference.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={savePreferences}
          disabled={!hasChanges || isSaving}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            hasChanges && !isSaving
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};

export default EmailPreferences;
