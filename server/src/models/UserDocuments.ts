import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends Document {
  userId: string; // Reference to Supabase user ID
  rwandaId: string; // Rwanda National ID for uniqueness
  documentType: 'cv' | 'certificate' | 'business_evidence' | 'startup_proof';
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  filePath: string;
  uploadDate: Date;
  isVerified: boolean;
  verificationDate?: Date;
  verifiedBy?: string;
  metadata?: {
    description?: string;
    tags?: string[];
    category?: string;
    expiryDate?: Date;
  };
}

const UserDocumentSchema = new Schema<IUserDocument>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  rwandaId: {
    type: String,
    required: true,
    index: true
  },
  documentType: {
    type: String,
    required: true,
    enum: ['cv', 'certificate', 'business_evidence', 'startup_proof']
  },
  fileName: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDate: {
    type: Date
  },
  verifiedBy: {
    type: String
  },
  metadata: {
    description: String,
    tags: [String],
    category: String,
    expiryDate: Date
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
UserDocumentSchema.index({ userId: 1, documentType: 1 });
UserDocumentSchema.index({ rwandaId: 1, documentType: 1 });

export default mongoose.model<IUserDocument>('UserDocument', UserDocumentSchema);