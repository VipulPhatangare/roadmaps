import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CheckCircle2, Clock, Star } from 'lucide-react';

export interface CustomNodeData {
  title: string;
  category: string;
  level: string;
  estimatedHours: number;
  importance: number;
  completed: boolean;
  type: string;
}

export const SkillNode = memo(({ data }: { data: CustomNodeData }) => {
  const isCompleted = data.completed;
  const isFoundation = data.category === 'FOUNDATION';
  const isSpecialization = data.category === 'SPECIALIZATION';

  return (
    <div
      className={`group relative min-w-[200px] rounded-xl border p-4 shadow-xl transition-all duration-200 ${
        isCompleted
          ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-100 shadow-emerald-950/50'
          : isFoundation
          ? 'border-sky-500/50 bg-slate-900 text-sky-200'
          : isSpecialization
          ? 'border-purple-500/50 bg-slate-900 text-purple-200'
          : 'border-slate-700 bg-slate-900 text-slate-100 hover:border-indigo-500/50'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-indigo-500 !w-3 !h-3" />

      <div className="flex items-start justify-between gap-2">
        <span
          className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
            isCompleted
              ? 'bg-emerald-500/20 text-emerald-400'
              : isFoundation
              ? 'bg-sky-500/20 text-sky-400'
              : isSpecialization
              ? 'bg-purple-500/20 text-purple-400'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          {data.category}
        </span>
        {isCompleted && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
      </div>

      <h3 className="mt-2 text-sm font-bold tracking-tight text-white group-hover:text-indigo-300">
        {data.title}
      </h3>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          <span>{data.estimatedHours}h</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400/20 text-amber-400" />
          <span>{data.importance}/10</span>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-indigo-500 !w-3 !h-3" />
    </div>
  );
});

SkillNode.displayName = 'SkillNode';
