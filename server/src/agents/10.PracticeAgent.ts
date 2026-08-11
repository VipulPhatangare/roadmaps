import { BaseAgent } from './BaseAgent';

export interface PracticeInput {
  domain: string;
  domainType: string;
  skills: any[];
}

export interface PracticeItem {
  id: string;
  nodeId: string;
  type: 'CODING_CHALLENGE' | 'QUIZ' | 'CASE_STUDY' | 'CALCULATION' | 'DESIGN_EXERCISE' | 'SIMULATION' | 'DEBUGGING' | 'PRACTICAL_ASSIGNMENT';
  title: string;
  description: string;
  difficulty: string;
  estimatedMinutes: number;
}

export interface PracticeOutput {
  practice: PracticeItem[];
}

export class PracticeAgent extends BaseAgent<PracticeInput, PracticeOutput> {
  name = 'PracticeAgent';
  systemPrompt = `You are a learning practice activity creator.
Generate hands-on practice activities tailored to key skills in the domain.
Types:
- Software/Coding: CODING_CHALLENGE / DEBUGGING
- Engineering (Mechanical/Civil): CALCULATION / SIMULATION / DESIGN_EXERCISE
- Finance/Business: CASE_STUDY / CALCULATION
- Design: DESIGN_EXERCISE
Return JSON with key 'practice'.`;

  formatUserPrompt(input: PracticeInput): string {
    return JSON.stringify({
      domain: input.domain,
      domain_type: input.domainType,
      skills: input.skills.map((s) => ({ id: s.id, name: s.name })),
    });
  }

  validateOutput(output: any): PracticeOutput {
    const list = Array.isArray(output.practice) ? output.practice : [];
    return {
      practice: list.map((item: any, idx: number) => ({
        id: String(item.id || `prac_${idx + 1}`),
        nodeId: String(item.nodeId || 'general'),
        type: item.type || 'QUIZ',
        title: String(item.title || 'Practice Task'),
        description: String(item.description || ''),
        difficulty: item.difficulty || 'BEGINNER',
        estimatedMinutes: Number(item.estimatedMinutes || 30),
      })),
    };
  }
}
