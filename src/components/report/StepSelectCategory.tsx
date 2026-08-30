'use client';

import React from 'react';
import { 
  Building2, 
  Construction, 
  Trash2, 
  Zap, 
  Droplets, 
  Waves, 
  AlertTriangle, 
  Trees, 
  Bird, 
  ShieldAlert, 
  CheckCircle2,
  Biohazard,
  Factory
} from 'lucide-react';
import { IssueCategory, EnvironmentalSubcategory } from '@/lib/types';

interface StepSelectCategoryProps {
  reportType: 'civic' | 'environmental';
  selectedCategory: IssueCategory | string;
  selectedSubcategory?: EnvironmentalSubcategory | string;
  customCategory?: string;
  onSelectCategory: (cat: IssueCategory | string, subcat?: EnvironmentalSubcategory | string) => void;
  onCustomCategoryChange?: (val: string) => void;
}

const CIVIC_CATEGORIES = [
  { name: 'Roads', icon: Construction, desc: 'Asphalt cavities, cave-ins, and road surface hazards' },
  { name: 'Potholes', icon: Construction, desc: 'Deep road holes damaging vehicles and causing accidents' },
  { name: 'Garbage & Sanitation', icon: Trash2, desc: 'Overflowing dumpsters, uncollected waste, illegal dumping' },
  { name: 'Drainage & Sewage', icon: Waves, desc: 'Clogged drains, wastewater spills, manhole overflows' },
  { name: 'Streetlights & Electrical', icon: Zap, desc: 'Dark corridors, damaged poles, exposed electrical wires' },
  { name: 'Water Supply', icon: Droplets, desc: 'Pipeline leaks, clean water waste, supply outages' },
  { name: 'Sanitation', icon: Trash2, desc: 'Public toilet maintenance and community sanitation hazards' },
  { name: 'Public Infrastructure', icon: Building2, desc: 'Damaged footpaths, broken benches, public assets' },
  { name: 'Other', icon: AlertTriangle, desc: 'Custom or unlisted municipal civic problem' }
];

const ENVIRONMENTAL_CATEGORIES = [
  {
    name: 'Environment & Wildlife',
    subcategory: 'Wildlife Protection' as EnvironmentalSubcategory,
    icon: Bird,
    desc: 'Injured animals, poaching, illegal capture, trafficking, habitat disturbance'
  },
  {
    name: 'Environment & Wildlife',
    subcategory: 'Forest & Land Protection' as EnvironmentalSubcategory,
    icon: Trees,
    desc: 'Illegal tree cutting, deforestation, forest encroachment, logging'
  },
  {
    name: 'Environment & Wildlife',
    subcategory: 'Water & Ecosystem Protection' as EnvironmentalSubcategory,
    icon: Droplets,
    desc: 'River/lake pollution, sewage discharge, industrial contamination, fish kills'
  },
  {
    name: 'Environment & Wildlife',
    subcategory: 'Environmental Pollution' as EnvironmentalSubcategory,
    icon: Factory,
    desc: 'Illegal hazardous dumping, severe plastic pollution, toxic air/soil contamination'
  },
  {
    name: 'Environment & Wildlife',
    subcategory: 'Environmental Emergencies' as EnvironmentalSubcategory,
    icon: ShieldAlert,
    desc: 'Active forest fire, major chemical spill, immediate wildlife disaster'
  },
  {
    name: 'Environment & Wildlife',
    subcategory: 'Other Environmental Issue' as EnvironmentalSubcategory,
    icon: Biohazard,
    desc: 'Other ecological threats, ecosystem damage, or environmental hazards'
  }
];

export function StepSelectCategory({
  reportType,
  selectedCategory,
  selectedSubcategory,
  customCategory = '',
  onSelectCategory,
  onCustomCategoryChange
}: StepSelectCategoryProps) {
  const isEnv = reportType === 'environmental';
  const categories = isEnv ? ENVIRONMENTAL_CATEGORIES : CIVIC_CATEGORIES;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5 shadow-xs font-sans">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-slate-900">
          {isEnv ? 'What type of environmental issue are you reporting?' : 'What type of civic problem are you reporting?'}
        </h2>
        <p className="text-xs text-slate-500">
          Choose the category that best matches the issue. This routes your report to the correct department.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          let isSelected = false;

          if (isEnv) {
            isSelected = selectedSubcategory === (cat as any).subcategory;
          } else {
            isSelected = selectedCategory === cat.name;
          }

          return (
            <button
              type="button"
              key={idx}
              onClick={() => {
                if (isEnv) {
                  onSelectCategory(cat.name, (cat as any).subcategory);
                } else {
                  onSelectCategory(cat.name);
                }
              }}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-3 cursor-pointer group ${
                isSelected
                  ? isEnv
                    ? 'bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-600/20 text-slate-900 shadow-xs'
                    : 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-600/20 text-slate-900 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  isSelected
                    ? isEnv ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && (
                  <CheckCircle2 className={`w-5 h-5 ${isEnv ? 'text-emerald-600' : 'text-blue-600'}`} />
                )}
              </div>

              <div>
                <h3 className="font-bold text-xs text-slate-900">
                  {isEnv ? (cat as any).subcategory : cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  {cat.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Selector & Manual Input for 'Other' Option */}
      {((!isEnv && selectedCategory === 'Other') || (isEnv && selectedSubcategory === 'Other Environmental Issue')) && (
        <OtherCategorySelector
          customCategory={customCategory}
          onCustomCategoryChange={onCustomCategoryChange}
          isEnv={isEnv}
        />
      )}
    </div>
  );
}

function OtherCategorySelector({
  customCategory,
  onCustomCategoryChange,
  isEnv
}: {
  customCategory: string;
  onCustomCategoryChange?: (val: string) => void;
  isEnv: boolean;
}) {
  const [options, setOptions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/other-options')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setOptions(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 mt-4 animate-in fade-in duration-200">
      <div>
        <label className="text-xs font-bold text-slate-800 block mb-1">
          Select or Specify Special Problem Category
        </label>
        <p className="text-[11px] text-slate-500 mb-2">
          Choose a specific issue type to ensure accurate dynamic routing to the responsible department.
        </p>
      </div>

      {!loading && options.length > 0 && (
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">
            Common Unlisted Issues:
          </label>
          <select
            value={customCategory}
            onChange={(e) => onCustomCategoryChange && onCustomCategoryChange(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs bg-white text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">-- Choose from preset issue options --</option>
            {options.map((opt) => (
              <option key={opt.id} value={opt.title}>
                {opt.title} ({opt.departmentName})
              </option>
            ))}
            <option value="CUSTOM_OTHER">Custom / Unlisted Issue (Enter details below)</option>
          </select>
        </div>
      )}

      <div>
        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
          {options.length > 0 ? 'Or Type Custom Problem Description:' : 'Problem Details:'}
        </label>
        <input
          type="text"
          value={customCategory === 'CUSTOM_OTHER' ? '' : customCategory}
          onChange={(e) => onCustomCategoryChange && onCustomCategoryChange(e.target.value)}
          placeholder="e.g. Stray Cattle Hazard near market, Illegal Hoarding blocking traffic signal..."
          className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs bg-white text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
    </div>
  );
}
