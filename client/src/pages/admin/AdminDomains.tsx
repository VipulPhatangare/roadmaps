import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, Play, Zap, Search, Layers, FileText } from 'lucide-react';
import { domainsApi } from '../../api/domains.api';
import { Domain } from '../../types/roadmap.types';
import { Link } from 'react-router-dom';

export const AdminDomains: React.FC = () => {
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-domains-list'],
    queryFn: async () => {
      const res = await domainsApi.getAll({ limit: 300 });
      return res.data.domains as Domain[];
    },
    refetchInterval: 3000,
  });

  const importMutation = useMutation({
    mutationFn: async () => {
      setUploading(true);
      const res = await domainsApi.importCSV();
      return res.data;
    },
    onSuccess: (data) => {
      setMsg(data.message);
      setUploading(false);
      queryClient.invalidateQueries({ queryKey: ['admin-domains-list'] });
    },
    onError: (err: any) => {
      setMsg(`CSV Import Error: ${err.message}`);
      setUploading(false);
    },
  });

  const batchGenMutation = useMutation({
    mutationFn: async (limit: number) => {
      const res = await domainsApi.batchGenerate(limit);
      return res.data;
    },
    onSuccess: (data) => {
      setMsg(data.message);
      queryClient.invalidateQueries({ queryKey: ['admin-domains-list'] });
    },
  });

  const singleGenMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await domainsApi.generate(id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-domains-list'] });
    },
  });

  const allDomains = data || [];
  const domains = allDomains.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">Domain Management</h1>
          <p className="mt-1 text-sm text-slate-400">Import CSV & trigger multi-worker pipeline (5 parallel workers)</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/api-docs"
            className="flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-xs font-bold text-indigo-400 hover:bg-indigo-500/20 shadow-lg transition"
          >
            <FileText className="h-4 w-4" />
            API Docs & Keys
          </Link>

          <button
            onClick={() => importMutation.mutate()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-200 transition hover:bg-slate-800"
          >
            <Upload className="h-4 w-4 text-indigo-400" />
            {uploading ? 'Importing...' : 'Import roadmaps.csv'}
          </button>

          {/* Test 10 Domains Button */}
          <button
            onClick={() => batchGenMutation.mutate(10)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
          >
            <Layers className="h-4 w-4" />
            Generate First 10 Domains
          </button>

          {/* All Domains Button */}
          <button
            onClick={() => batchGenMutation.mutate(0)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition hover:from-purple-500 hover:to-indigo-500"
          >
            <Zap className="h-4 w-4" />
            Generate All {allDomains.length} Domains
          </button>
        </div>
      </div>

      {msg && (
        <div className="mt-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-xs font-semibold text-indigo-300">
          {msg}
        </div>
      )}

      {/* Search & Counter */}
      <div className="mt-8 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search domains..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <span className="text-xs font-semibold text-slate-400">Total Domains: {domains.length}</span>
      </div>

      {/* Domain Table */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase">
            <tr>
              <th className="p-4 font-semibold">#</th>
              <th className="p-4 font-semibold">Domain Name</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Nodes</th>
              <th className="p-4 font-semibold">Projects</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  Loading domains from local MongoDB...
                </td>
              </tr>
            ) : domains.length > 0 ? (
              domains.map((d, index) => (
                <tr key={d._id} className="hover:bg-slate-800/40">
                  <td className="p-4 text-slate-500 font-mono">{index + 1}</td>
                  <td className="p-4 font-bold text-white">{d.name}</td>
                  <td className="p-4">
                    <span
                      className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        d.status === 'PUBLISHED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : d.status === 'GENERATING' || d.status === 'ANALYZING'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                          : d.status === 'FAILED'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{d.nodeCount || 0}</td>
                  <td className="p-4 font-semibold text-indigo-400">{d.projectCount || 5}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => singleGenMutation.mutate(d._id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-indigo-600/20 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-600/40"
                    >
                      <Play className="h-3 w-3" />
                      Generate
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  No domains found. Click "Import roadmaps.csv" to seed all domains!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
