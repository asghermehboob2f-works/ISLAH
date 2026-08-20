import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 space-y-6 text-slate-800">
      <h1 className="text-3xl font-bold text-slate-900">Privacy Policy & Data Governance</h1>
      <p className="text-xs text-slate-500">Effective Date: January 1, 2026</p>
      <div className="space-y-4 text-xs leading-relaxed bg-white border p-6 rounded-2xl">
        <h2 className="text-sm font-bold text-slate-900">1. Citizen Identity Protection</h2>
        <p>ISLAH collects photo and location data solely to resolve civic infrastructure problems. Public ticket tracking pages mask citizen names, emails, and phone numbers.</p>
        <h2 className="text-sm font-bold text-slate-900">2. Geolocation Usage</h2>
        <p>GPS data is utilized exclusively for mapping civic issues, calculating ~50m duplicate radii, and routing work orders to municipal field crews.</p>
      </div>
    </div>
  );
}
