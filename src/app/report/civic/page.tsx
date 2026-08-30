'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { classifyImage } from '@/lib/aiService';
import { IssueCategory, IssueSeverity } from '@/lib/types';
import { 
  Building2, 
  Camera, 
  Mic, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Upload, 
  ArrowLeft,
  Construction,
  Trash2,
  Zap,
  Droplets,
  Waves,
  ShieldAlert,
  Loader2,
  Lock
} from 'lucide-react';

const CIVIC_CATEGORIES: { name: IssueCategory; icon: any; desc: string }[] = [
  { name: 'Roads & Potholes', icon: Construction, desc: 'Asphalt cavities, cave-ins, and road hazards' },
  { name: 'Garbage & Sanitation', icon: Trash2, desc: 'Overflowing bins, uncollected waste, illegal dumping' },
  { name: 'Streetlights & Electrical', icon: Zap, desc: 'Dark corridors, damaged poles, exposed wires' },
  { name: 'Water Supply', icon: Droplets, desc: 'Pipeline leaks, clean water waste, supply outages' },
  { name: 'Drainage & Sewage', icon: Waves, desc: 'Clogged drains, wastewater spills, manhole overflows' },
  { name: 'Public Infrastructure', icon: Building2, desc: 'Damaged footpaths, broken benches, public assets' },
  { name: 'Other', icon: AlertTriangle, desc: 'Custom or unlisted municipal civic problem' }
];

export default function CivicReportPage() {
  const router = useRouter();
  const { user, activeRole, createReport, refreshData } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<IssueCategory>('Roads & Potholes');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Central Avenue, Ward 4');
  const [landmark, setLandmark] = useState('');
  const [ward, setWard] = useState('Ward 4 - Civil Lines');
  const [lat, setLat] = useState<number>(34.0837);
  const [lng, setLng] = useState<number>(74.7973);
  const [severity, setSeverity] = useState<IssueSeverity>('medium');
  const [emergency, setEmergency] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [voiceNoteUrl, setVoiceNoteUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAssessment, setAiAssessment] = useState<{ label: string; confidence: number; reasoning: string } | null>(null);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);

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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview URL
    const previewUrl = URL.createObjectURL(file);
    setPhotoUrl(previewUrl);

    // AI classification
    try {
      setIsAnalyzingPhoto(true);
      const res = await classifyImage(file);
      if (res) {
        setAiAssessment({
          label: res.detectedLabel,
          confidence: res.confidence,
          reasoning: res.reasoning || 'Automated computer vision analysis'
        });
        if (res.category && res.category !== 'Environment & Wildlife') {
          setSelectedCategory(res.category);
        }
      }
    } catch (err) {
      console.error('AI classification error:', err);
    } finally {
      setIsAnalyzingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !address.trim()) return;

    setIsSubmitting(true);
    try {
      const newIssue = await createReport({
        title,
        category: selectedCategory,
        description: description || `Civic issue reported in ${selectedCategory}`,
        location: {
          lat,
          lng,
          address,
          landmark,
          ward
        },
        severity,
        emergency,
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=60',
        voiceNoteUrl,
        slaHoursTotal: emergency ? 4 : 24,
        slaHoursRemaining: emergency ? 4 : 24
      });

      await refreshData();
      if (newIssue) {
        router.push('/my-reports');
      }
    } catch (err) {
      console.error('Failed to submit civic report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans">
      
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <Link href="/report" className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Reporting Hub
        </Link>
        <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 uppercase tracking-wider">
          Civic Infrastructure Track
        </span>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Building2 className="w-5 h-5" />
          </div>
          Report a Civic Infrastructure Issue
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Submit potholes, broken streetlights, water leaks, or sanitation problems directly to municipal departments.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. Category Selection */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
            1. Select Civic Category <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CIVIC_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  type="button"
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-600/20 text-slate-900'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} />
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900">{cat.name}</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{cat.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Photo Evidence & AI Classification */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
            2. Photo Evidence & AI Triage
          </label>

          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center space-y-3 bg-slate-50/60 hover:bg-slate-50 transition-colors">
            {photoUrl ? (
              <div className="space-y-3">
                <img src={photoUrl} alt="Uploaded evidence" className="max-h-48 rounded-xl mx-auto shadow-sm object-cover" />
                <label className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 cursor-pointer hover:underline">
                  <Camera className="w-4 h-4" /> Change Photo
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
            ) : (
              <label className="cursor-pointer block space-y-2">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900">Upload Photo Evidence</span>
                  <p className="text-[11px] text-slate-500">PNG, JPG up to 10MB</p>
                </div>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            )}

            {isAnalyzingPhoto && (
              <div className="flex items-center justify-center gap-2 text-xs text-blue-600 font-bold">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running AI classification analysis...</span>
              </div>
            )}

            {aiAssessment && (
              <div className="bg-blue-50/80 border border-blue-200 p-3.5 rounded-xl text-left text-xs space-y-1">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  AI Prediction: {aiAssessment.label} ({aiAssessment.confidence}% confidence)
                </div>
                <p className="text-slate-600 text-[11px]">{aiAssessment.reasoning}</p>
              </div>
            )}
          </div>
        </div>

        {/* 3. Location Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-blue-600" />
            3. Location Details <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Street Address / Spot</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Near Main Market Crossing, Sector 4"
                required
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium bg-slate-50"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Landmark (Optional)</label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Opposite Community Park Gate"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs bg-slate-50"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Ward Jurisdiction</label>
              <input
                type="text"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs bg-slate-50 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* 4. Issue Description & Emergency Flag */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
            4. Details & Urgency Triage
          </label>

          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Report Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Deep asphalt pothole near bus stand causing traffic hazard"
                required
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold bg-slate-50"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Detailed Notes / Context</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe danger to traffic, depth, duration of problem..."
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs bg-slate-50"
              />
            </div>

            {/* Emergency Flag */}
            <div className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
              emergency ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="space-y-0.5">
                <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  Mark as Emergency Hazard (4-Hour Priority SLA)
                </div>
                <p className="text-[11px] text-slate-500">
                  Check if this poses immediate threat to public safety or life (e.g. exposed live cables, deep road cave-in).
                </p>
              </div>

              <input
                type="checkbox"
                checked={emergency}
                onChange={(e) => setEmergency(e.target.checked)}
                className="w-5 h-5 text-red-600 rounded focus:ring-red-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link
            href="/report"
            className="px-5 py-3 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-8 py-3.5 rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting Report...</span>
              </>
            ) : (
              <span>Submit Civic Report →</span>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
