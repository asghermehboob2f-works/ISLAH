import { NextResponse } from 'next/server';
import { getDb } from '@/lib/server/db';

export async function GET() {
  try {
    const db = getDb();

    // Fetch all environmental reports
    const rows = db.prepare(`
      SELECT * FROM issues WHERE category = 'Environment & Wildlife' ORDER BY reported_at DESC
    `).all() as any[];

    const totalEnvironmentalReports = rows.length;

    let wildlifeReports = 0;
    let forestReports = 0;
    let waterReports = 0;
    let pollutionReports = 0;
    let activeEmergencies = 0;
    let resolvedReports = 0;

    const subcategoryCounts: Record<string, number> = {
      'Wildlife Protection': 0,
      'Forest & Land Protection': 0,
      'Water & Ecosystem Protection': 0,
      'Environmental Pollution': 0,
      'Environmental Emergencies': 0,
      'Other Environmental Issue': 0
    };

    const severityCounts: Record<string, number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };

    const regionCounts: Record<string, number> = {};

    rows.forEach((r) => {
      const subcat = r.subcategory || 'Other Environmental Issue';
      subcategoryCounts[subcat] = (subcategoryCounts[subcat] || 0) + 1;

      if (subcat === 'Wildlife Protection' || r.title.toLowerCase().includes('wildlife') || r.title.toLowerCase().includes('animal')) {
        wildlifeReports++;
      } else if (subcat === 'Forest & Land Protection' || r.title.toLowerCase().includes('forest') || r.title.toLowerCase().includes('tree')) {
        forestReports++;
      } else if (subcat === 'Water & Ecosystem Protection' || r.title.toLowerCase().includes('water') || r.title.toLowerCase().includes('river')) {
        waterReports++;
      } else if (subcat === 'Environmental Pollution' || r.title.toLowerCase().includes('dumping') || r.title.toLowerCase().includes('pollution')) {
        pollutionReports++;
      }

      if (Boolean(r.emergency) || subcat === 'Environmental Emergencies') {
        activeEmergencies++;
      }

      if (r.status === 'resolved') {
        resolvedReports++;
      }

      if (r.severity && severityCounts[r.severity] !== undefined) {
        severityCounts[r.severity]++;
      }

      const ward = r.ward || 'General Zone';
      regionCounts[ward] = (regionCounts[ward] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      data: {
        totalEnvironmentalReports,
        wildlifeReports,
        forestReports,
        waterReports,
        pollutionReports,
        activeEmergencies,
        resolvedReports,
        resolutionRate: totalEnvironmentalReports > 0 ? Math.round((resolvedReports / totalEnvironmentalReports) * 100) : 100,
        subcategoryCounts,
        severityCounts,
        regionCounts
      }
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
