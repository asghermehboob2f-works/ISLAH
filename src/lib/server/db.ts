// @ts-ignore
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure uploads directory exists
const uploadsPhotosDir = path.join(process.cwd(), 'public', 'uploads', 'photos');
const uploadsAudioDir = path.join(process.cwd(), 'public', 'uploads', 'audio');

if (!fs.existsSync(uploadsPhotosDir)) {
  fs.mkdirSync(uploadsPhotosDir, { recursive: true });
}
if (!fs.existsSync(uploadsAudioDir)) {
  fs.mkdirSync(uploadsAudioDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'islah.db');
let dbInstance: any = null;

export function getDb(): any {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(dbPath);
    dbInstance.exec('PRAGMA foreign_keys = ON;');
    dbInstance.exec('PRAGMA journal_mode = WAL;');
    initTables(dbInstance);
  }
  return dbInstance;
}

export function hashPassword(password: string): string {
  const salt = process.env.AUTH_SECRET || 'islah_platform_secure_salt_2026';
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

function initTables(db: any) {
  // Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'citizen',
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      civic_score INTEGER DEFAULT 100,
      rank_title TEXT DEFAULT 'Verified Resident',
      ward TEXT DEFAULT 'Municipal Division',
      reports_submitted INTEGER DEFAULT 0,
      reports_resolved INTEGER DEFAULT 0,
      badges_json TEXT DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Departments Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS departments (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      contact TEXT,
      categories_json TEXT NOT NULL,
      sla_hours_default INTEGER DEFAULT 24,
      lead_officer TEXT,
      active_tickets INTEGER DEFAULT 0,
      resolved_tickets INTEGER DEFAULT 0,
      avg_resolution_hours REAL DEFAULT 12.0,
      sla_compliance_percent REAL DEFAULT 100.0,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL
    );
  `);

  // Staff Accounts Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS staff_accounts (
      id TEXT PRIMARY KEY,
      staff_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Department Officer',
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      department_id TEXT NOT NULL,
      department_name TEXT NOT NULL,
      permissions_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      last_login TEXT
    );
  `);

  // Issues / Reports Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS issues (
      id TEXT PRIMARY KEY,
      ticket_number TEXT UNIQUE NOT NULL,
      citizen_id TEXT NOT NULL,
      citizen_name TEXT NOT NULL,
      citizen_email TEXT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      custom_category TEXT,
      address TEXT NOT NULL,
      landmark TEXT,
      ward TEXT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      severity TEXT NOT NULL DEFAULT 'high',
      emergency INTEGER DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'reported',
      photo_url TEXT,
      resolution_photo_url TEXT,
      voice_note_url TEXT,
      visibility TEXT NOT NULL DEFAULT 'PUBLIC',
      upvotes_count INTEGER DEFAULT 1,
      duplicates_count INTEGER DEFAULT 0,
      department_id TEXT NOT NULL,
      department_name TEXT NOT NULL,
      sla_hours_total INTEGER DEFAULT 24,
      sla_hours_remaining INTEGER DEFAULT 24,
      ai_confidence INTEGER DEFAULT 95,
      ai_verification_status TEXT,
      ai_verification_score INTEGER,
      subcategory TEXT,
      is_sensitive_wildlife INTEGER DEFAULT 0,
      approx_latitude REAL,
      approx_longitude REAL,
      rejection_reason TEXT,
      evidence_files_json TEXT DEFAULT '[]',
      timeline_json TEXT NOT NULL,
      notes_json TEXT NOT NULL DEFAULT '[]',
      reported_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Backwards-compatible schema migrations for existing databases
  try { db.exec(`ALTER TABLE issues ADD COLUMN subcategory TEXT;`); } catch (e) {}
  try { db.exec(`ALTER TABLE issues ADD COLUMN is_sensitive_wildlife INTEGER DEFAULT 0;`); } catch (e) {}
  try { db.exec(`ALTER TABLE issues ADD COLUMN approx_latitude REAL;`); } catch (e) {}
  try { db.exec(`ALTER TABLE issues ADD COLUMN approx_longitude REAL;`); } catch (e) {}
  try { db.exec(`ALTER TABLE issues ADD COLUMN rejection_reason TEXT;`); } catch (e) {}
  try { db.exec(`ALTER TABLE issues ADD COLUMN evidence_files_json TEXT DEFAULT '[]';`); } catch (e) {}
  try { db.exec(`ALTER TABLE issues ADD COLUMN reference_link TEXT;`); } catch (e) {}
  try { db.exec(`ALTER TABLE issues ADD COLUMN video_url TEXT;`); } catch (e) {}
  try { db.exec(`ALTER TABLE issues ADD COLUMN document_url TEXT;`); } catch (e) {}
  try { db.exec(`ALTER TABLE issues ADD COLUMN report_type TEXT;`); } catch (e) {}
  try { db.exec(`ALTER TABLE issues ADD COLUMN next_action_date TEXT;`); } catch (e) {}

  // Departments schema migrations
  try { db.exec(`ALTER TABLE departments ADD COLUMN type TEXT DEFAULT 'Civic';`); } catch (e) {}
  try { db.exec(`ALTER TABLE departments ADD COLUMN description TEXT;`); } catch (e) {}
  try { db.exec(`ALTER TABLE departments ADD COLUMN alternate_contact TEXT;`); } catch (e) {}
  try { db.exec(`ALTER TABLE departments ADD COLUMN office_location TEXT;`); } catch (e) {}
  try { db.exec(`ALTER TABLE departments ADD COLUMN login_email TEXT;`); } catch (e) {}
  try { db.exec(`ALTER TABLE departments ADD COLUMN password_hash TEXT;`); } catch (e) {}
  try { db.exec(`ALTER TABLE departments ADD COLUMN updated_at TEXT;`); } catch (e) {}

  // Other Problems Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS other_problems (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      department_id TEXT NOT NULL,
      department_name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // CMS Content Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS cms_content (
      section_key TEXT PRIMARY KEY,
      content_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Success Stories Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS success_stories (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      department_name TEXT NOT NULL,
      location TEXT NOT NULL,
      resolved_date TEXT NOT NULL,
      before_photo_url TEXT NOT NULL,
      after_photo_url TEXT NOT NULL,
      description TEXT NOT NULL,
      impact_result TEXT,
      published INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    );
  `);

  // Blog Posts Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      author_name TEXT NOT NULL,
      published_date TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      cover_image TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'published',
      created_at TEXT NOT NULL
    );
  `);

  // FAQs Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS faqs (
      id TEXT PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'General',
      display_order INTEGER DEFAULT 1,
      published INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    );
  `);

  // Testimonials Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      author_name TEXT NOT NULL,
      author_role TEXT NOT NULL,
      ward TEXT NOT NULL,
      quote TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      published INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    );
  `);

  // Audit Logs Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      actor_name TEXT NOT NULL,
      actor_role TEXT NOT NULL,
      action TEXT NOT NULL,
      target TEXT NOT NULL,
      details TEXT NOT NULL
    );
  `);

  // Seed default Super Admin user if not existing
  seedDefaults(db);
}

function seedDefaults(db: any) {
  const adminEmail = (process.env.INITIAL_ADMIN_EMAIL || 'admin@islah.gov.in').toLowerCase();
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'AdminMasterPassword2026!';

  const adminQuery = db.prepare('SELECT id FROM users WHERE email = ?');
  const existingAdmin = adminQuery.get(adminEmail);

  if (!existingAdmin) {
    const adminId = 'usr-super-admin-001';
    const now = new Date().toISOString();
    const passHash = hashPassword(adminPassword);

    db.prepare(`
      INSERT INTO users (id, name, email, phone, password_hash, role, status, civic_score, rank_title, ward, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      adminId,
      'Super Admin',
      adminEmail,
      '+91 194 200 0000',
      passHash,
      'admin',
      'ACTIVE',
      9999,
      'Platform Super Administrator',
      'Central Governance',
      now,
      now
    );
  }

  // Seed default core departments if none exist
  const deptCountQuery = db.prepare('SELECT COUNT(*) as count FROM departments');
  const deptCount = (deptCountQuery.get() as { count: number }).count;

  if (deptCount === 0) {
    const now = new Date().toISOString();
    const defaultDepts = [
      {
        id: 'dept-roads',
        name: 'Roads & Public Infrastructure',
        code: 'PWD-RD',
        email: 'roads@islah.gov.in',
        contact: '+91 194 245 1001',
        categories_json: JSON.stringify(['Roads & Potholes', 'Infrastructure']),
        sla_hours_default: 24,
        lead_officer: 'Eng. Tariq Ahmad',
        status: 'active',
        created_at: now
      },
      {
        id: 'dept-sanitation',
        name: 'Waste Management & Sanitation',
        code: 'SMC-SAN',
        email: 'sanitation@islah.gov.in',
        contact: '+91 194 245 1002',
        categories_json: JSON.stringify(['Waste & Sanitation', 'Garbage']),
        sla_hours_default: 12,
        lead_officer: 'Officer Shabir Malik',
        status: 'active',
        created_at: now
      },
      {
        id: 'dept-electrical',
        name: 'Street Lighting & Power Grid',
        code: 'PDD-ELEC',
        email: 'power@islah.gov.in',
        contact: '+91 194 245 1003',
        categories_json: JSON.stringify(['Streetlights & Electrical', 'Streetlight']),
        sla_hours_default: 18,
        lead_officer: 'Eng. Farooq Shah',
        status: 'active',
        created_at: now
      },
      {
        id: 'dept-water',
        name: 'Water Supply & Sewerage Board',
        code: 'PHE-WTR',
        email: 'water@islah.gov.in',
        contact: '+91 194 245 1004',
        categories_json: JSON.stringify(['Water Supply', 'Drainage & Sewage', 'Drainage', 'Water']),
        sla_hours_default: 24,
        lead_officer: 'Officer Bilal Lone',
        status: 'active',
        created_at: now
      },
      {
        id: 'dept-safety',
        name: 'Public Safety & Disaster Cell',
        code: 'DISAST-SAF',
        email: 'safety@islah.gov.in',
        contact: '+91 194 245 1005',
        categories_json: JSON.stringify(['Public Safety & Hazards', 'Emergency', 'Other']),
        sla_hours_default: 4,
        lead_officer: 'Director Gulzar Wani',
        status: 'active',
        created_at: now
      },
      {
        id: 'dept-forest-wildlife',
        name: 'Forest & Wildlife Protection Department',
        code: 'FWD-PROT',
        email: 'wildlife@islah.gov.in',
        contact: '+91 194 245 2001',
        categories_json: JSON.stringify(['Environment & Wildlife', 'Wildlife Protection', 'Forest & Land Protection']),
        sla_hours_default: 12,
        lead_officer: 'Conservator Javaid Mir',
        status: 'active',
        created_at: now
      },
      {
        id: 'dept-pollution-control',
        name: 'State Pollution Control Board',
        code: 'SPCB-ENV',
        email: 'pollution@islah.gov.in',
        contact: '+91 194 245 2002',
        categories_json: JSON.stringify(['Water & Ecosystem Protection', 'Environmental Pollution']),
        sla_hours_default: 18,
        lead_officer: 'Officer Dr. Nasir Bhatt',
        status: 'active',
        created_at: now
      },
      {
        id: 'dept-eco-disaster',
        name: 'Environmental Emergency Cell',
        code: 'EER-CELL',
        email: 'ecoemergency@islah.gov.in',
        contact: '+91 194 245 2003',
        categories_json: JSON.stringify(['Environmental Emergencies']),
        sla_hours_default: 2,
        lead_officer: 'Chief Coordinator Irfan Sheikh',
        status: 'active',
        created_at: now
      }
    ];

    const insertDept = db.prepare(`
      INSERT INTO departments (id, name, code, email, contact, categories_json, sla_hours_default, lead_officer, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const d of defaultDepts) {
      insertDept.run(d.id, d.name, d.code, d.email, d.contact, d.categories_json, d.sla_hours_default, d.lead_officer, d.status, d.created_at);
    }
  } else {
    // Ensure environmental departments exist even if standard DB was previously seeded
    const envDeptCheck = db.prepare('SELECT id FROM departments WHERE id = ?');
    const insertDept = db.prepare(`
      INSERT OR IGNORE INTO departments (id, name, code, email, contact, categories_json, sla_hours_default, lead_officer, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();
    const envDepts = [
      {
        id: 'dept-forest-wildlife',
        name: 'Forest & Wildlife Protection Department',
        code: 'FWD-PROT',
        email: 'wildlife@islah.gov.in',
        contact: '+91 194 245 2001',
        categories_json: JSON.stringify(['Environment & Wildlife', 'Wildlife Protection', 'Forest & Land Protection']),
        sla_hours_default: 12,
        lead_officer: 'Conservator Javaid Mir',
        status: 'active',
        created_at: now
      },
      {
        id: 'dept-pollution-control',
        name: 'State Pollution Control Board',
        code: 'SPCB-ENV',
        email: 'pollution@islah.gov.in',
        contact: '+91 194 245 2002',
        categories_json: JSON.stringify(['Water & Ecosystem Protection', 'Environmental Pollution']),
        sla_hours_default: 18,
        lead_officer: 'Officer Dr. Nasir Bhatt',
        status: 'active',
        created_at: now
      },
      {
        id: 'dept-eco-disaster',
        name: 'Environmental Emergency Cell',
        code: 'EER-CELL',
        email: 'ecoemergency@islah.gov.in',
        contact: '+91 194 245 2003',
        categories_json: JSON.stringify(['Environmental Emergencies']),
        sla_hours_default: 2,
        lead_officer: 'Chief Coordinator Irfan Sheikh',
        status: 'active',
        created_at: now
      }
    ];

    for (const d of envDepts) {
      if (!envDeptCheck.get(d.id)) {
        insertDept.run(d.id, d.name, d.code, d.email, d.contact, d.categories_json, d.sla_hours_default, d.lead_officer, d.status, d.created_at);
      }
    }
  }

  // Seed default CMS content if none exists
  const cmsQuery = db.prepare('SELECT COUNT(*) as count FROM cms_content');
  const cmsCount = (cmsQuery.get() as { count: number }).count;

  if (cmsCount === 0) {
    const now = new Date().toISOString();
    const initialCMS = {
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

    db.prepare(`
      INSERT INTO cms_content (section_key, content_json, updated_at)
      VALUES ('main', ?, ?)
    `).run(JSON.stringify(initialCMS), now);
  }

  // Seed default FAQs if none exist
  const faqCountQuery = db.prepare('SELECT COUNT(*) as count FROM faqs');
  const faqCount = (faqCountQuery.get() as { count: number }).count;

  if (faqCount === 0) {
    const now = new Date().toISOString();
    const initialFaqs = [
      {
        id: 'faq-1',
        question: 'How does ISLAH verify resolved civic issues?',
        answer: 'When a field team uploads a resolution photo, ISLAH AI computer vision compares the before and after states to calculate a verification confidence score.',
        category: 'Verification & AI',
        display_order: 1,
        created_at: now
      },
      {
        id: 'faq-2',
        question: 'What happens when I mark a report as Private?',
        answer: 'Private reports are strictly hidden from public maps, feeds, and searches. They are only accessible by you and authorized department personnel.',
        category: 'Privacy',
        display_order: 2,
        created_at: now
      },
      {
        id: 'faq-3',
        question: 'How do Emergency reports work?',
        answer: 'Emergency flags immediately prioritize tickets at the top of department queues with an expedited 4-hour SLA window.',
        category: 'Emergency',
        display_order: 3,
        created_at: now
      }
    ];

    const insertFaq = db.prepare(`
      INSERT INTO faqs (id, question, answer, category, display_order, published, created_at)
      VALUES (?, ?, ?, ?, ?, 1, ?)
    `);

    for (const f of initialFaqs) {
      insertFaq.run(f.id, f.question, f.answer, f.category, f.display_order, f.created_at);
    }
  }

  // Seed default Other Problem options if none exist
  const otherQuery = db.prepare('SELECT COUNT(*) as count FROM other_problems');
  const otherCount = (otherQuery.get() as { count: number }).count;

  if (otherCount === 0) {
    const now = new Date().toISOString();
    const defaultOtherOptions = [
      { id: 'oth-1', title: 'Stray Animal / Cattle Nuisance', deptId: 'dept-sanitation', deptName: 'Waste Management & Sanitation' },
      { id: 'oth-2', title: 'Unauthorized Banners & Illegal Hoardings', deptId: 'dept-roads', deptName: 'Roads & Public Infrastructure' },
      { id: 'oth-3', title: 'Late Night Noise Pollution / Loudspeakers', deptId: 'dept-safety', deptName: 'Public Safety & Disaster Cell' },
      { id: 'oth-4', title: 'Damaged Public Park Equipment / Playground Hazard', deptId: 'dept-roads', deptName: 'Roads & Public Infrastructure' },
      { id: 'oth-5', title: 'Illegal Footpath / Sidewalk Encroachment', deptId: 'dept-roads', deptName: 'Roads & Public Infrastructure' },
      { id: 'oth-6', title: 'Dead Animal Carcass Removal Alert', deptId: 'dept-sanitation', deptName: 'Waste Management & Sanitation' },
      { id: 'oth-7', title: 'Damaged Street Signboard or Traffic Sign', deptId: 'dept-roads', deptName: 'Roads & Public Infrastructure' },
      { id: 'oth-8', title: 'Fallen Tree Branch / Blocked Pathway', deptId: 'dept-forest-wildlife', deptName: 'Forest & Wildlife Protection Department' },
      { id: 'oth-9', title: 'Damaged Public Bus Stop Shelter', deptId: 'dept-roads', deptName: 'Roads & Public Infrastructure' },
      { id: 'oth-10', title: 'Open or Broken Manhole Cover Hazard', deptId: 'dept-water', deptName: 'Water Supply & Sewerage Board' },
      { id: 'oth-11', title: 'Severe Alley Waterlogging / Overflowing Drain', deptId: 'dept-water', deptName: 'Water Supply & Sewerage Board' },
      { id: 'oth-12', title: 'Illegal Commercial Chemical / Plastic Waste Dumping', deptId: 'dept-pollution-control', deptName: 'State Pollution Control Board' },
      { id: 'oth-13', title: 'Leaking Public Drinking Fountain / Water Standpost', deptId: 'dept-water', deptName: 'Water Supply & Sewerage Board' },
      { id: 'oth-14', title: 'Water Hyacinth / Weed Overgrowth in Water Body', deptId: 'dept-pollution-control', deptName: 'State Pollution Control Board' }
    ];

    const insertOther = db.prepare(`
      INSERT INTO other_problems (id, title, department_id, department_name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const opt of defaultOtherOptions) {
      insertOther.run(opt.id, opt.title, opt.deptId, opt.deptName, now, now);
    }
  }
}
