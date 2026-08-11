import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Map, CheckCircle } from 'lucide-react';
import { userApi } from '../api/user.api';

export const MyRoadmaps: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['my-roadmaps'],
    queryFn: async () => {
      const res = await userApi.getMyRoadmaps();
      return res.data.progressList as any[];
    },
  });

  const progressList = data || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold tracking-tight text-white">My Learning Journey</h1>
      <p className="mt-1 text-sm text-slate-400">Track your completed skills, projects, and overall progress</p>

      {isLoading ? (
        <div className="mt-12 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        </div>
      ) : progressList.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {progressList.map((p) => (
            <Link
              key={p._id}
              to={`/roadmaps/${p.domainSlug}`}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl transition hover:border-indigo-500/50"
            >
              <h3 className="font-display text-lg font-bold text-white uppercase">{p.domainSlug.replace(/-/g, ' ')}</h3>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>Completed Nodes: {p.completedNodes?.length || 0}</span>
                <span className="font-bold text-emerald-400">{p.percentComplete || 0}% Complete</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${p.percentComplete || 0}%` }}
                />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
          <Map className="mx-auto h-10 w-10 text-slate-600" />
          <h3 className="mt-3 text-base font-bold text-white">No Learning Journeys Started</h3>
          <p className="mt-1 text-xs text-slate-400">Explore published roadmaps and click "Mark Complete" on any node to start tracking!</p>
          <Link
            to="/roadmaps"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500"
          >
            Explore Roadmaps
          </Link>
        </div>
      )}
    </div>
  );
};
