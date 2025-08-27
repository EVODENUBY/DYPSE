import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { XMarkIcon, MapPinIcon, HomeIcon, BuildingOfficeIcon, GlobeAltIcon, TagIcon } from '@heroicons/react/24/outline';

interface LocationData {
  address: string;
  city: string;
  country: string;
  postalCode: string;
  region: string;
}

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: LocationData;
  onSave: (location: LocationData) => void;
  isSaving: boolean;
}

export default function LocationModal({ isOpen, onClose, location, onSave, isSaving }: LocationModalProps) {
  const [formData, setFormData] = useState<LocationData>({
    address: '',
    city: '',
    country: '',
    postalCode: '',
    region: ''
  });

  useEffect(() => {
    if (location) {
      setFormData(location);
    } else {
      setFormData({
        address: '',
        city: '',
        country: '',
        postalCode: '',
        region: ''
      });
    }
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // List of countries for the dropdown
  const countries = [
    'Rwanda',
    'Uganda',
    'Burundi',
    'Tanzania',
    'DR Congo',
    'Sudan',
    'Central Africa',
    'Kenya',
    'Somalia',
    'Other'
  ];

  // Common classes
  const inputClasses = 'mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 transition-colors';
  const labelClasses = 'block text-sm font-medium text-gray-700';
  const iconHoverClasses = 'group-hover:bg-blue-100 p-1.5 rounded-full transition-colors';
  const buttonClasses = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900 flex items-center">
                    <MapPinIcon className="h-6 w-6 text-blue-600 mr-2" />
                    Edit Location
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-full p-1.5 text-gray-400 hover:text-gray-500 hover:bg-blue-50 transition-colors"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="group">
                    <label htmlFor="address" className={labelClasses}>
                      <div className="flex items-center">
                        <HomeIcon className={`h-4 w-4 mr-1.5 text-blue-600 ${iconHoverClasses}`} />
                        Address
                      </div>
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={inputClasses}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="group">
                      <label htmlFor="city" className={labelClasses}>
                        <div className="flex items-center">
                          <BuildingOfficeIcon className={`h-4 w-4 mr-1.5 text-blue-600 ${iconHoverClasses}`} />
                          City
                        </div>
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                      />
                    </div>

                    <div className="group">
                      <label htmlFor="region" className={labelClasses}>
                        <div className="flex items-center">
                          <TagIcon className={`h-4 w-4 mr-1.5 text-blue-600 ${iconHoverClasses}`} />
                          State/Region
                        </div>
                      </label>
                      <input
                        type="text"
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="group">
                      <label htmlFor="postalCode" className={labelClasses}>
                        <div className="flex items-center">
                          <TagIcon className={`h-4 w-4 mr-1.5 text-blue-600 ${iconHoverClasses}`} />
                          Postal Code
                        </div>
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                      />
                    </div>

                    <div className="group">
                      <label htmlFor="country" className={labelClasses}>
                        <div className="flex items-center">
                          <GlobeAltIcon className={`h-4 w-4 mr-1.5 text-blue-600 ${iconHoverClasses}`} />
                          Country
                        </div>
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className={`${inputClasses} cursor-pointer`}
                        required
                      >
                        <option value="">Select a country</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className={`${buttonClasses} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className={`${buttonClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
