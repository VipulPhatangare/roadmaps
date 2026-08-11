import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Cpu, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { domainsApi } from '../../api/domains.api';
import { Domain } from '../../types/roadmap.types';

export const AdminGeneration: React.FC = () => {
  const { data } = useQuery({
    queryKey: ['generation-monitor'],
    queryFn: async () => {
      const res = await domainsApi.getAll({ limit: 300 });
      return res.data.domains as Domain[];
    },
    refetchInterval: 3000,
  });

  const domains = data || [];
  const activeDomains = domains.filter((d) => d.status === 'GENERATING' || d.status === 'ANALYZING');
  const completedDomains = domains.filter((d) => d.status === 'PUBLISHED');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">Live Batch Monitor</h1>
          <p className="mt-1 text-sm text-slate-400">Real-time status of the 5-Worker parallel queue</p>
        </div>
        <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400">
          5 Concurrency Workers
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Active Worker Jobs */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
          <h3 className="flex items-center gap-2 text-sm font-bold text-white">
            <Cpu className="h-4 w-4 text-amber-400 animate-spin" /> Active Pipeline Jobs ({activeDomains.length})
          </h3>
          <div className="mt-4 space-y-3">
            {activeDomains.length > 0 ? (
              activeDomains.map((d) => (
                <div key={d._id} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{d.name}</span>
                    <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 animate-pulse">
                      Processing...
                    </span>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-2/3 bg-indigo-500 animate-pulse" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No active generation jobs running right now.</p>
            )}
          </div>
        </div>

        {/* Recently Published */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
          <h3 className="flex items-center gap-2 text-sm font-bold text-white">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Recently Published Roadmaps ({completedDomains.length})
          </h3>
          <div className="mt-4 space-y-2">
            {completedDomains.slice(0, 6).map((d) => (
              <div key={d._id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs">
                <span className="font-semibold text-white">{d.name}</span>
                <span className="font-bold text-emerald-400">Score: {d.validationScore}/100</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
