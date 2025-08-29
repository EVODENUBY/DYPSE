import { Request, Response } from 'express';
import { YouthProfile, IYouthProfile, JobStatus } from '../models/youthProfile.model';
import { User } from '../models/user.model';
import { Skill, UserSkill } from '../models/skill.model';
import { cleanupOldFile } from '../middleware/upload.middleware';
import { ActivityHelpers } from '../services/activityLogger.service';
import path from 'path';

// Enhanced helper function to calculate profile completion percentage
const calculateProfileCompletion = (profile: IYouthProfile, userSkills?: any[]): number => {
  const weights = {
    basicInfo: 15,      // Name and phone
    personalInfo: 10,   // Date of birth
    location: 15,       // Address, city, country
    bio: 10,           // Bio description
    skills: 20,        // Skills (more weight as it's crucial for employment)
    experience: 15,    // Work experience
    education: 10,     // Educational background
    profilePicture: 5, // Profile picture
    cv: 10            // CV/Resume
  };
  
  let completedScore = 0;
  const totalScore = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

  // Basic info (First name, Last name, Phone number)
  if (profile.firstName && profile.firstName.trim().length > 1 && 
      profile.lastName && profile.lastName.trim().length > 1 && 
      profile.phoneNumber && profile.phoneNumber.trim().length > 0) {
    completedScore += weights.basicInfo;
  } else if (profile.firstName && profile.lastName) {
    completedScore += weights.basicInfo * 0.7; // Partial credit
  }
  
  // Personal info (Date of birth)
  if (profile.dateOfBirth && profile.dateOfBirth < new Date()) {
    completedScore += weights.personalInfo;
  }
  
  // Location (Address, city, country - all required for full score)
  if (profile.address && profile.city && profile.country) {
    completedScore += weights.location;
  } else if (profile.city && profile.country) {
    completedScore += weights.location * 0.7; // Partial credit
  } else if (profile.city || profile.country) {
    completedScore += weights.location * 0.4; // Minimal credit
  }
  
  // Bio (meaningful description)
  if (profile.bio && profile.bio.trim().length > 20) {
    completedScore += weights.bio;
  } else if (profile.bio && profile.bio.trim().length > 0) {
    completedScore += weights.bio * 0.5; // Partial credit for short bio
  }
  
  // Skills (weighted by number and quality)
  const skillsCount = (userSkills && userSkills.length > 0) ? userSkills.length : 
                      (profile.skills && profile.skills.length > 0) ? profile.skills.length : 0;
  
  if (skillsCount > 0) {
    if (skillsCount >= 5) {
      completedScore += weights.skills; // Full credit for 5+ skills
    } else if (skillsCount >= 3) {
      completedScore += weights.skills * 0.8; // Good credit for 3-4 skills
    } else {
      completedScore += weights.skills * 0.5; // Partial credit for 1-2 skills
    }
  }
  
  // Experience (weighted by number and completeness)
  if (profile.experience && profile.experience.length > 0) {
    const completeExperiences = profile.experience.filter(exp => 
      exp.title && exp.company && exp.startDate && 
      (exp.isCurrent || exp.endDate) && 
      exp.description && exp.description.trim().length > 10
    ).length;
    
    if (completeExperiences >= 2) {
      completedScore += weights.experience; // Full credit for 2+ complete experiences
    } else if (completeExperiences >= 1) {
      completedScore += weights.experience * 0.8; // Good credit for 1 complete experience
    } else if (profile.experience.length > 0) {
      completedScore += weights.experience * 0.4; // Partial credit for incomplete experiences
    }
  }
  
  // Education (weighted by completeness)
  if (profile.education && profile.education.length > 0) {
    const completeEducation = profile.education.filter(edu => 
      edu.institution && edu.degree && edu.fieldOfStudy && edu.startDate
    ).length;
    
    if (completeEducation >= 1) {
      completedScore += weights.education; // Full credit for at least one complete education
    } else if (profile.education.length > 0) {
      completedScore += weights.education * 0.5; // Partial credit for incomplete education
    }
  }
  
  // Profile picture
  if (profile.profilePicture) {
    completedScore += weights.profilePicture;
  }

  // CV/Resume
  if (profile.cvUrl || profile.resume) {
    completedScore += weights.cv;
  }

  return Math.round((completedScore / totalScore) * 100);
};

