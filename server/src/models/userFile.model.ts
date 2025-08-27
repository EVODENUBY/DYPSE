import { Schema, model } from 'mongoose';

const UserFileSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    fileType: { 
      type: String, 
      required: true, 
      enum: ['cv', 'profile_pic', 'document', 'certificate', 'id_card'],
      index: true 
    },
    originalName: { type: String, required: true },
    storedName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    thumbnailUrl: { type: String }, // For images
    metadata: {
      width: Number,    // For images
      height: Number,   // For images
      duration: Number, // For videos
      pages: Number,    // For documents
    },
    isActive: { type: Boolean, default: true },
    tags: [String],     // For categorization
    description: String, // Optional description
  },
  { timestamps: true }
);

// Indexes for better query performance
UserFileSchema.index({ userId: 1, fileType: 1 });
UserFileSchema.index({ createdAt: -1 });
UserFileSchema.index({ isActive: 1 });

export const UserFile = model('user_files', UserFileSchema);