import React from 'react';
import Link from 'next/link';
import { Users, ShieldCheck, Award, PlusCircle, ArrowRight } from 'lucide-react';

export default function CitizensPage() {
  return (
    <div className="w-full max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
          Citizen Action Guide
        </span>
        <h1 className="text-3xl font-bold text-slate-900">
          Empowering Every Resident
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          ISLAH makes civic participation effortless. Report an issue in 30 seconds and follow its journey to verified completion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2">
          <Users className="w-6 h-6 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">1. Spot & Snap</h3>
          <p className="text-xs text-slate-600">Take a photo of any damaged infrastructure or hazard in your ward.</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2">
          <ShieldCheck className="w-6 h-6 text-sky-600" />
          <h3 className="text-base font-bold text-slate-900">2. Track Live</h3>
          <p className="text-xs text-slate-600">Receive real-time notifications as staff acknowledge and resolve your report.</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2">
          <Award className="w-6 h-6 text-amber-600" />
          <h3 className="text-base font-bold text-slate-900">3. Earn Civic Score</h3>
          <p className="text-xs text-slate-600">Earn official ward badges and level up your Civic Guardian status.</p>
        </div>
      </div>

      <div className="text-center">
        <Link href="/report" className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-xl inline-flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> Start First Report
        </Link>
      </div>
    </div>
  );
}
