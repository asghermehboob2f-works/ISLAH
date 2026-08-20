import React from 'react';
import Link from 'next/link';
import { Building, ShieldCheck, Briefcase, ArrowRight } from 'lucide-react';

export default function DepartmentsPage() {
  return (
    <div className="w-full max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
          Municipal Operations
        </span>
        <h1 className="text-3xl font-bold text-slate-900">
          Department Portal & Integration
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Providing municipal officers with high-density operational work queues, automated SLA alerts, and AI resolution verification tools.
        </p>
      </div>

      <div className="bg-slate-900 text-white rounded-2xl p-8 border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-amber-400" /> Operational Features for Staff
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
          <li className="flex items-center gap-2">✓ Filterable work orders by severity, SLA timer, and ward.</li>
          <li className="flex items-center gap-2">✓ Automated dispatch from citizen AI classifier.</li>
          <li className="flex items-center gap-2">✓ AI photo resolution verification engine before ticket closure.</li>
          <li className="flex items-center gap-2">✓ SLA escalation protection alerts.</li>
        </ul>
        <div className="pt-2">
          <Link href="/ticket-queue" className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg inline-flex items-center gap-1.5">
            Access Staff Queue Portal <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
