import { IssueCategory, EnvironmentalSubcategory } from './types';

export interface CategoryDepartmentMapping {
  departmentId: string;
  departmentName: string;
  code: string;
  defaultSlaHours: number;
}

// Configurable Category -> Department map (Spec #13: Future Department Routing Architecture)
export const CATEGORY_DEPARTMENT_MAP: Record<string, CategoryDepartmentMapping> = {
  // Civic Categories
  'Roads & Potholes': {
    departmentId: 'dept-roads',
    departmentName: 'Public Works & Roads Department (PWD)',
    code: 'PWD-ROADS',
    defaultSlaHours: 24,
  },
  'Potholes': {
    departmentId: 'dept-roads',
    departmentName: 'Public Works & Roads Department (PWD)',
    code: 'PWD-ROADS',
    defaultSlaHours: 24,
  },
  'Roads': {
    departmentId: 'dept-roads',
    departmentName: 'Public Works & Roads Department (PWD)',
    code: 'PWD-ROADS',
    defaultSlaHours: 24,
  },
  'Garbage & Sanitation': {
    departmentId: 'dept-sanitation',
    departmentName: 'Municipal Sanitation & Waste Department',
    code: 'SMC-WASTE',
    defaultSlaHours: 12,
  },
  'Garbage': {
    departmentId: 'dept-sanitation',
    departmentName: 'Municipal Sanitation & Waste Department',
    code: 'SMC-WASTE',
    defaultSlaHours: 12,
  },
  'Waste & Sanitation': {
    departmentId: 'dept-sanitation',
    departmentName: 'Municipal Sanitation & Waste Department',
    code: 'SMC-WASTE',
    defaultSlaHours: 12,
  },
  'Sanitation': {
    departmentId: 'dept-sanitation',
    departmentName: 'Municipal Sanitation & Waste Department',
    code: 'SMC-WASTE',
    defaultSlaHours: 12,
  },
  'Streetlights & Electrical': {
    departmentId: 'dept-electrical',
    departmentName: 'Street Lighting & Power Grid Department',
    code: 'PDD-ELEC',
    defaultSlaHours: 18,
  },
  'Streetlights': {
    departmentId: 'dept-electrical',
    departmentName: 'Street Lighting & Power Grid Department',
    code: 'PDD-ELEC',
    defaultSlaHours: 18,
  },
  'Water Supply': {
    departmentId: 'dept-water',
    departmentName: 'Water Supply & Sewerage Board (PHE)',
    code: 'PHE-WTR',
    defaultSlaHours: 24,
  },
  'Water': {
    departmentId: 'dept-water',
    departmentName: 'Water Supply & Sewerage Board (PHE)',
    code: 'PHE-WTR',
    defaultSlaHours: 24,
  },
  'Drainage & Sewage': {
    departmentId: 'dept-water',
    departmentName: 'Water Supply & Sewerage Board (PHE)',
    code: 'PHE-WTR',
    defaultSlaHours: 24,
  },
  'Drainage': {
    departmentId: 'dept-water',
    departmentName: 'Water Supply & Sewerage Board (PHE)',
    code: 'PHE-WTR',
    defaultSlaHours: 24,
  },
  'Public Infrastructure': {
    departmentId: 'dept-roads',
    departmentName: 'Public Works & Roads Department (PWD)',
    code: 'PWD-ROADS',
    defaultSlaHours: 24,
  },
  'Public Safety & Hazards': {
    departmentId: 'dept-safety',
    departmentName: 'Public Safety & Disaster Cell',
    code: 'DISAST-SAF',
    defaultSlaHours: 4,
  },
  
  // Environmental Categories / Subcategories
  'Wildlife Protection': {
    departmentId: 'dept-forest-wildlife',
    departmentName: 'Forest & Wildlife Protection Department',
    code: 'FWD-PROT',
    defaultSlaHours: 12,
  },
  'Forest Protection': {
    departmentId: 'dept-forest-wildlife',
    departmentName: 'Forest & Wildlife Protection Department',
    code: 'FWD-PROT',
    defaultSlaHours: 12,
  },
  'Forest & Land Protection': {
    departmentId: 'dept-forest-wildlife',
    departmentName: 'Forest & Wildlife Protection Department',
    code: 'FWD-PROT',
    defaultSlaHours: 12,
  },
  'Water & Ecosystem Protection': {
    departmentId: 'dept-pollution-control',
    departmentName: 'State Pollution Control Board',
    code: 'SPCB-ENV',
    defaultSlaHours: 18,
  },
  'Water & Ecosystems': {
    departmentId: 'dept-pollution-control',
    departmentName: 'State Pollution Control Board',
    code: 'SPCB-ENV',
    defaultSlaHours: 18,
  },
  'Environmental Pollution': {
    departmentId: 'dept-pollution-control',
    departmentName: 'State Pollution Control Board',
    code: 'SPCB-ENV',
    defaultSlaHours: 18,
  },
  'Environmental Emergencies': {
    departmentId: 'dept-eco-disaster',
    departmentName: 'Environmental Emergency Cell',
    code: 'EER-CELL',
    defaultSlaHours: 2,
  },
  'Environment & Wildlife': {
    departmentId: 'dept-forest-wildlife',
    departmentName: 'Forest & Wildlife Protection Department',
    code: 'FWD-PROT',
    defaultSlaHours: 12,
  },
};

export function getDepartmentForCategory(
  category: string,
  subcategory?: string,
  isEmergency?: boolean
): CategoryDepartmentMapping {
  if (isEmergency) {
    return {
      departmentId: 'dept-safety',
      departmentName: 'Public Safety & Emergency Cell',
      code: 'EMERGENCY',
      defaultSlaHours: 4,
    };
  }

  if (subcategory && CATEGORY_DEPARTMENT_MAP[subcategory]) {
    return CATEGORY_DEPARTMENT_MAP[subcategory];
  }

  if (CATEGORY_DEPARTMENT_MAP[category]) {
    return CATEGORY_DEPARTMENT_MAP[category];
  }

  return {
    departmentId: 'dept-roads',
    departmentName: 'General Municipal Administration',
    code: 'GMA-GEN',
    defaultSlaHours: 24,
  };
}
