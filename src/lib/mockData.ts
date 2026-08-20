import { 
  CivicIssue, 
  Department, 
  CivicUser, 
  StaffAccount, 
  SuccessStory, 
  Testimonial, 
  BlogPost, 
  FAQItem, 
  AuditLogEntry, 
  WebsiteCMSContent 
} from './types';

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-roads',
    name: 'Roads & Public Infrastructure',
    code: 'RPI',
    iconName: 'Construction',
    categoriesHandled: ['Roads & Potholes', 'Public Infrastructure'],
    contactEmail: 'roads@islah.gov.in',
    contactPhone: '+1-800-ROADS-01',
    slaHoursDefault: 24,
    status: 'active',
    activeTickets: 42,
    resolvedTickets: 1280,
    avgResolutionHours: 18.5,
    slaCompliancePercent: 94.2,
    leadOfficer: 'Eng. Sarah Jenkins'
  },
  {
    id: 'dept-waste',
    name: 'Sanitation & Solid Waste Management',
    code: 'SWM',
    iconName: 'Trash2',
    categoriesHandled: ['Waste & Sanitation'],
    contactEmail: 'sanitation@islah.gov.in',
    contactPhone: '+1-800-WASTE-02',
    slaHoursDefault: 12,
    status: 'active',
    activeTickets: 29,
    resolvedTickets: 2150,
    avgResolutionHours: 8.2,
    slaCompliancePercent: 97.8,
    leadOfficer: 'Director Marcus Vance'
  },
  {
    id: 'dept-electrical',
    name: 'Electrical Infrastructure & Lighting',
    code: 'EIL',
    iconName: 'Zap',
    categoriesHandled: ['Streetlights & Electrical'],
    contactEmail: 'electrical@islah.gov.in',
    contactPhone: '+1-800-LIGHTS-03',
    slaHoursDefault: 24,
    status: 'active',
    activeTickets: 18,
    resolvedTickets: 890,
    avgResolutionHours: 12.4,
    slaCompliancePercent: 96.1,
    leadOfficer: 'Supervisor Alex Rivera'
  },
  {
    id: 'dept-water',
    name: 'Water Supply & Sewage Management',
    code: 'WSS',
    iconName: 'Droplets',
    categoriesHandled: ['Water Supply', 'Drainage & Sewage'],
    contactEmail: 'water@islah.gov.in',
    contactPhone: '+1-800-WATER-04',
    slaHoursDefault: 18,
    status: 'active',
    activeTickets: 31,
    resolvedTickets: 1420,
    avgResolutionHours: 14.8,
    slaCompliancePercent: 92.5,
    leadOfficer: 'Chief Water Engineer Priya Sharma'
  },
  {
    id: 'dept-safety',
    name: 'Public Safety & Emergency Hazards',
    code: 'PSEH',
    iconName: 'AlertTriangle',
    categoriesHandled: ['Public Safety & Hazards'],
    contactEmail: 'safety@islah.gov.in',
    contactPhone: '+1-800-SAFETY-05',
    slaHoursDefault: 4,
    status: 'active',
    activeTickets: 7,
    resolvedTickets: 640,
    avgResolutionHours: 3.5,
    slaCompliancePercent: 99.1,
    leadOfficer: 'Officer David K. Miller'
  }
];

