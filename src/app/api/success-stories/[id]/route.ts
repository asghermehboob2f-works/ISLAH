import { NextResponse } from 'next/server';
import { getDb } from '@/lib/server/db';
import { getCurrentUser, logAudit } from '@/lib/server/auth';

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const currentUser = await getCurrentUser();
    if (currentUser?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Only Super Administrators can update success stories.' } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, category, departmentName, location, resolvedDate, beforePhotoUrl, afterPhotoUrl, description, impactResult, published } = body;

    const db = getDb();
    db.prepare(`
      UPDATE success_stories
      SET title = COALESCE(?, title),
          category = COALESCE(?, category),
          department_name = COALESCE(?, department_name),
          location = COALESCE(?, location),
          resolved_date = COALESCE(?, resolved_date),
          before_photo_url = COALESCE(?, before_photo_url),
          after_photo_url = COALESCE(?, after_photo_url),
          description = COALESCE(?, description),
          impact_result = COALESCE(?, impact_result),
          published = COALESCE(?, published)
      WHERE id = ?
    `).run(
      title || null,
      category || null,
      departmentName || null,
      location || null,
      resolvedDate || null,
      beforePhotoUrl || null,
      afterPhotoUrl || null,
      description || null,
      impactResult || null,
      published !== undefined ? (published ? 1 : 0) : null,
      id
    );

    logAudit(currentUser.name, 'admin', 'UPDATE_SUCCESS_STORY', id, 'Updated success story details');

    return NextResponse.json({ success: true, message: 'Success story updated.' });
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
        { success: false, error: { code: 'FORBIDDEN', message: 'Only Super Administrators can delete success stories.' } },
        { status: 403 }
      );
    }

    const db = getDb();
    db.prepare('DELETE FROM success_stories WHERE id = ?').run(id);
    logAudit(currentUser.name, 'admin', 'DELETE_SUCCESS_STORY', id, 'Deleted success story');

    return NextResponse.json({ success: true, message: 'Success story deleted.' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
