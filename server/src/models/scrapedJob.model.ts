import mongoose, { Document, Schema } from 'mongoose';

export interface IScrapedJob extends Document {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  postedDate: Date;
  deadline: Date;
  source: string;
  sourceUrl: string;
  salary?: string;
  jobType?: string;
  experienceLevel?: string;
  isActive: boolean;
  lastFetched: Date;
}

const scrapedJobSchema = new Schema<IScrapedJob>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: [String], default: [] },
  responsibilities: { type: [String], default: [] },
  postedDate: { type: Date, required: true },
  deadline: { type: Date, required: true },
  source: { type: String, required: true, default: 'JobinRwanda' },
  sourceUrl: { type: String, required: true, unique: true },
  salary: { type: String },
  jobType: { type: String },
  experienceLevel: { type: String },
  isActive: { type: Boolean, default: true },
  lastFetched: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Index for text search
scrapedJobSchema.index({
  title: 'text',
  company: 'text',
  description: 'text',
  location: 'text'
});

// Index for source and isActive for faster querying
scrapedJobSchema.index({ source: 1, isActive: 1 });

export const ScrapedJob = mongoose.model<IScrapedJob>('ScrapedJob', scrapedJobSchema);
