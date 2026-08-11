import { BaseAgent } from './BaseAgent';
import { SkillItem } from './03.SkillDiscoveryAgent';

export interface PrerequisiteInput {
  domain: string;
  skills: SkillItem[];
}

export interface RelationshipItem {
  source: string;
  target: string;
  relationship: 'PREREQUISITE' | 'RECOMMENDED' | 'OPTIONAL' | 'ALTERNATIVE' | 'SPECIALIZATION' | 'ADVANCED' | 'RELATED';
  strength: 'STRONG' | 'MEDIUM' | 'WEAK';
  reason: string;
}

export interface PrerequisiteOutput {
  relationships: RelationshipItem[];
}

export class PrerequisiteAgent extends BaseAgent<PrerequisiteInput, PrerequisiteOutput> {
  name = 'PrerequisiteAgent';
  systemPrompt = `You are a learning sequence & prerequisite specialist.
Analyze the provided skill list and determine direct prerequisite relationships.
Rule: Do NOT create circular dependencies (e.g. A -> B -> A).
All source and target IDs MUST exist in the provided skill list.
Return JSON with key 'relationships'.`;

  formatUserPrompt(input: PrerequisiteInput): string {
    const skillList = input.skills.map((s) => ({ id: s.id, name: s.name, category: s.category }));
    return JSON.stringify({ domain: input.domain, skills: skillList });
  }

  validateOutput(output: any): PrerequisiteOutput {
    if (!output.relationships || !Array.isArray(output.relationships)) {
      throw new Error('PrerequisiteAgent output missing relationships array');
    }
    return {
      relationships: output.relationships.map((r: any) => ({
        source: String(r.source).toLowerCase(),
        target: String(r.target).toLowerCase(),
        relationship: r.relationship || 'PREREQUISITE',
        strength: r.strength || 'STRONG',
        reason: String(r.reason || ''),
      })),
    };
  }
}
