'use client';

import React, { useState } from 'react';
import { Mail, PhoneCall, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 space-y-10 font-sans">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[--text-muted] uppercase tracking-wider">
          Communication Channels
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[--text-primary] tracking-tight">
          Contact ISLAH Platform Team
        </h1>
        <p className="text-xs sm:text-sm text-[--text-secondary]">
          Have inquiries regarding municipal integration, media, or technical support?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[--bg-surface] border border-[--border] p-6 rounded-xl space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-[--text-primary]">Direct Inquiries</h2>
          <div className="space-y-3 text-xs text-[--text-secondary]">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>support@islah-civic.org</span>
            </div>
            <div className="flex items-center gap-3">
              <PhoneCall className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Municipal Hotline: 112 / Civic 311</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>ISLAH Civic Innovation Center, Sector 4</span>
            </div>
          </div>
        </div>

        <div className="bg-[--bg-surface] border border-[--border] p-6 rounded-xl space-y-4 shadow-xs">
          {submitted ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h3 className="text-sm font-bold text-[--text-primary]">Message Delivered</h3>
              <p className="text-xs text-[--text-secondary]">Thank you. Our team will get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[--text-primary] block mb-1">Your Name</label>
                <input required type="text" className="w-full border border-[--border] rounded-xl px-3.5 py-2.5 bg-[--bg-subtle] text-[--text-primary] focus:ring-2 focus:ring-blue-500/20 focus:outline-none" placeholder="Full name..." />
              </div>
              <div>
                <label className="font-semibold text-[--text-primary] block mb-1">Email Address</label>
                <input required type="email" className="w-full border border-[--border] rounded-xl px-3.5 py-2.5 bg-[--bg-subtle] text-[--text-primary] focus:ring-2 focus:ring-blue-500/20 focus:outline-none" placeholder="name@domain.com..." />
              </div>
              <div>
                <label className="font-semibold text-[--text-primary] block mb-1">Message</label>
                <textarea required rows={3} className="w-full border border-[--border] rounded-xl p-3.5 bg-[--bg-subtle] text-[--text-primary] focus:ring-2 focus:ring-blue-500/20 focus:outline-none" placeholder="How can we assist you?" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer">
                <Send className="w-3.5 h-3.5" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
