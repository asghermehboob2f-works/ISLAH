'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { formatDateTime } from '@/lib/dateUtils';
import {
  ShieldCheck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  FileText,
  Building,
  Sparkles
} from 'lucide-react';
import { TimelineEvent } from '@/lib/types';

export default function PublicTicketTrackerPage() {
  const params = useParams();
  const ticketIdParam = params.ticketId as string;
  const { issues } = useApp();

  const ticket = issues.find((i) => i.id === ticketIdParam || i.ticketNumber === ticketIdParam);

  if (!ticket) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4 font-sans">
        <FileText className="w-12 h-12 text-slate-300 mx-auto" />
        <h1 className="text-xl font-bold text-slate-900">Ticket Not Found</h1>
        <p className="text-xs text-slate-500">
          No ticket record found matching ID <strong className="font-mono">{ticketIdParam}</strong>.
        </p>
        <Link href="/" className="inline-block bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-lg">
          Back to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans overflow-x-hidden">

      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[--border] pb-4">
        <Link href="/my-reports" className="text-xs font-semibold text-[--text-secondary] hover:text-[--text-primary] flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <span className="text-xs bg-[--bg-subtle] text-[--text-primary] border border-[--border] px-3 py-1 rounded-md font-mono font-bold">
          {ticket.ticketNumber}
        </span>
      </div>

      {/* Ticket Details Body */}
      <div className="bg-[--bg-surface] rounded-lg border border-[--border] p-6 sm:p-8 space-y-6 shadow-xs">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[--border] pb-4">
          <div>
            <span className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
              {ticket.category}
            </span>
            <h1 className="text-2xl font-bold text-[--text-primary]">{ticket.title}</h1>
            <p className="text-xs text-[--text-secondary] mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {ticket.location.address} ({ticket.location.ward})
            </p>
            <p className="text-xs text-[--text-secondary] font-semibold mt-1">
              Assigned Department: <span className="text-[--text-primary] font-bold">{ticket.departmentName}</span>
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${ticket.status === 'resolved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800' :
              ticket.status === 'in_progress' ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800' : 'bg-[--bg-subtle] text-[--text-primary] border border-[--border]'
              }`}>
              Status: {ticket.status.replace('_', ' ')}
            </span>

            {ticket.nextActionDate && (
              <span className="text-[11px] bg-amber-50 text-amber-900 border border-amber-300 font-mono font-bold px-3 py-1 rounded-md dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
                Next Action: {ticket.nextActionDate}
              </span>
            )}
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[--text-secondary]">Original Reported Photo</span>
            <div className="h-56 bg-[--bg-subtle] rounded-lg overflow-hidden border border-[--border]">
              <img src={ticket.photoUrl} alt="Reported issue" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-[--text-secondary]">Verified Resolution Photo</span>
            <div className="h-56 bg-[--bg-subtle] rounded-lg overflow-hidden border border-[--border] flex items-center justify-center">
              {ticket.resolutionPhotoUrl ? (
                <img src={ticket.resolutionPhotoUrl} alt="Resolved issue" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6 text-[--text-secondary]">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-[--text-secondary] opacity-50" />
                  <p className="text-xs">Work In Progress</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4 pt-4 border-t border-[--border]">
          <h3 className="text-xs font-bold text-[--text-primary] uppercase tracking-wider">
            Public Audit Timeline
          </h3>

          <div className="space-y-4 relative pl-4 border-l-2 border-[--border]">
            {ticket.timeline.map((evt: TimelineEvent) => (
              <div key={evt.id} className="relative text-xs space-y-0.5">
                <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-[--text-primary] ring-4 ring-[--bg-surface]" />
                <div className="flex items-center justify-between text-[--text-secondary]">
                  <span className="font-bold text-[--text-primary]">{evt.title}</span>
                  <span suppressHydrationWarning>{formatDateTime(evt.timestamp)}</span>
                </div>
                <p className="text-[--text-secondary]">{evt.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
