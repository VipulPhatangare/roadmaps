import mongoose, { Document, Schema } from 'mongoose';

export type JobStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'PAUSED';

export interface IJobLog {
  timestamp: Date;
  agent: string;
  message: string;
  level: 'INFO' | 'WARN' | 'ERROR';
}

export interface IJobError {
  agent: string;
  message: string;
  attempt: number;
  timestamp: Date;
}

export interface IGenerationJob extends Document {
  domainId: mongoose.Types.ObjectId;
  domainName: string;
  status: JobStatus;
  phase: number;
  currentAgent: string;
  progress: number;
  startedAt: Date;
  completedAt: Date | null;
  pipelineErrors: IJobError[];
  logs: IJobLog[];
  createdAt: Date;
}

const GenerationJobSchema = new Schema<IGenerationJob>(
  {
    domainId: { type: Schema.Types.ObjectId, ref: 'Domain', required: true },
    domainName: { type: String, required: true },
    status: { type: String, enum: ['QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'PAUSED'], default: 'QUEUED' },
    phase: { type: Number, default: 0 },
    currentAgent: { type: String, default: '' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
    pipelineErrors: [
      {
        agent: String,
        message: String,
        attempt: Number,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    logs: [
      {
        timestamp: { type: Date, default: Date.now },
        agent: String,
        message: String,
        level: { type: String, enum: ['INFO', 'WARN', 'ERROR'], default: 'INFO' },
      },
    ],
  },
  { timestamps: true }
);

export const GenerationJob = mongoose.model<IGenerationJob>('GenerationJob', GenerationJobSchema);
