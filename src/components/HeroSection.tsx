'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { PlusCircle, ArrowRight, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export function HeroSection() {
  const { stats, issues } = useApp();

  const totalReported = stats?.totalReported || issues?.length || 142;
  const totalResolved = stats?.totalResolved || issues?.filter((i) => i.status === 'resolved').length || 108;
  const avgTime = stats?.avgResolutionHours || 14.2;

  return (
    <section className="relative w-full py-14 sm:py-18 lg:py-20 overflow-hidden border-b border-[--border] font-sans bg-[--bg-base]">

      {/* Restrained soft radial gradient for legibility */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20"
        style={{
          background: 'radial-gradient(circle at 50% 30%, var(--bg-subtle) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[--bg-surface] border border-[--border] text-[--text-secondary] text-xs font-medium shadow-xs">
            ISLAH · Civic &amp; Environmental Reporting Platform
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[--text-primary] leading-[1.08]">
            Report what matters.{' '}
            <span className="text-[--text-secondary]">Reach who can act.</span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-[--text-secondary] font-normal leading-relaxed max-w-2xl mx-auto">
            Islah turns local issues into accountable action. Every report is documented, location-aware, and routed directly to responsible municipal departments with complete SLA transparency.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/report"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[--text-primary] hover:opacity-90 text-[--bg-base] text-sm font-semibold px-6 py-3 rounded-lg shadow-sm transition-all duration-200 active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report an Issue</span>
            </Link>

            <Link
              href="/live-map"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[--bg-surface] hover:bg-[--bg-subtle] text-[--text-primary] border border-[--border] text-sm font-medium px-6 py-3 rounded-lg transition-all duration-200 active:scale-[0.98] group"
            >
              <span>Explore Map</span>
              <ArrowRight className="w-4 h-4 text-[--text-muted] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Metrics Grid — Full Container Width */}
        <div className="pt-8 border-t border-[--border] w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 text-left w-full">

            <div className="bg-[--bg-surface] border border-[--border] hover:border-[--border-subtle] p-5 rounded-lg space-y-2 transition-all">
              <div className="flex items-center justify-between">
                <div className="text-2xl sm:text-3xl font-bold text-[--text-primary] tracking-tight">{totalReported.toLocaleString()}</div>
                <span className="text-[10px] font-semibold text-[--text-muted] bg-[--bg-subtle] border border-[--border] px-2 py-0.5 rounded-md">Tracked</span>
              </div>
              <div className="text-xs font-semibold text-[--text-primary] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[--text-muted] shrink-0" />
                Civic Issues Logged
              </div>
              <p className="text-xs text-[--text-muted] leading-relaxed">Geotagged infrastructure reports routed directly to municipal authorities.</p>
            </div>

            <div className="bg-[--bg-surface] border border-[--border] hover:border-[--border-subtle] p-5 rounded-lg space-y-2 transition-all">
              <div className="flex items-center justify-between">
                <div className="text-2xl sm:text-3xl font-bold text-[--text-primary] tracking-tight">{totalResolved.toLocaleString()}</div>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md">Verified</span>
              </div>
              <div className="text-xs font-semibold text-[--text-primary] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Verified Resolutions
              </div>
              <p className="text-xs text-[--text-muted] leading-relaxed">Confirmed resolutions backed by transparent public audit trails.</p>
            </div>

            <div className="bg-[--bg-surface] border border-[--border] hover:border-[--border-subtle] p-5 rounded-lg space-y-2 transition-all">
              <div className="flex items-center justify-between">
                <div className="text-2xl sm:text-3xl font-bold text-[--text-primary] tracking-tight">{typeof avgTime === 'number' ? `${avgTime}h` : avgTime}</div>
                <span className="text-[10px] font-semibold text-[--text-muted] bg-[--bg-subtle] border border-[--border] px-2 py-0.5 rounded-md">SLA</span>
              </div>
              <div className="text-xs font-semibold text-[--text-primary] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[--text-muted] shrink-0" />
                Avg Response Time
              </div>
              <p className="text-xs text-[--text-muted] leading-relaxed">Automated department dispatch to field crews for rapid triage.</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
