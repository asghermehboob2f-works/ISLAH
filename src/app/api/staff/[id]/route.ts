import { NextResponse } from 'next/server';
import { getDb, hashPassword } from '@/lib/server/db';
import { getCurrentUser, logAudit } from '@/lib/server/auth';

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const currentUser = await getCurrentUser();
    if (currentUser?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Only Super Administrators can update staff accounts.' } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, phone, role, status, departmentId, permissions, resetPassword } = body;

    const db = getDb();
    const staff = db.prepare('SELECT * FROM staff_accounts WHERE id = ? OR staff_id = ?').get(id, id) as any;

    if (!staff) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Staff account not found.' } },
        { status: 404 }
      );
    }

    let updatedDeptName = staff.department_name;
    if (departmentId && departmentId !== staff.department_id) {
      const dept = db.prepare('SELECT name FROM departments WHERE id = ?').get(departmentId) as any;
      if (dept) updatedDeptName = dept.name;
    }

    let newHash = staff.password_hash;
    if (resetPassword) {
      newHash = hashPassword(resetPassword);
    }

    const permsJson = permissions ? JSON.stringify(permissions) : staff.permissions_json;

    db.prepare(`
      UPDATE staff_accounts
      SET name = COALESCE(?, name),
          phone = COALESCE(?, phone),
          role = COALESCE(?, role),
          status = COALESCE(?, status),
          department_id = COALESCE(?, department_id),
          department_name = ?,
          permissions_json = ?,
          password_hash = ?
      WHERE id = ?
    `).run(
      name || null,
      phone || null,
      role || null,
      status || null,
      departmentId || null,
      updatedDeptName,
      permsJson,
      newHash,
      staff.id
    );

    logAudit(currentUser.name, 'admin', 'UPDATE_STAFF', staff.staff_id, `Updated staff account parameters for ${staff.name}`);

    return NextResponse.json({ success: true, message: 'Staff account updated successfully.' });
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
        { success: false, error: { code: 'FORBIDDEN', message: 'Only Super Administrators can delete staff accounts.' } },
        { status: 403 }
      );
    }

    const db = getDb();
    db.prepare('DELETE FROM staff_accounts WHERE id = ? OR staff_id = ?').run(id, id);
    logAudit(currentUser.name, 'admin', 'DELETE_STAFF', id, `Deleted staff account ${id}`);

    return NextResponse.json({ success: true, message: 'Staff account deleted successfully.' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
