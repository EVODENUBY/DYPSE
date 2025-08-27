import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { XMarkIcon, BriefcaseIcon, BuildingOfficeIcon, CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export interface Experience {
  id?: string;
  employerName: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description?: string;
}

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience?: Experience | null;
  onSave: (experience: Experience) => void;
  isSaving: boolean;
}

export default function ExperienceModal({ isOpen, onClose, experience, onSave, isSaving }: ExperienceModalProps) {
  // Common style classes
  const inputClasses = 'mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 transition-colors';
  const labelClasses = 'block text-sm font-medium text-gray-700';
  const iconHoverClasses = 'group-hover:bg-blue-100 p-1.5 rounded-full transition-colors';
  const buttonClasses = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
  const fieldIconClasses = 'h-5 w-5 mr-2 text-blue-600';
  const sectionIconClasses = 'h-6 w-6 text-blue-600 mr-2';

  const [formData, setFormData] = useState<Experience>({
    employerName: '',
    role: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: ''
  });

  useEffect(() => {
    if (experience) {
      setFormData(experience);
    } else {
      setFormData({
        employerName: '',
        role: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: ''
      });
    }
  }, [experience]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        ...(name === 'isCurrent' && checked ? { endDate: '' } : {})
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };


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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900 flex items-center">
                    <BriefcaseIcon className={sectionIconClasses} />
                    {experience ? 'Edit Experience' : 'Add Experience'}
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
                    <label htmlFor="employerName" className={labelClasses}>
                      <div className="flex items-center">
                        <BuildingOfficeIcon className={`${fieldIconClasses} ${iconHoverClasses}`} />
                        Company Name
                      </div>
                    </label>
                    <input
                      type="text"
                      id="employerName"
                      name="employerName"
                      value={formData.employerName}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="Enter company name"
                      required
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="role" className={labelClasses}>
                      <div className="flex items-center">
                        <BriefcaseIcon className={`${fieldIconClasses} ${iconHoverClasses}`} />
                        Job Title
                      </div>
                    </label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="Enter your job title"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="group">
                      <label htmlFor="startDate" className={labelClasses}>
                        <div className="flex items-center">
                          <CalendarIcon className={`${fieldIconClasses} ${iconHoverClasses}`} />
                          Start Date
                        </div>
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                      />
                    </div>

                    <div className="group">
                      <label htmlFor="endDate" className={labelClasses}>
                        <div className="flex items-center">
                          <CalendarIcon className={`${fieldIconClasses} ${iconHoverClasses}`} />
                          End Date
                        </div>
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className={`${inputClasses} ${formData.isCurrent ? 'bg-gray-100' : ''}`}
                        disabled={formData.isCurrent}
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="description" className={labelClasses}>
                      <div className="flex items-center">
                        <DocumentTextIcon className={`${fieldIconClasses} ${iconHoverClasses}`} />
                        Description (Optional)
                      </div>
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      value={formData.description || ''}
                      onChange={handleChange}
                      className={`${inputClasses} resize-none`}
                      placeholder="Describe your role and responsibilities, key achievements, and technologies used"
                    />
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-3">
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
                      ) : 'Save Experience'}
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
