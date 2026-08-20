import React from 'react';

export default function TermsPage() {
  return (
    <div className="w-full max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 space-y-6 text-slate-800">
      <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
      <p className="text-xs text-slate-500">Effective Date: January 1, 2026</p>
      <div className="space-y-4 text-xs leading-relaxed bg-white border p-6 rounded-2xl">
        <h2 className="text-sm font-bold text-slate-900">1. Acceptable Reporting</h2>
        <p>Users must submit genuine photos of civic infrastructure issues. Fraudulent submissions or misuse of emergency priority flags are subject to civic score forfeiture.</p>
        <h2 className="text-sm font-bold text-slate-900">2. Service Level Agreements</h2>
        <p>Target resolution hours (SLA) represent operational goals for municipal departments.</p>
      </div>
    </div>
  );
}