export const INITIAL_REGISTERED_CITIZENS: CivicUser[] = [
  {
    id: 'usr-101',
    name: 'Amina Al-Mansoor',
    email: 'amina.mansoor@civic.org',
    phone: '+1-555-019-2834',
    passwordHash: 'password123',
    role: 'citizen',
    status: 'ACTIVE',
    civicScore: 480,
    rankTitle: 'Civic Guardian Level 4',
    ward: 'Ward 12 — Central Metro',
    reportsSubmitted: 14,
    reportsResolved: 12,
    badges: [
      {
        id: 'bdg-1',
        title: 'First Responder',
        description: 'Submitted first verified civic issue report',
        icon: 'ShieldCheck',
        earnedAt: '2026-01-15'
      },
      {
        id: 'bdg-2',
        title: 'Road Sentinel',
        description: 'Reported 5+ hazardous pothole locations',
        icon: 'Award',
        earnedAt: '2026-03-22'
      }
    ]
  },
  {
    id: 'usr-102',
    name: 'Omar Farooq',
    email: 'omar.farooq@civic.org',
    phone: '+1-555-014-9921',
    passwordHash: 'password123',
    role: 'citizen',
    status: 'ACTIVE',
    civicScore: 240,
    rankTitle: 'Active Resident',
    ward: 'Ward 9 — East Metro',
    reportsSubmitted: 5,
    reportsResolved: 4,
    badges: []
  },
  {
    id: 'usr-103',
    name: 'Dr. Kabir Roy',
    email: 'kabir.roy@civic.org',
    phone: '+1-555-018-4412',
    passwordHash: 'password123',
    role: 'citizen',
    status: 'ACTIVE',
    civicScore: 310,
    rankTitle: 'Community Sentinel',
    ward: 'Ward 5 — North Metro',
    reportsSubmitted: 8,
    reportsResolved: 7,
    badges: []
  },
  {
    id: 'usr-104',
    name: 'Suspended Account Test',
    email: 'suspended@civic.org',
    phone: '+1-555-000-0000',
    passwordHash: 'password123',
    role: 'citizen',
    status: 'SUSPENDED',
    civicScore: 0,
    rankTitle: 'Suspended Account',
    ward: 'Ward 1',
    reportsSubmitted: 0,
    reportsResolved: 0,
    badges: []
  }
];

export const INITIAL_STAFF_ACCOUNTS: StaffAccount[] = [
  {
    id: 'stf-acct-1',
    staffId: 'STF-PW-001',
    name: 'Eng. Tariq Rahman',
    email: 'tariq.rahman@metro.gov',
    passwordHash: 'password123',
    departmentId: 'dept-roads',
    departmentName: 'Roads & Public Infrastructure',
    role: 'Department Manager',
    permissions: ['view_tickets', 'update_status', 'add_notes', 'upload_resolution', 'manage_queue', 'review_escalations'],
    status: 'ACTIVE',
    createdAt: '2026-01-10T08:00:00Z'
  },
  {
    id: 'stf-acct-2',
    staffId: 'STF-WM-002',
    name: 'Supervisor Alex Vance',
    email: 'alex.vance@metro.gov',
    passwordHash: 'password123',
    departmentId: 'dept-waste',
    departmentName: 'Sanitation & Solid Waste Management',
    role: 'Department Officer',
    permissions: ['view_tickets', 'update_status', 'add_notes', 'upload_resolution'],
    status: 'ACTIVE',
    createdAt: '2026-01-12T09:30:00Z'
  },
  {
    id: 'stf-acct-3',
    staffId: 'STF-EL-003',
    name: 'Supervisor Alex Rivera',
    email: 'alex.rivera@metro.gov',
    passwordHash: 'password123',
    departmentId: 'dept-electrical',
    departmentName: 'Electrical Infrastructure & Lighting',
    role: 'Department Officer',
    permissions: ['view_tickets', 'update_status', 'add_notes', 'upload_resolution'],
    status: 'ACTIVE',
    createdAt: '2026-02-01T11:00:00Z'
  },
  {
    id: 'stf-acct-4',
    staffId: 'STF-WS-004',
    name: 'Chief Water Eng. Priya Sharma',
    email: 'priya.sharma@metro.gov',
    passwordHash: 'password123',
    departmentId: 'dept-water',
    departmentName: 'Water Supply & Sewage Management',
    role: 'Department Manager',
    permissions: ['view_tickets', 'update_status', 'add_notes', 'upload_resolution', 'manage_queue', 'review_escalations'],
    status: 'ACTIVE',
    createdAt: '2026-02-15T10:00:00Z'
  },
  {
    id: 'stf-acct-5',
    staffId: 'STF-SH-005',
    name: 'Officer David K. Miller',
    email: 'david.miller@metro.gov',
    passwordHash: 'password123',
    departmentId: 'dept-safety',
    departmentName: 'Public Safety & Emergency Hazards',
    role: 'Department Manager',
    permissions: ['view_tickets', 'update_status', 'add_notes', 'upload_resolution', 'manage_queue', 'review_escalations'],
    status: 'ACTIVE',
    createdAt: '2026-03-01T08:00:00Z'
  }
];

