import { BaseAgent } from './BaseAgent';
import { SkillItem } from './03.SkillDiscoveryAgent';

export interface SpecializationInput {
  domain: string;
  skills: SkillItem[];
  relationships: any[];
}

export interface SpecializationItem {
  id: string;
  name: string;
  recommended: boolean;
  description: string;
  commonFoundation: string[];
  specializationNodes: string[];
  careerRoles: string[];
  estimatedMonths: number;
}

export interface SpecializationOutput {
  has_specializations: boolean;
  common_foundation: string[];
  specializations: SpecializationItem[];
}

export class SpecializationAgent extends BaseAgent<SpecializationInput, SpecializationOutput> {
  name = 'SpecializationAgent';
  systemPrompt = `You are a career pathway architect.
Determine if the domain contains multiple valid specialization paths (e.g. React vs Angular vs Vue for Frontend; CAD vs CAE for Mechanical).
Identify common foundation skills shared by all paths, and specialization-specific skills.
If only one dominant path exists, return 1 path.
Return JSON matching the schema.`;

  formatUserPrompt(input: SpecializationInput): string {
    return JSON.stringify({
      domain: input.domain,
      skills: input.skills.map((s) => ({ id: s.id, name: s.name, category: s.category })),
    });
  }

  validateOutput(output: any): SpecializationOutput {
    const specs = Array.isArray(output.specializations) ? output.specializations : [];
    return {
      has_specializations: Boolean(output.has_specializations ?? specs.length > 1),
      common_foundation: Array.isArray(output.common_foundation) ? output.common_foundation : [],
      specializations: specs.map((sp: any, idx: number) => ({
        id: String(sp.id || `spec_${idx + 1}`),
        name: String(sp.name || 'Specialization'),
        recommended: Boolean(sp.recommended ?? (idx === 0)),
        description: String(sp.description || ''),
        commonFoundation: Array.isArray(sp.commonFoundation) ? sp.commonFoundation : [],
        specializationNodes: Array.isArray(sp.specializationNodes) ? sp.specializationNodes : [],
        careerRoles: Array.isArray(sp.careerRoles) ? sp.careerRoles : [],
        estimatedMonths: Number(sp.estimatedMonths || 6),
      })),
    };
  }
}
