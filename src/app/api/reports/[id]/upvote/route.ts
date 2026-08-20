import { NextResponse } from 'next/server';
import { getDb } from '@/lib/server/db';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const db = getDb();
    const now = new Date().toISOString();

    const res = db.prepare(`
      UPDATE issues
      SET upvotes_count = upvotes_count + 1, updated_at = ?
      WHERE LOWER(id) = ? OR LOWER(ticket_number) = ?
    `).run(now, id.toLowerCase(), id.toLowerCase());

    if (res.changes === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Ticket not found.' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Upvoted ticket successfully.' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
