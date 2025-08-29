import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  StarIcon, 
  BriefcaseIcon, 
  UserIcon, 
  LightBulbIcon,
  ClockIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { profileAPI } from '@/lib/profileApi';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface ProfileInsightsProps {
  className?: string;
}

interface InsightData {
  profileCompletion: number;
  profileStrength: {
    overall: number;
    basicInfo: number;
    skills: number;
    experience: number;
    education: number;
    media: number;
  };
  employabilityScore: number;
  insights: string[];
  skillRecommendations: Array<{
    _id: string;
    name: string;
    description?: string;
  }>;
  stats: {
    totalSkills: number;
    totalExperience: number;
    totalEducation: number;
    profileViews: number;
    lastUpdated: string;
  };
}

interface AnalyticsData {
  profileCompletion: number;
  employabilityScore: number;
  skillsDistribution: any;
  experienceYears: number;
  profileStrength: any;
}

const ProfileInsights: React.FC<ProfileInsightsProps> = ({ className }) => {
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [insightsData, analyticsData] = await Promise.all([
          profileAPI.getProfileInsights(),
          profileAPI.getProfileAnalytics()
        ]);
        
        setInsights(insightsData);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error('Error fetching profile insights:', err);
        setError('Failed to load profile insights');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="flex items-center justify-center h-48">
          <LoadingSpinner size="md" className="text-indigo-600" />
          <span className="ml-2 text-gray-600">Loading insights...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center mb-6">
        <ChartBarIcon className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Profile Insights</h2>
      </div>

      {/* Profile Strength Metrics */}
      {insights?.profileStrength && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Strength</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="bg-blue-50 rounded-lg p-4">
                <UserIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{insights.profileStrength.basicInfo}%</p>
                <p className="text-sm text-gray-600">Basic Info</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-green-50 rounded-lg p-4">
                <BriefcaseIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{insights.profileStrength.skills}%</p>
                <p className="text-sm text-gray-600">Skills</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-purple-50 rounded-lg p-4">
                <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{insights.profileStrength.experience}%</p>
                <p className="text-sm text-gray-600">Experience</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employability Score */}
      {insights?.employabilityScore && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Employability Score</h3>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-indigo-600">{insights.employabilityScore}/100</p>
                <p className="text-gray-600 mt-1">Your current employability rating</p>
              </div>
              <StarIcon className="h-12 w-12 text-yellow-500" />
            </div>
          </div>
        </div>
      )}

      {/* Profile Statistics */}
      {insights?.stats && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{insights.stats.totalSkills}</p>
              <p className="text-sm text-gray-600">Skills</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{insights.stats.totalExperience}</p>
              <p className="text-sm text-gray-600">Experience</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{insights.stats.totalEducation}</p>
              <p className="text-sm text-gray-600">Education</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{analytics?.experienceYears || 0}</p>
              <p className="text-sm text-gray-600">Years Exp.</p>
            </div>
          </div>
        </div>
      )}

      {/* Improvement Suggestions */}
      {insights?.insights && insights.insights.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Improvement Suggestions</h3>
          <div className="space-y-3">
            {insights.insights.slice(0, 5).map((insight, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <LightBulbIcon className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill Recommendations */}
      {insights?.skillRecommendations && insights.skillRecommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended Skills</h3>
          <div className="flex flex-wrap gap-2">
            {insights.skillRecommendations.slice(0, 8).map((skill) => (
              <span
                key={skill._id}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 cursor-pointer transition-colors"
                title={skill.description}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Last Updated */}
      {insights?.stats?.lastUpdated && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-500">
            <ClockIcon className="h-4 w-4 mr-1" />
            Last updated: {new Date(insights.stats.lastUpdated).toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInsights;
