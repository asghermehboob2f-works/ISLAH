import { NextResponse } from 'next/server';
import { getDb } from '@/lib/server/db';
import { getCurrentUser, logAudit } from '@/lib/server/auth';

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const currentUser = await getCurrentUser();
    if (currentUser?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Only Super Administrators can update blog articles.' } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, slug, category, authorName, publishedDate, excerpt, content, coverImage, status } = body;

    const db = getDb();
    db.prepare(`
      UPDATE blog_posts
      SET title = COALESCE(?, title),
          slug = COALESCE(?, slug),
          category = COALESCE(?, category),
          author_name = COALESCE(?, author_name),
          published_date = COALESCE(?, published_date),
          excerpt = COALESCE(?, excerpt),
          content = COALESCE(?, content),
          cover_image = COALESCE(?, cover_image),
          status = COALESCE(?, status)
      WHERE id = ?
    `).run(
      title || null,
      slug ? slug.toLowerCase().replace(/[^a-z0-9]+/g, '-') : null,
      category || null,
      authorName || null,
      publishedDate || null,
      excerpt || null,
      content || null,
      coverImage || null,
      status || null,
      id
    );

    logAudit(currentUser.name, 'admin', 'UPDATE_BLOG_POST', id, 'Updated blog article details');

    return NextResponse.json({ success: true, message: 'Article updated successfully.' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const currentUser = await getCurrentUser();
    if (currentUser?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Only Super Administrators can delete blog articles.' } },
        { status: 403 }
      );
    }

    const db = getDb();
    db.prepare('DELETE FROM blog_posts WHERE id = ?').run(id);
    logAudit(currentUser.name, 'admin', 'DELETE_BLOG_POST', id, 'Deleted blog article');

    return NextResponse.json({ success: true, message: 'Article deleted successfully.' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
