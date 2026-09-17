'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { IssueDetailModal } from '@/components/IssueDetailModal';
import { CivicIssue } from '@/lib/types';
import {
  Briefcase,
  Search,
  Eye,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Building,
  ShieldAlert,
  BarChart3
} from 'lucide-react';

export default function DepartmentDashboardPage() {
  const { user, activeRole, issues, departments } = useApp();

  const isStaffUser = user?.role === 'staff' || activeRole === 'staff';
  const staffDeptId = user?.departmentId;

  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);

  useEffect(() => {
    if (isStaffUser && staffDeptId && staffDeptId !== 'dept-all') {
      setSelectedDept(staffDeptId);
    }
  }, [isStaffUser, staffDeptId]);

  const filteredTickets = issues.filter((ticket) => {
    if (selectedDept !== 'all' && ticket.departmentId !== selectedDept) return false;
    if (statusFilter !== 'all' && ticket.status !== statusFilter) return false;
    if (severityFilter !== 'all' && ticket.severity !== severityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchNumber = ticket.ticketNumber.toLowerCase().includes(q);
      const matchTitle = ticket.title.toLowerCase().includes(q);
      const matchWard = ticket.location.ward.toLowerCase().includes(q);
      if (!matchNumber && !matchTitle && !matchWard) return false;
    }
    return true;
  });

  const staffDepartment = departments.find((d) => d.id === staffDeptId);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 space-y-6 font-sans">

      {/* Staff Identity & Operational Header */}
      <div className="bg-[--bg-surface] text-[--text-primary] rounded-xl p-6 sm:p-8 border border-[--border] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded font-mono uppercase">
              Department Operational Dashboard
            </span>
            {user?.staffId && (
              <span className="bg-[--bg-subtle] text-[--text-secondary] border border-[--border] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded">
                Staff ID: {user.staffId}
              </span>
            )}
            {staffDepartment && (
              <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-[10px] font-bold px-2.5 py-0.5 rounded">
                {staffDepartment.name}
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-[--text-primary] flex items-center gap-2.5 tracking-tight">
            <Briefcase className="w-6 h-6 text-amber-500" />
            Department Work Queue &amp; Field Dispatch
          </h1>
          <p className="text-xs text-[--text-secondary] max-w-xl leading-relaxed">
            Logged in as <strong className="text-[--text-primary] font-semibold">{user?.name || 'Department Officer'}</strong> ({user?.rankTitle || 'Department Officer'}).
            Department isolation active: viewing tickets assigned to {staffDepartment ? staffDepartment.name : 'assigned municipal department'}.
          </p>
        </div>

        {/* Operational Metrics Cards */}
        <div className="grid grid-cols-3 gap-3 shrink-0">
          <div className="bg-[--bg-subtle] p-3.5 rounded-xl border border-[--border] text-center min-w-[100px]">
            <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {filteredTickets.filter(i => i.status === 'reported' || i.status === 'in_progress').length}
            </div>
            <div className="text-[10px] font-bold text-[--text-secondary] uppercase tracking-wider mt-0.5">Active Queue</div>
          </div>

          <div className="bg-[--bg-subtle] p-3.5 rounded-xl border border-[--border] text-center min-w-[100px]">
            <div className="text-xl font-bold font-mono text-red-600 dark:text-red-400">
              {filteredTickets.filter(i => i.emergency || i.severity === 'critical').length}
            </div>
            <div className="text-[10px] font-bold text-[--text-secondary] uppercase tracking-wider mt-0.5">Emergency</div>
          </div>

          <div className="bg-[--bg-subtle] p-3.5 rounded-xl border border-[--border] text-center min-w-[100px]">
            <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {filteredTickets.filter(i => i.status === 'resolved').length}
            </div>
            <div className="text-[10px] font-bold text-[--text-secondary] uppercase tracking-wider mt-0.5">Solved</div>
          </div>
        </div>
      </div>

      {/* Filter and Operational Triage Toolbar */}
      <div className="bg-[--bg-surface] rounded-xl border border-[--border] p-4 space-y-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[--text-secondary] block mb-1">
              Department Jurisdiction
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              disabled={isStaffUser && Boolean(staffDeptId) && staffDeptId !== 'dept-all'}
              className="w-full text-xs border border-[--border] rounded-lg px-3 py-2 bg-[--bg-subtle] font-semibold text-[--text-primary] disabled:opacity-80 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-[--ring]"
            >
              {(!isStaffUser || !staffDeptId) && <option value="all">All Departments ({departments.length})</option>}
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[--text-secondary] block mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs border border-[--border] rounded-lg px-3 py-2 bg-[--bg-subtle] font-semibold text-[--text-primary] focus:outline-none focus:ring-1 focus:ring-[--ring]"
            >
              <option value="all">All Statuses</option>
              <option value="reported">Reported</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="escalated">Escalated</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[--text-secondary] block mb-1">Severity</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full text-xs border border-[--border] rounded-lg px-3 py-2 bg-[--bg-subtle] font-semibold text-[--text-primary] focus:outline-none focus:ring-1 focus:ring-[--ring]"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical (Emergency)</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[--text-secondary] block mb-1">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ticket ID or Ward..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs border border-[--border] rounded-lg pl-8 pr-3 py-2 bg-[--bg-subtle] text-[--text-primary] placeholder-[--text-muted] focus:outline-none focus:ring-1 focus:ring-[--ring]"
              />
              <Search className="w-3.5 h-3.5 text-[--text-muted] absolute left-2.5 top-3" />
            </div>
          </div>

        </div>
      </div>

      {/* Operational Ticket Data Table */}
      <div className="bg-[--bg-surface] rounded-xl border border-[--border] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[--text-primary]">
            <thead className="bg-[--bg-subtle] text-[--text-secondary] uppercase text-[10px] font-bold tracking-wider border-b border-[--border]">
              <tr>
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Category &amp; Title</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Severity / SLA</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[--border] font-medium">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[--text-muted] italic">
                    No active tickets available for this department.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className={`hover:bg-[--bg-subtle] transition-colors ${ticket.emergency ? 'bg-red-50/40 dark:bg-red-950/20' : ''
                      }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[--text-primary]">
                      {ticket.ticketNumber}
                      {ticket.emergency && (
                        <span className="block text-[9px] text-red-600 dark:text-red-400 font-extrabold uppercase">Emergency</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-[--text-primary] truncate">{ticket.title}</div>
                      <div className="text-[10px] text-[--text-secondary] truncate">{ticket.location.address}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-[--text-secondary]">
                      {ticket.departmentName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${ticket.severity === 'critical' ? 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-950 dark:text-red-300' :
                        ticket.severity === 'high' ? 'bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-950 dark:text-orange-300' : 'bg-[--bg-subtle] text-[--text-secondary] border border-[--border]'
                        }`}>
                        {ticket.severity}
                      </span>
                      <span className="block text-[10px] text-[--text-muted] font-mono mt-0.5">
                        {ticket.slaHoursRemaining}h remaining
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`status-badge status-${ticket.status}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => setSelectedIssue(ticket)}
                        className="bg-blue-700 hover:bg-blue-800 text-white dark:bg-blue-600 text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" /> Manage Ticket
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />

    </div>
  );
}
