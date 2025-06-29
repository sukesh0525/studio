import mongoose, { Document, Schema } from 'mongoose';

export interface IDiscussion extends Document {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  category: 'general' | 'jobs' | 'internships' | 'career-advice' | 'company-updates';
  tags: string[];
  likes: string[];
  views: number;
  isPinned: boolean;
  isLocked: boolean;
  replies: Array<{
    _id: string;
    authorId: string;
    content: string;
    likes: string[];
    createdAt: Date;
    updatedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const DiscussionSchema = new Schema<IDiscussion>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  authorId: {
    type: String,
    required: true,
    ref: 'User',
  },
  category: {
    type: String,
    enum: ['general', 'jobs', 'internships', 'career-advice', 'company-updates'],
    default: 'general',
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  likes: [{
    type: String,
    ref: 'User',
  }],
  views: {
    type: Number,
    default: 0,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  replies: [{
    authorId: { type: String, ref: 'User', required: true },
    content: { type: String, required: true, trim: true },
    likes: [{ type: String, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  }],
}, {
  timestamps: true,
});

// Indexes for better performance
DiscussionSchema.index({ category: 1, createdAt: -1 });
DiscussionSchema.index({ authorId: 1 });
DiscussionSchema.index({ tags: 1 });
DiscussionSchema.index({ isPinned: -1, createdAt: -1 });

export default mongoose.models.Discussion || mongoose.model<IDiscussion>('Discussion', DiscussionSchema);