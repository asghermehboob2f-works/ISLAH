import React from 'react';
import Link from 'next/link';
import { Building, ShieldCheck, Briefcase, ArrowRight } from 'lucide-react';

export default function DepartmentsPage() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 space-y-10 font-sans">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[--text-muted] uppercase tracking-wider">
          Municipal Operations
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[--text-primary] tracking-tight">
          Department Portal & Integration
        </h1>
        <p className="text-xs sm:text-sm text-[--text-secondary]">
          Providing municipal officers with high-density operational work queues, automated SLA alerts, and AI resolution verification tools.
        </p>
      </div>

      <div className="bg-[--bg-surface] text-[--text-primary] rounded-xl p-8 border border-[--border] space-y-4 shadow-xs">
        <h2 className="text-xl font-bold flex items-center gap-2 text-[--text-primary]">
          <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Operational Features for Staff
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[--text-secondary]">
          <li className="flex items-center gap-2">✓ Filterable work orders by severity, SLA timer, and ward.</li>
          <li className="flex items-center gap-2">✓ Automated dispatch from citizen AI classifier.</li>
          <li className="flex items-center gap-2">✓ AI photo resolution verification engine before ticket closure.</li>
          <li className="flex items-center gap-2">✓ SLA escalation protection alerts.</li>
        </ul>
        <div className="pt-2">
          <Link href="/ticket-queue" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-3 rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all">
            Access Staff Queue Portal <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
