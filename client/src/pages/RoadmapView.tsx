import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2,
  Clock,
  ChevronRight,
  ListFilter,
} from 'lucide-react';
import { roadmapsApi } from '../api/roadmaps.api';
import { userApi } from '../api/user.api';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { NodeDetailDrawer } from '../components/flow/NodeDetailDrawer';
import { PathSwitcher } from '../components/flow/PathSwitcher';
import { Roadmap, RoadmapNode } from '../types/roadmap.types';

export const RoadmapView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const {
    currentRoadmap,
    selectedPathId,
    selectedNode,
    completedNodes,
    setRoadmap,
    setPath,
    selectNode,
    markNodeComplete,
    loadCompletedNodes,
  } = useRoadmapStore();

  const { data: roadmapData, isLoading } = useQuery({
    queryKey: ['roadmap', slug],
    queryFn: async () => {
      const res = await roadmapsApi.getBySlug(slug!);
      return res.data.roadmap as Roadmap;
    },
    enabled: Boolean(slug),
  });

  useEffect(() => {
    if (roadmapData) {
      setRoadmap(roadmapData);
      userApi.getProgress(roadmapData._id).then((res) => {
        if (res.data.progress?.completedNodes) {
          loadCompletedNodes(res.data.progress.completedNodes);
        }
      });
    }
  }, [roadmapData]);

  if (isLoading || !currentRoadmap) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-[#020617]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <p className="text-xs text-slate-400">Loading learning roadmap...</p>
        </div>
      </div>
    );
  }

  const activePath = currentRoadmap.paths?.find((p: any) => p.id === selectedPathId);
  const activeNodeIds =
    activePath?.ordered_nodes && activePath.ordered_nodes.length > 0
      ? new Set(activePath.ordered_nodes)
      : null;

  const baseNodes = activeNodeIds
    ? currentRoadmap.nodes.filter((n) => activeNodeIds.has(n.id))
    : currentRoadmap.nodes;

  const filteredNodes =
    filterCategory === 'ALL'
      ? baseNodes
      : baseNodes.filter((n) => n.category === filterCategory);

  const handleMarkComplete = (nodeId: string) => {
    markNodeComplete(nodeId);
    userApi.completeNode(currentRoadmap._id, nodeId);
  };

  return (
    <div className="min-h-screen bg-[#020617] pb-16 text-slate-100">
      {/* Header bar */}
      <div className="sticky top-16 z-30 border-b border-slate-800 bg-slate-950/90 px-4 py-4 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold tracking-tight text-white uppercase">
                {currentRoadmap.slug.replace(/-/g, ' ')}
              </h1>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                {currentRoadmap.status || 'PUBLISHED'}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {currentRoadmap.nodes?.length} Detailed Skill Modules • {currentRoadmap.overview?.estimatedMonths || 6} Months Learning Plan
            </p>
          </div>

          {/* Path Switcher */}
          <PathSwitcher
            specializations={currentRoadmap.specializations}
            selectedPathId={selectedPathId}
            onSelectPath={setPath}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Category Filter Tabs */}
        <div className="flex items-center justify-between gap-4 overflow-x-auto border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <ListFilter className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Filter Skills:</span>
            {['ALL', 'FOUNDATION', 'CORE', 'SPECIALIZATION', 'TOOL', 'ADVANCED'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  filterCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400">
            Showing <strong className="text-white">{filteredNodes.length}</strong> modules
          </span>
        </div>

        {/* GRANULAR TABLE VIEW */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-bold">#</th>
                  <th className="p-4 font-bold">Specific Topic / Skill Module</th>
                  <th className="p-4 font-bold">Category</th>
                  <th className="p-4 font-bold">Est. Time</th>
                  <th className="p-4 font-bold">Topics Included</th>
                  <th className="p-4 font-bold text-center">Status</th>
                  <th className="p-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredNodes.map((node, index) => {
                  const isDone = completedNodes.has(node.id);
                  const topicCount = node.topics?.length || 0;
                  return (
                    <tr
                      key={node.id}
                      onClick={() => selectNode(node)}
                      className={`cursor-pointer transition hover:bg-slate-800/60 ${
                        isDone ? 'bg-emerald-950/10' : ''
                      }`}
                    >
                      <td className="p-4 font-mono font-bold text-slate-500">{index + 1}</td>
                      <td className="p-4">
                        <span className="font-bold text-white group-hover:text-indigo-300 text-sm block">
                          {node.title}
                        </span>
                        <p className="mt-0.5 max-w-md truncate text-[11px] text-slate-400">
                          {node.description}
                        </p>
                      </td>

                      <td className="p-4">
                        <span
                          className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            node.category === 'FOUNDATION'
                              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                              : node.category === 'SPECIALIZATION'
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              : node.category === 'TOOL'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : node.category === 'ADVANCED'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          }`}
                        >
                          {node.category}
                        </span>
                      </td>

                      <td className="p-4 font-medium text-slate-300">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-slate-500" />
                          <span>{node.estimatedHours}h</span>
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-slate-300">
                        <span className="rounded bg-slate-800 px-2 py-1 text-[11px] text-indigo-300">
                          {topicCount} Topics to Cover
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkComplete(node.id);
                          }}
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                            isDone
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white'
                          }`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {isDone ? 'Done' : 'Mark Done'}
                        </button>
                      </td>

                      <td className="p-4 text-right">
                        <button className="rounded-lg bg-indigo-600/20 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-600/40">
                          View Checklist →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Slide-over Drawer for Granular Topic Checklist */}
      <NodeDetailDrawer
        node={selectedNode}
        projects={[]}
        isCompleted={selectedNode ? completedNodes.has(selectedNode.id) : false}
        onClose={() => selectNode(null)}
        onMarkComplete={handleMarkComplete}
      />
    </div>
  );
};
