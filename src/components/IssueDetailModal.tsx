'use client';

import React, { useState } from 'react';
import { CivicIssue, IssueStatus } from '@/lib/types';
import { useApp } from '@/context/AppContext';
import { formatDate, formatTime } from '@/lib/dateUtils';
import { 
  X, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Send, 
  ShieldCheck, 
  FileText,
  User,
  Building,
  Upload,
  Check,
  ChevronRight
} from 'lucide-react';

interface IssueDetailModalProps {
  issue: CivicIssue | null;
  onClose: () => void;
}

export function IssueDetailModal({ issue, onClose }: IssueDetailModalProps) {
  const { activeRole, user, updateIssueStatus, addNoteToIssue } = useApp();

  const [noteInput, setNoteInput] = useState('');
  const [resolutionPhotoInput, setResolutionPhotoInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!issue) return null;

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    await addNoteToIssue(issue.id, noteInput.trim());
    setNoteInput('');
  };

  const handleStatusChange = async (newStatus: IssueStatus) => {
    if (newStatus === 'resolved') {
      if (!resolutionPhotoInput) {
        alert('Please select or upload a resolution photo to verify work completion.');
        return;
      }
      setIsVerifying(true);
      const success = await updateIssueStatus(issue.id, 'resolved', resolutionPhotoInput, 'Work completed and verified by department staff.');
      setIsVerifying(false);
      if (success) {
        onClose();
      } else {
        alert('Failed to update issue status.');
      }
    } else {
      await updateIssueStatus(issue.id, newStatus, undefined, `Status updated to ${newStatus} by ${user?.name || 'Officer'}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-900">
          
          {/* Main Title & Status Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider" suppressHydrationWarning>
                  Reported by {issue.citizenName} • {formatDate(issue.reportedAt)}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                {issue.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                issue.status === 'resolved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                issue.status === 'in_progress' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                issue.status === 'escalated' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-blue-100 text-blue-800 border border-blue-300'
              }`}>
                Status: {issue.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Photo Section: Original vs Resolution Photo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                Original Citizen Report Photo
              </span>
              <div className="h-56 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
                {issue.photoUrl ? (
                  <img
                    src={issue.photoUrl}
                    alt="Original Issue"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6 text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                    <span className="text-xs font-semibold">No Image Attached</span>
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

          {/* Department Staff Operational Actions (Visible when in Staff Mode) */}
          {(activeRole === 'staff' || activeRole === 'admin') && (
            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-amber-700" />
                  Department Officer Operations ({issue.departmentName})
                </h3>
                <span className="text-[11px] text-amber-700 font-semibold font-mono">
                  SLA Remaining: {issue.slaHoursRemaining} hrs
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {issue.status === 'reported' && (
                  <button
                    onClick={() => handleStatusChange('acknowledged')}
                    className="bg-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    Acknowledge Ticket
                  </button>
                )}

                {(issue.status === 'reported' || issue.status === 'acknowledged') && (
                  <button
                    onClick={() => handleStatusChange('in_progress')}
                    className="bg-amber-600 text-white text-xs font-bold px-3.5 py-2 rounded-lg hover:bg-amber-500 transition-colors"
                  >
                    Dispatch Team (In Progress)
                  </button>
                )}
              </div>

              {/* Resolution Photo Upload Form */}
              {issue.status !== 'resolved' && (
                <div className="pt-3 border-t border-amber-200/80 space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    Upload Resolution Photo & Complete AI Verification
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste Resolution Image URL..."
                      value={resolutionPhotoInput}
                      onChange={(e) => setResolutionPhotoInput(e.target.value)}
                      className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white"
                    />
                    <button
                      onClick={() => handleStatusChange('resolved')}
                      disabled={isVerifying}
                      className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-500 disabled:opacity-50 flex items-center gap-1.5"
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

              {/* Add Note Input Form */}
              <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add note or comment..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" /> Note
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
