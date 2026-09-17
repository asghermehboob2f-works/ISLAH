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
    <div className="bg-[--bg-surface] rounded-xl border border-[--border] p-8 sm:p-12 text-center space-y-6 max-w-xl mx-auto shadow-sm font-sans">

      {/* Icon Badge */}
      <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto text-white shadow-sm ${isEnv ? 'bg-emerald-600' : 'bg-blue-600'
        }`}>
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-[--text-primary] tracking-tight">
          Report Submitted Successfully!
        </h2>
        <p className="text-xs text-[--text-secondary] max-w-md mx-auto">
          Your report has been registered in the ISLAH database and auto-routed to the designated authority.
        </p>
      </div>

      {/* Ticket ID Card */}
      <div className="bg-[--bg-subtle] border border-[--border] p-4 rounded-xl space-y-3">
        <div className="text-[10px] font-bold text-[--text-secondary] uppercase tracking-wider">
          Official Unique Ticket Identifier
        </div>
        <div className="text-xl sm:text-2xl font-black font-mono text-[--text-primary] tracking-wider">
          {ticketNumber}
        </div>

        <div className="grid grid-cols-2 gap-2 text-left pt-2 border-t border-[--border] text-xs">
          <div>
            <span className="text-[10px] text-[--text-secondary] font-bold block uppercase">Track / Category</span>
            <span className="font-bold text-[--text-primary]">
              {category} {subcategory ? `(${subcategory})` : ''}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[--text-secondary] font-bold block uppercase">Assigned Authority</span>
            <span className="font-bold text-[--text-primary]">{departmentName}</span>
          </div>

          <div>
            <span className="text-[10px] text-[--text-secondary] font-bold block uppercase">Visibility</span>
            <span className="font-bold text-[--text-primary] flex items-center gap-1">
              {visibility === 'PUBLIC' ? <Globe className="w-3 h-3 text-blue-600 dark:text-blue-400" /> : <Lock className="w-3 h-3 text-[--text-secondary]" />}
              {visibility}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[--text-secondary] font-bold block uppercase">Priority SLA</span>
            <span className={`font-bold ${emergency ? 'text-red-600 dark:text-red-400' : 'text-[--text-primary]'}`}>
              {emergency ? '4-Hour Emergency' : 'Standard 24-Hour'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/my-reports"
          className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-xs text-white shadow-sm flex items-center justify-center gap-2 transition-all ${isEnv ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          <span>View My Reports</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/dashboard"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-[--border] font-semibold text-xs text-[--text-primary] hover:bg-[--bg-subtle] flex items-center justify-center gap-2 transition-all"
        >
          <Home className="w-4 h-4 text-[--text-secondary]" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

    </div>
  );
}
