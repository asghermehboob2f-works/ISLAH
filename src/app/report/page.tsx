'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Building2,
  Trees,
  ArrowRight,
  Lock,
  LogIn,
  UserPlus,
  ShieldCheck,
  AlertTriangle,
  FileText,
  MapPin,
  Leaf,
  Droplets,
  Construction,
  Trash2,
  Zap,
  Shield
} from 'lucide-react';

export default function ReportHubPage() {
  const { user, activeRole } = useApp();

  // If non-authenticated user tries to report
  if (!user || activeRole !== 'citizen') {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-16 text-center space-y-8 font-sans">
        <div className="w-16 h-16 rounded-xl bg-blue-600/10 border border-blue-600/20 text-[--accent] flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[--text-primary] tracking-tight">
            Please Log In to Submit a Report
          </h1>
          <p className="text-sm text-[--text-secondary] max-w-md mx-auto leading-relaxed">
            ISLAH requires verified resident authentication to prevent duplicate spam, protect sensitive environmental data, and provide real-time SLA tracking for your tickets.
          </p>
        </div>

        <div className="bg-[--bg-surface] border border-[--border] rounded-xl p-5 text-left text-xs space-y-2 text-[--text-secondary]">
          <div className="font-bold text-[--text-primary] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Authenticated Citizen Benefits
          </div>
          <ul className="space-y-1.5 list-disc list-inside text-[--text-secondary] font-medium">
            <li>Direct 4-hour / 12-hour SLA response queue routing</li>
            <li>Real-time AI verification notifications & timeline updates</li>
            <li>Access to both Civic and Environment & Wildlife reporting tracks</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/login?returnUrl=/report"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-xl shadow-sm text-xs flex items-center justify-center gap-2 transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Login to Submit Report</span>
          </Link>
          <Link
            href="/signup"
            className="flex-1 bg-[--bg-surface] hover:bg-[--bg-subtle] text-[--text-primary] font-semibold py-3 px-5 rounded-xl border border-[--border] text-xs flex items-center justify-center gap-2 transition-all"
          >
            <UserPlus className="w-4 h-4 text-[--text-secondary]" />
            <span>Create Resident Account</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 space-y-10 font-sans">

      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[--text-primary] tracking-tight">
          What would you like to report?
        </h1>
        <p className="text-sm sm:text-base text-[--text-secondary] leading-relaxed">
          Select a dedicated domain workflow below. ISLAH maintains separate reporting, department dispatch, and tracking systems for civic infrastructure and natural ecosystems.
        </p>
      </div>

      {/* Two Separate Reporting Tracks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

        {/* Track 1: Civic Issues */}
        <div className="bg-[--bg-surface] rounded-xl border border-[--border] p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-6 group">
          <div className="space-y-5">

            <div className="w-14 h-14 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shadow-xs">
              <Building2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-[--text-muted] uppercase tracking-wider">
                Municipal Domain
              </div>
              <h2 className="text-2xl font-bold text-[--text-primary] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Civic Issues
              </h2>
              <p className="text-xs sm:text-sm text-[--text-secondary] leading-relaxed">
                Problems affecting public infrastructure, municipal services, roads, sanitation, power, and neighborhood utilities.
              </p>
            </div>

            {/* Scope Bullets */}
            <div className="bg-[--bg-subtle] rounded-xl p-4 border border-[--border] space-y-2 text-xs text-[--text-secondary]">
              <div className="font-bold text-[--text-primary] text-[11px] uppercase tracking-wider">
                Supported Reports
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <span className="flex items-center gap-1.5"><Construction className="w-3.5 h-3.5 text-[--text-secondary]" /> Roads & Potholes</span>
                <span className="flex items-center gap-1.5"><Trash2 className="w-3.5 h-3.5 text-[--text-secondary]" /> Garbage & Waste</span>
                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-[--text-secondary]" /> Streetlights & Power</span>
                <span className="flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-[--text-secondary]" /> Water Supply & Leaks</span>
                <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-[--text-secondary]" /> Drainage & Sewage</span>
                <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-[--text-secondary]" /> Public Facilities</span>
              </div>
            </div>

          </div>

          <Link
            href="/report/civic"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-3.5 px-5 rounded-xl shadow-sm flex items-center justify-center gap-2 group-hover:translate-x-0.5 transition-all"
          >
            <span>Enter Civic Reporting Workflow</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Track 2: Environment & Wildlife */}
        <div className="bg-[--bg-surface] rounded-xl border border-[--border] p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-6 group">
          <div className="space-y-5">

            <div className="w-14 h-14 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-xs">
              <Trees className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-[--text-muted] uppercase tracking-wider">
                Ecological Safeguard Domain
              </div>
              <h2 className="text-2xl font-bold text-[--text-primary] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Environment & Wildlife
              </h2>
              <p className="text-xs sm:text-sm text-[--text-secondary] leading-relaxed">
                Problems, illegal threats, or damage affecting wildlife, forests, water bodies, ecosystems, and environmental safety.
              </p>
            </div>

            {/* Scope Bullets */}
            <div className="bg-emerald-500/5 dark:bg-emerald-950/20 rounded-xl p-4 border border-emerald-500/20 space-y-2 text-xs text-[--text-secondary]">
              <div className="font-bold text-emerald-700 dark:text-emerald-400 text-[11px] uppercase tracking-wider">
                Supported Threat Reports
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300"><Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Deforestation / Tree Cutting</span>
                <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300"><Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Poaching & Wildlife Harm</span>
                <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300"><Droplets className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> River & Wetland Pollution</span>
                <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300"><AlertTriangle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Toxic Dumping & Spills</span>
                <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300"><Trees className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Forest Fires & Hazards</span>
                <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Sensitive Habitat Shield</span>
              </div>
            </div>

          </div>

          <Link
            href="/report/environmental"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-3.5 px-5 rounded-xl shadow-sm flex items-center justify-center gap-2 group-hover:translate-x-0.5 transition-all"
          >
            <span>Enter Environmental Reporting Workflow</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

    </div>
  );
}
