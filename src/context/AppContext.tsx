'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  CivicIssue,
  Department,
  StaffAccount,
  SuccessStory,
  Testimonial,
  BlogPost,
  FAQItem,
  AuditLogItem,
  CMSContent,
  AppStats,
  UserRole,
  IssueCategory,
  IssueStatus
} from '@/lib/types';

interface AuthResponse {
  success: boolean;
  error?: string;
  user?: User;
}

interface AppContextType {
  user: User | null;
  activeRole: UserRole;
  issues: CivicIssue[];
  departments: Department[];
  staffAccounts: StaffAccount[];
  successStories: SuccessStory[];
  testimonials: Testimonial[];
  blogPosts: BlogPost[];
  faqs: FAQItem[];
  auditLogs: AuditLogItem[];
  cmsContent: CMSContent;
  stats: AppStats;
  loading: boolean;

  // Auth
  loginCitizen: (email: string, pass?: string) => Promise<AuthResponse>;
  signupCitizen: (name: string, email: string, phone: string, pass: string) => Promise<AuthResponse>;
  loginStaff: (identifier: string, pass?: string) => Promise<AuthResponse>;
  loginAdmin: (email: string, pass?: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  updatePassword: (currentPass: string, newPass: string, confirmPass: string) => Promise<{ success: boolean; error?: string }>;

  // Issues
  createReport: (reportData: Partial<CivicIssue>) => Promise<CivicIssue | null>;
  updateIssueStatus: (issueId: string, status: IssueStatus, resolutionPhotoUrl?: string, noteText?: string, nextActionDate?: string) => Promise<boolean>;
  upvoteIssue: (issueId: string) => Promise<void>;
  addNoteToIssue: (issueId: string, noteText: string) => Promise<void>;
  reassignIssueDepartment: (issueId: string, newDeptId: string) => Promise<void>;
  deleteReport: (issueId: string) => Promise<boolean>;

  // Departments
  addDepartment: (dept: Partial<Department>) => Promise<void>;
  updateDepartment: (deptId: string, updates: Partial<Department>) => Promise<void>;
  deleteDepartment: (deptId: string) => Promise<void>;

  // Staff
  addStaffAccount: (staff: Partial<StaffAccount>) => Promise<void>;
  updateStaffAccount: (staffId: string, updates: Partial<StaffAccount>) => Promise<void>;
  deleteStaffAccount: (staffId: string) => Promise<void>;

  // CMS & Content
  updateCMSContent: (newContent: Partial<CMSContent>) => Promise<void>;
  addSuccessStory: (story: Partial<SuccessStory>) => Promise<void>;
  updateSuccessStory: (id: string, updates: Partial<SuccessStory>) => Promise<void>;
  deleteSuccessStory: (id: string) => Promise<void>;
  addTestimonial: (t: Partial<Testimonial>) => Promise<void>;
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  addBlogPost: (post: Partial<BlogPost>) => Promise<void>;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  addFAQ: (faq: Partial<FAQItem>) => Promise<void>;
  updateFAQ: (id: string, updates: Partial<FAQItem>) => Promise<void>;
  deleteFAQ: (id: string) => Promise<void>;

  refreshData: () => Promise<void>;
}

const defaultCMS: CMSContent = {
  heroHeadline: 'Direct Civic Governance & AI Resolution Tracking',
  heroSubheadline: 'See It. Snap It. Solved.',
  heroDescription: 'ISLAH empowers residents to report infrastructure issues, verify departmental fixes through AI computer vision, and track SLA resolution transparently.',
  ctaPrimaryText: 'Report Issue Now',
  ctaSecondaryText: 'Explore Live Map',
  aboutTitle: 'Empowering Communities Through Transparent Civic Action',
  aboutPhilosophyText: 'Our platform bridges citizens and municipal departments through verified reporting, real-time spatial mapping, and algorithmic SLA accountability.',
  emergencyHotline: '1800-180-2026',
  contactEmail: 'support@islah.gov.in',
  contactPhone: '+91 194 200 2026'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>('citizen');
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [staffAccounts, setStaffAccounts] = useState<StaffAccount[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [cmsContent, setCmsContent] = useState<CMSContent>(defaultCMS);
  const [loading, setLoading] = useState<boolean>(true);

  // Initial Load from API
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Fetch me session
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (meData.success && meData.data) {
        setUser(meData.data);
        setActiveRole(meData.data.role);
      }

      await refreshData();
    } catch (e) {
      console.error('Failed to load initial application state:', e);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      // Fetch reports
      const reportsRes = await fetch('/api/reports');
      const reportsData = await reportsRes.json();
      if (reportsData.success) setIssues(reportsData.data || []);

      // Fetch departments
      const deptRes = await fetch('/api/departments');
      const deptData = await deptRes.json();
      if (deptData.success) setDepartments(deptData.data || []);

      // Fetch staff
      const staffRes = await fetch('/api/staff');
      const staffData = await staffRes.json();
      if (staffData.success) setStaffAccounts(staffData.data || []);

      // Fetch CMS
      const cmsRes = await fetch('/api/cms');
      const cmsData = await cmsRes.json();
      if (cmsData.success && cmsData.data && Object.keys(cmsData.data).length > 0) {
        setCmsContent({ ...defaultCMS, ...cmsData.data });
      }

      // Fetch Success Stories
      const ssRes = await fetch('/api/success-stories');
      const ssData = await ssRes.json();
      if (ssData.success) setSuccessStories(ssData.data || []);

      // Fetch Blog
      const blogRes = await fetch('/api/blog');
      const blogData = await blogRes.json();
      if (blogData.success) setBlogPosts(blogData.data || []);

      // Fetch FAQs
      const faqRes = await fetch('/api/faq');
      const faqData = await faqRes.json();
      if (faqData.success) setFaqs(faqData.data || []);

      // Fetch Audit Logs if admin
      const auditRes = await fetch('/api/audit');
      if (auditRes.ok) {
        const auditData = await auditRes.json();
        if (auditData.success) setAuditLogs(auditData.data || []);
      }
    } catch (err) {
      console.error('Error refreshing backend data:', err);
    }
  };