export const INITIAL_SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 'ss-1',
    title: 'Market Street Sanitation Overhaul',
    category: 'Waste & Sanitation',
    departmentName: 'Sanitation & Solid Waste Management',
    location: 'Sector 4 Market Lane',
    resolvedDate: '2026-08-18',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
    description: 'Cleared an illegal dump site within 18 hours of citizen reporting and installed smart covered waste bins.',
    status: 'published'
  },
  {
    id: 'ss-2',
    title: 'Arterial Flyover Pothole Resurfacing',
    category: 'Roads & Potholes',
    departmentName: 'Roads & Public Infrastructure',
    location: 'Arterial Avenue Flyover',
    resolvedDate: '2026-08-10',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
    description: 'Hazardous deep asphalt trench resurfaced with high-durability cold mix, restoring smooth 4-lane traffic flow.',
    status: 'published'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    authorName: 'Amina Al-Mansoor',
    authorRole: 'Ward Guardian & Local Resident',
    ward: 'Ward 12',
    quote: 'ISLAH changed how our neighborhood interacts with city officials. I snapped a photo of an overflowing bin and it was cleared by the evening.',
    rating: 5,
    status: 'published',
    createdAt: '2026-08-12'
  },
  {
    id: 'test-2',
    authorName: 'Dr. Kabir Roy',
    authorRole: 'Community Medical Officer',
    ward: 'Ward 5',
    quote: 'The emergency escalation path works. An exposed electrical line near our clinic gate was secured in under 2 hours.',
    rating: 5,
    status: 'published',
    createdAt: '2026-08-14'
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'How AI Computer Vision Validates Municipal Field Repairs',
    slug: 'ai-computer-vision-municipal-repairs',
    category: 'Technology & AI',
    authorName: 'ISLAH Tech Team',
    publishedDate: '2026-08-15',
    excerpt: 'Deep dive into our dual-image embedding model that cross-verifies before and after photos to eliminate fraudulent ticket closures.',
    content: 'Civic technology platforms often suffer from false resolution reports where field crews mark tickets as resolved without completing quality work. ISLAH integrates automated visual verification that compares geometry, color spectrum, and feature keypoints to guarantee high quality civic repairs.',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    status: 'published'
  },
  {
    id: 'blog-2',
    title: 'Transforming SLA Adherence in Public Infrastructure',
    slug: 'transforming-sla-adherence-public-infrastructure',
    category: 'Civic Impact',
    authorName: 'Director Marcus Vance',
    publishedDate: '2026-08-01',
    excerpt: 'How transparent dispatch and auto-escalations reduced average civic issue resolution time from 7 days down to 14 hours.',
    content: 'Municipal responsiveness is a matter of civic trust. By equipping department officers with live GIS queues and real-time SLA countdown timers, cities can dramatically increase resolution velocity and public satisfaction.',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    status: 'published'
  }
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do I report a civic issue on ISLAH?',
    answer: 'Simply click "Report Issue", upload or capture a photo, let our AI suggest the category & auto-detect GPS coordinates, add a short description, and hit submit. You will instantly receive a unique tracking Ticket ID.',
    category: 'Reporting',
    orderIndex: 1,
    status: 'published'
  },
  {
    id: 'faq-2',
    question: 'What happens if a civic issue is dangerous or emergency?',
    answer: 'During reporting, toggle the "Emergency Hazard" switch. Emergency tickets bypass normal queue priority and trigger immediate 4-hour SLA alerts to senior department marshals.',
    category: 'Emergency',
    orderIndex: 2,
    status: 'published'
  },
  {
    id: 'faq-3',
    question: 'How does ISLAH verify that a problem was actually fixed?',
    answer: 'When staff mark a ticket as resolved, they must upload a completion photo. ISLAH runs visual verification comparing before/after photos to calculate a confidence score before public verification.',
    category: 'Verification',
    orderIndex: 3,
    status: 'published'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-1',
    timestamp: '2026-08-20T19:30:00Z',
    actorName: 'Super Admin',
    actorRole: 'admin',
    action: 'CREATE_STAFF',
    target: 'STF-SH-005 (Officer David K. Miller)',
    details: 'Assigned to Public Safety & Emergency Hazards with Department Manager role.'
  },
  {
    id: 'audit-2',
    timestamp: '2026-08-20T18:15:00Z',
    actorName: 'Eng. Tariq Rahman',
    actorRole: 'staff',
    action: 'UPDATE_STATUS',
    target: 'ISL-2026-8942',
    details: 'Status changed from acknowledged to in_progress.'
  },
  {
    id: 'audit-3',
    timestamp: '2026-08-20T15:45:00Z',
    actorName: 'Super Admin',
    actorRole: 'admin',
    action: 'UPDATE_CMS',
    target: 'Homepage Hero Headline',
    details: 'Updated tagline to "See it. Snap it. Solved."'
  }
];

