'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { InteractiveMap } from '@/components/InteractiveMap';
import { IssueCard } from '@/components/IssueCard';
import { IssueDetailModal } from '@/components/IssueDetailModal';
import { CivicIssue } from '@/lib/types';
import { 
  Building2, 
  Trees, 
  MapPin, 
  ListFilter, 
  Map as MapIcon, 
  RefreshCw, 
  ShieldCheck, 
  Globe,
  Leaf,
  EyeOff,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';

export default function LiveMapPage() {
  const { issues, upvoteIssue, refreshData } = useApp();
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);
  
  // Dual Map Domain State: civic | environmental
  const [mapDomain, setMapDomain] = useState<'civic' | 'environmental'>('civic');
  const [viewMode, setViewMode] = useState<'map' | 'split'>('map');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Periodic Revalidation Polling to keep Live Map synced with SQLite DB (Every 10s)
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Filter public reports
  const publicIssues = issues.filter((iss) => iss.visibility === 'PUBLIC' || !iss.visibility);

  // Domain Filtered Issues
  const domainIssues = publicIssues.filter((iss) => {
    if (mapDomain === 'civic') {
      return iss.category !== 'Environment & Wildlife';
    } else {
      return iss.category === 'Environment & Wildlife';
    }
  });

  const filteredIssues = domainIssues.filter((iss) => {
    if (categoryFilter !== 'all') {
      if (mapDomain === 'environmental') {
        if (iss.subcategory !== categoryFilter && iss.category !== categoryFilter) return false;
      } else {
        if (iss.category !== categoryFilter) return false;
      }
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
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 space-y-3 font-sans">
      
      {/* Single Ultra-Slim Unified Classic White Control Tile */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        
        {/* Left Side: Header & Map Mode Switcher Pills */}
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold shadow-xs shrink-0 transition-colors ${
              mapDomain === 'civic' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              {mapDomain === 'civic' ? <Building2 className="w-4 h-4" /> : <Trees className="w-4 h-4" />}
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 flex items-center gap-2 tracking-tight">
                {mapDomain === 'civic' ? 'Public Live Civic Issue Map' : 'Public Ecological & Wildlife Map'}
                <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 font-bold">
                  {domainIssues.length} Pins
                </span>
              </h1>
            </div>
          </div>

          {/* Integrated Map Switcher Pill Control */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200/80 flex items-center gap-1 shrink-0">
            <button
              onClick={() => { setMapDomain('civic'); setCategoryFilter('all'); }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mapDomain === 'civic'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Civic Map</span>
            </button>

            <button
              onClick={() => { setMapDomain('environmental'); setCategoryFilter('all'); }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mapDomain === 'environmental'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Trees className="w-3.5 h-3.5 text-emerald-400" />
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
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 font-semibold text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 font-semibold text-emerald-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
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
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 font-semibold text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 font-semibold text-slate-800 flex items-center gap-1 transition-all active:scale-95 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span>Sync DB</span>
          </button>

          <div className="bg-slate-100 p-0.5 rounded-lg border border-slate-200 flex items-center ml-1">
            <button
              onClick={() => setViewMode('map')}
              className={`px-2.5 py-1 rounded-md font-bold text-[11px] flex items-center gap-1 transition-all ${
                viewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" /> Full Map
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-md font-bold text-[11px] flex items-center gap-1 transition-all ${
                viewMode === 'split' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" /> Map + List
            </button>
          </div>
        </div>

      </div>

      {/* Sensitive Wildlife Notice Bar (Light Theme) */}
      {mapDomain === 'environmental' && (
        <div className="bg-emerald-50 border border-emerald-200 p-2.5 sm:p-3 rounded-xl text-xs text-emerald-900 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Wildlife Privacy Shield Active:</strong> Sensitive wildlife habitat GPS coordinates are obfuscated on public maps (~500m area offset) to protect wildlife.
            </span>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-mono uppercase font-bold shrink-0">
            Masking On
          </span>
        </div>
      )}

      {/* Map & List Grid */}
      <div className={`grid grid-cols-1 ${viewMode === 'split' ? 'lg:grid-cols-12 gap-4' : ''}`}>
        
        {/* Map Container */}
        <div className={`${viewMode === 'split' ? 'lg:col-span-8' : 'w-full'} h-[650px] rounded-2xl overflow-hidden border border-slate-200 shadow-xs relative bg-slate-100`}>
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
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs sticky top-0 z-10">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                {mapDomain === 'civic' ? <Building2 className="w-4 h-4 text-blue-600" /> : <Trees className="w-4 h-4 text-emerald-600" />}
                {mapDomain === 'civic' ? 'Civic Map Pins' : 'Environmental Pins'} ({filteredIssues.length})
              </h3>
            </div>

            {filteredIssues.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold font-mono text-slate-900">{filteredIssues.length}</div>
            <div className="text-[11px] text-slate-500 font-medium">Visible Map Pins</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold font-mono text-slate-900">{activeCount}</div>
            <div className="text-[11px] text-slate-500 font-medium">Active SLA Tickets</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 font-bold">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold font-mono text-slate-900">{emergencyCount}</div>
            <div className="text-[11px] text-slate-500 font-medium">Priority Hazards</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold font-mono text-slate-900">{resolvedCount}</div>
            <div className="text-[11px] text-slate-500 font-medium">Verified Solved</div>
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
