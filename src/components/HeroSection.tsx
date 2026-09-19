'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { PlusCircle, ArrowRight, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export function HeroSection() {
  const { stats } = useApp();

  const totalReported = stats?.totalReported ?? 142;
  const totalResolved = stats?.totalResolved ?? 108;
  const avgTime = stats?.avgResolutionHours ?? 14.2;

  return (
    <section className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center py-8 sm:py-10 lg:py-12 border-b border-[--border] font-sans bg-[--bg-base]">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 space-y-8 lg:space-y-10 flex flex-col items-center">

        {/* Hero Central Header — Perfectly Balanced & Symmetrical */}
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-5">

          {/* Eyebrow */}
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[--text-muted]">
            ISLAH · Civic &amp; Environmental Reporting Platform
          </p>

          {/* Headline — Balanced 2-Line Symmetry */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[--text-primary] leading-[1.18]">
            Report what matters.<br className="hidden sm:inline" />{' '}
            <span className="text-[--text-secondary]">Reach who can act.</span>
          </h1>

          {/* Subtext */}
          <p className="text-xs sm:text-sm md:text-base text-[--text-secondary] font-normal leading-relaxed max-w-2xl mx-auto">
            Islah turns local issues into accountable action. Every report is documented, location-aware, and routed directly to responsible municipal departments with complete SLA transparency.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <Link
              href="/report"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white dark:bg-blue-600 dark:hover:bg-blue-500 text-xs sm:text-sm font-bold px-6 py-2.5 rounded-lg shadow-xs transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report an Issue</span>
            </Link>

            <Link
              href="/live-map"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[--bg-surface] hover:bg-[--bg-subtle] text-[--text-primary] border border-[--border] text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-lg transition-all active:scale-[0.98] group"
            >
              <span>Explore Map</span>
              <ArrowRight className="w-4 h-4 text-[--text-muted] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Metrics Grid — Expanded across horizontal space */}
        <div className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto pt-6 border-t border-[--border]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 text-left w-full">

            <div className="bg-[--bg-surface] border border-[--border] hover:border-[--border-subtle] p-4 rounded-xl flex flex-col justify-between space-y-3 transition-all shadow-xs">
              <div className="flex items-center justify-between">
                <div className="text-2xl sm:text-3xl font-extrabold text-[--text-primary] tracking-tight">{totalReported.toLocaleString()}</div>
                <span className="text-[10px] font-extrabold text-blue-700 dark:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-md uppercase tracking-wider">Tracked</span>
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[--text-primary] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Civic Issues Logged</span>
                </div>
                <p className="text-[11px] text-[--text-secondary] truncate">Geotagged reports routed to authorities.</p>
              </div>
            </div>

            <div className="bg-[--bg-surface] border border-[--border] hover:border-[--border-subtle] p-4 rounded-xl flex flex-col justify-between space-y-3 transition-all shadow-xs">
              <div className="flex items-center justify-between">
                <div className="text-2xl sm:text-3xl font-extrabold text-[--text-primary] tracking-tight">{totalResolved.toLocaleString()}</div>
                <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md uppercase tracking-wider">Verified</span>
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[--text-primary] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Verified Resolutions</span>
                </div>
                <p className="text-[11px] text-[--text-secondary] truncate">Confirmed fixes backed by audit trails.</p>
              </div>
            </div>

            <div className="bg-[--bg-surface] border border-[--border] hover:border-[--border-subtle] p-4 rounded-xl flex flex-col justify-between space-y-3 transition-all shadow-xs">
              <div className="flex items-center justify-between">
                <div className="text-2xl sm:text-3xl font-extrabold text-[--text-primary] tracking-tight">{typeof avgTime === 'number' ? `${avgTime}h` : avgTime}</div>
                <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md uppercase tracking-wider">SLA</span>
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[--text-primary] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Avg Response Time</span>
                </div>
                <p className="text-[11px] text-[--text-secondary] truncate">Automated dispatch for rapid triage.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
