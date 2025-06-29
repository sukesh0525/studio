import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  _id: string;
  companyId: string;
  title: string;
  description: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Contract';
  status: 'Open' | 'Closed' | 'Draft';
  requirements: string[];
  skills: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  image?: string;
  hint?: string;
  applicants: string[];
  likes: string[];
  comments: Array<{
    userId: string;
    comment: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>({
  companyId: {
    type: String,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Open', 'Closed', 'Draft'],
    default: 'Open',
  },
  requirements: [{
    type: String,
    trim: true,
  }],
  skills: [{
    type: String,
    trim: true,
  }],
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'INR' },
  },
  image: { type: String, trim: true },
  hint: { type: String, trim: true },
  applicants: [{
    type: String,
    ref: 'User',
  }],
  likes: [{
    type: String,
    ref: 'User',
  }],
  comments: [{
    userId: { type: String, ref: 'User', required: true },
    comment: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  }],
}, {
  timestamps: true,
});

// Indexes for better performance
JobSchema.index({ companyId: 1 });
JobSchema.index({ status: 1 });
JobSchema.index({ type: 1 });
JobSchema.index({ createdAt: -1 });

export default mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);