'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { HeroSection } from '@/components/HeroSection';
import { IssueCard } from '@/components/IssueCard';
import { IssueDetailModal } from '@/components/IssueDetailModal';
import { CivicIssue } from '@/lib/types';
import { ShieldCheck, ArrowRight, ShieldAlert, Building2, Users, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { issues, upvoteIssue } = useApp();
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);

  const categoriesList = [
    { name: 'Roads & Potholes', desc: 'Asphalt cavities, cave-ins, and structural hazards', count: 42 },
    { name: 'Waste & Sanitation', desc: 'Illegal dumps, uncollected bins, spills', count: 29 },
    { name: 'Streetlights & Electrical', desc: 'Outages, exposed wiring, dark corridors', count: 18 },
    { name: 'Drainage & Sewage', desc: 'Blocked drains and wastewater overflows', count: 21 },
    { name: 'Water Supply', desc: 'Pipeline leaks and clean water losses', count: 31 },
    { name: 'Public Safety', desc: 'Collapsed structures, open manholes, hazards', count: 7 },
  ];

  return (
    <div className="bg-[--bg-base] text-[--text-primary] font-sans overflow-x-hidden">

      {/* Hero */}
      <HeroSection />

      {/* Trust Metrics Bar */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[--bg-surface] rounded-xl border border-[--border] p-5 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-[--border]">
          {[
            { icon: <Users className="w-5 h-5 text-[--text-muted] mx-auto mb-1.5" />, title: '100% Transparent', desc: 'Every ticket is publicly trackable' },
            { icon: <Building2 className="w-5 h-5 text-[--text-muted] mx-auto mb-1.5" />, title: '5 Departments', desc: 'Integrated municipal work queues' },
            { icon: <Sparkles className="w-5 h-5 text-[--text-muted] mx-auto mb-1.5" />, title: 'AI Verification', desc: 'Automated photo cross-verification' },
            { icon: <ShieldCheck className="w-5 h-5 text-[--text-muted] mx-auto mb-1.5" />, title: '95.8% SLA Pass', desc: 'Strict resolution timeframe adherence' },
          ].map((item, i) => (
            <div key={i} className="space-y-1 py-1">
              {item.icon}
              <div className="text-sm font-semibold text-[--text-primary]">{item.title}</div>
              <p className="text-xs text-[--text-muted]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[--border] pb-4">
          <div>
            <p className="text-xs font-semibold text-[--text-muted] uppercase tracking-widest mb-1">Coverage Scope</p>
            <h2 className="text-xl font-bold text-[--text-primary]">Civic Infrastructure Categories</h2>
          </div>
          <Link href="/report" className="text-xs font-medium text-[--text-secondary] hover:text-[--text-primary] flex items-center gap-1 transition-colors">
            Report an issue <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categoriesList.map((cat, i) => (
            <div key={i} className="bg-[--bg-surface] border border-[--border] hover:border-[--border-subtle] p-4 rounded-xl transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium bg-[--bg-subtle] text-[--text-secondary] px-2 py-0.5 rounded-md border border-[--border]">{cat.count} Active</span>
                <span className="text-[10px] text-[--text-muted]">&lt; 24h SLA</span>
              </div>
              <h4 className="text-xs font-semibold text-[--text-primary]">{cat.name}</h4>
              <p className="text-[11px] text-[--text-muted] leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Lane */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-red-50/90 dark:bg-[#1f1013] border border-red-200 dark:border-red-900/80 rounded-lg p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 text-[11px] font-semibold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              Emergency Hazard Priority Lane
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[--text-primary]">Immediate Dispatch for Critical Civic Hazards</h3>
            <p className="text-xs sm:text-sm text-[--text-secondary] leading-relaxed max-w-2xl">
              Exposed live wires, main road cave-ins, and severe water pipe bursts automatically bypass standard triage. Emergency tickets alert senior departmental marshals with a mandatory 4-hour SLA window.
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <Link
              href="/report?emergency=true"
              className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-lg transition-all active:scale-95"
            >
              Report Emergency Hazard
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Reports Feed */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[--text-muted] uppercase tracking-widest mb-1">Real-Time Feed</p>
            <h2 className="text-xl font-bold text-[--text-primary]">Recent Civic Reports &amp; Status</h2>
          </div>
          <Link href="/reports" className="text-xs font-medium text-[--text-secondary] hover:text-[--text-primary] flex items-center gap-1 transition-colors">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {issues.slice(0, 4).map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onSelect={(iss) => setSelectedIssue(iss)}
              onUpvote={(e, id) => upvoteIssue(id)}
            />
          ))}
        </div>
      </section>

      <IssueDetailModal issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
    </div>
  );
}
