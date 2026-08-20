import React from 'react';
import Link from 'next/link';
import { Camera, Sparkles, Route, Clock, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="w-full max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
          System Architecture
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          The 5-Stage ISLAH Lifecycle
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          How ISLAH turns citizen reporting into verified municipal action with zero delay.
        </p>
      </div>

      <div className="space-y-8">
        {[
          { step: '01', title: 'Citizen Photo Capture & GPS Lock', desc: 'Citizens snap an issue photo using desktop or mobile camera. High-precision GPS coordinates and ward boundary maps are automatically attached.', icon: Camera, color: 'text-blue-600' },
          { step: '02', title: 'AI Category & Duplicate Scanner', desc: 'ISLAH AI processes visual features to suggest the exact municipal category (e.g. Asphalt Pothole) with 94%+ confidence, while scanning a ~50m radius to link duplicate reports.', icon: Sparkles, color: 'text-sky-600' },
          { step: '03', title: 'Smart Department Work Order Routing', desc: 'Tickets are instantly routed to the operational queue of the target department (Roads, Sanitation, Water, Electrical, Safety) with SLA countdown timers.', icon: Route, color: 'text-indigo-600' },
          { step: '04', title: 'Field Crew Repair & Escalation Control', desc: 'Department officers assign repair teams. If SLA thresholds are exceeded, automated BullMQ background jobs escalate tickets to city directors.', icon: Clock, color: 'text-amber-600' },
          { step: '05', title: 'AI Visual Resolution Verification', desc: 'Field teams upload completion photos. ISLAH AI compares before & after visual structural alignment to verify work before closing the public ticket.', icon: CheckCircle2, color: 'text-emerald-600' },
        ].map((stage, i) => {
          const Icon = stage.icon;
          return (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 shadow-sm">
              <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center font-extrabold font-mono text-xl shrink-0 ${stage.color}`}>
                {stage.step}
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${stage.color}`} />
                  {stage.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{stage.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <Link href="/report" className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-xl inline-flex items-center gap-2 shadow-lg">
          Try Reporting an Issue <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