export const INITIAL_CMS_CONTENT: WebsiteCMSContent = {
  heroHeadline: 'See it. Snap it.',
  heroSubheadline: 'Solved.',
  heroDescription: 'ISLAH allows citizens to report local civic problems in seconds, follow their progress in real-time, and watch issues move transparently from submission to verified resolution.',
  ctaPrimaryText: 'Report an Issue Now',
  ctaSecondaryText: 'View Live City Map',
  aboutTitle: 'Turning problems into progress.',
  aboutPhilosophyText: 'ISLAH is built on a fundamental civic premise: A problem should not end with a complaint. It should move through a transparent process toward action, accountability, and verified resolution.',
  emergencyHotline: '1-800-ISLAH-CIVIC (1-800-475-2424)',
  contactEmail: 'contact@islah.gov.in',
  footerTagline: 'Municipal Progress & Civic Transparency System'
};

export const SAMPLE_CIVIC_ISSUES: CivicIssue[] = [
  {
    id: 'iss-8942',
    ticketNumber: 'ISL-2026-8942',
    title: 'Severe Deep Pothole on Main Arterial Avenue',
    category: 'Roads & Potholes',
    description: 'Deep road cavity causing severe vehicle axle damage and forcing cars into opposing traffic lane near Central Hospital gate.',
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: '45 Arterial Avenue, Sector 4',
      landmark: 'Opposite Central Hospital Main Gate',
      ward: 'Ward 12 — Central Metro'
    },
    status: 'in_progress',
    severity: 'high',
    emergency: false,
    departmentId: 'dept-roads',
    departmentName: 'Roads & Public Infrastructure',
    reportedAt: '2026-08-18T14:32:00Z',
    updatedAt: '2026-08-19T09:15:00Z',
    slaHoursTotal: 24,
    slaHoursRemaining: 7,
    citizenId: 'usr-101',
    citizenName: 'Amina Al-Mansoor',
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    aiConfidence: 96,
    aiCategoryDetected: 'Pothole & Asphalt Structural Damage',
    notes: [
      {
        id: 'n-1',
        author: 'Dispatch System',
        role: 'system',
        text: 'Automated AI routing dispatched ticket to Roads & Public Infrastructure crew #4.',
        timestamp: '2026-08-18T14:32:15Z'
      },
      {
        id: 'n-2',
        author: 'Eng. Tariq Rahman',
        role: 'staff',
        text: 'Asphalt cold patch crew assigned for site repair at 10:00 AM.',
        timestamp: '2026-08-19T09:15:00Z'
      }
    ],
    timeline: [
      {
        id: 'tl-1',
        timestamp: '2026-08-18T14:32:00Z',
        status: 'reported',
        title: 'Report Submitted',
        description: 'Citizen captured photo & GPS coordinates',
        actor: 'Amina Al-Mansoor',
        actorRole: 'citizen'
      },
      {
        id: 'tl-2',
        timestamp: '2026-08-18T14:32:15Z',
        status: 'acknowledged',
        title: 'AI Verification & Routing',
        description: 'AI confirmed category match (96% confidence) and routed to Roads Dept.',
        actor: 'ISLAH Engine',
        actorRole: 'ai'
      },
      {
        id: 'tl-3',
        timestamp: '2026-08-19T09:15:00Z',
        status: 'in_progress',
        title: 'Work Order Dispatched',
        description: 'Field repair team dispatched with asphalt equipment.',
        actor: 'Eng. Tariq Rahman',
        actorRole: 'staff'
      }
    ],
    duplicatesCount: 3,
    upvotesCount: 18
  },
  {
    id: 'iss-8941',
    ticketNumber: 'ISL-2026-8941',
    title: 'Exposed High-Voltage Electrical Cable Near School Playground',
    category: 'Public Safety & Hazards',
    description: 'Damaged power distribution box with uninsulated live wires exposed at ground level right next to St. Jude Primary School entrance.',
    location: {
      lat: 28.6180,
      lng: 77.2150,
      address: '12 St. Jude Lane, Ward 9',
      landmark: 'Adjacent to St. Jude School Gate',
      ward: 'Ward 9 — East Metro'
    },
    status: 'escalated',
    severity: 'critical',
    emergency: true,
    departmentId: 'dept-safety',
    departmentName: 'Public Safety & Emergency Hazards',
    reportedAt: '2026-08-19T06:10:00Z',
    updatedAt: '2026-08-19T10:00:00Z',
    slaHoursTotal: 4,
    slaHoursRemaining: 0,
    citizenId: 'usr-102',
    citizenName: 'Omar Farooq',
    photoUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=80',
    aiConfidence: 98,
    aiCategoryDetected: 'Hazardous Live Electrical Exposure',
    notes: [
      {
        id: 'n-3',
        author: 'SLA Automated Service',
        role: 'system',
        text: 'Emergency SLA threshold exceeded (3 hours limit). Ticket auto-escalated to Municipal Safety Director.',
        timestamp: '2026-08-19T10:00:00Z'
      }
    ],
    timeline: [
      {
        id: 'tl-4',
        timestamp: '2026-08-19T06:10:00Z',
        status: 'reported',
        title: 'Emergency Report Flagged',
        description: 'Citizen flagged critical electrical hazard',
        actor: 'Omar Farooq',
        actorRole: 'citizen'
      },
      {
        id: 'tl-5',
        timestamp: '2026-08-19T10:00:00Z',
        status: 'escalated',
        title: 'Automatic SLA Escalation',
        description: 'High-priority notification sent directly to Chief Safety Marshal.',
        actor: 'BullMQ SLA Service',
        actorRole: 'system'
      }
    ],
    duplicatesCount: 5,
    upvotesCount: 42
  },
  {
    id: 'iss-8940',
    ticketNumber: 'ISL-2026-8940',
    title: 'Overflowing Community Garbage Dump Site',
    category: 'Waste & Sanitation',
    description: 'Uncollected municipal waste spilling over sidewalks into residential access lane, causing sanitation concern and severe odor.',
    location: {
      lat: 28.6100,
      lng: 77.2000,
      address: '78 Market Street, Block B',
      landmark: 'Near Central Vegetable Market',
      ward: 'Ward 12 — Central Metro'
    },
    status: 'resolved',
    severity: 'medium',
    emergency: false,
    departmentId: 'dept-waste',
    departmentName: 'Sanitation & Solid Waste Management',
    reportedAt: '2026-08-17T08:20:00Z',
    updatedAt: '2026-08-18T16:45:00Z',
    slaHoursTotal: 24,
    slaHoursRemaining: 0,
    citizenId: 'usr-101',
    citizenName: 'Amina Al-Mansoor',
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    resolutionPhotoUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
    aiConfidence: 94,
    aiCategoryDetected: 'Solid Waste Accumulation',
    aiVerificationScore: 99,
    aiVerificationStatus: 'Verified',
    notes: [
      {
        id: 'n-4',
        author: 'Supervisor Alex Vance',
        role: 'staff',
        text: 'Sanitation Truck #14 cleared site, disinfected bin area, and installed upgraded lid.',
        timestamp: '2026-08-18T16:45:00Z'
      }
    ],
    timeline: [
      {
        id: 'tl-6',
        timestamp: '2026-08-17T08:20:00Z',
        status: 'reported',
        title: 'Report Submitted',
        description: 'Sanitation report filed',
        actor: 'Amina Al-Mansoor',
        actorRole: 'citizen'
      },
      {
        id: 'tl-7',
        timestamp: '2026-08-18T16:45:00Z',
        status: 'resolved',
        title: 'Resolution Verified by AI',
        description: 'Sanitation team uploaded completion photo. AI cross-verification matched clean area (99% score).',
        actor: 'ISLAH Verification Service',
        actorRole: 'ai'
      }
    ],
    duplicatesCount: 1,
    upvotesCount: 24
  },
  {
    id: 'iss-8939',
    ticketNumber: 'ISL-2026-8939',
    title: 'Broken Main Streetlight Matrix at Intersection 5',
    category: 'Streetlights & Electrical',
    description: 'Four consecutive LED streetlights unlit along dark commercial strip, creating poor nighttime pedestrian visibility.',
    location: {
      lat: 28.6210,
      lng: 77.2200,
      address: 'Intersection 5, Commercial Boulevard',
      landmark: 'Opposite Metro Bank Branch',
      ward: 'Ward 5 — North Metro'
    },
    status: 'acknowledged',
    severity: 'medium',
    emergency: false,
    departmentId: 'dept-electrical',
    departmentName: 'Electrical Infrastructure & Lighting',
    reportedAt: '2026-08-19T02:15:00Z',
    updatedAt: '2026-08-19T03:00:00Z',
    slaHoursTotal: 36,
    slaHoursRemaining: 28,
    citizenId: 'usr-103',
    citizenName: 'Dr. Kabir Roy',
    photoUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    aiConfidence: 92,
    aiCategoryDetected: 'Streetlight Luminaire Failure',
    notes: [],
    timeline: [
      {
        id: 'tl-8',
        timestamp: '2026-08-19T02:15:00Z',
        status: 'reported',
        title: 'Report Submitted',
        description: 'Nighttime report captured',
        actor: 'Dr. Kabir Roy',
        actorRole: 'citizen'
      },
      {
        id: 'tl-9',
        timestamp: '2026-08-19T03:00:00Z',
        status: 'acknowledged',
        title: 'Ticket Acknowledged',
        description: 'Electrical Dept queued bucket truck crew.',
        actor: 'Supervisor Alex Rivera',
        actorRole: 'staff'
      }
    ],
    duplicatesCount: 2,
    upvotesCount: 9
  },
  {
    id: 'iss-8938',
    ticketNumber: 'ISL-2026-8938',
    title: 'Burst Water Supply Line Flooding Residential Cul-de-sac',
    category: 'Water Supply',
    description: 'Clean drinking water gushing from cracked underground municipal pipeline, wasting volume and softening adjacent road foundation.',
    location: {
      lat: 28.6050,
      lng: 77.2110,
      address: '22 Elm Street Cul-de-sac',
      landmark: 'Near Elm Community Garden',
      ward: 'Ward 12 — Central Metro'
    },
    status: 'in_progress',
    severity: 'high',
    emergency: false,
    departmentId: 'dept-water',
    departmentName: 'Water Supply & Sewage Management',
    reportedAt: '2026-08-19T05:30:00Z',
    updatedAt: '2026-08-19T08:00:00Z',
    slaHoursTotal: 12,
    slaHoursRemaining: 6,
    citizenId: 'usr-104',
    citizenName: 'Fatima Zohra',
    photoUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
    aiConfidence: 95,
    aiCategoryDetected: 'Pressurized Pipeline Leakage',
    notes: [
      {
        id: 'n-5',
        author: 'Chief Water Eng. Priya Sharma',
        role: 'staff',
        text: 'Main isolation valve shut off. Pipe replacement crew on site with excavation equipment.',
        timestamp: '2026-08-19T08:00:00Z'
      }
    ],
    timeline: [
      {
        id: 'tl-10',
        timestamp: '2026-08-19T05:30:00Z',
        status: 'reported',
        title: 'Water Leak Reported',
        description: 'High flow rate reported',
        actor: 'Fatima Zohra',
        actorRole: 'citizen'
      },
      {
        id: 'tl-11',
        timestamp: '2026-08-19T08:00:00Z',
        status: 'in_progress',
        title: 'Isolation Valve Engaged',
        description: 'Excavation and pipe replacement under way.',
        actor: 'Chief Water Eng. Priya Sharma',
        actorRole: 'staff'
      }
    ],
    duplicatesCount: 4,
    upvotesCount: 31
  }
];

