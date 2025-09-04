import { Request, Response, NextFunction } from 'express';
import { User } from '../../models/user.model';
import { Job } from '../../models/job.model';
import { JobApplication } from '../../models/jobApplication.model';

// Helper to count users by role
async function countUsersByRole(role: string): Promise<number> {
  return User.countDocuments({ role }).exec();
}

export const getEmployerDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employerId = req.user?.id;
    if (!employerId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Get employer's active jobs
    const activeJobs = await Job.countDocuments({ 
      employer: employerId,
      status: 'active',
      $or: [
        { deadline: { $exists: false } },
        { deadline: { $gte: new Date() } }
      ]
    }).exec();

    // Get total applications for employer's jobs
    const jobIds = await Job.find({ employer: employerId }).distinct('_id');
    const totalApplications = await JobApplication.countDocuments({
      job: { $in: jobIds }
    }).exec();

    // Get total youth (for reference)
    const totalYouths = await countUsersByRole('youth');

    // Get stats for the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Count new applications this month
    const newApplicationsThisMonth = await JobApplication.countDocuments({
      job: { $in: jobIds },
      createdAt: { $gte: startOfMonth, $lte: now }
    }).exec();

    // Get previous month's applications for percentage calculation
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    
    const previousMonthApplications = await JobApplication.countDocuments({
      job: { $in: jobIds },
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    }).exec();

    // Calculate percentage change in applications
    const applicationsChange = previousMonthApplications > 0 
      ? Math.round(((newApplicationsThisMonth - previousMonthApplications) / previousMonthApplications) * 100) 
      : newApplicationsThisMonth > 0 ? 100 : 0;

    // Calculate unemployment rate (simplified example)
    // In a real app, this would be based on actual employment data
    const unemploymentRate = 32; // Default value or calculate based on your data

    res.json({
      success: true,
      data: {
        activeJobs,
        totalApplications,
        totalYouths,
        unemploymentRate,
        newApplicationsThisMonth,
        previousMonthYouths: applicationsChange // Reusing this field for the percentage change
      }
    });
  } catch (error) {
    console.error('Error fetching employer dashboard stats:', error);
    next(error);
  }
};
