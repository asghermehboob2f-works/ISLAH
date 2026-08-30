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
  UserCheck,
  XCircle
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
    } else if (newStatus === 'rejected') {
      const reason = prompt('Please specify the reason for marking this ticket as Invalid / Rejected:', noteInput || 'Marked invalid upon inspection / duplicate / invalid location details.');
      if (!reason) return;
      await updateIssueStatus(issue.id, 'rejected', undefined, `Ticket marked invalid/rejected. Reason: ${reason}`, undefined, reason);
      alert('Ticket marked as INVALID / REJECTED and closed out of active pending queue.');
      onClose();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col transition-colors">
        
        {/* Modal Top Header */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold bg-blue-600/30 text-blue-300 border border-blue-500/40 px-2.5 py-1 rounded">
              {issue.ticketNumber}
            </span>
            <span className="text-sm font-bold text-slate-200">{issue.category}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-900 dark:text-slate-100">
          
          {/* Main Title & Status Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" suppressHydrationWarning>
                  Reported by {issue.citizenName} • {formatDate(issue.reportedAt)}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {issue.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {issue.status === 'resolved' ? (
                <span className="bg-emerald-600 text-white px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs border border-emerald-700">
                  <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-emerald-700 shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-700 stroke-[3.5]" />
                  </span>
                  Resolved
                </span>
              ) : issue.status === 'rejected' ? (
                <span className="bg-red-600 text-white px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs border border-red-700">
                  <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-red-600 shrink-0">
                    <XCircle className="w-2.5 h-2.5 text-red-600 stroke-[3.5]" />
                  </span>
                  Rejected / Invalid
                </span>
              ) : (
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  issue.status === 'in_progress' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                  issue.status === 'escalated' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-blue-100 text-blue-800 border border-blue-300'
                }`}>
                  Status: {issue.status.replace('_', ' ')}
                </span>
              )}
            </div>
          </div>

          {/* Rejection Banner */}
          {(issue.status === 'rejected' || issue.rejectionReason) && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-1.5 text-red-900 shadow-xs">
              <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wider">
                <XCircle className="w-4 h-4 text-red-600" />
                Report Marked Invalid / Rejected & Closed
              </div>
              <p className="text-xs text-red-800 font-semibold">
                Rejection Reason: <span className="font-normal text-slate-800">{issue.rejectionReason || 'Marked invalid upon municipal inspection / duplicate / invalid location.'}</span>
              </p>
            </div>
          )}

          {/* Photo Section: Original vs Resolution Photo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                Original Citizen Report Photo
              </span>
              <div className="h-56 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center relative">
                {userUploadedPhoto ? (
                  <img
                    src={userUploadedPhoto}
                    alt="Original Citizen Report Photo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6 text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                    <span className="text-xs font-semibold">No Image Uploaded by Citizen</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Resolution Verification Photo
              </span>
              <div className="h-56 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center relative">
                {issue.resolutionPhotoUrl ? (
                  <>
                    <img
                      src={issue.resolutionPhotoUrl}
                      alt="Resolution Verified"
                      className="w-full h-full object-cover"
                    />
                    {issue.aiVerificationStatus && (
                      <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md text-white p-2.5 rounded-lg border border-slate-700 text-xs flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                          <ShieldCheck className="w-4 h-4" /> AI Verification: {issue.aiVerificationStatus}
                        </span>
                        <span className="font-mono font-bold bg-emerald-600/30 text-emerald-300 px-2 py-0.5 rounded text-[11px]">
                          Match {issue.aiVerificationScore || 98}%
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center p-6 text-slate-400">
                    <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                    <p className="text-xs font-bold text-slate-600">Pending Field Verification</p>
                    <p className="text-[11px] text-slate-400 mt-1">Resolution photo will be computer vision verified upon work completion.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description & Location Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="md:col-span-2 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Detailed Issue Description
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {issue.description}
              </p>
              {issue.voiceNoteUrl && (
                <div className="pt-2">
                  <div className="text-[10px] font-bold text-purple-700 uppercase">Attached Voice Note:</div>
                  <audio controls src={issue.voiceNoteUrl} className="w-full h-8 mt-1" />
                </div>
              )}
              {issue.nextActionDate && (
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-amber-800 uppercase">Scheduled Next Action Date:</span>
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 font-mono text-xs font-bold px-2 py-0.5 rounded-md">
                    {issue.nextActionDate}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2 border-l border-slate-200 pl-0 md:pl-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> Location Details
              </h4>
              <p className="text-xs font-semibold text-slate-900">{issue.location.address}</p>
              {issue.location.landmark && (
                <p className="text-[11px] text-slate-500">Landmark: {issue.location.landmark}</p>
              )}
              <p className="text-[11px] text-slate-500 font-mono">
                GPS: {issue.location.lat.toFixed(4)}, {issue.location.lng.toFixed(4)}
              </p>
              <div className="pt-1">
                <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                  {issue.location.ward}
                </span>
              </div>
            </div>
          </div>

          {/* SUPER ADMIN REPORT MANAGEMENT PANEL */}
          {isAdmin && (
            <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  Super Admin Platform Governance
                </h3>
                <span className="text-[10px] bg-purple-200 text-purple-900 font-bold px-2 py-0.5 rounded font-mono">
                  ADMIN AUTHORIZATION
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                {issue.status !== 'resolved' && (
                  <button
                    type="button"
                    onClick={handleCloseReportByAdmin}
                    className="bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Check className="w-4 h-4" /> Admin Close & Resolve Report
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDeleteReportByAdmin}
                  className="bg-white border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" /> Admin Delete Report
                </button>
              </div>
            </div>
          )}

          {/* RESIDENT REPORT MANAGEMENT PANEL */}
          {isOwner && !isAdmin && (
            <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-700" />
                  Manage Your Report
                </h3>
                <span className="text-[10px] bg-blue-200 text-blue-900 font-bold px-2 py-0.5 rounded">
                  Report Owner
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                {issue.status !== 'resolved' && (
                  <button
                    type="button"
                    onClick={handleCloseReportByOwner}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Check className="w-4 h-4" /> Close & Mark Solved
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDeleteReportByOwner}
                  className="bg-white border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" /> Delete Report
                </button>
              </div>
            </div>
          )}

          {/* Department Staff Operational Actions */}
          {(activeRole === 'staff' || activeRole === 'admin') && (
            <div className="bg-amber-50/80 border border-amber-200 p-4.5 rounded-xl space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
                <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-amber-700" />
                  Department Officer Operations ({issue.departmentName})
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-amber-800 font-bold font-mono bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    SLA Remaining: {issue.slaHoursRemaining} hrs
                  </span>
                </div>
              </div>

              {/* Status Change Lifecycle Toolbar */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                  Update Ticket Workflow Status
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange('acknowledged')}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                      issue.status === 'acknowledged'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    Acknowledge
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange('under_review')}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                      issue.status === 'under_review'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-white text-purple-700 border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    Under Inspection
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange('in_progress')}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                      issue.status === 'in_progress'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-amber-800 border-amber-300 hover:bg-amber-100'
                    }`}
                  >
                    Dispatch Field Team
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange('resolved')}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                      issue.status === 'resolved'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    Mark Resolved
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange('rejected')}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                      issue.status === 'rejected'
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'bg-white text-red-700 border-red-300 hover:bg-red-50'
                    }`}
                  >
                    Mark Invalid / Reject
                  </button>
                </div>
              </div>

              {/* Next Action Date Scheduler */}
              <div className="pt-3 border-t border-amber-200/80 space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Schedule Next Operational Action Date</span>
                  {issue.nextActionDate && (
                    <span className="text-[11px] font-mono text-purple-700 font-bold bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                      Current: {issue.nextActionDate}
                    </span>
                  )}
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={nextActionDateInput}
                    onChange={(e) => setNextActionDateInput(e.target.value)}
                    className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white font-mono font-medium text-slate-900 focus:ring-2 focus:ring-amber-500/20"
                  />
                  <button
                    type="button"
                    onClick={handleUpdateNextActionDate}
                    className="bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xs transition-colors"
                  >
                    Save Action Date
                  </button>
                </div>
              </div>

              {/* Resolution Photo Upload Form */}
              {issue.status !== 'resolved' && (
                <div className="pt-3 border-t border-amber-200/80 space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    Upload Resolution Evidence Photo (Preserves Citizen Original)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste Resolution / After-Action Image URL..."
                      value={resolutionPhotoInput}
                      onChange={(e) => setResolutionPhotoInput(e.target.value)}
                      className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleStatusChange('resolved')}
                      disabled={isVerifying}
                      className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-500 disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {isVerifying ? 'AI Verifying...' : 'Submit & Verify'}
                    </button>
                  </div>
                  <div className="flex gap-2 text-[11px] text-slate-500">
                    <span>Quick Sample Resolution Image:</span>
                    <button
                      type="button"
                      onClick={() => setResolutionPhotoInput('https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80')}
                      className="text-blue-600 underline font-semibold"
                    >
                      Use Clean Pavement Photo
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Timeline & Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Timeline */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Progress Timeline
              </h3>
              <div className="space-y-4 relative pl-4 border-l-2 border-slate-200">
                {issue.timeline.map((evt) => (
                  <div key={evt.id} className="relative text-xs space-y-1">
                    <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span className="font-bold text-slate-900">{evt.title}</span>
                      <span suppressHydrationWarning>{formatTime(evt.timestamp)}</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{evt.description}</p>
                    <p className="text-[10px] text-slate-400 italic">By {evt.actor} ({evt.actorRole})</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Department & Citizen Notes */}
            <div className="space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Notes & Audit Trail
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {issue.notes.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No notes added yet.</p>
                  ) : (
                    issue.notes.map((n) => (
                      <div key={n.id} className="bg-slate-100 p-2.5 rounded-lg text-xs space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                          <span>{n.author} ({n.role})</span>
                          <span suppressHydrationWarning>{formatTime(n.timestamp)}</span>
                        </div>
                        <p className="text-slate-800">{n.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add Note / Comment Input Form */}
              <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add comment or update note..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
                <button
                  type="submit"
                  className="bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" /> Post Comment
                </button>
              </form>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-800 text-xs font-bold rounded-lg hover:bg-slate-300 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
