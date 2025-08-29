import { FiUser, FiBriefcase, FiBook, FiUpload, FiPlus, FiMinus, FiEdit, FiTrash2, FiActivity, FiCheckCircle } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { UserActivity } from '@/lib/activitiesApi';

export interface FormattedActivity {
  id: string;
  text: string;
  time: string;
  icon: JSX.Element;
  activityType: string;
  metadata?: Record<string, any>;
}

// Activity type icons mapping
const getActivityIcon = (activityType: string): JSX.Element => {
  switch (activityType) {
    case 'profile_update':
      return <FiUser className="text-blue-500" />;
    case 'profile_picture_upload':
      return <FiUser className="text-blue-600" />;
    case 'cv_upload':
      return <FiUpload className="text-purple-500" />;
    case 'skill_add':
      return <FiPlus className="text-green-500" />;
    case 'skill_remove':
      return <FiMinus className="text-red-500" />;
    case 'experience_add':
      return <FiBriefcase className="text-blue-500" />;
    case 'experience_update':
      return <FiEdit className="text-yellow-500" />;
    case 'experience_delete':
      return <FiTrash2 className="text-red-500" />;
    case 'education_add':
      return <FiBook className="text-green-500" />;
    case 'education_update':
      return <FiBook className="text-yellow-500" />;
    case 'education_delete':
      return <FiBook className="text-red-500" />;
    case 'account_created':
      return <FiCheckCircle className="text-green-600" />;
    case 'job_application':
      return <FiBriefcase className="text-blue-600" />;
    case 'job_bookmark':
      return <FiBriefcase className="text-yellow-600" />;
    case 'training_enrollment':
      return <FiBook className="text-purple-600" />;
    case 'profile_view':
      return <FiUser className="text-gray-500" />;
    case 'login':
      return <FiActivity className="text-gray-500" />;
    default:
      return <FiActivity className="text-gray-500" />;
  }
};

// Format activity text with better descriptions
const formatActivityText = (activity: UserActivity): string => {
  const { activityType, title, description, metadata } = activity;
  
  // Use custom description if available, otherwise use title
  if (description && description.trim()) {
    return description;
  }
  
  // Fallback to title
  if (title && title.trim()) {
    return title;
  }
  
  // Generate description based on activity type and metadata
  switch (activityType) {
    case 'profile_update':
      if (metadata?.changes && Array.isArray(metadata.changes)) {
        const changes = metadata.changes.join(', ');
        return `Updated profile: ${changes}`;
      }
      return 'Updated profile information';
      
    case 'profile_picture_upload':
      return 'Uploaded a new profile picture';
      
    case 'cv_upload':
      return 'Uploaded CV/Resume document';
      
    case 'skill_add':
      const skillName = metadata?.skillName || 'a skill';
      const level = metadata?.level;
      return `Added skill: ${skillName}${level ? ` (${level})` : ''}`;
      
    case 'skill_remove':
      return `Removed skill: ${metadata?.skillName || 'a skill'}`;
      
    case 'experience_add':
      const company = metadata?.company;
      const role = metadata?.role;
      if (company && role) {
        return `Added experience: ${role} at ${company}`;
      }
      return 'Added work experience';
      
    case 'experience_update':
      const updatedCompany = metadata?.company;
      const updatedRole = metadata?.role;
      if (updatedCompany && updatedRole) {
        return `Updated experience: ${updatedRole} at ${updatedCompany}`;
      }
      return 'Updated work experience';
      
    case 'experience_delete':
      const deletedCompany = metadata?.company;
      const deletedRole = metadata?.role;
      if (deletedCompany && deletedRole) {
        return `Removed experience: ${deletedRole} at ${deletedCompany}`;
      }
      return 'Removed work experience';
      
    case 'education_add':
      const institution = metadata?.institution;
      const degree = metadata?.degree;
      if (institution && degree) {
        return `Added education: ${degree} at ${institution}`;
      }
      return 'Added education';
      
    case 'education_update':
      const updatedInstitution = metadata?.institution;
      const updatedDegree = metadata?.degree;
      if (updatedInstitution && updatedDegree) {
        return `Updated education: ${updatedDegree} at ${updatedInstitution}`;
      }
      return 'Updated education';
      
    case 'education_delete':
      const deletedInstitution = metadata?.institution;
      const deletedDegree = metadata?.degree;
      if (deletedInstitution && deletedDegree) {
        return `Removed education: ${deletedDegree} at ${deletedInstitution}`;
      }
      return 'Removed education';
      
    case 'account_created':
      return 'Welcome to DYPSE! Your account has been created';
      
    case 'job_application':
      return 'Applied for a job position';
      
    case 'job_bookmark':
      return 'Bookmarked a job';
      
    case 'training_enrollment':
      return 'Enrolled in training program';
      
    case 'profile_view':
      return 'Profile was viewed';
      
    case 'login':
      return 'Logged into account';
      
    default:
      return 'Activity recorded';
  }
};

// Convert UserActivity[] to FormattedActivity[]
export const formatActivitiesForDisplay = (activities: UserActivity[]): FormattedActivity[] => {
  return activities.map(activity => ({
    id: activity.id,
    text: formatActivityText(activity),
    time: formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true }),
    icon: getActivityIcon(activity.activityType),
    activityType: activity.activityType,
    metadata: activity.metadata
  }));
};

// Filter activities by type for specific sections
export const filterActivitiesByType = (
  activities: UserActivity[], 
  types: string[]
): UserActivity[] => {
  return activities.filter(activity => types.includes(activity.activityType));
};

// Get profile-related activities only
export const getProfileActivities = (activities: UserActivity[]): UserActivity[] => {
  return filterActivitiesByType(activities, [
    'profile_update',
    'profile_picture_upload',
    'cv_upload',
    'skill_add',
    'skill_remove',
    'experience_add',
    'experience_update',
    'experience_delete',
    'education_add',
    'education_update',
    'education_delete'
  ]);
};

// Get job-related activities only
export const getJobActivities = (activities: UserActivity[]): UserActivity[] => {
  return filterActivitiesByType(activities, [
    'job_application',
    'job_bookmark',
    'training_enrollment'
  ]);
};
