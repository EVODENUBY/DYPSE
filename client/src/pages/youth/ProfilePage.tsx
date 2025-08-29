import React, { useEffect, useState } from 'react';
import { 
  UserIcon, EnvelopeIcon, PhoneIcon, 
  MapPinIcon, DocumentTextIcon, PencilIcon,
  BriefcaseIcon, AcademicCapIcon, CheckCircleIcon
} from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import CircularProgress from '../../components/CircularProgress';
import ProfileCard from '../../components/ProfileCard';
import InfoItem from '../../components/InfoItem';
import PersonalInfoModal  from '../../components/modals/PersonalInfoModal';
import LocationModal from '../../components/modals/LocationModal';
import SkillsModal from '../../components/modals/SkillsModal';
import ExperienceModal from '../../components/modals/ExperienceModal';
import EducationModal from '../../components/modals/EducationModal';
import { useAuth } from '@/contexts/AuthContext';
import { profileAPI } from '../../lib/profileApi';
import { authAPI, API_BASE_URL } from '../../lib/api';

// Authenticated Image Component
const AuthenticatedImage = ({ src, alt, className, fallbackSrc }: { src: string | null, alt: string, className: string, fallbackSrc?: string }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setImageSrc(fallbackSrc || null);
      setLoading(false);
      return;
    }

    const loadAuthenticatedImage = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // If it's not an upload path, load directly
        if (!src.includes('/uploads/')) {
          setImageSrc(src);
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('token');
        const response = await fetch(src, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.ok) {
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          setImageSrc(objectUrl);
        } else {
          console.error('Failed to load authenticated image:', response.statusText);
          setImageSrc(fallbackSrc || null);
          setError(true);
        }
      } catch (error) {
        console.error('Error loading authenticated image:', error);
        setImageSrc(fallbackSrc || null);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadAuthenticatedImage();

    // Cleanup function to revoke object URL
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [src, fallbackSrc]);

  if (loading) {
    return (
      <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>
        <div className="text-gray-400 text-xs">Loading...</div>
      </div>
    );
  }

  if (error || !imageSrc) {
    return (
      <div className={`${className} bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl`}>
        {alt.split(' ').map(name => name[0]).join('').toUpperCase()}
      </div>
    );
  }

  return <img className={className} src={imageSrc} alt={alt} />;
};

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



