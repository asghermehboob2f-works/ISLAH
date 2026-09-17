import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, CheckCircle2, Heart, Lightbulb, Users, Compass, Lock } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 space-y-16 font-sans">

      {/* Brand Identity & Meaning Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest text-[--text-muted] flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          The Meaning of ISLAH
        </p>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-[--text-primary] tracking-tight">
          ISLAH
        </h1>

        <p className="text-xl sm:text-2xl font-bold text-[--text-secondary] italic">
          “Turning problems into progress.”
        </p>

        <p className="text-sm sm:text-base text-[--text-secondary] leading-relaxed pt-2">
          In Arabic and traditional civic discourse, <strong className="text-[--text-primary]">Islah (إصلاح)</strong> signifies repair, improvement, reconciliation, and reform. It represents the active transformation of a degraded condition into a state of wholeness and progress.
        </p>
      </div>

      {/* Core Philosophy Section */}
      <div className="bg-[--bg-surface] rounded-xl p-6 sm:p-8 border border-[--border] shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-[--text-primary] flex items-center gap-2.5">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          Why ISLAH Exists: Beyond the Complaint Portal
        </h2>

        <p className="text-xs sm:text-sm text-[--text-secondary] leading-relaxed">
          For decades, municipal reporting has suffered from structural fragmentation. A citizen notices a pothole, a burst water pipe, or a damaged streetlight. They submit a complaint into an opaque government portal or dial a helpline, only for their report to disappear into an unmonitored bureaucracy.
        </p>

        <p className="text-xs sm:text-sm text-[--text-secondary] leading-relaxed">
          ISLAH was engineered around a simple, fundamental truth: <strong className="text-[--text-primary]">A civic problem should never end with a complaint.</strong> It must move through a structured, transparent, and technology-assisted journey:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-[--bg-subtle] p-5 rounded-lg border border-[--border] space-y-1.5">
            <span className="text-xs font-bold text-[--text-primary] block">01. Citizen Empowerment</span>
            <p className="text-xs text-[--text-secondary]">Simple photo capture with automated location &amp; AI classification.</p>
          </div>
          <div className="bg-[--bg-subtle] p-5 rounded-lg border border-[--border] space-y-1.5">
            <span className="text-xs font-bold text-[--text-primary] block">02. Department SLA</span>
            <p className="text-xs text-[--text-secondary]">Direct work order routing with automated SLA escalation countdowns.</p>
          </div>
          <div className="bg-[--bg-subtle] p-5 rounded-lg border border-[--border] space-y-1.5">
            <span className="text-xs font-bold text-[--text-primary] block">03. Verified Resolution</span>
            <p className="text-xs text-[--text-secondary]">AI before/after photo verification ensuring work is actually done.</p>
          </div>
        </div>
      </div>

      {/* Architectural Pillars */}
      <div className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <p className="text-xs font-bold text-[--text-secondary] uppercase tracking-widest">Core Standards</p>
          <h2 className="text-2xl font-bold text-[--text-primary]">
            The Pillars of Modern Civic Infrastructure
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-[--bg-surface] border border-[--border] p-6 rounded-xl space-y-3 shadow-xs">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-[--text-primary]">Human Purpose + Modern Tech</h3>
            <p className="text-xs text-[--text-secondary] leading-relaxed">
              We reject gimmicky AI startups and outdated government web templates. ISLAH integrates serious artificial intelligence solely to assist humans — detecting duplicate reports within 50 meters, identifying problem categories, and verifying resolution photos.
            </p>
          </div>

          <div className="bg-[--bg-surface] border border-[--border] p-6 rounded-xl space-y-3 shadow-xs">
            <Compass className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-[--text-primary]">Public Transparency &amp; Trust</h3>
            <p className="text-xs text-[--text-secondary] leading-relaxed">
              Civic trust is earned when promises are measured publicly. Every ticket logged on ISLAH remains trackable by any citizen through its unique ticket ID, while protecting citizen personal data and privacy.
            </p>
          </div>

          <div className="bg-[--bg-surface] border border-[--border] p-6 rounded-xl space-y-3 shadow-xs">
            <Lock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h3 className="text-base font-bold text-[--text-primary]">Accountability &amp; SLA Enforcement</h3>
            <p className="text-xs text-[--text-secondary] leading-relaxed">
              Municipal departments are provided with high-density operational queues. When response time thresholds are breached, BullMQ background services escalate issues directly to senior departmental directors.
            </p>
          </div>

          <div className="bg-[--bg-surface] border border-[--border] p-6 rounded-xl space-y-3 shadow-xs">
            <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
            <h3 className="text-base font-bold text-[--text-primary]">Emergency Hazard Protection</h3>
            <p className="text-xs text-[--text-secondary] leading-relaxed">
              Critical hazards like exposed live wiring or major water line bursts bypass routine triage and trigger immediate high-priority dispatch with 4-hour completion windows.
            </p>
          </div>

        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[--bg-surface] text-[--text-primary] rounded-xl border border-[--border] p-8 sm:p-10 text-center space-y-4 shadow-xs">
        <h3 className="text-2xl font-bold">Be Part of the Civic Progress</h3>
        <p className="text-xs text-[--text-secondary] max-w-xl mx-auto leading-relaxed">
          Notice an issue in your neighborhood today? Help turn a problem into progress in under 30 seconds.
        </p>
        <Link
          href="/report"
          className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white dark:bg-blue-600 font-bold text-xs px-6 py-3 rounded-lg shadow-xs transition-colors"
        >
          Report an Issue <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
