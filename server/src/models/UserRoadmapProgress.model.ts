import mongoose, { Document, Schema } from 'mongoose';

export interface IUserRoadmapProgress extends Document {
  userId: mongoose.Types.ObjectId;
  roadmapId: mongoose.Types.ObjectId;
  domainSlug: string;
  selectedPathId: string;
  completedNodes: string[];
  completedProjects: string[];
  currentNodeId: string;
  percentComplete: number;
  startedAt: Date;
  lastActiveAt: Date;
}

const UserRoadmapProgressSchema = new Schema<IUserRoadmapProgress>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  roadmapId: { type: Schema.Types.ObjectId, ref: 'Roadmap', required: true },
  domainSlug: { type: String, required: true },
  selectedPathId: { type: String, default: '' },
  completedNodes: [{ type: String }],
  completedProjects: [{ type: String }],
  currentNodeId: { type: String, default: '' },
  percentComplete: { type: Number, default: 0, min: 0, max: 100 },
  startedAt: { type: Date, default: Date.now },
  lastActiveAt: { type: Date, default: Date.now },
});

UserRoadmapProgressSchema.index({ userId: 1, roadmapId: 1 }, { unique: true });

export const UserRoadmapProgress = mongoose.model<IUserRoadmapProgress>(
  'UserRoadmapProgress',
  UserRoadmapProgressSchema
);