export const DEMO_SAMPLE_PHOTOS = [
  {
    id: 'sample-pothole',
    title: 'Pothole & Asphalt Hazard',
    category: 'Roads & Potholes' as const,
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    detectedCategory: 'Pothole & Asphalt Damage',
    confidence: 96,
    suggestedSeverity: 'high' as const,
    suggestedDept: 'dept-roads'
  },
  {
    id: 'sample-garbage',
    title: 'Overflowing Waste Container',
    category: 'Waste & Sanitation' as const,
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    detectedCategory: 'Municipal Solid Waste Spill',
    confidence: 94,
    suggestedSeverity: 'medium' as const,
    suggestedDept: 'dept-waste'
  },
  {
    id: 'sample-light',
    title: 'Broken Streetlight Fixture',
    category: 'Streetlights & Electrical' as const,
    url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    detectedCategory: 'Streetlight & Power Failure',
    confidence: 92,
    suggestedSeverity: 'medium' as const,
    suggestedDept: 'dept-electrical'
  },
  {
    id: 'sample-water',
    title: 'Burst Water Pipe Flood',
    category: 'Water Supply' as const,
    url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
    detectedCategory: 'Water Pipeline Leakage',
    confidence: 95,
    suggestedSeverity: 'high' as const,
    suggestedDept: 'dept-water'
  }
];
