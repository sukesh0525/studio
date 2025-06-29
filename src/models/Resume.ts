import mongoose, { Document, Schema } from 'mongoose';

export interface IResume extends Document {
  _id: string;
  userId: string;
  filename: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  isActive: boolean;
  extractedText?: string;
  skills?: string[];
  experience?: string[];
  education?: string[];
  uploadedAt: Date;
}

const ResumeSchema = new Schema<IResume>({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  extractedText: {
    type: String,
  },
  skills: [{
    type: String,
    trim: true,
  }],
  experience: [{
    type: String,
    trim: true,
  }],
  education: [{
    type: String,
    trim: true,
  }],
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
ResumeSchema.index({ userId: 1, isActive: 1 });
ResumeSchema.index({ uploadedAt: -1 });

export default mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);