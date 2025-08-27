import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiShare2, FiUpload, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { employerApi, type EmployerProfile } from '@/lib/employerApi';

interface ContactDetails {
  contactPersonName: string;
  contactPersonTitle: string;
  contactEmail: string;
  contactPhone: string;
  district: string;
  companyAddress: string;
  city: string;
  postalCode: string;
}

interface JobPosting {
  jobTitle: string;
  department: string;
  jobType: string;
  experienceLevel: string;
  minSalary: string;
  maxSalary: string;
  jobDescription: string;
  requiredSkills: string[];
  jobRequirements: string[];
  newSkill: string;
  newRequirement: string;
  numberOfPositions: string;
  applicationDeadline: string;
  benefits: string[];
  newBenefit: string;
}

interface HiringInfo {
  isCurrentlyHiring: boolean;
  averageHiresPerMonth: string;
  preferredSkills: string[];
  isVerified: boolean;
  additionalNotes: string;
  newSkill: string;
  jobPostings: JobPosting[];
  currentJobPosting: number | null;
}

type FormData = Omit<EmployerProfile, 'id' | 'createdAt' | 'updatedAt'> & ContactDetails & HiringInfo;

const EmployerProfiles = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [activeTab, setActiveTab] = useState('company-info');
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    industry: '',
    companySize: '',
    foundedYear: '',
    city: '',
    country: '',
    website: '',
    description: '',
    taxId: '',
    businessRegistrationNumber: '',
    // Contact Details
    contactPersonName: '',
    contactPersonTitle: '',
    contactEmail: '',
    contactPhone: '',
    district: '',
    companyAddress: '',
    postalCode: '',
    // Hiring Info
    isCurrentlyHiring: false,
    averageHiresPerMonth: '',
    preferredSkills: [],
    isVerified: false,
    additionalNotes: '',
    newSkill: '',
    // Job Postings
    jobPostings: [{
      jobTitle: '',
      department: '',
      jobType: 'Full-time',
      experienceLevel: 'Entry Level',
      minSalary: '',
      maxSalary: '',
      jobDescription: '',
      requiredSkills: [],
      jobRequirements: [],
      newSkill: '',
      newRequirement: '',
      numberOfPositions: '1',
      applicationDeadline: '',
      benefits: [],
      newBenefit: ''
    }],
    currentJobPosting: 0
  });

  const industries = [
    'Technology',
    'Finance',
    'Healthcare',
    'Education',
    'Retail',
    'Manufacturing',
    'Other'
  ];

  const jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Temporary',
    'Freelance',
    'Volunteer'
  ];

  const experienceLevels = [
    'Entry Level',
    'Mid Level',
    'Senior Level',
    'Lead',
    'Manager',
    'Executive'
  ];

  const rwandaDistricts = [
    'Gasabo',
    'Nyarugenge',
    'Kicukiro',
    'Bugesera',
    'Gatsibo',
    'Kayonza',
    'Kirehe',
    'Ngoma',
    'Nyagatare',
    'Burera',
    'Gakenke',
    'Gicumbi',
    'Musanze',
    'Rulindo',
    'Gisagara',
    'Huye',
    'Kamonyi',
    'Muhanga',
    'Nyamagabe',
    'Nyanza',
    'Nyaruguru',
    'Ruhango',
    'Karongi',
    'Ngororero',
    'Nyabihu',
    'Nyamasheke',
    'Rubavu',
    'Rusizi',
    'Rutsiro'
  ];

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1000+ employees'
  ];

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      if (!user || user.role !== 'employer') return;
      
      try {
        setIsLoading(true);
        const profile = await employerApi.getProfile();
        
        setFormData(prev => ({
          ...prev,
          ...profile
        }));
        
        if (profile.logoUrl) {
          setLogoPreview(profile.logoUrl);
        }
      } catch (error) {
        console.error('Error fetching company profile:', error);
        toast.error('Failed to load company profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const file = files[0];
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
      }
    } else if (name.startsWith('jobPosting.')) {
      const field = name.split('.')[1];
      setFormData(prev => {
        const updatedJobPostings = [...prev.jobPostings];
        updatedJobPostings[prev.currentJobPosting || 0] = {
          ...updatedJobPostings[prev.currentJobPosting || 0],
          [field]: value
        };
        return { ...prev, jobPostings: updatedJobPostings };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>, type: 'preferred' | 'required' | 'requirement' | 'benefit' = 'preferred') => {
    const target = e.target as HTMLInputElement;
    const value = target.value.trim();
    
    if (e.key === 'Enter' && value) {
      e.preventDefault();
      
      if (type === 'preferred') {
        if (!formData.preferredSkills.includes(value)) {
          setFormData(prev => ({
            ...prev,
            preferredSkills: [...prev.preferredSkills, value],
            newSkill: ''
          }));
        }
      } else if (type === 'required' || type === 'requirement') {
        const field = type === 'required' ? 'requiredSkills' : 'jobRequirements';
        const currentJob = formData.jobPostings[formData.currentJobPosting || 0];
        
        if (!currentJob[field].includes(value)) {
          const updatedJobPostings = [...formData.jobPostings];
          updatedJobPostings[formData.currentJobPosting || 0] = {
            ...currentJob,
            [field]: [...currentJob[field], value],
            [type === 'required' ? 'newSkill' : 'newRequirement']: ''
          };
          
          setFormData(prev => ({
            ...prev,
            jobPostings: updatedJobPostings
          }));
        }
      } else if (type === 'benefit') {
        const currentJob = formData.jobPostings[formData.currentJobPosting || 0];
        
        if (!currentJob.benefits.includes(value)) {
          const updatedJobPostings = [...formData.jobPostings];
          updatedJobPostings[formData.currentJobPosting || 0] = {
            ...currentJob,
            benefits: [...currentJob.benefits, value],
            newBenefit: ''
          };
          
          setFormData(prev => ({
            ...prev,
            jobPostings: updatedJobPostings
          }));
        }
      }
    }
  };

  const removeItem = (item: string, type: 'preferred' | 'required' | 'requirement' | 'benefit') => {
    if (type === 'preferred') {
      setFormData({
        ...formData,
        preferredSkills: formData.preferredSkills.filter(skill => skill !== item)
      });
    } else if (type === 'required' || type === 'requirement' || type === 'benefit') {
      const updatedJobPostings = [...formData.jobPostings];
      const currentPosting = updatedJobPostings[formData.currentJobPosting || 0];
      
      if (type === 'required') {
        currentPosting.requiredSkills = currentPosting.requiredSkills.filter(skill => skill !== item);
      } else if (type === 'requirement') {
        currentPosting.jobRequirements = currentPosting.jobRequirements.filter(req => req !== item);
      } else if (type === 'benefit') {
        currentPosting.benefits = currentPosting.benefits.filter(benefit => benefit !== item);
      }
      
      setFormData({ ...formData, jobPostings: updatedJobPostings });
    }
  };

  const addNewJobPosting = () => {
    setFormData(prev => ({
      ...prev,
      jobPostings: [
        ...prev.jobPostings,
        {
          jobTitle: '',
          department: '',
          jobType: 'Full-time',
          experienceLevel: 'Entry Level',
          minSalary: '',
          maxSalary: '',
          jobDescription: '',
          requiredSkills: [],
          jobRequirements: [],
          newSkill: '',
          newRequirement: '',
          numberOfPositions: '1',
          applicationDeadline: '',
          benefits: [],
          newBenefit: ''
        }
      ],
      currentJobPosting: prev.jobPostings.length
    }));
  };

  const removeJobPosting = (index: number) => {
    if (formData.jobPostings.length <= 1) return;
    
    const updatedJobPostings = formData.jobPostings.filter((_, i) => i !== index);
    const newCurrent = index >= updatedJobPostings.length ? updatedJobPostings.length - 1 : index;
    
    setFormData(prev => ({
      ...prev,
      jobPostings: updatedJobPostings,
      currentJobPosting: newCurrent
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setLogoFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return null;

    try {
      const response = await employerApi.uploadLogo(logoFile);
      return response.url;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
      throw error;
    }
  };

  const handleCancel = () => {
    // Reset the form to initial state or navigate away
    navigate('/employer/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent, isShare: boolean = false) => {
    e.preventDefault();
    
    if (isLoading || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Upload logo if a new one was selected
      let logoUrl = formData.logoUrl;
      if (logoFile) {
        const uploadedUrl = await uploadLogo();
        if (uploadedUrl) {
          logoUrl = uploadedUrl;
        }
      }

      // Update company profile
      const updatedProfile = await employerApi.updateProfile({
        ...formData,
        logoUrl
      });
      
      // Update form data with the returned profile to ensure we have the latest data
      setFormData(prev => ({
        ...prev,
        ...updatedProfile
      }));
      
      // If we have a new logo URL, update the preview
      if (updatedProfile.logoUrl) {
        setLogoPreview(updatedProfile.logoUrl);
      }

      toast.success('Profile updated successfully');
      
      if (isShare) {
        // Navigate to share page or show share modal
        navigate('/employer/dashboard');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = (e: React.FormEvent) => handleSubmit(e, false);
  const handleSaveAndShare = (e: React.FormEvent) => handleSubmit(e, true);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Create a profile of your company</h1>
        
        {/* Tabs */}
        <div className="border-b   mb-8 ">
          <nav className=" flex space-x-8 bg-[#D9D9D9] rounded-2xl">
            <button
              onClick={() => setActiveTab('company-info')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'company-info'
                  ? ' bg-[#FFFFFF] text-blue-600 rounded-md'
                  : 'border-transparent text-black-600 hover:text-white-700 hover:border-gray-300'
              }`}
            >
              Company Info
            </button>
            <button
              onClick={() => setActiveTab('contact-details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'contact-details'
                  ? 'bg-[#FFFFFF] text-blue-600 rounded-xl'
                  : 'border-transparent text-black-600 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Contact Details
            </button>
            <button
              onClick={() => setActiveTab('hiring-info')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'hiring-info'
                  ? ' bg-[#FFFFFF] text-blue-600 rounded-xl'
                  : 'border-transparent text-black-600 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Hiring Info
            </button>
            <button
              onClick={() => setActiveTab('job-posting')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'job-posting'
                  ? 'bg-[#FFFFFF] text-blue-600 rounded-xl' 
                  : 'border-transparent text-black-600 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Job Posting
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow rounded-lg p-6">
          {activeTab === 'company-info' && (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="col-span-2">
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Industry</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Size <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="companySize"
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Size</option>
                    {companySizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700 mb-1">
                    Founded Year
                  </label>
                  <input
                    type="number"
                    id="foundedYear"
                    name="foundedYear"
                    value={formData.foundedYear}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 bg-gray-200 rounded-full mb-4 overflow-hidden flex items-center justify-center">
                    {logoPreview ? (
                      <>
                        <img 
                          src={logoPreview} 
                          alt="Company Logo" 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeLogo();
                          }}
                          className="absolute top-1 right-1 bg-black bg-opacity-100 text-white rounded-full p-1 hover:bg-opacity-70"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <FiUpload className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 inline-flex items-center"
                    >
                      <FiUpload className="mr-2 h-4 w-4" />
                      {logoPreview ? 'Change Logo' : 'Upload Logo'}
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Recommended: 500x500px, max 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-1">
                    Tax ID
                  </label>
                  <input
                    type="text"
                    id="taxId"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="businessRegistrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Registration Number
                  </label>
                  <input
                    type="text"
                    id="businessRegistrationNumber"
                    name="businessRegistrationNumber"
                    value={formData.businessRegistrationNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/employer/dashboard')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isLoading || isSubmitting}
                >
                  <FiSave className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndShare}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  disabled={isLoading || isSubmitting}
                >
                  <FiShare2 className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Saving...' : 'Save & Share'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'contact-details' && (
            <form onSubmit={handleSave} className="space-y-6">
              {/* First Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="contactPersonName" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="contactPersonName"
                    name="contactPersonName"
                    value={formData.contactPersonName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contactPersonTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="contactPersonTitle"
                    name="contactPersonTitle"
                    value={formData.contactPersonTitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Size <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="companySize"
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Company Size</option>
                    {companySizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select District</option>
                    {rwandaDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Third Row - Company Address */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="companyAddress"
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Fourth Row - City and Postal Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/employer/dashboard')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isLoading || isSubmitting}
                >
                  <FiSave className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndShare}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  disabled={isLoading || isSubmitting}
                >
                  <FiShare2 className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Saving...' : 'Save & Share'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'hiring-info' && (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Currently Hiring Toggle */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isCurrentlyHiring"
                  name="isCurrentlyHiring"
                  checked={formData.isCurrentlyHiring}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-400 rounded"
                />
                <label htmlFor="isCurrentlyHiring" className="ml-2 block text-sm font-medium text-gray-700">
                  Currently Hiring
                </label>
              </div>

              {/* Average Hires Per Month */}
              <div>
                <label htmlFor="averageHiresPerMonth" className="block text-sm font-medium text-gray-700 mb-1">
                  Average Hires Per Month
                </label>
                <input
                  type="text"
                  id="averageHiresPerMonth"
                  name="averageHiresPerMonth"
                  value={formData.averageHiresPerMonth}
                  onChange={handleChange}
                  placeholder="e.g., 5-10"
                  className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Preferred Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Skills
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    name="newSkill"
                    value={formData.newSkill}
                    onChange={handleChange}
                    onKeyDown={handleAddSkill}
                    placeholder="Type a skill and press Enter"
                    className="flex-1 px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.preferredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeItem(skill, 'preferred')}
                        className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 text-blue-600 hover:bg-blue-300 focus:outline-none focus:bg-blue-300"
                      >
                        <span className="sr-only">Remove {skill}</span>
                        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                          <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Verification Checkbox */}
              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  id="isVerified"
                  name="isVerified"
                  checked={formData.isVerified}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isVerified" className="ml-2 block text-sm font-medium text-gray-700">
                  Verify by Employer and Admin Only
                </label>
              </div>

              {/* Additional Notes */}
              <div>
                <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  rows={4}
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any additional information about your hiring process..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/employer/dashboard')}
                  className="px-4 py-2 border border-gray-400 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isLoading || isSubmitting}
                >
                  <FiSave className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndShare}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  disabled={isLoading || isSubmitting}
                >
                  <FiShare2 className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Saving...' : 'Save & Share'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'job-posting' && (
            <div className="space-y-6">
              {/* Job Posting Tabs */}
              <div className="border-b border-gray-200">
                <div className="px-4 pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium text-gray-900">Job Postings</h3>
                    <button
                      type="button"
                      onClick={addNewJobPosting}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      + New Job Posting
                    </button>
                  </div>
                  <nav className="flex space-x-6 border-b border-gray-200">
                  {formData.jobPostings.map((posting, index) => (
                    <button
                      key={index}
                      onClick={() => setFormData(prev => ({ ...prev, currentJobPosting: index }))}
                      className={`whitespace-nowrap py-3 px-1 font-medium text-sm border-b-2 ${
                        formData.currentJobPosting === index
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {posting.jobTitle || `Job Posting ${index + 1}`}
                      {formData.jobPostings.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeJobPosting(index);
                          }}
                          className="ml-2 text-gray-400 hover:text-red-500"
                        >
                          ×
                        </button>
                      )}
                    </button>
                  ))}
                </nav>
                </div>
              </div>

              {formData.jobPostings.length > 0 && (
                <form id="job-posting-form" onSubmit={handleSave} className="space-y-6">
                  <h2 className="text-lg font-medium text-gray-900">
                    {formData.jobPostings[formData.currentJobPosting || 0].jobTitle || 'New Job Posting'}
                  </h2>
                  
                  {/* First Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="jobTitle"
                        name="jobPosting.jobTitle"
                        value={formData.jobPostings[formData.currentJobPosting || 0].jobTitle}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        id="department"
                        name="jobPosting.department"
                        value={formData.jobPostings[formData.currentJobPosting || 0].department}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                        Job Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="jobType"
                        name="jobPosting.jobType"
                        value={formData.jobPostings[formData.currentJobPosting || 0].jobType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        {jobTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Second Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
                        Experience Level <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="experienceLevel"
                        name="jobPosting.experienceLevel"
                        value={formData.jobPostings[formData.currentJobPosting || 0].experienceLevel}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        {experienceLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="minSalary" className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Salary (RWF)
                      </label>
                      <input
                        type="number"
                        id="minSalary"
                        name="jobPosting.minSalary"
                        value={formData.jobPostings[formData.currentJobPosting || 0].minSalary}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label htmlFor="maxSalary" className="block text-sm font-medium text-gray-700 mb-1">
                        Maximum Salary (RWF)
                      </label>
                      <input
                        type="number"
                        id="maxSalary"
                        name="jobPosting.maxSalary"
                        value={formData.jobPostings[formData.currentJobPosting || 0].maxSalary}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        min={formData.jobPostings[formData.currentJobPosting || 0].minSalary || '0'}
                      />
                    </div>
                  </div>

                  {/* Job Description */}
                  <div>
                    <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      Job Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="jobDescription"
                      name="jobPosting.jobDescription"
                      rows={4}
                      value={formData.jobPostings[formData.currentJobPosting || 0].jobDescription}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Required Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Required Skills
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        name="jobPosting.newSkill"
                        value={formData.jobPostings[formData.currentJobPosting || 0].newSkill}
                        onChange={handleChange}
                        onKeyDown={(e) => handleAddSkill(e, 'required')}
                        placeholder="Type a skill and press Enter"
                        className="flex-1 px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.jobPostings[formData.currentJobPosting || 0].requiredSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeItem(skill, 'required')}
                            className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 text-blue-600 hover:bg-blue-300 focus:outline-none focus:bg-blue-300"
                          >
                            <span className="sr-only">Remove {skill}</span>
                            <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                              <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Job Requirements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Requirements
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        name="jobPosting.newRequirement"
                        value={formData.jobPostings[formData.currentJobPosting || 0].newRequirement}
                        onChange={handleChange}
                        onKeyDown={(e) => handleAddSkill(e, 'requirement')}
                        placeholder="Type a requirement and press Enter"
                        className="flex-1 px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <ul className="mt-2 list-disc list-inside">
                      {formData.jobPostings[formData.currentJobPosting || 0].jobRequirements.map((req, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-700">
                          {req}
                          <button
                            type="button"
                            onClick={() => removeItem(req, 'requirement')}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Number of Positions, Application Deadline, and Benefits */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="numberOfPositions" className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Positions <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="numberOfPositions"
                        name="jobPosting.numberOfPositions"
                        value={formData.jobPostings[formData.currentJobPosting || 0].numberOfPositions}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700 mb-1">
                        Application Deadline <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="applicationDeadline"
                        name="jobPosting.applicationDeadline"
                        value={formData.jobPostings[formData.currentJobPosting || 0].applicationDeadline}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-1">
                        Benefits and Perks
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          id="benefits"
                          name="jobPosting.newBenefit"
                          value={formData.jobPostings[formData.currentJobPosting || 0].newBenefit || ''}
                          onChange={handleChange}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const value = formData.jobPostings[formData.currentJobPosting || 0].newBenefit.trim();
                              if (value) {
                                const updatedJobPostings = [...formData.jobPostings];
                                const currentPosting = updatedJobPostings[formData.currentJobPosting || 0];
                                if (!currentPosting.benefits.includes(value)) {
                                  currentPosting.benefits = [...currentPosting.benefits, value];
                                  currentPosting.newBenefit = '';
                                  setFormData({ ...formData, jobPostings: updatedJobPostings });
                                }
                              }
                            }
                          }}
                          className="flex-1 px-3 py-2 border border-gray-400 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Type benefit and press Enter"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const value = formData.jobPostings[formData.currentJobPosting || 0].newBenefit.trim();
                            if (value) {
                              const updatedJobPostings = [...formData.jobPostings];
                              const currentPosting = updatedJobPostings[formData.currentJobPosting || 0];
                              if (!currentPosting.benefits.includes(value)) {
                                currentPosting.benefits = [...currentPosting.benefits, value];
                                currentPosting.newBenefit = '';
                                setFormData({ ...formData, jobPostings: updatedJobPostings });
                              }
                            }
                          }}
                          className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Add
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.jobPostings[formData.currentJobPosting || 0].benefits.map((benefit, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {benefit}
                            <button
                              type="button"
                              onClick={() => {
                                const updatedJobPostings = [...formData.jobPostings];
                                const currentPosting = updatedJobPostings[formData.currentJobPosting || 0];
                                currentPosting.benefits = currentPosting.benefits.filter((_, i) => i !== index);
                                setFormData({ ...formData, jobPostings: updatedJobPostings });
                              }}
                              className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 text-blue-600 hover:bg-blue-300 focus:outline-none focus:bg-blue-300"
                            >
                              <span className="sr-only">Remove {benefit}</span>
                              <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-400 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                    >
                      Submit Job Posting
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerProfiles;
