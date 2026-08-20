'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { InteractiveMap } from '@/components/InteractiveMap';
import { IssueCategory, IssueSeverity } from '@/lib/types';
import confetti from 'canvas-confetti';
import { 
  Camera, 
  Upload, 
  MapPin, 
  Mic, 
  Square,
  Play,
  Pause,
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Check,
  Lock,
  Globe,
  Trash2,
  RefreshCw,
  Construction,
  Lightbulb,
  Waves,
  Droplets,
  Building2,
  HelpCircle,
  Clock,
  Sparkles,
  Siren,
  FileText
} from 'lucide-react';

const CATEGORY_OPTIONS: { label: string; value: IssueCategory; desc: string; icon: any; accentColor: string; bgHighlight: string }[] = [
  { 
    label: 'Roads & Potholes', 
    value: 'Roads & Potholes', 
    desc: 'Asphalt cracks, cave-ins, potholes & road damage', 
    icon: Construction,
    accentColor: 'text-amber-600',
    bgHighlight: 'group-hover:bg-amber-50 group-hover:border-amber-300'
  },
  { 
    label: 'Garbage & Sanitation', 
    value: 'Garbage & Sanitation', 
    desc: 'Overflowing bins, uncollected waste & illegal dumping', 
    icon: Trash2,
    accentColor: 'text-emerald-600',
    bgHighlight: 'group-hover:bg-emerald-50 group-hover:border-emerald-300'
  },
  { 
    label: 'Streetlights & Power', 
    value: 'Streetlights & Electrical', 
    desc: 'Non-functional street lamps & exposed wiring', 
    icon: Lightbulb,
    accentColor: 'text-yellow-600',
    bgHighlight: 'group-hover:bg-yellow-50 group-hover:border-yellow-300'
  },
  { 
    label: 'Water Supply & Leaks', 
    value: 'Water Supply', 
    desc: 'Burst pipelines, clean water leakage & supply drop', 
    icon: Droplets,
    accentColor: 'text-cyan-600',
    bgHighlight: 'group-hover:bg-cyan-50 group-hover:border-cyan-300'
  },
  { 
    label: 'Drainage & Sewage', 
    value: 'Drainage & Sewage', 
    desc: 'Clogged storm drains, sewage spill & open manholes', 
    icon: Waves,
    accentColor: 'text-indigo-600',
    bgHighlight: 'group-hover:bg-indigo-50 group-hover:border-indigo-300'
  },
  { 
    label: 'Public Infrastructure', 
    value: 'Public Safety & Hazards', 
    desc: 'Damaged footpaths, broken benches & park hazards', 
    icon: Building2,
    accentColor: 'text-purple-600',
    bgHighlight: 'group-hover:bg-purple-50 group-hover:border-purple-300'
  },
  { 
    label: 'Traffic & Signage', 
    value: 'Public Safety & Hazards', 
    desc: 'Broken traffic lights, missing signs & barrier hazards', 
    icon: Siren,
    accentColor: 'text-rose-600',
    bgHighlight: 'group-hover:bg-rose-50 group-hover:border-rose-300'
  },
  { 
    label: 'Other / Custom Issue', 
    value: 'Other', 
    desc: 'Specify a custom or unlisted municipal issue', 
    icon: HelpCircle,
    accentColor: 'text-blue-600',
    bgHighlight: 'group-hover:bg-blue-50 group-hover:border-blue-300'
  }
];

const getDepartmentForCategory = (catStr: string) => {
  const cat = catStr.toLowerCase();
  if (cat.includes('road') || cat.includes('pothole')) {
    return { id: 'dept-roads', name: 'Roads & Public Infrastructure' };
  }
  if (cat.includes('garbage') || cat.includes('sanitation')) {
    return { id: 'dept-sanitation', name: 'Sanitation & Solid Waste Management' };
  }
  if (cat.includes('light') || cat.includes('electric') || cat.includes('power')) {
    return { id: 'dept-electrical', name: 'Electrical & Public Lighting' };
  }
  if (cat.includes('water') || cat.includes('drain') || cat.includes('sewag') || cat.includes('leak')) {
    return { id: 'dept-water', name: 'Water Supply & Sewerage Board' };
  }
  if (cat.includes('traffic') || cat.includes('sign') || cat.includes('safety') || cat.includes('emergency') || cat.includes('hazard')) {
    return { id: 'dept-safety', name: 'Civic Safety & Emergency Services' };
  }
  return { id: 'dept-roads', name: 'Roads & Public Infrastructure' };
};

function ReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEmergencyParam = searchParams.get('emergency') === 'true';

  const { createReport } = useApp();

  // Wizard Step State (1: Photo, 2: Location, 3: Category & Details, 4: Review, 5: Confirmation)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Photo state
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [photoUploadError, setPhotoUploadError] = useState<string>('');

  // Location State
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [address, setAddress] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [specificSpot, setSpecificSpot] = useState<string>('');
  const [ward, setWard] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isGpsCaptured, setIsGpsCaptured] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string>('');

  // Category & Severity State
  const [selectedCategoryOption, setSelectedCategoryOption] = useState<typeof CATEGORY_OPTIONS[0]>(CATEGORY_OPTIONS[0]);
  const [customCategory, setCustomCategory] = useState<string>('');
  const [selectedSeverity, setSelectedSeverity] = useState<IssueSeverity>('high');

  // Details & Voice State
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [emergency, setEmergency] = useState<boolean>(isEmergencyParam);
  const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');

  // Voice Note State
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceDuration, setVoiceDuration] = useState<number>(0);
  const [voiceNoteUrl, setVoiceNoteUrl] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [voiceError, setVoiceError] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Submission State
  const [createdTicketNumber, setCreatedTicketNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Pre-select emergency if query param present
  useEffect(() => {
    if (isEmergencyParam) {
      setEmergency(true);
      setSelectedSeverity('critical');
    }
  }, [isEmergencyParam]);

  // Clean up timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle Photo File Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    setPhotoUploadError('');

    // Instant local preview
    const localObjectUrl = URL.createObjectURL(file);
    setPhotoUrl(localObjectUrl);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      const uploadedUrl = data.url || data.data?.url;

      if (res.ok && data.success !== false && uploadedUrl) {
        setPhotoUrl(uploadedUrl);
      }
    } catch (err: any) {
      console.error('Photo sync notice:', err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // GPS Auto-detect
  const handleGeolocate = () => {
    setIsLocating(true);
    setLocationError('');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const detectedLat = pos.coords.latitude;
          const detectedLng = pos.coords.longitude;
          setLat(detectedLat);
          setLng(detectedLng);
          setIsGpsCaptured(true);
          if (!address.trim()) {
            setAddress(`Coordinates: ${detectedLat.toFixed(4)}, ${detectedLng.toFixed(4)}`);
          }
          setIsLocating(false);
        },
        (err) => {
          console.warn('GPS location error:', err.message);
          setIsLocating(false);
          setLocationError('GPS auto-detection failed. Please type your Street Address / Area manually below.');
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      setIsLocating(false);
      setLocationError('Geolocation is not supported by your browser. Please type your Street Address / Area manually below.');
    }
  };

  // Step 2 -> Step 3 Validation
  const handleProceedToDetails = () => {
    setLocationError('');
    const hasGps = isGpsCaptured && lat !== null && lng !== null;
    const hasAddress = address.trim().length > 0;

    if (!hasGps && !hasAddress) {
      setLocationError('Location is required to proceed. Please click "Auto-Detect GPS" or enter your Street Address / Area.');
      return;
    }

    setCurrentStep(3);
  };

  // Voice Note Recording Functions
  const startVoiceRecording = async () => {
    setVoiceError('');
    setVoiceDuration(0);
    audioChunksRef.current = [];

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setVoiceError('Microphone access is not supported by your browser.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        const formData = new FormData();
        formData.append('file', audioBlob, `voice_note_${Date.now()}.webm`);

        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          const uploadedUrl = data.url || data.data?.url;
          if (res.ok && data.success !== false && uploadedUrl) {
            setVoiceNoteUrl(uploadedUrl);
          } else {
            setVoiceError('Failed to upload voice recording.');
          }
        } catch (err: any) {
          setVoiceError('Voice upload error: ' + err.message);
        }
      };

      mediaRecorder.start();
      setIsRecordingVoice(true);

      timerRef.current = setInterval(() => {
        setVoiceDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      setVoiceError('Could not access microphone: ' + err.message);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecordingVoice) {
      mediaRecorderRef.current.stop();
      setIsRecordingVoice(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const togglePlayAudio = () => {
    if (!voiceNoteUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(voiceNoteUrl);
      audioRef.current.onended = () => setIsPlayingAudio(false);
    }

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  // Final Submit Report
  const handleSubmitReport = async () => {
    setIsSubmitting(true);
    try {
      const activeCategoryName = selectedCategoryOption.label === 'Other / Custom Issue' && customCategory 
        ? customCategory 
        : selectedCategoryOption.label;

      const deptInfo = getDepartmentForCategory(activeCategoryName);

      const created = await createReport({
        title: title || `${activeCategoryName} Report`,
        category: selectedCategoryOption.value === 'Other' && customCategory ? customCategory as IssueCategory : selectedCategoryOption.value,
        customCategory: selectedCategoryOption.value === 'Other' ? customCategory : undefined,
        description: description || 'Civic infrastructure issue reported via ISLAH Portal.',
        location: {
          lat: lat !== null ? lat : 28.6139,
          lng: lng !== null ? lng : 77.2090,
          address: address || 'Reported Location',
          landmark: [landmark, specificSpot].filter(Boolean).join(' — Spot: '),
          ward: ward || 'General Municipal Zone'
        },
        severity: emergency ? 'critical' : selectedSeverity,
        emergency,
        photoUrl: photoUrl || '',
        voiceNoteUrl: voiceNoteUrl || '',
        visibility,
        departmentId: deptInfo.id,
        departmentName: deptInfo.name,
        slaHoursTotal: emergency ? 4 : 24
      });

      if (created) {
        setCreatedTicketNumber(created.ticketNumber);
        setCurrentStep(5);
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}
      } else {
        alert('Failed to submit report to server. Please try again.');
      }
    } catch (err: any) {
      alert('Error submitting report: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Progress Bar Percentage
  const progressPercent = Math.min(100, Math.max(20, (currentStep / 4) * 100));

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 space-y-8 font-sans">
      
      {/* Slim Professional Guidance Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 md:p-5 border border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                ISLAH Civic Reporting Portal
                <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2.5 py-0.5 rounded-full border border-slate-700 font-normal hidden sm:inline">
                  Direct Municipal Dispatch
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">File verified civic infrastructure issues for tracked SLA resolution</p>
            </div>
          </div>

          {/* Compact Step Counter */}
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
            <span className="text-xs font-mono font-bold text-slate-300">Step {Math.min(4, currentStep)} of 4</span>
            <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60 p-0.5">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Minimalist Horizontal Step Timeline */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-xs">
          {[
            { num: '1', title: 'Photo', desc: 'Evidence' },
            { num: '2', title: 'Location', desc: 'GPS & Ward' },
            { num: '3', title: 'Category & Details', desc: 'Choice & Notes' },
            { num: '4', title: 'Dispatch', desc: 'SLA Tracking' }
          ].map((s, idx) => {
            const stepNum = idx + 1;
            const isActive = currentStep === stepNum;
            const isDone = currentStep > stepNum;

            return (
              <div 
                key={s.num}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-600/20 text-blue-300 font-bold border border-blue-500/40' 
                    : isDone 
                      ? 'bg-slate-800/40 text-emerald-400 font-medium' 
                      : 'bg-slate-800/20 text-slate-500 font-normal'
                }`}
              >
                <div className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-mono font-bold shrink-0 ${
                  isActive ? 'bg-blue-500 text-white' : isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}>
                  {isDone ? '✓' : s.num}
                </div>
                <div className="truncate">
                  <div className="text-[11px] leading-tight truncate">{s.title}</div>
                  <div className="text-[9px] text-slate-400 hidden md:block">{s.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: CAPTURE / UPLOAD PHOTO */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-600" />
              Step 1: Capture or Upload Issue Photo
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Provide visual photo evidence of the civic hazard for field inspectors.
            </p>
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-slate-300/80 hover:border-blue-500 rounded-3xl p-8 text-center bg-slate-50/50 hover:bg-blue-50/20 transition-all group">
            {photoUrl ? (
              <div className="space-y-4">
                <div className="relative max-w-md mx-auto rounded-2xl overflow-hidden border border-slate-300 shadow-md group">
                  <img src={photoUrl} alt="Issue Attachment" className="w-full h-64 object-cover" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => setPhotoUrl('')}
                      className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all"
                    >
                      <Trash2 className="w-4 h-4" /> Remove & Replace Photo
                    </button>
                  </div>
                </div>
                <div className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1.5 bg-emerald-50 py-2 px-4 rounded-full max-w-xs mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" /> Photo attached successfully
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-inner group-hover:scale-105 transition-transform">
                  <Camera className="w-8 h-8" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">Take Photo or Upload Image</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Supports JPG, PNG, WEBP. Tap button to launch live camera shot on mobile.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-6 py-3 rounded-2xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95">
                    <Upload className="w-4 h-4" />
                    <span>{isUploadingPhoto ? 'Uploading Image...' : 'Choose Image File / Take Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={isUploadingPhoto}
                      className="hidden"
                    />
                  </label>
                </div>

                {photoUploadError && (
                  <p className="text-xs text-red-600 font-semibold">{photoUploadError}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-3 rounded-2xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <span>Next: Confirm Location</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CONFIRM LOCATION */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              Step 2: Confirm Location & Ward Details
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Provide exact spatial positioning so municipal field crews can navigate to the problem.
            </p>
          </div>

          {locationError && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-medium flex items-center gap-2 animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{locationError}</span>
            </div>
          )}

          <div className="space-y-4 text-xs">
            {/* GPS Signal & Leaflet Map Pinpoint Picker */}
            <div className="bg-slate-50/80 border border-slate-200/90 p-4 md:p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" /> Geospatial Coordinates & Map Pinpoint
                </span>
                <button
                  type="button"
                  onClick={handleGeolocate}
                  disabled={isLocating}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-sm hover:shadow transition-all active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  {isLocating ? 'Detecting GPS...' : isGpsCaptured ? 'Re-Detect GPS' : 'Auto-Detect GPS'}
                </button>
              </div>

              {/* Interactive Leaflet Location Picker Canvas */}
              <div className="h-[220px] rounded-xl overflow-hidden border border-slate-300 relative shadow-inner">
                <InteractiveMap
                  pickerMode={true}
                  initialLat={lat !== null ? lat : 28.6139}
                  initialLng={lng !== null ? lng : 77.2090}
                  height="h-[220px]"
                  onLocationSelect={(selectedLat, selectedLng) => {
                    setLat(selectedLat);
                    setLng(selectedLng);
                    setIsGpsCaptured(true);
                    if (locationError) setLocationError('');
                  }}
                />
              </div>

              {isGpsCaptured && lat !== null && lng !== null ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                  <div className="grid grid-cols-2 gap-4 text-slate-700 font-mono text-[11px]">
                    <div>Latitude: <strong className="text-slate-900">{lat.toFixed(4)}</strong></div>
                    <div>Longitude: <strong className="text-slate-900">{lng.toFixed(4)}</strong></div>
                  </div>
                  <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Exact Coordinates Set
                  </span>
                </div>
              ) : (
                <div className="text-slate-600 text-[11px] bg-amber-50/80 border border-amber-200/90 p-3 rounded-xl flex items-center justify-between">
                  <span>GPS Status: <strong className="text-amber-800 font-bold">Not detected yet</strong></span>
                  <span className="text-[10px] text-amber-700 font-semibold">Click map above, use Auto-Detect, or enter address below</span>
                </div>
              )}
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Street Address / Area <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 14 Main Street, Sector 5 (Required if GPS not detected)"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (locationError) setLocationError('');
                }}
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 bg-slate-50/60 focus:bg-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Specific Spot / Precise Location Details <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. In front of Shop #4, near street pole #12, opposite Metro Gate 3..."
                value={specificSpot}
                onChange={(e) => setSpecificSpot(e.target.value)}
                className="w-full border border-slate-300 rounded-2xl px-4 py-2.5 bg-slate-50/60 focus:bg-white text-xs font-medium"
              />
              <p className="text-[10px] text-slate-500 mt-1">Exact spot or pillar/gate details to help field workers locate the issue</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Landmark <span className="text-slate-400 font-normal">(Optional)</span></label>
                <input
                  type="text"
                  placeholder="Near hospital gate, opposite park..."
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full border border-slate-300 rounded-2xl px-4 py-2.5 bg-slate-50/60 focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Municipal Ward / Division</label>
                <input
                  type="text"
                  placeholder="Enter your ward (e.g. Ward 12, Zone 4...)"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full border border-slate-300 rounded-2xl px-4 py-2.5 bg-slate-50/60 focus:bg-white text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-2xl flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <button
              onClick={handleProceedToDetails}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              <span>Next: Category & Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SLIM CATEGORY TILES, EMERGENCY BAR & DETAILS */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 md:p-6 space-y-4 shadow-sm">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              Step 3: Select Category & Details
            </h2>
            <span className="text-[11px] text-slate-400">Choose tile to assign department</span>
          </div>

          <div className="space-y-4 text-xs">
            
            {/* Slim Category Tiles Grid */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {CATEGORY_OPTIONS.map((option) => {
                  const IconComp = option.icon;
                  const isSelected = selectedCategoryOption.label === option.label;
                  return (
                    <button
                      type="button"
                      key={option.label}
                      onClick={() => setSelectedCategoryOption(option)}
                      className={`group p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all relative ${
                        isSelected
                          ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-400/30 text-blue-950 shadow-2xs'
                          : `bg-slate-50/60 border-slate-200/90 hover:bg-white hover:border-slate-300 text-slate-800 ${option.bgHighlight}`
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 shadow-2xs'}`}>
                        <IconComp className={`w-4 h-4 ${isSelected ? 'text-white' : option.accentColor}`} />
                      </div>

                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="font-extrabold text-[11px] text-slate-900 leading-tight truncate">{option.label}</div>
                        <div className="text-[9.5px] text-slate-500 leading-tight line-clamp-1">{option.desc}</div>
                      </div>

                      {isSelected && (
                        <span className="bg-blue-600 text-white rounded-full p-0.5 shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom Category Input if "Other / Custom Issue" is selected */}
              {selectedCategoryOption.label === 'Other / Custom Issue' && (
                <div className="bg-blue-50/80 border border-blue-200 p-3 rounded-xl space-y-1.5 animate-fadeIn">
                  <label className="font-bold text-blue-950 block text-[11px]">
                    Describe Custom Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Stray Cattle Hazard, Illegal Commercial Hoarding..."
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full border border-blue-300 rounded-lg px-3 py-2 bg-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Slim Low-Profile Emergency Panel */}
            <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              emergency 
                ? 'bg-red-50/90 border-red-300 text-red-950 ring-1 ring-red-300 shadow-2xs' 
                : 'bg-slate-50/80 border-slate-200/90 hover:border-slate-300'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg shrink-0 ${emergency ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                    Emergency / Immediate Hazard
                    {emergency && <span className="bg-red-600 text-white text-[9px] font-mono px-2 py-0.2 rounded-full font-bold">4-Hour SLA</span>}
                  </div>
                  <div className="text-[10px] text-slate-500 hidden sm:block">Check if issue poses immediate danger to public safety or life</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const nextState = !emergency;
                  setEmergency(nextState);
                  if (nextState) setSelectedSeverity('critical');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                  emergency ? 'bg-red-600 text-white' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded flex items-center justify-center ${emergency ? 'bg-white text-red-600' : 'border border-slate-400'}`}>
                  {emergency && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>{emergency ? 'Emergency Active' : 'Mark as Emergency'}</span>
              </button>
            </div>

            {/* Title & Description Fields */}
            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Report Title (Optional)</label>
                <input
                  type="text"
                  placeholder={`e.g. ${selectedCategoryOption.label} near main market`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-2xl px-4 py-2.5 bg-slate-50/60 focus:bg-white text-xs font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Detailed Description (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Describe the issue depth, danger to traffic, or additional notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-slate-300 rounded-2xl p-3 bg-slate-50/60 focus:bg-white text-xs"
                />
              </div>
            </div>

            {/* Voice Note Recording */}
            <div className="bg-slate-50/80 border border-slate-200/90 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-2">
                  <Mic className="w-4 h-4 text-purple-600" /> Voice Note Audio Recording (Optional)
                </span>
                {isRecordingVoice && (
                  <span className="text-xs font-mono font-bold text-red-600 animate-pulse">
                    ● Recording {formatSeconds(voiceDuration)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {!isRecordingVoice ? (
                  <button
                    type="button"
                    onClick={startVoiceRecording}
                    className="bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm"
                  >
                    <Mic className="w-4 h-4" /> Start Microphone Recording
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopVoiceRecording}
                    className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm animate-pulse"
                  >
                    <Square className="w-4 h-4 fill-white" /> Stop Recording
                  </button>
                )}

                {voiceNoteUrl && (
                  <button
                    type="button"
                    onClick={togglePlayAudio}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlayingAudio ? 'Pause Playback' : 'Play Voice Recording'}
                  </button>
                )}
              </div>

              {voiceError && <p className="text-xs text-red-600 font-semibold">{voiceError}</p>}
            </div>

            {/* Report Visibility */}
            <div className="bg-slate-50/80 border border-slate-200/90 p-4 rounded-2xl space-y-2">
              <label className="font-bold text-slate-800 block">Report Visibility Mode</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVisibility('PUBLIC')}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    visibility === 'PUBLIC'
                      ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Globe className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Public Transparency</div>
                    <div className="text-[10px] text-slate-500">Visible on municipal live maps & public dashboards.</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility('PRIVATE')}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    visibility === 'PRIVATE'
                      ? 'bg-purple-50 border-purple-500 text-purple-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Lock className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Private / Sensitive</div>
                    <div className="text-[10px] text-slate-500">Only visible to handling municipal staff.</div>
                  </div>
                </button>
              </div>
            </div>

          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-2xl flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <button
              onClick={() => setCurrentStep(4)}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              <span>Next: Review & Submit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & SUBMIT */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Step 4: Final Review & Submission
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Confirm all report details before dispatching to the municipal department queue.
            </p>
          </div>

          <div className="bg-slate-50/80 border border-slate-200/90 p-6 rounded-2xl space-y-3.5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500">Report Title:</span>
              <span className="font-bold text-slate-900">{title || `${selectedCategoryOption.label} Report`}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500">Selected Category:</span>
              <span className="font-bold text-slate-900">
                {selectedCategoryOption.label === 'Other / Custom Issue' && customCategory ? customCategory : selectedCategoryOption.label}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500">Location Details:</span>
              <span className="font-bold text-slate-900 text-right">
                {address || 'Coordinates captured'} ({[landmark, specificSpot].filter(Boolean).join(' — Spot: ') || 'No landmark'}, {ward || 'Municipal Zone'})
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500">Priority & SLA:</span>
              <span className={`font-extrabold px-2.5 py-0.5 rounded-full text-[10px] ${
                emergency ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-800 text-white'
              }`}>
                {emergency ? 'CRITICAL (4-Hour Emergency SLA)' : `${selectedSeverity.toUpperCase()} (24-Hour SLA)`}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Visibility:</span>
              <span className="font-bold text-slate-900">{visibility}</span>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(3)}
              className="border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-2xl flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Edit Details
            </button>

            <button
              onClick={handleSubmitReport}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold px-8 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 active:scale-95 transition-all"
            >
              {isSubmitting ? 'Dispatching Ticket...' : 'Dispatch Ticket to Department'}
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: CONFIRMATION */}
      {currentStep === 5 && (
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 text-center space-y-6 shadow-xl max-w-xl mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full">
              Ticket Successfully Dispatched
            </span>
            <h2 className="text-2xl font-black text-slate-900">Report Ticket Created</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your report has been written to the backend database and routed to the assigned municipal department.
            </p>
          </div>

          <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Official Ticket Tracking ID</div>
            <div className="text-2xl font-mono font-black text-blue-400 tracking-wider">
              {createdTicketNumber}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => router.push(`/track/${createdTicketNumber}`)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all"
            >
              Track Live SLA Status
            </button>

            <button
              onClick={() => router.push('/dashboard')}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-3 rounded-2xl"
            >
              Go to Citizen Dashboard
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading ISLAH Reporting Wizard...</div>}>
      <ReportContent />
    </Suspense>
  );
}
