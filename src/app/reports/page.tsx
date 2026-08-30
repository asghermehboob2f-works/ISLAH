'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { IssueCard } from '@/components/IssueCard';
import { IssueDetailModal } from '@/components/IssueDetailModal';
import { CivicIssue, IssueCategory, IssueStatus, IssueSeverity } from '@/lib/types';
import { 
  FileText, 
  Search, 
  Filter, 
  MapPin, 
  PlusCircle,
  SlidersHorizontal,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function PublicReportsPage() {
  const { issues, upvoteIssue } = useApp();
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filteredIssues = issues.filter((iss) => {
    if (categoryFilter !== 'all' && iss.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && iss.status !== statusFilter) return false;
    if (severityFilter !== 'all' && iss.severity !== severityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchNumber = iss.ticketNumber.toLowerCase().includes(q);
      const matchTitle = iss.title.toLowerCase().includes(q);
      const matchWard = iss.location.ward.toLowerCase().includes(q);
      const matchAddr = iss.location.address.toLowerCase().includes(q);
      if (!matchNumber && !matchTitle && !matchWard && !matchAddr) return false;
    }
    return true;
  });

  const categories = [
    'Roads & Potholes',
    'Waste & Sanitation',
    'Streetlights & Electrical',
    'Drainage & Sewage',
    'Water Supply',
    'Public Infrastructure',
    'Public Safety & Hazards'
  ];

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase tracking-wider mb-2">
            <FileText className="w-3.5 h-3.5" />
            Public Transparency Feed
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Public Civic Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            Browse verified municipal reports submitted by citizens across all wards. All citizen personal contact data is strictly protected.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/report"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report a Civic Issue</span>
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Search */}
          <div>
            <label className="font-bold text-slate-600 block mb-1">Search Keywords</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search ticket ID, title, or ward..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-slate-300 rounded-xl pl-8 pr-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="font-bold text-slate-600 block mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white font-semibold text-slate-800"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="font-bold text-slate-600 block mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white font-semibold text-slate-800"
            >
              <option value="all">All Statuses</option>
              <option value="reported">Reported</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected / Invalid</option>
              <option value="escalated">Escalated</option>
            </select>
          </div>

          {/* Severity */}
          <div>
            <label className="font-bold text-slate-600 block mb-1">Severity</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white font-semibold text-slate-800"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical / Emergency</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

        </div>
      </div>

      {/* Grid of Public Issue Cards */}
      {filteredIssues.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No reports found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No public civic reports match your selected search criteria or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onSelect={(iss) => setSelectedIssue(iss)}
              onUpvote={(e, id) => upvoteIssue(id)}
            />
          ))}
        </div>
      )}

      {/* Issue Detail Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />

    </div>
  );
}
