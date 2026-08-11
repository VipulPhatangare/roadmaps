import { BaseAgent } from './BaseAgent';

export interface ProjectGeneratorInput {
  domain: string;
  domainType: string;
  skills: any[];
}

export interface ProjectItem {
  id: string;
  title: string;
  shortDescription: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'CAPSTONE';
  skills: string[];
  estimatedHours: number;
  learningOutcomes: string[];
  requirements: string[];
  realWorld: boolean;
}

export interface ProjectGeneratorOutput {
  projects: ProjectItem[];
}

export class ProjectGeneratorAgent extends BaseAgent<ProjectGeneratorInput, ProjectGeneratorOutput> {
  name = 'ProjectGeneratorAgent';
  systemPrompt = `You are a practical project curriculum designer.
Generate EXACTLY 5 practical projects for the domain.
CRITICAL CONSTRAINT: You MUST return EXACTLY 5 projects (no more, no less).
Progressive Difficulty Distribution:
- Project 1: BEGINNER (Foundational project)
- Project 2: INTERMEDIATE (Multi-skill integration)
- Project 3: INTERMEDIATE/ADVANCED (Specialization path project)
- Project 4: ADVANCED (Complex real-world project)
- Project 5: CAPSTONE (Full production-ready / industry standard capstone)

Adapt projects strictly to the domain:
- Programming: Web/software applications
- Mechanical: CAD/SolidWorks design, thermal simulation, mechanical assembly
- Civil: Structural analysis, building estimation, construction site plan
- Finance: Valuation model, financial statement case study
- Marketing: Digital growth campaign, brand launch strategy

Return JSON with key 'projects' containing an array of EXACTLY 5 items.`;

  formatUserPrompt(input: ProjectGeneratorInput): string {
    return JSON.stringify({
      domain: input.domain,
      domain_type: input.domainType,
      skills_sample: input.skills.slice(0, 10).map((s) => s.name),
    });
  }

  validateOutput(output: any): ProjectGeneratorOutput {
    if (!output.projects || !Array.isArray(output.projects)) {
      throw new Error('ProjectGeneratorAgent output missing projects array');
    }
    if (output.projects.length !== 5) {
      throw new Error(`ProjectGeneratorAgent MUST return exactly 5 projects, got ${output.projects.length}`);
    }

    const difficulties: ('BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'CAPSTONE')[] = [
      'BEGINNER',
      'INTERMEDIATE',
      'INTERMEDIATE',
      'ADVANCED',
      'CAPSTONE',
    ];

    return {
      projects: output.projects.map((p: any, idx: number) => ({
        id: String(p.id || `proj_00${idx + 1}`),
        title: String(p.title || `Project ${idx + 1}`),
        shortDescription: String(p.shortDescription || ''),
        difficulty: p.difficulty || difficulties[idx],
        skills: Array.isArray(p.skills) ? p.skills : [],
        estimatedHours: Number(p.estimatedHours || (idx + 1) * 15),
        learningOutcomes: Array.isArray(p.learningOutcomes) ? p.learningOutcomes : [],
        requirements: Array.isArray(p.requirements) ? p.requirements : [],
        realWorld: Boolean(p.realWorld ?? (idx >= 3)),
      })),
    };
  }
}
