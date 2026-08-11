import { BaseAgent } from './BaseAgent';

export interface RoadmapRepairInput {
  domain: string;
  roadmapSummary: any;
  criticResults: any;
}

export interface RoadmapRepairOutput {
  changes: { type: string; details: string }[];
  patchedSkills: any[];
  patchedRelationships: any[];
}

export class RoadmapRepairAgent extends BaseAgent<RoadmapRepairInput, RoadmapRepairOutput> {
  name = 'RoadmapRepairAgent';
  systemPrompt = `You are a surgical roadmap repair agent.
Review the identified issues from the Critic Agent and provide targeted patches to resolve missing skills, bad prerequisites, or weak descriptions.
Do NOT regenerate the entire roadmap. Apply targeted patches only.
Return JSON with key 'changes', 'patchedSkills', and 'patchedRelationships'.`;

  formatUserPrompt(input: RoadmapRepairInput): string {
    return JSON.stringify({
      domain: input.domain,
      issues: input.criticResults.critical_issues,
      recommendations: input.criticResults.recommendations,
    });
  }

  validateOutput(output: any): RoadmapRepairOutput {
    return {
      changes: Array.isArray(output.changes) ? output.changes : [],
      patchedSkills: Array.isArray(output.patchedSkills) ? output.patchedSkills : [],
      patchedRelationships: Array.isArray(output.patchedRelationships) ? output.patchedRelationships : [],
    };
  }
}
