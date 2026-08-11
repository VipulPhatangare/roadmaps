import { BaseAgent } from './BaseAgent';

export interface PathArchitectInput {
  domain: string;
  skills: any[];
  relationships: any[];
  specializations: any[];
}

export interface PathItem {
  id: string;
  name: string;
  ordered_nodes: string[];
  common_nodes: string[];
  specialization_nodes: string[];
  total_hours: number;
  total_months: number;
}

export interface PathArchitectOutput {
  paths: PathItem[];
  recommended_path_id: string;
}

export class PathArchitectAgent extends BaseAgent<PathArchitectInput, PathArchitectOutput> {
  name = 'PathArchitectAgent';
  systemPrompt = `You are a learning path topology architect.
Assemble the common foundation and specialization nodes into ordered learning paths.
Ensure nodes are placed in logically correct learning order.
Do NOT duplicate common foundation nodes across paths.
Return JSON with key 'paths' and 'recommended_path_id'.`;

  formatUserPrompt(input: PathArchitectInput): string {
    return JSON.stringify({
      domain: input.domain,
      skills_count: input.skills.length,
      specializations: input.specializations.map((s) => ({ id: s.id, name: s.name })),
    });
  }

  validateOutput(output: any): PathArchitectOutput {
    const paths = Array.isArray(output.paths) ? output.paths : [];
    if (paths.length === 0) {
      throw new Error('PathArchitectAgent output missing paths array');
    }
    return {
      paths: paths.map((p: any, idx: number) => ({
        id: String(p.id || `path_${idx + 1}`),
        name: String(p.name || 'Learning Path'),
        ordered_nodes: Array.isArray(p.ordered_nodes) ? p.ordered_nodes : [],
        common_nodes: Array.isArray(p.common_nodes) ? p.common_nodes : [],
        specialization_nodes: Array.isArray(p.specialization_nodes) ? p.specialization_nodes : [],
        total_hours: Number(p.total_hours || 200),
        total_months: Number(p.total_months || 6),
      })),
      recommended_path_id: String(output.recommended_path_id || paths[0]?.id || 'default'),
    };
  }
}
