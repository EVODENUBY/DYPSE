import React, { useEffect, useState } from 'react';
import { 
  UserIcon, EnvelopeIcon, PhoneIcon, 
  MapPinIcon, DocumentTextIcon, PencilIcon,
  BriefcaseIcon, AcademicCapIcon, CheckCircleIcon
} from '@heroicons/react/24/outline';
import CircularProgress from '../../components/CircularProgress';
import ProfileCard from '../../components/ProfileCard';
import InfoItem from '../../components/InfoItem';
import PersonalInfoModal  from '../../components/modals/PersonalInfoModal';
import LocationModal from '../../components/modals/LocationModal';
import SkillsModal from '../../components/modals/SkillsModal';
import ExperienceModal from '../../components/modals/ExperienceModal';
import EducationModal from '../../components/modals/EducationModal';
import { useAuth } from '@/contexts/AuthContext';
import { profileAPI } from '@/lib/profileApi';

// Types
interface Experience {
  id?: string;
  employerName: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description?: string;
}

interface Education {
  id?: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: LocationData;
  bio: string;
  status?: 'JOB_SEEKER' | 'EMPLOYED' | 'FREELANCER';
  skills: string[];
  experience: Experience[];
  education: Education[];
  cvUrl: string | null;
  profilePicture: string | null;
};

type PersonalInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  jobStatus?: 'JOB_SEEKER' | 'EMPLOYED' | 'FREELANCER';
};

interface LocationData{
  address: string;
  city: string;
  country: string;
  postalCode: string;
  region: string;
};


const calculateProfileCompletion = (user: UserProfile): number => {
  const totalFields = 9; // Total number of fields we're checking
  let completedFields = 0;

  // Basic info
  if (user.firstName && user.lastName) completedFields++;
  if (user.email) completedFields++;
  if (user.phone) completedFields++;
  
  // Location
  if (user.location && Object.values(user.location).some(Boolean)) completedFields++;
  
  // Bio
  if (user.bio) completedFields++;
  
  // Skills
  if (user.skills && user.skills.length > 0) completedFields++;
  
  // Experience
  if (user.experience && user.experience.length > 0) completedFields++;
  
  // Education
  if (user.education && user.education.length > 0) completedFields++;
  
  // Profile picture
  if (user.profilePicture) completedFields++;

  return Math.round((completedFields / totalFields) * 100);
};

