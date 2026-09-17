import React from 'react';
import Link from 'next/link';
import { Users, ShieldCheck, Award, PlusCircle, ArrowRight } from 'lucide-react';

export default function CitizensPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 space-y-10 font-sans">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
          Citizen Action Guide
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[--text-primary] tracking-tight">
          Empowering Every Resident
        </h1>
        <p className="text-xs sm:text-sm text-[--text-secondary]">
          ISLAH makes civic participation effortless. Report an issue in 30 seconds and follow its journey to verified completion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[--bg-surface] border border-[--border] p-6 rounded-xl space-y-2 shadow-xs">
          <Users className="w-6 h-6 text-[--text-muted]" />
          <h3 className="text-base font-bold text-[--text-primary]">1. Spot &amp; Snap</h3>
          <p className="text-xs text-[--text-secondary]">Take a photo of any damaged infrastructure or hazard in your ward.</p>
        </div>

        <div className="bg-[--bg-surface] border border-[--border] p-6 rounded-xl space-y-2 shadow-xs">
          <ShieldCheck className="w-6 h-6 text-[--text-muted]" />
          <h3 className="text-base font-bold text-[--text-primary]">2. Track Live</h3>
          <p className="text-xs text-[--text-secondary]">Receive real-time notifications as staff acknowledge and resolve your report.</p>
        </div>

        <div className="bg-[--bg-surface] border border-[--border] p-6 rounded-xl space-y-2 shadow-xs">
          <Award className="w-6 h-6 text-[--text-muted]" />
          <h3 className="text-base font-bold text-[--text-primary]">3. Earn Civic Score</h3>
          <p className="text-xs text-[--text-secondary]">Earn official ward badges and level up your Civic Guardian status.</p>
        </div>
      </div>

      <div className="text-center">
        <Link href="/report" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-3.5 rounded-xl inline-flex items-center gap-2 shadow-sm transition-all">
          <PlusCircle className="w-4 h-4" /> Start First Report
        </Link>
      </div>
    </div>
  );
}
