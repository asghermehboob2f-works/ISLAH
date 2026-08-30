export type IssueStatus = 'reported' | 'under_review' | 'verified' | 'assigned' | 'acknowledged' | 'in_progress' | 'resolved' | 'escalated' | 'rejected';

export type IssueSeverity = 'low' | 'medium' | 'high' | 'critical';

export type EnvironmentalSubcategory = 
  | 'Wildlife Protection'
  | 'Forest & Land Protection'
  | 'Water & Ecosystem Protection'
  | 'Environmental Pollution'
  | 'Environmental Emergencies'
  | 'Other Environmental Issue';

export type IssueCategory = 
  | 'Roads & Potholes'
  | 'Waste & Sanitation'
  | 'Garbage & Sanitation'
  | 'Streetlights & Electrical'
  | 'Drainage & Sewage'
  | 'Water Supply'
  | 'Public Infrastructure'
  | 'Public Safety & Hazards'
  | 'Environment & Wildlife'
  | 'Other';

export type UserRole = 'guest' | 'citizen' | 'staff' | 'admin';

export type AccountStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'DISABLED';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  status: IssueStatus;
  title: string;
  description: string;
  actor: string;
  actorRole: 'citizen' | 'system' | 'ai' | 'staff' | 'admin';
  mediaUrl?: string;
}

export interface CivicIssue {
  id: string;
  ticketNumber: string;
  title: string;
  category: IssueCategory;
  subcategory?: EnvironmentalSubcategory;
  customCategory?: string;
  description: string;
  voiceNoteUrl?: string;
  referenceLink?: string;
  videoUrl?: string;
  documentUrl?: string;
  reportType?: 'civic' | 'environmental';
  visibility?: 'PUBLIC' | 'PRIVATE';
  isSensitiveWildlife?: boolean;
  approxLocation?: {
    lat: number;
    lng: number;
  };
  rejectionReason?: string;
  evidenceFiles?: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
    landmark?: string;
    ward: string;
  };
  status: IssueStatus;
  severity: IssueSeverity;
  emergency: boolean;
  departmentId: string;
  departmentName: string;
  reportedAt: string;
  updatedAt: string;
  slaHoursTotal: number;
  slaHoursRemaining: number;
  citizenId: string;
  citizenName: string;
  citizenAvatar?: string;
  photoUrl: string;
  resolutionPhotoUrl?: string;
  nextActionDate?: string;
  aiConfidence: number; // 0-100
  aiCategoryDetected?: string;
  aiVerificationScore?: number; // 0-100 for resolution verification
  aiVerificationStatus?: 'Verified' | 'Needs Review' | 'Unable to Verify';
  notes: Array<{
    id: string;
    author: string;
    role: string;
    text: string;
    timestamp: string;
  }>;
  timeline: TimelineEvent[];
  duplicatesCount: number;
  upvotesCount: number;
}

export interface OtherProblemOption {
  id: string;
  title: string;
  departmentId: string;
  departmentName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  type?: 'Civic' | 'Environmental' | 'Wildlife' | 'Emergency' | 'Environmental / Wildlife';
  description?: string;
  iconName?: string;
  categoriesHandled?: string[];
  contactEmail?: string;
  email?: string;
  contactPhone?: string;
  phone?: string;
  alternatePhone?: string;
  officeLocation?: string;
  slaHoursDefault?: number;
  status: 'active' | 'inactive' | 'archived';
  activeTickets: number;
  resolvedTickets?: number;
  avgResolutionHours?: number;
  slaCompliancePercent?: number;
  leadOfficer: string;
  loginEmail?: string;
  passwordHash?: string;
}

export interface StaffAccount {
  id: string;
  staffId: string; // e.g. STF-PW-001 or STF-00124
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  departmentId: string;
  departmentName: string;
  role: 'Department Officer' | 'Department Manager';
  permissions: string[];
  status: AccountStatus;
  createdAt: string;
}

export interface UserBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface CivicUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  role: UserRole;
  status: AccountStatus;
  staffId?: string;
  departmentId?: string;
  departmentName?: string;
  permissions?: string[];
  civicScore: number;
  rankTitle: string;
  ward: string;
  reportsSubmitted: number;
  reportsResolved: number;
  badges: UserBadge[];
  createdAt?: string;
}

export type User = CivicUser;

export interface SuccessStory {
  id: string;
  title: string;
  category: IssueCategory;
  departmentName: string;
  location: string;
  resolvedDate: string;
  beforePhotoUrl: string;
  afterPhotoUrl: string;
  description: string;
  impactResult?: string;
  published?: boolean;
  status: 'published' | 'draft';
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorRole: string;
  ward: string;
  quote: string;
  rating: number;
  published?: boolean;
  status: 'published' | 'draft';
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  authorName: string;
  publishedDate: string;
  excerpt: string;
  content: string;
  coverImage: string;
  status: 'published' | 'draft';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  orderIndex: number;
  published?: boolean;
  status: 'published' | 'draft';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: 'admin' | 'staff' | 'system' | 'citizen';
  action: string;
  target: string;
  details: string;
}

export type AuditLogItem = AuditLogEntry;

export interface WebsiteCMSContent {
  heroHeadline: string;
  heroSubheadline: string;
  heroDescription: string;
  ctaPrimaryText?: string;
  ctaSecondaryText?: string;
  aboutTitle: string;
  aboutPhilosophyText: string;
  emergencyHotline: string;
  contactEmail: string;
  contactPhone?: string;
  footerTagline?: string;
}

export type CMSContent = WebsiteCMSContent;

export interface AppStats {
  totalReported: number;
  totalResolved: number;
  avgResolutionHours: number;
  avgResolutionTimeHours?: number;
  slaCompliancePercent?: number;
  emergencyCount: number;
  activeDepartmentsCount: number;
  activeStaffCount: number;
  citizensRegisteredCount: number;
}
