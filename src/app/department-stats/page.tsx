'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { BarChart3, TrendingUp, ShieldCheck, Clock, CheckCircle2, Building } from 'lucide-react';

export default function DepartmentStatsPage() {
  const { departments, stats } = useApp();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans text-[--text-primary]">

      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-[--text-muted] uppercase tracking-wider">
          Public Accountability
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-[--text-primary] flex items-center gap-2.5">
          <BarChart3 className="w-8 h-8 text-[--text-primary]" />
          Department Performance &amp; SLA Analytics
        </h1>
        <p className="text-sm text-[--text-secondary]">
          Transparent real-time performance tracking across all integrated municipal departments.
        </p>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-[--bg-surface] border border-[--border] hover:border-[--border-subtle] p-6 rounded-2xl space-y-2 transition-all">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          <div className="text-3xl font-bold font-mono text-[--text-primary]">{stats.slaCompliancePercent || 98}%</div>
          <div className="text-xs font-semibold text-[--text-muted] uppercase tracking-wider">Overall SLA Pass Rate</div>
        </div>

        <div className="bg-[--bg-surface] border border-[--border] hover:border-[--border-subtle] p-6 rounded-2xl space-y-2 transition-all">
          <Clock className="w-6 h-6 text-[--text-muted]" />
          <div className="text-3xl font-bold font-mono text-[--text-primary]">{stats.avgResolutionHours || 14} Hours</div>
          <div className="text-xs font-semibold text-[--text-muted] uppercase tracking-wider">Avg City Resolution Time</div>
        </div>

        <div className="bg-[--bg-surface] border border-[--border] hover:border-[--border-subtle] p-6 rounded-2xl space-y-2 transition-all">
          <ShieldCheck className="w-6 h-6 text-[--text-muted]" />
          <div className="text-3xl font-bold font-mono text-[--text-primary]">{stats.totalResolved.toLocaleString()}</div>
          <div className="text-xs font-semibold text-[--text-muted] uppercase tracking-wider">Total Issues Resolved</div>
        </div>

        <div className="bg-[--bg-surface] border border-[--border] hover:border-[--border-subtle] p-6 rounded-2xl space-y-2 transition-all">
          <Building className="w-6 h-6 text-[--text-muted]" />
          <div className="text-3xl font-bold font-mono text-[--text-primary]">{departments.length}</div>
          <div className="text-xs font-semibold text-[--text-muted] uppercase tracking-wider">Active Integrated Depts</div>
        </div>
      </div>

      {/* Department Leaderboard Table */}
      <div className="bg-[--bg-surface] rounded-2xl border border-[--border] overflow-hidden space-y-4 p-6">
        <h2 className="text-lg font-bold text-[--text-primary] flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[--text-muted]" />
          Department Performance Scorecard
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[--text-secondary]">
            <thead className="bg-[--bg-subtle] text-[--text-secondary] uppercase text-[10px] font-bold tracking-wider border-b border-[--border]">
              <tr>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Lead Officer</th>
                <th className="py-3 px-4">Resolved Tickets</th>
                <th className="py-3 px-4">Avg Fix Time</th>
                <th className="py-3 px-4">SLA Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[--border]">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-[--bg-subtle] font-medium transition-colors">
                  <td className="py-4 px-4 font-bold text-[--text-primary]">
                    {dept.name} ({dept.code})
                  </td>
                  <td className="py-4 px-4 text-[--text-secondary]">{dept.leadOfficer}</td>
                  <td className="py-4 px-4 font-mono text-[--text-primary] font-bold">
                    {(dept.resolvedTickets || 0).toLocaleString()}
                  </td>
                  <td className="py-4 px-4 font-mono text-[--text-primary] font-bold">
                    {dept.avgResolutionHours || 12} hrs
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-[--bg-subtle] h-2 rounded-full overflow-hidden border border-[--border]">
                        <div
                          className="bg-emerald-500 h-full"
                          style={{ width: `${dept.slaCompliancePercent || 96}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-[--text-primary]">{dept.slaCompliancePercent || 96}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
