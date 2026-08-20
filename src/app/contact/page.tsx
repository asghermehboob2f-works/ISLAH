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
    <div className="w-full max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
          Communication Channels
        </span>
        <h1 className="text-3xl font-bold text-slate-900">
          Contact ISLAH Platform Team
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Have inquiries regarding municipal integration, media, or technical support?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Direct Inquiries</h2>
          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>support@islah-civic.org</span>
            </div>
            <div className="flex items-center gap-3">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>Municipal Hotline: 112 / Civic 311</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>ISLAH Civic Innovation Center, Sector 4</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
          {submitted ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">Message Delivered</h3>
              <p className="text-xs text-slate-500">Thank you. Our team will get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Name</label>
                <input required type="text" className="w-full border rounded-lg px-3 py-2" placeholder="Full name..." />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input required type="email" className="w-full border rounded-lg px-3 py-2" placeholder="name@domain.com..." />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Message</label>
                <textarea required rows={3} className="w-full border rounded-lg p-3" placeholder="How can we assist you?" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5">
                <Send className="w-3.5 h-3.5" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
