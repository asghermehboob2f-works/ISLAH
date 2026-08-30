import { NextResponse } from 'next/server';
import { getDb, hashPassword } from '@/lib/server/db';
import { getCurrentUser, logAudit } from '@/lib/server/auth';

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM departments ORDER BY name ASC').all() as any[];

    const data = rows.map((d) => {
      const activeQuery = db.prepare(`
        SELECT COUNT(*) as count FROM issues WHERE department_id = ? AND status != 'resolved'
      `).get(d.id) as { count: number };

      const resolvedQuery = db.prepare(`
        SELECT COUNT(*) as count FROM issues WHERE department_id = ? AND status = 'resolved'
      `).get(d.id) as { count: number };

      let categories = [];
      try { categories = JSON.parse(d.categories_json); } catch (e) {}

      return {
        id: d.id,
        name: d.name,
        code: d.code,
        type: d.type || 'Civic',
        description: d.description || '',
        email: d.email || d.contact_email,
        contactEmail: d.email || d.contact_email,
        contactPhone: d.contact || d.contact_phone || '',
        phone: d.contact || d.contact_phone || '',
        alternatePhone: d.alternate_contact || '',
        officeLocation: d.office_location || '',
        loginEmail: d.login_email || d.email || '',
        hasPassword: Boolean(d.password_hash),
        categoriesHandled: categories,
        slaHoursDefault: d.sla_hours_default || 24,
        leadOfficer: d.lead_officer || 'Department Lead',
        activeTickets: activeQuery.count,
        resolvedTickets: resolvedQuery.count,
        avgResolutionHours: d.avg_resolution_hours || 12.0,
        slaCompliancePercent: d.sla_compliance_percent || 100.0,
        status: d.status || 'active'
      };
    });

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
        { success: false, error: { code: 'FORBIDDEN', message: 'Only Super Administrators can create departments.' } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { 
      name, 
      code, 
      type, 
      description, 
      contactEmail, 
      contactPhone, 
      alternatePhone, 
      officeLocation, 
      categoriesHandled, 
      slaHoursDefault, 
      leadOfficer,
      loginEmail,
      password,
      status
    } = body;

    if (!name || !code) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Department name and department code are required.' } },
        { status: 400 }
      );
    }

    const db = getDb();
    const id = `dept-${Date.now()}`;
    const now = new Date().toISOString();
    const categoriesJson = JSON.stringify(categoriesHandled || ['Other']);
    const passHash = password ? hashPassword(password) : null;
    const deptType = type || 'Civic';
    const deptStatus = status || 'active';

    db.prepare(`
      INSERT INTO departments (
        id, name, code, type, description, email, contact, alternate_contact, office_location, categories_json, sla_hours_default, lead_officer, login_email, password_hash, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      name,
      code.toUpperCase(),
      deptType,
      description || '',
      contactEmail || `dept.${code.toLowerCase()}@islah.gov.in`,
      contactPhone || '',
      alternatePhone || '',
      officeLocation || '',
      categoriesJson,
      slaHoursDefault || 24,
      leadOfficer || 'Chief Officer',
      loginEmail || contactEmail || `dept.${code.toLowerCase()}@islah.gov.in`,
      passHash,
      deptStatus,
      now,
      now
    );

    logAudit(currentUser.name, 'admin', 'CREATE_DEPARTMENT', name, `Created municipal department ${code} (${deptType})`);

    const newDept = {
      id,
      name,
      code: code.toUpperCase(),
      type: deptType,
      description: description || '',
      email: contactEmail || `dept.${code.toLowerCase()}@islah.gov.in`,
      contactEmail: contactEmail || `dept.${code.toLowerCase()}@islah.gov.in`,
      contactPhone: contactPhone || '',
      phone: contactPhone || '',
      alternatePhone: alternatePhone || '',
      officeLocation: officeLocation || '',
      loginEmail: loginEmail || contactEmail || `dept.${code.toLowerCase()}@islah.gov.in`,
      hasPassword: Boolean(passHash),
      categoriesHandled: categoriesHandled || ['Other'],
      slaHoursDefault: slaHoursDefault || 24,
      leadOfficer: leadOfficer || 'Chief Officer',
      activeTickets: 0,
      resolvedTickets: 0,
      avgResolutionHours: 12.0,
      slaCompliancePercent: 100.0,
      status: deptStatus
    };

    return NextResponse.json({ success: true, data: newDept });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
