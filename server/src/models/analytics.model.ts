import { Schema, model } from 'mongoose';

const AnalyticsSchema = new Schema(
  {
    // User Analytics
    userAnalytics: {
      userId: { type: String, required: true, index: true },
      userType: { type: String, enum: ['youth', 'employer', 'admin'], required: true },
      profileViews: { type: Number, default: 0 },
      jobApplications: { type: Number, default: 0 },
      jobsPosted: { type: Number, default: 0 },
      trainingsEnrolled: { type: Number, default: 0 },
      groupsJoined: { type: Number, default: 0 },
      lastActive: Date,
      sessionDuration: { type: Number, default: 0 }, // in minutes
      pageViews: [{
        page: String,
        timestamp: { type: Date, default: Date.now },
        duration: Number
      }],
      searchQueries: [{
        query: String,
        timestamp: { type: Date, default: Date.now },
        results: Number
      }]
    },
    // Job Analytics
    jobAnalytics: {
      jobId: { type: String, required: true, index: true },
      views: { type: Number, default: 0 },
      applications: { type: Number, default: 0 },
      shortlists: { type: Number, default: 0 },
      hires: { type: Number, default: 0 },
      viewSources: [{
        source: String, // 'search', 'recommendation', 'direct', 'social'
        count: Number
      }],
      applicationSources: [{
        source: String,
        count: Number
      }],
      timeToFirstApplication: Number, // in hours
      timeToHire: Number, // in days
      candidateQuality: {
        avgExperience: Number,
        avgSkills: Number,
        avgEducation: String
      }
    },
    // Skill Analytics
    skillAnalytics: {
      skillId: { type: String, required: true, index: true },
      skillName: String,
      demandCount: { type: Number, default: 0 },
      supplyCount: { type: Number, default: 0 },
      avgSalary: Number,
      trendingScore: { type: Number, default: 0 },
      jobPostings: [{
        jobId: String,
        postedAt: Date,
        applications: Number
      }],
      userAcquisitions: [{
        userId: String,
        acquiredAt: Date,
        level: String
      }]
    },
    // Training Analytics
    trainingAnalytics: {
      trainingId: { type: String, required: true, index: true },
      enrollments: { type: Number, default: 0 },
      completions: { type: Number, default: 0 },
      avgRating: { type: Number, default: 0 },
      avgCompletionTime: Number, // in days
      dropoutRate: { type: Number, default: 0 },
      skillImprovements: [{
        skillId: String,
        beforeLevel: String,
        afterLevel: String,
        userId: String
      }],
      jobPlacements: [{
        userId: String,
        jobId: String,
        placementDate: Date
      }]
    },
    // Group Analytics
    groupAnalytics: {
      groupId: { type: String, required: true, index: true },
      memberCount: { type: Number, default: 0 },
      activeMembers: { type: Number, default: 0 },
      postsCount: { type: Number, default: 0 },
      engagementRate: { type: Number, default: 0 },
      topContributors: [{
        userId: String,
        contributionScore: Number
      }],
      popularTopics: [{
        topic: String,
        postCount: Number
      }]
    },
    // System Analytics
    systemAnalytics: {
      date: { type: Date, required: true, index: true },
      totalUsers: { type: Number, default: 0 },
      activeUsers: { type: Number, default: 0 },
      newRegistrations: { type: Number, default: 0 },
      totalJobs: { type: Number, default: 0 },
      activeJobs: { type: Number, default: 0 },
      totalApplications: { type: Number, default: 0 },
      totalTrainings: { type: Number, default: 0 },
      totalGroups: { type: Number, default: 0 },
      serverResponseTime: Number, // in milliseconds
      errorRate: { type: Number, default: 0 },
      peakUsageTime: String,
      lowUsageTime: String
    },
    // AI Model Analytics
    aiModelAnalytics: {
      modelName: { type: String, required: true, index: true },
      predictionType: { type: String, required: true, index: true },
      totalPredictions: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 },
      avgConfidence: { type: Number, default: 0 },
      userFeedback: {
        positive: { type: Number, default: 0 },
        negative: { type: Number, default: 0 },
        neutral: { type: Number, default: 0 }
      },
      processingTime: {
        avg: Number,
        min: Number,
        max: Number
      },
      featureImportance: [{
        feature: String,
        importance: Number
      }]
    },
    // Geographic Analytics
    geographicAnalytics: {
      country: { type: String, required: true, index: true },
      region: String,
      city: String,
      userCount: { type: Number, default: 0 },
      jobCount: { type: Number, default: 0 },
      applicationCount: { type: Number, default: 0 },
      avgSalary: Number,
      popularSkills: [{
        skill: String,
        count: Number
      }],
      topIndustries: [{
        industry: String,
        count: Number
      }]
    }
  },
  { timestamps: true }
);

// Indexes for better query performance
AnalyticsSchema.index({ 'userAnalytics.userId': 1 });
AnalyticsSchema.index({ 'jobAnalytics.jobId': 1 });
AnalyticsSchema.index({ 'skillAnalytics.skillId': 1 });
AnalyticsSchema.index({ 'trainingAnalytics.trainingId': 1 });
AnalyticsSchema.index({ 'groupAnalytics.groupId': 1 });
AnalyticsSchema.index({ 'systemAnalytics.date': 1 });
AnalyticsSchema.index({ 'aiModelAnalytics.modelName': 1, 'aiModelAnalytics.predictionType': 1 });
AnalyticsSchema.index({ 'geographicAnalytics.country': 1, 'geographicAnalytics.region': 1 });

export const Analytics = model('analytics', AnalyticsSchema);