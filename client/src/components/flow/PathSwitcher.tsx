import React from 'react';
import { Sparkles } from 'lucide-react';
import { Specialization } from '../../types/roadmap.types';

interface PathSwitcherProps {
  specializations: Specialization[];
  selectedPathId: string;
  onSelectPath: (pathId: string) => void;
}

export const PathSwitcher: React.FC<PathSwitcherProps> = ({
  specializations,
  selectedPathId,
  onSelectPath,
}) => {
  if (!specializations || specializations.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/90 p-1.5 backdrop-blur-md">
      <span className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Path:
      </span>
      {specializations.map((spec) => {
        const isActive = selectedPathId === spec.id;
        return (
          <button
            key={spec.id}
            onClick={() => onSelectPath(spec.id)}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              isActive
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {spec.recommended && <Sparkles className="h-3.5 w-3.5 text-amber-400" />}
            {spec.name}
          </button>
        );
      })}
    </div>
  );
};
