import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';

export default function BlogPage() {
  const posts = [
    { title: 'How PostGIS & AI Duplicate Scanning Eliminate Civic Backlogs', date: 'August 14, 2026', tag: 'Engineering', desc: 'An architectural deep dive into ISLAH’s 50-meter radius duplicate detection engine.' },
    { title: 'Restoring Trust: AI Visual Resolution Verification in Municipal Practice', date: 'July 28, 2026', tag: 'Civic Tech', desc: 'How automated before/after photo verification ensures work is actually completed.' },
    { title: 'SLA Escalations: Moving from Bureaucratic Delays to Guaranteed Action', date: 'July 10, 2026', tag: 'Governance', desc: 'Why strict response timers and background queue escalations drive accountability.' },
  ];

  return (
    <div className="w-full max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
          Insights & Research
        </span>
        <h1 className="text-3xl font-bold text-slate-900">
          Civic Tech & Engineering Journal
        </h1>
      </div>

      <div className="space-y-6">
        {posts.map((post, i) => (
          <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded">{post.tag}</span>
              <span>{post.date}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">{post.title}</h2>
            <p className="text-xs text-slate-600 leading-relaxed">{post.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
