'use client';

import React from 'react';
import { 
  Building2, 
  Trees, 
  MapPin, 
  Globe, 
  Lock, 
  ShieldAlert, 
  Volume2, 
  Edit, 
  Link as LinkIcon, 
  Loader2,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { IssueCategory, EnvironmentalSubcategory } from '@/lib/types';
import { getDepartmentForCategory } from '@/lib/departmentRouting';

interface StepReviewProps {
  reportType: 'civic' | 'environmental';
  category: IssueCategory | string;
  subcategory?: EnvironmentalSubcategory | string;
  photoUrl: string;
  evidenceFiles: string[];
  referenceLink: string;
  lat: number;
  lng: number;
  address: string;
  landmark: string;
  ward: string;
  title: string;
  description: string;
  voiceNoteUrl: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  emergency: boolean;
  onEditStep: (step: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function StepReview({
  reportType,
  category,
  subcategory,
  photoUrl,
  evidenceFiles,
  referenceLink,
  lat,
  lng,
  address,
  landmark,
  ward,
  title,
  description,
  voiceNoteUrl,
  visibility,
  emergency,
  onEditStep,
  onSubmit,
  isSubmitting
}: StepReviewProps) {
  const isEnv = reportType === 'environmental';
  const deptInfo = getDepartmentForCategory(category, subcategory as string, emergency);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-6 shadow-xs font-sans">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-slate-900">
          Verify Report Information
        </h2>
        <p className="text-xs text-slate-500">
          Please review all details carefully before submitting. You can click "Edit" on any section to make changes.
        </p>
      </div>

      <div className="space-y-4">
        
        {/* Section 1: Category & Routing */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">01. Category & Department Routing</span>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <Edit className="w-3.5 h-3.5" /> Edit
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white shadow-xs ${
              isEnv ? 'bg-emerald-600' : 'bg-blue-600'
            }`}>
              {isEnv ? <Trees className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                {category} {subcategory ? `— ${subcategory}` : ''}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Auto-Routed Department: <strong className="text-slate-800">{deptInfo.departmentName}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Evidence */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">02. Evidence & Attachments</span>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <Edit className="w-3.5 h-3.5" /> Edit
            </button>
          </div>

          {evidenceFiles.length === 0 && !photoUrl ? (
            <p className="text-xs text-slate-500 italic">No photo or document evidence uploaded.</p>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              {evidenceFiles.map((file, idx) => (
                <div key={idx} className="w-14 h-14 rounded-lg overflow-hidden border border-slate-300 bg-slate-200">
                  {file.startsWith('blob:') || file.match(/\.(jpeg|jpg|gif|png|webp)/i) || file.includes('unsplash') ? (
                    <img src={file} alt="Evidence" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-600">
                      FILE #{idx + 1}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {referenceLink && (
            <div className="text-xs font-mono text-blue-700 bg-blue-50 border border-blue-200 p-2 rounded-lg flex items-center gap-1.5 truncate">
              <LinkIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">{referenceLink}</span>
            </div>
          )}
        </div>

        {/* Section 3: Location */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">03. Location Details</span>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <Edit className="w-3.5 h-3.5" /> Edit
            </button>
          </div>

          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900">{address}</div>
              {landmark && <div className="text-[11px] text-slate-600">Landmark: {landmark}</div>}
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                Ward: {ward || 'N/A'} • Lat: {lat}, Lng: {lng}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Details & Voice */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">04. Report Details & Voice</span>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <Edit className="w-3.5 h-3.5" /> Edit
            </button>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900">{title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
              {description || 'No additional text notes provided.'}
            </p>
          </div>

          {voiceNoteUrl && (
            <div className="pt-2">
              <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mb-1">
                <Volume2 className="w-3.5 h-3.5 text-blue-600" /> Recorded Voice Note Attached
              </div>
              <audio src={voiceNoteUrl} controls className="h-7 w-full max-w-sm" />
            </div>
          )}
        </div>

        {/* Section 5: Visibility & Emergency */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">05. Visibility & Urgency</span>
            <button
              type="button"
              onClick={() => onEditStep(5)}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <Edit className="w-3.5 h-3.5" /> Edit
            </button>
          </div>

          <div className="flex items-center gap-3 flex-wrap text-xs">
            <span className={`px-2.5 py-1 rounded-md font-bold flex items-center gap-1 ${
              visibility === 'PUBLIC' ? 'bg-blue-100 text-blue-900' : 'bg-slate-200 text-slate-900'
            }`}>
              {visibility === 'PUBLIC' ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              {visibility === 'PUBLIC' ? 'Public Report' : 'Private Confidential Report'}
            </span>

            {emergency ? (
              <span className="px-2.5 py-1 rounded-md font-bold bg-red-600 text-white flex items-center gap-1 font-mono text-[11px]">
                <ShieldAlert className="w-3.5 h-3.5 text-white" /> Emergency Hazard (4h Priority SLA)
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-md font-bold bg-slate-200 text-slate-700 flex items-center gap-1 text-[11px]">
                <Clock className="w-3.5 h-3.5" /> Standard Ticket (24h SLA)
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Submission Action Controls */}
      <div className="pt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onEditStep(5)}
          className="px-5 py-3 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 transition-all"
        >
          ← Back to Step 5
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`px-8 py-3.5 rounded-xl font-bold text-xs text-white shadow-md flex items-center gap-2 transition-all active:scale-95 ${
            isEnv ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-blue-600 hover:bg-blue-500'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Report...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Report Now →</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
