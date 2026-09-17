'use client';

import React, { useState } from 'react';
import { Upload, X, FileText, Link as LinkIcon } from 'lucide-react';

interface StepEvidenceProps {
  reportType: 'civic' | 'environmental';
  photoUrl: string;
  evidenceFiles: string[];
  referenceLink: string;
  onPhotoChange: (url: string) => void;
  onEvidenceFilesChange: (files: string[]) => void;
  onReferenceLinkChange: (link: string) => void;
}

export function StepEvidence({
  reportType,
  photoUrl,
  evidenceFiles,
  referenceLink,
  onPhotoChange,
  onEvidenceFilesChange,
  onReferenceLinkChange
}: StepEvidenceProps) {
  const isEnv = reportType === 'environmental';
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    // Read files as Base64 Data URLs for persistent display across sessions & DB
    const newFileUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newFileUrls.push(dataUrl);

      // Set primary cover photo if none set
      if (i === 0 && (!photoUrl || photoUrl.startsWith('blob:'))) {
        onPhotoChange(dataUrl);
      }
    }

    onEvidenceFilesChange([...evidenceFiles, ...newFileUrls]);
    setIsUploading(false);
  };

  const removeEvidenceFile = (indexToRemove: number) => {
    const fileToRemove = evidenceFiles[indexToRemove];
    const updated = evidenceFiles.filter((_, idx) => idx !== indexToRemove);
    onEvidenceFilesChange(updated);

    if (fileToRemove === photoUrl) {
      onPhotoChange(updated[0] || '');
    }
  };

  return (
    <div className="bg-[--bg-surface] rounded-xl border border-[--border] p-5 sm:p-6 space-y-6 shadow-xs font-sans">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-[--text-primary]">
          Upload Photos, Videos, or Documents
        </h2>
        <p className="text-xs text-[--text-secondary]">
          Clear visual evidence helps field teams verify and address the issue faster.
        </p>
      </div>

      {/* Main File Upload Box */}
      <div className="border-2 border-dashed border-[--border] rounded-xl p-6 text-center space-y-3 bg-[--bg-subtle]/50 hover:bg-[--bg-subtle] transition-colors">
        <div className="w-12 h-12 rounded-xl bg-[--bg-surface] border border-[--border] text-[--text-secondary] flex items-center justify-center mx-auto shadow-xs">
          <Upload className="w-6 h-6" />
        </div>

        <div>
          <span className="text-xs font-bold text-[--text-primary] block">
            Click to upload or drag files here
          </span>
          <p className="text-[11px] text-[--text-secondary] mt-0.5">
            Photos (JPG, PNG), Videos (MP4), Documents (PDF) up to 25MB
          </p>
        </div>

        <label className={`inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer shadow-xs transition-all ${isEnv ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}>
          <Upload className="w-3.5 h-3.5" /> Select Files
          <input
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* File Previews List */}
      {evidenceFiles.length > 0 && (
        <div className="space-y-3">
          <label className="text-xs font-bold text-[--text-primary] uppercase tracking-wider block">
            Uploaded Files ({evidenceFiles.length})
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {evidenceFiles.map((fileUrl, index) => {
              const isPrimaryPhoto = fileUrl === photoUrl;

              return (
                <div key={index} className="relative group rounded-xl border border-[--border] overflow-hidden bg-[--bg-subtle] p-2 shadow-xs space-y-1">
                  <div className="h-28 rounded-lg overflow-hidden bg-[--bg-surface] flex items-center justify-center relative border border-[--border]">
                    {fileUrl.startsWith('data:image') || fileUrl.startsWith('blob:') || fileUrl.match(/\.(jpeg|jpg|gif|png|webp)/i) || fileUrl.includes('photo') || fileUrl.includes('unsplash') || fileUrl.startsWith('http') ? (
                      <img src={fileUrl} alt="Evidence preview" className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="w-8 h-8 text-[--text-secondary]" />
                    )}

                    {isPrimaryPhoto && (
                      <span className="absolute top-1.5 left-1.5 text-[9px] font-bold bg-[--bg-surface] text-[--text-primary] border border-[--border] px-2 py-0.5 rounded-md shadow-xs">
                        Cover
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => removeEvidenceFile(index)}
                      className="absolute top-1.5 right-1.5 bg-red-600 text-white p-1 rounded-full opacity-90 hover:opacity-100 transition-opacity shadow-xs cursor-pointer"
                      title="Remove file"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[--text-secondary] px-1">
                    <span className="truncate max-w-[100px]">Evidence #{index + 1}</span>
                    {!isPrimaryPhoto && (
                      <button
                        type="button"
                        onClick={() => onPhotoChange(fileUrl)}
                        className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                      >
                        Set Cover
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Supporting Document / Reference Link */}
      <div className="bg-[--bg-subtle] border border-[--border] p-4 rounded-xl space-y-2">
        <label className="text-xs font-bold text-[--text-primary] flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-[--text-secondary]" />
          <span>Supporting Document / Reference Link (Optional)</span>
        </label>
        <p className="text-[11px] text-[--text-secondary]">
          Provide a URL or reference link for official documents, press releases, research data, or prior municipal tickets.
        </p>
        <input
          type="url"
          value={referenceLink}
          onChange={(e) => onReferenceLinkChange(e.target.value)}
          placeholder="https://example.gov/documents/report-reference.pdf"
          className="w-full border border-[--border] rounded-xl px-3 py-2 text-xs bg-[--bg-surface] text-[--text-primary] font-medium focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

    </div>
  );
}
