import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';

export default function BlogPage() {
  const posts = [
    { title: 'How PostGIS & AI Duplicate Scanning Eliminate Civic Backlogs', date: 'August 14, 2026', tag: 'Engineering', desc: 'An architectural deep dive into ISLAH’s 50-meter radius duplicate detection engine.' },
    { title: 'Restoring Trust: AI Visual Resolution Verification in Municipal Practice', date: 'July 28, 2026', tag: 'Civic Tech', desc: 'How automated before/after photo verification ensures work is actually completed.' },
    { title: 'SLA Escalations: Moving from Bureaucratic Delays to Guaranteed Action', date: 'July 10, 2026', tag: 'Governance', desc: 'Why strict response timers and background queue escalations drive accountability.' },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 space-y-10 font-sans">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[--text-muted] uppercase tracking-wider">
          Insights &amp; Research
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[--text-primary] tracking-tight">
          Civic Tech &amp; Engineering Journal
        </h1>
      </div>

      <div className="space-y-6">
        {posts.map((post, i) => (
          <div key={i} className="bg-[--bg-surface] border border-[--border] p-6 rounded-xl space-y-2 hover:border-blue-500/40 hover:shadow-xs transition-all">
            <div className="flex items-center gap-3 text-xs text-[--text-secondary]">
              <span className="bg-[--bg-subtle] text-[--text-primary] font-semibold px-2.5 py-0.5 rounded border border-[--border] text-[11px]">{post.tag}</span>
              <span>{post.date}</span>
            </div>
            <h2 className="text-lg font-bold text-[--text-primary]">{post.title}</h2>
            <p className="text-xs text-[--text-secondary] leading-relaxed">{post.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
