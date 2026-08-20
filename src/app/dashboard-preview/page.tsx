import React from 'react';
import Link from 'next/link';
import { Briefcase, User, ArrowRight, ShieldCheck } from 'lucide-react';

export default function DashboardPreviewPage() {
  return (
    <div className="w-full max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
          Platform Interface Preview
        </span>
        <h1 className="text-3xl font-bold text-slate-900">
          Dual Dashboard Architecture
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          ISLAH provides custom-tailored user interfaces for citizens and municipal staff.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 p-8 rounded-2xl space-y-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Citizen Dashboard</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Track active reports, monitor nearby ward alerts, view timeline progress, and manage civic score badges.
          </p>
          <Link href="/my-reports" className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-lg inline-flex items-center gap-1">
            Open Citizen Portal <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-slate-900 text-white border border-slate-800 p-8 rounded-2xl space-y-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Briefcase className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white">Department Staff Portal</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            High-density work order table, SLA timers, staff note log, and AI resolution verification tool.
          </p>
          <Link href="/ticket-queue" className="bg-amber-600 text-white font-bold text-xs px-4 py-2 rounded-lg inline-flex items-center gap-1">
            Open Staff Queue <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
