'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { HeroSection } from '@/components/HeroSection';
import { IssueCard } from '@/components/IssueCard';
import { IssueDetailModal } from '@/components/IssueDetailModal';
import { CivicIssue } from '@/lib/types';
import {
  ShieldCheck,
  ArrowRight,
  ShieldAlert,
  Building2,
  Users,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const { stats, issues, upvoteIssue } = useApp();
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);

  const categoriesList = [
    { name: 'Roads & Potholes', desc: 'Asphalt cavities, cave-ins, and road structural hazards', count: 42 },
    { name: 'Waste & Sanitation', desc: 'Illegal dump sites, uncollected bins, and sanitation spills', count: 29 },
    { name: 'Streetlights & Electrical', desc: 'Outages, exposed wiring, and dark street corridors', count: 18 },
    { name: 'Drainage & Sewage', desc: 'Blocked stormwater drains and wastewater overflows', count: 21 },
    { name: 'Water Supply', desc: 'Pressurized pipeline leaks and clean water losses', count: 31 },
    { name: 'Public Safety & Hazards', desc: 'Collapsed structures, open manholes, & safety risks', count: 7 },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 font-sans">

      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Trust & Municipal Accountability Banner */}
      <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 md:p-6 shadow-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="space-y-1 py-1">
            <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-base font-bold text-slate-900">100% Transparent</div>
            <p className="text-xs text-slate-500">Every ticket is publicly trackable</p>
          </div>
          <div className="space-y-1 py-1">
            <Building2 className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-base font-bold text-slate-900">5 Departments</div>
            <p className="text-xs text-slate-500">Integrated municipal work queues</p>
          </div>
          <div className="space-y-1 py-1">
            <Sparkles className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-base font-bold text-slate-900">AI Verification</div>
            <p className="text-xs text-slate-500">Automated photo cross-verification</p>
          </div>
          <div className="space-y-1 py-1">
            <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <div className="text-base font-bold text-slate-900">95.8% SLA Pass</div>
            <p className="text-xs text-slate-500">Strict resolution timeframe adherence</p>
          </div>
        </div>
      </section>

      {/* 3. Issue Categories Overview */}
      <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 pb-3">
          <div>
            <h2 className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-0.5">
              Coverage Scope
            </h2>
            <h3 className="text-xl font-bold text-slate-900">
              Civic Infrastructure Categories
            </h3>
          </div>
          <Link href="/report" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
            Report issue in any category <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoriesList.map((cat, i) => (
            <div key={i} className="bg-white border border-slate-200/80 p-4 rounded-xl hover:border-slate-300 transition-all space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {cat.count} Active
                  </span>
                  <span className="text-[10px] font-semibold text-blue-600">SLA &lt; 24h</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{cat.name}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Emergency Lane Priority */}
      <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="bg-red-50/60 text-slate-900 rounded-xl p-6 sm:p-8 border border-red-200/80 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-red-100 text-red-800 border border-red-200 text-[11px] font-semibold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
              Emergency Hazard Priority Lane
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Immediate Dispatch for Critical Civic Hazards
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              Exposed live wires, main road cave-ins, and severe water pipe bursts automatically bypass standard triage. Emergency tickets alert senior departmental marshals with a mandatory 4-hour SLA window.
            </p>
          </div>
          <div className="lg:col-span-4 text-right flex justify-start lg:justify-end">
            <Link
              href="/report?emergency=true"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-lg shadow-xs transition-all active:scale-95"
            >
              Report Emergency Hazard
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Live Active Civic Reports Stream */}
      <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-0.5">
              Real-Time Feed
            </h2>
            <h3 className="text-xl font-bold text-slate-900">
              Recent Civic Reports &amp; Status
            </h3>
          </div>
          <Link href="/reports" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
            View All Reports <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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

      {/* Detail Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />

    </div>
  );
}


