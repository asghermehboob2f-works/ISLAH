import { NextResponse } from 'next/server';
import { getDb } from '@/lib/server/db';
import { getCurrentUser, logAudit } from '@/lib/server/auth';

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM departments ORDER BY name ASC').all() as any[];

    const data = rows.map((d) => {
      // Calculate active and resolved ticket counts dynamically from real issues
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
        email: d.email || d.contact_email,
        contactEmail: d.email || d.contact_email,
        contactPhone: d.contact || d.contact_phone || '',
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
    const { name, code, contactEmail, contactPhone, categoriesHandled, slaHoursDefault, leadOfficer } = body;

    if (!name || !code) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Department name and department code are required.' } },
        { status: 400 }
      );
    }

    const db = getDb();
    const id = `dept-${Date.now()}`;
    const now = new Date().toISOString();
    const categoriesJson = JSON.stringify(categoriesHandled || ['Infrastructure']);

    db.prepare(`
      INSERT INTO departments (
        id, name, code, email, contact, categories_json, sla_hours_default, lead_officer, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)
    `).run(
      id,
      name,
      code.toUpperCase(),
      contactEmail || `dept.${code.toLowerCase()}@islah.gov.in`,
      contactPhone || '',
      categoriesJson,
      slaHoursDefault || 24,
      leadOfficer || 'Chief Officer',
      now
    );

    logAudit(currentUser.name, 'admin', 'CREATE_DEPARTMENT', name, `Created municipal department ${code}`);

    const newDept = {
      id,
      name,
      code: code.toUpperCase(),
      email: contactEmail || `dept.${code.toLowerCase()}@islah.gov.in`,
      contactEmail: contactEmail || `dept.${code.toLowerCase()}@islah.gov.in`,
      contactPhone: contactPhone || '',
      categoriesHandled: categoriesHandled || ['Infrastructure'],
      slaHoursDefault: slaHoursDefault || 24,
      leadOfficer: leadOfficer || 'Chief Officer',
      activeTickets: 0,
      resolvedTickets: 0,
      avgResolutionHours: 12.0,
      slaCompliancePercent: 100.0,
      status: 'active'
    };

    return NextResponse.json({ success: true, data: newDept });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
