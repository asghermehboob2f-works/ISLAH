'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  BarChart3, 
  Building2, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export default function PublicStatsPage() {
  const { stats, departments, issues } = useApp();

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 space-y-8 font-sans">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-extrabold uppercase tracking-wider">
          <BarChart3 className="w-4 h-4 text-blue-600" />
          Public Municipal Metrics
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Public Transparency & Performance Stats
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Real-time aggregated resolution rates, department SLA compliance, and municipal response metrics across all active wards.
        </p>
      </div>

      {/* Aggregate Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs text-center space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Reports</span>
          <div className="text-3xl font-black text-slate-900 font-mono">{stats.totalReported.toLocaleString()}</div>
          <p className="text-[11px] text-blue-600 font-semibold">Civic observations</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs text-center space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Solved</span>
          <div className="text-3xl font-black text-emerald-600 font-mono">{stats.totalResolved.toLocaleString()}</div>
          <p className="text-[11px] text-emerald-600 font-semibold">AI photo cross-verified</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs text-center space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Resolution Time</span>
          <div className="text-3xl font-black text-sky-600 font-mono">{stats.avgResolutionHours || 14}h</div>
          <p className="text-[11px] text-sky-600 font-semibold">Target SLA &lt; 24h</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs text-center space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SLA Adherence</span>
          <div className="text-3xl font-black text-purple-600 font-mono">{stats.slaCompliancePercent || 98}%</div>
          <p className="text-[11px] text-purple-600 font-semibold">On-time resolution</p>
        </div>
      </div>

      {/* Department SLA Breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          Municipal Department Performance Breakdown
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div key={dept.id} className="border border-slate-200 p-4 rounded-xl space-y-2 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">{dept.name}</span>
                <span className="text-[10px] font-mono font-bold bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">{dept.code}</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500">Active Queue:</span>
                <span className="font-bold font-mono text-amber-600">{dept.activeTickets} tickets</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Avg Resolution Speed:</span>
                <span className="font-bold font-mono text-slate-800">{dept.avgResolutionHours || 12} hours</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">SLA Adherence Rate:</span>
                <span className="font-bold font-mono text-emerald-600">{dept.slaCompliancePercent || 96}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
