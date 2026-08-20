import { cookies } from 'next/headers';
import { getDb, hashPassword } from './db';
import crypto from 'crypto';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'citizen' | 'staff' | 'admin';
  status: string;
  departmentId?: string;
  departmentName?: string;
  staffId?: string;
  civicScore?: number;
  rankTitle?: string;
  ward?: string;
  permissions?: string[];
}

export function createToken(payload: object): string {
  const data = JSON.stringify(payload);
  const secret = process.env.AUTH_SECRET || 'islah_platform_jwt_secret_2026';
  const hmac = crypto.createHmac('sha256', secret).update(data).digest('hex');
  return Buffer.from(data).toString('base64url') + '.' + hmac;
}

export function verifyToken(token: string): SessionUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const data = Buffer.from(parts[0], 'base64url').toString('utf-8');
    const secret = process.env.AUTH_SECRET || 'islah_platform_jwt_secret_2026';
    const expectedHmac = crypto.createHmac('sha256', secret).update(data).digest('hex');

    if (parts[1] !== expectedHmac) return null;

    return JSON.parse(data) as SessionUser;
  } catch (err) {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('islah_session')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setAuthCookie(user: SessionUser) {
  const token = createToken(user);
  const cookieStore = await cookies();
  cookieStore.set('islah_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set('islah_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });
}

export function logAudit(actorName: string, actorRole: string, action: string, target: string, details: string) {
  try {
    const db = getDb();
    const id = `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const timestamp = new Date().toISOString();
    db.prepare(`
      INSERT INTO audit_logs (id, timestamp, actor_name, actor_role, action, target, details)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, timestamp, actorName, actorRole, action, target, details);
  } catch (e) {
    console.error('Failed to write audit log:', e);
  }
}