// Helper function to get profile completion insights
const getProfileCompletionInsights = (profile: IYouthProfile, userSkills?: any[]): string[] => {
  const insights: string[] = [];
  
  if (!profile.firstName || !profile.lastName || !profile.phoneNumber) {
    insights.push('Complete your basic information (name and phone number)');
  }
  
  if (!profile.bio || profile.bio.trim().length < 20) {
    insights.push('Add a compelling bio to showcase your personality and goals');
  }
  
  const skillsCount = (userSkills && userSkills.length > 0) ? userSkills.length : 
                      (profile.skills && profile.skills.length > 0) ? profile.skills.length : 0;
  if (skillsCount < 3) {
    insights.push('Add more skills to improve your visibility to employers');
  }
  
  if (!profile.experience || profile.experience.length === 0) {
    insights.push('Add work experience, internships, or volunteer work');
  }
  
  if (!profile.education || profile.education.length === 0) {
    insights.push('Add your educational background');
  }
  
  if (!profile.profilePicture) {
    insights.push('Upload a professional profile picture');
  }
  
  if (!profile.cvUrl && !profile.resume) {
    insights.push('Upload your CV or resume');
  }
  
  if (!profile.address || !profile.city || !profile.country) {
    insights.push('Complete your location information');
  }
  
  return insights;
};

