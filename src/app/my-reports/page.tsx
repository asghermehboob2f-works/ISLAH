'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { IssueCard } from '@/components/IssueCard';
import { IssueDetailModal } from '@/components/IssueDetailModal';
import { InteractiveMap } from '@/components/InteractiveMap';
import { CivicIssue, UserBadge } from '@/lib/types';
import { 
  Award, 
  PlusCircle, 
  Map, 
  List, 
  FileText, 
  User,
  LogIn
} from 'lucide-react';

export default function MyReportsPage() {
  const { user, activeRole, issues, upvoteIssue } = useApp();
  
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);

  // If user is guest/unauthenticated
  if (!user || activeRole !== 'citizen') {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16 text-center space-y-6 font-sans">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200">
          <User className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">My Reports</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Please log in or create a citizen account to view your personal reported issues and progress timeline.
          </p>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <Link
            href="/login?returnUrl=/my-reports"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-md text-xs flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Login to View My Reports</span>
          </Link>
          <Link
            href="/signup"
            className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold py-3 rounded-xl border border-slate-300 text-xs"
          >
            Create Citizen Account
          </Link>
        </div>
      </div>
    );
  }

  // Filter issues submitted by this user
  const mySubmittedIssues = issues.filter((i) => i.citizenId === user.id || i.citizenName === user.name);

  const filteredIssues = mySubmittedIssues.filter((i) => {
    if (statusFilter !== 'all' && i.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 space-y-8 font-sans">
      
      {/* Profile Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 border border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-lg text-white shadow-lg">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                {user.name}'s Submissions
                <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded font-mono">
                  {user.ward}
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-semibold">{user.rankTitle}</p>
            </div>
          </div>

          {user.badges && user.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {user.badges.map((bdg: UserBadge) => (
                <span
                  key={bdg.id}
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  {bdg.title}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 grid grid-cols-3 gap-3 bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-center">
          <div>
            <div className="text-2xl font-bold font-mono text-blue-400">{user.civicScore}</div>
            <div className="text-[11px] text-slate-400 font-medium">Civic Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">{mySubmittedIssues.length}</div>
            <div className="text-[11px] text-slate-400 font-medium">Submitted</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {mySubmittedIssues.filter((i) => i.status === 'resolved').length}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Resolved</div>
          </div>
        </div>

      </div>

      {/* Reports Dashboard Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'reported', 'in_progress', 'resolved', 'escalated'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all shrink-0 ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {st === 'all' ? `All Reports (${mySubmittedIssues.length})` : st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 ${
                viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-4 h-4" /> List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 ${
                viewMode === 'map' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-4 h-4" /> Map View
            </button>
          </div>

          <Link
            href="/report"
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Report</span>
          </Link>
        </div>

      </div>

      {/* Main Content Area */}
      {viewMode === 'map' ? (
        <InteractiveMap
          issues={filteredIssues}
          onSelectIssue={(iss) => setSelectedIssue(iss)}
          height="h-[600px] lg:h-[700px] xl:h-[780px]"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredIssues.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No reports yet</h3>
              <p className="text-xs text-slate-500">Click "New Report" to submit your first civic issue.</p>
              <Link
                href="/report"
                className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs"
              >
                <PlusCircle className="w-4 h-4" /> Report Issue
              </Link>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onSelect={(iss) => setSelectedIssue(iss)}
                onUpvote={(e, id) => upvoteIssue(id)}
              />
            ))
          )}
        </div>
      )}

      {/* Detail Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />

    </div>
  );
}
