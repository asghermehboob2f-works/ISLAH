import { NextResponse } from 'next/server';
import { getDb } from '@/lib/server/db';
import { getCurrentUser, logAudit } from '@/lib/server/auth';

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM success_stories ORDER BY created_at DESC').all() as any[];

    const data = rows.map((s) => ({
      id: s.id,
      title: s.title,
      category: s.category,
      departmentName: s.department_name,
      location: s.location,
      resolvedDate: s.resolved_date,
      beforePhotoUrl: s.before_photo_url,
      afterPhotoUrl: s.after_photo_url,
      description: s.description,
      impactResult: s.impact_result || '',
      published: Boolean(s.published),
      status: s.published ? 'published' : 'draft',
      createdAt: s.created_at
    }));

    return NextResponse.json({ success: true, data });
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
    if (currentUser?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Only Super Administrators can create success stories.' } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, category, departmentName, location, resolvedDate, beforePhotoUrl, afterPhotoUrl, description, impactResult } = body;

    if (!title || !beforePhotoUrl || !afterPhotoUrl) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Title, before photo, and after photo are required.' } },
        { status: 400 }
      );
    }

    const db = getDb();
    const id = `ss-${Date.now()}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO success_stories (
        id, title, category, department_name, location, resolved_date,
        before_photo_url, after_photo_url, description, impact_result, published, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `).run(
      id,
      title,
      category || 'Infrastructure',
      departmentName || 'Public Works',
      location || 'City Ward',
      resolvedDate || now.split('T')[0],
      beforePhotoUrl,
      afterPhotoUrl,
      description || '',
      impactResult || '',
      now
    );

    logAudit(currentUser.name, 'admin', 'CREATE_SUCCESS_STORY', title, 'Added success story case study');

    return NextResponse.json({
      success: true,
      data: {
        id,
        title,
        category: category || 'Infrastructure',
        departmentName: departmentName || 'Public Works',
        location: location || 'City Ward',
        resolvedDate: resolvedDate || now.split('T')[0],
        beforePhotoUrl,
        afterPhotoUrl,
        description: description || '',
        impactResult: impactResult || '',
        published: true,
        status: 'published',
        createdAt: now
      }
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
