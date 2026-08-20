import { IssueCategory, IssueSeverity, CivicIssue } from './types';

export interface AIClassificationResult {
  category: IssueCategory;
  confidence: number;
  detectedLabel: string;
  suggestedSeverity: IssueSeverity;
  departmentId: string;
  departmentName: string;
  reasoning?: string;
  duplicateScan: {
    hasPotentialDuplicate: boolean;
    duplicateTicket?: string;
    distanceMeters?: number;
  };
}

export interface AIVerificationResult {
  verificationScore: number;
  status: 'Verified' | 'Needs Review' | 'Unable to Verify';
  structuralMatch: boolean;
  cleanlinessScore: number;
  analysisSummary: string;
}

export async function classifyImage(
  imageSource: string | File,
  lat?: number,
  lng?: number,
  existingIssues: CivicIssue[] = []
): Promise<AIClassificationResult> {
  // Simulate AI model inference delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  let category: IssueCategory = 'Roads & Potholes';
  let detectedLabel = 'Asphalt & Pothole Surface Damage';
  let confidence = 95;
  let suggestedSeverity: IssueSeverity = 'high';
  let departmentId = 'dept-roads';
  let departmentName = 'Roads & Public Infrastructure';
  let reasoning = 'Computer vision detected deep asphalt erosion and road surface hazard.';

  // Check if string matches known patterns or sample images
  const srcStr = typeof imageSource === 'string' ? imageSource.toLowerCase() : imageSource.name.toLowerCase();

  if (srcStr.includes('waste') || srcStr.includes('garbage') || srcStr.includes('sanitation') || srcStr.includes('dump')) {
    category = 'Waste & Sanitation';
    detectedLabel = 'Solid Waste & Overflow Accumulation';
    confidence = 94;
    suggestedSeverity = 'medium';
    departmentId = 'dept-sanitation';
    departmentName = 'Waste Management & Sanitation';
    reasoning = 'Computer vision identified overflowing refuse bins and solid waste accumulation.';
  } else if (srcStr.includes('electric') || srcStr.includes('light') || srcStr.includes('lamp') || srcStr.includes('cable')) {
    category = 'Streetlights & Electrical';
    detectedLabel = 'Luminaire & Electrical Line Defect';
    confidence = 93;
    suggestedSeverity = 'medium';
    departmentId = 'dept-electrical';
    departmentName = 'Street Lighting & Power Grid';
    reasoning = 'Computer vision detected unlit public luminaire and loose electrical wiring.';
  } else if (srcStr.includes('water') || srcStr.includes('pipe') || srcStr.includes('leak') || srcStr.includes('sewage') || srcStr.includes('drain')) {
    category = 'Water Supply';
    detectedLabel = 'Pressurized Pipeline & Hydrological Leakage';
    confidence = 96;
    suggestedSeverity = 'high';
    departmentId = 'dept-water';
    departmentName = 'Water Supply & Sewerage Board';
    reasoning = 'Computer vision detected active water pipe leak and surface accumulation.';
  } else if (srcStr.includes('hazard') || srcStr.includes('wire') || srcStr.includes('danger') || srcStr.includes('emergency')) {
    category = 'Public Safety & Hazards';
    detectedLabel = 'Urgent Public Safety Risk Exposure';
    confidence = 98;
    suggestedSeverity = 'critical';
    departmentId = 'dept-safety';
    departmentName = 'Public Safety & Disaster Cell';
    reasoning = 'High risk structural or electrical hazard requiring immediate dispatch.';
  }

  // Perform ~50 meter duplicate detection scan
  let hasPotentialDuplicate = false;
  let duplicateTicket: string | undefined;
  let distanceMeters: number | undefined;

  if (lat && lng && existingIssues.length > 0) {
    for (const issue of existingIssues) {
      if (issue.category === category && issue.status !== 'resolved') {
        // Calculate approximate distance in meters
        const dLat = (issue.location.lat - lat) * 111000;
        const dLng = (issue.location.lng - lng) * 111000 * Math.cos(lat * (Math.PI / 180));
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);

        if (dist <= 60) { // ~50-60 meters
          hasPotentialDuplicate = true;
          duplicateTicket = issue.ticketNumber;
          distanceMeters = Math.round(dist);
          break;
        }
      }
    }
  }

  return {
    category,
    confidence,
    detectedLabel,
    suggestedSeverity,
    departmentId,
    departmentName,
    reasoning,
    duplicateScan: {
      hasPotentialDuplicate,
      duplicateTicket,
      distanceMeters
    }
  };
}

export async function verifyResolution(
  beforePhotoUrl: string,
  resolutionPhotoUrl: string
): Promise<AIVerificationResult> {
  // Simulate AI visual cross-verification between before & after photos
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const isInvalid = resolutionPhotoUrl.toLowerCase().includes('fail') || resolutionPhotoUrl.toLowerCase().includes('blur');

  if (isInvalid) {
    return {
      verificationScore: 42,
      status: 'Needs Review',
      structuralMatch: false,
      cleanlinessScore: 35,
      analysisSummary: 'Low visual correlation. Resolution photo appears obscured or offset from original defect coordinates.'
    };
  }

  return {
    verificationScore: 98,
    status: 'Verified',
    structuralMatch: true,
    cleanlinessScore: 97,
    analysisSummary: 'High-confidence AI resolution match. Pothole asphalt patching confirmed with smooth surface texture alignment.'
  };
}
