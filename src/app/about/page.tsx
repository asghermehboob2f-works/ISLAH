import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, CheckCircle2, Heart, Lightbulb, Users, Compass, Lock } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 space-y-16">
      
      {/* Brand Identity & Meaning Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-extrabold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          The Meaning of ISLAH
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          ISLAH
        </h1>

        <p className="text-2xl font-bold text-blue-600 italic">
          “Turning problems into progress.”
        </p>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-2">
          In Arabic and traditional civic discourse, <strong className="text-slate-900">Islah (إصلاح)</strong> signifies repair, improvement, reconciliation, and reform. It represents the active transformation of a degraded condition into a state of wholeness and progress.
        </p>
      </div>

      {/* Core Philosophy Section */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-blue-600" />
          Why ISLAH Exists: Beyond the Complaint Portal
        </h2>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          For decades, municipal reporting has suffered from structural fragmentation. A citizen notices a pothole, a burst water pipe, or a damaged streetlight. They submit a complaint into an opaque government portal or dial a helpline, only for their report to disappear into an unmonitored bureaucracy.
        </p>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          ISLAH was engineered around a simple, fundamental truth: <strong className="text-slate-900">A civic problem should never end with a complaint.</strong> It must move through a structured, transparent, and technology-assisted journey:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-blue-600">01. Citizen Empowerment</span>
            <p className="text-xs text-slate-600">Simple photo capture with automated location & AI classification.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-amber-600">02. Department SLA</span>
            <p className="text-xs text-slate-600">Direct work order routing with automated SLA escalation countdowns.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-emerald-600">03. Verified Resolution</span>
            <p className="text-xs text-slate-600">AI before/after photo verification ensuring work is actually done.</p>
          </div>
        </div>
      </div>

      {/* Architectural Pillars */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 text-center">
          The Pillars of Modern Civic Infrastructure
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3">
            <Users className="w-6 h-6 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Human Purpose + Modern Tech</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We reject gimmicky AI startups and outdated government web templates. ISLAH integrates serious artificial intelligence solely to assist humans — detecting duplicate reports within 50 meters, identifying problem categories, and verifying resolution photos.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3">
            <Compass className="w-6 h-6 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Public Transparency & Trust</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Civic trust is earned when promises are measured publicly. Every ticket logged on ISLAH remains trackable by any citizen through its unique ticket ID, while protecting citizen personal data and privacy.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3">
            <Lock className="w-6 h-6 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900">Accountability & SLA Enforcement</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Municipal departments are provided with high-density operational queues. When response time thresholds are breached, BullMQ background services escalate issues directly to senior departmental directors.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3">
            <Heart className="w-6 h-6 text-red-600" />
            <h3 className="text-base font-bold text-slate-900">Emergency Hazard Protection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Critical hazards like exposed live wiring or major water line bursts bypass routine triage and trigger immediate high-priority dispatch with 4-hour completion windows.
            </p>
          </div>

        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 text-center space-y-4">
        <h3 className="text-2xl font-bold">Be Part of the Civic Progress</h3>
        <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
          Notice an issue in your neighborhood today? Help turn a problem into progress in under 30 seconds.
        </p>
        <Link
          href="/report"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-colors"
        >
          Report an Issue <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
