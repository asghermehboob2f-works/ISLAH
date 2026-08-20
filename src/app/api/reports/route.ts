import { NextResponse } from 'next/server';
import { getDb } from '@/lib/server/db';
import { getCurrentUser, logAudit } from '@/lib/server/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get('departmentId');
    const status = searchParams.get('status');
    const severity = searchParams.get('severity');
    const emergencyOnly = searchParams.get('emergency') === 'true';
    const query = (searchParams.get('q') || '').trim().toLowerCase();
    const myReportsOnly = searchParams.get('mine') === 'true';

    const currentUser = await getCurrentUser();
    const isStaffOrAdmin = currentUser?.role === 'staff' || currentUser?.role === 'admin';

    const db = getDb();

    let sql = 'SELECT * FROM issues WHERE 1=1';
    const params: any[] = [];

    // Privacy Filter:
    // If not staff/admin, filter out PRIVATE reports unless user is viewing their own reports.
    if (!isStaffOrAdmin) {
      if (myReportsOnly && currentUser) {
        sql += ' AND citizen_id = ?';
        params.push(currentUser.id);
      } else {
        sql += ' AND visibility = ?';
        params.push('PUBLIC');
      }
    } else {
      if (myReportsOnly && currentUser) {
        sql += ' AND citizen_id = ?';
        params.push(currentUser.id);
      }
    }

    if (departmentId && departmentId !== 'all') {
      sql += ' AND department_id = ?';
      params.push(departmentId);
    }

    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (severity && severity !== 'all') {
      sql += ' AND severity = ?';
      params.push(severity);
    }

    if (emergencyOnly) {
      sql += ' AND emergency = 1';
    }

    if (query) {
      sql += ' AND (LOWER(ticket_number) LIKE ? OR LOWER(title) LIKE ? OR LOWER(address) LIKE ? OR LOWER(ward) LIKE ?)';
      const qPattern = `%${query}%`;
      params.push(qPattern, qPattern, qPattern, qPattern);
    }

    sql += ' ORDER BY reported_at DESC';

    const rows = db.prepare(sql).all(...params) as any[];

    const data = rows.map((r) => ({
      id: r.id,
      ticketNumber: r.ticket_number,
      citizenId: r.citizen_id,
      citizenName: r.citizen_name,
      citizenEmail: r.citizen_email,
      title: r.title,
      description: r.description,
      category: r.category,
      customCategory: r.custom_category,
      location: {
        lat: r.latitude,
        lng: r.longitude,
        address: r.address,
        landmark: r.landmark || '',
        ward: r.ward || ''
      },
      severity: r.severity,
      emergency: Boolean(r.emergency),
      status: r.status,
      photoUrl: r.photo_url || '',
      resolutionPhotoUrl: r.resolution_photo_url || '',
      voiceNoteUrl: r.voice_note_url || '',
      visibility: r.visibility || 'PUBLIC',
      upvotesCount: r.upvotes_count || 1,
      duplicatesCount: r.duplicates_count || 0,
      departmentId: r.department_id,
      departmentName: r.department_name,
      slaHoursTotal: r.sla_hours_total,
      slaHoursRemaining: r.sla_hours_remaining,
      aiConfidence: r.ai_confidence,
      aiVerificationStatus: r.ai_verification_status,
      aiVerificationScore: r.ai_verification_score,
      reportedAt: r.reported_at,
      updatedAt: r.updated_at,
      timeline: JSON.parse(r.timeline_json || '[]'),
      notes: JSON.parse(r.notes_json || '[]')
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
    const body = await req.json();

    const {
      title,
      category,
      customCategory,
      description,
      location,
      severity,
      emergency,
      departmentId,
      departmentName,
      photoUrl,
      voiceNoteUrl,
      visibility,
      slaHoursTotal
    } = body;

    if (!title || !category || !location || !location.address) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Report title, category, and address are required.' } },
        { status: 400 }
      );
    }

    const db = getDb();
    const id = `iss-${Date.now().toString().slice(-6)}`;
    const ticketNumber = `ISL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const citizenId = currentUser ? currentUser.id : 'usr-guest';
    const citizenName = currentUser ? currentUser.name : 'Anonymous Resident';
    const citizenEmail = currentUser ? currentUser.email : '';

    const isEmergency = Boolean(emergency);
    const slaTotal = isEmergency ? 4 : (slaHoursTotal || 24);
    const finalVisibility = (visibility === 'PRIVATE') ? 'PRIVATE' : 'PUBLIC';

    const timeline = [
      {
        id: `tl-${Date.now()}-1`,
        timestamp: now,
        status: 'reported',
        title: 'Report Submitted',
        description: `Submitted by ${citizenName}`,
        actor: citizenName,
        actorRole: 'citizen'
      },
      {
        id: `tl-${Date.now()}-2`,
        timestamp: now,
        status: 'acknowledged',
        title: 'AI Verification & Department Routing',
        description: `Classified as ${category}. Routed to ${departmentName || 'Target Department'}.`,
        actor: 'ISLAH Core Engine',
        actorRole: 'ai'
      }
    ];

    db.prepare(`
      INSERT INTO issues (
        id, ticket_number, citizen_id, citizen_name, citizen_email,
        title, description, category, custom_category, address, landmark, ward,
        latitude, longitude, severity, emergency, status, photo_url, voice_note_url,
        visibility, upvotes_count, duplicates_count, department_id, department_name,
        sla_hours_total, sla_hours_remaining, ai_confidence, timeline_json, notes_json,
        reported_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      ticketNumber,
      citizenId,
      citizenName,
      citizenEmail,
      title,
      description || 'Civic infrastructure report submitted via ISLAH portal.',
      category,
      customCategory || null,
      location.address,
      location.landmark || null,
      location.ward || null,
      location.lat || 28.6139,
      location.lng || 77.2090,
      isEmergency ? 'critical' : (severity || 'high'),
      isEmergency ? 1 : 0,
      'reported',
      photoUrl || '',
      voiceNoteUrl || '',
      finalVisibility,
      1,
      0,
      departmentId || 'dept-roads',
      departmentName || 'Roads & Public Infrastructure',
      slaTotal,
      slaTotal,
      95,
      JSON.stringify(timeline),
      JSON.stringify([]),
      now,
      now
    );

    // Increment user reports_submitted score if logged in
    if (currentUser) {
      db.prepare(`
        UPDATE users
        SET reports_submitted = reports_submitted + 1, civic_score = civic_score + 25, updated_at = ?
        WHERE id = ?
      `).run(now, currentUser.id);
    }

    logAudit(citizenName, 'citizen', 'CREATE_REPORT', ticketNumber, `New ${finalVisibility} issue reported in ${category}`);

    const createdReport = {
      id,
      ticketNumber,
      citizenId,
      citizenName,
      citizenEmail,
      title,
      description,
      category,
      customCategory,
      location,
      severity: isEmergency ? 'critical' : (severity || 'high'),
      emergency: isEmergency,
      status: 'reported',
      photoUrl: photoUrl || '',
      voiceNoteUrl: voiceNoteUrl || '',
      visibility: finalVisibility,
      upvotesCount: 1,
      duplicatesCount: 0,
      departmentId: departmentId || 'dept-roads',
      departmentName: departmentName || 'Roads & Public Infrastructure',
      slaHoursTotal: slaTotal,
      slaHoursRemaining: slaTotal,
      aiConfidence: 95,
      reportedAt: now,
      updatedAt: now,
      timeline,
      notes: []
    };

    return NextResponse.json({ success: true, data: createdReport });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
