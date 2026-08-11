import { create } from 'zustand';
import { Roadmap, RoadmapNode } from '../types/roadmap.types';

interface RoadmapState {
  currentRoadmap: Roadmap | null;
  selectedPathId: string;
  selectedNode: RoadmapNode | null;
  completedNodes: Set<string>;
  setRoadmap: (roadmap: Roadmap) => void;
  setPath: (pathId: string) => void;
  selectNode: (node: RoadmapNode | null) => void;
  markNodeComplete: (nodeId: string) => void;
  loadCompletedNodes: (nodeIds: string[]) => void;
}

export const useRoadmapStore = create<RoadmapState>((set) => ({
  currentRoadmap: null,
  selectedPathId: '',
  selectedNode: null,
  completedNodes: new Set(),
  setRoadmap: (roadmap) =>
    set({
      currentRoadmap: roadmap,
      selectedPathId: roadmap.paths?.[0]?.id || '',
    }),
  setPath: (pathId) => set({ selectedPathId: pathId }),
  selectNode: (node) => set({ selectedNode: node }),
  markNodeComplete: (nodeId) =>
    set((state) => ({ completedNodes: new Set([...state.completedNodes, nodeId]) })),
  loadCompletedNodes: (nodeIds) => set({ completedNodes: new Set(nodeIds) }),
}));
