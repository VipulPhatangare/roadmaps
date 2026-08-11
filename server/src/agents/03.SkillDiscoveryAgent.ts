import { BaseAgent } from './BaseAgent';

export interface SkillDiscoveryInput {
  domain: string;
  domainType: string;
  careerRoles: any[];
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'FOUNDATION' | 'CORE' | 'SPECIALIZATION' | 'ADVANCED' | 'TOOL' | 'SOFT_SKILL' | 'CAREER';
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  importance: number;
  description: string;
  why_it_matters: string;
  topics: string[];
  estimated_hours: number;
  optional: boolean;
}

export interface SkillDiscoveryOutput {
  skills: SkillItem[];
}

export class SkillDiscoveryAgent extends BaseAgent<SkillDiscoveryInput, SkillDiscoveryOutput> {
  name = 'SkillDiscoveryAgent';
  systemPrompt = `You are a skill taxonomy expert.
Discover all genuine, essential skills required for mastery in the specified domain.
Categorize skills into FOUNDATION, CORE, SPECIALIZATION, ADVANCED, TOOL, SOFT_SKILL.
Avoid listing obsolete or unnecessary clutter.
Ensure skill IDs are clean lower-case hyphenated slugs (e.g., 'javascript', 'cad-modeling', 'financial-accounting').
Return JSON with key 'skills'.`;

  formatUserPrompt(input: SkillDiscoveryInput): string {
    return JSON.stringify({
      domain: input.domain,
      domain_type: input.domainType,
      career_roles: input.careerRoles.map((r) => r.name),
    });
  }

  validateOutput(output: any): SkillDiscoveryOutput {
    if (!output.skills || !Array.isArray(output.skills) || output.skills.length === 0) {
      throw new Error('SkillDiscoveryAgent output missing valid skills array');
    }
    return {
      skills: output.skills.map((s: any) => ({
        id: String(s.id).toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        name: String(s.name),
        category: s.category || 'CORE',
        level: s.level || 'BEGINNER',
        importance: Number(s.importance || 5),
        description: String(s.description || ''),
        why_it_matters: String(s.why_it_matters || ''),
        topics: Array.isArray(s.topics) ? s.topics : [],
        estimated_hours: Number(s.estimated_hours || 20),
        optional: Boolean(s.optional ?? false),
      })),
    };
  }
}
