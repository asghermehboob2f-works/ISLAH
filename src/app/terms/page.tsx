import React from 'react';

export default function TermsPage() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 space-y-6 font-sans">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[--text-primary] tracking-tight">Terms of Service</h1>
      <p className="text-xs text-[--text-secondary]">Effective Date: January 1, 2026</p>
      <div className="space-y-4 text-xs leading-relaxed bg-[--bg-surface] border border-[--border] p-6 sm:p-8 rounded-xl shadow-xs text-[--text-secondary]">
        <h2 className="text-sm font-bold text-[--text-primary]">1. Acceptable Reporting</h2>
        <p>Users must submit genuine photos of civic infrastructure issues. Fraudulent submissions or misuse of emergency priority flags are subject to civic score forfeiture.</p>
        <h2 className="text-sm font-bold text-[--text-primary]">2. Service Level Agreements</h2>
        <p>Target resolution hours (SLA) represent operational goals for municipal departments.</p>
      </div>
    </div>
  );
}
