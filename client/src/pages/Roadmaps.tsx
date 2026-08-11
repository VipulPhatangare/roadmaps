import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, Map, Clock, CheckCircle2 } from 'lucide-react';
import { roadmapsApi } from '../api/roadmaps.api';
import { Roadmap } from '../types/roadmap.types';

export const Roadmaps: React.FC = () => {
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['roadmaps'],
    queryFn: async () => {
      const res = await roadmapsApi.getAll();
      return res.data.roadmaps as Roadmap[];
    },
  });

  const filteredRoadmaps = (data || []).filter((r) =>
    r.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">Explore Roadmaps</h1>
          <p className="mt-1 text-sm text-slate-400">Discover structured, AI-validated learning graphs across multiple domains</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search domain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="mt-12 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        </div>
      ) : filteredRoadmaps.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRoadmaps.map((r) => (
            <Link
              key={r._id}
              to={`/roadmaps/${r.slug}`}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md transition hover:border-indigo-500/50 hover:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    {r.overview?.difficulty || 'BEGINNER'}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {r.status || 'PUBLISHED'}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-lg font-bold text-white group-hover:text-indigo-300">
                  {r.slug.replace(/-/g, ' ').toUpperCase()}
                </h3>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{r.overview?.estimatedMonths || 6} Months</span>
                </div>
                <div className="flex items-center gap-1">
                  <Map className="h-3.5 w-3.5" />
                  <span>{r.nodes?.length || 0} Nodes</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
          <Map className="mx-auto h-10 w-10 text-slate-600" />
          <h3 className="mt-3 text-base font-bold text-white">No Roadmaps Found</h3>
          <p className="mt-1 text-xs text-slate-400">
            Go to the Admin Portal to generate roadmaps for domains.
          </p>
          <Link
            to="/admin/domains"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500"
          >
            Go to Admin Portal
          </Link>
        </div>
      )}
    </div>
  );
};
