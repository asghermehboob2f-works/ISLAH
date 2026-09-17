'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Compass, AlertCircle, Globe } from 'lucide-react';
import { InteractiveMap } from '@/components/InteractiveMap';
import { CivicIssue } from '@/lib/types';

interface StepLocationProps {
  reportType: 'civic' | 'environmental';
  lat: number;
  lng: number;
  address: string;
  landmark: string;
  ward: string;
  onLocationChange: (loc: { lat: number; lng: number; address: string; landmark: string; ward: string }) => void;
}

export function StepLocation({
  reportType,
  lat,
  lng,
  address,
  landmark,
  ward,
  onLocationChange
}: StepLocationProps) {
  const isEnv = reportType === 'environmental';
  const [isLocating, setIsLocating] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFetchGps = () => {
    setIsLocating(true);
    setGpsStatus('idle');
    setErrorMessage('');

    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser. Please enter location manually.');
      setGpsStatus('error');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const fetchedLat = parseFloat(pos.coords.latitude.toFixed(5));
        const fetchedLng = parseFloat(pos.coords.longitude.toFixed(5));

        onLocationChange({
          lat: fetchedLat,
          lng: fetchedLng,
          address: address || `GPS Location (${fetchedLat}, ${fetchedLng})`,
          landmark,
          ward
        });

        setGpsStatus('success');
        setIsLocating(false);
      },
      (err) => {
        console.warn('GPS Error:', err);
        setErrorMessage('Unable to retrieve automatic GPS position. You can click on the map or type address manually.');
        setGpsStatus('error');
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Mock pin issue for map view preview
  const mapPinPreview: CivicIssue[] = [
    {
      id: 'preview-loc-pin',
      ticketNumber: 'LOC-PREVIEW',
      title: address || 'Reported Incident Location',
      category: isEnv ? 'Environment & Wildlife' : 'Roads & Potholes',
      description: 'Selected coordinates for report',
      location: { lat, lng, address: address || 'Selected Spot', ward: ward || 'District Ward' },
      status: 'reported',
      severity: 'medium',
      emergency: false,
      departmentId: 'dept-gen',
      departmentName: 'Municipal Dept',
      reportedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slaHoursTotal: 24,
      slaHoursRemaining: 24,
      citizenId: 'usr-preview',
      citizenName: 'Reporter',
      photoUrl: '',
      aiConfidence: 100,
      notes: [],
      timeline: [],
      duplicatesCount: 0,
      upvotesCount: 1
    }
  ];

  return (
    <div className="bg-[--bg-surface] rounded-xl border border-[--border] p-5 sm:p-6 space-y-6 shadow-xs font-sans">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-[--text-primary]">
          Pinpoint Exact Incident Location
        </h2>
        <p className="text-xs text-[--text-secondary]">
          Capture high-accuracy GPS coordinates or search your street address so authorities can locate the spot immediately.
        </p>
      </div>

      {/* Clean GPS Bar */}
      <div className="bg-[--bg-subtle] border border-[--border] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-xs ${isEnv ? 'bg-emerald-600' : 'bg-blue-600'
            }`}>
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[--text-primary]">
              GPS Coordinates
            </div>
            <div className="text-xs font-mono font-bold text-[--text-secondary] mt-0.5 flex items-center gap-3">
              <span>Lat: <strong className="text-[--text-primary]">{lat}</strong></span>
              <span>Lng: <strong className="text-[--text-primary]">{lng}</strong></span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleFetchGps}
          disabled={isLocating}
          className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer ${isEnv
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
        >
          <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Acquiring GPS...' : 'Use Current Location'}</span>
        </button>
      </div>

      {errorMessage && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 p-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Address Form Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-[--text-primary] block mb-1">
            Street Address / Spot Description <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => onLocationChange({ lat, lng, address: e.target.value, landmark, ward })}
            placeholder="e.g. Sector 4 Main Road near Public Library"
            required
            className="w-full border border-[--border] rounded-xl px-3.5 py-2.5 text-xs font-medium bg-[--bg-surface] text-[--text-primary] focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[--text-primary] block mb-1">Landmark (Optional)</label>
          <input
            type="text"
            value={landmark}
            onChange={(e) => onLocationChange({ lat, lng, address, landmark: e.target.value, ward })}
            placeholder="e.g. Opposite Park Entry Gate"
            className="w-full border border-[--border] rounded-xl px-3.5 py-2.5 text-xs bg-[--bg-surface] text-[--text-primary] focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[--text-primary] block mb-1">Ward / Jurisdiction Area</label>
          <input
            type="text"
            value={ward}
            onChange={(e) => onLocationChange({ lat, lng, address, landmark, ward: e.target.value })}
            placeholder="e.g. Ward 4 - Civil Lines"
            className="w-full border border-[--border] rounded-xl px-3.5 py-2.5 text-xs bg-[--bg-surface] text-[--text-primary] font-semibold focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Map Preview */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[--text-primary] uppercase tracking-wider block flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Location Map Pin Preview
        </label>
        <div className="h-64 rounded-xl overflow-hidden border border-[--border] shadow-xs relative bg-[--bg-subtle]">
          <InteractiveMap
            issues={mapPinPreview}
            height="h-full"
          />
        </div>
      </div>

    </div>
  );
}
