import { NextResponse } from 'next/server';
import { getDb, hashPassword } from '@/lib/server/db';
import { getCurrentUser, logAudit } from '@/lib/server/auth';

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM staff_accounts ORDER BY created_at DESC').all() as any[];

    const data = rows.map((s) => ({
      id: s.id,
      staffId: s.staff_id,
      name: s.name,
      email: s.email,
      phone: s.phone || '',
      role: s.role,
      status: s.status,
      departmentId: s.department_id,
      departmentName: s.department_name,
      permissions: JSON.parse(s.permissions_json || '[]'),
      createdAt: s.created_at,
      lastLogin: s.last_login
    }));

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Only Super Administrators can create staff accounts.' } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, phone, departmentId, role, permissions, password } = body;

    if (!name || !email || !departmentId) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Staff name, email, and department assignment are required.' } },
        { status: 400 }
      );
    }

    const db = getDb();
    const dept = db.prepare('SELECT code, name FROM departments WHERE id = ?').get(departmentId) as any;
    const deptCode = dept ? dept.code : 'STF';
    const deptName = dept ? dept.name : 'Municipal Department';

    const existing = db.prepare('SELECT id FROM staff_accounts WHERE email = ?').get(email.trim().toLowerCase());
    if (existing) {
      return NextResponse.json(
        { success: false, error: { code: 'EXISTS', message: 'A staff account with this email already exists.' } },
        { status: 400 }
      );
    }

    const num = Math.floor(100 + Math.random() * 900);
    const staffId = `STF-${deptCode}-${num}`;
    const id = `stf-acct-${Date.now()}`;
    const now = new Date().toISOString();
    const initialPass = password || 'password123';
    const passHash = hashPassword(initialPass);
    const permissionsJson = JSON.stringify(permissions || ['view_tickets', 'update_status', 'add_notes', 'upload_resolution']);

    db.prepare(`
      INSERT INTO staff_accounts (
        id, staff_id, name, email, phone, password_hash, role, status, department_id, department_name, permissions_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?, ?, ?, ?)
    `).run(
      id,
      staffId,
      name.trim(),
      email.trim().toLowerCase(),
      phone || null,
      passHash,
      role || 'Department Officer',
      departmentId,
      deptName,
      permissionsJson,
      now
    );

    logAudit(currentUser.name, 'admin', 'CREATE_STAFF', staffId, `Created staff account for ${name} (${staffId}) assigned to ${deptName}`);

    const newStaff = {
      id,
      staffId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || '',
      role: role || 'Department Officer',
      status: 'ACTIVE',
      departmentId,
      departmentName: deptName,
      permissions: permissions || ['view_tickets', 'update_status', 'add_notes', 'upload_resolution'],
      createdAt: now
    };

    return NextResponse.json({ success: true, data: newStaff });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
