import { NextResponse } from 'next/server';
import { getDb, hashPassword } from '@/lib/server/db';
import { getCurrentUser, logAudit } from '@/lib/server/auth';

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const currentUser = await getCurrentUser();
    if (currentUser?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Only Super Administrators can update departments.' } },
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

    const db = getDb();
    const dept = db.prepare('SELECT * FROM departments WHERE id = ?').get(id) as any;

    if (!dept) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Department not found.' } },
        { status: 404 }
      );
    }

    const categoriesJson = categoriesHandled ? JSON.stringify(categoriesHandled) : dept.categories_json;
    const passHash = password && password.trim() ? hashPassword(password.trim()) : dept.password_hash;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE departments
      SET name = COALESCE(?, name),
          code = COALESCE(?, code),
          type = COALESCE(?, type),
          description = COALESCE(?, description),
          email = COALESCE(?, email),
          contact = COALESCE(?, contact),
          alternate_contact = COALESCE(?, alternate_contact),
          office_location = COALESCE(?, office_location),
          categories_json = ?,
          sla_hours_default = COALESCE(?, sla_hours_default),
          lead_officer = COALESCE(?, lead_officer),
          login_email = COALESCE(?, login_email),
          password_hash = ?,
          status = COALESCE(?, status),
          updated_at = ?
      WHERE id = ?
    `).run(
      name || null,
      code ? code.toUpperCase() : null,
      type || null,
      description !== undefined ? description : null,
      contactEmail || null,
      contactPhone || null,
      alternatePhone !== undefined ? alternatePhone : null,
      officeLocation !== undefined ? officeLocation : null,
      categoriesJson,
      slaHoursDefault || null,
      leadOfficer || null,
      loginEmail || null,
      passHash,
      status || null,
      now,
      id
    );

    logAudit(currentUser.name, 'admin', 'UPDATE_DEPARTMENT', id, `Updated department ${dept.code} information`);

    return NextResponse.json({ success: true, message: 'Department updated successfully.' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const currentUser = await getCurrentUser();
    if (currentUser?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Only Super Administrators can delete departments.' } },
        { status: 403 }
      );
    }

    const db = getDb();
    const issueCountQuery = db.prepare('SELECT COUNT(*) as count FROM issues WHERE department_id = ?').get(id) as { count: number };

    if (issueCountQuery.count > 0) {
      db.prepare("UPDATE departments SET status = 'inactive' WHERE id = ?").run(id);
      logAudit(currentUser.name, 'admin', 'DISABLE_DEPARTMENT', id, `Disabled department ${id} containing ${issueCountQuery.count} historical tickets`);
      return NextResponse.json({
        success: true,
        message: 'Department has associated historical tickets. Its status has been safely changed to inactive.'
      });
    }

    db.prepare('DELETE FROM departments WHERE id = ?').run(id);
    logAudit(currentUser.name, 'admin', 'DELETE_DEPARTMENT', id, `Deleted department ${id}`);

    return NextResponse.json({ success: true, message: 'Department deleted successfully.' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
