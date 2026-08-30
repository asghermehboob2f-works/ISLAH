import { NextResponse } from 'next/server';
import { getDb } from '@/lib/server/db';
import { getCurrentUser, logAudit } from '@/lib/server/auth';
import { getDepartmentForCategory } from '@/lib/departmentRouting';

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

    const data = rows.map((r) => {
      const isSensitive = Boolean(r.is_sensitive_wildlife);
      // Protect sensitive wildlife coordinates: if not staff/admin and sensitive, replace exact lat/lng with approx coords
      const displayLat = (!isStaffOrAdmin && isSensitive && r.approx_latitude) ? r.approx_latitude : r.latitude;
      const displayLng = (!isStaffOrAdmin && isSensitive && r.approx_longitude) ? r.approx_longitude : r.longitude;

      return {
        id: r.id,
        ticketNumber: r.ticket_number,
        citizenId: r.citizen_id,
        citizenName: r.citizen_name,
        citizenEmail: r.citizen_email,
        title: r.title,
        description: r.description,
        category: r.category,
        subcategory: r.subcategory || undefined,
        customCategory: r.custom_category,
        isSensitiveWildlife: isSensitive,
        approxLocation: r.approx_latitude ? { lat: r.approx_latitude, lng: r.approx_longitude } : undefined,
        rejectionReason: r.rejection_reason || undefined,
        evidenceFiles: JSON.parse(r.evidence_files_json || '[]'),
        location: {
          lat: displayLat,
          lng: displayLng,
          address: isSensitive && !isStaffOrAdmin ? `${r.ward || 'Protected Ecological Zone'} (Approximate Area)` : r.address,
          landmark: isSensitive && !isStaffOrAdmin ? 'Location masked for wildlife protection' : (r.landmark || ''),
          ward: r.ward || ''
        },
        severity: r.severity,
        emergency: Boolean(r.emergency),
        status: r.status,
        photoUrl: r.photo_url || '',
        resolutionPhotoUrl: r.resolution_photo_url || '',
        nextActionDate: r.next_action_date || undefined,
        voiceNoteUrl: r.voice_note_url || '',
        referenceLink: r.reference_link || undefined,
        videoUrl: r.video_url || undefined,
        documentUrl: r.document_url || undefined,
        reportType: r.report_type || (r.category === 'Environment & Wildlife' ? 'environmental' : 'civic'),
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
      };
    });

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
    
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required. Please log in to submit a report.' } },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      title,
      category,
      subcategory,
      customCategory,
      description,
      location,
      severity,
      emergency,
      departmentId: reqDeptId,
      departmentName: reqDeptName,
      photoUrl,
      voiceNoteUrl,
      referenceLink,
      videoUrl,
      documentUrl,
      reportType: reqReportType,
      visibility,
      slaHoursTotal,
      isSensitiveWildlife: reqSensitive,
      evidenceFiles
    } = body;

    if (!title || !category || !location || !location.address) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Report title, category, and address are required.' } },
        { status: 400 }
      );
    }

    const isEnvCategory = category === 'Environment & Wildlife';
    const reportType = reqReportType || (isEnvCategory ? 'environmental' : 'civic');
    const isEmergency = Boolean(emergency);

    const db = getDb();
    const id = `iss-${Date.now().toString().slice(-6)}`;
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const ticketNumber = reportType === 'environmental' 
      ? `ISLAH-ENV-2026-${randomSuffix}` 
      : `ISLAH-CIV-2026-${randomSuffix}`;
      
    const now = new Date().toISOString();

    const citizenId = currentUser ? currentUser.id : 'usr-guest';
    const citizenName = currentUser ? currentUser.name : 'Anonymous Resident';
    const citizenEmail = currentUser ? currentUser.email : '';

    // Dynamic Category -> Department Database Routing
    let assignedDeptId = reqDeptId || '';
    let assignedDeptName = reqDeptName || '';
    let defaultSlaHours = 24;

    // 0. Check other_problems table first if customCategory or Other option selected
    if (customCategory && (!assignedDeptId || category === 'Other')) {
      const othMatch = db.prepare('SELECT department_id, department_name FROM other_problems WHERE LOWER(title) = LOWER(?) OR LOWER(id) = LOWER(?)').get(customCategory.trim(), customCategory.trim()) as any;
      if (othMatch) {
        assignedDeptId = othMatch.department_id;
        assignedDeptName = othMatch.department_name;
      }
    }

    const activeDepts = db.prepare("SELECT * FROM departments WHERE status = 'active'").all() as any[];

    // 1. Check DB for matching assigned department
    for (const d of activeDepts) {
      let catList: string[] = [];
      try { catList = JSON.parse(d.categories_json); } catch (e) {}

      const matchesEmergency = isEmergency && catList.some(c => 
        c.toLowerCase().includes('emergency') || c === 'Public Safety & Hazards'
      );
      const matchesSubcategory = subcategory && catList.includes(subcategory);
      const matchesCategory = catList.includes(category);

      if (matchesEmergency || matchesSubcategory || matchesCategory) {
        assignedDeptId = d.id;
        assignedDeptName = d.name;
        defaultSlaHours = d.sla_hours_default || 24;
        break;
      }
    }

    // 2. Fallback to static mapping if no specific DB match found
    if (!assignedDeptId || !assignedDeptName) {
      const deptInfo = getDepartmentForCategory(category, subcategory, isEmergency);
      assignedDeptId = deptInfo.departmentId;
      assignedDeptName = deptInfo.departmentName;
      defaultSlaHours = deptInfo.defaultSlaHours;
    }

    // Determine sensitive wildlife protection status
    const isSensitiveWildlife = Boolean(
      reqSensitive ||
      (isEnvCategory && (
        subcategory === 'Wildlife Protection' ||
        (description && (description.toLowerCase().includes('nest') || description.toLowerCase().includes('den') || description.toLowerCase().includes('endangered') || description.toLowerCase().includes('poach')))
      ))
    );

    // Calculate approximate coordinates for sensitive wildlife privacy (offset ~400-600m)
    const exactLat = location.lat || 28.6139;
    const exactLng = location.lng || 77.2090;
    const latOffset = (Math.random() - 0.5) * 0.008; // ~400-500m
    const lngOffset = (Math.random() - 0.5) * 0.008;
    const approxLat = exactLat + latOffset;
    const approxLng = exactLng + lngOffset;

    const slaTotal = isEmergency ? 4 : (slaHoursTotal || defaultSlaHours || 24);
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
        title: 'Department Routing & Registration',
        description: `Ticket ${ticketNumber} categorized under ${category}${subcategory ? ` (${subcategory})` : ''}. Routed to ${assignedDeptName}.`,
        actor: 'ISLAH Core Engine',
        actorRole: 'system'
      }
    ];

    db.prepare(`
      INSERT INTO issues (
        id, ticket_number, citizen_id, citizen_name, citizen_email,
        title, description, category, subcategory, custom_category, address, landmark, ward,
        latitude, longitude, severity, emergency, status, photo_url, voice_note_url,
        reference_link, video_url, document_url, report_type,
        visibility, is_sensitive_wildlife, approx_latitude, approx_longitude, evidence_files_json,
        upvotes_count, duplicates_count, department_id, department_name,
        sla_hours_total, sla_hours_remaining, ai_confidence, timeline_json, notes_json,
        reported_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      ticketNumber,
      citizenId,
      citizenName,
      citizenEmail,
      title,
      description || `Report submitted under ${category}`,
      category,
      subcategory || null,
      customCategory || null,
      location.address,
      location.landmark || null,
      location.ward || null,
      exactLat,
      exactLng,
      isEmergency ? 'critical' : (severity || 'high'),
      isEmergency ? 1 : 0,
      'reported',
      photoUrl || '',
      voiceNoteUrl || '',
      referenceLink || null,
      videoUrl || null,
      documentUrl || null,
      reportType,
      finalVisibility,
      isSensitiveWildlife ? 1 : 0,
      approxLat,
      approxLng,
      JSON.stringify(evidenceFiles || []),
      1,
      0,
      assignedDeptId,
      assignedDeptName,
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

    logAudit(citizenName, 'citizen', 'CREATE_REPORT', ticketNumber, `New ${finalVisibility} report in ${category} (${subcategory || 'General'})`);

    const createdReport = {
      id,
      ticketNumber,
      citizenId,
      citizenName,
      citizenEmail,
      title,
      description,
      category,
      subcategory,
      customCategory,
      isSensitiveWildlife,
      approxLocation: { lat: approxLat, lng: approxLng },
      evidenceFiles: evidenceFiles || [],
      location,
      severity: isEmergency ? 'critical' : (severity || 'high'),
      emergency: isEmergency,
      status: 'reported',
      photoUrl: photoUrl || '',
      voiceNoteUrl: voiceNoteUrl || '',
      visibility: finalVisibility,
      upvotesCount: 1,
      duplicatesCount: 0,
      departmentId: assignedDeptId,
      departmentName: assignedDeptName,
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
