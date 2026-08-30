import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, ArrowUpRight, Activity, PhoneCall, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-12 pb-8">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        
        {/* Upper Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 focus:outline-none">
              <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                <Image src="/logo.png?v=3" alt="ISLAH Logo" width={40} height={40} className="w-full h-full object-contain" unoptimized />
              </div>
              <span className="brand-font text-2xl font-normal uppercase tracking-[0.1em] leading-none translate-y-[2.5px] bg-gradient-to-r from-emerald-400 via-teal-200 to-white bg-clip-text text-transparent">
                ISLAH
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              ISLAH is a modern civic technology infrastructure platform empowering citizens to report local issues in seconds and enabling municipal departments to transparently track, resolve, and verify them.
            </p>
            <p className="text-[11px] text-slate-500 flex items-center gap-2 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Municipal SLA & AI engine services operational.</span>
            </p>
          </div>

          {/* Nav Group 1 */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Platform & Tools
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/report" className="hover:text-blue-400 transition-colors flex items-center gap-1">
                  Report Civic Issue <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/heatmap" className="hover:text-blue-400 transition-colors">
                  Live City Heatmap
                </Link>
              </li>
              <li>
                <Link href="/my-reports" className="hover:text-blue-400 transition-colors">
                  Citizen Dashboard
                </Link>
              </li>
              <li>
                <Link href="/ticket-queue" className="hover:text-blue-400 transition-colors">
                  Department Queue
                </Link>
              </li>
              <li>
                <Link href="/track/ISL-2026-8942" className="hover:text-blue-400 transition-colors">
                  Track Ticket ID
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Group 2 */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Public Transparency
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/department-stats" className="hover:text-blue-400 transition-colors">
                  Department SLA Stats
                </Link>
              </li>
              <li>
                <Link href="/impact" className="hover:text-blue-400 transition-colors">
                  Civic Impact Metrics
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-blue-400 transition-colors">
                  Platform Architecture
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-blue-400 transition-colors">
                  Civic Insights Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Group 3 */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Organization
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  About ISLAH
                </Link>
              </li>
              <li>
                <Link href="/citizens" className="hover:text-blue-400 transition-colors">
                  Citizen Participation
                </Link>
              </li>
              <li>
                <Link href="/departments" className="hover:text-blue-400 transition-colors">
                  Municipal Officers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-400 transition-colors">
                  Privacy Policy & Governance
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} ISLAH Platform. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
              Emergency Hazard Dispatch: <strong className="text-slate-200 font-mono">112 / Civic 311</strong>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
