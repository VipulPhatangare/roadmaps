import mongoose, { Document, Schema } from 'mongoose';

export interface IAgentExecution extends Document {
  jobId: mongoose.Types.ObjectId;
  agentName: string;
  domainName: string;
  status: 'RUNNING' | 'SUCCESS' | 'FAILED' | 'RETRYING';
  attempt: number;
  inputHash: string;
  outputHash: string;
  tokensUsed: number;
  durationMs: number;
  error: string | null;
  startedAt: Date;
  completedAt: Date | null;
}

const AgentExecutionSchema = new Schema<IAgentExecution>({
  jobId: { type: Schema.Types.ObjectId, ref: 'GenerationJob', required: true },
  agentName: { type: String, required: true },
  domainName: { type: String, required: true },
  status: { type: String, enum: ['RUNNING', 'SUCCESS', 'FAILED', 'RETRYING'], default: 'RUNNING' },
  attempt: { type: Number, default: 1 },
  inputHash: { type: String, default: '' },
  outputHash: { type: String, default: '' },
  tokensUsed: { type: Number, default: 0 },
  durationMs: { type: Number, default: 0 },
  error: { type: String, default: null },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null },
});

export const AgentExecution = mongoose.model<IAgentExecution>('AgentExecution', AgentExecutionSchema);
