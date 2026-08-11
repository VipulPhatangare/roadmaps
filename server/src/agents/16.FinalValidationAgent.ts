import { GraphEngine } from '../services/GraphEngine';

export interface FinalValidationResult {
  valid: boolean;
  score: number;
  errors: string[];
  warnings: string[];
  publishable: boolean;
}

export class FinalValidationAgent {
  static validate(roadmap: any, criticScore: number = 90): FinalValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Check basic structure
    if (!roadmap.slug || !roadmap.domainId) {
      errors.push('Roadmap missing slug or domainId');
    }

    // 2. Check nodes & edges exist
    const nodes = Array.isArray(roadmap.nodes) ? roadmap.nodes : [];
    const edges = Array.isArray(roadmap.edges) ? roadmap.edges : [];

    if (nodes.length === 0) errors.push('Roadmap contains zero nodes');
    if (edges.length === 0) warnings.push('Roadmap contains zero edges');

    // 3. Unique node IDs
    const nodeIds = new Set<string>();
    nodes.forEach((n: any) => {
      if (nodeIds.has(n.id)) {
        errors.push(`Duplicate node ID found: ${n.id}`);
      }
      nodeIds.add(n.id);
    });

    // 4. Edge target validity
    edges.forEach((e: any) => {
      if (!nodeIds.has(e.source)) errors.push(`Edge source '${e.source}' does not exist in nodes`);
      if (!nodeIds.has(e.target)) errors.push(`Edge target '${e.target}' does not exist in nodes`);
    });

    // 5. Kahn's Cycle Detection
    const { hasCycle, cycleNodes } = GraphEngine.detectCycles(nodes, edges);
    if (hasCycle) {
      errors.push(`Circular dependency detected involving nodes: ${cycleNodes.join(', ')}`);
    }

    // 6. EXACTLY 5 Projects Requirement
    const projects = Array.isArray(roadmap.projects) ? roadmap.projects : [];
    if (projects.length !== 5) {
      errors.push(`Roadmap MUST contain exactly 5 projects. Found: ${projects.length}`);
    }

    // 7. Check resources
    const resources = Array.isArray(roadmap.resources) ? roadmap.resources : [];
    resources.forEach((r: any) => {
      if (!r.url || typeof r.url !== 'string') {
        warnings.push(`Resource '${r.title}' missing valid URL`);
      }
    });

    const valid = errors.length === 0;
    const publishable = valid && criticScore >= 75;

    return {
      valid,
      score: criticScore,
      errors,
      warnings,
      publishable,
    };
  }
}
