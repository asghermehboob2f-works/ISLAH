import React from 'react';
import { TrendingUp, Users, Building, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ImpactPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 overflow-x-hidden">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
          Civic Outcomes
        </span>
        <h1 className="text-3xl font-bold text-[--text-primary]">
          Measurable Community Impact
        </h1>
        <p className="text-xs sm:text-sm text-[--text-secondary]">
          How ISLAH is restoring citizen trust and accelerating municipal problem resolution.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[--bg-surface] border border-[--border] p-6 rounded-lg text-center space-y-2 shadow-xs">
          <div className="text-4xl font-black text-[--text-primary] font-mono">14.2h</div>
          <div className="text-xs font-bold text-[--text-primary] uppercase">Average Resolution Time</div>
          <p className="text-[11px] text-[--text-secondary]">Reduced from historic 14-day delays.</p>
        </div>

        <div className="bg-[--bg-surface] border border-[--border] p-6 rounded-lg text-center space-y-2 shadow-xs">
          <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono">95.8%</div>
          <div className="text-xs font-bold text-[--text-primary] uppercase">SLA Compliance</div>
          <p className="text-[11px] text-[--text-secondary]">Strict adherence to target resolution hours.</p>
        </div>

        <div className="bg-[--bg-surface] border border-[--border] p-6 rounded-lg text-center space-y-2 shadow-xs">
          <div className="text-4xl font-black text-[--text-primary] font-mono">6,380+</div>
          <div className="text-xs font-bold text-[--text-primary] uppercase">Civic Issues Fixed</div>
          <p className="text-[11px] text-[--text-secondary]">Across 15 municipal wards.</p>
        </div>
      </div>
    </div>
  );
}
