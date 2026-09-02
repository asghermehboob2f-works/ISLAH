'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { PlusCircle, ArrowRight, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export function HeroSection() {
  const { stats, issues } = useApp();

  const totalReported = stats?.totalReported || issues?.length || 142;
  const totalResolved = stats?.totalResolved || issues?.filter((i) => i.status === 'resolved').length || 108;
  const avgTime = stats?.avgResolutionHours || stats?.avgResolutionTimeHours || 14.2;

  return (
    <section className="bg-white text-slate-900 min-h-[calc(100vh-4rem)] flex flex-col justify-center py-6 sm:py-8 lg:py-10 border-b border-slate-200/80 font-sans">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-[860px] mx-auto text-center space-y-5 sm:space-y-6 lg:space-y-7">

          {/* Context / Editorial Eyebrow (Clean Text, No Edge Box) */}
          <div className="inline-flex items-center justify-center text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase text-blue-600">
            <span>ISLAH · CIVIC &amp; ENVIRONMENTAL REPORTING PLATFORM</span>
          </div>

          {/* Headline - Proportioned for single-viewport fit */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.08]">
            Report what matters. <span className="text-blue-600">Reach who can act.</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-[760px] mx-auto">
            Islah turns local issues into accountable action. Every report is documented, location-aware, and routed to the responsible department or ward, giving every issue a clear path from reporting to action.
          </p>

          {/* Primary Blue CTA + Secondary Bordered CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <Link
              href="/report"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-lg shadow-xs hover:shadow-md transition-all duration-150 active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report an Issue</span>
            </Link>

            <Link
              href="/live-map"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 text-xs sm:text-sm font-medium px-5 py-3 rounded-lg shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-[0.98] group"
            >
              <span>Explore Map</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Factual Metrics Row - Compact & Refined Cards for viewport fit */}
          <div className="pt-6 sm:pt-8 border-t border-slate-200/80">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left max-w-[780px] mx-auto">
              
              <div className="bg-slate-50/70 border border-slate-200/80 p-3 rounded-lg space-y-1 transition-colors hover:border-slate-300">
                <div className="flex items-center justify-between">
                  <div className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    {totalReported.toLocaleString()}
                  </div>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">
                    Tracked
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Civic Issues Logged</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Geotagged infrastructure reports routed directly to municipal authorities.
                </p>
              </div>

              <div className="bg-slate-50/70 border border-slate-200/80 p-3 rounded-lg space-y-1 transition-colors hover:border-slate-300">
                <div className="flex items-center justify-between">
                  <div className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    {totalResolved.toLocaleString()}
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                    Verified
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Environmental &amp; Infrastructure Fixes</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Confirmed resolutions backed by transparent public audit trails.
                </p>
              </div>

              <div className="bg-slate-50/70 border border-slate-200/80 p-3 rounded-lg space-y-1 transition-colors hover:border-slate-300">
                <div className="flex items-center justify-between">
                  <div className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    {typeof avgTime === 'number' ? `${avgTime}h` : avgTime}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                    SLA Window
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>Average Department Response</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Automated department dispatch to field crews for rapid triage.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}




