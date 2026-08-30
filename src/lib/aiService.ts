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

  if (srcStr.includes('tree') || srcStr.includes('forest') || srcStr.includes('deforest') || srcStr.includes('wood') || srcStr.includes('logging')) {
    category = 'Environment & Wildlife';
    detectedLabel = 'AI Assessment: Possible Illegal Tree Cutting';
    confidence = 92;
    suggestedSeverity = 'high';
    departmentId = 'dept-forest-wildlife';
    departmentName = 'Forest & Wildlife Protection Department';
    reasoning = 'Computer vision detected vegetation canopy loss and timber extraction signatures.';
  } else if (srcStr.includes('fire') || srcStr.includes('smoke') || srcStr.includes('wildfire') || srcStr.includes('blaze')) {
    category = 'Environment & Wildlife';
    detectedLabel = 'AI Assessment: Possible Forest Fire';
    confidence = 96;
    suggestedSeverity = 'critical';
    departmentId = 'dept-eco-disaster';
    departmentName = 'Environmental Emergency Cell';
    reasoning = 'Thermal and smoke visual indicators indicate active vegetation combustion emergency.';
  } else if (srcStr.includes('animal') || srcStr.includes('wildlife') || srcStr.includes('poach') || srcStr.includes('bird') || srcStr.includes('deer') || srcStr.includes('bear') || srcStr.includes('snare') || srcStr.includes('trap')) {
    category = 'Environment & Wildlife';
    detectedLabel = 'AI Assessment: Possible Wildlife Injury / Threat';
    confidence = 91;
    suggestedSeverity = 'high';
    departmentId = 'dept-forest-wildlife';
    departmentName = 'Forest & Wildlife Protection Department';
    reasoning = 'Visual indicators suggest distressed fauna or habitat intrusion risk.';
  } else if (srcStr.includes('pollut') || srcStr.includes('river') || srcStr.includes('lake') || srcStr.includes('chemical') || srcStr.includes('oil') || srcStr.includes('spill') || srcStr.includes('toxic') || srcStr.includes('fish')) {
    category = 'Environment & Wildlife';
    detectedLabel = 'AI Assessment: Possible Water Pollution';
    confidence = 94;
    suggestedSeverity = 'critical';
    departmentId = 'dept-pollution-control';
    departmentName = 'State Pollution Control Board';
    reasoning = 'High visual discolouration and chemical effluent plume detected in aquatic ecosystem.';
  } else if (srcStr.includes('plastic') || srcStr.includes('eco') || srcStr.includes('env') || srcStr.includes('waste') || srcStr.includes('garbage') || srcStr.includes('sanitation') || srcStr.includes('dump')) {
    category = 'Environment & Wildlife';
    detectedLabel = 'AI Assessment: Possible Illegal Dumping';
    confidence = 93;
    suggestedSeverity = 'medium';
    departmentId = 'dept-pollution-control';
    departmentName = 'State Pollution Control Board';
    reasoning = 'Unsanctioned refuse accumulation in natural ecological buffer zone.';
  } else if (srcStr.includes('electric') || srcStr.includes('light') || srcStr.includes('lamp') || srcStr.includes('cable')) {
    category = 'Streetlights & Electrical';
    detectedLabel = 'AI Assessment: Possible Luminaire & Electrical Defect';
    confidence = 93;
    suggestedSeverity = 'medium';
    departmentId = 'dept-electrical';
    departmentName = 'Street Lighting & Power Grid';
    reasoning = 'Computer vision detected unlit public luminaire and loose electrical wiring.';
  } else if (srcStr.includes('water') || srcStr.includes('pipe') || srcStr.includes('leak') || srcStr.includes('sewage') || srcStr.includes('drain')) {
    category = 'Water Supply';
    detectedLabel = 'AI Assessment: Possible Pipeline Leak';
    confidence = 96;
    suggestedSeverity = 'high';
    departmentId = 'dept-water';
    departmentName = 'Water Supply & Sewerage Board';
    reasoning = 'Computer vision detected active water pipe leak and surface accumulation.';
  } else if (srcStr.includes('hazard') || srcStr.includes('wire') || srcStr.includes('danger') || srcStr.includes('emergency')) {
    category = 'Public Safety & Hazards';
    detectedLabel = 'AI Assessment: Possible Urgent Safety Risk';
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
