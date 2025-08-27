import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { XMarkIcon, UserIcon, EnvelopeIcon, PhoneIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
}

interface PersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  info: PersonalInfo;
  onSave: (info: PersonalInfo) => void;
  isSaving: boolean;
}

export default function PersonalInfoModal({ isOpen, onClose, info, onSave, isSaving }: PersonalInfoModalProps) {
  const [formData, setFormData] = useState<Omit<PersonalInfo, 'email'>>({
    firstName: '',
    lastName: '',
    phone: '',
    bio: ''
  });
  
  const [email, setEmail] = useState('');

  useEffect(() => {
    const { email, ...rest } = info;
    setFormData(rest);
    setEmail(email);
  }, [info]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, email });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const inputClasses = 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 p-2 transition-colors';
  const labelClasses = 'block text-sm font-medium text-gray-700';
  const iconHoverClasses = 'hover:bg-blue-100 p-1.5 rounded-full transition-colors';

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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Edit Personal Information
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className={labelClasses}>
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-1 text-blue-600" />
                          First Name
                        </div>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className={labelClasses}>
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-1 text-blue-600 opacity-0" />
                          Last Name
                        </div>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClasses}>
                      <div className="flex items-center">
                        <EnvelopeIcon className={`h-4 w-4 mr-1 text-blue-600 ${iconHoverClasses}`} />
                        Email
                      </div>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      readOnly
                      className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className={labelClasses}>
                      <div className="flex items-center">
                        <PhoneIcon className={`h-4 w-4 mr-1 text-blue-600 ${iconHoverClasses}`} />
                        Phone
                      </div>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label htmlFor="bio" className={labelClasses}>
                      <div className="flex items-center">
                        <DocumentTextIcon className={`h-4 w-4 mr-1 text-blue-600 ${iconHoverClasses}`} />
                        Bio
                      </div>
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      value={formData.bio}
                      onChange={handleChange}
                      className={`${inputClasses} min-h-[100px]`}
                    />
                  </div>

                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
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
