'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { IssueDetailModal } from '@/components/IssueDetailModal';
import { CivicIssue, Department, StaffAccount, SuccessStory, Testimonial, BlogPost, FAQItem, IssueCategory, UserRole } from '@/lib/types';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  FileText, 
  Building2, 
  Users, 
  Globe, 
  CheckCircle2, 
  MessageSquareQuote, 
  BookOpen, 
  HelpCircle, 
  BarChart3, 
  Settings, 
  ShieldAlert, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  AlertTriangle,
  Clock,
  Briefcase,
  KeyRound,
  Filter,
  RefreshCw,
  Lock,
  ChevronRight,
  Archive
} from 'lucide-react';

export default function AdminPage() {
  const { 
    user, 
    activeRole,
    loginAdmin,
    issues, 
    departments, 
    staffAccounts, 
    successStories, 
    testimonials, 
    blogPosts, 
    faqs, 
    auditLogs, 
    cmsContent,
    stats,
    updateIssueStatus,
    reassignIssueDepartment,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    addStaffAccount,
    updateStaffAccount,
    deleteStaffAccount,
    updateCMSContent,
    addSuccessStory,
    updateSuccessStory,
    deleteSuccessStory,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    addFAQ,
    updateFAQ,
    deleteFAQ
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'reports' | 'departments' | 'staff' | 'cms' | 'stories' | 'testimonials' | 'blog' | 'faqs' | 'analytics' | 'settings' | 'audit'
  >('overview');

  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);

  // Forms modal states
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [newDeptData, setNewDeptData] = useState({
    name: '',
    code: '',
    contactEmail: '',
    contactPhone: '',
    slaHoursDefault: 24,
    leadOfficer: '',
    status: 'active' as const
  });

  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffData, setNewStaffData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    departmentId: departments[0]?.id || 'dept-roads',
    role: 'Department Officer' as const,
    permissions: ['view_tickets', 'update_status', 'add_notes', 'upload_resolution'],
    status: 'ACTIVE' as const
  });

  const [cmsFormData, setCmsFormData] = useState(cmsContent);
  const [cmsSavedNotice, setCmsSavedNotice] = useState(false);

  // Content Add Modals
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  const [newStoryData, setNewStoryData] = useState({
    title: '',
    category: 'Roads & Potholes' as IssueCategory,
    departmentName: 'Roads & Public Infrastructure',
    location: '',
    resolvedDate: new Date().toISOString().split('T')[0],
    beforePhotoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
    description: '',
    impactResult: ''
  });

  const [showAddBlogModal, setShowAddBlogModal] = useState(false);
  const [newBlogData, setNewBlogData] = useState({
    title: '',
    slug: '',
    category: 'Technology & AI',
    authorName: 'ISLAH Editorial',
    publishedDate: new Date().toISOString().split('T')[0],
    excerpt: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    status: 'published' as const
  });

  const [showAddFaqModal, setShowAddFaqModal] = useState(false);
  const [newFaqData, setNewFaqData] = useState({
    question: '',
    answer: '',
    category: 'General',
    orderIndex: faqs.length + 1
  });

  // Filters for Reports tab
  const [reportSearch, setReportSearch] = useState('');
  const [reportDeptFilter, setReportDeptFilter] = useState('all');
  const [reportStatusFilter, setReportStatusFilter] = useState('all');

  const filteredReports = issues.filter((iss) => {
    if (reportDeptFilter !== 'all' && iss.departmentId !== reportDeptFilter) return false;
    if (reportStatusFilter !== 'all' && iss.status !== reportStatusFilter) return false;
    if (reportSearch) {
      const q = reportSearch.toLowerCase();
      return iss.ticketNumber.toLowerCase().includes(q) || iss.title.toLowerCase().includes(q) || (iss.location.ward || '').toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptData.name || !newDeptData.code) return;
    await addDepartment(newDeptData);
    setShowAddDeptModal(false);
    setNewDeptData({
      name: '',
      code: '',
      contactEmail: '',
      contactPhone: '',
      slaHoursDefault: 24,
      leadOfficer: '',
      status: 'active'
    });
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffData.name || !newStaffData.email) return;
    await addStaffAccount(newStaffData);
    setShowAddStaffModal(false);
    setNewStaffData({
      name: '',
      email: '',
      phone: '',
      password: '',
      departmentId: departments[0]?.id || 'dept-roads',
      role: 'Department Officer',
      permissions: ['view_tickets', 'update_status', 'add_notes', 'upload_resolution'],
      status: 'ACTIVE'
    });
  };

  const handleSaveCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCMSContent(cmsFormData);
    setCmsSavedNotice(true);
    setTimeout(() => setCmsSavedNotice(false), 3000);
  };

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryData.title) return;
    await addSuccessStory(newStoryData);
    setShowAddStoryModal(false);
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogData.title || !newBlogData.content) return;
    await addBlogPost(newBlogData);
    setShowAddBlogModal(false);
  };

  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqData.question || !newFaqData.answer) return;
    await addFAQ(newFaqData);
    setShowAddFaqModal(false);
  };

  interface NavMenuItem {
    id: 'overview' | 'reports' | 'departments' | 'staff' | 'cms' | 'stories' | 'blog' | 'faqs' | 'analytics' | 'audit';
    label: string;
    icon: any;
    badge?: number;
  }

  const navMenuItems: NavMenuItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'reports', label: 'All Reports', icon: FileText, badge: issues.length },
    { id: 'departments', label: 'Departments', icon: Building2, badge: departments.length },
    { id: 'staff', label: 'Staff Management', icon: Users, badge: staffAccounts.length },
    { id: 'cms', label: 'Website Content', icon: Globe },
    { id: 'stories', label: 'Success Stories', icon: CheckCircle2, badge: successStories.length },
    { id: 'blog', label: 'Blog & Articles', icon: BookOpen, badge: blogPosts.length },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle, badge: faqs.length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'audit', label: 'Audit Log', icon: ShieldCheck, badge: auditLogs.length },
  ];

  if (!user || user.role !== 'admin' || activeRole !== 'admin') {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-20 text-center space-y-6 font-sans">
        <div className="w-16 h-16 rounded-2xl bg-red-950 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto shadow-lg">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider">
            403 Forbidden Access
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Super Admin Governance Portal
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            This protected route is restricted to authorized platform Super Administrators.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 text-left">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Super Admin Authentication
          </h3>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const target = e.target as any;
              const email = target.email.value;
              const pass = target.password.value;
              const res = await loginAdmin(email, pass);
              if (!res.success) {
                alert(res.error || 'Invalid administrator credentials');
              }
            }}
            className="space-y-3 text-xs"
          >
            <div>
              <label className="font-bold text-slate-700 block mb-1">Admin Email</label>
              <input
                name="email"
                type="email"
                placeholder="admin@islah.gov.in"
                required
                className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 font-mono text-xs focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Governance Key / Password</label>
              <input
                name="password"
                type="password"
                placeholder="Enter password"
                required
                className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 text-xs focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl shadow-md text-xs transition-all"
            >
              Authenticate & Unlock Admin Governance
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 font-sans">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Compact Admin Sidebar */}
        <aside className="lg:col-span-3 xl:col-span-2 space-y-4">
          
          <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs font-extrabold tracking-tight text-white block">SUPER ADMIN</span>
                <span className="text-[10px] text-purple-300 font-mono">Central Governance</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-xs space-y-0.5 text-xs">
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-900 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-purple-300' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isActive ? 'bg-purple-800 text-purple-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-9 xl:col-span-10 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Governance System Overview</h1>
                  <p className="text-xs text-slate-500">Live operational metrics, active SLA counts, and system status</p>
                </div>
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Database Connected</span>
                </div>
              </div>

              {/* High-level Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total Reports</span>
                  <div className="text-2xl font-black text-slate-900 font-mono mt-1">{stats.totalReported}</div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Resolved Solved</span>
                  <div className="text-2xl font-black text-emerald-600 font-mono mt-1">{stats.totalResolved}</div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Emergency Hazards</span>
                  <div className="text-2xl font-black text-red-600 font-mono mt-1">{stats.emergencyCount}</div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Departments</span>
                  <div className="text-2xl font-black text-slate-900 font-mono mt-1">{stats.activeDepartmentsCount}</div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Staff Accounts</span>
                  <div className="text-2xl font-black text-slate-900 font-mono mt-1">{stats.activeStaffCount}</div>
                </div>
              </div>

              {/* Department SLA Health Grid */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-600" />
                  Department SLA Operational Performance
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departments.map((dept) => (
                    <div key={dept.id} className="border border-slate-200 p-4 rounded-xl space-y-2 bg-slate-50/50">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{dept.name}</span>
                        <span className="text-[10px] font-mono font-bold bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">{dept.code}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-slate-500">Active Work Queue:</span>
                        <span className="font-bold font-mono text-amber-600">{dept.activeTickets} tickets</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Lead Officer:</span>
                        <span className="font-bold text-slate-800">{dept.leadOfficer}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REPORTS MANAGEMENT */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h1 className="text-lg font-bold text-slate-900">All Master Civic Reports</h1>
                  <p className="text-xs text-slate-500">Inspect lifecycle, reassign departments, override status</p>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white border border-slate-200 p-3 rounded-xl flex flex-wrap gap-3 text-xs">
                <input
                  type="text"
                  placeholder="Search Ticket ID or ward..."
                  value={reportSearch}
                  onChange={(e) => setReportSearch(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 w-56 focus:outline-none"
                />

                <select
                  value={reportDeptFilter}
                  onChange={(e) => setReportDeptFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 font-semibold text-slate-800"
                >
                  <option value="all">All Departments</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>

                <select
                  value={reportStatusFilter}
                  onChange={(e) => setReportStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 font-semibold text-slate-800"
                >
                  <option value="all">All Statuses</option>
                  <option value="reported">Reported</option>
                  <option value="acknowledged">Acknowledged</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="escalated">Escalated</option>
                </select>
              </div>

              {/* Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-900 text-slate-300 uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Ticket</th>
                        <th className="py-3 px-4">Title & Ward</th>
                        <th className="py-3 px-4">Assigned Dept</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Reassign / Override</th>
                        <th className="py-3 px-4">Inspect</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      {filteredReports.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">{r.ticketNumber}</td>
                          <td className="py-3 px-4 max-w-xs">
                            <div className="font-bold text-slate-900 truncate">{r.title}</div>
                            <div className="text-[10px] text-slate-500">{r.location.ward}</div>
                          </td>
                          <td className="py-3 px-4 text-xs font-semibold">{r.departmentName}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              r.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                              r.status === 'in_progress' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 space-x-1">
                            <select
                              value={r.departmentId}
                              onChange={(e) => reassignIssueDepartment(r.id, e.target.value)}
                              className="text-[10px] border border-slate-300 rounded px-1.5 py-1 bg-slate-50 font-semibold"
                            >
                              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => setSelectedIssue(r)}
                              className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold px-2.5 py-1 rounded"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: DEPARTMENTS (SAFE DELETION / ARCHIVE SUPPORT) */}
          {activeTab === 'departments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h1 className="text-lg font-bold text-slate-900">Department Management</h1>
                  <p className="text-xs text-slate-500">Safe deletion rule: archived if historical tickets exist</p>
                </div>
                <button
                  onClick={() => setShowAddDeptModal(true)}
                  className="bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Create Department
                </button>
              </div>

              {/* Add Dept Modal */}
              {showAddDeptModal && (
                <form onSubmit={handleCreateDept} className="bg-purple-50 border border-purple-200 p-4 rounded-xl space-y-3 text-xs">
                  <h3 className="font-bold text-purple-900">New Municipal Department</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Department Name"
                      value={newDeptData.name}
                      onChange={(e) => setNewDeptData({ ...newDeptData, name: e.target.value })}
                      required
                      className="border border-purple-300 rounded p-2 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Code (e.g. PWD-RD)"
                      value={newDeptData.code}
                      onChange={(e) => setNewDeptData({ ...newDeptData, code: e.target.value })}
                      required
                      className="border border-purple-300 rounded p-2 bg-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowAddDeptModal(false)} className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold rounded">Cancel</button>
                    <button type="submit" className="px-4 py-1.5 bg-purple-700 text-white font-bold rounded">Save Department</button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departments.map((dept) => (
                  <div key={dept.id} className="bg-white border border-slate-200 p-5 rounded-xl space-y-3 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                          {dept.code}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-1">{dept.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          dept.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {dept.status.toUpperCase()}
                        </span>
                        <button
                          onClick={() => deleteDepartment(dept.id)}
                          title="Safe Delete / Archive Department"
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs space-y-1 text-slate-600">
                      <div><strong>Lead Officer:</strong> {dept.leadOfficer}</div>
                      <div><strong>Contact Email:</strong> {dept.contactEmail || dept.email}</div>
                      <div><strong>Active Tickets:</strong> {dept.activeTickets}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: STAFF MANAGEMENT */}
          {activeTab === 'staff' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h1 className="text-lg font-bold text-slate-900">Admin Staff Management</h1>
                  <p className="text-xs text-slate-500">Create real database accounts for department officers</p>
                </div>
                <button
                  onClick={() => setShowAddStaffModal(true)}
                  className="bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Create Staff Account
                </button>
              </div>

              {/* Add Staff Modal */}
              {showAddStaffModal && (
                <form onSubmit={handleCreateStaff} className="bg-purple-50 border border-purple-200 p-4 rounded-xl space-y-3 text-xs">
                  <h3 className="font-bold text-purple-900">Create Department Officer Account</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Officer Full Name"
                      value={newStaffData.name}
                      onChange={(e) => setNewStaffData({ ...newStaffData, name: e.target.value })}
                      required
                      className="border border-purple-300 rounded p-2 bg-white"
                    />
                    <input
                      type="email"
                      placeholder="Officer Email"
                      value={newStaffData.email}
                      onChange={(e) => setNewStaffData({ ...newStaffData, email: e.target.value })}
                      required
                      className="border border-purple-300 rounded p-2 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={newStaffData.departmentId}
                      onChange={(e) => setNewStaffData({ ...newStaffData, departmentId: e.target.value })}
                      className="border border-purple-300 rounded p-2 bg-white"
                    >
                      {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <input
                      type="password"
                      placeholder="Initial Password (default: password123)"
                      value={newStaffData.password}
                      onChange={(e) => setNewStaffData({ ...newStaffData, password: e.target.value })}
                      className="border border-purple-300 rounded p-2 bg-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowAddStaffModal(false)} className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold rounded">Cancel</button>
                    <button type="submit" className="px-4 py-1.5 bg-purple-700 text-white font-bold rounded">Create Real DB Account</button>
                  </div>
                </form>
              )}

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-900 text-slate-300 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Staff ID</th>
                      <th className="py-3 px-4">Name & Email</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {staffAccounts.map((stf) => (
                      <tr key={stf.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-purple-700">{stf.staffId}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{stf.name}</div>
                          <div className="text-[10px] text-slate-500">{stf.email}</div>
                        </td>
                        <td className="py-3 px-4 font-semibold">{stf.departmentName}</td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            stf.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {stf.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 space-x-2">
                          <button
                            onClick={() => updateStaffAccount(stf.id, { status: stf.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' })}
                            className="text-[10px] font-bold text-purple-700 hover:underline"
                          >
                            Toggle Access
                          </button>
                          <button
                            onClick={() => deleteStaffAccount(stf.id)}
                            className="text-[10px] font-bold text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: WEBSITE CONTENT (CMS) */}
          {activeTab === 'cms' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h1 className="text-lg font-bold text-slate-900">Website Content Management System (CMS)</h1>
                  <p className="text-xs text-slate-500">Edit hero headline, subheadline, philosophy, and emergency hotline</p>
                </div>
                {cmsSavedNotice && (
                  <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1 rounded">
                    ✓ Content Updated Live!
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveCMS} className="bg-white border border-slate-200 p-6 rounded-xl space-y-4 text-xs shadow-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Homepage Hero Headline</label>
                    <input
                      type="text"
                      value={cmsFormData.heroHeadline}
                      onChange={(e) => setCmsFormData({ ...cmsFormData, heroHeadline: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Subheadline Tagline</label>
                    <input
                      type="text"
                      value={cmsFormData.heroSubheadline}
                      onChange={(e) => setCmsFormData({ ...cmsFormData, heroSubheadline: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 font-bold text-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hero Supporting Description</label>
                  <textarea
                    rows={2}
                    value={cmsFormData.heroDescription}
                    onChange={(e) => setCmsFormData({ ...cmsFormData, heroDescription: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">About Title</label>
                    <input
                      type="text"
                      value={cmsFormData.aboutTitle}
                      onChange={(e) => setCmsFormData({ ...cmsFormData, aboutTitle: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Emergency Toll-Free Hotline</label>
                    <input
                      type="text"
                      value={cmsFormData.emergencyHotline}
                      onChange={(e) => setCmsFormData({ ...cmsFormData, emergencyHotline: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-sm"
                >
                  Save & Publish CMS Updates
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: AUDIT LOG */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h1 className="text-lg font-bold text-slate-900">Governance System Audit Trail</h1>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-900 text-slate-300 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Actor</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Target</th>
                      <th className="py-3 px-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono text-[10px] text-slate-500">{new Date(log.timestamp).toISOString()}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{log.actorName} ({log.actorRole})</td>
                        <td className="py-3 px-4 font-mono font-bold text-purple-700">{log.action}</td>
                        <td className="py-3 px-4 text-slate-800">{log.target}</td>
                        <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />

    </div>
  );
}
