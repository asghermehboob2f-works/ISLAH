'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { CivicIssue } from '@/lib/types';
import { MapPin, Filter, RefreshCw } from 'lucide-react';

interface InteractiveMapProps {
  issues?: CivicIssue[];
  onSelectIssue?: (issue: CivicIssue) => void;
  height?: string;
  pickerMode?: boolean;
  initialLat?: number | null;
  initialLng?: number | null;
  onLocationSelect?: (lat: number, lng: number) => void;
  onRefreshData?: () => void;
}

export function InteractiveMap({
  issues = [],
  onSelectIssue,
  height = 'h-[600px]',
  pickerMode = false,
  initialLat = 28.6139,
  initialLng = 77.2090,
  onLocationSelect,
  onRefreshData
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const pickerMarkerRef = useRef<any>(null);
  const leafletLibRef = useRef<any>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  // Memoize filtered issues to avoid unnecessary re-triggers
  const publicIssues = useMemo(() => {
    return issues.filter(i => (i.visibility === 'PUBLIC' || !i.visibility));
  }, [issues]);

  const filteredIssues = useMemo(() => {
    return publicIssues.filter((iss) => {
      if (selectedCategory !== 'all' && iss.category !== selectedCategory) return false;
      return true;
    });
  }, [publicIssues, selectedCategory]);

  const categories = useMemo(() => {
    return Array.from(new Set(publicIssues.map((i) => i.category)));
  }, [publicIssues]);

  // 1. Initialize Leaflet Map ONCE on mount
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined' || !mapRef.current) return;
      if (mapInstanceRef.current) return;

      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (!isMounted || !mapRef.current) return;

      if ((mapRef.current as any)._leaflet_id) {
        (mapRef.current as any)._leaflet_id = null;
      }

      leafletLibRef.current = L;

      const defaultLat = initialLat || 28.6139;
      const defaultLng = initialLng || 77.2090;

      const map = L.map(mapRef.current, {
        center: [defaultLat, defaultLng],
        zoom: pickerMode ? 14 : 12,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      if (pickerMode) {
        map.on('click', (e: any) => {
          const { lat, lng } = e.latlng;
          if (onLocationSelect) {
            onLocationSelect(lat, lng);
          }
        });
      }

      setIsMapReady(true);
    }

    initMap();

    // Clean up ONLY when the component unmounts completely
    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // ignore cleanup errors during unmount
        }
        mapInstanceRef.current = null;
        markersGroupRef.current = null;
        pickerMarkerRef.current = null;
      }
    };
  }, []);

  // 2. Update Map Markers & Layers when Data/Filters change without re-creating the map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = leafletLibRef.current;
    if (!map || !L || !isMapReady) return;

    // --- PICKER MODE MARKER ---
    if (pickerMode) {
      const targetLat = initialLat || 28.6139;
      const targetLng = initialLng || 77.2090;

      const pickerIcon = L.divIcon({
        className: 'custom-picker-pin',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-8 h-8 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div class="absolute -bottom-1 w-2 h-2 bg-blue-600 rotate-45"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      if (!pickerMarkerRef.current) {
        const marker = L.marker([targetLat, targetLng], {
          icon: pickerIcon,
          draggable: true
        }).addTo(map);

        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          if (onLocationSelect) onLocationSelect(pos.lat, pos.lng);
        });

        pickerMarkerRef.current = marker;
      } else {
        pickerMarkerRef.current.setLatLng([targetLat, targetLng]);
      }

      map.panTo([targetLat, targetLng]);
      return;
    }

    // --- REGULAR LIVE MAP MARKERS ---
    const markersGroup = markersGroupRef.current;
    if (!markersGroup) return;

    markersGroup.clearLayers();
    const bounds: [number, number][] = [];

    filteredIssues.forEach((issue) => {
      const lat = issue.location?.lat;
      const lng = issue.location?.lng;

      if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) return;

      bounds.push([lat, lng]);

      let pinBg = 'bg-blue-600';
      let ringColor = 'ring-blue-300';
      let pinEmoji = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';

      if (issue.category === 'Environment & Wildlife') {
        pinBg = 'bg-emerald-600';
        ringColor = 'ring-emerald-300';
        pinEmoji = '🌲';
      }

      if (issue.isSensitiveWildlife) {
        pinBg = 'bg-purple-600';
        ringColor = 'ring-purple-300';
        pinEmoji = '🛡️';
      }

      if (issue.emergency) {
        pinBg = 'bg-red-600';
        ringColor = 'ring-red-400';
        pinEmoji = '🚨';
      } else if (issue.status === 'resolved') {
        pinBg = 'bg-emerald-600';
        ringColor = 'ring-emerald-300';
      } else if (issue.status === 'in_progress') {
        pinBg = 'bg-amber-500';
        ringColor = 'ring-amber-300';
      } else if (issue.status === 'escalated') {
        pinBg = 'bg-rose-700';
        ringColor = 'ring-rose-400';
      }

      const pinIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="relative group cursor-pointer">
            <div class="w-7 h-7 rounded-full ${pinBg} ring-4 ${ringColor} text-white flex items-center justify-center shadow-lg transition-transform hover:scale-125">
              ${pinEmoji}
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28]
      });

      const marker = L.marker([lat, lng], { icon: pinIcon });
      const reportedDateStr = new Date(issue.reportedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      const photoHtml = issue.photoUrl ? `<img src="${issue.photoUrl}" alt="Issue photo" class="w-full h-24 object-cover rounded-lg my-1.5 border border-slate-200" />` : '';

      const sensitiveBadge = issue.isSensitiveWildlife
        ? `<div class="bg-purple-100 text-purple-800 text-[9px] font-bold px-2 py-0.5 rounded my-1 border border-purple-200">🛡️ Protected Wildlife Zone (~500m Approx)</div>`
        : '';

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 font-sans max-w-[240px]';
      popupContent.innerHTML = `
        <div class="flex items-center justify-between gap-2 border-b border-slate-100 pb-1 mb-1.5">
          <span class="text-[10px] font-mono font-bold text-blue-600">${issue.ticketNumber}</span>
          <span class="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
            issue.emergency ? 'bg-red-100 text-red-700' :
            issue.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
            issue.status === 'in_progress' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
          }">${issue.status.replace('_', ' ')}</span>
        </div>
        ${sensitiveBadge}
        <h4 class="font-extrabold text-xs text-slate-900 leading-snug">${issue.title}</h4>
        <p class="text-[10px] text-slate-500 line-clamp-1 mt-0.5">${issue.location.address}</p>
        ${photoHtml}
        <div class="mt-2 flex items-center justify-between text-[10px] text-slate-400">
          <span>Date: ${reportedDateStr}</span>
          <button id="btn-view-${issue.id}" class="text-blue-600 font-bold hover:underline flex items-center gap-0.5">
            Details &rarr;
          </button>
        </div>
      `;

      popupContent.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target && (target.id === `btn-view-${issue.id}` || target.closest(`#btn-view-${issue.id}`))) {
          if (onSelectIssue) onSelectIssue(issue);
        }
      });

      marker.bindPopup(popupContent, { maxWidth: 260 });
      marker.on('click', () => {
        if (onSelectIssue) onSelectIssue(issue);
      });

      markersGroup.addLayer(marker);
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [filteredIssues, pickerMode, initialLat, initialLng, isMapReady]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    if (onRefreshData) onRefreshData();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className={`relative w-full ${height} bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex flex-col`}>
      
      {/* Map Control Header Bar */}
      {!pickerMode && (
        <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-xl shadow-lg">
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-800 text-xs font-semibold text-white border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories ({publicIssues.length} Public Pins)</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              DB Source of Truth
            </span>
            <button
              type="button"
              onClick={handleManualRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-all active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
              <span>Refresh Pins</span>
            </button>
          </div>
        </div>
      )}

      {/* Picker Guidance Banner */}
      {pickerMode && (
        <div className="absolute top-3 left-3 right-3 z-[400] bg-slate-900/90 backdrop-blur-md text-white px-3 py-2 rounded-xl text-xs flex items-center justify-between border border-slate-700">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span>Click map or drag blue pin to set exact report coordinates</span>
          </div>
          <span className="font-mono text-[11px] text-blue-300 font-bold">
            {initialLat?.toFixed(4)}, {initialLng?.toFixed(4)}
          </span>
        </div>
      )}

      {/* Leaflet DOM Canvas Container */}
      <div ref={mapRef} className="w-full h-full z-10" />

      {/* Live Map Status Legend Bar */}
      {!pickerMode && (
        <div className="absolute bottom-4 right-4 z-[400] bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-2 rounded-xl text-[11px] text-slate-300 flex items-center gap-3 shadow-lg">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Reported</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> In Progress</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Resolved</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Emergency</span>
        </div>
      )}

    </div>
  );
}
