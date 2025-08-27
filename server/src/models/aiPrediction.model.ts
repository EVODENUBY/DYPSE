import { Schema, model } from 'mongoose';

const AIPredictionSchema = new Schema(
  {
    predictionId: { type: String, required: true, unique: true }, // Reference to Prisma AIPrediction ID
    userId: { type: String, required: true, index: true },
    predictionType: { 
      type: String, 
      required: true, 
      enum: ['job_match', 'skill_gap', 'career_path', 'salary_prediction', 'job_recommendation', 'skill_recommendation'],
      index: true 
    },
    confidence: { type: Number, min: 0, max: 1 },
    isActive: { type: Boolean, default: true },
    expiresAt: Date,
    // Detailed prediction data
    data: {
      // For job matches
      jobMatches: [{
        jobId: String,
        jobTitle: String,
        companyName: String,
        matchScore: Number,
        reasons: [String],
        skillsMatched: [String],
        skillsMissing: [String]
      }],
      // For skill gaps
      skillGaps: [{
        skillName: String,
        currentLevel: String,
        recommendedLevel: String,
        importance: Number,
        learningPath: [String],
        estimatedTime: String
      }],
      // For career paths
      careerPaths: [{
        title: String,
        description: String,
        steps: [{
          step: Number,
          action: String,
          timeline: String,
          resources: [String]
        }],
        probability: Number
      }],
      // For salary predictions
      salaryPrediction: {
        currentSalary: Number,
        predictedSalary: Number,
        factors: [String],
        confidence: Number
      },
      // For general recommendations
      recommendations: [{
        type: String,
        title: String,
        description: String,
        priority: Number,
        actionItems: [String]
      }]
    },
    // Model metadata
    modelVersion: String,
    modelName: String,
    inputFeatures: [String],
    processingTime: Number, // in milliseconds
    // User feedback
    feedback: {
      isHelpful: Boolean,
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      createdAt: Date
    },
    // Analytics
    views: { type: Number, default: 0 },
    actions: [{
      action: String,
      timestamp: { type: Date, default: Date.now },
      details: Schema.Types.Mixed
    }]
  },
  { timestamps: true }
);

// Indexes for better query performance
AIPredictionSchema.index({ userId: 1, predictionType: 1 });
AIPredictionSchema.index({ predictionType: 1, confidence: -1 });
AIPredictionSchema.index({ isActive: 1, expiresAt: 1 });
AIPredictionSchema.index({ createdAt: -1 });

export const AIPrediction = model('ai_predictions', AIPredictionSchema);