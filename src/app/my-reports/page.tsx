'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { IssueCard } from '@/components/IssueCard';
import { IssueDetailModal } from '@/components/IssueDetailModal';
import { InteractiveMap } from '@/components/InteractiveMap';
import { CivicIssue, UserBadge } from '@/lib/types';
import {
  FileText,
  User,
  PlusCircle,
  Building2,
  Trees,
  Award,
  List,
  Map,
  LogIn
} from 'lucide-react';

export default function MyReportsPage() {
  const { user, activeRole, issues, upvoteIssue } = useApp();

  // Mode: 'civic' vs 'environmental'
  const [activeTrack, setActiveTrack] = useState<'civic' | 'environmental'>('civic');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);

  // If user is guest/unauthenticated
  if (!user || activeRole !== 'citizen') {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-20 text-center space-y-6 font-sans">
        <div className="flex items-center justify-center mx-auto">
          <Image
            src="/logo.png?v=4"
            alt="Islah Logo"
            width={64}
            height={64}
            className="h-14 w-auto object-contain"
            unoptimized
          />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-[--text-primary]">My Reports</h2>
          <p className="text-xs text-[--text-secondary] leading-relaxed">
            Please log in or create a citizen account to view your personal reported issues and progress timeline.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto pt-2">
          <Link
            href="/login?returnUrl=/my-reports"
            className="flex-1 bg-blue-700 hover:bg-blue-800 text-white dark:bg-blue-600 font-bold py-3 px-4 rounded-lg shadow-xs text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Login to View My Reports</span>
          </Link>
          <Link
            href="/signup"
            className="flex-1 bg-[--bg-surface] hover:bg-[--bg-subtle] text-[--text-primary] font-semibold py-3 px-4 rounded-lg border border-[--border] text-xs transition-colors"
          >
            Create Citizen Account
          </Link>
        </div>
      </div>
    );
  }

  // Filter issues submitted by this user
  const mySubmittedIssues = issues.filter((i) => i.citizenId === user.id || i.citizenName === user.name);

  const civicReports = mySubmittedIssues.filter(i => i.category !== 'Environment & Wildlife');
  const environmentalReports = mySubmittedIssues.filter(i => i.category === 'Environment & Wildlife');

  const currentTrackReports = activeTrack === 'civic' ? civicReports : environmentalReports;

  const filteredIssues = currentTrackReports.filter((i) => {
    if (statusFilter !== 'all' && i.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 space-y-8 font-sans">

      {/* Profile Header */}
      <div className="bg-[--bg-surface] text-[--text-primary] rounded-xl p-6 sm:p-8 border border-[--border] shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-700 text-white dark:bg-blue-600 flex items-center justify-center font-bold text-lg shadow-xs">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[--text-primary] flex items-center gap-2">
                {user.name}'s Submissions Portal
                <span className="text-xs bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded font-mono font-bold">
                  {user.ward}
                </span>
              </h1>
              <p className="text-xs text-[--text-secondary] font-semibold">{user.rankTitle}</p>
            </div>
          </div>

          {user.badges && user.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {user.badges.map((bdg: UserBadge) => (
                <span
                  key={bdg.id}
                  className="bg-[--bg-subtle] border border-[--border] text-[--text-primary] text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  {bdg.title}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 grid grid-cols-3 gap-3 bg-[--bg-subtle] p-4 rounded-xl border border-[--border] text-center">
          <div>
            <div className="text-2xl font-bold font-mono text-blue-700 dark:text-blue-400">{civicReports.length}</div>
            <div className="text-[11px] text-[--text-secondary] font-medium">Civic Reports</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{environmentalReports.length}</div>
            <div className="text-[11px] text-[--text-secondary] font-medium">Environmental</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {mySubmittedIssues.filter((i) => i.status === 'resolved').length}
            </div>
            <div className="text-[11px] text-[--text-secondary] font-medium">Resolved</div>
          </div>
        </div>

      </div>

      {/* Domain Track Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[--bg-surface] p-4 rounded-xl border border-[--border] shadow-xs">

        <div className="flex items-center gap-2 bg-[--bg-subtle] p-1 rounded-lg border border-[--border] w-full sm:w-auto">
          <button
            onClick={() => setActiveTrack('civic')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTrack === 'civic'
              ? 'bg-blue-700 text-white dark:bg-blue-600 shadow-xs'
              : 'text-[--text-secondary] hover:text-[--text-primary]'
              }`}
          >
            <Building2 className="w-4 h-4" />
            <span>My Civic Reports ({civicReports.length})</span>
          </button>

          <button
            onClick={() => setActiveTrack('environmental')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTrack === 'environmental'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-[--text-secondary] hover:text-[--text-primary]'
              }`}
          >
            <Trees className="w-4 h-4" />
            <span>My Environmental Reports ({environmentalReports.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center bg-[--bg-subtle] p-0.5 rounded-lg border border-[--border]">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${viewMode === 'list' ? 'bg-[--bg-surface] text-[--text-primary] shadow-xs' : 'text-[--text-secondary] hover:text-[--text-primary]'
                }`}
            >
              <List className="w-4 h-4" /> List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${viewMode === 'map' ? 'bg-[--bg-surface] text-[--text-primary] shadow-xs' : 'text-[--text-secondary] hover:text-[--text-primary]'
                }`}
            >
              <Map className="w-4 h-4" /> Map View
            </button>
          </div>

          <Link
            href={activeTrack === 'civic' ? '/report/civic' : '/report/environmental'}
            className={`text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors text-white ${activeTrack === 'civic' ? 'bg-blue-700 hover:bg-blue-800 dark:bg-blue-600' : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>New {activeTrack === 'civic' ? 'Civic' : 'Environmental'} Report</span>
          </Link>
        </div>

      </div>

      {/* Reports Dashboard Status Filter Toolbar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[--border]">
        {['all', 'reported', 'in_progress', 'resolved', 'escalated'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all shrink-0 ${statusFilter === st
              ? activeTrack === 'civic' ? 'bg-blue-700 text-white dark:bg-blue-600' : 'bg-emerald-600 text-white'
              : 'bg-[--bg-surface] text-[--text-secondary] hover:bg-[--bg-subtle] border border-[--border]'
              }`}
          >
            {st === 'all' ? `All (${currentTrackReports.length})` : st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      {viewMode === 'map' ? (
        <InteractiveMap
          issues={filteredIssues}
          onSelectIssue={(iss) => setSelectedIssue(iss)}
          height="h-[600px] lg:h-[700px] xl:h-[780px]"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredIssues.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-[--bg-surface] rounded-xl border border-[--border] space-y-3 shadow-xs">
              <FileText className="w-10 h-10 text-[--text-muted] mx-auto opacity-50" />
              <h3 className="text-sm font-bold text-[--text-primary]">
                No {activeTrack === 'civic' ? 'civic' : 'environmental'} reports submitted yet
              </h3>
              <p className="text-xs text-[--text-secondary] max-w-sm mx-auto">
                Submit a report using the button below to start tracking your resolution timeline.
              </p>
              <Link
                href={activeTrack === 'civic' ? '/report/civic' : '/report/environmental'}
                className={`inline-flex items-center gap-1.5 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-xs ${activeTrack === 'civic' ? 'bg-blue-700 hover:bg-blue-800 dark:bg-blue-600' : 'bg-emerald-600 hover:bg-emerald-500'
                  }`}
              >
                <PlusCircle className="w-4 h-4" /> Report {activeTrack === 'civic' ? 'Civic' : 'Environmental'} Issue
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
