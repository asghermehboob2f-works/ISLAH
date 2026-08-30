'use client';

import React from 'react';
import { Type, AlignLeft } from 'lucide-react';
import { VoiceRecorder } from './VoiceRecorder';

interface StepDetailsProps {
  reportType: 'civic' | 'environmental';
  title: string;
  description: string;
  voiceNoteUrl: string;
  onTitleChange: (val: string) => void;
  onDescriptionChange: (val: string) => void;
  onVoiceNoteSaved: (url: string) => void;
}

export function StepDetails({
  reportType,
  title,
  description,
  voiceNoteUrl,
  onTitleChange,
  onDescriptionChange,
  onVoiceNoteSaved
}: StepDetailsProps) {
  const isEnv = reportType === 'environmental';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-6 shadow-xs font-sans">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-slate-900">
          Explain What Happened
        </h2>
        <p className="text-xs text-slate-500">
          Provide a descriptive title, detailed context notes, or record a quick voice message.
        </p>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1 flex items-center gap-1.5">
            <Type className="w-4 h-4 text-blue-600" />
            Report Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder={
              isEnv
                ? 'e.g. Illegal sewage discharge into local stream near forest border'
                : 'e.g. Deep pothole near main market road causing traffic hazard'
            }
            required
            className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Detailed Notes / Description */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1 flex items-center gap-1.5">
            <AlignLeft className="w-4 h-4 text-blue-600" />
            Detailed Description / Notes
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder={
              isEnv
                ? 'Describe species observed, environmental impact, recurring nature of the problem...'
                : 'Describe depth of pothole, traffic impact, duration of issue...'
            }
            className="w-full border border-slate-300 rounded-xl p-3.5 text-xs bg-slate-50 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Integrated Voice Description Component */}
        <VoiceRecorder
          onAudioSaved={onVoiceNoteSaved}
          initialAudioUrl={voiceNoteUrl}
        />

      </div>
    </div>
  );
}
