import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 space-y-6 font-sans">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[--text-primary] tracking-tight">Privacy Policy & Data Governance</h1>
      <p className="text-xs text-[--text-secondary]">Effective Date: January 1, 2026</p>
      <div className="space-y-4 text-xs leading-relaxed bg-[--bg-surface] border border-[--border] p-6 sm:p-8 rounded-xl shadow-xs text-[--text-secondary]">
        <h2 className="text-sm font-bold text-[--text-primary]">1. Citizen Identity Protection</h2>
        <p>ISLAH collects photo and location data solely to resolve civic infrastructure problems. Public ticket tracking pages mask citizen names, emails, and phone numbers.</p>
        <h2 className="text-sm font-bold text-[--text-primary]">2. Geolocation Usage</h2>
        <p>GPS data is utilized exclusively for mapping civic issues, calculating ~50m duplicate radii, and routing work orders to municipal field crews.</p>
      </div>
    </div>
  );
}
