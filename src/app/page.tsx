'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { IssueCard } from '@/components/IssueCard';
import { IssueDetailModal } from '@/components/IssueDetailModal';
import { CivicIssue } from '@/lib/types';
import { 
  ShieldCheck, 
  PlusCircle, 
  MapPin, 
  ArrowRight, 
  Camera, 
  Sparkles, 
  Route, 
  CheckCircle2, 
  ShieldAlert, 
  Award, 
  Building2, 
  Users, 
  BarChart3, 
  Clock, 
  Flame,
  Zap,
  Check
} from 'lucide-react';

export default function HomePage() {
  const { stats, issues, upvoteIssue, cmsContent } = useApp();
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);

  const categoriesList = [
    { name: 'Roads & Potholes', icon: 'Construction', desc: 'Asphalt cavities, cave-ins, and road structural hazards', count: 42 },
    { name: 'Waste & Sanitation', icon: 'Trash2', desc: 'Illegal dump sites, uncollected bins, and sanitation spills', count: 29 },
    { name: 'Streetlights & Electrical', icon: 'Zap', desc: 'Outages, exposed wiring, and dark street corridors', count: 18 },
    { name: 'Drainage & Sewage', icon: 'Waves', desc: 'Blocked stormwater drains and wastewater overflows', count: 21 },
    { name: 'Water Supply', icon: 'Droplets', desc: 'Pressurized pipeline leaks and clean water losses', count: 31 },
    { name: 'Public Safety & Hazards', icon: 'AlertTriangle', desc: 'Collapsed structures, open manholes, & safety risks', count: 7 },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-12 sm:pt-16 pb-16 sm:pb-20 border-b border-slate-800">
        
        {/* Subtle Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                {cmsContent.heroHeadline}<br />
                <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  {cmsContent.heroSubheadline}
                </span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl leading-relaxed">
                {cmsContent.heroDescription}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/report"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-150 active:scale-98"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{cmsContent.ctaPrimaryText || 'Report Issue Now'}</span>
                </Link>

                <Link
                  href="/live-map"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-slate-200 text-sm font-medium px-5 py-2.5 rounded-lg border border-white/15 backdrop-blur-md transition-all duration-150 active:scale-98"
                >
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>{cmsContent.ctaSecondaryText || 'Explore Live Map'}</span>
                </Link>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-slate-300 max-w-xl">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white font-mono">{stats.totalReported.toLocaleString()}</div>
                  <div className="text-[11px] text-slate-400 font-medium">Issues Logged</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">{stats.totalResolved.toLocaleString()}</div>
                  <div className="text-[11px] text-slate-400 font-medium">Verified Solved</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-sky-400 font-mono">{stats.avgResolutionTimeHours}h</div>
                  <div className="text-[11px] text-slate-400 font-medium">Avg Resolution Time</div>
                </div>
              </div>
            </div>

            {/* Right Visual: Problem to Resolution Pipeline Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/90 border border-slate-700/80 p-5 sm:p-6 rounded-2xl shadow-xl space-y-4 backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    Civic Issue Workflow Pipeline
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                    LIVE SYSTEM
                  </span>
                </div>

                <div className="space-y-3">
                  
                  {/* Step 1 */}
                  <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 font-bold text-xs">
                      01
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Citizen Snap & Upload</h4>
                      <p className="text-[11px] text-slate-400">Photo capture with auto-detected GPS location</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <div className="w-7 h-7 rounded-lg bg-sky-600/20 text-sky-400 flex items-center justify-center shrink-0 font-bold text-xs">
                      02
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">AI Classification & Route</h4>
                      <p className="text-[11px] text-slate-400">Instant severity assessment & department dispatch</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <div className="w-7 h-7 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0 font-bold text-xs">
                      03
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Department Action & SLA</h4>
                      <p className="text-[11px] text-slate-400">Field work order execution with real-time tracking</p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-start gap-3 bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/40">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs">
                      04
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-300">AI Visual Verification</h4>
                      <p className="text-[11px] text-emerald-400/80">Before/after photo matching confirms complete resolution</p>
                    </div>
                  </div>

                </div>

                <div className="pt-1 text-center">
                  <Link href="/about" className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1">
                    Read the story & philosophy behind ISLAH <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Trust & Municipal Accountability Banner */}
      <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 md:p-6 shadow-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
          <div className="space-y-1 py-1">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">100% Transparent</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Every ticket is publicly trackable</p>
          </div>
          <div className="space-y-1 py-1">
            <Building2 className="w-5 h-5 text-sky-600 dark:text-sky-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">5 Departments</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Integrated municipal work queues</p>
          </div>
          <div className="space-y-1 py-1">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">AI Verification</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Automated photo cross-verification</p>
          </div>
          <div className="space-y-1 py-1">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">95.8% SLA Pass</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Strict resolution timeframe adherence</p>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Operational Lifecycle
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            How ISLAH Works
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            From citizen observation to confirmed municipal fix, ISLAH streamlines every stage of civic resolution with zero bureaucratic friction.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { title: '1. Capture', desc: 'Citizen snaps a photo of a pothole, broken light, or waste dump.', icon: Camera },
            { title: '2. Understand', desc: 'AI classifies category, assesses severity, and checks duplicate radius.', icon: Sparkles },
            { title: '3. Route', desc: 'Automated dispatch to the relevant municipal department queue.', icon: Route },
            { title: '4. Resolve', desc: 'Field team executes site repairs within strict SLA hours.', icon: Clock },
            { title: '5. Verify', desc: 'Resolution photo is AI-verified and updated on the public timeline.', icon: CheckCircle2 },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl space-y-2 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors shadow-xs relative">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.title}</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Issue Categories Overview */}
      <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">
              Coverage Scope
            </h2>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Civic Infrastructure Categories
            </h3>
          </div>
          <Link href="/report" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 flex items-center gap-1">
            Report issue in any category <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {categoriesList.map((cat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl hover:shadow-sm transition-all space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                    {cat.count} Active
                  </span>
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">SLA &lt; 24h</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{cat.name}</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Emergency Lane Priority */}
      <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="bg-gradient-to-r from-red-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-red-900/80 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/30 text-red-300 border border-red-500/40 text-[10px] font-bold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              Emergency Hazard Priority Lane
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">
              Immediate Dispatch for Critical Civic Hazards
            </h3>
            <p className="text-xs sm:text-sm text-red-100/90 leading-relaxed max-w-2xl">
              Exposed live wires, main road cave-ins, and severe water pipe bursts automatically bypass standard triage. Emergency tickets alert senior departmental marshals with a mandatory 4-hour SLA window.
            </p>
          </div>
          <div className="lg:col-span-4 text-right flex justify-start lg:justify-end">
            <Link
              href="/report?emergency=true"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md shadow-red-600/40 text-center block transition-all active:scale-95"
            >
              Report Emergency Hazard
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Live Active Civic Reports Stream */}
      <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">
              Real-Time Feed
            </h2>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Recent Civic Reports & Status
            </h3>
          </div>
          <Link href="/my-reports" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 flex items-center gap-1">
            View All Reports <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-6">
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
