import { NextResponse } from 'next/server';
import { getDb } from '@/lib/server/db';
import { getCurrentUser, logAudit } from '@/lib/server/auth';

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM faqs ORDER BY display_order ASC, created_at DESC').all() as any[];

    const data = rows.map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      category: f.category || 'General',
      orderIndex: f.display_order || 1,
      published: Boolean(f.published),
      status: f.published ? 'published' : 'draft',
      createdAt: f.created_at
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
        { success: false, error: { code: 'FORBIDDEN', message: 'Only Super Administrators can create FAQs.' } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { question, answer, category, orderIndex } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Question and answer are required.' } },
        { status: 400 }
      );
    }

    const db = getDb();
    const id = `faq-${Date.now()}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO faqs (id, question, answer, category, display_order, published, created_at)
      VALUES (?, ?, ?, ?, ?, 1, ?)
    `).run(
      id,
      question,
      answer,
      category || 'General',
      orderIndex || 1,
      now
    );

    logAudit(currentUser.name, 'admin', 'CREATE_FAQ', question, 'Created FAQ item');

    return NextResponse.json({
      success: true,
      data: {
        id,
        question,
        answer,
        category: category || 'General',
        orderIndex: orderIndex || 1,
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
