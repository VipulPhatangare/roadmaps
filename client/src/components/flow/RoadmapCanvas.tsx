import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { SkillNode } from './SkillNode';
import { RoadmapNode, RoadmapEdge } from '../../types/roadmap.types';

const nodeTypes = {
  skill: SkillNode,
};

interface RoadmapCanvasProps {
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  completedNodes: Set<string>;
  onNodeClick: (node: RoadmapNode) => void;
}

export const RoadmapCanvas: React.FC<RoadmapCanvasProps> = ({
  nodes,
  edges,
  completedNodes,
  onNodeClick,
}) => {
  const { flowNodes, flowEdges } = useMemo(() => {
    if (!nodes || nodes.length === 0) {
      return { flowNodes: [], flowEdges: [] };
    }

    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: 'TB', nodesep: 100, ranksep: 120 });
    g.setDefaultEdgeLabel(() => ({}));

    nodes.forEach((n) => {
      g.setNode(n.id, { width: 240, height: 100 });
    });

    edges.forEach((e) => {
      if (g.hasNode(e.source) && g.hasNode(e.target)) {
        g.setEdge(e.source, e.target);
      }
    });

    dagre.layout(g);

    const flowNodes: Node[] = nodes.map((n, idx) => {
      const nodeWithPos = g.node(n.id);
      const x = nodeWithPos && !isNaN(nodeWithPos.x) ? nodeWithPos.x - 120 : (idx % 3) * 280;
      const y = nodeWithPos && !isNaN(nodeWithPos.y) ? nodeWithPos.y - 50 : Math.floor(idx / 3) * 150;

      return {
        id: n.id,
        type: 'skill',
        position: { x, y },
        data: {
          title: n.title,
          category: n.category || 'CORE',
          level: n.level || 'BEGINNER',
          estimatedHours: n.estimatedHours || 10,
          importance: n.importance || 5,
          completed: completedNodes.has(n.id),
          type: n.type,
          originalNode: n,
        },
      };
    });

    const flowEdges: Edge[] = edges.map((e) => ({
      id: e.id || `e_${e.source}_to_${e.target}`,
      source: e.source,
      target: e.target,
      animated: e.relationship === 'RECOMMENDED',
      style: {
        stroke: e.relationship === 'PREREQUISITE' ? '#6366f1' : '#38bdf8',
        strokeWidth: e.strength === 'STRONG' ? 2.5 : 1.5,
      },
    }));

    return { flowNodes, flowEdges };
  }, [nodes, edges, completedNodes]);

  return (
    <div className="h-full min-h-[500px] w-full bg-[#020617]">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => {
          if (node.data?.originalNode) {
            onNodeClick(node.data.originalNode as RoadmapNode);
          }
        }}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.1}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
        attributionPosition="bottom-right"
      >
        <Background color="#1e293b" gap={24} size={1} />
        <Controls />
        <MiniMap nodeColor={() => '#6366f1'} />
      </ReactFlow>
    </div>
  );
};
