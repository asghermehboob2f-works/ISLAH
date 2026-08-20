import React from 'react';
import { TrendingUp, Users, Building, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ImpactPage() {
  return (
    <div className="w-full max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
          Civic Outcomes
        </span>
        <h1 className="text-3xl font-bold text-slate-900">
          Measurable Community Impact
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          How ISLAH is restoring citizen trust and accelerating municipal problem resolution.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl text-center space-y-2">
          <div className="text-4xl font-black text-blue-600 font-mono">14.2h</div>
          <div className="text-xs font-bold text-slate-700 uppercase">Average Resolution Time</div>
          <p className="text-[11px] text-slate-500">Reduced from historic 14-day delays.</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl text-center space-y-2">
          <div className="text-4xl font-black text-emerald-600 font-mono">95.8%</div>
          <div className="text-xs font-bold text-slate-700 uppercase">SLA Compliance</div>
          <p className="text-[11px] text-slate-500">Strict adherence to target resolution hours.</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl text-center space-y-2">
          <div className="text-4xl font-black text-indigo-600 font-mono">6,380+</div>
          <div className="text-xs font-bold text-slate-700 uppercase">Civic Issues Fixed</div>
          <p className="text-[11px] text-slate-500">Across 15 municipal wards.</p>
        </div>
      </div>
    </div>
  );
}
