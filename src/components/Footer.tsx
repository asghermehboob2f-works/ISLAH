import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, PhoneCall } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[--bg-surface] border-t border-[--border] pt-12 pb-8 font-sans w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[--border]">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <Image src="/logo.png?v=4" alt="ISLAH Logo" width={38} height={30} className="h-8 w-auto object-contain" unoptimized />
              <span className="brand-font text-lg text-[--text-primary] leading-none translate-y-[1px] group-hover:opacity-70 transition-opacity">Islah</span>
            </Link>
            <p className="text-xs text-[--text-muted] max-w-sm leading-relaxed">
              Islah empowers citizens to report local issues in seconds and enables municipal departments to transparently track, resolve, and verify them.
            </p>
            <p className="text-[11px] text-[--text-muted]">Municipal SLA &amp; AI engine services operational.</p>
          </div>

          {/* Nav Group 1 */}
          <div>
            <h3 className="text-xs font-bold text-[--text-primary] uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-2.5 text-xs text-[--text-secondary]">
              {[
                { label: 'Report Civic Issue', href: '/report', external: true },
                { label: 'Live City Map', href: '/live-map' },
                { label: 'Citizen Dashboard', href: '/my-reports' },
                { label: 'Department Queue', href: '/ticket-queue' },
                { label: 'Track Ticket', href: '/track/ISL-2026-8942' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-[--text-primary] transition-colors inline-flex items-center gap-1">
                    {l.label} {l.external && <ArrowUpRight className="w-3 h-3 opacity-50" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav Group 2 */}
          <div>
            <h3 className="text-xs font-bold text-[--text-primary] uppercase tracking-wider mb-4">Transparency</h3>
            <ul className="space-y-2.5 text-xs text-[--text-secondary]">
              {[
                { label: 'Department SLA Stats', href: '/public-stats' },
                { label: 'Civic Impact Metrics', href: '/impact' },
                { label: 'Platform Features', href: '/features' },
                { label: 'Insights Blog', href: '/blog' },
              ].map((l) => (
                <li key={l.href}><Link href={l.href} className="hover:text-[--text-primary] transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Nav Group 3 */}
          <div>
            <h3 className="text-xs font-bold text-[--text-primary] uppercase tracking-wider mb-4">Organisation</h3>
            <ul className="space-y-2.5 text-xs text-[--text-secondary]">
              {[
                { label: 'About Islah', href: '/about' },
                { label: 'Citizen Participation', href: '/citizens' },
                { label: 'Municipal Officers', href: '/departments' },
                { label: 'Contact Support', href: '/contact' },
                { label: 'Privacy & Governance', href: '/privacy' },
              ].map((l) => (
                <li key={l.href}><Link href={l.href} className="hover:text-[--text-primary] transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[--text-muted]">
          <span>© {new Date().getFullYear()} Islah Platform. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-red-500" />
            Emergency Dispatch:&nbsp;
            <strong className="text-[--text-primary] font-mono">112 / Civic 311</strong>
          </span>
        </div>

      </div>
    </footer>
  );
}
