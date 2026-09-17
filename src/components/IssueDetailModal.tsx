'use client';

import React, { useState } from 'react';
import { CivicIssue, IssueStatus } from '@/lib/types';
import { useApp } from '@/context/AppContext';
import { formatDate, formatTime } from '@/lib/dateUtils';
import {
  X,
  MapPin,
  CheckCircle2,
  Send,
  ShieldCheck,
  FileText,
  Building,
  Upload,
  Trash2,
  Check,
  UserCheck
} from 'lucide-react';

interface IssueDetailModalProps {
  issue: CivicIssue | null;
  onClose: () => void;
}

export function IssueDetailModal({ issue, onClose }: IssueDetailModalProps) {
  const { activeRole, user, updateIssueStatus, addNoteToIssue, deleteReport } = useApp();

  const [noteInput, setNoteInput] = useState('');
  const userUploadedPhoto = issue?.photoUrl || (issue?.evidenceFiles && issue?.evidenceFiles[0]) || '';
  const [resolutionPhotoInput, setResolutionPhotoInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [nextActionDateInput, setNextActionDateInput] = useState(issue?.nextActionDate || '');

  React.useEffect(() => {
    if (issue?.nextActionDate) setNextActionDateInput(issue.nextActionDate);
  }, [issue]);

  if (!issue) return null;

  const handleUpdateNextActionDate = async () => {
    if (!nextActionDateInput || !issue) return;
    await updateIssueStatus(issue.id, issue.status, undefined, `Next action date set to ${nextActionDateInput}`, nextActionDateInput);
    alert(`Next Action Date scheduled for ${nextActionDateInput}`);
  };

  const isOwner = Boolean(user && (issue.citizenId === user.id || issue.citizenName === user.name));
  const isAdmin = Boolean(activeRole === 'admin' || user?.role === 'admin');

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    await addNoteToIssue(issue.id, noteInput.trim());
    setNoteInput('');
  };

  const handleStatusChange = async (newStatus: IssueStatus) => {
    if (newStatus === 'resolved') {
      if (!resolutionPhotoInput) {
        alert('Please paste or select a resolution photo to verify completion.');
        return;
      }
      setIsVerifying(true);
      await updateIssueStatus(issue.id, 'resolved', resolutionPhotoInput, 'Work completed and verified by department staff.');
      setIsVerifying(false);
      alert('Ticket marked as RESOLVED and verified!');
    } else {
      await updateIssueStatus(issue.id, newStatus, undefined, `Status updated to ${newStatus.replace('_', ' ').toUpperCase()} by officer.`);
    }
  };

  const handleCloseReportByOwner = async () => {
    if (confirm('Are you sure you want to close and mark this report as resolved?')) {
      const ok = await updateIssueStatus(issue.id, 'resolved', undefined, 'Report closed and verified resolved by resident.');
      if (ok) onClose();
    }
  };

  const handleDeleteReportByOwner = async () => {
    if (confirm('Are you sure you want to permanently delete this report? This action cannot be undone.')) {
      const ok = await deleteReport(issue.id);
      if (ok) onClose();
    }
  };

  const handleCloseReportByAdmin = async () => {
    if (confirm('Admin Action: Are you sure you want to close this report across the platform?')) {
      const ok = await updateIssueStatus(issue.id, 'resolved', undefined, 'Report administratively closed and verified resolved by Super Admin.');
      if (ok) onClose();
    }
  };

  const handleDeleteReportByAdmin = async () => {
    if (confirm('Admin Action: Are you sure you want to permanently delete this report from the platform?')) {
      const ok = await deleteReport(issue.id);
      if (ok) onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
      {/* Dark semi-transparent backdrop scrim */}
      <div 
        className="fixed inset-0 bg-black/60 transition-opacity" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      {/* Solid Opaque Modal Dialog Box */}
      <div 
        role="dialog"
        aria-modal="true"
        className="relative z-10 bg-white dark:bg-[#1a1d23] text-slate-900 dark:text-[#e8e9eb] w-full max-w-4xl rounded-lg shadow-2xl border border-slate-200 dark:border-[#2c3039] overflow-hidden my-auto max-h-[90vh] flex flex-col"
      >

        {/* Modal Top Header */}
        <div className="bg-slate-50 dark:bg-[#22252d] px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-[#2c3039] shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold bg-white dark:bg-[#1a1d23] text-slate-900 dark:text-[#e8e9eb] border border-slate-200 dark:border-[#2c3039] px-2.5 py-1 rounded-md">
              {issue.ticketNumber}
            </span>
            <span className="text-sm font-semibold text-slate-900 dark:text-[#e8e9eb]">{issue.category}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#1a1d23] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white dark:bg-[#1a1d23]">

          {/* Main Title & Status Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[--border]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-[--text-muted] tracking-wide" suppressHydrationWarning>
                  Reported by {issue.citizenName} • {formatDate(issue.reportedAt)}
                </span>
              </div>
              <h2 className="text-xl font-bold text-[--text-primary] leading-tight">
                {issue.title}
              </h2>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className={`status-badge status-${issue.status}`}>
                {issue.status === 'resolved' ? (
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" /> Resolved
                  </span>
                ) : (
                  `Status: ${issue.status.replace('_', ' ')}`
                )}
              </span>
            </div>
          </div>

          {/* Photo Section: Original vs Resolution Photo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[--text-secondary] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[--text-muted]" />
                Original Citizen Report Photo
              </span>
              <div className="h-56 bg-[--bg-subtle] rounded-xl overflow-hidden border border-[--border] flex items-center justify-center relative">
                {userUploadedPhoto ? (
                  <img
                    src={userUploadedPhoto}
                    alt="Original Citizen Report Photo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6 text-[--text-muted]">
                    <FileText className="w-8 h-8 mx-auto mb-1 opacity-60" />
                    <span className="text-xs font-medium">No Image Uploaded by Citizen</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-[--text-secondary] uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Resolution Verification Photo
              </span>
              <div className="h-56 bg-[--bg-subtle] rounded-xl overflow-hidden border border-[--border] flex items-center justify-center relative">
                {issue.resolutionPhotoUrl ? (
                  <>
                    <img
                      src={issue.resolutionPhotoUrl}
                      alt="Resolution Verified"
                      className="w-full h-full object-cover"
                    />
                    {issue.aiVerificationStatus && (
                      <div className="absolute bottom-3 left-3 right-3 bg-[--bg-surface] text-[--text-primary] p-2.5 rounded-lg border border-[--border] text-xs flex items-center justify-between shadow-xs">
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <ShieldCheck className="w-4 h-4" /> AI Verification: {issue.aiVerificationStatus}
                        </span>
                        <span className="font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded text-[11px]">
                          Match {issue.aiVerificationScore || 98}%
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center p-6 text-[--text-muted]">
                    <CheckCircle2 className="w-10 h-10 mx-auto mb-2 opacity-50 stroke-[1.5]" />
                    <p className="text-xs font-semibold text-[--text-secondary]">Pending Field Verification</p>
                    <p className="text-[11px] text-[--text-muted] mt-1">Resolution photo will be computer vision verified upon work completion.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description & Location Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[--bg-subtle] p-4.5 rounded-xl border border-[--border]">
            <div className="md:col-span-2 space-y-2">
              <h4 className="text-xs font-semibold text-[--text-secondary] uppercase tracking-wider">
                Detailed Issue Description
              </h4>
              <p className="text-xs text-[--text-primary] leading-relaxed">
                {issue.description}
              </p>
              {issue.voiceNoteUrl && (
                <div className="pt-2">
                  <div className="text-[10px] font-semibold text-[--text-muted] uppercase">Attached Voice Note:</div>
                  <audio controls src={issue.voiceNoteUrl} className="w-full h-8 mt-1" />
                </div>
              )}
              {issue.nextActionDate && (
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-[--text-muted] uppercase">Scheduled Next Action Date:</span>
                  <span className="bg-[--bg-surface] text-[--text-primary] border border-[--border] font-mono text-xs font-semibold px-2 py-0.5 rounded-md">
                    {issue.nextActionDate}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2 border-t md:border-t-0 md:border-l border-[--border] pt-4 md:pt-0 md:pl-4">
              <h4 className="text-xs font-semibold text-[--text-secondary] uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[--text-muted]" /> Location Details
              </h4>
              <p className="text-xs font-medium text-[--text-primary]">{issue.location.address}</p>
              {issue.location.landmark && (
                <p className="text-[11px] text-[--text-muted]">Landmark: {issue.location.landmark}</p>
              )}
              <p className="text-[11px] text-[--text-muted] font-mono">
                GPS: {issue.location.lat.toFixed(4)}, {issue.location.lng.toFixed(4)}
              </p>
              <div className="pt-1">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-[--bg-surface] text-[--text-secondary] text-[10px] font-medium border border-[--border]">
                  {issue.location.ward}
                </span>
              </div>
            </div>
          </div>

          {/* SUPER ADMIN REPORT MANAGEMENT PANEL */}
          {isAdmin && (
            <div className="bg-[--bg-subtle] border border-[--border] p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-[--text-primary] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[--text-primary]" />
                  Super Admin Platform Governance
                </h3>
                <span className="text-[10px] bg-[--bg-surface] text-[--text-secondary] border border-[--border] font-mono px-2 py-0.5 rounded-md">
                  ADMIN AUTHORIZATION
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                {issue.status !== 'resolved' && (
                  <button
                    type="button"
                    onClick={handleCloseReportByAdmin}
                    className="bg-[--text-primary] text-[--bg-base] text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-opacity hover:opacity-90"
                  >
                    <Check className="w-4 h-4" /> Admin Close &amp; Resolve Report
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDeleteReportByAdmin}
                  className="bg-[--bg-surface] border border-red-300 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Admin Delete Report
                </button>
              </div>
            </div>
          )}

          {/* RESIDENT REPORT MANAGEMENT PANEL */}
          {isOwner && !isAdmin && (
            <div className="bg-[--bg-subtle] border border-[--border] p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-[--text-primary] uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-500" />
                  Manage Your Report
                </h3>
                <span className="text-[10px] bg-[--bg-surface] text-[--text-secondary] border border-[--border] font-medium px-2 py-0.5 rounded-md">
                  Report Owner
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                {issue.status !== 'resolved' && (
                  <button
                    type="button"
                    onClick={handleCloseReportByOwner}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Check className="w-4 h-4" /> Close &amp; Mark Solved
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDeleteReportByOwner}
                  className="bg-[--bg-surface] border border-red-300 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete Report
                </button>
              </div>
            </div>
          )}

          {/* Department Staff Operational Actions */}
          {(activeRole === 'staff' || activeRole === 'admin') && (
            <div className="bg-[--bg-subtle] border border-[--border] p-4.5 rounded-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[--border] pb-3">
                <h3 className="text-xs font-semibold text-[--text-primary] uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-amber-500" />
                  Department Officer Operations ({issue.departmentName})
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[--text-secondary] font-mono bg-[--bg-surface] px-2 py-0.5 rounded-md border border-[--border]">
                    SLA Remaining: {issue.slaHoursRemaining} hrs
                  </span>
                </div>
              </div>

              {/* Status Change Lifecycle Toolbar */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-[--text-secondary] uppercase tracking-wider block">
                  Update Ticket Workflow Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['acknowledged', 'under_review', 'in_progress', 'resolved', 'rejected'] as IssueStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${issue.status === st
                          ? 'bg-[--text-primary] text-[--bg-base] border-[--text-primary]'
                          : 'bg-[--bg-surface] text-[--text-secondary] border-[--border] hover:text-[--text-primary] hover:border-[--border-subtle]'
                        }`}
                    >
                      {st.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>

              {/* Next Action Date Scheduler */}
              <div className="pt-3 border-t border-[--border] space-y-2">
                <label className="text-xs font-semibold text-[--text-primary] flex items-center justify-between">
                  <span>Schedule Next Operational Action Date</span>
                  {issue.nextActionDate && (
                    <span className="text-[11px] font-mono text-[--text-secondary] bg-[--bg-surface] border border-[--border] px-2 py-0.5 rounded-md">
                      Current: {issue.nextActionDate}
                    </span>
                  )}
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={nextActionDateInput}
                    onChange={(e) => setNextActionDateInput(e.target.value)}
                    className="text-xs border border-[--border] rounded-lg px-3 py-2 bg-[--bg-surface] font-mono text-[--text-primary] focus:ring-1 focus:ring-[--ring] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleUpdateNextActionDate}
                    className="bg-[--text-primary] hover:opacity-90 text-[--bg-base] text-xs font-semibold px-4 py-2 rounded-lg transition-opacity"
                  >
                    Save Action Date
                  </button>
                </div>
              </div>

              {/* Resolution Photo Upload Form */}
              {issue.status !== 'resolved' && (
                <div className="pt-3 border-t border-[--border] space-y-2">
                  <label className="text-xs font-semibold text-[--text-primary] block">
                    Upload Resolution Evidence Photo (Preserves Citizen Original)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste Resolution / After-Action Image URL..."
                      value={resolutionPhotoInput}
                      onChange={(e) => setResolutionPhotoInput(e.target.value)}
                      className="flex-1 text-xs border border-[--border] rounded-lg px-3 py-2 bg-[--bg-surface] text-[--text-primary] placeholder-[--text-muted] focus:ring-1 focus:ring-[--ring] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleStatusChange('resolved')}
                      disabled={isVerifying}
                      className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-emerald-500 disabled:opacity-50 flex items-center gap-1.5 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {isVerifying ? 'AI Verifying...' : 'Submit & Verify'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Timeline & Notes Grid — Stacked cleanly with zero overlap */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[--border]">

            {/* Timeline */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[--text-secondary] uppercase tracking-wider">
                Progress Timeline
              </h3>
              <div className="space-y-4 relative pl-4 border-l-2 border-[--border]">
                {issue.timeline.map((evt) => (
                  <div key={evt.id} className="relative text-xs space-y-1">
                    <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-[--text-primary] ring-4 ring-[--bg-surface]" />
                    <div className="flex items-center justify-between text-[--text-muted] text-[11px]">
                      <span className="font-semibold text-[--text-primary]">{evt.title}</span>
                      <span suppressHydrationWarning>{formatTime(evt.timestamp)}</span>
                    </div>
                    <p className="text-[--text-secondary] text-[11px]">{evt.description}</p>
                    <p className="text-[10px] text-[--text-muted] italic">By {evt.actor} ({evt.actorRole})</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Department & Citizen Notes */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[--text-secondary] uppercase tracking-wider">
                Notes &amp; Audit Trail
              </h3>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {issue.notes.length === 0 ? (
                  <p className="text-xs text-[--text-muted] italic">No notes added yet.</p>
                ) : (
                  issue.notes.map((n) => (
                    <div key={n.id} className="bg-[--bg-subtle] border border-[--border] p-2.5 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between text-[10px] text-[--text-muted] font-medium">
                        <span>{n.author} ({n.role})</span>
                        <span suppressHydrationWarning>{formatTime(n.timestamp)}</span>
                      </div>
                      <p className="text-[--text-primary]">{n.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note / Comment Input Form */}
              <form onSubmit={handleAddNote} className="flex gap-2 pt-3 border-t border-[--border]">
                <input
                  type="text"
                  placeholder="Add comment or update note..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="flex-1 text-xs border border-[--border] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[--ring] bg-[--bg-subtle] text-[--text-primary] placeholder-[--text-muted]"
                />
                <button
                  type="submit"
                  className="bg-[--text-primary] text-[--bg-base] text-xs font-semibold px-3.5 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" /> Post
                </button>
              </form>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-[--bg-subtle] px-6 py-3 border-t border-[--border] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[--bg-surface] text-[--text-primary] border border-[--border] text-xs font-semibold rounded-lg hover:bg-[--bg-subtle] transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
