'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { InteractiveMap } from '@/components/InteractiveMap';
import { IssueCard } from '@/components/IssueCard';
import { IssueDetailModal } from '@/components/IssueDetailModal';
import { CivicIssue } from '@/lib/types';
import { MapPin, ListFilter, Map as MapIcon, RefreshCw, ShieldAlert, Globe } from 'lucide-react';

export default function LiveMapPage() {
  const { issues, upvoteIssue, refreshData } = useApp();
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);
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

  const filteredIssues = publicIssues.filter((iss) => {
    if (categoryFilter !== 'all' && iss.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && iss.status !== statusFilter) return false;
    return true;
  });

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 space-y-4 font-sans">
      
      {/* Title & Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Public Live Civic Issue Map
            <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 font-bold flex items-center gap-1">
              <Globe className="w-3 h-3" /> Realtime GPS Pinpoints
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Database-driven geospatial tracking for public municipal reports ({publicIssues.length} active public reports)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 font-semibold text-slate-800"
          >
            <option value="all">All Categories</option>
            <option value="Roads & Potholes">Roads & Potholes</option>
            <option value="Waste & Sanitation">Garbage & Sanitation</option>
            <option value="Streetlights & Power">Streetlights & Power</option>
            <option value="Water Supply & Leaks">Water Supply & Leaks</option>
            <option value="Drainage & Sewage">Drainage & Sewage</option>
            <option value="Public Infrastructure">Public Infrastructure</option>
            <option value="Emergency">Emergency</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 font-semibold text-slate-800"
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
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 font-semibold text-slate-800 flex items-center gap-1 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span>Sync DB</span>
          </button>

          <div className="bg-slate-100 p-0.5 rounded-lg border border-slate-200 flex items-center">
            <button
              onClick={() => setViewMode('map')}
              className={`px-2.5 py-1 rounded-md font-bold text-[11px] flex items-center gap-1 ${
                viewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" /> Full Map
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-md font-bold text-[11px] flex items-center gap-1 ${
                viewMode === 'split' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" /> Map + List
            </button>
          </div>
        </div>
      </div>

      {/* Map & List Grid */}
      <div className={`grid grid-cols-1 ${viewMode === 'split' ? 'lg:grid-cols-12 gap-4' : ''}`}>
        <div className={`${viewMode === 'split' ? 'lg:col-span-8' : 'w-full'} h-[650px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative`}>
          <InteractiveMap
            issues={filteredIssues}
            onSelectIssue={(iss) => setSelectedIssue(iss)}
            onRefreshData={refreshData}
          />
        </div>

        {viewMode === 'split' && (
          <div className="lg:col-span-4 space-y-3 h-[650px] overflow-y-auto pr-1">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Public Location Pins ({filteredIssues.length})
            </h3>
            {filteredIssues.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No public reports match the selected filters.
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

      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />

    </div>
  );
}
