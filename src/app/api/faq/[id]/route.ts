import { NextResponse } from 'next/server';
import { getDb } from '@/lib/server/db';
import { getCurrentUser, logAudit } from '@/lib/server/auth';

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const currentUser = await getCurrentUser();
    if (currentUser?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Only Super Administrators can update FAQs.' } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { question, answer, category, orderIndex, published } = body;

    const db = getDb();
    db.prepare(`
      UPDATE faqs
      SET question = COALESCE(?, question),
          answer = COALESCE(?, answer),
          category = COALESCE(?, category),
          display_order = COALESCE(?, display_order),
          published = COALESCE(?, published)
      WHERE id = ?
    `).run(
      question || null,
      answer || null,
      category || null,
      orderIndex || null,
      published !== undefined ? (published ? 1 : 0) : null,
      id
    );

    logAudit(currentUser.name, 'admin', 'UPDATE_FAQ', id, 'Updated FAQ item');

    return NextResponse.json({ success: true, message: 'FAQ updated successfully.' });
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
        { success: false, error: { code: 'FORBIDDEN', message: 'Only Super Administrators can delete FAQs.' } },
        { status: 403 }
      );
    }

    const db = getDb();
    db.prepare('DELETE FROM faqs WHERE id = ?').run(id);
    logAudit(currentUser.name, 'admin', 'DELETE_FAQ', id, 'Deleted FAQ item');

    return NextResponse.json({ success: true, message: 'FAQ deleted successfully.' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
