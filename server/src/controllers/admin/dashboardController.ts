import { Request, Response, NextFunction } from 'express';
import { User } from '../../models/User';
import { User as LegacyUser } from '../../models/user.model';
import { YouthProfile } from '../../models/youthProfile.model';

// Helper to count users by role across possible User models
async function countUsersByRole(role: string): Promise<number> {
  // Prefer new User model if present
  const countNew = await User.countDocuments({ role: role as any }).catch(() => 0);
  const countLegacy = await LegacyUser.countDocuments({ role }).catch(() => 0);
  return Math.max(countNew, countLegacy);
}

export const getAdminDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Time windows
    const now = new Date();
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // Totals by role
    const totalYouths = await countUsersByRole('youth');
    const totalEmployers = await countUsersByRole('employer');

    // Previous month counts (approximate based on createdAt on User collections)
    const prevMonthYouthsNew = await User.countDocuments({ role: 'youth', createdAt: { $gte: startOfPrevMonth, $lte: endOfPrevMonth } }).catch(() => 0);
    const prevMonthYouthsLegacy = await LegacyUser.countDocuments({ role: 'youth', createdAt: { $gte: startOfPrevMonth, $lte: endOfPrevMonth } }).catch(() => 0);
    const previousMonthYouths = Math.max(prevMonthYouthsNew, prevMonthYouthsLegacy);

    const prevMonthEmployersNew = await User.countDocuments({ role: 'employer', createdAt: { $gte: startOfPrevMonth, $lte: endOfPrevMonth } }).catch(() => 0);
    const prevMonthEmployersLegacy = await LegacyUser.countDocuments({ role: 'employer', createdAt: { $gte: startOfPrevMonth, $lte: endOfPrevMonth } }).catch(() => 0);
    const previousMonthEmployers = Math.max(prevMonthEmployersNew, prevMonthEmployersLegacy);

    // Unemployment rate from youth profiles (fallback to 0 if unavailable)
    let unemploymentRate = 0;
    try {
      const totalProfiles = await YouthProfile.countDocuments({});
      if (totalProfiles > 0) {
        const unemployedCount = await YouthProfile.countDocuments({ jobStatus: 'unemployed' });
        unemploymentRate = (unemployedCount / totalProfiles) * 100;
      }
    } catch {
      unemploymentRate = 0;
    }

    // Keep response shape flexible; the client normalizes
    return res.status(200).json({
      success: true,
      data: {
        totalYouths,
        previousMonthYouths,
        totalEmployers,
        previousMonthEmployers,
        unemploymentRate,
      },
    });
  } catch (error) {
    next(error);
  }
};


