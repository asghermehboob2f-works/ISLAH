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
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-6 shadow-xs font-sans">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-slate-900">
          Pinpoint Exact Incident Location
        </h2>
        <p className="text-xs text-slate-500">
          Capture high-accuracy GPS coordinates or search your street address so authorities can locate the spot immediately.
        </p>
      </div>

      {/* Clean GPS Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-xs ${
            isEnv ? 'bg-emerald-600' : 'bg-blue-600'
          }`}>
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">
              GPS Coordinates
            </div>
            <div className="text-xs font-mono font-bold text-slate-700 mt-0.5 flex items-center gap-3">
              <span>Lat: <strong className="text-slate-900">{lat}</strong></span>
              <span>Lng: <strong className="text-slate-900">{lng}</strong></span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleFetchGps}
          disabled={isLocating}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs shrink-0 ${
            isEnv
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Acquiring GPS...' : 'Use Current Location'}</span>
        </button>
      </div>

      {errorMessage && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Address Form Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Street Address / Spot Description <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => onLocationChange({ lat, lng, address: e.target.value, landmark, ward })}
            placeholder="e.g. Sector 4 Main Road near Public Library"
            required
            className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Landmark (Optional)</label>
          <input
            type="text"
            value={landmark}
            onChange={(e) => onLocationChange({ lat, lng, address, landmark: e.target.value, ward })}
            placeholder="e.g. Opposite Park Entry Gate"
            className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs bg-slate-50 text-slate-900"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Ward / Jurisdiction Area</label>
          <input
            type="text"
            value={ward}
            onChange={(e) => onLocationChange({ lat, lng, address, landmark, ward: e.target.value })}
            placeholder="e.g. Ward 4 - Civil Lines"
            className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs bg-slate-50 text-slate-900 font-semibold"
          />
        </div>
      </div>

      {/* Map Preview */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-blue-600" />
          Location Map Pin Preview
        </label>
        <div className="h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-xs relative bg-slate-100">
          <InteractiveMap
            issues={mapPinPreview}
            height="h-full"
          />
        </div>
      </div>

    </div>
  );
}
