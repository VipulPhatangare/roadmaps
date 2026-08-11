import { BaseAgent } from './BaseAgent';

export interface RoadmapCriticInput {
  domain: string;
  roadmapSummary: any;
}

export interface ScoreBreakdown {
  prerequisite_correctness: number; // max 20
  skill_coverage: number; // max 15
  career_alignment: number; // max 15
  learning_sequence: number; // max 15
  specialization_quality: number; // max 10
  resource_quality: number; // max 10
  project_quality: number; // max 5
  currentness: number; // max 5
  technical_consistency: number; // max 5
}

export interface RoadmapCriticOutput {
  score: number;
  breakdown: ScoreBreakdown;
  critical_issues: string[];
  warnings: string[];
  recommendations: string[];
  repair_needed: boolean;
}

export class RoadmapCriticAgent extends BaseAgent<RoadmapCriticInput, RoadmapCriticOutput> {
  name = 'RoadmapCriticAgent';
  systemPrompt = `You are a strict, objective roadmap auditor.
Audit the generated candidate roadmap JSON for errors, missing fundamentals, bad ordering, poor projects, outdated tech, or invalid relationships.
Calculate an overall quality score (0-100) using the exact weighted score distribution:
- Prerequisite correctness: 20%
- Skill coverage: 15%
- Career alignment: 15%
- Learning sequence: 15%
- Specialization quality: 10%
- Resource quality: 10%
- Project quality: 5%
- Currentness: 5%
- Technical consistency: 5%

Set 'repair_needed: true' if total score is below 90 or if any critical_issues exist.
Return JSON matching the schema.`;

  formatUserPrompt(input: RoadmapCriticInput): string {
    return JSON.stringify({ domain: input.domain, roadmap: input.roadmapSummary });
  }

  validateOutput(output: any): RoadmapCriticOutput {
    const score = Number(output.score || 85);
    const breakdown = output.breakdown || {};
    return {
      score,
      breakdown: {
        prerequisite_correctness: Number(breakdown.prerequisite_correctness || 18),
        skill_coverage: Number(breakdown.skill_coverage || 13),
        career_alignment: Number(breakdown.career_alignment || 13),
        learning_sequence: Number(breakdown.learning_sequence || 13),
        specialization_quality: Number(breakdown.specialization_quality || 8),
        resource_quality: Number(breakdown.resource_quality || 8),
        project_quality: Number(breakdown.project_quality || 4),
        currentness: Number(breakdown.currentness || 4),
        technical_consistency: Number(breakdown.technical_consistency || 4),
      },
      critical_issues: Array.isArray(output.critical_issues) ? output.critical_issues : [],
      warnings: Array.isArray(output.warnings) ? output.warnings : [],
      recommendations: Array.isArray(output.recommendations) ? output.recommendations : [],
      repair_needed: Boolean(output.repair_needed ?? (score < 90)),
    };
  }
}