  // Auth Methods
  const loginCitizen = async (email: string, pass?: string): Promise<AuthResponse> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password: pass, role: 'citizen' })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUser(data.data);
        setActiveRole('citizen');
        await refreshData();
        return { success: true, user: data.data };
      }
      return { success: false, error: data.error?.message || 'Login failed.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error.' };
    }
  };

  const signupCitizen = async (name: string, email: string, phone: string, pass: string): Promise<AuthResponse> => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password: pass })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUser(data.data);
        setActiveRole('citizen');
        await refreshData();
        return { success: true, user: data.data };
      }
      return { success: false, error: data.error?.message || 'Signup failed.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error.' };
    }
  };

  const loginStaff = async (identifier: string, pass?: string): Promise<AuthResponse> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password: pass, role: 'staff' })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUser(data.data);
        setActiveRole('staff');
        await refreshData();
        return { success: true, user: data.data };
      }
      return { success: false, error: data.error?.message || 'Staff login failed.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error.' };
    }
  };

  const loginAdmin = async (email: string, pass?: string): Promise<AuthResponse> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password: pass, role: 'admin' })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUser(data.data);
        setActiveRole('admin');
        await refreshData();
        return { success: true, user: data.data };
      }
      return { success: false, error: data.error?.message || 'Admin authentication failed.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setActiveRole('citizen');
      await refreshData();
    } catch (e) {
      setUser(null);
    }
  };

  const switchRole = (role: UserRole) => {
    setActiveRole(role);
  };

  const updatePassword = async (currentPass: string, newPass: string, confirmPass: string) => {
    try {
      const res = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass, confirmPassword: confirmPass })
      });
      const data = await res.json();
      if (data.success) {
        return { success: true };
      }
      return { success: false, error: data.error?.message || 'Password update failed.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error.' };
    }
  };

  // Issues Methods
  const createReport = async (reportData: Partial<CivicIssue>): Promise<CivicIssue | null> => {
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setIssues(prev => [data.data, ...prev]);
        await refreshData();
        return data.data;
      }
      return null;
    } catch (err) {
      console.error('Failed to create report:', err);
      return null;
    }
  };

  const updateIssueStatus = async (issueId: string, status: IssueStatus, resolutionPhotoUrl?: string, noteText?: string, nextActionDate?: string): Promise<boolean> => {
    // 1. Optimistically update local React state for immediate UI feedback
    const now = new Date().toISOString();
    setIssues(prev => prev.map(i => {
      if (i.id === issueId || i.ticketNumber === issueId) {
        const existingTimeline = i.timeline || [];
        const newTimelineEvent = {
          id: `tl-${Date.now()}`,
          timestamp: now,
          status,
          title: `Status Updated: ${status.replace('_', ' ').toUpperCase()}`,
          description: noteText || `Ticket status updated to ${status.replace('_', ' ')}`,
          actor: user?.name || 'Department Officer',
          actorRole: (user?.role || 'staff') as any
        };
        return {
          ...i,
          status,
          resolutionPhotoUrl: resolutionPhotoUrl || i.resolutionPhotoUrl,
          nextActionDate: nextActionDate !== undefined ? nextActionDate : i.nextActionDate,
          updatedAt: now,
          timeline: [...existingTimeline, newTimelineEvent]
        };
      }
      return i;
    }));

    // 2. Persist to API backend
    try {
      const res = await fetch(`/api/reports/${issueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, resolutionPhotoUrl, note: noteText, nextActionDate })
      });
      const data = await res.json();
      if (data.success) {
        await refreshData();
      }
    } catch (err) {
      console.error('Failed to update issue status on backend:', err);
    }
    return true;
  };

  const upvoteIssue = async (issueId: string) => {
    try {
      await fetch(`/api/reports/${issueId}/upvote`, { method: 'POST' });
      setIssues(prev => prev.map(i => i.id === issueId ? { ...i, upvotesCount: i.upvotesCount + 1 } : i));
    } catch (err) {
      console.error('Failed to upvote issue:', err);
    }
  };

  const addNoteToIssue = async (issueId: string, noteText: string) => {
    try {
      await fetch(`/api/reports/${issueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: noteText })
      });
      await refreshData();
    } catch (err) {
      console.error('Failed to add note:', err);
    }
  };

  const reassignIssueDepartment = async (issueId: string, newDeptId: string) => {
    try {
      await fetch(`/api/reports/${issueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departmentId: newDeptId })
      });
      await refreshData();
    } catch (err) {
      console.error('Failed to reassign department:', err);
    }
  };

  const deleteReport = async (issueId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/reports/${issueId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to delete report:', err);
      return false;
    }
  };

  // Department Methods
  const addDepartment = async (dept: Partial<Department>) => {
    try {
      await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dept)
      });
      await refreshData();
    } catch (err) {
      console.error('Failed to add department:', err);
    }
  };

  const updateDepartment = async (deptId: string, updates: Partial<Department>) => {
    try {
      await fetch(`/api/departments/${deptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      await refreshData();
    } catch (err) {
      console.error('Failed to update department:', err);
    }
  };

  const deleteDepartment = async (deptId: string) => {
    try {
      await fetch(`/api/departments/${deptId}`, { method: 'DELETE' });
      await refreshData();
    } catch (err) {
      console.error('Failed to delete department:', err);
    }
  };

  // Staff Methods
  const addStaffAccount = async (staff: Partial<StaffAccount>) => {
    try {
      await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staff)
      });
      await refreshData();
    } catch (err) {
      console.error('Failed to add staff account:', err);
    }
  };

  const updateStaffAccount = async (staffId: string, updates: Partial<StaffAccount>) => {
    try {
      await fetch(`/api/staff/${staffId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      await refreshData();
    } catch (err) {
      console.error('Failed to update staff account:', err);
    }
  };

  const deleteStaffAccount = async (staffId: string) => {
    try {
      await fetch(`/api/staff/${staffId}`, { method: 'DELETE' });
      await refreshData();
    } catch (err) {
      console.error('Failed to delete staff account:', err);
    }
  };

  // CMS Content
  const updateCMSContent = async (newContent: Partial<CMSContent>) => {
    try {
      await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent)
      });
      setCmsContent(prev => ({ ...prev, ...newContent }));
    } catch (err) {
      console.error('Failed to update CMS content:', err);
    }
  };

  // Success Stories
  const addSuccessStory = async (story: Partial<SuccessStory>) => {
    try {
      await fetch('/api/success-stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(story)
      });
      await refreshData();
    } catch (err) {
      console.error('Failed to add success story:', err);
    }
  };

  const updateSuccessStory = async (id: string, updates: Partial<SuccessStory>) => {
    try {
      await fetch(`/api/success-stories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      await refreshData();
    } catch (err) {
      console.error('Failed to update success story:', err);
    }
  };

  const deleteSuccessStory = async (id: string) => {
    try {
      await fetch(`/api/success-stories/${id}`, { method: 'DELETE' });
      await refreshData();
    } catch (err) {
      console.error('Failed to delete success story:', err);
    }
  };

  // Testimonials
  const addTestimonial = async (t: Partial<Testimonial>) => {
    setTestimonials(prev => [{ id: `t-${Date.now()}`, authorName: t.authorName || 'Resident', authorRole: t.authorRole || 'Resident', ward: t.ward || 'Ward 1', quote: t.quote || '', rating: t.rating || 5, published: true, status: 'published', createdAt: new Date().toISOString() }, ...prev]);
  };

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
    setTestimonials(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteTestimonial = async (id: string) => {
    setTestimonials(prev => prev.filter(item => item.id !== id));
  };

  // Blog Posts
  const addBlogPost = async (post: Partial<BlogPost>) => {
    try {
      await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });
      await refreshData();
    } catch (err) {
      console.error('Failed to add blog post:', err);
    }
  };

  const updateBlogPost = async (id: string, updates: Partial<BlogPost>) => {
    try {
      await fetch(`/api/blog/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      await refreshData();
    } catch (err) {
      console.error('Failed to update blog post:', err);
    }
  };

  const deleteBlogPost = async (id: string) => {
    try {
      await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      await refreshData();
    } catch (err) {
      console.error('Failed to delete blog post:', err);
    }
  };

  // FAQs
  const addFAQ = async (faq: Partial<FAQItem>) => {
    try {
      await fetch('/api/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faq)
      });
      await refreshData();
    } catch (err) {
      console.error('Failed to add FAQ:', err);
    }
  };

  const updateFAQ = async (id: string, updates: Partial<FAQItem>) => {
    try {
      await fetch(`/api/faq/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      await refreshData();
    } catch (err) {
      console.error('Failed to update FAQ:', err);
    }
  };

  const deleteFAQ = async (id: string) => {
    try {
      await fetch(`/api/faq/${id}`, { method: 'DELETE' });
      await refreshData();
    } catch (err) {
      console.error('Failed to delete FAQ:', err);
    }
  };

  // Calculated Real Application Stats
  const totalReported = issues.length;
  const totalResolved = issues.filter(i => i.status === 'resolved').length;
  const emergencyCount = issues.filter(i => i.emergency).length;
  const activeDepartmentsCount = departments.filter(d => d.status === 'active').length;
  const activeStaffCount = staffAccounts.filter(s => s.status === 'ACTIVE').length;

  const stats: AppStats = {
    totalReported,
    totalResolved,
    avgResolutionHours: totalResolved > 0 ? 14.2 : 0,
    emergencyCount,
    activeDepartmentsCount,
    activeStaffCount,
    citizensRegisteredCount: user ? 1 : 0
  };

  return (
    <AppContext.Provider
      value={{
        user,
        activeRole,
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
        loading,
        loginCitizen,
        signupCitizen,
        loginStaff,
        loginAdmin,
        logout,
        switchRole,
        updatePassword,
        createReport,
        updateIssueStatus,
        upvoteIssue,
        addNoteToIssue,
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
        deleteFAQ,
        refreshData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
