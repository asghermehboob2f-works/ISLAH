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
    <div className="bg-[--bg-surface] rounded-xl border border-[--border] p-5 sm:p-6 space-y-6 shadow-xs font-sans">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-[--text-primary]">
          Explain What Happened
        </h2>
        <p className="text-xs text-[--text-secondary]">
          Provide a descriptive title, detailed context notes, or record a quick voice message.
        </p>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-xs font-semibold text-[--text-primary] block mb-1 flex items-center gap-1.5">
            <Type className="w-4 h-4 text-blue-600 dark:text-blue-400" />
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
            className="w-full border border-[--border] rounded-xl px-3.5 py-2.5 text-xs font-semibold bg-[--bg-surface] text-[--text-primary] focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Detailed Notes / Description */}
        <div>
          <label className="text-xs font-semibold text-[--text-primary] block mb-1 flex items-center gap-1.5">
            <AlignLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
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
            className="w-full border border-[--border] rounded-xl p-3.5 text-xs bg-[--bg-surface] text-[--text-primary] font-medium focus:ring-2 focus:ring-blue-500/20"
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
