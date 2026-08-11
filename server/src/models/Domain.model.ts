import mongoose, { Document, Schema } from 'mongoose';

export type DomainStatus =
  | 'IMPORTED'
  | 'ANALYZING'
  | 'GENERATING'
  | 'VALIDATING'
  | 'NEEDS_REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'FAILED';

export interface IDomain extends Document {
  name: string;
  slug: string;
  category: string;
  status: DomainStatus;
  version: number;
  validationScore: number;
  currentJobId: mongoose.Types.ObjectId | null;
  nodeCount: number;
  edgeCount: number;
  projectCount: number;
  lastGeneratedAt: Date | null;
  publishedAt: Date | null;
  failureReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const DomainSchema = new Schema<IDomain>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, default: 'Uncategorized' },
    status: {
      type: String,
      enum: ['IMPORTED', 'ANALYZING', 'GENERATING', 'VALIDATING', 'NEEDS_REVIEW', 'APPROVED', 'PUBLISHED', 'FAILED'],
      default: 'IMPORTED',
    },
    version: { type: Number, default: 0 },
    validationScore: { type: Number, default: 0 },
    currentJobId: { type: Schema.Types.ObjectId, ref: 'GenerationJob', default: null },
    nodeCount: { type: Number, default: 0 },
    edgeCount: { type: Number, default: 0 },
    projectCount: { type: Number, default: 0 },
    lastGeneratedAt: { type: Date, default: null },
    publishedAt: { type: Date, default: null },
    failureReason: { type: String, default: null },
  },
  { timestamps: true }
);

export const Domain = mongoose.model<IDomain>('Domain', DomainSchema);
