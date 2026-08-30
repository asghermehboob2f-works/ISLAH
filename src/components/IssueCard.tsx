'use client';

import React from 'react';
import Image from 'next/image';
import { CivicIssue } from '@/lib/types';
import { 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ThumbsUp, 
  ArrowRight,
  ShieldAlert,
  Check,
  Sparkles,
  X
} from 'lucide-react';

interface IssueCardProps {
  issue: CivicIssue;
  onSelect: (issue: CivicIssue) => void;
  onUpvote?: (e: React.MouseEvent, ticketId: string) => void;
}

export function IssueCard({ issue, onSelect, onUpvote }: IssueCardProps) {
  const getStatusBadge = (status: CivicIssue['status']) => {
    switch (status) {
      case 'reported':
        return <span className="status-badge status-reported">Reported</span>;
      case 'acknowledged':
        return <span className="status-badge status-acknowledged">Acknowledged</span>;
      case 'in_progress':
        return <span className="status-badge status-in_progress">In Progress</span>;
      case 'resolved':
        return (
          <span className="bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-full text-[11px] inline-flex items-center gap-1.5 shadow-xs border border-emerald-700 uppercase tracking-wider">
            <span className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center text-emerald-700 shrink-0">
              <Check className="w-2.5 h-2.5 text-emerald-700 stroke-[3]" />
            </span>
            Resolved
          </span>
        );
      case 'rejected':
        return (
          <span className="bg-red-600 text-white font-bold px-2.5 py-1 rounded-full text-[11px] inline-flex items-center gap-1.5 shadow-xs border border-red-700 uppercase tracking-wider">
            <span className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center text-red-600 shrink-0">
              <X className="w-2.5 h-2.5 text-red-600 stroke-[3]" />
            </span>
            Rejected / Invalid
          </span>
        );
      case 'escalated':
        return <span className="status-badge status-escalated">Escalated</span>;
    }
  };

  const getSeverityBadge = (severity: CivicIssue['severity']) => {
    switch (severity) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase tracking-wider">Critical</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-100 text-orange-800 border border-orange-200">High Severity</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">Medium</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">Low</span>;
    }
  };

  return (
    <div 
      onClick={() => onSelect(issue)}
      className={`bg-white dark:bg-slate-900 rounded-xl border transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer overflow-hidden flex flex-col justify-between ${
        issue.emergency ? 'border-red-300 dark:border-red-800/80 shadow-red-100/50 dark:shadow-red-950/30 emergency-pulse' : 'border-slate-200 dark:border-slate-800 shadow-sm'
      }`}
    >
      <div>
        {/* Card Header & Photo */}
        <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
          {issue.photoUrl ? (
            <img
              src={issue.photoUrl}
              alt={issue.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-600">
              <Sparkles className="w-8 h-8 mb-1 text-slate-300 dark:text-slate-700" />
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">Civic Issue Ticket</span>
            </div>
          )}

          {/* Emergency Tag */}
          {issue.emergency && (
            <div className="absolute top-3 left-3 bg-red-600 text-white px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-lg">
              <ShieldAlert className="w-3.5 h-3.5" />
              Emergency Hazard
            </div>
          )}

          {/* Status Overlay */}
          <div className="absolute top-3 right-3 shadow-md">
            {getStatusBadge(issue.status)}
          </div>

          {/* AI Category Tag Overlay */}
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-slate-100 text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-slate-700">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>{issue.category}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">
              {issue.ticketNumber}
            </span>
            {getSeverityBadge(issue.severity)}
          </div>

          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {issue.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {issue.description}
          </p>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
            <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="truncate">{issue.location.address}</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        {issue.status === 'resolved' ? (
          <div className="flex items-center gap-1.5 bg-emerald-600 text-white px-2.5 py-1 rounded-full font-bold text-[11px] shadow-xs border border-emerald-700">
            <span className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center text-emerald-700 shrink-0">
              <Check className="w-2.5 h-2.5 text-emerald-700 stroke-[3]" />
            </span>
            <span>Resolved</span>
          </div>
        ) : issue.status === 'rejected' ? (
          <div className="flex items-center gap-1.5 bg-red-600 text-white px-2.5 py-1 rounded-full font-bold text-[11px] shadow-xs border border-red-700">
            <span className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center text-red-600 shrink-0">
              <X className="w-2.5 h-2.5 text-red-600 stroke-[3]" />
            </span>
            <span>Rejected / Invalid</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>{issue.slaHoursRemaining}h SLA remaining</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          {onUpvote && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpvote(e, issue.ticketNumber);
              }}
              className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold px-2 py-1 rounded hover:bg-white dark:hover:bg-slate-800 transition-colors"
              title="Upvote/confirm this issue"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-blue-500" />
              <span>{issue.upvotesCount}</span>
            </button>
          )}

          <span className="text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
            Details <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
