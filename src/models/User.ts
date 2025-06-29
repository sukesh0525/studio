import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  userType: 'student' | 'company';
  profile: {
    fullName?: string;
    fatherName?: string;
    motherName?: string;
    college?: string;
    education?: string;
    interest?: string;
    linkedIn?: string;
    github?: string;
    companyName?: string;
    location?: string;
    workType?: 'On-site' | 'Hybrid' | 'Remote';
    description?: string;
    companyImage?: string;
    followers?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  userType: {
    type: String,
    enum: ['student', 'company'],
    required: true,
  },
  profile: {
    // Student fields
    fullName: { type: String, trim: true },
    fatherName: { type: String, trim: true },
    motherName: { type: String, trim: true },
    college: { type: String, trim: true },
    education: { type: String, trim: true },
    interest: { type: String, trim: true },
    linkedIn: { type: String, trim: true },
    github: { type: String, trim: true },
    
    // Company fields
    companyName: { type: String, trim: true },
    location: { type: String, trim: true },
    workType: { 
      type: String, 
      enum: ['On-site', 'Hybrid', 'Remote'],
      default: 'Hybrid'
    },
    description: { type: String, trim: true },
    companyImage: { type: String, trim: true },
    followers: { type: Number, default: 0 },
  },
}, {
  timestamps: true,
});

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ userType: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);