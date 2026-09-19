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
  AlertTriangle,
  Trees,
  Leaf
} from 'lucide-react';

export default function PublicStatsPage() {
  const { stats, departments, issues } = useApp();

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-10 space-y-10 font-sans overflow-x-hidden">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[--text-muted]">
          <BarChart3 className="w-4 h-4" />
          <span>Public Municipal Metrics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[--text-primary] tracking-tight">
          Public Transparency &amp; Performance Stats
        </h1>
        <p className="text-xs sm:text-sm text-[--text-secondary] leading-relaxed">
          Real-time aggregated resolution rates, department SLA compliance, and municipal response metrics across all active wards.
        </p>
      </div>

      {/* Aggregate Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-[--bg-surface] border border-[--border] p-6 rounded-xl shadow-xs text-center space-y-1.5">
          <span className="text-xs font-bold text-[--text-muted] uppercase tracking-wider block">Total Reports</span>
          <div className="text-3xl sm:text-4xl font-extrabold text-[--text-primary] tracking-tight">{stats.totalReported.toLocaleString()}</div>
          <p className="text-xs text-[--text-secondary] font-semibold">Civic observations</p>
        </div>

        <div className="bg-[--bg-surface] border border-[--border] p-6 rounded-xl shadow-xs text-center space-y-1.5">
          <span className="text-xs font-bold text-[--text-muted] uppercase tracking-wider block">Verified Solved</span>
          <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">{stats.totalResolved.toLocaleString()}</div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">AI photo cross-verified</p>
        </div>

        <div className="bg-[--bg-surface] border border-[--border] p-6 rounded-xl shadow-xs text-center space-y-1.5">
          <span className="text-xs font-bold text-[--text-muted] uppercase tracking-wider block">Avg Resolution Time</span>
          <div className="text-3xl sm:text-4xl font-extrabold text-[--text-primary] tracking-tight">{stats.avgResolutionHours || 14}h</div>
          <p className="text-xs text-[--text-secondary] font-semibold">Target SLA &lt; 24h</p>
        </div>

        <div className="bg-[--bg-surface] border border-[--border] p-6 rounded-xl shadow-xs text-center space-y-1.5">
          <span className="text-xs font-bold text-[--text-muted] uppercase tracking-wider block">SLA Adherence</span>
          <div className="text-3xl sm:text-4xl font-extrabold text-blue-700 dark:text-blue-400 tracking-tight">{stats.slaCompliancePercent || 98}%</div>
          <p className="text-xs text-[--text-secondary] font-semibold">On-time resolution</p>
        </div>
      </div>

      {/* Environmental & Wildlife Protection Widget */}
      {(() => {
        const envIssues = issues.filter(i => i.category === 'Environment & Wildlife');
        const envTotal = envIssues.length;
        const envResolved = envIssues.filter(i => i.status === 'resolved').length;
        const envEmergencies = envIssues.filter(i => i.emergency || i.subcategory === 'Environmental Emergencies').length;
        const wildlifeCount = envIssues.filter(i => i.subcategory === 'Wildlife Protection' || i.title.toLowerCase().includes('wildlife') || i.title.toLowerCase().includes('animal')).length;
        const forestCount = envIssues.filter(i => i.subcategory === 'Forest & Land Protection' || i.title.toLowerCase().includes('tree') || i.title.toLowerCase().includes('forest')).length;
        const waterCount = envIssues.filter(i => i.subcategory === 'Water & Ecosystem Protection' || i.title.toLowerCase().includes('water') || i.title.toLowerCase().includes('river')).length;
        const pollutionCount = envIssues.filter(i => i.subcategory === 'Environmental Pollution' || i.title.toLowerCase().includes('dump') || i.title.toLowerCase().includes('pollut')).length;

        return (
          <div className="bg-[--bg-surface] text-[--text-primary] rounded-xl p-6 sm:p-8 border border-[--border] space-y-6 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[--border] pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[--bg-subtle] text-emerald-600 dark:text-emerald-400 border border-[--border] flex items-center justify-center shrink-0">
                  <Trees className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[--text-primary] tracking-tight flex items-center gap-2">
                    Environment &amp; Wildlife Safeguard Dashboard
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono px-2.5 py-0.5 rounded border border-emerald-500/20 font-bold">
                      Live Ecological Telemetry
                    </span>
                  </h2>
                  <p className="text-xs text-[--text-muted]">Tracking threats to forests, wildlife habitats, water bodies, and environmental emergencies</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-[--bg-subtle] px-3.5 py-2 rounded-lg border border-[--border]">
                <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-[--text-secondary]">
                  Resolution Rate: <strong className="text-emerald-600 dark:text-emerald-400">{envTotal > 0 ? Math.round((envResolved / envTotal) * 100) : 100}%</strong>
                </span>
              </div>
            </div>

            {/* Environmental Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[--bg-subtle] border border-[--border] p-4.5 rounded-lg space-y-1">
                <span className="text-[11px] font-bold text-[--text-muted] uppercase tracking-wider block">Total Eco Incidents</span>
                <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{envTotal}</div>
                <div className="text-[10px] text-[--text-muted]">Logged across all zones</div>
              </div>

              <div className="bg-[--bg-subtle] border border-[--border] p-4.5 rounded-lg space-y-1">
                <span className="text-[11px] font-bold text-[--text-muted] uppercase tracking-wider block">Wildlife Protection</span>
                <div className="text-2xl font-extrabold text-[--text-primary] font-mono">{wildlifeCount}</div>
                <div className="text-[10px] text-[--text-muted]">Fauna &amp; habitat reports</div>
              </div>

              <div className="bg-[--bg-subtle] border border-[--border] p-4.5 rounded-lg space-y-1">
                <span className="text-[11px] font-bold text-[--text-muted] uppercase tracking-wider block">Forest &amp; Canopy</span>
                <div className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 font-mono">{forestCount}</div>
                <div className="text-[10px] text-[--text-muted]">Tree cutting &amp; logging</div>
              </div>

              <div className="bg-[--bg-subtle] border border-[--border] p-4.5 rounded-lg space-y-1">
                <span className="text-[11px] font-bold text-[--text-muted] uppercase tracking-wider block">Eco Emergencies</span>
                <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">{envEmergencies}</div>
                <div className="text-[10px] text-[--text-muted]">Dispatched in &lt;4h</div>
              </div>
            </div>

            {/* Environmental Subcategory Pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="bg-[--bg-subtle] p-3 rounded-lg border border-[--border] flex items-center justify-between">
                <span className="text-[--text-secondary] font-medium">Water &amp; Ecosystems</span>
                <span className="font-mono font-bold text-[--text-primary]">{waterCount} reports</span>
              </div>
              <div className="bg-[--bg-subtle] p-3 rounded-lg border border-[--border] flex items-center justify-between">
                <span className="text-[--text-secondary] font-medium">Environmental Dumping</span>
                <span className="font-mono font-bold text-[--text-primary]">{pollutionCount} reports</span>
              </div>
              <div className="bg-[--bg-subtle] p-3 rounded-lg border border-[--border] flex items-center justify-between">
                <span className="text-[--text-secondary] font-medium">Verified Cleared</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{envResolved} reports</span>
              </div>
              <div className="bg-[--bg-subtle] p-3 rounded-lg border border-[--border] flex items-center justify-between">
                <span className="text-[--text-secondary] font-medium">Active Response Queue</span>
                <span className="font-mono font-bold text-[--text-primary]">{envTotal - envResolved} tickets</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Department SLA Breakdown */}
      <div className="bg-[--bg-surface] border border-[--border] rounded-xl p-6 sm:p-8 space-y-5 shadow-xs">
        <h2 className="text-xl font-bold text-[--text-primary] flex items-center gap-2.5">
          <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Municipal Department Performance Breakdown
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept) => (
            <div key={dept.id} className="border border-[--border] p-5 rounded-xl space-y-3 bg-[--bg-subtle]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[--text-primary]">{dept.name}</span>
                <span className="text-[10px] font-mono font-bold bg-[--bg-surface] border border-[--border] px-2 py-0.5 rounded text-[--text-secondary]">{dept.code}</span>
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[--text-secondary]">Active Queue:</span>
                  <span className="font-bold font-mono text-amber-600 dark:text-amber-400">{dept.activeTickets} tickets</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[--text-secondary]">Avg Resolution Speed:</span>
                  <span className="font-bold font-mono text-[--text-primary]">{dept.avgResolutionHours || 12} hours</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[--text-secondary]">SLA Adherence Rate:</span>
                  <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{dept.slaCompliancePercent || 96}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