const ProfilePage = () => {
  const [isPersonalInfoModalOpen, setIsPersonalInfoModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [isSkillsSaving, setIsSkillsSaving] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);

  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);

  const apiBase = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000/api';
  const uploadsBase = apiBase.replace(/\/api\/?$/, '');
  const toAbsolute = (p: string | null): string | null => {
    if (!p) return null;
    return p.startsWith('/uploads/') ? `${uploadsBase}${p}` : p;
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await profileAPI.getMyProfile();
        console.log('Profile data received:', me); // Debug log
        if (!mounted) return;
        if (!me) {
          setUser({
            firstName: authUser?.firstName || '',
            lastName: authUser?.lastName || '',
            email: authUser?.email || '',
            phone: authUser?.phone || '',
            location: { address: '', city: '', country: '', postalCode: '', region: '' },
            bio: '',
            status: 'JOB_SEEKER',
            skills: [],
            experience: [],
            education: [],
            profilePicture: null,
            cvUrl: null,
          });
        } else {
          const userData = {
            firstName: me.firstName || authUser?.firstName || '',
            lastName: me.lastName || authUser?.lastName || '',
            email: authUser?.email || '',
            phone: authUser?.phone || '',
            location: { address: me.address || '', city: me.city || '', country: me.country || '', postalCode: me.postalCode || '', region: me.district || '' },
            bio: me.bio || '',
            status: me.status || 'JOB_SEEKER',
            skills: (me.skills || []).map((ps: any) => ps.skill?.name).filter(Boolean),
            experience: (me.experiences || []).map((exp: any) => ({
              id: exp.id,
              employerName: exp.employerName,
              role: exp.role,
              startDate: exp.startDate || '',
              endDate: exp.endDate || '',
              isCurrent: exp.isCurrent,
              description: exp.description || '',
            })),
            education: (me.educations || []).map((ed: any) => ({
              id: ed.id,
              degree: ed.degree || '',
              institution: ed.school || '',
              fieldOfStudy: ed.fieldOfStudy || '',
              startDate: ed.startDate || '',
              endDate: ed.endDate || '',
              description: '',
            })),
            profilePicture: toAbsolute(me.profilePictureUrl || null),
            cvUrl: toAbsolute(me.cvUrl || null),
          };
          console.log('Setting user data:', userData); // Debug log
          setUser(userData);
        }
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    })();
    return () => { mounted = false; };
  }, [authUser?.id]);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Profile picture file selected:', file); // Debug log
      // Preview locally
      const reader = new FileReader();
      reader.onload = () => {
        setUser(prev => (prev ? { ...prev, profilePicture: reader.result as string } as UserProfile : prev));
      };
      reader.readAsDataURL(file);
      // upload to backend
      profileAPI.uploadProfilePicture(file).then(async (response) => {
        console.log('Profile picture upload response:', response); // Debug log
        // Refresh profile to get updated data
        const me = await profileAPI.getMyProfile();
        console.log('Refreshed profile data after picture upload:', me); // Debug log
        setUser(prev => (prev ? { ...prev, profilePicture: toAbsolute(me.profilePictureUrl || '') } as UserProfile : prev));
      }).catch((error) => {
        console.error('Error uploading profile picture:', error); // Debug log
      });
    }
  };

  const handleSavePersonalInfo = (data: PersonalInfo) => {
    console.log('Saving personal info:', data); // Debug log
    setUser(prev => (prev ? { ...prev, ...data, status: data.jobStatus ?? prev.status } as UserProfile : prev));
    // Persist to backend and refresh
    profileAPI.updateMyProfile({
      firstName: data.firstName,
      lastName: data.lastName,
      bio: data.bio,
      jobStatus: data.jobStatus ? (data.jobStatus === 'JOB_SEEKER' ? 'unemployed' : data.jobStatus === 'EMPLOYED' ? 'employed' : 'self_employed') : undefined,
      phone: data.phone,
    }).then(async (response) => {
      console.log('Personal info update response:', response); // Debug log
      const me = await profileAPI.getMyProfile();
      console.log('Refreshed profile data:', me); // Debug log
      setUser(prev => (prev ? { 
        ...prev, 
        firstName: me.firstName || '', 
        lastName: me.lastName || '', 
        bio: me.bio || '', 
        status: me.status || prev.status, 
        profilePicture: toAbsolute(me.profilePictureUrl || '') 
      } as UserProfile : prev));
    }).catch((error) => {
      console.error('Error saving personal info:', error); // Debug log
    });
    setIsPersonalInfoModalOpen(false);
  };

  const handleSaveLocation = (locationData: LocationData) => {
    console.log('Saving location data:', locationData); // Debug log
    setUser(prev => (prev ? { ...prev, location: locationData } as UserProfile : prev));
    profileAPI.updateMyProfile({
      address: locationData.address,
      city: locationData.city,
      country: locationData.country,
      postalCode: locationData.postalCode,
      district: locationData.region,
    }).then(async (response) => {
      console.log('Location update response:', response); // Debug log
      // Refresh profile to get updated data
      const me = await profileAPI.getMyProfile();
      console.log('Refreshed profile data after location update:', me); // Debug log
      setUser(prev => (prev ? { 
        ...prev, 
        location: {
          address: me.address || '',
          city: me.city || '',
          country: me.country || '',
          postalCode: me.postalCode || '',
          region: me.district || ''
        }
      } as UserProfile : prev));
    }).catch((error) => {
      console.error('Error saving location:', error); // Debug log
    });
    setIsLocationModalOpen(false);
  };

  const handleSaveSkills = async (skills: string[]) => {
    console.log('Saving skills:', skills); // Debug log
    setIsSkillsSaving(true);
    try {
      // Fetch current skill links to compute deletions
      const current = await profileAPI.getMySkills(); // [{ skill: { id, name }, ... }]
      console.log('Current skills from API:', current); // Debug log
      const currentMap = new Map<string, string>(); // nameLower -> id
      current.forEach((ps: any) => {
        if (ps?.skill?.name && ps?.skillId) currentMap.set(String(ps.skill.name).toLowerCase(), String(ps.skillId));
      });

      // Resolve desired names to IDs (best-effort by exact name match)
      const desiredNames = new Set(skills.map(s => s.trim()).filter(Boolean));
      const desiredIds: string[] = [];
      for (const name of desiredNames) {
        const cached = currentMap.get(name.toLowerCase());
        if (cached) {
          desiredIds.push(cached);
          continue;
        }
        const results = await profileAPI.searchSkills(name);
        const exact = results.find(r => r.name?.toLowerCase() === name.toLowerCase());
        if (exact) desiredIds.push(exact.id);
      }

      console.log('Desired skill IDs:', desiredIds); // Debug log

      // Upsert desired
      await Promise.all(desiredIds.map(id => profileAPI.upsertSkill({ skillId: id, level: 'beginner' })));

      // Delete removed
      const desiredIdSet = new Set(desiredIds);
      const toDelete = current.filter((ps: any) => ps?.skillId && !desiredIdSet.has(ps.skillId)).map((ps: any) => ps.skillId as string);
      console.log('Skills to delete:', toDelete); // Debug log
      await Promise.all(toDelete.map(id => profileAPI.deleteSkill(id)));

      // Refresh profile
      const me = await profileAPI.getMyProfile();
      console.log('Refreshed profile data after skills update:', me); // Debug log
      setUser(prev => (prev ? { ...prev, skills: (me.skills || []).map((ps: any) => ps.skill?.name).filter(Boolean) } as UserProfile : prev));
      
      // Close modal only after successful save
      setIsSkillsModalOpen(false);
    } catch (error) {
      console.error('Error saving skills:', error);
    } finally {
      setIsSkillsSaving(false);
    }
  };

  const handleSaveExperience = (experience: Experience) => {
    console.log('Saving experience:', experience); // Debug log
    setUser(prev => {
      if (!prev) return prev;
      if (experience.id) {
        return { ...prev, experience: prev.experience.map(exp => exp.id === experience.id ? experience : exp) } as UserProfile;
      }
      return { ...prev, experience: [...prev.experience, { ...experience, id: Date.now().toString() }] } as UserProfile;
    });
    // Persist
    if (experience.id) {
      profileAPI.updateExperience(experience.id, {
        employerName: experience.employerName,
        role: experience.role,
        startDate: experience.startDate || undefined,
        endDate: experience.endDate || undefined,
        description: experience.description,
        isCurrent: experience.isCurrent,
      }).then(async (response) => {
        console.log('Experience update response:', response); // Debug log
        const me = await profileAPI.getMyProfile();
        console.log('Refreshed profile data after experience update:', me); // Debug log
        setUser(prev => (prev ? { ...prev, experience: (me.experiences || []).map((exp: any) => ({ 
          id: exp.id, 
          employerName: exp.employerName, 
          role: exp.role, 
          startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '', 
          endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '', 
          isCurrent: exp.isCurrent, 
          description: exp.description || '' 
        })) } as UserProfile : prev));
      }).catch((error) => {
        console.error('Error updating experience:', error); // Debug log
      });
    } else {
      profileAPI.addExperience({
        employerName: experience.employerName,
        role: experience.role,
        startDate: experience.startDate || undefined,
        endDate: experience.endDate || undefined,
        description: experience.description,
        isCurrent: experience.isCurrent,
      }).then(async (response) => {
        console.log('Experience add response:', response); // Debug log
        const me = await profileAPI.getMyProfile();
        console.log('Refreshed profile data after experience add:', me); // Debug log
        setUser(prev => (prev ? { ...prev, experience: (me.experiences || []).map((exp: any) => ({ 
          id: exp.id, 
          employerName: exp.employerName, 
          role: exp.role, 
          startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '', 
          endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '', 
          isCurrent: exp.isCurrent, 
          description: exp.description || '' 
        })) } as UserProfile : prev));
      }).catch((error) => {
        console.error('Error adding experience:', error); // Debug log
      });
    }
    setIsExperienceModalOpen(false);
    setEditingExperience(null);
  };

  const handleAddEducation = () => {
    setEditingEducation(null);
    setIsEducationModalOpen(true);
  };

  const handleEditEducation = (education: Education) => {
    setEditingEducation(education);
    setIsEducationModalOpen(true);
  };

  const handleSaveEducation = (educationData: Omit<Education, 'id'>) => {
    console.log('Saving education data:', educationData); // Debug log
    if (editingEducation) {
      setUser(prev => (prev ? { ...prev, education: prev.education.map(edu => edu.id === editingEducation.id ? { ...educationData, id: editingEducation.id } : edu) } as UserProfile : prev));
      profileAPI.updateEducation(editingEducation.id!, {
        school: educationData.institution,
        degree: educationData.degree,
        fieldOfStudy: educationData.fieldOfStudy,
        startDate: educationData.startDate,
        endDate: educationData.endDate,
      }).then(async (response) => {
        console.log('Education update response:', response); // Debug log
        const me = await profileAPI.getMyProfile();
        console.log('Refreshed profile data after education update:', me); // Debug log
        setUser(prev => (prev ? { ...prev, education: (me.educations || []).map((ed: any) => ({ 
          id: ed.id, 
          degree: ed.degree || '', 
          institution: ed.school || '', 
          fieldOfStudy: ed.fieldOfStudy || '', 
          startDate: ed.startDate ? new Date(ed.startDate).toISOString().split('T')[0] : '', 
          endDate: ed.endDate ? new Date(ed.endDate).toISOString().split('T')[0] : '', 
          description: '' 
        })) } as UserProfile : prev));
      }).catch((error) => {
        console.error('Error updating education:', error); // Debug log
      });
    } else {
      setUser(prev => (prev ? { ...prev, education: [...prev.education, { ...educationData, id: Date.now().toString() }] } as UserProfile : prev));
      profileAPI.addEducation({
        school: educationData.institution,
        degree: educationData.degree,
        fieldOfStudy: educationData.fieldOfStudy,
        startDate: educationData.startDate,
        endDate: educationData.endDate,
      }).then(async (response) => {
        console.log('Education add response:', response); // Debug log
        const me = await profileAPI.getMyProfile();
        console.log('Refreshed profile data after education add:', me); // Debug log
        setUser(prev => (prev ? { ...prev, education: (me.educations || []).map((ed: any) => ({ 
          id: ed.id, 
          degree: ed.degree || '', 
          institution: ed.school || '', 
          fieldOfStudy: ed.fieldOfStudy || '', 
          startDate: ed.startDate ? new Date(ed.startDate).toISOString().split('T')[0] : '', 
          endDate: ed.endDate ? new Date(ed.endDate).toISOString().split('T')[0] : '', 
          description: '' 
        })) } as UserProfile : prev));
      }).catch((error) => {
        console.error('Error adding education:', error); // Debug log
      });
    }
    setIsEducationModalOpen(false);
  };

  const handleDeleteEducation = (id: string) => {
    setUser(prev => (prev ? { ...prev, education: prev!.education.filter(edu => edu.id !== id) } as UserProfile : prev));
    profileAPI.deleteEducation(id).then(async () => {
      // Refresh profile to get updated data
      const me = await profileAPI.getMyProfile();
      setUser(prev => (prev ? { ...prev, education: (me.educations || []).map((ed: any) => ({ 
        id: ed.id, 
        degree: ed.degree || '', 
        institution: ed.school || '', 
        fieldOfStudy: ed.fieldOfStudy || '', 
        startDate: ed.startDate ? new Date(ed.startDate).toISOString().split('T')[0] : '', 
        endDate: ed.endDate ? new Date(ed.endDate).toISOString().split('T')[0] : '', 
        description: '' 
      })) } as UserProfile : prev));
    }).catch(() => {/* ignore */});
  };

  const handleDeleteExperience = (id: string) => {
    setUser(prev => (prev ? { ...prev, experience: prev!.experience.filter(exp => exp.id !== id) } as UserProfile : prev));
    profileAPI.deleteExperience(id).then(async () => {
      // Refresh profile to get updated data
      const me = await profileAPI.getMyProfile();
      setUser(prev => (prev ? { ...prev, experience: (me.experiences || []).map((exp: any) => ({ 
        id: exp.id, 
        employerName: exp.employerName, 
        role: exp.role, 
        startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '', 
        endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '', 
        isCurrent: exp.isCurrent, 
        description: exp.description || '' 
      })) } as UserProfile : prev));
    }).catch(() => {/* ignore */});
  };

  const [cvFileName, setCvFileName] = useState<string>('');

  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('CV file selected:', file); // Debug log
      setCvFileName(file.name);
      // upload to backend
      profileAPI.uploadCv(file).then(async ({ fileUrl }) => {
        console.log('CV upload response:', { fileUrl }); // Debug log
        // Refresh profile to get updated data
        const me = await profileAPI.getMyProfile();
        console.log('Refreshed profile data after CV upload:', me); // Debug log
        setUser(prev => (prev ? { ...prev, cvUrl: toAbsolute(me.cvUrl || '') } as UserProfile : prev));
      }).catch((error) => {
        console.error('Error uploading CV:', error); // Debug log
      });
    }
  };

  const handleViewCV = () => {
    if (user && user.cvUrl) {
      window.open(user.cvUrl, '_blank');
    }
  };

  const handleDownloadCV = () => {
    if (user && user.cvUrl) {
      const link = document.createElement('a');
      link.href = user.cvUrl;
      link.download = cvFileName || 'my-cv.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loadingProfile || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress percentage={60} size={80} progressColor="#4F46E5" textColor="#4F56E5" showText={false} />
      </div>
    );
  }

  const profileCompletion = calculateProfileCompletion(user);

  return (
    <div>
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="absolute  right-9">
        <div className="relative">
          <CircularProgress 
            percentage={profileCompletion} 
            size={80}
            progressColor="#4F46E5"
            textColor="#4F56E5"
            showText={true}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-600">
            
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">My Profile</h1>
        
        {/* Personal Information Card */}
        <ProfileCard 
          title="Personal Information" 
          onEdit={() => setIsPersonalInfoModalOpen(true)}
          className="mb-6"
        >
          <div className="space-y-4">
            <div className="flex flex-col items-center mb-4">
              <div className="relative group">
                <img
                  className="h-24 w-24 rounded-full object-cover"
                  src={user.profilePicture || ''}
                  alt={`${user.firstName} ${user.lastName}`}
                />
                <label 
                  className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  htmlFor="profile-picture-upload"
                >
                  <PencilIcon className="h-6 w-6 text-white" />
                </label>
                <input
                  id="profile-picture-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
              </div>
              <h3 className="mt-2 text-lg font-medium">{user.status === 'EMPLOYED' ? 'Employed' : user.status === 'FREELANCER' ? 'Freelancer' : 'Job Seeker'}</h3>
            </div>
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 text-gray-500 mr-3" />
              <span>{user.firstName} {user.lastName}</span>
            </div>
            <InfoItem icon={EnvelopeIcon} label="Email" value={user.email} />
            <InfoItem icon={PhoneIcon} label="Phone" value={user.phone} />
            {user.bio && <p className="text-sm text-gray-600 mt-2">{user.bio}</p>}
          </div>
        </ProfileCard>

        {/* Location Card */}
        <ProfileCard 
          title="Location Details" 
          onEdit={() => setIsLocationModalOpen(true)}
          className="mb-6"
        >
          <div className="space-y-2">
            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5 text-gray-500 mr-3" />
              <div>
                {user.location.address || user.location.city || user.location.country ? (
                  <>
                    <p className="font-medium">{user.location.address}</p>
                    <p className="text-sm text-gray-600">{user.location.city}{user.location.region ? `, ${user.location.region}` : ''}</p>
                    <p className="text-sm text-gray-600">{user.location.country}{user.location.postalCode ? ` - ${user.location.postalCode}` : ''}</p>
                  </>
                ) : (
                  <p className="text-gray-500">No location records found.</p>
                )}
              </div>
            </div>
          </div>
        </ProfileCard>

        {/* Skills Card */}
        <ProfileCard 
          title={
            <div className="flex items-center">
              <BriefcaseIcon className="h-5 w-5 mr-2" />
              Skills
            </div>
          }
          onEdit={() => setIsSkillsModalOpen(true)}
          className="mb-6"
        >
          {user.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No skills found.</p>
          )}
        </ProfileCard>

        {/* Experience Card */}
        <ProfileCard 
          title="Experience" 
          onEdit={() => {
            setEditingExperience({
              id: '',
              employerName: '',
              role: '',
              startDate: '',
              endDate: '',
              isCurrent: false,
              description: ''
            });
            setIsExperienceModalOpen(true);
          }}
          className="mb-6"
        >
          {user.experience.length > 0 ? (
            user.experience.map((exp, _index) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{exp.role}</h4>
                    <p className="text-sm text-gray-600">{exp.employerName}</p>
                    <p className="text-xs text-gray-500">
                      {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : ''} - {exp.isCurrent ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString() : '')}
                    </p>
                    {exp.description && <p className="mt-1 text-sm text-gray-700">{exp.description}</p>}
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setEditingExperience(exp);
                        setIsExperienceModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                      aria-label="Edit experience"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteExperience(exp.id!)}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Delete experience"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No experience records found.</p>
          )}
        </ProfileCard>

        {/* Education Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <AcademicCapIcon className="h-5 w-5 mr-2" />
              Education
            </h2>
            <button 
              onClick={handleAddEducation}
              className="text-blue-600 hover:text-blue-800"
              aria-label="Add education"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          {user.education.length > 0 ? (
            <div className="space-y-4">
              {user.education.map((edu) => (
                <div key={edu.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{edu.degree} in {edu.fieldOfStudy}</h3>
                      <p className="text-gray-600">{edu.institution}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                      </p>
                      {edu.description && <p className="mt-1 text-sm text-gray-700">{edu.description}</p>}
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditEducation(edu)}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label="Edit education"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDeleteEducation(edu.id!)}
                        className="text-red-600 hover:text-red-800"
                        aria-label="Delete education"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No education added yet. Click the + button to add your education.</p>
          )}
        </div>
      </div>
      
      {/* CV Upload */}
      <ProfileCard 
        title="CV / Resume" 
        className="mb-6"
        onEdit={() => {}} // Required prop
      >
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2 justify-center">
                <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  {user.cvUrl ? 'Update CV' : 'Upload CV'}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx" 
                    onChange={handleCVUpload}
                  />
                </label>
                {user.cvUrl && (
                  <>
                    <button 
                      onClick={handleViewCV}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    <button 
                      onClick={handleDownloadCV}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                  </>
                )}
              </div>
              {user.cvUrl && (
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 mr-1 text-green-600" />
                  <span>CV Uploaded: {cvFileName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </ProfileCard>
    </div>

    {/* Personal Info Modal */}
    {isPersonalInfoModalOpen && (
      <PersonalInfoModal
        isOpen={isPersonalInfoModalOpen}
        onClose={() => setIsPersonalInfoModalOpen(false)}
        onSave={handleSavePersonalInfo}
        info={{
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          bio: user.bio
        }}
        isSaving={false}
      />
    )}

    {/* Location Modal */}
    {isLocationModalOpen && (
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSave={handleSaveLocation}
        location={user.location}
        isSaving={false}
      />
    )}

    {/* Skills Modal */}
    {isSkillsModalOpen && (
      <SkillsModal
          isOpen={isSkillsModalOpen}
          onClose={() => setIsSkillsModalOpen(false)}
          onSave={handleSaveSkills}
          skills={user.skills} 
          isSaving={isSkillsSaving}
      />
    )}

    {/* Experience Modal */}
    {isExperienceModalOpen && (
      <ExperienceModal
        isOpen={isExperienceModalOpen}
        onClose={() => {
          setIsExperienceModalOpen(false);
          setEditingExperience(null);
        }}
        onSave={handleSaveExperience}
        experience={editingExperience}
        isSaving={false}
      />
    )}

    {/* Education Modal */}
    <EducationModal
      isOpen={isEducationModalOpen}
      onClose={() => setIsEducationModalOpen(false)}
      onSave={handleSaveEducation}
      initialData={editingEducation || undefined}
    />
  </div>
);
};
export default ProfilePage;