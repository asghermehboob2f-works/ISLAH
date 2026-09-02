import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, PhoneCall } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200 pt-12 pb-8 font-sans">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        
        {/* Upper Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-200">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 focus:outline-none group">
              <div className="relative flex items-center justify-center shrink-0">
                <Image
                  src="/logo.png?v=4"
                  alt="ISLAH Logo"
                  width={38}
                  height={30}
                  className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-2xs"
                  unoptimized
                />
              </div>
              <span className="brand-font text-lg sm:text-xl text-slate-900 leading-none translate-y-[1px]">
                Islah
              </span>
            </Link>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Islah is a modern civic technology infrastructure platform empowering citizens to report local issues in seconds and enabling municipal departments to transparently track, resolve, and verify them.
            </p>
            <p className="text-[11px] text-slate-500 pt-1">
              Municipal SLA &amp; AI engine services operational.
            </p>
          </div>

          {/* Nav Group 1 */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Platform &amp; Tools
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/report" className="hover:text-blue-600 transition-colors inline-flex items-center gap-1">
                  Report Civic Issue <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/live-map" className="hover:text-blue-600 transition-colors">
                  Live City Map
                </Link>
              </li>
              <li>
                <Link href="/my-reports" className="hover:text-blue-600 transition-colors">
                  Citizen Dashboard
                </Link>
              </li>
              <li>
                <Link href="/ticket-queue" className="hover:text-blue-600 transition-colors">
                  Department Queue
                </Link>
              </li>
              <li>
                <Link href="/track/ISL-2026-8942" className="hover:text-blue-600 transition-colors">
                  Track Ticket ID
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Group 2 */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Public Transparency
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/public-stats" className="hover:text-blue-600 transition-colors">
                  Department SLA Stats
                </Link>
              </li>
              <li>
                <Link href="/impact" className="hover:text-blue-600 transition-colors">
                  Civic Impact Metrics
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-blue-600 transition-colors">
                  Platform Architecture
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-blue-600 transition-colors">
                  Civic Insights Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Group 3 */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Organization
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-blue-600 transition-colors">
                  About Islah
                </Link>
              </li>
              <li>
                <Link href="/citizens" className="hover:text-blue-600 transition-colors">
                  Citizen Participation
                </Link>
              </li>
              <li>
                <Link href="/departments" className="hover:text-blue-600 transition-colors">
                  Municipal Officers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-600 transition-colors">
                  Privacy Policy &amp; Governance
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Islah Platform. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-600">
              <PhoneCall className="w-3.5 h-3.5 text-red-600" />
              Emergency Hazard Dispatch: <strong className="text-slate-900 font-mono">112 / Civic 311</strong>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

