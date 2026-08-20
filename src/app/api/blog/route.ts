import { NextResponse } from 'next/server';
import { getDb } from '@/lib/server/db';
import { getCurrentUser, logAudit } from '@/lib/server/auth';

export async function GET() {
  try {
    const db = getDb();
    const currentUser = await getCurrentUser();
    const isAdmin = currentUser?.role === 'admin';

    let sql = 'SELECT * FROM blog_posts';
    if (!isAdmin) {
      sql += " WHERE status = 'published'";
    }
    sql += ' ORDER BY created_at DESC';

    const rows = db.prepare(sql).all() as any[];

    const data = rows.map((b) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      category: b.category,
      authorName: b.author_name,
      publishedDate: b.published_date,
      excerpt: b.excerpt,
      content: b.content,
      coverImage: b.cover_image,
      status: b.status,
      createdAt: b.created_at
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
        { success: false, error: { code: 'FORBIDDEN', message: 'Only Super Administrators can create blog articles.' } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, slug, category, authorName, publishedDate, excerpt, content, coverImage, status } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Article title and body content are required.' } },
        { status: 400 }
      );
    }

    const db = getDb();
    const id = `blog-${Date.now()}`;
    const generatedSlug = (slug || title).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO blog_posts (
        id, title, slug, category, author_name, published_date, excerpt, content, cover_image, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      title,
      generatedSlug,
      category || 'Technology & AI',
      authorName || currentUser.name,
      publishedDate || now.split('T')[0],
      excerpt || title,
      content,
      coverImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      status || 'published',
      now
    );

    logAudit(currentUser.name, 'admin', 'CREATE_BLOG_POST', title, `Created article (${generatedSlug})`);

    const newPost = {
      id,
      title,
      slug: generatedSlug,
      category: category || 'Technology & AI',
      authorName: authorName || currentUser.name,
      publishedDate: publishedDate || now.split('T')[0],
      excerpt: excerpt || title,
      content,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      status: status || 'published',
      createdAt: now
    };

    return NextResponse.json({ success: true, data: newPost });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