const ProfilePage = () => {
  const [isPersonalInfoModalOpen, setIsPersonalInfoModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [isSkillsSaving, setIsSkillsSaving] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);

  const { user: authUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [rawProfileData, setRawProfileData] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);

  const uploadsBase = API_BASE_URL.replace(/\/api\/?$/, '');
  const toAbsolute = (p: string | null): string | null => {
    if (!p) return null;
    return p.startsWith('/uploads/') ? `${uploadsBase}${p}` : p;
  };

  useEffect(() => {
    // Don't start loading profile data until auth is complete
    if (authLoading) return;
    
    let mounted = true;
    (async () => {
      try {
        const me = await profileAPI.getMyProfile();
        console.log('Profile data received:', me); // Debug log
        if (!mounted) return;
        
        if (!me) {
          // Create default profile from auth user data
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
          // Store raw profile data for profile completion
          setRawProfileData(me);
          
          // Use profile data with auth user fallback
          const userData = {
            firstName: me.firstName || authUser?.firstName || '',
            lastName: me.lastName || authUser?.lastName || '',
            email: authUser?.email || '',
            phone: me.phoneNumber || authUser?.phone || '',
            location: { 
              address: me.address || '', 
              city: me.city || '', 
              country: me.country || '', 
              postalCode: me.postalCode || '', 
              region: me.district || '' 
            },
            bio: me.bio || '',
            status: (me.jobStatus === 'unemployed' ? 'JOB_SEEKER' : 
                   me.jobStatus === 'employed' ? 'EMPLOYED' : 
                   me.jobStatus === 'self_employed' ? 'FREELANCER' : 'JOB_SEEKER') as 'JOB_SEEKER' | 'EMPLOYED' | 'FREELANCER',
            skills: [], // Will load skills separately
            experience: (me.experience || []).map((exp: any) => ({
              id: exp._id,
              employerName: exp.company,
              role: exp.title,
              startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
              endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
              isCurrent: exp.isCurrent || false,
              description: exp.description || '',
            })),
            education: (me.education || []).map((ed: any) => ({
              id: ed._id,
              degree: ed.degree || '',
              institution: ed.institution || '',
              fieldOfStudy: ed.fieldOfStudy || '',
              startDate: ed.startDate ? new Date(ed.startDate).toISOString().split('T')[0] : '',
              endDate: ed.endDate ? new Date(ed.endDate).toISOString().split('T')[0] : '',
              description: '',
            })),
            profilePicture: toAbsolute(me.profilePicture || null),
            cvUrl: toAbsolute(me.cvUrl || null),
          };
          
          // Load skills separately since they're handled differently
          try {
            const skills = await profileAPI.getMySkills();
            userData.skills = skills.map((skill: any) => skill.skill?.name || skill.skillId?.name).filter(Boolean);
          } catch (error) {
            console.error('Error loading skills:', error);
          }
          console.log('Setting user data:', userData); // Debug log
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        // Even if profile fails, create a user from auth data so page doesn't stay loading
        if (mounted && authUser) {
          setUser({
            firstName: authUser.firstName || '',
            lastName: authUser.lastName || '',
            email: authUser.email || '',
            phone: authUser.phone || '',
            location: { address: '', city: '', country: '', postalCode: '', region: '' },
            bio: '',
            status: 'JOB_SEEKER',
            skills: [],
            experience: [],
            education: [],
            profilePicture: null,
            cvUrl: null,
          });
        }
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    })();
    return () => { mounted = false; };
  }, [authLoading, authUser]);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Profile picture file selected:', file); // Debug log
      
      // Create a preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      setUser(prev => (prev ? { ...prev, profilePicture: previewUrl } as UserProfile : prev));
      
      // Upload to backend
      profileAPI.uploadProfilePicture(file).then(async (response) => {
        console.log('Profile picture upload response:', response); // Debug log
        
        // Clean up preview URL
        URL.revokeObjectURL(previewUrl);
        
        // Refresh profile to get updated data and refresh auth context
        const me = await profileAPI.getMyProfile();
        console.log('Refreshed profile data after picture upload:', me); // Debug log
        
        // Update with actual uploaded image URL
        setUser(prev => (prev ? { ...prev, profilePicture: toAbsolute(me.profilePicture || null) } as UserProfile : prev));
        
        // Refresh auth context by calling auth API
        try {
          await authAPI.getCurrentUser(); // This will refresh the auth context
        } catch (error) {
          console.error('Error refreshing auth context:', error);
        }
      }).catch((error) => {
        console.error('Error uploading profile picture:', error); // Debug log
        // Revert to previous state on error
        URL.revokeObjectURL(previewUrl);
        setUser(prev => (prev ? { ...prev, profilePicture: toAbsolute(null) } as UserProfile : prev));
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
      phoneNumber: data.phone, // Correct field name for backend
    }).then(async (response) => {
      console.log('Personal info update response:', response); // Debug log
      
      // Refresh profile data
      const me = await profileAPI.getMyProfile();
      console.log('Refreshed profile data:', me); // Debug log
      
      // Update local state
      setUser(prev => (prev ? { 
        ...prev, 
        firstName: me.firstName || '', 
        lastName: me.lastName || '', 
        phone: me.phoneNumber || '',
        bio: me.bio || '', 
        status: me.jobStatus === 'unemployed' ? 'JOB_SEEKER' : 
               me.jobStatus === 'employed' ? 'EMPLOYED' : 
               me.jobStatus === 'self_employed' ? 'FREELANCER' : prev.status,
        profilePicture: toAbsolute(me.profilePicture || null) 
      } as UserProfile : prev));
      
      // Refresh auth context to update global user data
      try {
        await authAPI.getCurrentUser();
      } catch (error) {
        console.error('Error refreshing auth context:', error);
      }
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
    console.log('🚀 ProfilePage: handleSaveSkills called with:', skills);
    
    if (!skills || skills.length === 0) {
      console.log('⚠️ No skills provided, closing modal');
      setIsSkillsModalOpen(false);
      return;
    }
    
    setIsSkillsSaving(true);
    
    try {
      console.log('📡 Step 1: Fetching current skills from database...');
      const currentSkills = await profileAPI.getMySkills();
      console.log('📊 Current skills in database:', currentSkills);
      
      console.log('🔍 Step 2: Processing each skill to find/create IDs...');
      const skillsToSave: {id: string, name: string}[] = [];
      
      for (const skillName of skills) {
        const trimmedName = skillName.trim();
        if (!trimmedName) continue;
        
        console.log(`🔎 Processing skill: "${trimmedName}"`);
        
        // Check if we already have this skill
        const existingSkill = currentSkills.find(
          (cs: any) => cs.skill?.name?.toLowerCase() === trimmedName.toLowerCase()
        );
        
        if (existingSkill) {
          console.log(`✅ Found existing skill: ${trimmedName} (ID: ${existingSkill.skillId})`);
          skillsToSave.push({ id: existingSkill.skillId, name: existingSkill.skill.name });
        } else {
          // Search for the skill in the database (case-insensitive)
          console.log(`🔍 Searching for skill: "${trimmedName}"`);
          try {
            const searchResults = await profileAPI.searchSkills(trimmedName.toLowerCase());
            console.log(`📋 Search results for "${trimmedName}":`, searchResults);
            
            const exactMatch = searchResults.find(
              (s: any) => s.name?.toLowerCase() === trimmedName.toLowerCase()
            );
            
            if (exactMatch) {
              console.log(`✅ Found exact match: ${trimmedName} (ID: ${exactMatch._id || exactMatch.id})`);
              skillsToSave.push({ id: exactMatch._id || exactMatch.id, name: exactMatch.name });
            } else {
              console.log(`⚠️ No exact match found for: "${trimmedName}". Creating new skill...`);
              // If no match found, create a new skill
              try {
                const newSkill = await profileAPI.createSkill({
                  name: trimmedName.toLowerCase(),
                  category: 'Custom',
                  description: `User-created skill: ${trimmedName}`
                });
                console.log(`✨ Created new skill: ${trimmedName} (ID: ${newSkill._id || newSkill.id})`);
                skillsToSave.push({ id: newSkill._id || newSkill.id, name: newSkill.name });
              } catch (createError) {
                console.error(`❌ Error creating skill "${trimmedName}":`, createError);
              }
            }
          } catch (searchError) {
            console.error(`❌ Search error for skill "${trimmedName}":`, searchError);
          }
        }
      }
      
      console.log('🎯 Skills to save:', skillsToSave);
      
      // Delete skills that are no longer selected
      console.log('🗑️ Step 3: Removing unselected skills...');
      const skillIdsToKeep = new Set(skillsToSave.map(s => s.id));
      const skillsToDelete = currentSkills.filter(
        (cs: any) => cs.skillId && !skillIdsToKeep.has(cs.skillId)
      );
      
      console.log('🗑️ Skills to delete:', skillsToDelete);
      
      for (const skillToDelete of skillsToDelete) {
        try {
          console.log(`🗑️ Deleting skill: ${skillToDelete.skill?.name} (ID: ${skillToDelete.skillId})`);
          await profileAPI.deleteSkill(skillToDelete.skillId);
          console.log(`✅ Successfully deleted skill: ${skillToDelete.skillId}`);
        } catch (deleteError) {
          console.error(`❌ Error deleting skill ${skillToDelete.skillId}:`, deleteError);
        }
      }
      
      // Add/update the selected skills
      console.log('💾 Step 4: Adding/updating selected skills...');
      for (const skill of skillsToSave) {
        try {
          console.log(`💾 Upserting skill: ${skill.name} (ID: ${skill.id})`);
          const result = await profileAPI.upsertSkill({ 
            skillId: skill.id, 
            level: 'beginner' 
          });
          console.log(`✅ Successfully upserted skill: ${skill.name}`, result);
        } catch (upsertError) {
          console.error(`❌ Error upserting skill ${skill.name}:`, upsertError);
        }
      }
      
      console.log('🔄 Step 5: Refreshing skills list...');
      // Get fresh skills data
      const updatedSkills = await profileAPI.getMySkills();
      console.log('📊 Updated skills from database:', updatedSkills);
      
      // Extract skill names for UI display
      const skillNames = updatedSkills
        .map((skill: any) => skill.skill?.name || skill.skillId?.name)
        .filter(Boolean);
      
      console.log('📝 Skill names for UI:', skillNames);
      
      // Update user state
      setUser(prev => (prev ? { ...prev, skills: skillNames } as UserProfile : prev));
      console.log('✅ Updated local user state');
      
      console.log('🎉 Skills saved successfully! Closing modal.');
      setIsSkillsModalOpen(false);
      
    } catch (error) {
      console.error('❌ Fatal error saving skills:', error);
      alert('Error saving skills: ' + (error as Error).message);
    } finally {
      console.log('✅ Setting saving state to false');
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
        setUser(prev => (prev ? { ...prev, experience: (me.experience || []).map((exp: any) => ({ 
          id: exp._id, 
          employerName: exp.company, 
          role: exp.title, 
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
        setUser(prev => (prev ? { ...prev, experience: (me.experience || []).map((exp: any) => ({ 
          id: exp._id, 
          employerName: exp.company, 
          role: exp.title, 
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
        setUser(prev => (prev ? { ...prev, education: (me.education || []).map((ed: any) => ({ 
          id: ed._id, 
          degree: ed.degree || '', 
          institution: ed.institution || '', 
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
        setUser(prev => (prev ? { ...prev, education: (me.education || []).map((ed: any) => ({ 
          id: ed._id, 
          degree: ed.degree || '', 
          institution: ed.institution || '', 
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
      setUser(prev => (prev ? { ...prev, education: (me.education || []).map((ed: any) => ({ 
        id: ed._id, 
        degree: ed.degree || '', 
        institution: ed.institution || '', 
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
      setUser(prev => (prev ? { ...prev, experience: (me.experience || []).map((exp: any) => ({ 
        id: exp._id, 
        employerName: exp.company, 
        role: exp.title, 
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

  const handleViewCV = async () => {
    if (user && user.cvUrl) {
      try {
        // Use fetch with auth headers for authenticated access
        const token = localStorage.getItem('token');
        const response = await fetch(user.cvUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
          // Clean up the object URL after a delay to allow viewing
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        } else {
          console.error('Failed to fetch CV:', response.statusText);
          // Fallback: try direct URL opening
          window.open(user.cvUrl, '_blank');
        }
      } catch (error) {
        console.error('Error viewing CV:', error);
        // Fallback: try direct URL opening
        window.open(user.cvUrl, '_blank');
      }
    }
  };

  const handleDownloadCV = async () => {
    if (user && user.cvUrl) {
      try {
        // Use fetch with auth headers for authenticated access
        const token = localStorage.getItem('token');
        const response = await fetch(user.cvUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = url;
          link.download = cvFileName || 'my-cv.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up the object URL
          URL.revokeObjectURL(url);
        } else {
          console.error('Failed to download CV:', response.statusText);
          // Fallback: try direct download
          const link = document.createElement('a');
          link.href = user.cvUrl;
          link.download = cvFileName || 'my-cv.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (error) {
        console.error('Error downloading CV:', error);
        // Fallback: try direct download
        const link = document.createElement('a');
        link.href = user.cvUrl;
        link.download = cvFileName || 'my-cv.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  // Show loading while auth is loading or profile is loading
  if (authLoading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" className="text-indigo-600" />
        <span className="ml-2 text-indigo-600 font-medium">Loading profile...</span>
      </div>
    );
  }

  // If no user after loading is complete, there's an error
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Unable to load profile</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Get profile completion from backend data (consistent with dashboard)
  const profileCompletion = rawProfileData?.profileCompletion || 0;

  return (
    <div className="relative">
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Profile Completion Indicator - Fixed Position */}
      <div className="fixed top-20 right-6 z-10">
        <div className="bg-white rounded-full shadow-lg p-2">
          <CircularProgress 
            percentage={profileCompletion} 
            size={80}
            progressColor="#4F46E5"
            textColor="#4F46E5"
            showText={true}
          />
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
                <AuthenticatedImage
                  className="h-24 w-24 rounded-full object-cover"
                  src={user.profilePicture}
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
          bio: user.bio,
          jobStatus: user.status
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