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
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 space-y-6 font-sans">

      {/* Staff Identity & Operational Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded font-mono uppercase">
              Department Operational Dashboard
            </span>
            {user?.staffId && (
              <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded">
                Staff ID: {user.staffId}
              </span>
            )}
            {staffDepartment && (
              <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-semibold px-2.5 py-0.5 rounded">
                {staffDepartment.name}
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-amber-400" />
            Department Work Queue & Field Dispatch
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Logged in as <strong className="text-slate-200">{user?.name || 'Department Officer'}</strong> ({user?.rankTitle || 'Department Officer'}).
            Department isolation active: viewing tickets assigned to {staffDepartment ? staffDepartment.name : 'assigned municipal department'}.
          </p>
        </div>

        {/* Operational Metrics Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
          <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700/80 text-center">
            <div className="text-lg font-bold font-mono text-amber-400">
              {filteredTickets.filter(i => i.status === 'reported' || i.status === 'in_progress').length}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Pending Work</div>
          </div>
          <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700/80 text-center">
            <div className="text-lg font-bold font-mono text-red-400">
              {filteredTickets.filter(i => i.emergency || i.status === 'escalated').length}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Emergency SLA</div>
          </div>
          <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700/80 text-center">
            <div className="text-lg font-bold font-mono text-emerald-400">
              {filteredTickets.filter(i => i.status === 'resolved').length}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Verified Solved</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Department {isStaffUser && staffDeptId && <span className="text-purple-700 font-extrabold">(Assigned Only)</span>}
            </label>
            <select
              value={selectedDept}
              disabled={Boolean(isStaffUser && staffDeptId && staffDeptId !== 'dept-all')}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-1.5 bg-slate-50 focus:bg-white font-semibold text-slate-800 disabled:opacity-80 disabled:bg-slate-100 cursor-not-allowed"
            >
              {(!isStaffUser || !staffDeptId) && <option value="all">All Departments ({departments.length})</option>}
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-1.5 bg-slate-50 focus:bg-white font-semibold text-slate-800"
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
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Severity</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-1.5 bg-slate-50 focus:bg-white font-semibold text-slate-800"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical (Emergency)</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ticket ID or Ward..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 bg-slate-50 focus:bg-white"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

        </div>
      </div>

      {/* Operational Ticket Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-900 text-slate-300 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Category & Title</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Severity / SLA</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                    No active tickets available for this department.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className={`hover:bg-slate-50 transition-colors ${ticket.emergency ? 'bg-red-50/50' : ''
                      }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {ticket.ticketNumber}
                      {ticket.emergency && (
                        <span className="block text-[9px] text-red-600 font-extrabold uppercase">Emergency</span>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 truncate">{ticket.title}</div>
                      <div className="text-[10px] text-slate-500 truncate">{ticket.location.address}</div>
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-slate-800">
                      {ticket.departmentName}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${ticket.severity === 'critical' ? 'bg-red-600 text-white' :
                          ticket.severity === 'high' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                        {ticket.severity}
                      </span>
                      <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                        {ticket.slaHoursRemaining}h remaining
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${ticket.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                          ticket.status === 'in_progress' ? 'bg-amber-100 text-amber-800' :
                            ticket.status === 'escalated' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedIssue(ticket)}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors"
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
