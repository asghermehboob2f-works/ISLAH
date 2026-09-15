'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useApp } from '@/context/AppContext';
import { PlusCircle, ArrowRight, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

const LiquidChrome = dynamic(() => import('@/components/LiquidChrome'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[--bg-base]" />,
});

export function HeroSection() {
  const { stats, issues } = useApp();

  const totalReported = stats?.totalReported || issues?.length || 142;
  const totalResolved = stats?.totalResolved || issues?.filter((i) => i.status === 'resolved').length || 108;
  const avgTime = stats?.avgResolutionHours || 14.2;

  return (
    <section className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center py-10 sm:py-14 lg:py-16 overflow-hidden border-b border-[--border] font-sans" style={{ background: 'var(--bg-base)' }}>

      {/* LiquidChrome shader — always subtle and monochrome */}
      <div className="absolute inset-0 z-0 pointer-events-auto opacity-60 dark:opacity-80">
        <LiquidChrome
          baseColor={[0.1, 0.1, 0.1]}
          speed={0.2}
          amplitude={0.28}
          frequencyX={3}
          frequencyY={3}
          interactive={true}
        />
      </div>

      {/* Radial vignette for readability */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 20%, var(--bg-base) 85%)' }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-[860px] mx-auto text-center space-y-6 sm:space-y-8">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[--bg-surface]/80 border border-[--border] text-[--text-secondary] text-xs font-medium backdrop-blur-md">
            ISLAH · Civic &amp; Environmental Reporting Platform
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[--text-primary] leading-[1.08]">
            Report what matters.{' '}
            <span className="text-[--text-secondary]">Reach who can act.</span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-[--text-secondary] font-normal leading-relaxed max-w-[720px] mx-auto">
            Islah turns local issues into accountable action. Every report is documented, location-aware, and routed directly to responsible municipal departments with complete SLA transparency.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/report"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[--text-primary] hover:opacity-80 text-[--bg-base] text-sm font-semibold px-7 py-3.5 rounded-full shadow-md transition-all duration-200 active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report an Issue</span>
            </Link>

            <Link
              href="/live-map"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[--bg-surface]/80 hover:bg-[--bg-surface] text-[--text-primary] border border-[--border] text-sm font-medium px-7 py-3.5 rounded-full backdrop-blur-md transition-all duration-200 active:scale-[0.98] group"
            >
              <span>Explore Map</span>
              <ArrowRight className="w-4 h-4 text-[--text-muted] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Metrics */}
          <div className="pt-8 border-t border-[--border]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left max-w-[820px] mx-auto">

              <div className="bg-[--bg-surface]/80 backdrop-blur-md border border-[--border] hover:border-[--border-subtle] p-4 rounded-2xl space-y-1.5 transition-all">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-[--text-primary] tracking-tight">{totalReported.toLocaleString()}</div>
                  <span className="text-[10px] font-semibold text-[--text-muted] bg-[--bg-subtle] border border-[--border] px-2 py-0.5 rounded-full">Tracked</span>
                </div>
                <div className="text-xs font-semibold text-[--text-primary] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[--text-muted] shrink-0" />
                  Civic Issues Logged
                </div>
                <p className="text-[11px] text-[--text-muted] leading-snug">Geotagged infrastructure reports routed directly to municipal authorities.</p>
              </div>

              <div className="bg-[--bg-surface]/80 backdrop-blur-md border border-[--border] hover:border-[--border-subtle] p-4 rounded-2xl space-y-1.5 transition-all">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-[--text-primary] tracking-tight">{totalResolved.toLocaleString()}</div>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">Verified</span>
                </div>
                <div className="text-xs font-semibold text-[--text-primary] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  Verified Resolutions
                </div>
                <p className="text-[11px] text-[--text-muted] leading-snug">Confirmed resolutions backed by transparent public audit trails.</p>
              </div>

              <div className="bg-[--bg-surface]/80 backdrop-blur-md border border-[--border] hover:border-[--border-subtle] p-4 rounded-2xl space-y-1.5 transition-all">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-[--text-primary] tracking-tight">{typeof avgTime === 'number' ? `${avgTime}h` : avgTime}</div>
                  <span className="text-[10px] font-semibold text-[--text-muted] bg-[--bg-subtle] border border-[--border] px-2 py-0.5 rounded-full">SLA</span>
                </div>
                <div className="text-xs font-semibold text-[--text-primary] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[--text-muted] shrink-0" />
                  Avg Response Time
                </div>
                <p className="text-[11px] text-[--text-muted] leading-snug">Automated department dispatch to field crews for rapid triage.</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
