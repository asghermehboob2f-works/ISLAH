'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { BarChart3, TrendingUp, ShieldCheck, Clock, CheckCircle2, Building, AlertTriangle } from 'lucide-react';

export default function DepartmentStatsPage() {
  const { departments, stats } = useApp();

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-10 space-y-10 font-sans">
      
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
          Public Accountability
        </span>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          Department Performance & SLA Analytics
        </h1>
        <p className="text-sm text-slate-600">
          Transparent real-time performance tracking across all integrated municipal departments.
        </p>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2 shadow-sm">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          <div className="text-3xl font-bold font-mono text-slate-900">{stats.slaCompliancePercent || 98}%</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall SLA Pass Rate</div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2 shadow-sm">
          <Clock className="w-6 h-6 text-blue-600" />
          <div className="text-3xl font-bold font-mono text-slate-900">{stats.avgResolutionHours || 14} Hours</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg City Resolution Time</div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2 shadow-sm">
          <ShieldCheck className="w-6 h-6 text-sky-600" />
          <div className="text-3xl font-bold font-mono text-slate-900">{stats.totalResolved.toLocaleString()}</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Issues Resolved</div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2 shadow-sm">
          <Building className="w-6 h-6 text-amber-600" />
          <div className="text-3xl font-bold font-mono text-slate-900">{departments.length}</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Integrated Depts</div>
        </div>
      </div>

      {/* Department Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-4 p-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Department Performance Scorecard
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] font-bold tracking-wider border-b">
              <tr>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Lead Officer</th>
                <th className="py-3 px-4">Resolved Tickets</th>
                <th className="py-3 px-4">Avg Fix Time</th>
                <th className="py-3 px-4">SLA Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50 font-medium">
                  <td className="py-4 px-4 font-bold text-slate-900">
                    {dept.name} ({dept.code})
                  </td>
                  <td className="py-4 px-4 text-slate-600">{dept.leadOfficer}</td>
                  <td className="py-4 px-4 font-mono text-slate-900 font-bold">
                    {(dept.resolvedTickets || 0).toLocaleString()}
                  </td>
                  <td className="py-4 px-4 font-mono text-blue-600 font-bold">
                    {dept.avgResolutionHours || 12} hrs
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full"
                          style={{ width: `${dept.slaCompliancePercent || 96}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-900">{dept.slaCompliancePercent || 96}%</span>
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
