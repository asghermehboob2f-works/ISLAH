'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { classifyImage } from '@/lib/aiService';
import { EnvironmentalSubcategory, IssueSeverity } from '@/lib/types';
import { 
  Trees, 
  Leaf, 
  Shield, 
  Droplets, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Upload, 
  ArrowLeft,
  ShieldCheck,
  Loader2,
  Lock,
  Camera,
  MapPin,
  Flame,
  FileText,
  EyeOff
} from 'lucide-react';

const ENV_SUBCATEGORIES: { name: EnvironmentalSubcategory; icon: any; desc: string }[] = [
  { name: 'Wildlife Protection', icon: Shield, desc: 'Injured fauna, poaching, animal harm, illegal capture' },
  { name: 'Forest & Land Protection', icon: Leaf, desc: 'Illegal tree cutting, deforestation, forest land encroachment' },
  { name: 'Water & Ecosystem Protection', icon: Droplets, desc: 'River effluent, lake pollution, wetland habitat destruction' },
  { name: 'Environmental Pollution', icon: AlertTriangle, desc: 'Toxic waste dumping, chemical spills, air/soil hazards' },
  { name: 'Environmental Emergencies', icon: Flame, desc: 'Forest fires, major chemical crises, immediate ecological disasters' },
  { name: 'Other Environmental Issue', icon: Trees, desc: 'General unlisted threat to natural environment' }
];

