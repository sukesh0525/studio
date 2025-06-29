import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  _id: string;
  jobId: string;
  studentId: string;
  companyId: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  coverLetter?: string;
  resumeUrl?: string;
  matchPercentage?: number;
  appliedAt: Date;
  reviewedAt?: Date;
  notes?: string;
}

const ApplicationSchema = new Schema<IApplication>({
  jobId: {
    type: String,
    required: true,
    ref: 'Job',
  },
  studentId: {
    type: String,
    required: true,
    ref: 'User',
  },
  companyId: {
    type: String,
    required: true,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending',
  },
  coverLetter: {
    type: String,
    trim: true,
  },
  resumeUrl: {
    type: String,
    trim: true,
  },
  matchPercentage: {
    type: Number,
    min: 0,
    max: 100,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  reviewedAt: {
    type: Date,
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Compound indexes
ApplicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });
ApplicationSchema.index({ companyId: 1, status: 1 });
ApplicationSchema.index({ studentId: 1, status: 1 });

export default mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);