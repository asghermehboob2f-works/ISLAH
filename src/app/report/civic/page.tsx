'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { StepperHeader } from '@/components/report/StepperHeader';
import { StepSelectCategory } from '@/components/report/StepSelectCategory';
import { StepEvidence } from '@/components/report/StepEvidence';
import { StepLocation } from '@/components/report/StepLocation';
import { StepDetails } from '@/components/report/StepDetails';
import { StepVisibilityEmergency } from '@/components/report/StepVisibilityEmergency';
import { StepReview } from '@/components/report/StepReview';
import { StepSuccess } from '@/components/report/StepSuccess';
import { Building2, Lock, ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react';
import { IssueCategory, EnvironmentalSubcategory } from '@/lib/types';
import { getDepartmentForCategory } from '@/lib/departmentRouting';

export default function CivicReportWizardPage() {
  const router = useRouter();
  const { user, activeRole, createReport, refreshData } = useApp();

  // Wizard Step Control (1..6 or 7 for success)
  const [step, setStep] = useState<number>(1);

  // Form State
  const [category, setCategory] = useState<IssueCategory | string>('Roads & Potholes');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [evidenceFiles, setEvidenceFiles] = useState<string[]>([]);
  const [referenceLink, setReferenceLink] = useState<string>('');
  
  const [lat, setLat] = useState<number>(34.0837);
  const [lng, setLng] = useState<number>(74.7973);
  const [address, setAddress] = useState<string>('Central Avenue, Sector 4');
  const [landmark, setLandmark] = useState<string>('');
  const [ward, setWard] = useState<string>('Ward 4 - Civil Lines');

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [voiceNoteUrl, setVoiceNoteUrl] = useState<string>('');

  const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [emergency, setEmergency] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedTicket, setSubmittedTicket] = useState<{ ticketNumber: string; deptName: string } | null>(null);

  if (!user || activeRole !== 'citizen') {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16 text-center space-y-6 font-sans">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Authentication Required</h2>
          <p className="text-xs text-slate-500">Please log in to submit a civic infrastructure report.</p>
        </div>
        <Link
          href="/login?returnUrl=/report/civic"
          className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs shadow-md"
        >
          Log In to Continue
        </Link>
      </div>
    );
  }

  // Step Validation logic
  const canProceed = () => {
    if (step === 1) return Boolean(category);
    if (step === 2) return true; // Evidence is optional according to rules
    if (step === 3) return Boolean(address.trim());
    if (step === 4) return Boolean(title.trim());
    if (step === 5) return Boolean(visibility);
    return true;
  };

  const handleNext = () => {
    if (!canProceed()) return;
    setStep((prev) => Math.min(prev + 1, 6));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitReport = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const deptInfo = getDepartmentForCategory(category, undefined, emergency);

      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || `${category} issue near ${address}`,
          category,
          description: description || `Civic issue reported under ${category}`,
          location: { lat, lng, address, landmark, ward },
          severity: emergency ? 'critical' : 'medium',
          emergency,
          photoUrl,
          evidenceFiles,
          referenceLink,
          voiceNoteUrl,
          visibility,
          reportType: 'civic',
          departmentId: deptInfo.departmentId,
          departmentName: deptInfo.departmentName,
          slaHoursTotal: emergency ? 4 : deptInfo.defaultSlaHours
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        await refreshData();
        setSubmittedTicket({
          ticketNumber: json.data.ticketNumber,
          deptName: json.data.departmentName
        });
        setStep(7); // Success Step
      } else {
        alert(json.error?.message || 'Failed to submit report. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting civic report:', err);
      alert('An unexpected network error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans">
      
      {/* Navigation Header */}
      {step <= 6 && (
        <div className="flex items-center justify-between">
          <Link href="/report" className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Exit Wizard
          </Link>
          <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" /> Civic Infrastructure Wizard
          </span>
        </div>
      )}

      {/* Stepper Header Progress */}
      {step <= 6 && (
        <StepperHeader
          currentStep={step}
          onStepClick={(s) => setStep(s)}
          reportType="civic"
        />
      )}

      {/* Wizard Steps */}
      {step === 1 && (
        <StepSelectCategory
          reportType="civic"
          selectedCategory={category}
          customCategory={customCategory}
          onSelectCategory={(cat) => setCategory(cat)}
          onCustomCategoryChange={(val) => setCustomCategory(val)}
        />
      )}

      {step === 2 && (
        <StepEvidence
          reportType="civic"
          photoUrl={photoUrl}
          evidenceFiles={evidenceFiles}
          referenceLink={referenceLink}
          onPhotoChange={(url) => setPhotoUrl(url)}
          onEvidenceFilesChange={(files) => setEvidenceFiles(files)}
          onReferenceLinkChange={(link) => setReferenceLink(link)}
        />
      )}

      {step === 3 && (
        <StepLocation
          reportType="civic"
          lat={lat}
          lng={lng}
          address={address}
          landmark={landmark}
          ward={ward}
          onLocationChange={(loc) => {
            setLat(loc.lat);
            setLng(loc.lng);
            setAddress(loc.address);
            setLandmark(loc.landmark);
            setWard(loc.ward);
          }}
        />
      )}

      {step === 4 && (
        <StepDetails
          reportType="civic"
          title={title}
          description={description}
          voiceNoteUrl={voiceNoteUrl}
          onTitleChange={(val) => setTitle(val)}
          onDescriptionChange={(val) => setDescription(val)}
          onVoiceNoteSaved={(url) => setVoiceNoteUrl(url)}
        />
      )}

      {step === 5 && (
        <StepVisibilityEmergency
          reportType="civic"
          visibility={visibility}
          emergency={emergency}
          onVisibilityChange={(val) => setVisibility(val)}
          onEmergencyChange={(val) => setEmergency(val)}
        />
      )}

      {step === 6 && (
        <StepReview
          reportType="civic"
          category={category}
          photoUrl={photoUrl}
          evidenceFiles={evidenceFiles}
          referenceLink={referenceLink}
          lat={lat}
          lng={lng}
          address={address}
          landmark={landmark}
          ward={ward}
          title={title}
          description={description}
          voiceNoteUrl={voiceNoteUrl}
          visibility={visibility}
          emergency={emergency}
          onEditStep={(s) => setStep(s)}
          onSubmit={handleSubmitReport}
          isSubmitting={isSubmitting}
        />
      )}

      {step === 7 && submittedTicket && (
        <StepSuccess
          reportType="civic"
          ticketNumber={submittedTicket.ticketNumber}
          category={category as string}
          address={address}
          visibility={visibility}
          emergency={emergency}
          departmentName={submittedTicket.deptName}
        />
      )}

      {/* Footer Navigation Buttons for Steps 1 through 5 */}
      {step < 6 && (
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className={`px-5 py-3 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all ${
              step === 1
                ? 'opacity-40 border-slate-200 text-slate-400 cursor-not-allowed'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className={`px-7 py-3 rounded-xl font-bold text-xs text-white shadow-md flex items-center gap-1.5 transition-all ${
              canProceed()
                ? 'bg-blue-600 hover:bg-blue-500 cursor-pointer active:scale-95'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            <span>Next Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
