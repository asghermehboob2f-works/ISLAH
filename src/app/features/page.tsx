import React from 'react';
import { ShieldCheck, Cpu, MapPin, AlertTriangle, Layers, Lock, RefreshCw, BarChart3 } from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="w-full max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
          Technology Overview
        </span>
        <h1 className="text-3xl font-bold text-slate-900">
          ISLAH Technical Capabilities
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Built as a modern civic technology platform with production-grade engineering standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Replaceable AI Classification Engine', desc: 'FastAPI / Python microservice adapter supporting category detection, confidence scoring, and duplicate proximity checks.', icon: Cpu },
          { title: 'PostGIS Proximity Duplicate Scanner', desc: 'Automated 50-meter radius GIS scan to group duplicate citizen reports into single department work clusters.', icon: MapPin },
          { title: 'BullMQ SLA Escalation Engine', desc: 'Background queue monitoring response time thresholds and auto-escalating overdue tickets to city directors.', icon: AlertTriangle },
          { title: 'AI Resolution Verification Engine', desc: 'Before & after visual comparison evaluating work completion quality prior to ticket closing.', icon: RefreshCw },
          { title: 'Role-Based Access & Audit Logging', desc: 'Strict separation between Citizen reporting and Department Officer management interfaces.', icon: Lock },
          { title: 'Public Transparency Analytics', desc: 'Real-time department leaderboard, SLA compliance statistics, and GIS density heatmaps.', icon: BarChart3 },
        ].map((feat, i) => {
          const Icon = feat.icon;
          return (
            <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
