import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Database, CheckCircle, Cpu, AlertTriangle, FileText, Layers, Key, FolderGit2, Zap, Play, RefreshCw, Eye, ArrowUpRight } from 'lucide-react';
import { domainsApi } from '../../api/domains.api';
import { Domain } from '../../types/roadmap.types';

export const AdminDashboard: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [actionMsg, setActionMsg] = useState<string>('');

  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-domains'],
    queryFn: async () => {
      const res = await domainsApi.getAll({ limit: 500 });
      return res.data.domains as Domain[];
    },
  });

  const batchGenMutation = useMutation({
    mutationFn: async (limit: number) => {
      const res = await domainsApi.batchGenerate(limit);
      return res.data;
    },
    onSuccess: (data) => {
      setActionMsg(data.message || 'Batch generation triggered!');
      queryClient.invalidateQueries({ queryKey: ['admin-domains'] });
    },
    onError: (err: any) => {
      setActionMsg(`Generation Error: ${err.message}`);
    },
  });

  const domains = data || [];
  const publishedCount = domains.filter((d) => d.status === 'PUBLISHED').length;
  const importedCount = domains.filter((d) => d.status === 'IMPORTED').length;
  const generatingCount = domains.filter((d) => d.status === 'GENERATING' || d.status === 'ANALYZING').length;
  const failedCount = domains.filter((d) => d.status === 'FAILED').length;

  const totalNodes = domains.reduce((acc, d) => acc + (d.nodeCount || 0), 0);
  const totalProjects = domains.reduce((acc, d) => acc + (d.projectCount || 0), 0);

  const filteredDomains = domains.filter((d) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'PUBLISHED') return d.status === 'PUBLISHED';
    if (filterStatus === 'GENERATING') return d.status === 'GENERATING' || d.status === 'ANALYZING';
    if (filterStatus === 'FAILED') return d.status === 'FAILED';
    if (filterStatus === 'IMPORTED') return d.status === 'IMPORTED';
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-indigo-500/20 px-2.5 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/30">
              Admin Portal
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span> System Operational
            </span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white">Admin Control Portal</h1>
          <p className="mt-1 text-sm text-slate-400">
            Real-time analytics, roadmap node statistics, AI pipeline control & external API endpoints.
          </p>
        </div>

        {/* Quick Action Navigation & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-slate-700 hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh Stats
          </button>

          <Link
            to="/admin/api-docs"
            className="flex items-center gap-1.5 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-4 py-2.5 text-xs font-bold text-indigo-400 transition hover:bg-indigo-500/20 shadow-lg"
          >
            <FileText className="h-4 w-4" /> API Docs & Keys
          </Link>

          <Link
            to="/admin/domains"
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
          >
            <Database className="h-4 w-4 text-indigo-400" /> Manage Domains ({domains.length})
          </Link>

          <button
            onClick={() => batchGenMutation.mutate(5)}
            disabled={batchGenMutation.isPending}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50"
          >
            <Zap className="h-4 w-4 text-amber-300" /> Run Batch AI Gen (5)
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="mt-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3 text-xs text-indigo-300 flex items-center justify-between">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Primary Statistics Grid (6 Metrics Cards) */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Total Domains</span>
            <Database className="h-5 w-5 text-indigo-400" />
          </div>
          <p className="mt-3 font-display text-3xl font-extrabold text-white">{domains.length}</p>
          <span className="mt-1 block text-[10px] text-slate-500">Seed CSV catalog</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Published</span>
            <CheckCircle className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="mt-3 font-display text-3xl font-extrabold text-emerald-400">{publishedCount}</p>
          <span className="mt-1 block text-[10px] text-slate-500">Ready for users & API</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Total Nodes</span>
            <Layers className="h-5 w-5 text-purple-400" />
          </div>
          <p className="mt-3 font-display text-3xl font-extrabold text-purple-300">{totalNodes}</p>
          <span className="mt-1 block text-[10px] text-slate-500">Curriculum topics</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Total Projects</span>
            <FolderGit2 className="h-5 w-5 text-blue-400" />
          </div>
          <p className="mt-3 font-display text-3xl font-extrabold text-blue-300">{totalProjects}</p>
          <span className="mt-1 block text-[10px] text-slate-500">Hands-on tasks</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Generating</span>
            <Cpu className="h-5 w-5 text-amber-400" />
          </div>
          <p className="mt-3 font-display text-3xl font-extrabold text-amber-300">{generatingCount}</p>
          <span className="mt-1 block text-[10px] text-slate-500">Active AI Agent Jobs</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">API Endpoints</span>
            <Key className="h-5 w-5 text-teal-400" />
          </div>
          <p className="mt-3 font-display text-3xl font-extrabold text-teal-300">2</p>
          <span className="mt-1 block text-[10px] text-slate-500">Active External Routes</span>
        </div>
      </div>

      {/* Filter Tabs & Table Control Section */}
      <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="h-4 w-4 text-indigo-400" />
              Domain Catalog Breakdown & Direct Controls
            </h2>
            <p className="text-xs text-slate-400">Filter domains by generation status and run direct agent tasks</p>
          </div>

          {/* Quick Filter Pill Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 p-1">
            {['ALL', 'PUBLISHED', 'GENERATING', 'IMPORTED', 'FAILED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                  filterStatus === st
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {st} {st === 'ALL' ? `(${domains.length})` : st === 'PUBLISHED' ? `(${publishedCount})` : st === 'GENERATING' ? `(${generatingCount})` : st === 'IMPORTED' ? `(${importedCount})` : `(${failedCount})`}
              </button>
            ))}
          </div>
        </div>

        {/* Table View */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 uppercase">
              <tr>
                <th className="pb-3 font-semibold">Domain Name</th>
                <th className="pb-3 font-semibold">Slug</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Validation Score</th>
                <th className="pb-3 font-semibold">Nodes</th>
                <th className="pb-3 font-semibold">Edges</th>
                <th className="pb-3 font-semibold text-right">Actions & Links</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredDomains.slice(0, 15).map((d) => (
                <tr key={d._id} className="hover:bg-slate-800/50 transition">
                  <td className="py-3 font-bold text-white">{d.name}</td>
                  <td className="py-3 font-mono text-[11px] text-slate-400">{d.slug}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        d.status === 'PUBLISHED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : d.status === 'GENERATING' || d.status === 'ANALYZING'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                          : d.status === 'FAILED'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3 text-emerald-400 font-bold">{d.validationScore ? `${d.validationScore}%` : '-'}</td>
                  <td className="py-3 font-semibold text-slate-200">{d.nodeCount || 0}</td>
                  <td className="py-3 font-semibold text-slate-400">{d.edgeCount || 0}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/roadmaps/${d.slug}`}
                        className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-200 hover:border-slate-600 hover:text-white"
                      >
                        <Eye className="h-3 w-3 text-indigo-400" /> View
                      </Link>
                      <Link
                        to="/admin/api-docs"
                        className="flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-medium text-indigo-300 hover:bg-indigo-500/20"
                      >
                        <FileText className="h-3 w-3" /> API Endpoint
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDomains.length > 15 && (
          <div className="mt-4 border-t border-slate-800 pt-3 text-center">
            <Link to="/admin/domains" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-1">
              View all {filteredDomains.length} domains in Full Catalog <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
