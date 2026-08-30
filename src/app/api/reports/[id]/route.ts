import { NextResponse } from 'next/server';
import { getDb } from '@/lib/server/db';
import { getCurrentUser, logAudit } from '@/lib/server/auth';
import { verifyResolution } from '@/lib/aiService';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const db = getDb();
    const currentUser = await getCurrentUser();

    const r = db.prepare(`
      SELECT * FROM issues WHERE LOWER(id) = ? OR LOWER(ticket_number) = ?
    `).get(id.toLowerCase(), id.toLowerCase()) as any;

    if (!r) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Report ticket not found.' } },
        { status: 404 }
      );
    }

    // Privacy check
    const isStaffOrAdmin = currentUser?.role === 'staff' || currentUser?.role === 'admin';
    const isOwner = currentUser && currentUser.id === r.citizen_id;

    if (r.visibility === 'PRIVATE' && !isStaffOrAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'This report is marked private by the resident.' } },
        { status: 403 }
      );
    }

    const isSensitive = Boolean(r.is_sensitive_wildlife);
    const displayLat = (!isStaffOrAdmin && isSensitive && r.approx_latitude) ? r.approx_latitude : r.latitude;
    const displayLng = (!isStaffOrAdmin && isSensitive && r.approx_longitude) ? r.approx_longitude : r.longitude;

    const data = {
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
        address: isSensitive && !isStaffOrAdmin ? `${r.ward || 'Protected Ecological Zone'} (Approximate Coordinates)` : r.address,
        landmark: isSensitive && !isStaffOrAdmin ? 'Protected wildlife location coordinates masked' : (r.landmark || ''),
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
    };

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required to update ticket.' } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { status: newStatus, resolutionPhotoUrl, note, departmentId: newDeptId, severity: newSeverity, rejectionReason } = body;

    const db = getDb();
    const r = db.prepare(`
      SELECT * FROM issues WHERE LOWER(id) = ? OR LOWER(ticket_number) = ?
    `).get(id.toLowerCase(), id.toLowerCase()) as any;

    if (!r) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Report ticket not found.' } },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();
    const existingTimeline = JSON.parse(r.timeline_json || '[]');
    const existingNotes = JSON.parse(r.notes_json || '[]');

    let updatedStatus = r.status;
    let updatedDeptId = r.department_id;
    let updatedDeptName = r.department_name;
    let updatedSeverity = r.severity;
    let updatedResolutionPhoto = r.resolution_photo_url;
    let updatedRejectionReason = r.rejection_reason;
    let aiVerifStatus = r.ai_verification_status;
    let aiVerifScore = r.ai_verification_score;

    // Handle Severity Update
    if (newSeverity && newSeverity !== r.severity) {
      updatedSeverity = newSeverity;
      existingTimeline.push({
        id: `tl-${Date.now()}`,
        timestamp: now,
        status: updatedStatus,
        title: `Severity Changed to ${newSeverity.toUpperCase()}`,
        description: `Severity adjusted by ${currentUser.name}`,
        actor: currentUser.name,
        actorRole: currentUser.role
      });
    }

    // Handle Status Update Lifecycle
    if (newStatus && newStatus !== r.status) {
      updatedStatus = newStatus;

      let eventTitle = `Status updated to ${newStatus.toUpperCase()}`;
      if (newStatus === 'under_review') eventTitle = 'Report Under Initial Review';
      if (newStatus === 'verified') eventTitle = 'Incident & Location Verified';
      if (newStatus === 'assigned') eventTitle = 'Dispatched to Field Officer';
      if (newStatus === 'acknowledged') eventTitle = 'Department Acknowledged';
      if (newStatus === 'in_progress') eventTitle = 'Field Protection Action Underway';
      if (newStatus === 'resolved') eventTitle = 'Environmental Incident Resolved';
      if (newStatus === 'escalated') eventTitle = 'SLA Escalation Issued';
      if (newStatus === 'rejected') {
        eventTitle = 'Report Marked Invalid / Rejected';
        updatedRejectionReason = rejectionReason || note || 'Marked invalid upon inspection.';
      }

      if (newStatus === 'resolved' && resolutionPhotoUrl) {
        updatedResolutionPhoto = resolutionPhotoUrl;
        const vResult = await verifyResolution(r.photo_url || '', resolutionPhotoUrl);
        aiVerifStatus = vResult.status;
        aiVerifScore = vResult.verificationScore;
      }

      existingTimeline.push({
        id: `tl-${Date.now()}`,
        timestamp: now,
        status: newStatus,
        title: eventTitle,
        description: newStatus === 'rejected' ? `Reason: ${updatedRejectionReason}` : (note || `Action updated by ${currentUser.name}`),
        actor: currentUser.name,
        actorRole: currentUser.role,
        mediaUrl: resolutionPhotoUrl || undefined
      });
    }

    // Handle Department Reassignment
    if (newDeptId && newDeptId !== r.department_id) {
      const deptObj = db.prepare('SELECT name FROM departments WHERE id = ?').get(newDeptId) as any;
      if (deptObj) {
        updatedDeptId = newDeptId;
        updatedDeptName = deptObj.name;

        existingTimeline.push({
          id: `tl-${Date.now()}`,
          timestamp: now,
          status: updatedStatus,
          title: 'Department Reassigned',
          description: `Reassigned to ${deptObj.name} by ${currentUser.name}`,
          actor: currentUser.name,
          actorRole: currentUser.role
        });
      }
    }

    // Handle Note Addition
    if (note) {
      existingNotes.push({
        id: `note-${Date.now()}`,
        author: currentUser.name,
        role: currentUser.role,
        text: note,
        timestamp: now
      });
    }

    db.prepare(`
      UPDATE issues
      SET status = ?, severity = ?, department_id = ?, department_name = ?, resolution_photo_url = ?,
          rejection_reason = ?, ai_verification_status = ?, ai_verification_score = ?,
          timeline_json = ?, notes_json = ?, updated_at = ?
      WHERE id = ?
    `).run(
      updatedStatus,
      updatedSeverity,
      updatedDeptId,
      updatedDeptName,
      updatedResolutionPhoto || null,
      updatedRejectionReason || null,
      aiVerifStatus || null,
      aiVerifScore || null,
      JSON.stringify(existingTimeline),
      JSON.stringify(existingNotes),
      now,
      r.id
    );

    logAudit(currentUser.name, currentUser.role, 'UPDATE_REPORT', r.ticket_number, `Updated ticket status=${updatedStatus}, dept=${updatedDeptName}`);

    return NextResponse.json({
      success: true,
      message: 'Ticket updated successfully.'
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
