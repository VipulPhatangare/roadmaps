export interface SimpleNode {
  id: string;
  title: string;
  prerequisites?: string[];
  specializationId?: string | null;
}

export interface SimpleEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
}

export class GraphEngine {
  /**
   * Kahn's Algorithm for Cycle Detection
   * Returns true if cycles exist.
   */
  static detectCycles(nodes: SimpleNode[], edges: SimpleEdge[]): { hasCycle: boolean; cycleNodes: string[] } {
    const inDegree = new Map<string, number>();
    const adj = new Map<string, string[]>();

    nodes.forEach((n) => {
      inDegree.set(n.id, 0);
      adj.set(n.id, []);
    });

    edges.forEach((e) => {
      if (inDegree.has(e.target)) {
        inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
      }
      if (adj.has(e.source)) {
        adj.get(e.source)!.push(e.target);
      }
    });

    const queue: string[] = [];
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) queue.push(nodeId);
    });

    let visitedCount = 0;
    while (queue.length > 0) {
      const current = queue.shift()!;
      visitedCount++;

      const neighbors = adj.get(current) || [];
      neighbors.forEach((neighbor) => {
        const d = (inDegree.get(neighbor) || 0) - 1;
        inDegree.set(neighbor, d);
        if (d === 0) queue.push(neighbor);
      });
    }

    const hasCycle = visitedCount < nodes.length;
    const cycleNodes: string[] = [];
    if (hasCycle) {
      inDegree.forEach((d, nodeId) => {
        if (d > 0) cycleNodes.push(nodeId);
      });
    }

    return { hasCycle, cycleNodes };
  }

  /**
   * Topological Sort
   */
  static topologicalSort(nodes: SimpleNode[], edges: SimpleEdge[]): string[] {
    const inDegree = new Map<string, number>();
    const adj = new Map<string, string[]>();

    nodes.forEach((n) => {
      inDegree.set(n.id, 0);
      adj.set(n.id, []);
    });

    edges.forEach((e) => {
      if (inDegree.has(e.target)) {
        inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
      }
      if (adj.has(e.source)) {
        adj.get(e.source)!.push(e.target);
      }
    });

    const queue: string[] = [];
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) queue.push(nodeId);
    });

    const sorted: string[] = [];
    while (queue.length > 0) {
      const current = queue.shift()!;
      sorted.push(current);

      const neighbors = adj.get(current) || [];
      neighbors.forEach((neighbor) => {
        const d = (inDegree.get(neighbor) || 0) - 1;
        inDegree.set(neighbor, d);
        if (d === 0) queue.push(neighbor);
      });
    }

    return sorted;
  }

  /**
   * Detect Orphan Nodes (nodes with 0 incoming and 0 outgoing edges, not marked as root)
   */
  static detectOrphans(nodes: SimpleNode[], edges: SimpleEdge[]): string[] {
    const connected = new Set<string>();
    edges.forEach((e) => {
      connected.add(e.source);
      connected.add(e.target);
    });

    return nodes.filter((n) => !connected.has(n.id)).map((n) => n.id);
  }
}
