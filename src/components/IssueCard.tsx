'use client';

import React from 'react';
import { CivicIssue } from '@/lib/types';
import { MapPin, Clock, ThumbsUp, ArrowRight, ShieldAlert, Check, Sparkles } from 'lucide-react';

interface IssueCardProps {
  issue: CivicIssue;
  onSelect: (issue: CivicIssue) => void;
  onUpvote?: (e: React.MouseEvent, ticketId: string) => void;
}

function SeverityDot({ severity }: { severity: CivicIssue['severity'] }) {
  const map: Record<string, string> = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-amber-400',
    low: 'bg-slate-400',
  };
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${map[severity] ?? 'bg-slate-400'}`} title={`Severity: ${severity}`} />
  );
}

export function IssueCard({ issue, onSelect, onUpvote }: IssueCardProps) {
  const statusLabel: Record<string, string> = {
    reported: 'Reported',
    acknowledged: 'Acknowledged',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    escalated: 'Escalated',
  };

  return (
    <div
      onClick={() => onSelect(issue)}
      className={`bg-[--bg-surface] rounded-xl border transition-all duration-150 hover:border-[--border-subtle] hover:shadow-sm cursor-pointer overflow-hidden flex flex-col group ${issue.emergency ? 'border-red-400/80 dark:border-red-800 emergency-pulse' : 'border-[--border]'
        }`}
    >
      {/* Photo Header */}
      <div className="relative h-44 w-full bg-[--bg-subtle] overflow-hidden">
        {issue.photoUrl ? (
          <img
            src={issue.photoUrl}
            alt={issue.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[--text-muted]">
            <Sparkles className="w-6 h-6 mb-1 opacity-60" />
            <span className="text-[10px] font-medium">Civic Issue Record</span>
          </div>
        )}

        {issue.emergency && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
            <ShieldAlert className="w-3 h-3" />
            Emergency
          </div>
        )}

        <div className="absolute top-3 right-3">
          <span className={`status-badge status-${issue.status} shadow-xs`}>
            {issue.status === 'resolved' ? (
              <><Check className="w-3 h-3" />Resolved</>
            ) : statusLabel[issue.status] || issue.status}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 bg-[--bg-surface] text-[--text-primary] text-[11px] font-semibold px-2.5 py-1 rounded border border-[--border] shadow-xs">
          <span>{issue.category}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-2 flex-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] font-mono font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded tracking-wide">{issue.ticketNumber}</span>
          <SeverityDot severity={issue.severity} />
        </div>

        <h3 className="text-sm font-bold text-[--text-primary] line-clamp-1 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
          {issue.title}
        </h3>
        <p className="text-xs text-[--text-secondary] line-clamp-2 leading-relaxed">
          {issue.description}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-[--text-muted] pt-2 border-t border-[--border]">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{issue.location.address}</span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 py-2.5 bg-[--bg-subtle] border-t border-[--border] flex items-center justify-between text-xs">
        {issue.status === 'resolved' ? (
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
            <Check className="w-3.5 h-3.5" /> Resolved
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[--text-muted] text-[11px] font-medium">
            <Clock className="w-3.5 h-3.5" />
            {issue.slaHoursRemaining}h remaining
          </span>
        )}

        <div className="flex items-center gap-3">
          {onUpvote && (
            <button
              onClick={(e) => { e.stopPropagation(); onUpvote(e, issue.ticketNumber); }}
              className="flex items-center gap-1 text-[--text-muted] hover:text-[--text-primary] transition-colors"
              title="Upvote report"
              aria-label="Upvote report"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">{issue.upvotesCount}</span>
            </button>
          )}
          <span className="text-blue-700 dark:text-blue-400 font-bold text-xs flex items-center gap-0.5 group-hover:gap-1 transition-all">
            Details <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
