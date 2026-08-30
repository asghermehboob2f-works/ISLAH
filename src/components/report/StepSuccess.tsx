'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Building2, Trees, MapPin, ShieldAlert, ArrowRight, Home, Globe, Lock } from 'lucide-react';

interface StepSuccessProps {
  reportType: 'civic' | 'environmental';
  ticketNumber: string;
  category: string;
  subcategory?: string;
  address: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  emergency: boolean;
  departmentName: string;
}

export function StepSuccess({
  reportType,
  ticketNumber,
  category,
  subcategory,
  address,
  visibility,
  emergency,
  departmentName
}: StepSuccessProps) {
  const isEnv = reportType === 'environmental';

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-6 max-w-xl mx-auto shadow-md font-sans">
      
      {/* Icon Badge */}
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-white shadow-md ${
        isEnv ? 'bg-emerald-600' : 'bg-blue-600'
      }`}>
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Report Submitted Successfully!
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Your report has been registered in the ISLAH database and auto-routed to the designated authority.
        </p>
      </div>

      {/* Ticket ID Card */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Official Unique Ticket Identifier
        </div>
        <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 tracking-wider">
          {ticketNumber}
        </div>

        <div className="grid grid-cols-2 gap-2 text-left pt-2 border-t border-slate-200 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Track / Category</span>
            <span className="font-bold text-slate-800">
              {category} {subcategory ? `(${subcategory})` : ''}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Assigned Authority</span>
            <span className="font-bold text-slate-800">{departmentName}</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Visibility</span>
            <span className="font-bold text-slate-800 flex items-center gap-1">
              {visibility === 'PUBLIC' ? <Globe className="w-3 h-3 text-blue-600" /> : <Lock className="w-3 h-3 text-slate-600" />}
              {visibility}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Priority SLA</span>
            <span className={`font-bold ${emergency ? 'text-red-600' : 'text-slate-800'}`}>
              {emergency ? '4-Hour Emergency' : 'Standard 24-Hour'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/my-reports"
          className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs text-white shadow-sm flex items-center justify-center gap-2 transition-all ${
            isEnv ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-blue-600 hover:bg-blue-500'
          }`}
        >
          <span>View My Reports</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/dashboard"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition-all"
        >
          <Home className="w-4 h-4 text-slate-500" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

    </div>
  );
}