export default function EnvironmentalReportPage() {
  const router = useRouter();
  const { user, activeRole, createReport, refreshData } = useApp();

  const [selectedSubcategory, setSelectedSubcategory] = useState<EnvironmentalSubcategory>('Wildlife Protection');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Pine Ridge Forest Trail, Sector 9');
  const [landmark, setLandmark] = useState('');
  const [ward, setWard] = useState('Protected Forest Zone A');
  const [lat, setLat] = useState<number>(34.1087);
  const [lng, setLng] = useState<number>(74.8213);
  const [severity, setSeverity] = useState<IssueSeverity>('high');
  const [emergency, setEmergency] = useState(false);
  const [isSensitiveWildlife, setIsSensitiveWildlife] = useState(true);
  const [evidenceLink, setEvidenceLink] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAssessment, setAiAssessment] = useState<{ label: string; confidence: number; reasoning: string } | null>(null);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);

  if (!user || activeRole !== 'citizen') {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16 text-center space-y-6 font-sans">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Authentication Required</h2>
          <p className="text-xs text-slate-500">Please log in to submit an Environment & Wildlife report.</p>
        </div>
        <Link
          href="/login?returnUrl=/report/environmental"
          className="block w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs shadow-md"
        >
          Log In to Continue
        </Link>
      </div>
    );
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPhotoUrl(previewUrl);

    try {
      setIsAnalyzingPhoto(true);
      const res = await classifyImage(file);
      if (res) {
        setAiAssessment({
          // Non-committal wording as required by spec #9
          label: `Possible ${res.detectedLabel.replace('Confirmed', '').trim()}`,
          confidence: res.confidence,
          reasoning: `${res.reasoning || 'Automated visual assessment'} (Pending authority field verification)`
        });
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
      const isEmergency = emergency || selectedSubcategory === 'Environmental Emergencies';
      
      const newIssue = await createReport({
        title,
        category: 'Environment & Wildlife',
        subcategory: selectedSubcategory,
        description: description || `Environmental threat reported under ${selectedSubcategory}`,
        isSensitiveWildlife,
        evidenceFiles: evidenceLink ? [evidenceLink] : [],
        location: {
          lat,
          lng,
          address,
          landmark,
          ward
        },
        severity,
        emergency: isEmergency,
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=60',
        slaHoursTotal: isEmergency ? 4 : 12,
        slaHoursRemaining: isEmergency ? 4 : 12
      });

      await refreshData();
      if (newIssue) {
        router.push('/my-reports');
      }
    } catch (err) {
      console.error('Failed to submit environmental report:', err);
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
        <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
          <Leaf className="w-3 h-3 text-emerald-600" /> Ecological Safeguard Track
        </span>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
            <Trees className="w-5 h-5" />
          </div>
          Report an Environment & Wildlife Threat
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Dedicated reporting for illegal tree cutting, deforestation, poaching, wildlife emergencies, and river/wetland toxic pollution.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. Environmental Subcategory Selection */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
            1. Select Environmental Threat Subcategory <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ENV_SUBCATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedSubcategory === cat.name;
              return (
                <button
                  type="button"
                  key={cat.name}
                  onClick={() => setSelectedSubcategory(cat.name)}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-600/20 text-slate-900'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-emerald-600' : 'text-slate-500'}`} />
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
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

        {/* 2. Sensitive Wildlife Privacy Shield (Spec #6 & #8) */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 space-y-3 shadow-md border border-slate-700">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="font-bold text-xs text-emerald-400 flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-emerald-400" />
                Sensitive Wildlife & Habitat Protection Shield
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                When checked, exact GPS coordinates are masked on public maps (showing an approximate ~500m area) to protect endangered species, nesting grounds, and wildlife from poaching or disturbance. Authorized forest officers retain full access.
              </p>
            </div>
            <input
              type="checkbox"
              checked={isSensitiveWildlife}
              onChange={(e) => setIsSensitiveWildlife(e.target.checked)}
              className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-400 cursor-pointer shrink-0 mt-1"
            />
          </div>
          {isSensitiveWildlife && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-mono border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" /> GPS Coordinates Obfuscated (~500m Mask)
            </div>
          )}
        </div>

        {/* 3. Photo & Additional Evidence */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
            3. Photographic & Documentary Evidence
          </label>

          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center space-y-3 bg-slate-50/60 hover:bg-slate-50 transition-colors">
            {photoUrl ? (
              <div className="space-y-3">
                <img src={photoUrl} alt="Uploaded evidence" className="max-h-48 rounded-xl mx-auto shadow-sm object-cover" />
                <label className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 cursor-pointer hover:underline">
                  <Camera className="w-4 h-4" /> Change Photo
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
            ) : (
              <label className="cursor-pointer block space-y-2">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900">Upload Site Photo Evidence</span>
                  <p className="text-[11px] text-slate-500">Attach field photo of illegal activity, damage, or species</p>
                </div>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            )}

            {isAnalyzingPhoto && (
              <div className="flex items-center justify-center gap-2 text-xs text-emerald-600 font-bold">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running ecological AI classification...</span>
              </div>
            )}

            {aiAssessment && (
              <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-xl text-left text-xs space-y-1">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  AI Prediction: {aiAssessment.label} ({aiAssessment.confidence}% confidence)
                </div>
                <p className="text-slate-600 text-[11px]">{aiAssessment.reasoning}</p>
              </div>
            )}
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Additional Evidence Document Link (Optional)</label>
            <input
              type="text"
              value={evidenceLink}
              onChange={(e) => setEvidenceLink(e.target.value)}
              placeholder="Paste URL to secondary photos, field logs, or environmental report files..."
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs bg-slate-50"
            />
          </div>
        </div>

        {/* 4. Location Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            4. Location & Area Jurisdiction <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Incident Spot / Location Description</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Riverbank near East Forest Ridge, North Block"
                required
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium bg-slate-50"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Nearest Landmark / Access Route</label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. 500m past Forest Checkpost 3"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs bg-slate-50"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Forest / Ecological Beat</label>
              <input
                type="text"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs bg-slate-50 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* 5. Issue Description & Emergency Flag */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
            5. Incident Details & Authority Dispatch
          </label>

          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Report Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Illegal tree cutting and timber loading observed along riverbank"
                required
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold bg-slate-50"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Detailed Description of Damage / Threat</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail the damage, species involved, estimated scale, or vehicle details..."
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs bg-slate-50"
              />
            </div>

            {/* Emergency Crisis Flag */}
            <div className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
              emergency ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="space-y-0.5">
                <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-red-600" />
                  Mark as Environmental Emergency (4-Hour Rapid Patrol Dispatch)
                </div>
                <p className="text-[11px] text-slate-500">
                  Check for active forest fires, toxic chemical spills, active poaching, or severe ecological hazards.
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
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-8 py-3.5 rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Dispatching Authority Queue...</span>
              </>
            ) : (
              <span>Submit Environmental Threat Report →</span>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
