'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { IssueCard } from '@/components/IssueCard';
import { IssueDetailModal } from '@/components/IssueDetailModal';
import { CivicIssue } from '@/lib/types';
import {
  User,
  Award,
  PlusCircle,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Sparkles,
  LogIn,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Lock,
  LogOut,
  Check,
  Building2,
  Trees
} from 'lucide-react';

export default function CitizenDashboardPage() {
  const router = useRouter();
  const { user, activeRole, issues, upvoteIssue, logout, updatePassword } = useApp();
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);

  // Active Tab: overview | emergency | settings
  const [activeTab, setActiveTab] = useState<'overview' | 'emergency' | 'settings'>('overview');

  // Password management state
  const [passState, setPassState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passNotice, setPassNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passLoading, setPassLoading] = useState<boolean>(false);

  // Profile management state
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');

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
          <h2 className="text-2xl font-bold text-[--text-primary]">Citizen Governance Dashboard</h2>
          <p className="text-xs text-[--text-secondary] leading-relaxed">
            Please log in or create a citizen account to manage your profile, view emergency reports, and track civic SLA fixes.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto pt-2">
          <Link
            href="/login?returnUrl=/dashboard"
            className="flex-1 bg-blue-700 hover:bg-blue-800 text-white dark:bg-blue-600 font-bold py-3 px-4 rounded-lg shadow-xs text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Login to Citizen Portal</span>
          </Link>
          <Link
            href="/signup"
            className="flex-1 bg-[--bg-surface] hover:bg-[--bg-subtle] text-[--text-primary] font-semibold py-3 px-4 rounded-lg border border-[--border] text-xs transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  // Filter citizen's own submitted issues & emergency issues
  const mySubmittedIssues = issues.filter((i) => i.citizenId === user.id || i.citizenName === user.name);
  const activeCount = mySubmittedIssues.filter((i) => i.status !== 'resolved').length;
  const resolvedCount = mySubmittedIssues.filter((i) => i.status === 'resolved').length;

  const myEmergencyReports = mySubmittedIssues.filter((i) => i.emergency);

  const handleUpdatePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassNotice(null);

    if (passState.newPassword !== passState.confirmPassword) {
      setPassNotice({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    setPassLoading(true);
    const res = await updatePassword(passState.currentPassword, passState.newPassword, passState.confirmPassword);
    setPassLoading(false);

    if (res.success) {
      setPassNotice({ type: 'success', text: 'Account password updated successfully!' });
      setPassState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setPassNotice({ type: 'error', text: res.error || 'Password update failed.' });
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 space-y-8 font-sans">

      {/* Header Profile Banner */}
      <div className="bg-[--bg-surface] text-[--text-primary] rounded-xl p-6 sm:p-8 border border-[--border] shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-700 text-white dark:bg-blue-600 flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[--text-primary]">{user.name}</h1>
                <span className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider">
                  Verified Resident
                </span>
              </div>
              <p className="text-xs text-[--text-secondary] font-medium mt-1 flex items-center gap-2 flex-wrap">
                <span>{user.rankTitle || 'Civic Guardian'}</span>
                <span>•</span>
                <span className="text-blue-700 dark:text-blue-400 font-semibold">{user.ward || 'Ward Jurisdiction'}</span>
                <span>•</span>
                <span className="text-[--text-muted] font-mono">{user.email}</span>
              </p>
            </div>
          </div>

          {/* Badges Bar */}
          {user.badges && user.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {user.badges.map((bdg) => (
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

        {/* Stats Summary */}
        <div className="lg:col-span-5 grid grid-cols-3 gap-3 bg-[--bg-subtle] p-4 rounded-xl border border-[--border] text-center">
          <div>
            <div className="text-2xl font-bold font-mono text-blue-700 dark:text-blue-400">{user.civicScore}</div>
            <div className="text-[10px] text-[--text-secondary] font-bold uppercase tracking-wider">Civic Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">{activeCount}</div>
            <div className="text-[10px] text-[--text-secondary] font-bold uppercase tracking-wider">Active Reports</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{resolvedCount}</div>
            <div className="text-[10px] text-[--text-secondary] font-bold uppercase tracking-wider">Verified Solved</div>
          </div>
        </div>

      </div>

      {/* Dashboard Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-[--border] pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'overview'
              ? 'bg-blue-700 text-white dark:bg-blue-600 shadow-xs'
              : 'bg-[--bg-surface] text-[--text-secondary] hover:bg-[--bg-subtle] border border-[--border]'
            }`}
        >
          <FileText className="w-4 h-4" />
          <span>Overview &amp; Quick Actions</span>
        </button>

        <button
          onClick={() => setActiveTab('emergency')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'emergency'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-[--bg-surface] text-[--text-secondary] hover:bg-[--bg-subtle] border border-[--border]'
            }`}
        >
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span>Emergency Reports ({myEmergencyReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'settings'
              ? 'bg-blue-700 text-white dark:bg-blue-600 shadow-xs'
              : 'bg-[--bg-surface] text-[--text-secondary] hover:bg-[--bg-subtle] border border-[--border]'
            }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Account Settings &amp; Password</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">

          {/* Quick Action Navigation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Track 1: Civic Issue */}
            <Link
              href="/report/civic"
              className="bg-[--bg-surface] hover:bg-[--bg-subtle] border border-[--border] hover:border-[--border-subtle] p-5 rounded-xl shadow-xs transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[--text-primary] flex items-center justify-between">
                  Report Civic Issue
                  <ArrowRight className="w-4 h-4 text-[--text-muted] group-hover:translate-x-0.5 transition-transform" />
                </h3>
                <p className="text-xs text-[--text-secondary] mt-1">Submit road, streetlight, sanitation &amp; water infrastructure issues.</p>
              </div>
            </Link>

            {/* Track 2: Environment & Wildlife */}
            <Link
              href="/report/environmental"
              className="bg-[--bg-surface] hover:bg-[--bg-subtle] border border-[--border] hover:border-[--border-subtle] p-5 rounded-xl shadow-xs transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 flex items-center justify-center">
                <Trees className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[--text-primary] flex items-center justify-between">
                  Report Environmental Issue
                  <ArrowRight className="w-4 h-4 text-[--text-muted] group-hover:translate-x-0.5 transition-transform" />
                </h3>
                <p className="text-xs text-[--text-secondary] mt-1">Report tree cutting, poaching, pollution &amp; wildlife emergencies.</p>
              </div>
            </Link>

            <Link
              href="/report/civic?emergency=true"
              className="bg-[--bg-surface] hover:bg-red-50/50 dark:hover:bg-red-950/20 border border-red-200 dark:border-red-900/80 p-5 rounded-xl shadow-xs transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[--text-primary] flex items-center justify-between">
                  Emergency Hazard Flag
                  <ArrowRight className="w-4 h-4 text-red-500 group-hover:translate-x-0.5 transition-transform" />
                </h3>
                <p className="text-xs text-[--text-secondary] mt-1">Trigger priority 4-hour SLA routing for dangerous hazards.</p>
              </div>
            </Link>

            <Link
              href="/live-map"
              className="bg-[--bg-surface] hover:bg-[--bg-subtle] border border-[--border] hover:border-[--border-subtle] p-5 rounded-xl shadow-xs transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="w-10 h-10 rounded-lg bg-[--bg-subtle] border border-[--border] flex items-center justify-center text-[--text-primary]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[--text-primary] flex items-center justify-between">
                  Live Spatial Map
                  <ArrowRight className="w-4 h-4 text-[--text-muted] group-hover:translate-x-0.5 transition-transform" />
                </h3>
                <p className="text-xs text-[--text-secondary] mt-1">View real-time map displaying active SLA tickets &amp; AI fixes.</p>
              </div>
            </Link>
          </div>

          {/* Recent Submissions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[--border] pb-3">
              <h2 className="text-lg font-bold text-[--text-primary]">My Submissions &amp; Activity</h2>
              <Link href="/my-reports" className="text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline">
                View All My Reports →
              </Link>
            </div>

            {mySubmittedIssues.length === 0 ? (
              <div className="bg-[--bg-surface] rounded-xl border border-[--border] p-8 text-center space-y-3 shadow-xs">
                <FileText className="w-10 h-10 text-[--text-muted] mx-auto opacity-50" />
                <h3 className="text-sm font-bold text-[--text-primary]">No reported issues yet</h3>
                <p className="text-xs text-[--text-secondary] max-w-sm mx-auto">
                  You haven't submitted any civic reports yet. Help improve your neighborhood by reporting your first issue!
                </p>
                <Link
                  href="/report"
                  className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white dark:bg-blue-600 font-bold text-xs px-4 py-2 rounded-lg shadow-xs transition-colors"
                >
                  <PlusCircle className="w-4 h-4" /> Report Issue Now
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {mySubmittedIssues.slice(0, 4).map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    onSelect={(selected) => setSelectedIssue(selected)}
                    onUpvote={(e, id) => upvoteIssue(id)}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: EMERGENCY REPORTS PANEL */}
      {activeTab === 'emergency' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[--border] pb-3">
            <div>
              <h2 className="text-lg font-bold text-[--text-primary] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Emergency Hazards Panel
              </h2>
              <p className="text-xs text-[--text-secondary]">Active emergency reports requiring expedited 4-hour SLA response</p>
            </div>
            <Link
              href="/report?emergency=true"
              className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xs transition-colors"
            >
              + Submit Emergency Flag
            </Link>
          </div>

          {myEmergencyReports.length === 0 ? (
            <div className="bg-[--bg-surface] rounded-xl border border-[--border] p-8 text-center space-y-3 shadow-xs">
              <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-sm font-bold text-[--text-primary]">No active emergency reports</h3>
              <p className="text-xs text-[--text-secondary] max-w-sm mx-auto">
                You have no pending emergency reports. All safety hazards flagged by your account are clear.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myEmergencyReports.map((report) => (
                <div key={report.id} className="bg-[--bg-surface] border border-red-200 dark:border-red-900/80 p-4 rounded-xl flex items-center justify-between gap-4 text-xs shadow-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-red-600 dark:text-red-400">{report.ticketNumber}</span>
                      <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold text-[9px] uppercase px-2 py-0.5 rounded border border-red-200 dark:border-red-900">Emergency</span>
                      <span className="text-[--text-secondary] font-semibold">{report.category}</span>
                    </div>
                    <h4 className="font-bold text-[--text-primary]">{report.title}</h4>
                    <p className="text-[--text-secondary] text-[11px]">{report.location.address}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="bg-[--bg-subtle] text-[--text-primary] border border-[--border] font-mono font-bold px-3 py-1 rounded-md text-xs">
                      {report.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <button
                      onClick={() => setSelectedIssue(report)}
                      className="block mt-2 text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ACCOUNT SETTINGS & PASSWORD SECURITY */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="border-b border-[--border] pb-3">
            <h2 className="text-lg font-bold text-[--text-primary] flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Account Settings &amp; Security
            </h2>
            <p className="text-xs text-[--text-secondary]">Manage profile information and update server-validated password</p>
          </div>

          {passNotice && (
            <div className={`p-4 rounded-lg text-xs font-bold flex items-center gap-2 ${passNotice.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-800'
              }`}>
              {passNotice.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <span>{passNotice.text}</span>
            </div>
          )}

          {/* Profile Form */}
          <div className="bg-[--bg-surface] rounded-xl border border-[--border] p-6 space-y-4 text-xs shadow-xs">
            <h3 className="font-bold text-[--text-primary] uppercase tracking-wider text-[11px]">Profile Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-[--text-secondary] block mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full border border-[--border] rounded-lg px-3 py-2 bg-[--bg-subtle] font-semibold text-[--text-primary] focus:outline-none focus:ring-1 focus:ring-[--ring]"
                />
              </div>

              <div>
                <label className="font-bold text-[--text-secondary] block mb-1">Email Address</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full border border-[--border] rounded-lg px-3 py-2 bg-[--bg-subtle] text-[--text-muted] font-mono opacity-80 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[--text-secondary] block mb-1">Mobile Phone</label>
              <input
                type="text"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="w-full border border-[--border] rounded-lg px-3 py-2 bg-[--bg-subtle] text-[--text-primary] focus:outline-none focus:ring-1 focus:ring-[--ring]"
              />
            </div>
          </div>

          {/* Password Security Form */}
          <form onSubmit={handleUpdatePasswordSubmit} className="bg-[--bg-surface] rounded-xl border border-[--border] p-6 space-y-4 text-xs shadow-xs">
            <h3 className="font-bold text-[--text-primary] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Security &amp; Password Management
            </h3>

            <div>
              <label className="font-bold text-[--text-secondary] block mb-1">Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={passState.currentPassword}
                onChange={(e) => setPassState({ ...passState, currentPassword: e.target.value })}
                required
                className="w-full border border-[--border] rounded-lg px-3 py-2 bg-[--bg-subtle] text-[--text-primary] focus:outline-none focus:ring-1 focus:ring-[--ring]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-[--text-secondary] block mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={passState.newPassword}
                  onChange={(e) => setPassState({ ...passState, newPassword: e.target.value })}
                  required
                  className="w-full border border-[--border] rounded-lg px-3 py-2 bg-[--bg-subtle] text-[--text-primary] focus:outline-none focus:ring-1 focus:ring-[--ring]"
                />
              </div>

              <div>
                <label className="font-bold text-[--text-secondary] block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={passState.confirmPassword}
                  onChange={(e) => setPassState({ ...passState, confirmPassword: e.target.value })}
                  required
                  className="w-full border border-[--border] rounded-lg px-3 py-2 bg-[--bg-subtle] text-[--text-primary] focus:outline-none focus:ring-1 focus:ring-[--ring]"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={logout}
                className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>

              <button
                type="submit"
                disabled={passLoading}
                className="bg-blue-700 hover:bg-blue-800 text-white dark:bg-blue-600 font-bold text-xs px-6 py-2.5 rounded-lg shadow-xs transition-colors"
              >
                {passLoading ? 'Updating Password...' : 'Update Password'}
              </button>
            </div>
          </form>

        </div>
      )}

      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />

    </div>
  );
}
