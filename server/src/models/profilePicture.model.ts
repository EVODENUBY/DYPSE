import { Schema, model } from 'mongoose';

const ProfilePictureSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    profileId: { type: String, required: true, index: true },
    originalFileName: { type: String },
    storedFileName: { type: String },
    fileUrl: { type: String },
    mimeType: { type: String },
  },
  { timestamps: true }
);

export const ProfilePicture = model('profile_pictures', ProfilePictureSchema);