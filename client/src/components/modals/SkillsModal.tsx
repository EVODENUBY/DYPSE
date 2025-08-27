import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { XMarkIcon, TagIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: string[];
  onSave: (skills: string[]) => void;
  isSaving: boolean;
}

export default function SkillsModal({ isOpen, onClose, skills, onSave, isSaving }: SkillsModalProps) {
  const [inputValue, setInputValue] = useState('');
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);

  useEffect(() => {
    setCurrentSkills([...skills]);
  }, [skills]);

  const handleAddSkill = () => {
    const skill = inputValue.trim();
    if (skill && !currentSkills.includes(skill)) {
      setCurrentSkills([...currentSkills, skill]);
      setInputValue('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setCurrentSkills(currentSkills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(currentSkills);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      handleAddSkill();
    }
  };

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
                    <TagIcon className="h-6 w-6 text-blue-600 mr-2" />
                    Edit Skills
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
                    <label htmlFor="skill" className={labelClasses}>
                      <div className="flex items-center">
                        <PlusCircleIcon className={`h-4 w-4 mr-1.5 text-blue-600 ${iconHoverClasses}`} />
                        Add Skills
                      </div>
                    </label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        id="skill"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={`${inputClasses} flex-1`}
                        placeholder="Type a skill and press Enter"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        disabled={!inputValue.trim()}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Press Enter or click Add to add a skill
                    </p>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <TagIcon className="h-4 w-4 mr-1.5 text-blue-600" />
                      Current Skills
                    </h4>
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-gray-50 rounded-lg">
                      {currentSkills.length > 0 ? (
                        currentSkills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 group"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="ml-1.5 inline-flex items-center justify-center h-5 w-5 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none transition-colors"
                              title={`Remove ${skill}`}
                            >
                              <XMarkIcon className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 w-full text-center py-1">No skills added yet. Start typing above to add skills.</p>
                      )}
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
