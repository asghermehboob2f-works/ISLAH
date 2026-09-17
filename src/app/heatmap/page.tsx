'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { InteractiveMap } from '@/components/InteractiveMap';
import { IssueDetailModal } from '@/components/IssueDetailModal';
import { CivicIssue } from '@/lib/types';
import { MapPin, ShieldCheck } from 'lucide-react';

export default function HeatmapPage() {
  const { issues } = useApp();
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[--border] pb-5">
        <div>
          <span className="text-xs font-bold text-[--text-muted] uppercase tracking-wider block mb-1">
            Public Transparency Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[--text-primary] flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Live Municipal GIS &amp; Heatmap
          </h1>
          <p className="text-xs sm:text-sm text-[--text-secondary] mt-1 leading-relaxed">
            Real-time public mapping of active civic issues, resolution status, and density heatmaps.
          </p>
        </div>

        <div className="bg-[--bg-surface] text-[--text-primary] text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-2 border border-[--border] shadow-xs shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Live Data Feed Connected</span>
        </div>
      </div>

      {/* Interactive Map Component */}
      <InteractiveMap
        issues={issues}
        onSelectIssue={(iss) => setSelectedIssue(iss)}
        height="h-[650px] lg:h-[750px] xl:h-[800px]"
      />

      {/* Detail Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />

    </div>
  );
}
