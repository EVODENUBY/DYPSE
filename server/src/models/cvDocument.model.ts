import { Schema, model } from 'mongoose';

const CvDocumentSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    profileId: { type: String, required: true, index: true },
    originalFileName: { type: String },
    storedFileName: { type: String },
    fileUrl: { type: String },
    mimeType: { type: String },
    text: { type: String },
    keywords: { type: [String], index: true },
    embedding: { type: [Number], default: undefined },
  },
  { timestamps: true }
);

export const CvDocument = model('cv_documents', CvDocumentSchema);

