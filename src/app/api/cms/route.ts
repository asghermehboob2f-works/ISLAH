import { NextResponse } from 'next/server';
import { getDb } from '@/lib/server/db';
import { getCurrentUser, logAudit } from '@/lib/server/auth';

export async function GET() {
  try {
    const db = getDb();
    const row = db.prepare("SELECT content_json FROM cms_content WHERE section_key = 'main'").get() as any;

    let content = {};
    if (row && row.content_json) {
      try { content = JSON.parse(row.content_json); } catch (e) {}
    }

    return NextResponse.json({ success: true, data: content });
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
        { success: false, error: { code: 'FORBIDDEN', message: 'Only Super Administrators can update website CMS content.' } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const db = getDb();
    const now = new Date().toISOString();

    const existingRow = db.prepare("SELECT content_json FROM cms_content WHERE section_key = 'main'").get() as any;
    let existingContent = {};
    if (existingRow && existingRow.content_json) {
      try { existingContent = JSON.parse(existingRow.content_json); } catch (e) {}
    }

    const mergedContent = { ...existingContent, ...body };
    const contentJson = JSON.stringify(mergedContent);

    db.prepare(`
      INSERT INTO cms_content (section_key, content_json, updated_at)
      VALUES ('main', ?, ?)
      ON CONFLICT(section_key) DO UPDATE SET content_json = excluded.content_json, updated_at = excluded.updated_at
    `).run(contentJson, now);

    logAudit(currentUser.name, 'admin', 'UPDATE_CMS', 'Website Content', 'Updated live public site CMS parameters');

    return NextResponse.json({ success: true, data: mergedContent });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
