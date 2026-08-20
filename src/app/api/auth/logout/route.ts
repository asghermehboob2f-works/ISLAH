import { NextResponse } from 'next/server';
import { clearAuthCookie, getCurrentUser, logAudit } from '@/lib/server/auth';

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (user) {
      logAudit(user.name, user.role, 'LOGOUT', user.email, 'User logged out of application');
    }
    await clearAuthCookie();
    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
