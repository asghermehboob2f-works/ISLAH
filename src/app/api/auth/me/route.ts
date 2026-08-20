import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/server/auth';
import { getDb } from '@/lib/server/db';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: true, data: null });
    }

    const db = getDb();
    if (session.role === 'citizen' || session.role === 'admin') {
      const dbUser = db.prepare('SELECT * FROM users WHERE id = ?').get(session.id) as any;
      if (dbUser) {
        let badges = [];
        try { badges = JSON.parse(dbUser.badges_json || '[]'); } catch (e) {}
        return NextResponse.json({
          success: true,
          data: {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            phone: dbUser.phone,
            role: dbUser.role,
            status: dbUser.status,
            civicScore: dbUser.civic_score,
            rankTitle: dbUser.rank_title,
            ward: dbUser.ward,
            reportsSubmitted: dbUser.reports_submitted,
            reportsResolved: dbUser.reports_resolved,
            badges,
            createdAt: dbUser.created_at
          }
        });
      }
    } else if (session.role === 'staff') {
      const dbStaff = db.prepare('SELECT * FROM staff_accounts WHERE id = ?').get(session.id) as any;
      if (dbStaff) {
        let permissions = [];
        try { permissions = JSON.parse(dbStaff.permissions_json || '[]'); } catch (e) {}
        return NextResponse.json({
          success: true,
          data: {
            id: dbStaff.id,
            staffId: dbStaff.staff_id,
            name: dbStaff.name,
            email: dbStaff.email,
            phone: dbStaff.phone,
            role: 'staff',
            status: dbStaff.status,
            departmentId: dbStaff.department_id,
            departmentName: dbStaff.department_name,
            permissions,
            createdAt: dbStaff.created_at
          }
        });
      }
    }

    return NextResponse.json({ success: true, data: session });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
