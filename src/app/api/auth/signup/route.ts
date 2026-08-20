import { NextResponse } from 'next/server';
import { getDb, hashPassword } from '@/lib/server/db';
import { setAuthCookie, logAudit } from '@/lib/server/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, password } = body;

    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').trim();
    const cleanPass = password || '';

    if (!cleanName || !cleanEmail || !cleanPass) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Full name, email, and password are required.' } },
        { status: 400 }
      );
    }

    if (cleanPass.length < 6) {
      return NextResponse.json(
        { success: false, error: { code: 'WEAK_PASSWORD', message: 'Password must be at least 6 characters long.' } },
        { status: 400 }
      );
    }

    const db = getDb();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);

    if (existing) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_EXISTS', message: 'An account with this email address already exists.' } },
        { status: 400 }
      );
    }

    const id = `usr-${Date.now()}`;
    const now = new Date().toISOString();
    const passHash = hashPassword(cleanPass);
    const badgesJson = JSON.stringify([
      {
        id: 'badge-welcome',
        title: 'Registered Resident',
        description: 'Joined the ISLAH Civic Platform',
        icon: 'ShieldCheck',
        earnedAt: now
      }
    ]);

    db.prepare(`
      INSERT INTO users (id, name, email, phone, password_hash, role, status, civic_score, rank_title, ward, reports_submitted, reports_resolved, badges_json, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      cleanName,
      cleanEmail,
      cleanPhone,
      passHash,
      'citizen',
      'ACTIVE',
      100,
      'Verified Resident',
      'Municipal Division',
      0,
      0,
      badgesJson,
      now,
      now
    );

    const userObj = {
      id,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      role: 'citizen' as const,
      status: 'ACTIVE',
      civicScore: 100,
      rankTitle: 'Verified Resident',
      ward: 'Municipal Division',
      permissions: []
    };

    await setAuthCookie(userObj);
    logAudit(cleanName, 'citizen', 'SIGNUP', cleanEmail, 'Citizen account registered successfully');

    return NextResponse.json({
      success: true,
      data: userObj
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message || 'Signup failed.' } },
      { status: 500 }
    );
  }
}
