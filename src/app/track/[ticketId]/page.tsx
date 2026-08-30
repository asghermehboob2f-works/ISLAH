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
  Sparkles,
  Check,
  XCircle
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
    <div className="w-full max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 space-y-8 font-sans">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link href="/my-reports" className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <span className="text-xs bg-slate-900 text-white px-3 py-1 rounded-full font-mono font-bold">
          {ticket.ticketNumber}
        </span>
      </div>

      {/* Ticket Details Body */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
              {ticket.category}
            </span>
            <h1 className="text-2xl font-bold text-slate-900">{ticket.title}</h1>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {ticket.location.address} ({ticket.location.ward})
            </p>
            <p className="text-xs text-slate-600 font-semibold mt-1">
              Assigned Department: <span className="text-purple-700 font-bold">{ticket.departmentName}</span>
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            {ticket.status === 'resolved' ? (
              <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-xs border border-emerald-700">
                <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-emerald-700 shrink-0">
                  <Check className="w-2.5 h-2.5 text-emerald-700 stroke-[3.5]" />
                </span>
                Resolved
              </span>
            ) : ticket.status === 'rejected' ? (
              <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-xs border border-red-700">
                <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-red-600 shrink-0">
                  <XCircle className="w-2.5 h-2.5 text-red-600 stroke-[3.5]" />
                </span>
                Rejected / Invalid
              </span>
            ) : (
              <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                ticket.status === 'in_progress' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-blue-100 text-blue-800 border border-blue-300'
              }`}>
                Status: {ticket.status.replace('_', ' ')}
              </span>
            )}

            {ticket.nextActionDate && (
              <span className="text-[11px] bg-amber-50 text-amber-900 border border-amber-300 font-mono font-bold px-3 py-1 rounded-lg">
                Next Action: {ticket.nextActionDate}
              </span>
            )}
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-700">Original Reported Photo</span>
            <div className="h-56 bg-slate-100 rounded-xl overflow-hidden border">
              <img src={ticket.photoUrl} alt="Reported issue" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-700">Verified Resolution Photo</span>
            <div className="h-56 bg-slate-100 rounded-xl overflow-hidden border flex items-center justify-center">
              {ticket.resolutionPhotoUrl ? (
                <img src={ticket.resolutionPhotoUrl} alt="Resolved issue" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6 text-slate-400">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs">Work In Progress</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Public Audit Timeline
          </h3>

          <div className="space-y-4 relative pl-4 border-l-2 border-slate-200">
            {ticket.timeline.map((evt: TimelineEvent) => (
              <div key={evt.id} className="relative text-xs space-y-0.5">
                <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-bold text-slate-900">{evt.title}</span>
                  <span suppressHydrationWarning>{formatDateTime(evt.timestamp)}</span>
                </div>
                <p className="text-slate-600">{evt.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
