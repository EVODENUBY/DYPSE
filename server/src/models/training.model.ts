import { Schema, model } from 'mongoose';

const TrainingSchema = new Schema(
  {
    trainingId: { type: String, required: true, unique: true }, // Reference to Prisma training ID
    logo: { type: String },
    trainingTitle: { type: String, required: true, index: true },
    trainingCompany: { type: String, required: true, index: true },
    ratings: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    duration: { type: String, required: true },
    skills: [{ type: String, index: true }],
    description: String,
    price: Number,
    isActive: { type: Boolean, default: true },
    maxParticipants: Number,
    currentParticipants: { type: Number, default: 0 },
    // Additional MongoDB-specific fields
    materials: [{
      title: String,
      type: { type: String, enum: ['video', 'document', 'link', 'quiz'] },
      url: String,
      duration: Number, // in minutes
      isRequired: { type: Boolean, default: true }
    }],
    reviews: [{
      userId: String,
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      createdAt: { type: Date, default: Date.now }
    }],
    schedule: [{
      date: Date,
      time: String,
      topic: String,
      instructor: String,
      isVirtual: { type: Boolean, default: false },
      meetingLink: String
    }],
    certificates: [{
      name: String,
      description: String,
      criteria: String // e.g., "Complete all modules with 80% score"
    }],
    tags: [String],
    category: String,
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    language: { type: String, default: 'en' },
    prerequisites: [String],
    learningOutcomes: [String],
  },
  { timestamps: true }
);

// Indexes for better query performance
TrainingSchema.index({ trainingTitle: 'text', trainingCompany: 'text', description: 'text' });
TrainingSchema.index({ skills: 1 });
TrainingSchema.index({ category: 1 });
TrainingSchema.index({ level: 1 });
TrainingSchema.index({ startDate: 1 });
TrainingSchema.index({ isActive: 1 });

export const Training = model('trainings', TrainingSchema);