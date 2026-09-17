import React from 'react';
import Link from 'next/link';
import { Camera, Sparkles, Route, Clock, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 overflow-x-hidden">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
          System Architecture
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[--text-primary]">
          The 5-Stage ISLAH Lifecycle
        </h1>
        <p className="text-xs sm:text-sm text-[--text-secondary] leading-relaxed">
          How ISLAH turns citizen reporting into verified municipal action with zero delay.
        </p>
      </div>

      <div className="space-y-6">
        {[
          { step: '01', title: 'Citizen Photo Capture & GPS Lock', desc: 'Citizens snap an issue photo using desktop or mobile camera. High-precision GPS coordinates and ward boundary maps are automatically attached.', icon: Camera, color: 'text-slate-700 dark:text-slate-300' },
          { step: '02', title: 'AI Category & Duplicate Scanner', desc: 'ISLAH AI processes visual features to suggest the exact municipal category (e.g. Asphalt Pothole) with 94%+ confidence, while scanning a ~50m radius to link duplicate reports.', icon: Sparkles, color: 'text-slate-700 dark:text-slate-300' },
          { step: '03', title: 'Smart Department Work Order Routing', desc: 'Tickets are instantly routed to the operational queue of the target department (Roads, Sanitation, Water, Electrical, Safety) with SLA countdown timers.', icon: Route, color: 'text-slate-700 dark:text-slate-300' },
          { step: '04', title: 'Field Crew Repair & Escalation Control', desc: 'Department officers assign repair teams. If SLA thresholds are exceeded, automated BullMQ background jobs escalate tickets to city directors.', icon: Clock, color: 'text-amber-600 dark:text-amber-400' },
          { step: '05', title: 'AI Visual Resolution Verification', desc: 'Field teams upload completion photos. ISLAH AI compares before & after visual structural alignment to verify work before closing the public ticket.', icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400' },
        ].map((stage, i) => {
          const Icon = stage.icon;
          return (
            <div key={i} className="bg-[--bg-surface] rounded-lg border border-[--border] p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 shadow-xs">
              <div className={`w-12 h-12 rounded-md bg-[--bg-subtle] border border-[--border] flex items-center justify-center font-extrabold font-mono text-lg shrink-0 ${stage.color}`}>
                {stage.step}
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-lg font-bold text-[--text-primary] flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${stage.color}`} />
                  {stage.title}
                </h3>
                <p className="text-xs text-[--text-secondary] leading-relaxed">{stage.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <Link href="/report" className="bg-[--text-primary] hover:opacity-90 text-[--bg-base] font-bold text-xs px-6 py-3 rounded-md inline-flex items-center gap-2 shadow-xs transition-opacity">
          Try Reporting an Issue <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
