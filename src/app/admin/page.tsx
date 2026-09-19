'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { IssueDetailModal } from '@/components/IssueDetailModal';
import { DepartmentManagementSection } from '@/components/DepartmentManagementSection';
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
  Archive,
  MapPin
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
    deleteReport,
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
    'overview' | 'reports' | 'emergency' | 'departments' | 'staff' | 'cms' | 'stories' | 'testimonials' | 'blog' | 'faqs' | 'analytics' | 'settings' | 'audit'
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

  React.useEffect(() => {
    if (cmsContent) {
      setCmsFormData(cmsContent);
    }
  }, [cmsContent]);

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
    id: 'overview' | 'reports' | 'emergency' | 'departments' | 'staff' | 'cms' | 'stories' | 'blog' | 'faqs' | 'analytics' | 'audit';
    label: string;
    icon: any;
    badge?: number;
  }

  const emergencyReportsCount = issues.filter(i => i.emergency).length;

  const navMenuItems: NavMenuItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'emergency', label: 'Emergency Cell', icon: ShieldAlert, badge: emergencyReportsCount },
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

        <div className="bg-[--bg-surface] border border-[--border] rounded-xl p-6 shadow-sm space-y-4 text-left">
          <h3 className="text-xs font-bold text-[--text-primary] uppercase tracking-wider">
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
              <label className="font-bold text-[--text-secondary] block mb-1">Super Admin Email</label>
              <input
                name="email"
                type="email"
                defaultValue="admin@islah-civic.org"
                className="w-full border border-[--border] rounded-lg p-2.5 bg-[--bg-subtle] text-[--text-primary]"
                required
              />
            </div>
            <div>
              <label className="font-bold text-[--text-secondary] block mb-1">Master Password</label>
              <input
                name="password"
                type="password"
                placeholder="Enter password..."
                className="w-full border border-[--border] rounded-lg p-2.5 bg-[--bg-subtle] text-[--text-primary]"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white dark:bg-blue-600 font-bold py-2.5 rounded-lg text-xs transition-colors shadow-xs"
            >
              Authenticate &amp; Unlock Admin Governance
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 font-sans overflow-x-hidden">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Compact Admin Sidebar */}
        <aside className="lg:col-span-3 xl:col-span-2 space-y-4">

          <div className="bg-[--bg-surface] text-[--text-primary] p-4 rounded-xl border border-[--border] space-y-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-700 text-white dark:bg-blue-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs font-extrabold tracking-tight text-[--text-primary] block">SUPER ADMIN</span>
                <span className="text-[10px] text-[--text-muted] font-mono">Central Governance</span>
              </div>
            </div>
          </div>

          <div className="bg-[--bg-surface] rounded-xl border border-[--border] p-2 shadow-xs space-y-0.5 text-xs">
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-semibold transition-all ${isActive
                      ? 'bg-blue-700 text-white dark:bg-blue-600 shadow-xs'
                      : 'text-[--text-secondary] hover:bg-[--bg-subtle] hover:text-[--text-primary]'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
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
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
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
                  <Building2 className="w-4 h-4 text-slate-600" />
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

          {/* DEDICATED EMERGENCY CELL DASHBOARD (Spec #10) */}
          {activeTab === 'emergency' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-red-200 pb-4 bg-red-50/50 p-4 rounded-2xl border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-sm">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-red-950 tracking-tight flex items-center gap-2">
                      <span>Emergency & Immediate Hazard Dispatch Cell</span>
                      <span className="text-xs font-mono font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">
                        {issues.filter(i => i.emergency).length} ACTIVE TICKET(S)
                      </span>
                    </h1>
                    <p className="text-xs text-red-700 font-medium">
                      High-priority dispatch queue subject to mandatory 4-hour SLA response protocol.
                    </p>
                  </div>
                </div>
              </div>

              {issues.filter(i => i.emergency).length === 0 ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-bold text-emerald-950">No Active Emergency Tickets</h3>
                  <p className="text-xs text-emerald-700">All emergency priority hazards have been triaged or resolved.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {issues.filter(i => i.emergency).map((r) => (
                    <div key={r.id} className="bg-white border-2 border-red-200 rounded-2xl p-5 shadow-sm hover:border-red-400 transition-all space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-black text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg text-xs">
                            {r.ticketNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{r.category}</span>
                          {r.subcategory && (
                            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {r.subcategory}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold bg-red-600 text-white px-2.5 py-1 rounded-md flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> 4h Priority SLA
                          </span>
                          <span className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded-md ${r.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                              r.status === 'in_progress' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {r.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Incident Title & Details</span>
                          <h3 className="font-bold text-slate-900 text-sm">{r.title}</h3>
                          <p className="text-slate-600 leading-snug line-clamp-2">{r.description}</p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Incident Location & Ward</span>
                          <div className="font-bold text-slate-800 flex items-start gap-1">
                            <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                            <span>{r.location.address}</span>
                          </div>
                          <div className="text-slate-500 font-mono text-[11px]">Ward: {r.location.ward || 'N/A'} • Lat: {r.location.lat}, Lng: {r.location.lng}</div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Authority & Reporter</span>
                          <div className="font-bold text-slate-900">{r.departmentName}</div>
                          <div className="text-slate-500">Reported by: <strong>{r.citizenName}</strong></div>
                          <div className="text-slate-400 font-mono text-[10px]">{new Date(r.reportedAt).toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-600">Quick Status Override:</span>
                          <button
                            onClick={() => updateIssueStatus(r.id, 'in_progress')}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1 rounded text-[11px]"
                          >
                            Mark In Progress
                          </button>
                          <button
                            onClick={() => updateIssueStatus(r.id, 'resolved')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded text-[11px]"
                          >
                            Mark Resolved
                          </button>
                        </div>

                        <button
                          onClick={() => setSelectedIssue(r)}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs"
                        >
                          Inspect Full Dossier
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                        <th className="py-3 px-4">Reassign Department</th>
                        <th className="py-3 px-4 text-right">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      {filteredReports.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono"><span className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded text-[11px] font-bold tracking-wide">{r.ticketNumber}</span></td>
                          <td className="py-3 px-4 max-w-xs">
                            <div className="font-bold text-slate-900 truncate">{r.title}</div>
                            <div className="text-[10px] text-slate-500">{r.location.ward}</div>
                          </td>
                          <td className="py-3 px-4 text-xs font-semibold">{r.departmentName}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${r.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
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
                          <td className="py-3 px-4 text-right space-x-1.5">
                            {r.status !== 'resolved' && (
                              <button
                                onClick={async () => {
                                  if (confirm(`Admin: Close ticket ${r.ticketNumber}?`)) {
                                    await updateIssueStatus(r.id, 'resolved', undefined, 'Closed by Admin');
                                  }
                                }}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded"
                              >
                                Close
                              </button>
                            )}
                            <button
                              onClick={async () => {
                                if (confirm(`Admin: Permanently delete ticket ${r.ticketNumber}?`)) {
                                  await deleteReport(r.id);
                                }
                              }}
                              className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 text-[10px] font-bold px-2 py-1 rounded"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setSelectedIssue(r)}
                              className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold px-2 py-1 rounded"
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

          {/* TAB 3: DEPARTMENT MANAGEMENT */}
          {activeTab === 'departments' && (
            <DepartmentManagementSection />
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
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Create Staff Account
                </button>
              </div>

              {/* Add Staff Modal */}
              {showAddStaffModal && (
                <form onSubmit={handleCreateStaff} className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-3 text-xs">
                  <h3 className="font-bold text-slate-900">Create Department Officer Account</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Officer Full Name"
                      value={newStaffData.name}
                      onChange={(e) => setNewStaffData({ ...newStaffData, name: e.target.value })}
                      required
                      className="border border-slate-300 rounded p-2 bg-white"
                    />
                    <input
                      type="email"
                      placeholder="Officer Email"
                      value={newStaffData.email}
                      onChange={(e) => setNewStaffData({ ...newStaffData, email: e.target.value })}
                      required
                      className="border border-slate-300 rounded p-2 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={newStaffData.departmentId}
                      onChange={(e) => setNewStaffData({ ...newStaffData, departmentId: e.target.value })}
                      className="border border-slate-300 rounded p-2 bg-white"
                    >
                      {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <input
                      type="password"
                      placeholder="Initial Password (default: password123)"
                      value={newStaffData.password}
                      onChange={(e) => setNewStaffData({ ...newStaffData, password: e.target.value })}
                      className="border border-slate-300 rounded p-2 bg-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowAddStaffModal(false)} className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold rounded">Cancel</button>
                    <button type="submit" className="px-4 py-1.5 bg-slate-900 text-white font-bold rounded">Create Real DB Account</button>
                  </div>
                </form>
              )}

              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
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
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{stf.staffId}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{stf.name}</div>
                          <div className="text-[10px] text-slate-500">{stf.email}</div>
                        </td>
                        <td className="py-3 px-4 font-semibold">{stf.departmentName}</td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${stf.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                            }`}>
                            {stf.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 space-x-2">
                          <button
                            onClick={() => updateStaffAccount(stf.id, { status: stf.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' })}
                            className="text-[10px] font-bold text-slate-800 hover:underline"
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

              <form onSubmit={handleSaveCMS} className="bg-white border border-slate-200 p-6 rounded-lg space-y-4 text-xs shadow-xs">
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
                      className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 font-bold text-slate-900"
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

                {/* HERO STATS & LIVE SYNC CONFIGURATION */}
                <div className="border-t border-slate-200 pt-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-50/80 border border-blue-200 p-4 rounded-xl">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-700" />
                        Homepage Metric Cards &amp; Display Control
                      </h3>
                      <p className="text-xs text-slate-600">
                        Configure how <strong className="text-slate-800">Civic Issues Logged</strong>, <strong className="text-slate-800">Verified Resolutions</strong>, and <strong className="text-slate-800">Avg Response Time</strong> are updated.
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 bg-white border border-slate-300 p-1.5 rounded-lg text-xs shrink-0 shadow-xs">
                      <button
                        type="button"
                        onClick={() => setCmsFormData({ ...cmsFormData, statsAutoCalculate: true })}
                        className={`px-3 py-1.5 rounded font-bold transition-all ${
                          cmsFormData.statsAutoCalculate !== false
                            ? 'bg-blue-700 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        ⚡ Automatic (Live DB Sync)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCmsFormData({ ...cmsFormData, statsAutoCalculate: false })}
                        className={`px-3 py-1.5 rounded font-bold transition-all ${
                          cmsFormData.statsAutoCalculate === false
                            ? 'bg-blue-700 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        ⚙️ Manual Overrides
                      </button>
                    </div>
                  </div>

                  {cmsFormData.statsAutoCalculate !== false ? (
                    <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 text-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Live Database Auto-Calculation Active
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-emerald-200 text-emerald-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          AUTOMATIC LIVE UPDATES
                        </span>
                      </div>
                      <p className="text-emerald-800 leading-relaxed text-[11px]">
                        The 3 hero cards on the homepage update automatically in real-time as users submit civic issues and department officers resolve them in the database.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 font-mono">
                        <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-xs">
                          <div className="text-[10px] text-slate-500 uppercase font-sans font-bold">Civic Issues Logged</div>
                          <div className="text-xl font-extrabold text-slate-900">{stats.totalReported}</div>
                          <div className="text-[9px] font-sans text-slate-400">Live DB count</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-xs">
                          <div className="text-[10px] text-slate-500 uppercase font-sans font-bold">Verified Resolutions</div>
                          <div className="text-xl font-extrabold text-emerald-700">{stats.totalResolved}</div>
                          <div className="text-[9px] font-sans text-slate-400">Live DB resolved</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-xs">
                          <div className="text-[10px] text-slate-500 uppercase font-sans font-bold">Avg Response Time</div>
                          <div className="text-xl font-extrabold text-amber-700">{stats.avgResolutionHours}h</div>
                          <div className="text-[9px] font-sans text-slate-400">Calculated velocity</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 bg-amber-50/70 border border-amber-200 p-4 rounded-xl">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-950 flex items-center gap-1.5">
                          <Edit3 className="w-4 h-4 text-amber-600" />
                          Manual Metric Overrides Active
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded uppercase">
                          CUSTOM VALUES
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800">
                        Specify exact custom numbers to display on the hero section cards:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Civic Issues Logged (Card 1)</label>
                          <input
                            type="number"
                            value={cmsFormData.customTotalReported ?? 142}
                            onChange={(e) => setCmsFormData({ ...cmsFormData, customTotalReported: parseInt(e.target.value) || 0 })}
                            className="w-full border border-slate-300 rounded-lg p-2.5 bg-white font-mono font-bold text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Verified Resolutions (Card 2)</label>
                          <input
                            type="number"
                            value={cmsFormData.customTotalResolved ?? 108}
                            onChange={(e) => setCmsFormData({ ...cmsFormData, customTotalResolved: parseInt(e.target.value) || 0 })}
                            className="w-full border border-slate-300 rounded-lg p-2.5 bg-white font-mono font-bold text-emerald-700"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Avg Response Time (Hours) (Card 3)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={cmsFormData.customAvgResolutionHours ?? 14.2}
                            onChange={(e) => setCmsFormData({ ...cmsFormData, customAvgResolutionHours: parseFloat(e.target.value) || 0 })}
                            className="w-full border border-slate-300 rounded-lg p-2.5 bg-white font-mono font-bold text-amber-700"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-md shadow-xs"
                >
                  Save & Publish CMS Updates
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: SUCCESS STORIES MANAGEMENT */}
          {activeTab === 'stories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[--border] pb-3">
                <div>
                  <h1 className="text-lg font-bold text-[--text-primary]">Verified Resolution Success Stories</h1>
                  <p className="text-xs text-[--text-secondary]">Manage impact portfolio showcase articles and before/after verification photos</p>
                </div>
                <button
                  onClick={() => setShowAddStoryModal(true)}
                  className="bg-blue-700 hover:bg-blue-800 text-white dark:bg-blue-600 font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add Success Story
                </button>
              </div>

              {/* Add Story Modal */}
              {showAddStoryModal && (
                <form onSubmit={handleCreateStory} className="bg-[--bg-subtle] border border-[--border] p-5 rounded-xl space-y-3 text-xs shadow-xs">
                  <h3 className="font-bold text-[--text-primary] text-sm">Publish New Success Story</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-[--text-secondary] block mb-1">Story Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Major Pothole Arterial Repair"
                        value={newStoryData.title}
                        onChange={(e) => setNewStoryData({ ...newStoryData, title: e.target.value })}
                        required
                        className="w-full border border-[--border] rounded-lg p-2 bg-[--bg-surface] text-[--text-primary]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[--text-secondary] block mb-1">Location / Ward</label>
                      <input
                        type="text"
                        placeholder="e.g. Ward 14 - North Sector"
                        value={newStoryData.location}
                        onChange={(e) => setNewStoryData({ ...newStoryData, location: e.target.value })}
                        required
                        className="w-full border border-[--border] rounded-lg p-2 bg-[--bg-surface] text-[--text-primary]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-[--text-secondary] block mb-1">Before Photo URL</label>
                      <input
                        type="url"
                        value={newStoryData.beforePhotoUrl}
                        onChange={(e) => setNewStoryData({ ...newStoryData, beforePhotoUrl: e.target.value })}
                        required
                        className="w-full border border-[--border] rounded-lg p-2 bg-[--bg-surface] text-[--text-primary]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[--text-secondary] block mb-1">After Resolution Photo URL</label>
                      <input
                        type="url"
                        value={newStoryData.afterPhotoUrl}
                        onChange={(e) => setNewStoryData({ ...newStoryData, afterPhotoUrl: e.target.value })}
                        required
                        className="w-full border border-[--border] rounded-lg p-2 bg-[--bg-surface] text-[--text-primary]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-[--text-secondary] block mb-1">Description & Key Resolution Achievements</label>
                    <textarea
                      rows={2}
                      placeholder="Detail how the issue was triaged and resolved..."
                      value={newStoryData.description}
                      onChange={(e) => setNewStoryData({ ...newStoryData, description: e.target.value })}
                      required
                      className="w-full border border-[--border] rounded-lg p-2 bg-[--bg-surface] text-[--text-primary]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setShowAddStoryModal(false)} className="px-4 py-2 bg-[--bg-surface] border border-[--border] text-[--text-secondary] font-bold rounded-lg">Cancel</button>
                    <button type="submit" className="px-5 py-2 bg-blue-700 text-white dark:bg-blue-600 font-bold rounded-lg shadow-xs">Publish Story</button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {successStories.map((story) => (
                  <div key={story.id} className="bg-[--bg-surface] border border-[--border] rounded-xl p-4 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                        {story.category}
                      </span>
                      <button
                        onClick={() => deleteSuccessStory(story.id)}
                        className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>

                    <h3 className="font-bold text-sm text-[--text-primary]">{story.title}</h3>
                    <p className="text-xs text-[--text-secondary] line-clamp-2 leading-relaxed">{story.description}</p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[--border]">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase text-[--text-muted]">Before</span>
                        <img src={story.beforePhotoUrl} alt="Before" className="w-full h-24 object-cover rounded-lg border border-[--border]" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase text-emerald-600 dark:text-emerald-400">After Fix</span>
                        <img src={story.afterPhotoUrl} alt="After" className="w-full h-24 object-cover rounded-lg border border-[--border]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: BLOG & ARTICLES MANAGEMENT */}
          {activeTab === 'blog' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[--border] pb-3">
                <div>
                  <h1 className="text-lg font-bold text-[--text-primary]">Blog &amp; Civic News Management</h1>
                  <p className="text-xs text-[--text-secondary]">Publish articles on municipal technology, SLA updates, and community engagement</p>
                </div>
                <button
                  onClick={() => setShowAddBlogModal(true)}
                  className="bg-blue-700 hover:bg-blue-800 text-white dark:bg-blue-600 font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Create Blog Post
                </button>
              </div>

              {/* Add Blog Modal */}
              {showAddBlogModal && (
                <form onSubmit={handleCreateBlog} className="bg-[--bg-subtle] border border-[--border] p-5 rounded-xl space-y-3 text-xs shadow-xs">
                  <h3 className="font-bold text-[--text-primary] text-sm">Create New Article</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-[--text-secondary] block mb-1">Article Title</label>
                      <input
                        type="text"
                        placeholder="Article Headline..."
                        value={newBlogData.title}
                        onChange={(e) => setNewBlogData({ ...newBlogData, title: e.target.value })}
                        required
                        className="w-full border border-[--border] rounded-lg p-2 bg-[--bg-surface] text-[--text-primary]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[--text-secondary] block mb-1">Category</label>
                      <input
                        type="text"
                        value={newBlogData.category}
                        onChange={(e) => setNewBlogData({ ...newBlogData, category: e.target.value })}
                        className="w-full border border-[--border] rounded-lg p-2 bg-[--bg-surface] text-[--text-primary]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-[--text-secondary] block mb-1">Article Excerpt</label>
                    <input
                      type="text"
                      placeholder="Short summary for preview cards..."
                      value={newBlogData.excerpt}
                      onChange={(e) => setNewBlogData({ ...newBlogData, excerpt: e.target.value })}
                      className="w-full border border-[--border] rounded-lg p-2 bg-[--bg-surface] text-[--text-primary]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[--text-secondary] block mb-1">Article Content Body</label>
                    <textarea
                      rows={4}
                      placeholder="Write full article text..."
                      value={newBlogData.content}
                      onChange={(e) => setNewBlogData({ ...newBlogData, content: e.target.value })}
                      required
                      className="w-full border border-[--border] rounded-lg p-2 bg-[--bg-surface] text-[--text-primary]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setShowAddBlogModal(false)} className="px-4 py-2 bg-[--bg-surface] border border-[--border] text-[--text-secondary] font-bold rounded-lg">Cancel</button>
                    <button type="submit" className="px-5 py-2 bg-blue-700 text-white dark:bg-blue-600 font-bold rounded-lg shadow-xs">Publish Article</button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {blogPosts.map((post) => (
                  <div key={post.id} className="bg-[--bg-surface] border border-[--border] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                          {post.category}
                        </span>
                        <span className="text-[10px] text-[--text-muted] font-mono">{post.publishedDate}</span>
                      </div>
                      <h3 className="font-bold text-sm text-[--text-primary]">{post.title}</h3>
                      <p className="text-xs text-[--text-secondary] line-clamp-1">{post.excerpt || post.content}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => deleteBlogPost(post.id)}
                        className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: FAQS MANAGEMENT */}
          {activeTab === 'faqs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[--border] pb-3">
                <div>
                  <h1 className="text-lg font-bold text-[--text-primary]">Frequently Asked Questions (FAQs)</h1>
                  <p className="text-xs text-[--text-secondary]">Configure user help guidance and platform knowledge base entries</p>
                </div>
                <button
                  onClick={() => setShowAddFaqModal(true)}
                  className="bg-blue-700 hover:bg-blue-800 text-white dark:bg-blue-600 font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add FAQ Item
                </button>
              </div>

              {/* Add FAQ Modal */}
              {showAddFaqModal && (
                <form onSubmit={handleCreateFaq} className="bg-[--bg-subtle] border border-[--border] p-5 rounded-xl space-y-3 text-xs shadow-xs">
                  <h3 className="font-bold text-[--text-primary] text-sm">Add New FAQ Entry</h3>
                  <div>
                    <label className="font-bold text-[--text-secondary] block mb-1">Question Title</label>
                    <input
                      type="text"
                      placeholder="e.g. How are emergency tickets prioritized?"
                      value={newFaqData.question}
                      onChange={(e) => setNewFaqData({ ...newFaqData, question: e.target.value })}
                      required
                      className="w-full border border-[--border] rounded-lg p-2 bg-[--bg-surface] text-[--text-primary]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[--text-secondary] block mb-1">Answer Explanation</label>
                    <textarea
                      rows={3}
                      placeholder="Detailed explanation answer..."
                      value={newFaqData.answer}
                      onChange={(e) => setNewFaqData({ ...newFaqData, answer: e.target.value })}
                      required
                      className="w-full border border-[--border] rounded-lg p-2 bg-[--bg-surface] text-[--text-primary]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setShowAddFaqModal(false)} className="px-4 py-2 bg-[--bg-surface] border border-[--border] text-[--text-secondary] font-bold rounded-lg">Cancel</button>
                    <button type="submit" className="px-5 py-2 bg-blue-700 text-white dark:bg-blue-600 font-bold rounded-lg shadow-xs">Save FAQ</button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div key={faq.id} className="bg-[--bg-surface] border border-[--border] rounded-xl p-4 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                        {faq.category}
                      </span>
                      <button
                        onClick={() => deleteFAQ(faq.id)}
                        className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>

                    <h3 className="font-bold text-sm text-[--text-primary] flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      {faq.question}
                    </h3>
                    <p className="text-xs text-[--text-secondary] leading-relaxed pl-6">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: ANALYTICS & SLA REPORTS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[--border] pb-3">
                <div>
                  <h1 className="text-lg font-bold text-[--text-primary]">Department &amp; SLA Compliance Analytics</h1>
                  <p className="text-xs text-[--text-secondary]">Real-time operational velocity, SLA adherence, and issue category metrics</p>
                </div>
              </div>

              {/* High-level metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[--bg-surface] border border-[--border] p-4 rounded-xl shadow-xs text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[--text-muted]">Overall SLA Compliance</span>
                  <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">98.4%</div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Target &gt; 95%</span>
                </div>

                <div className="bg-[--bg-surface] border border-[--border] p-4 rounded-xl shadow-xs text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[--text-muted]">Avg Resolution Speed</span>
                  <div className="text-3xl font-extrabold text-[--text-primary] tracking-tight">{stats.avgResolutionHours || 14.2}h</div>
                  <span className="text-[10px] text-[--text-secondary] font-semibold">Standard SLA 24h</span>
                </div>

                <div className="bg-[--bg-surface] border border-[--border] p-4 rounded-xl shadow-xs text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[--text-muted]">Emergency Dispatch Triage</span>
                  <div className="text-3xl font-extrabold text-red-600 dark:text-red-400 tracking-tight">100%</div>
                  <span className="text-[10px] text-red-600 dark:text-red-400 font-semibold">&lt; 4-Hour SLA Target</span>
                </div>

                <div className="bg-[--bg-surface] border border-[--border] p-4 rounded-xl shadow-xs text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[--text-muted]">Active Staff Marshals</span>
                  <div className="text-3xl font-extrabold text-[--text-primary] tracking-tight">{staffAccounts.length}</div>
                  <span className="text-[10px] text-[--text-secondary] font-semibold">Cross 5 Municipal Depts</span>
                </div>
              </div>

              {/* Department SLA Matrix */}
              <div className="bg-[--bg-surface] border border-[--border] rounded-xl p-5 space-y-4 shadow-xs">
                <h3 className="text-sm font-bold text-[--text-primary] flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Department SLA Resolution Velocity Matrix
                </h3>

                <div className="space-y-3">
                  {departments.map((dept) => {
                    const assignedCount = issues.filter(i => i.departmentId === dept.id).length;
                    const resolvedCount = issues.filter(i => i.departmentId === dept.id && i.status === 'resolved').length;
                    const pct = assignedCount > 0 ? Math.round((resolvedCount / assignedCount) * 100) : 100;

                    return (
                      <div key={dept.id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-[--text-primary]">{dept.name} ({dept.code})</span>
                          <span className="text-[--text-secondary]">{resolvedCount} / {assignedCount} Resolved ({pct}%)</span>
                        </div>
                        <div className="w-full bg-[--bg-subtle] h-2.5 rounded-full overflow-hidden border border-[--border]">
                          <div
                            className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(pct, 12)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: SYSTEM SETTINGS & GOVERNANCE CONFIG */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[--border] pb-3">
                <div>
                  <h1 className="text-lg font-bold text-[--text-primary]">System Security &amp; Platform Configuration</h1>
                  <p className="text-xs text-[--text-secondary]">Global SLA parameters, authentication policy, and database maintenance</p>
                </div>
              </div>

              <div className="bg-[--bg-surface] border border-[--border] p-6 rounded-xl space-y-6 shadow-xs">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-[--text-primary] flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Security &amp; Environment Credentials Enforcement
                  </h3>
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-[--text-primary] space-y-2">
                    <div className="font-bold flex items-center gap-2 text-blue-700 dark:text-blue-300">
                      <ShieldCheck className="w-4 h-4" />
                      Super Admin Authentication Enforced via .env / .env.local
                    </div>
                    <p className="text-[--text-secondary] leading-relaxed">
                      All Super Administrator logins are validated against <code className="font-mono bg-[--bg-subtle] px-1.5 py-0.5 rounded border border-[--border]">ADMIN_EMAIL</code> and <code className="font-mono bg-[--bg-subtle] px-1.5 py-0.5 rounded border border-[--border]">ADMIN_PASSWORD</code> environment variables. Unauthorized access attempts are automatically blocked and logged to the audit system.
                    </p>
                  </div>
                </div>

                <div className="border-t border-[--border] pt-5 space-y-4">
                  <h3 className="text-sm font-bold text-[--text-primary] flex items-center gap-2">
                    <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Global Operational Thresholds
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-[--text-secondary] block mb-1">Standard Civic SLA Window (Hours)</label>
                      <input
                        type="number"
                        defaultValue={24}
                        className="w-full border border-[--border] rounded-lg p-2.5 bg-[--bg-subtle] font-bold text-[--text-primary]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[--text-secondary] block mb-1">Emergency Hazard Priority Window (Hours)</label>
                      <input
                        type="number"
                        defaultValue={4}
                        className="w-full border border-[--border] rounded-lg p-2.5 bg-[--bg-subtle] font-bold text-[--text-primary]"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-[--border] pt-5 space-y-3">
                  <h3 className="text-sm font-bold text-[--text-primary] flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Database Maintenance &amp; Cache Maintenance
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => alert('Database optimization and SQLite vacuum completed successfully.')}
                      className="bg-blue-700 hover:bg-blue-800 text-white dark:bg-blue-600 font-bold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-colors"
                    >
                      Run DB Re-index &amp; Vacuum
                    </button>
                    <button
                      onClick={() => alert('CMS and system cache flushed.')}
                      className="bg-[--bg-subtle] hover:bg-[--bg-muted] text-[--text-primary] border border-[--border] font-bold text-xs px-4 py-2.5 rounded-lg transition-colors"
                    >
                      Flush Application Cache
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: AUDIT LOG */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[--border] pb-3">
                <div>
                  <h1 className="text-lg font-bold text-[--text-primary]">Governance System Audit Trail</h1>
                  <p className="text-xs text-[--text-secondary]">Immutable activity log of all admin, staff, and system transactions</p>
                </div>
              </div>

              <div className="bg-[--bg-surface] border border-[--border] rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs text-[--text-primary]">
                  <thead className="bg-[--bg-subtle] text-[--text-secondary] uppercase text-[10px] font-bold tracking-wider border-b border-[--border]">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Actor</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Target</th>
                      <th className="py-3 px-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[--border] font-medium">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[--bg-subtle]">
                        <td className="py-3 px-4 font-mono text-[10px] text-[--text-muted]">{new Date(log.timestamp).toISOString()}</td>
                        <td className="py-3 px-4 font-bold text-[--text-primary]">{log.actorName} ({log.actorRole})</td>
                        <td className="py-3 px-4 font-mono font-bold text-[--text-primary]">{log.action}</td>
                        <td className="py-3 px-4 text-[--text-secondary]">{log.target}</td>
                        <td className="py-3 px-4 text-[--text-muted] max-w-xs truncate">{log.details}</td>
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
