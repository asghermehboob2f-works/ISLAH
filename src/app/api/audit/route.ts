import { NextResponse } from 'next/server';
import { getDb } from '@/lib/server/db';
import { getCurrentUser } from '@/lib/server/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Audit logs restricted to Super Administrators.' } },
        { status: 403 }
      );
    }

    const db = getDb();
    const rows = db.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 200').all() as any[];

    const data = rows.map((a) => ({
      id: a.id,
      timestamp: a.timestamp,
      actorName: a.actor_name,
      actorRole: a.actor_role,
      action: a.action,
      target: a.target,
      details: a.details
    }));

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
