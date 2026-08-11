import mongoose, { Document, Schema } from 'mongoose';

const NodeSchema = new Schema({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ['FOUNDATION', 'CORE', 'SKILL', 'TOOL', 'SPECIALIZATION', 'ADVANCED', 'PROJECT', 'CHECKPOINT', 'CAREER', 'INTERVIEW'],
    required: true,
  },
  title: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], default: 'BEGINNER' },
  description: { type: String, required: true },
  whyLearn: { type: String, default: '' },
  topics: [{ type: String }],
  estimatedHours: { type: Number, default: 10 },
  importance: { type: Number, min: 1, max: 10, default: 5 },
  prerequisites: [{ type: String }],
  resources: [{ type: String }],
  projects: [{ type: String }],
  checkpoint: { type: String, default: null },
  optional: { type: Boolean, default: false },
  specializationId: { type: String, default: null },
});

const EdgeSchema = new Schema({
  id: { type: String, required: true },
  source: { type: String, required: true },
  target: { type: String, required: true },
  relationship: {
    type: String,
    enum: ['PREREQUISITE', 'RECOMMENDED', 'OPTIONAL', 'ALTERNATIVE', 'SPECIALIZATION', 'ADVANCED', 'RELATED'],
    required: true,
  },
  strength: { type: String, enum: ['STRONG', 'MEDIUM', 'WEAK'], default: 'STRONG' },
  reason: { type: String, default: '' },
});

const SpecializationSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  recommended: { type: Boolean, default: false },
  description: { type: String, default: '' },
  commonFoundation: [{ type: String }],
  specializationNodes: [{ type: String }],
  careerRoles: [{ type: String }],
  estimatedMonths: { type: Number, default: 6 },
});

export interface IRoadmap extends Document {
  domainId: mongoose.Types.ObjectId;
  slug: string;
  version: number;
  status: 'DRAFT' | 'VALIDATED' | 'PUBLISHED';
  overview: {
    difficulty: string;
    estimatedMonths: number;
    hoursPerWeek: number;
    prerequisites: string[];
    outcomes: string[];
  };
  foundation: string[];
  nodes: any[];
  edges: any[];
  specializations: any[];
  paths: any[];
  resources: any[];
  projects: any[];
  practice: any[];
  checkpoints: any[];
  interview: any;
  jobReadiness: any;
  validation: any;
  sources: any[];
  createdAt: Date;
  updatedAt: Date;
}

const RoadmapSchema = new Schema<IRoadmap>(
  {
    domainId: { type: Schema.Types.ObjectId, ref: 'Domain', required: true },
    slug: { type: String, required: true, unique: true },
    version: { type: Number, default: 1 },
    status: { type: String, enum: ['DRAFT', 'VALIDATED', 'PUBLISHED'], default: 'DRAFT' },
    overview: {
      difficulty: { type: String, default: 'BEGINNER_TO_ADVANCED' },
      estimatedMonths: { type: Number, default: 6 },
      hoursPerWeek: { type: Number, default: 10 },
      prerequisites: [{ type: String }],
      outcomes: [{ type: String }],
    },
    foundation: [{ type: String }],
    nodes: [NodeSchema],
    edges: [EdgeSchema],
    specializations: [SpecializationSchema],
    paths: [Schema.Types.Mixed],
    resources: [{ type: Schema.Types.Mixed }],
    projects: [{ type: Schema.Types.Mixed }],
    practice: [{ type: Schema.Types.Mixed }],
    checkpoints: [{ type: Schema.Types.Mixed }],
    interview: { type: Schema.Types.Mixed, default: {} },
    jobReadiness: { type: Schema.Types.Mixed, default: {} },
    validation: { type: Schema.Types.Mixed, default: {} },
    sources: [{ type: Schema.Types.Mixed }],
  },
  { timestamps: true }
);

export const Roadmap = mongoose.model<IRoadmap>('Roadmap', RoadmapSchema);