// Get current user's profile
export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    let profile = await YouthProfile.findOne({ userId }).populate('userId');
    
    if (!profile) {
      // Create a new profile with default values
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      profile = new YouthProfile({
        userId,
        firstName: user.firstName || user.email.split('@')[0], // Use user's firstName or email prefix
        lastName: user.lastName || '', // Use user's lastName if available
        phoneNumber: user.phone || '', // Use user's phone if available
        jobStatus: JobStatus.UNEMPLOYED,
        profileCompletion: 0,
        skills: [],
        education: [],
        experience: []
      });
      
      await profile.save();
    }

    // Load user skills for accurate profile completion calculation
    const userSkills = await UserSkill.find({ userId }).populate('skillId');
    
    // Calculate and update profile completion with skills included
    const completionPercentage = calculateProfileCompletion(profile, userSkills);
    if (profile.profileCompletion !== completionPercentage) {
      profile.profileCompletion = completionPercentage;
      await profile.save();
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update profile
export const updateMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const updateData = { ...req.body };
    
    // Convert jobStatus to match enum
    if (updateData.jobStatus) {
      const statusMap: { [key: string]: JobStatus } = {
        'unemployed': JobStatus.UNEMPLOYED,
        'employed': JobStatus.EMPLOYED,
        'self_employed': JobStatus.SELF_EMPLOYED
      };
      updateData.jobStatus = statusMap[updateData.jobStatus] || JobStatus.UNEMPLOYED;
    }

    // Update the user model if firstName, lastName, or phone has changed
    const userUpdateData: any = {};
    if (updateData.firstName) userUpdateData.firstName = updateData.firstName;
    if (updateData.lastName) userUpdateData.lastName = updateData.lastName;
    if (updateData.phone) userUpdateData.phone = updateData.phone;
    
    if (Object.keys(userUpdateData).length > 0) {
      await User.findByIdAndUpdate(userId, userUpdateData);
    }

    const profile = await YouthProfile.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, upsert: true }
    );

    // Load user skills for accurate profile completion calculation
    const userSkills = await UserSkill.find({ userId }).populate('skillId');
    
    // Calculate and update profile completion with skills included
    const completionPercentage = calculateProfileCompletion(profile, userSkills);
    profile.profileCompletion = completionPercentage;
    await profile.save();

    // Log profile update activity
    const changes = Object.keys(updateData);
    ActivityHelpers.profileUpdate(userId, changes);

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Upload profile picture
export const uploadProfilePicture = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const profile = await YouthProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Clean up old profile picture
    if (profile.profilePicture) {
      const oldFilePath = path.join(process.cwd(), 'uploads/profile-pictures', path.basename(profile.profilePicture));
      cleanupOldFile(oldFilePath);
    }

    // Update profile with new picture path
    const fileUrl = `/uploads/profile-pictures/${req.file.filename}`;
    profile.profilePicture = fileUrl;
    
    // Load user skills for accurate profile completion calculation
    const userSkills = await UserSkill.find({ userId }).populate('skillId');
    
    // Recalculate profile completion with skills included
    profile.profileCompletion = calculateProfileCompletion(profile, userSkills);
    await profile.save();

    // Log profile picture upload activity
    ActivityHelpers.profilePictureUpload(userId, req.file.filename);

    res.json({ 
      success: true, 
      message: 'Profile picture uploaded successfully',
      data: { 
        profilePictureUrl: fileUrl,
        profileCompletion: profile.profileCompletion
      }
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Upload CV
export const uploadCV = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const profile = await YouthProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Clean up old CV
    if (profile.cvUrl) {
      const oldFilePath = path.join(process.cwd(), 'uploads/cvs', path.basename(profile.cvUrl));
      cleanupOldFile(oldFilePath);
    }

    // Update profile with new CV path
    const fileUrl = `/uploads/cvs/${req.file.filename}`;
    profile.cvUrl = fileUrl;
    
    // Load user skills for accurate profile completion calculation
    const userSkills = await UserSkill.find({ userId }).populate('skillId');
    
    // Recalculate profile completion with skills included
    profile.profileCompletion = calculateProfileCompletion(profile, userSkills);
    await profile.save();

    // Log CV upload activity
    ActivityHelpers.cvUpload(userId, req.file.filename);

    res.json({ 
      success: true, 
      message: 'CV uploaded successfully',
      data: { 
        fileUrl: fileUrl,
        profileCompletion: profile.profileCompletion
      }
    });
  } catch (error) {
    console.error('Upload CV error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Skills management
export const getMySkills = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const userSkills = await UserSkill.find({ userId }).populate('skillId');
    
    res.json({ 
      success: true, 
      data: userSkills.map(us => ({
        id: us._id,
        skillId: us.skillId,
        skill: us.skillId,
        level: us.level,
        endorsements: us.endorsements
      }))
    });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const searchSkills = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query required' });
    }

    const skills = await Skill.find({
      name: { $regex: q as string, $options: 'i' }
    }).limit(10);

    res.json({ success: true, data: skills });
  } catch (error) {
    console.error('Search skills error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const createSkill = async (req: Request, res: Response) => {
  try {
    const { name, category, description } = req.body;
    
    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Skill name and category are required' });
    }

    // Check if skill already exists (case-insensitive)
    const existingSkill = await Skill.findOne({ 
      name: name.toLowerCase().trim() 
    });
    
    if (existingSkill) {
      return res.json({ success: true, data: existingSkill }); // Return existing skill
    }

    // Create new skill
    const newSkill = new Skill({
      name: name.toLowerCase().trim(),
      category: category.trim(),
      description: description?.trim()
    });

    await newSkill.save();
    res.json({ success: true, data: newSkill });
  } catch (error: any) {
    console.error('Create skill error:', error);
    if (error.code === 11000) { // Duplicate key error
      // Try to find the existing skill and return it
      const existingSkill = await Skill.findOne({ name: req.body.name?.toLowerCase()?.trim() });
      if (existingSkill) {
        return res.json({ success: true, data: existingSkill });
      }
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const upsertSkill = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { skillId, level } = req.body;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (!skillId || !level) {
      return res.status(400).json({ success: false, message: 'Skill ID and level required' });
    }

    // Check if skill exists
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    // Upsert user skill
    const userSkill = await UserSkill.findOneAndUpdate(
      { userId, skillId },
      { level },
      { new: true, upsert: true }
    );

    // Update profile completion with skills included
    const profile = await YouthProfile.findOne({ userId });
    if (profile) {
      const userSkills = await UserSkill.find({ userId }).populate('skillId');
      profile.profileCompletion = calculateProfileCompletion(profile, userSkills);
      await profile.save();
    }

    // Log skill addition activity
    ActivityHelpers.skillAdd(userId, skill.name, level);

    res.json({ success: true, data: userSkill });
  } catch (error) {
    console.error('Upsert skill error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { skillId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    // Get skill name before deletion for logging
    const skillToDelete = await UserSkill.findOne({ userId, skillId }).populate('skillId');
    const skillName = (skillToDelete?.skillId as any)?.name || 'Unknown skill';
    
    await UserSkill.findOneAndDelete({ userId, skillId });

    // Update profile completion with skills included
    const profile = await YouthProfile.findOne({ userId });
    if (profile) {
      const userSkills = await UserSkill.find({ userId }).populate('skillId');
      profile.profileCompletion = calculateProfileCompletion(profile, userSkills);
      await profile.save();
    }

    // Log skill removal activity
    ActivityHelpers.skillRemove(userId, skillName);

    res.json({ success: true, message: 'Skill removed successfully' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Experience management
export const addExperience = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const experienceData = req.body;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const profile = await YouthProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Map frontend fields to backend fields
    const experience = {
      title: experienceData.role,
      company: experienceData.employerName,
      location: experienceData.location || '',
      startDate: new Date(experienceData.startDate),
      endDate: experienceData.endDate ? new Date(experienceData.endDate) : undefined,
      isCurrent: experienceData.isCurrent || false,
      description: experienceData.description || ''
    };

    profile.experience.push(experience);
    
    // Load user skills for accurate profile completion calculation
    const userSkills = await UserSkill.find({ userId }).populate('skillId');
    profile.profileCompletion = calculateProfileCompletion(profile, userSkills);
    await profile.save();

    // Log experience addition activity
    ActivityHelpers.experienceAdd(userId, experience.company, experience.title);

    res.json({ success: true, data: profile.experience[profile.experience.length - 1] });
  } catch (error) {
    console.error('Add experience error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateExperience = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { experienceId } = req.params;
    const experienceData = req.body;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const profile = await YouthProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const experienceIndex = profile.experience.findIndex(exp => (exp as any)._id?.toString() === experienceId);
    if (experienceIndex === -1) {
      return res.status(404).json({ success: false, message: 'Experience not found' });
    }

    // Map frontend fields to backend fields
    const updatedExperience = {
      title: experienceData.role,
      company: experienceData.employerName,
      location: experienceData.location || '',
      startDate: new Date(experienceData.startDate),
      endDate: experienceData.endDate ? new Date(experienceData.endDate) : undefined,
      isCurrent: experienceData.isCurrent || false,
      description: experienceData.description || ''
    };

    profile.experience[experienceIndex] = { ...profile.experience[experienceIndex], ...updatedExperience };
    
    // Load user skills for accurate profile completion calculation
    const userSkills = await UserSkill.find({ userId }).populate('skillId');
    profile.profileCompletion = calculateProfileCompletion(profile, userSkills);
    await profile.save();

    // Log experience update activity
    ActivityHelpers.experienceUpdate(userId, updatedExperience.company, updatedExperience.title);

    res.json({ success: true, data: profile.experience[experienceIndex] });
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { experienceId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const profile = await YouthProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Get experience details before deletion for logging
    const experienceToDelete = profile.experience.find(exp => (exp as any)._id?.toString() === experienceId);
    const company = experienceToDelete?.company || 'Unknown company';
    const title = experienceToDelete?.title || 'Unknown role';

    profile.experience = profile.experience.filter(exp => (exp as any)._id?.toString() !== experienceId);
    
    // Load user skills for accurate profile completion calculation
    const userSkills = await UserSkill.find({ userId }).populate('skillId');
    profile.profileCompletion = calculateProfileCompletion(profile, userSkills);
    await profile.save();

    // Log experience deletion activity
    ActivityHelpers.experienceDelete(userId, company, title);

    res.json({ success: true, message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Education management
export const addEducation = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const educationData = req.body;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const profile = await YouthProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Map frontend fields to backend fields
    const education = {
      institution: educationData.school,
      degree: educationData.degree,
      fieldOfStudy: educationData.fieldOfStudy,
      startDate: new Date(educationData.startDate),
      endDate: educationData.endDate ? new Date(educationData.endDate) : undefined,
      isCurrent: !educationData.endDate
    };

    profile.education.push(education);
    
    // Load user skills for accurate profile completion calculation
    const userSkills = await UserSkill.find({ userId }).populate('skillId');
    profile.profileCompletion = calculateProfileCompletion(profile, userSkills);
    await profile.save();

    // Log education addition activity
    ActivityHelpers.educationAdd(userId, education.institution, education.degree);

    res.json({ success: true, data: profile.education[profile.education.length - 1] });
  } catch (error) {
    console.error('Add education error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateEducation = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { educationId } = req.params;
    const educationData = req.body;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const profile = await YouthProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const educationIndex = profile.education.findIndex(edu => (edu as any)._id?.toString() === educationId);
    if (educationIndex === -1) {
      return res.status(404).json({ success: false, message: 'Education not found' });
    }

    // Map frontend fields to backend fields
    const updatedEducation = {
      institution: educationData.school,
      degree: educationData.degree,
      fieldOfStudy: educationData.fieldOfStudy,
      startDate: new Date(educationData.startDate),
      endDate: educationData.endDate ? new Date(educationData.endDate) : undefined,
      isCurrent: !educationData.endDate
    };

    profile.education[educationIndex] = { ...profile.education[educationIndex], ...updatedEducation };
    
    // Load user skills for accurate profile completion calculation
    const userSkills = await UserSkill.find({ userId }).populate('skillId');
    profile.profileCompletion = calculateProfileCompletion(profile, userSkills);
    await profile.save();

    // Log education update activity
    ActivityHelpers.educationUpdate(userId, updatedEducation.institution, updatedEducation.degree);

    res.json({ success: true, data: profile.education[educationIndex] });
  } catch (error) {
    console.error('Update education error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deleteEducation = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { educationId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const profile = await YouthProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Get education details before deletion for logging
    const educationToDelete = profile.education.find(edu => (edu as any)._id?.toString() === educationId);
    const institution = educationToDelete?.institution || 'Unknown institution';
    const degree = educationToDelete?.degree || 'Unknown degree';

    profile.education = profile.education.filter(edu => (edu as any)._id?.toString() !== educationId);
    
    // Load user skills for accurate profile completion calculation
    const userSkills = await UserSkill.find({ userId }).populate('skillId');
    profile.profileCompletion = calculateProfileCompletion(profile, userSkills);
    await profile.save();

    // Log education deletion activity
    ActivityHelpers.educationDelete(userId, institution, degree);

    res.json({ success: true, message: 'Education deleted successfully' });
  } catch (error) {
    console.error('Delete education error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Profile Analytics and Insights
export const getProfileInsights = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const profile = await YouthProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const userSkills = await UserSkill.find({ userId }).populate('skillId');
    const completionPercentage = calculateProfileCompletion(profile, userSkills);
    const insights = getProfileCompletionInsights(profile, userSkills);

    // Calculate profile strength metrics
    const profileStrength = {
      overall: completionPercentage,
      basicInfo: profile.firstName && profile.lastName && profile.phoneNumber ? 100 : 50,
      skills: userSkills.length >= 5 ? 100 : (userSkills.length >= 3 ? 80 : 50),
      experience: profile.experience.length >= 2 ? 100 : (profile.experience.length >= 1 ? 70 : 0),
      education: profile.education.length >= 1 ? 100 : 0,
      media: (profile.profilePicture ? 50 : 0) + (profile.cvUrl || profile.resume ? 50 : 0)
    };

    // Calculate employability score based on various factors
    const employabilityScore = calculateEmployabilityScore(profile, userSkills);

    // Get trending skills recommendations
    const skillRecommendations = await getSkillRecommendations(userSkills, profile);

    res.json({
      success: true,
      data: {
        profileCompletion: completionPercentage,
        profileStrength,
        employabilityScore,
        insights,
        skillRecommendations,
        stats: {
          totalSkills: userSkills.length,
          totalExperience: profile.experience.length,
          totalEducation: profile.education.length,
          profileViews: 0, // TODO: Implement profile views tracking
          lastUpdated: profile.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Get profile insights error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Calculate employability score based on profile data
const calculateEmployabilityScore = (profile: IYouthProfile, userSkills: any[]): number => {
  let score = 0;
  
  // Basic information (20 points)
  if (profile.firstName && profile.lastName && profile.phoneNumber) {
    score += 20;
  }
  
  // Skills (30 points - most important)
  const skillsScore = Math.min(userSkills.length * 6, 30);
  score += skillsScore;
  
  // Experience (25 points)
  const experienceScore = Math.min(profile.experience.length * 8, 25);
  score += experienceScore;
  
  // Education (15 points)
  const educationScore = Math.min(profile.education.length * 7, 15);
  score += educationScore;
  
  // Profile completeness (10 points)
  if (profile.bio && profile.bio.length > 50) score += 5;
  if (profile.profilePicture) score += 3;
  if (profile.cvUrl || profile.resume) score += 2;
  
  return Math.min(score, 100);
};

// Get skill recommendations based on user's existing skills and profile
const getSkillRecommendations = async (userSkills: any[], profile: IYouthProfile): Promise<any[]> => {
  try {
    // Get all existing skill names
    const existingSkillNames = userSkills.map(us => us.skillId?.name).filter(Boolean);
    
    // Define skill categories and recommendations
    const skillCategories: { [key: string]: string[] } = {
      'technical': ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'HTML/CSS'],
      'soft': ['Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Time Management'],
      'digital': ['Microsoft Office', 'Google Workspace', 'Social Media Marketing', 'Data Analysis'],
      'language': ['English', 'French', 'Spanish', 'Arabic', 'Mandarin']
    };
    
    let recommendations: string[] = [];
    
    // Add recommendations based on existing skills
    if (existingSkillNames.some(skill => skillCategories.technical.includes(skill))) {
      recommendations.push(...skillCategories.technical.filter(skill => !existingSkillNames.includes(skill)));
    }
    
    // Always recommend soft skills if user has less than 3
    if (userSkills.length < 3) {
      recommendations.push(...skillCategories.soft.slice(0, 3));
    }
    
    // Digital skills are always valuable
    recommendations.push(...skillCategories.digital.filter(skill => !existingSkillNames.includes(skill)).slice(0, 2));
    
    // Find skills in database that match recommendations
    const recommendedSkills = await Skill.find({
      name: { $in: recommendations }
    }).limit(5);
    
    return recommendedSkills;
  } catch (error) {
    console.error('Error getting skill recommendations:', error);
    return [];
  }
};

// Get profile analytics dashboard data
export const getProfileAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const profile = await YouthProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const userSkills = await UserSkill.find({ userId }).populate('skillId');
    
    // Calculate various metrics
    const metrics = {
      profileCompletion: calculateProfileCompletion(profile, userSkills),
      employabilityScore: calculateEmployabilityScore(profile, userSkills),
      skillsDistribution: getSkillsDistribution(userSkills),
      experienceYears: calculateTotalExperience(profile.experience),
      profileStrength: getProfileStrengthBreakdown(profile, userSkills)
    };
    
    // Generate insights and recommendations
    const insights = {
      improvements: getProfileCompletionInsights(profile, userSkills),
      strengths: getProfileStrengths(profile, userSkills),
      nextSteps: getRecommendedNextSteps(profile, userSkills)
    };
    
    res.json({
      success: true,
      data: {
        metrics,
        insights,
        lastCalculated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Get profile analytics error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Helper functions for analytics
const getSkillsDistribution = (userSkills: any[]) => {
  const distribution = { beginner: 0, intermediate: 0, expert: 0 };
  userSkills.forEach(skill => {
    if (skill.level in distribution) {
      distribution[skill.level as keyof typeof distribution]++;
    }
  });
  return distribution;
};

const calculateTotalExperience = (experiences: any[]): number => {
  let totalMonths = 0;
  experiences.forEach(exp => {
    const startDate = new Date(exp.startDate);
    const endDate = exp.isCurrent ? new Date() : new Date(exp.endDate);
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                  (endDate.getMonth() - startDate.getMonth());
    totalMonths += Math.max(0, months);
  });
  return Math.round(totalMonths / 12 * 10) / 10; // Years with 1 decimal
};

const getProfileStrengthBreakdown = (profile: IYouthProfile, userSkills: any[]) => {
  return {
    personal: (profile.firstName && profile.lastName && profile.bio) ? 100 : 60,
    skills: userSkills.length >= 5 ? 100 : (userSkills.length * 20),
    experience: profile.experience.length >= 2 ? 100 : (profile.experience.length * 50),
    education: profile.education.length >= 1 ? 100 : 0,
    media: ((profile.profilePicture ? 1 : 0) + (profile.cvUrl ? 1 : 0)) * 50
  };
};

const getProfileStrengths = (profile: IYouthProfile, userSkills: any[]): string[] => {
  const strengths: string[] = [];
  
  if (userSkills.length >= 5) {
    strengths.push('Diverse skill set with ' + userSkills.length + ' skills');
  }
  
  if (profile.experience.length >= 2) {
    strengths.push('Strong work experience with multiple positions');
  }
  
  if (profile.bio && profile.bio.length > 100) {
    strengths.push('Detailed professional bio');
  }
  
  if (profile.education.length >= 2) {
    strengths.push('Well-educated with multiple qualifications');
  }
  
  if (profile.profilePicture && (profile.cvUrl || profile.resume)) {
    strengths.push('Complete profile with photo and CV');
  }
  
  return strengths;
};

const getRecommendedNextSteps = (profile: IYouthProfile, userSkills: any[]): string[] => {
  const steps: string[] = [];
  
  if (userSkills.length < 5) {
    steps.push('Add more skills to reach the recommended minimum of 5 skills');
  }
  
  if (profile.experience.length === 0) {
    steps.push('Add work experience, internships, or volunteer work');
  }
  
  if (!profile.profilePicture) {
    steps.push('Upload a professional profile picture');
  }
  
  if (!profile.bio || profile.bio.length < 50) {
    steps.push('Write a more detailed bio highlighting your goals and strengths');
  }
  
  if (!profile.cvUrl && !profile.resume) {
    steps.push('Upload your CV or resume');
  }
  
  return steps.slice(0, 3); // Return top 3 recommendations
};
