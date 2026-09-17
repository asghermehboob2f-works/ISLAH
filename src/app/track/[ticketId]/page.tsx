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
  ArrowLeft,
  FileText,
  Check
} from 'lucide-react';
import { TimelineEvent } from '@/lib/types';

export default function PublicTicketTrackerPage() {
  const params = useParams();
  const ticketIdParam = params.ticketId as string;
  const { issues } = useApp();

  const ticket = issues.find((i) => i.id === ticketIdParam || i.ticketNumber === ticketIdParam);

  if (!ticket) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-20 text-center space-y-4 font-sans">
        <FileText className="w-12 h-12 text-[--text-muted] mx-auto opacity-60" />
        <h1 className="text-xl font-bold text-[--text-primary]">Ticket Not Found</h1>
        <p className="text-xs text-[--text-secondary]">
          No ticket record found matching ID <strong className="font-mono">{ticketIdParam}</strong>.
        </p>
        <Link href="/" className="inline-block bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors shadow-xs">
          Back to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-10 space-y-8 font-sans overflow-x-hidden">

      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[--border] pb-4">
        <Link href="/my-reports" className="text-xs font-bold text-[--text-secondary] hover:text-[--text-primary] flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <span className="text-xs bg-[--bg-surface] text-[--text-primary] border border-[--border] px-3 py-1 rounded-md font-mono font-bold shadow-xs">
          {ticket.ticketNumber}
        </span>
      </div>

      {/* Ticket Details Body */}
      <div className="bg-[--bg-surface] rounded-xl border border-[--border] p-6 sm:p-8 space-y-8 shadow-xs">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[--border] pb-6">
          <div>
            <span className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider block mb-1">
              {ticket.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[--text-primary] tracking-tight">{ticket.title}</h1>
            <p className="text-xs text-[--text-secondary] mt-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[--text-muted]" /> {ticket.location.address} ({ticket.location.ward})
            </p>
            <p className="text-xs text-[--text-secondary] font-semibold mt-1">
              Assigned Department: <span className="text-[--text-primary] font-bold">{ticket.departmentName}</span>
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <span className={`status-badge status-${ticket.status}`}>
              {ticket.status === 'resolved' ? (
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" /> Resolved
                </span>
              ) : (
                `Status: ${ticket.status.replace('_', ' ')}`
              )}
            </span>

            {ticket.nextActionDate && (
              <span className="text-[11px] bg-amber-50 text-amber-900 border border-amber-300 font-mono font-bold px-3 py-1 rounded dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
                Next Action: {ticket.nextActionDate}
              </span>
            )}
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider block">Original Reported Photo</span>
            <div className="h-64 bg-[--bg-subtle] rounded-xl overflow-hidden border border-[--border]">
              {ticket.photoUrl ? (
                <img src={ticket.photoUrl} alt="Reported issue" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-[--text-muted]">No photo provided</div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-[--text-secondary] uppercase tracking-wider block">Verified Resolution Photo</span>
            <div className="h-64 bg-[--bg-subtle] rounded-xl overflow-hidden border border-[--border] flex items-center justify-center">
              {ticket.resolutionPhotoUrl ? (
                <img src={ticket.resolutionPhotoUrl} alt="Resolved issue" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6 text-[--text-secondary]">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-[--text-muted] opacity-40" />
                  <p className="text-xs font-semibold">Work In Progress</p>
                  <p className="text-[11px] text-[--text-muted] mt-1">Resolution photo will be uploaded upon work order completion.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4 pt-6 border-t border-[--border]">
          <h3 className="text-xs font-bold text-[--text-primary] uppercase tracking-wider">
            Public Audit Timeline
          </h3>

          <div className="space-y-5 relative pl-4 border-l-2 border-[--border]">
            {ticket.timeline.map((evt: TimelineEvent) => (
              <div key={evt.id} className="relative text-xs space-y-1">
                <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400 ring-4 ring-[--bg-surface]" />
                <div className="flex items-center justify-between text-[--text-muted] text-[11px]">
                  <span className="font-bold text-[--text-primary]">{evt.title}</span>
                  <span suppressHydrationWarning>{formatDateTime(evt.timestamp)}</span>
                </div>
                <p className="text-[--text-secondary] leading-relaxed">{evt.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
