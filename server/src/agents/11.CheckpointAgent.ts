import { BaseAgent } from './BaseAgent';

export interface CheckpointInput {
  domain: string;
  paths: any[];
}

export interface CheckpointItem {
  id: string;
  title: string;
  afterNodes: string[];
  requiredSkills: string[];
  quizQuestions: number;
  miniProject: string;
  passingCriteria: string;
  estimatedHours: number;
}

export interface CheckpointOutput {
  checkpoints: CheckpointItem[];
}

export class CheckpointAgent extends BaseAgent<CheckpointInput, CheckpointOutput> {
  name = 'CheckpointAgent';
  systemPrompt = `You are an educational milestone designer.
Create 2-3 evaluation checkpoints placed after major stages in the learning roadmap (e.g. after Common Foundations, after Intermediate Skills, and before Capstone).
Return JSON with key 'checkpoints'.`;

  formatUserPrompt(input: CheckpointInput): string {
    return JSON.stringify({ domain: input.domain, paths: input.paths });
  }

  validateOutput(output: any): CheckpointOutput {
    const list = Array.isArray(output.checkpoints) ? output.checkpoints : [];
    return {
      checkpoints: list.map((cp: any, idx: number) => ({
        id: String(cp.id || `cp_00${idx + 1}`),
        title: String(cp.title || `Checkpoint ${idx + 1}`),
        afterNodes: Array.isArray(cp.afterNodes) ? cp.afterNodes : [],
        requiredSkills: Array.isArray(cp.requiredSkills) ? cp.requiredSkills : [],
        quizQuestions: Number(cp.quizQuestions || 5),
        miniProject: String(cp.miniProject || ''),
        passingCriteria: String(cp.passingCriteria || 'Score 80%+ on quiz'),
        estimatedHours: Number(cp.estimatedHours || 4),
      })),
    };
  }
}
