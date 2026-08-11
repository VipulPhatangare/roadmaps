import React, { useState } from 'react';
import { X, CheckCircle, Clock, CheckSquare, Square } from 'lucide-react';
import { RoadmapNode, Project } from '../../types/roadmap.types';

interface NodeDetailDrawerProps {
  node: RoadmapNode | null;
  projects: Project[];
  isCompleted: boolean;
  onClose: () => void;
  onMarkComplete: (nodeId: string) => void;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({
  node,
  projects,
  isCompleted,
  onClose,
  onMarkComplete,
}) => {
  const [checkedTopics, setCheckedTopics] = useState<Record<string, boolean>>({});

  if (!node) return null;

  const toggleTopic = (topic: string) => {
    setCheckedTopics((prev) => ({
      ...prev,
      [topic]: !prev[topic],
    }));
  };

  const topicsList = node.topics && node.topics.length > 0 ? node.topics : [
    'Core Fundamentals & Syntax',
    'Best Practices & Patterns',
    'Real-World Implementation',
    'Debugging & Performance',
  ];

  const completedCount = topicsList.filter((t) => checkedTopics[t]).length;
  const progressPercent = Math.round((completedCount / topicsList.length) * 100);

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-slate-800 bg-slate-950 p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <span className="rounded bg-indigo-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-400">
          {node.category}
        </span>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-900 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto pr-1">
        <h2 className="text-xl font-bold tracking-tight text-white">{node.title}</h2>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">{node.description}</p>

        {/* Estimated Time Badge */}
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-300">
          <Clock className="h-4 w-4 text-indigo-400" />
          <span>Estimated Time to Master: <strong>{node.estimatedHours} Hours</strong></span>
        </div>

        {node.whyLearn && (
          <div className="mt-4 rounded-lg bg-indigo-950/20 border border-indigo-900/40 p-3.5">
            <h4 className="text-xs font-semibold text-indigo-300">Why Learn This Skill?</h4>
            <p className="mt-1 text-xs text-indigo-200/80">{node.whyLearn}</p>
          </div>
        )}

        {/* DETAILED TOPICS CHECKLIST */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-200">
              <CheckSquare className="h-4 w-4 text-emerald-400" /> Specific Topics to Cover
            </h4>
            <span className="text-[11px] font-semibold text-emerald-400">
              {completedCount}/{topicsList.length} Ticked ({progressPercent}%)
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-3 space-y-2">
            {topicsList.map((topic, i) => {
              const isChecked = Boolean(checkedTopics[topic]);
              return (
                <div
                  key={i}
                  onClick={() => toggleTopic(topic)}
                  className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 transition ${
                    isChecked
                      ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-100'
                      : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <Square className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                  )}
                  <span className={`text-xs font-medium ${isChecked ? 'line-through opacity-80' : ''}`}>
                    {topic}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-800 pt-4">
        <button
          onClick={() => onMarkComplete(node.id)}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition shadow-lg ${
            isCompleted
              ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/30'
          }`}
        >
          <CheckCircle className="h-4 w-4" />
          {isCompleted ? 'Skill Mastered!' : 'Mark Skill Complete'}
        </button>
      </div>
    </div>
  );
};
