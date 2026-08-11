import { BaseAgent } from './BaseAgent';
import { DomainExplorerOutput } from './01.DomainAnalyzerAgent';

export interface CareerRoleInput {
  domainInfo: DomainExplorerOutput;
}

export interface CareerRoleItem {
  id: string;
  name: string;
  description: string;
  required_skills: string[];
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  salary_range: string;
  demand: 'HIGH' | 'MEDIUM' | 'STABLE';
}

export interface CareerRoleOutput {
  career_roles: CareerRoleItem[];
}

export class CareerRoleAgent extends BaseAgent<CareerRoleInput, CareerRoleOutput> {
  name = 'CareerRoleAgent';
  systemPrompt = `You are a career strategist.
Based on the domain analysis, identify 3-5 realistic, high-impact job roles for a learner in this domain.
Return raw JSON: { "career_roles": [ { "id": "role_1", "name": "Role Name", "description": "...", "required_skills": ["skill1"], "priority": "HIGH", "salary_range": "Entry-Senior", "demand": "HIGH" } ] }`;

  formatUserPrompt(input: CareerRoleInput): string {
    return JSON.stringify({ domain: input.domainInfo.domain, category: input.domainInfo.category });
  }

  validateOutput(output: any): CareerRoleOutput {
    const rolesArray = Array.isArray(output.career_roles)
      ? output.career_roles
      : Array.isArray(output.roles)
      ? output.roles
      : Array.isArray(output.careerRoles)
      ? output.careerRoles
      : [];

    if (rolesArray.length === 0) {
      // Fallback
      return {
        career_roles: [
          {
            id: 'primary-role',
            name: 'Primary Domain Specialist',
            description: 'Core professional in this domain',
            required_skills: ['core-skill'],
            priority: 'HIGH',
            salary_range: 'Standard',
            demand: 'HIGH',
          },
        ],
      };
    }

    return {
      career_roles: rolesArray.map((r: any, idx: number) => ({
        id: String(r.id || `role_${idx + 1}`),
        name: String(r.name || r.title || 'Role'),
        description: String(r.description || ''),
        required_skills: Array.isArray(r.required_skills) ? r.required_skills : Array.isArray(r.skills) ? r.skills : [],
        priority: r.priority || 'HIGH',
        salary_range: String(r.salary_range || 'Industry standard'),
        demand: r.demand || 'HIGH',
      })),
    };
  }
}
