'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Bell,
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
      <div className="w-full max-w-md mx-auto px-4 py-16 text-center space-y-6 font-sans">
        <div className="w-14 h-14 rounded-2xl bg-blue-950 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto shadow-md">
          <User className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">Citizen Governance Dashboard</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Please log in or create a citizen account to manage your profile, view emergency reports, and track civic SLA fixes.
          </p>
        </div>
        <div className="flex flex-col gap-2.5 pt-2">
          <Link
            href="/login?returnUrl=/dashboard"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-md text-xs flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Login to Citizen Portal</span>
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

  // Filter citizen's own submitted issues & emergency issues
  const mySubmittedIssues = issues.filter((i) => i.citizenId === user.id || i.citizenName === user.name);
  const activeCount = mySubmittedIssues.filter((i) => i.status !== 'resolved').length;
  const resolvedCount = mySubmittedIssues.filter((i) => i.status === 'resolved').length;

  const myEmergencyReports = mySubmittedIssues.filter((i) => i.emergency);
  const publicEmergencyReports = issues.filter((i) => i.emergency && i.visibility === 'PUBLIC');

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
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 space-y-8 font-sans">
      
      {/* Header Profile Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-xl text-white shadow-md shadow-blue-600/30">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{user.name}</h1>
                <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold px-2.5 py-0.5 rounded font-mono uppercase">
                  Verified Resident
                </span>
              </div>
              <p className="text-xs text-slate-400 font-semibold mt-0.5 flex items-center gap-2">
                <span>{user.rankTitle || 'Civic Guardian'}</span>
                <span>•</span>
                <span className="text-blue-300">{user.ward || 'Ward Jurisdiction'}</span>
                <span>•</span>
                <span className="text-slate-400 font-mono">{user.email}</span>
              </p>
            </div>
          </div>

          {/* Badges Bar */}
          {user.badges && user.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {user.badges.map((bdg) => (
                <span
                  key={bdg.id}
                  className="bg-slate-800/90 border border-slate-700 text-slate-200 text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  {bdg.title}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="lg:col-span-5 grid grid-cols-3 gap-3 bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-center">
          <div>
            <div className="text-2xl font-black font-mono text-blue-400">{user.civicScore}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Civic Score</div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-amber-400">{activeCount}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Reports</div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-emerald-400">{resolvedCount}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Verified Solved</div>
          </div>
        </div>

      </div>

      {/* Dashboard Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Overview & Quick Actions</span>
        </button>

        <button
          onClick={() => setActiveTab('emergency')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'emergency'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span>Emergency Reports ({myEmergencyReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Account Settings & Password</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Quick Action Navigation Grid: Two Separate Reporting Tracks (Spec #2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Track 1: Civic Issue */}
            <Link
              href="/report/civic"
              className="bg-blue-600 hover:bg-blue-500 text-white p-5 rounded-2xl shadow-md transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base flex items-center justify-between">
                  Report Civic Issue
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-blue-100 mt-1">Submit road, streetlight, sanitation & water infrastructure issues.</p>
              </div>
            </Link>

            {/* Track 2: Environment & Wildlife */}
            <Link
              href="/report/environmental"
              className="bg-emerald-600 hover:bg-emerald-500 text-white p-5 rounded-2xl shadow-md transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Trees className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base flex items-center justify-between">
                  Report Environmental Issue
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-emerald-100 mt-1">Report tree cutting, poaching, pollution & wildlife emergencies.</p>
              </div>
            </Link>

            <Link
              href="/report/civic?emergency=true"
              className="bg-red-600 hover:bg-red-500 text-white p-5 rounded-2xl shadow-md transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base flex items-center justify-between">
                  Emergency Hazard Flag
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-red-100 mt-1">Trigger priority 4-hour SLA routing for dangerous hazards.</p>
              </div>
            </Link>

            <Link
              href="/live-map"
              className="bg-white border border-slate-200 hover:border-blue-400 p-5 rounded-2xl shadow-xs transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center justify-between group-hover:text-purple-600">
                  Live Spatial Map
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-slate-500 mt-1">View real-time map displaying active SLA tickets & AI fixes.</p>
              </div>
            </Link>
          </div>

          {/* Recent Submissions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-lg font-extrabold text-slate-900">My Submissions & Activity</h2>
              <Link href="/my-reports" className="text-xs font-bold text-blue-600 hover:underline">
                View All My Reports →
              </Link>
            </div>

            {mySubmittedIssues.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No reported issues yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You haven't submitted any civic reports yet. Help improve your neighborhood by reporting your first issue!
                </p>
                <Link
                  href="/report"
                  className="inline-flex items-center gap-1.5 bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" /> Report Issue Now
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Emergency Hazards Panel
              </h2>
              <p className="text-xs text-slate-500">Active emergency reports requiring expedited 4-hour SLA response</p>
            </div>
            <Link
              href="/report?emergency=true"
              className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow"
            >
              + Submit Emergency Flag
            </Link>
          </div>

          {myEmergencyReports.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">No active emergency reports</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You have no pending emergency reports. All safety hazards flagged by your account are clear.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myEmergencyReports.map((report) => (
                <div key={report.id} className="bg-red-50/60 border border-red-200 p-4 rounded-xl flex items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-red-700">{report.ticketNumber}</span>
                      <span className="bg-red-600 text-white font-extrabold text-[9px] uppercase px-2 py-0.5 rounded">Emergency</span>
                      <span className="text-slate-500 font-semibold">{report.category}</span>
                    </div>
                    <h4 className="font-bold text-slate-900">{report.title}</h4>
                    <p className="text-slate-600 text-[11px]">{report.location.address}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="bg-slate-900 text-white font-mono font-bold px-3 py-1 rounded-lg text-xs">
                      {report.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <button
                      onClick={() => setSelectedIssue(report)}
                      className="block mt-2 text-xs font-bold text-blue-600 hover:underline"
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
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-blue-600" />
              Account Settings & Security
            </h2>
            <p className="text-xs text-slate-500">Manage profile information and update server-validated password</p>
          </div>

          {passNotice && (
            <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
              passNotice.type === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-red-800 border border-red-300'
            }`}>
              {passNotice.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <span>{passNotice.text}</span>
            </div>
          )}

          {/* Profile Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 text-xs shadow-xs">
            <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">Profile Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-100 text-slate-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Mobile Phone</label>
              <input
                type="text"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-slate-50"
              />
            </div>
          </div>

          {/* Password Security Form */}
          <form onSubmit={handleUpdatePasswordSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 text-xs shadow-xs">
            <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-blue-600" /> Security & Password Management
            </h3>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={passState.currentPassword}
                onChange={(e) => setPassState({ ...passState, currentPassword: e.target.value })}
                required
                className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-slate-50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={passState.newPassword}
                  onChange={(e) => setPassState({ ...passState, newPassword: e.target.value })}
                  required
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-slate-50"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={passState.confirmPassword}
                  onChange={(e) => setPassState({ ...passState, confirmPassword: e.target.value })}
                  required
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-slate-50"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={logout}
                className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>

              <button
                type="submit"
                disabled={passLoading}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all"
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
