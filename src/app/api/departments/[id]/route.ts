import { NextResponse } from 'next/server';
import { getDb } from '@/lib/server/db';
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
    const { name, code, contactEmail, contactPhone, categoriesHandled, slaHoursDefault, leadOfficer, status } = body;

    const db = getDb();
    const dept = db.prepare('SELECT * FROM departments WHERE id = ?').get(id) as any;

    if (!dept) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Department not found.' } },
        { status: 404 }
      );
    }

    const categoriesJson = categoriesHandled ? JSON.stringify(categoriesHandled) : dept.categories_json;

    db.prepare(`
      UPDATE departments
      SET name = COALESCE(?, name),
          code = COALESCE(?, code),
          email = COALESCE(?, email),
          contact = COALESCE(?, contact),
          categories_json = ?,
          sla_hours_default = COALESCE(?, sla_hours_default),
          lead_officer = COALESCE(?, lead_officer),
          status = COALESCE(?, status)
      WHERE id = ?
    `).run(
      name || null,
      code ? code.toUpperCase() : null,
      contactEmail || null,
      contactPhone || null,
      categoriesJson,
      slaHoursDefault || null,
      leadOfficer || null,
      status || null,
      id
    );

    logAudit(currentUser.name, 'admin', 'UPDATE_DEPARTMENT', id, `Updated department ${dept.code} parameters`);

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

    // Safe deletion rule: If historical reports exist, soft-delete (archive) instead of deleting DB row
    if (issueCountQuery.count > 0) {
      db.prepare("UPDATE departments SET status = 'archived' WHERE id = ?").run(id);
      logAudit(currentUser.name, 'admin', 'ARCHIVE_DEPARTMENT', id, `Archived department ${id} containing ${issueCountQuery.count} historical tickets`);
      return NextResponse.json({
        success: true,
        message: 'Department has associated historical tickets. It has been safely archived.'
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
