'use client';

import React from 'react';
import { Eye, EyeOff, ShieldAlert, Clock } from 'lucide-react';

interface StepVisibilityEmergencyProps {
  reportType: 'civic' | 'environmental';
  visibility: 'PUBLIC' | 'PRIVATE';
  emergency: boolean;
  onVisibilityChange: (val: 'PUBLIC' | 'PRIVATE') => void;
  onEmergencyChange: (val: boolean) => void;
}

export function StepVisibilityEmergency({
  reportType,
  visibility,
  emergency,
  onVisibilityChange,
  onEmergencyChange
}: StepVisibilityEmergencyProps) {
  const isEnv = reportType === 'environmental';

  return (
    <div className="bg-[--bg-surface] rounded-xl border border-[--border] p-5 sm:p-6 space-y-6 shadow-xs font-sans">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-[--text-primary]">
          Configure Privacy & Urgency Level
        </h2>
        <p className="text-xs text-[--text-secondary]">
          Choose whether your report is public on community maps and flag immediate life-safety emergencies.
        </p>
      </div>

      <div className="space-y-5">

        {/* Public / Private Visibility Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-[--text-primary] uppercase tracking-wider block">
            Public Visibility <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

            {/* Public Option */}
            <button
              type="button"
              onClick={() => onVisibilityChange('PUBLIC')}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 cursor-pointer ${visibility === 'PUBLIC'
                  ? 'bg-blue-600/10 border-blue-600 ring-1 ring-blue-500/30 text-[--text-primary] shadow-xs'
                  : 'bg-[--bg-surface] border-[--border] hover:border-blue-500/30 text-[--text-secondary]'
                }`}
            >
              <div>
                <h3 className="font-bold text-xs text-[--text-primary] flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Make Report Public
                </h3>
                <p className="text-[11px] text-[--text-secondary] mt-1 leading-snug">
                  Appears in ISLAH public community feed & live map. Enables community upvotes.
                  {isEnv && ' (Sensitive wildlife GPS coordinates remain protected)'}
                </p>
              </div>
            </button>

            {/* Private Option */}
            <button
              type="button"
              onClick={() => onVisibilityChange('PRIVATE')}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 cursor-pointer ${visibility === 'PRIVATE'
                  ? 'bg-[--bg-subtle] border-[--border] ring-1 ring-blue-500/30 text-[--text-primary] shadow-xs'
                  : 'bg-[--bg-surface] border-[--border] hover:border-blue-500/30 text-[--text-secondary]'
                }`}
            >
              <div>
                <h3 className="font-bold text-xs text-[--text-primary] flex items-center gap-1.5">
                  <EyeOff className="w-4 h-4 text-[--text-secondary]" /> Keep Report Private
                </h3>
                <p className="text-[11px] text-[--text-secondary] mt-1 leading-snug">
                  Only accessible to you, authorized municipal department staff, and system admins. Hidden from public map.
                </p>
              </div>
            </button>

          </div>
        </div>

        {/* Emergency / Immediate Hazard Flag */}
        <div className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${emergency ? 'bg-red-500/10 border-red-500/30 ring-1 ring-red-500/20' : 'bg-[--bg-subtle] border-[--border]'
          }`}>
          <div className="space-y-1">
            <div className="font-bold text-xs text-[--text-primary] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span>Is this an emergency or immediate hazard?</span>
              {emergency && (
                <span className="text-[10px] font-mono font-bold bg-red-600 text-white px-2 py-0.5 rounded flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 4-HOUR SLA PRIORITY
                </span>
              )}
            </div>
            <p className="text-[11px] text-[--text-secondary] leading-snug">
              Check this box for active forest fires, dangerous structure collapse, live exposed power cables, major toxic chemical spills, or immediate wildlife danger.
            </p>
          </div>

          <label className="inline-flex items-center gap-2 cursor-pointer shrink-0 bg-[--bg-surface] border border-[--border] px-3.5 py-2 rounded-xl shadow-xs">
            <input
              type="checkbox"
              checked={emergency}
              onChange={(e) => onEmergencyChange(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded focus:ring-red-500 cursor-pointer"
            />
            <span className="text-xs font-semibold text-[--text-primary]">Mark as Emergency</span>
          </label>
        </div>

      </div>
    </div>
  );
}
