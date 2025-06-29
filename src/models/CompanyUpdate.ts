import mongoose, { Document, Schema } from 'mongoose';

export interface ICompanyUpdate extends Document {
  _id: string;
  companyId: string;
  title: string;
  content?: string;
  image?: string;
  likes: string[];
  comments: Array<{
    userId: string;
    comment: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const CompanyUpdateSchema = new Schema<ICompanyUpdate>({
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
  content: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
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

// Indexes
CompanyUpdateSchema.index({ companyId: 1 });
CompanyUpdateSchema.index({ createdAt: -1 });

export default mongoose.models.CompanyUpdate || mongoose.model<ICompanyUpdate>('CompanyUpdate', CompanyUpdateSchema);