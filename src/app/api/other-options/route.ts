import { NextResponse } from 'next/server';
import { getDb } from '@/lib/server/db';
import { getCurrentUser, logAudit } from '@/lib/server/auth';

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare(`
      SELECT id, title, department_id as departmentId, department_name as departmentName, created_at as createdAt, updated_at as updatedAt
      FROM other_problems
      ORDER BY title ASC
    `).all() as any[];

    return NextResponse.json({ success: true, data: rows });
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
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Admin permissions required.' } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, departmentId, departmentName } = body;

    if (!title || !title.trim() || !departmentId) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Title and departmentId are required.' } },
        { status: 400 }
      );
    }

    const db = getDb();

    // Verify department exists
    const dept = db.prepare('SELECT name FROM departments WHERE id = ?').get(departmentId) as any;
    if (!dept) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Selected department does not exist.' } },
        { status: 400 }
      );
    }

    const id = `oth-${Date.now()}`;
    const now = new Date().toISOString();
    const finalDeptName = departmentName || dept.name;

    db.prepare(`
      INSERT INTO other_problems (id, title, department_id, department_name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, title.trim(), departmentId, finalDeptName, now, now);

    logAudit(currentUser.name, currentUser.role, 'CREATE_OTHER_OPTION', title, `Created Other problem option mapped to ${finalDeptName}`);

    return NextResponse.json({
      success: true,
      data: {
        id,
        title: title.trim(),
        departmentId,
        departmentName: finalDeptName,
        createdAt: now,
        updatedAt: now
      }
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Admin permissions required.' } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, title, departmentId, departmentName } = body;

    if (!id || !title || !title.trim() || !departmentId) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'ID, title, and departmentId are required.' } },
        { status: 400 }
      );
    }

    const db = getDb();

    // Verify option exists
    const existing = db.prepare('SELECT id FROM other_problems WHERE id = ?').get(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Other problem option not found.' } },
        { status: 404 }
      );
    }

    // Verify department exists
    const dept = db.prepare('SELECT name FROM departments WHERE id = ?').get(departmentId) as any;
    if (!dept) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Selected department does not exist.' } },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const finalDeptName = departmentName || dept.name;

    db.prepare(`
      UPDATE other_problems
      SET title = ?, department_id = ?, department_name = ?, updated_at = ?
      WHERE id = ?
    `).run(title.trim(), departmentId, finalDeptName, now, id);

    logAudit(currentUser.name, currentUser.role, 'UPDATE_OTHER_OPTION', title, `Updated Other problem option mapped to ${finalDeptName}`);

    return NextResponse.json({
      success: true,
      message: 'Option updated successfully.'
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Admin permissions required.' } },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Missing option ID.' } },
        { status: 400 }
      );
    }

    const db = getDb();
    db.prepare('DELETE FROM other_problems WHERE id = ?').run(id);

    logAudit(currentUser.name, currentUser.role, 'DELETE_OTHER_OPTION', id, `Deleted Other problem option ${id}`);

    return NextResponse.json({
      success: true,
      message: 'Option deleted successfully.'
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
