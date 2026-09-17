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
    high: 'bg-orange-400',
    medium: 'bg-yellow-400',
    low: 'bg-zinc-400',
  };
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${map[severity] ?? 'bg-zinc-400'}`} title={severity} />
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
      className={`bg-[--bg-surface] rounded-2xl border transition-all duration-150 hover:border-[--border-subtle] cursor-pointer overflow-hidden flex flex-col group ${issue.emergency ? 'border-red-400/60 emergency-pulse' : 'border-[--border]'
        }`}
    >
      {/* Photo */}
      <div className="relative h-44 w-full bg-[--bg-subtle] overflow-hidden">
        {issue.photoUrl ? (
          <img
            src={issue.photoUrl}
            alt={issue.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Sparkles className="w-7 h-7 mb-1 text-[--text-muted]" />
            <span className="text-[10px] font-medium text-[--text-muted]">Civic Issue Ticket</span>
          </div>
        )}

        {issue.emergency && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            Emergency
          </div>
        )}

        <div className="absolute top-3 right-3">
          <span className={`status-badge status-${issue.status}`}>
            {issue.status === 'resolved' ? (
              <><Check className="w-3 h-3" />Resolved</>
            ) : statusLabel[issue.status]}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 bg-[--bg-surface] text-[--text-secondary] text-[11px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-[--border] shadow-xs">
          <span>{issue.category}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-2.5 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-[--text-muted]">{issue.ticketNumber}</span>
          <SeverityDot severity={issue.severity} />
        </div>

        <h3 className="text-sm font-semibold text-[--text-primary] line-clamp-1">{issue.title}</h3>
        <p className="text-xs text-[--text-secondary] line-clamp-2 leading-relaxed">{issue.description}</p>

        <div className="flex items-center gap-1.5 text-xs text-[--text-muted] pt-2 border-t border-[--border]">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{issue.location.address}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-[--bg-subtle] border-t border-[--border] flex items-center justify-between text-xs">
        {issue.status === 'resolved' ? (
          <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Resolved
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[--text-muted]">
            <Clock className="w-3.5 h-3.5" />
            {issue.slaHoursRemaining}h remaining
          </span>
        )}

        <div className="flex items-center gap-2.5">
          {onUpvote && (
            <button
              onClick={(e) => { e.stopPropagation(); onUpvote(e, issue.ticketNumber); }}
              className="flex items-center gap-1 text-[--text-muted] hover:text-[--text-primary] transition-colors"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{issue.upvotesCount}</span>
            </button>
          )}
          <span className="text-[--text-primary] font-medium flex items-center gap-0.5 group-hover:gap-1 transition-all">
            Details <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
