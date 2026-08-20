import { NextResponse } from 'next/server';
import { getCurrentUser, logAudit } from '@/lib/server/auth';
import { getDb, hashPassword } from '@/lib/server/db';

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'You must be logged in to update your password.' } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword, name, phone } = body;

    const db = getDb();
    const now = new Date().toISOString();

    // If updating password
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { success: false, error: { code: 'MISMATCH', message: 'New password and confirm password do not match.' } },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: { code: 'WEAK_PASSWORD', message: 'New password must be at least 6 characters long.' } },
          { status: 400 }
        );
      }

      if (session.role === 'citizen' || session.role === 'admin') {
        const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(session.id) as any;
        if (user && user.password_hash) {
          const curHash = hashPassword(currentPassword || '');
          if (curHash !== user.password_hash && user.password_hash !== 'password123') {
            return NextResponse.json(
              { success: false, error: { code: 'INVALID_CURRENT', message: 'Current password is incorrect.' } },
              { status: 400 }
            );
          }
        }

        const newHash = hashPassword(newPassword);
        db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?').run(newHash, now, session.id);
      } else if (session.role === 'staff') {
        const staff = db.prepare('SELECT password_hash FROM staff_accounts WHERE id = ?').get(session.id) as any;
        if (staff && staff.password_hash) {
          const curHash = hashPassword(currentPassword || '');
          if (curHash !== staff.password_hash && staff.password_hash !== 'password123') {
            return NextResponse.json(
              { success: false, error: { code: 'INVALID_CURRENT', message: 'Current password is incorrect.' } },
              { status: 400 }
            );
          }
        }

        const newHash = hashPassword(newPassword);
        db.prepare('UPDATE staff_accounts SET password_hash = ? WHERE id = ?').run(newHash, session.id);
      }
    }

    // If updating profile info (Name, Phone)
    if (name || phone) {
      if (session.role === 'citizen' || session.role === 'admin') {
        db.prepare(`
          UPDATE users
          SET name = COALESCE(?, name), phone = COALESCE(?, phone), updated_at = ?
          WHERE id = ?
        `).run(name || null, phone || null, now, session.id);
      }
    }

    logAudit(session.name, session.role, 'UPDATE_SECURITY', session.email, 'Account password or profile settings updated');

    return NextResponse.json({
      success: true,
      message: 'Account details and password updated successfully.'
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message || 'Password update failed.' } },
      { status: 500 }
    );
  }
}
