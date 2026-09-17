import React from 'react';
import Link from 'next/link';
import { Briefcase, User, ArrowRight, ShieldCheck } from 'lucide-react';

export default function DashboardPreviewPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 space-y-10 font-sans">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[--accent] uppercase tracking-wider">
          Platform Interface Preview
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[--text-primary] tracking-tight">
          Dual Dashboard Architecture
        </h1>
        <p className="text-xs sm:text-sm text-[--text-secondary]">
          ISLAH provides custom-tailored user interfaces for citizens and municipal staff.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[--bg-surface] border border-[--border] p-8 rounded-xl space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20 flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-[--text-primary]">Citizen Dashboard</h2>
          <p className="text-xs text-[--text-secondary] leading-relaxed">
            Track active reports, monitor nearby ward alerts, view timeline progress, and manage civic score badges.
          </p>
          <Link href="/my-reports" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl inline-flex items-center gap-1 shadow-sm transition-all">
            Open Citizen Portal <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-[--bg-surface] border border-[--border] p-8 rounded-xl space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20 flex items-center justify-center font-bold">
            <Briefcase className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-[--text-primary]">Department Staff Portal</h2>
          <p className="text-xs text-[--text-secondary] leading-relaxed">
            High-density work order table, SLA timers, staff note log, and AI resolution verification tool.
          </p>
          <Link href="/ticket-queue" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl inline-flex items-center gap-1 shadow-sm transition-all">
            Open Staff Queue <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
