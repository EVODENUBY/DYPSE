import { Schema, model } from 'mongoose';

const GroupActivitySchema = new Schema(
  {
    groupId: { type: String, required: true, index: true }, // Reference to Prisma Group ID
    authorId: { type: String, required: true, index: true },
    type: { 
      type: String, 
      required: true, 
      enum: ['post', 'discussion', 'event', 'poll', 'resource', 'announcement'],
      index: true 
    },
    title: { type: String, required: true },
    content: String,
    // For posts and discussions
    tags: [String],
    attachments: [{
      type: { type: String, enum: ['file', 'image', 'video', 'link'] },
      url: String,
      name: String,
      size: Number
    }],
    // For events
    event: {
      startDate: Date,
      endDate: Date,
      location: String,
      isVirtual: { type: Boolean, default: false },
      meetingLink: String,
      attendees: [String],
      maxAttendees: Number
    },
    // For polls
    poll: {
      question: String,
      options: [{
        text: String,
        votes: [String] // Array of user IDs who voted for this option
      }],
      endDate: Date,
      isMultipleChoice: { type: Boolean, default: false }
    },
    // For resources
    resource: {
      category: String,
      difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
      estimatedTime: String,
      prerequisites: [String]
    },
    // Engagement metrics
    likes: [String], // Array of user IDs who liked
    dislikes: [String], // Array of user IDs who disliked
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    // Comments
    comments: [{
      id: String,
      authorId: String,
      content: String,
      likes: [String],
      createdAt: { type: Date, default: Date.now },
      replies: [{
        id: String,
        authorId: String,
        content: String,
        likes: [String],
        createdAt: { type: Date, default: Date.now }
      }]
    }],
    // Moderation
    isPinned: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    moderationStatus: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected', 'flagged'],
      default: 'approved'
    },
    moderationNotes: String,
    // Analytics
    engagementScore: { type: Number, default: 0 },
    trendingScore: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Indexes for better query performance
GroupActivitySchema.index({ groupId: 1, type: 1, createdAt: -1 });
GroupActivitySchema.index({ authorId: 1, createdAt: -1 });
GroupActivitySchema.index({ type: 1, createdAt: -1 });
GroupActivitySchema.index({ tags: 1 });
GroupActivitySchema.index({ 'event.startDate': 1 });
GroupActivitySchema.index({ isPinned: 1, createdAt: -1 });
GroupActivitySchema.index({ engagementScore: -1 });
GroupActivitySchema.index({ trendingScore: -1 });
GroupActivitySchema.index({ title: 'text', content: 'text' });

export const GroupActivity = model('group_activities', GroupActivitySchema);