'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { InteractiveMap } from '@/components/InteractiveMap';
import { IssueDetailModal } from '@/components/IssueDetailModal';
import { CivicIssue } from '@/lib/types';
import { MapPin, Flame, Filter, Eye, ShieldCheck } from 'lucide-react';

export default function HeatmapPage() {
  const { issues } = useApp();
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-10 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
            Public Transparency Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-7 h-7 text-blue-600" />
            Live Municipal GIS & Heatmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Real-time public mapping of active civic issues, resolution status, and density heatmaps.
          </p>
        </div>

        <div className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Live Data Feed Connected</span>
        </div>
      </div>

      {/* Interactive Map Component */}
      <InteractiveMap
        issues={issues}
        onSelectIssue={(iss) => setSelectedIssue(iss)}
        height="h-[650px] lg:h-[750px] xl:h-[820px]"
      />

      {/* Detail Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />

    </div>
  );
}
