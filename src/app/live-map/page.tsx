'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { InteractiveMap } from '@/components/InteractiveMap';
import { IssueCard } from '@/components/IssueCard';
import { IssueDetailModal } from '@/components/IssueDetailModal';
import { CivicIssue } from '@/lib/types';
import {
  Building2,
  Trees,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
  Map as MapIcon,
  ListFilter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Activity
} from 'lucide-react';

export default function LiveMapPage() {
  const { issues, upvoteIssue, refreshData } = useApp();

  // Mode: 'civic' or 'environmental'
  const [mapDomain, setMapDomain] = useState<'civic' | 'environmental'>('civic');

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Layout view mode: 'map' (full map) or 'split' (map + sidebar list)
  const [viewMode, setViewMode] = useState<'map' | 'split'>('map');

  // Modal inspection
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);

  // 1. Filter by Domain
  const domainIssues = issues.filter((iss) => {
    if (mapDomain === 'civic') {
      return iss.category !== 'Environment & Wildlife';
    } else {
      return iss.category === 'Environment & Wildlife';
    }
  });

  // 2. Apply sub-filters
  const filteredIssues = domainIssues.filter((iss) => {
    if (mapDomain === 'civic') {
      if (categoryFilter !== 'all' && iss.category !== categoryFilter) return false;
    } else {
      if (categoryFilter !== 'all' && iss.subcategory !== categoryFilter) return false;
    }
    if (statusFilter !== 'all' && iss.status !== statusFilter) return false;
    return true;
  });

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Quick statistics for current map view
  const activeCount = filteredIssues.filter(i => i.status !== 'resolved').length;
  const resolvedCount = filteredIssues.filter(i => i.status === 'resolved').length;
  const emergencyCount = filteredIssues.filter(i => i.emergency || i.severity === 'critical' || i.severity === 'high').length;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 space-y-4 font-sans">

      {/* Unified Classic Control Tile */}
      <div className="bg-[--bg-surface] rounded-xl border border-[--border] p-3.5 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-3">

        {/* Left Side: Header & Map Mode Switcher Pills */}
        <div className="flex flex-wrap items-center gap-3">

          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shadow-xs shrink-0 transition-colors ${mapDomain === 'civic' ? 'bg-blue-700 text-white dark:bg-blue-600' : 'bg-emerald-600 text-white'
              }`}>
              {mapDomain === 'civic' ? <Building2 className="w-4 h-4" /> : <Trees className="w-4 h-4" />}
            </div>
            <div>
              <h1 className="text-sm font-bold text-[--text-primary] flex items-center gap-2 tracking-tight">
                {mapDomain === 'civic' ? 'Public Live Civic Issue Map' : 'Public Ecological & Wildlife Map'}
                <span className="text-[10px] font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900 font-bold">
                  {domainIssues.length} Pins
                </span>
              </h1>
            </div>
          </div>

          {/* Integrated Map Switcher Pill Control */}
          <div className="bg-[--bg-subtle] p-1 rounded-lg border border-[--border] flex items-center gap-1 shrink-0">
            <button
              onClick={() => { setMapDomain('civic'); setCategoryFilter('all'); }}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${mapDomain === 'civic'
                  ? 'bg-blue-700 text-white dark:bg-blue-600 shadow-xs'
                  : 'text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-surface]'
                }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Civic Map</span>
            </button>

            <button
              onClick={() => { setMapDomain('environmental'); setCategoryFilter('all'); }}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${mapDomain === 'environmental'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-surface]'
                }`}
            >
              <Trees className="w-3.5 h-3.5" />
              <span>Environmental Map</span>
            </button>
          </div>

        </div>

        {/* Right Side: Filters, Sync DB & View Mode Switcher */}
        <div className="flex items-center gap-2 flex-wrap text-xs shrink-0">
          {mapDomain === 'civic' ? (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-[--border] rounded-lg px-2.5 py-1.5 bg-[--bg-subtle] font-semibold text-[--text-primary] text-xs focus:outline-none focus:ring-1 focus:ring-[--ring]"
            >
              <option value="all">All Civic Categories</option>
              <option value="Roads & Potholes">Roads & Potholes</option>
              <option value="Garbage & Sanitation">Garbage & Sanitation</option>
              <option value="Streetlights & Electrical">Streetlights & Electrical</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Drainage & Sewage">Drainage & Sewage</option>
              <option value="Public Infrastructure">Public Infrastructure</option>
              <option value="Other">Other Civic</option>
            </select>
          ) : (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-[--border] rounded-lg px-2.5 py-1.5 bg-[--bg-subtle] font-semibold text-[--text-primary] text-xs focus:outline-none focus:ring-1 focus:ring-[--ring]"
            >
              <option value="all">All Environmental Subcategories</option>
              <option value="Wildlife Protection">Wildlife Protection</option>
              <option value="Forest & Land Protection">Forest & Land Protection</option>
              <option value="Water & Ecosystem Protection">Water & Ecosystem Protection</option>
              <option value="Environmental Pollution">Environmental Pollution</option>
              <option value="Environmental Emergencies">Environmental Emergencies</option>
              <option value="Other Environmental Issue">Other Environmental Issue</option>
            </select>
          )}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-[--border] rounded-lg px-2.5 py-1.5 bg-[--bg-subtle] font-semibold text-[--text-primary] text-xs focus:outline-none focus:ring-1 focus:ring-[--ring]"
          >
            <option value="all">All Statuses</option>
            <option value="reported">Reported</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <button
            type="button"
            onClick={handleManualRefresh}
            className="border border-[--border] rounded-lg px-2.5 py-1.5 bg-[--bg-subtle] hover:bg-[--bg-surface] font-semibold text-[--text-primary] flex items-center gap-1 transition-all active:scale-95 text-xs shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span>Sync DB</span>
          </button>

          <div className="bg-[--bg-subtle] p-0.5 rounded-lg border border-[--border] flex items-center ml-1">
            <button
              onClick={() => setViewMode('map')}
              className={`px-2.5 py-1 rounded-md font-bold text-[11px] flex items-center gap-1 transition-all ${viewMode === 'map' ? 'bg-[--bg-surface] text-[--text-primary] shadow-xs' : 'text-[--text-secondary] hover:text-[--text-primary]'
                }`}
            >
              <MapIcon className="w-3.5 h-3.5" /> Full Map
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-md font-bold text-[11px] flex items-center gap-1 transition-all ${viewMode === 'split' ? 'bg-[--bg-surface] text-[--text-primary] shadow-xs' : 'text-[--text-secondary] hover:text-[--text-primary]'
                }`}
            >
              <ListFilter className="w-3.5 h-3.5" /> Map + List
            </button>
          </div>
        </div>

      </div>

      {/* Sensitive Wildlife Notice Bar */}
      {mapDomain === 'environmental' && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-3 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>Wildlife Privacy Shield Active:</strong> Sensitive wildlife habitat GPS coordinates are obfuscated on public maps (~500m area offset) to protect wildlife.
            </span>
          </div>
          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 px-2 py-0.5 rounded font-mono uppercase font-bold shrink-0">
            Masking On
          </span>
        </div>
      )}

      {/* Map & List Grid */}
      <div className={`grid grid-cols-1 ${viewMode === 'split' ? 'lg:grid-cols-12 gap-4' : ''}`}>

        {/* Map Container */}
        <div className={`${viewMode === 'split' ? 'lg:col-span-8' : 'w-full'} h-[650px] rounded-xl overflow-hidden border border-[--border] shadow-xs relative bg-[--bg-surface]`}>
          <InteractiveMap
            issues={filteredIssues}
            onSelectIssue={(iss) => setSelectedIssue(iss)}
            onRefreshData={refreshData}
            height="h-full"
          />
        </div>

        {/* Sidebar for Split Mode */}
        {viewMode === 'split' && (
          <div className="lg:col-span-4 space-y-3 h-[650px] overflow-y-auto pr-1">
            <div className="flex items-center justify-between bg-[--bg-surface] p-3 rounded-xl border border-[--border] shadow-xs sticky top-0 z-10">
              <h3 className="text-xs font-bold text-[--text-primary] uppercase tracking-wider flex items-center gap-2">
                {mapDomain === 'civic' ? <Building2 className="w-4 h-4 text-blue-600" /> : <Trees className="w-4 h-4 text-emerald-600" />}
                {mapDomain === 'civic' ? 'Civic Map Pins' : 'Environmental Pins'} ({filteredIssues.length})
              </h3>
            </div>

            {filteredIssues.length === 0 ? (
              <div className="p-8 text-center bg-[--bg-surface] rounded-xl border border-[--border] text-[--text-muted] text-xs">
                No public reports match current filter criteria.
              </div>
            ) : (
              filteredIssues.map((iss) => (
                <IssueCard
                  key={iss.id}
                  issue={iss}
                  onSelect={(selected) => setSelectedIssue(selected)}
                  onUpvote={(e, id) => upvoteIssue(id)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Summary Telemetry Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-[--bg-surface] rounded-xl p-4 border border-[--border] shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 flex items-center justify-center shrink-0 font-bold">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-bold font-mono text-[--text-primary]">{filteredIssues.length}</div>
            <div className="text-[11px] text-[--text-secondary] font-semibold">Visible Map Pins</div>
          </div>
        </div>

        <div className="bg-[--bg-surface] rounded-xl p-4 border border-[--border] shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900 flex items-center justify-center shrink-0 font-bold">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-bold font-mono text-[--text-primary]">{activeCount}</div>
            <div className="text-[11px] text-[--text-secondary] font-semibold">Active SLA Tickets</div>
          </div>
        </div>

        <div className="bg-[--bg-surface] rounded-xl p-4 border border-[--border] shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 flex items-center justify-center shrink-0 font-bold">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-bold font-mono text-[--text-primary]">{emergencyCount}</div>
            <div className="text-[11px] text-[--text-secondary] font-semibold">Priority Hazards</div>
          </div>
        </div>

        <div className="bg-[--bg-surface] rounded-xl p-4 border border-[--border] shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 flex items-center justify-center shrink-0 font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-bold font-mono text-[--text-primary]">{resolvedCount}</div>
            <div className="text-[11px] text-[--text-secondary] font-semibold">Verified Solved</div>
          </div>
        </div>
      </div>

      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />

    </div>
  );
}
