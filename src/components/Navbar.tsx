'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  PlusCircle, 
  MapPin, 
  Search, 
  User, 
  Briefcase, 
  BarChart3, 
  ShieldCheck, 
  Menu, 
  X,
  FileText,
  Info,
  Shield,
  LogOut,
  LogIn,
  Trees,
  Leaf
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, activeRole, logout, issues } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);

  const loginRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (loginRef.current && !loginRef.current.contains(event.target as Node)) {
        setLoginDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto focus search input when expanded
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const trimmed = searchQuery.trim();
    const found = issues.find(i => i.ticketNumber.toLowerCase() === trimmed.toLowerCase() || i.id.toLowerCase() === trimmed.toLowerCase());

    setSearchOpen(false);
    if (found) {
      router.push(`/track/${found.ticketNumber}`);
    } else {
      router.push(`/reports?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const navLinks = [
    { name: 'Live Map', href: '/live-map', icon: MapPin },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Public Stats', href: '/public-stats', icon: BarChart3 },
    { name: 'About', href: '/about', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white shadow-md font-sans transition-all">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative">
        <div className="flex items-center justify-between h-16">
          
          {/* 1. Left: Logo & Brand Identity */}
          <div className="flex items-center shrink-0 z-10">
            <Link href="/" className="flex items-center gap-3 focus:outline-none">
              <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                <Image src="/logo.png?v=3" alt="ISLAH Logo" width={40} height={40} className="w-full h-full object-contain" unoptimized />
              </div>
              <span className="brand-font text-2xl font-normal uppercase tracking-[0.1em] leading-none translate-y-[2.5px] bg-gradient-to-r from-emerald-400 via-teal-200 to-white bg-clip-text text-transparent">
                ISLAH
              </span>
            </Link>
          </div>

          {/* 2. Exact Optical & Geometric Viewport Center: Primary Navigation */}
          <nav className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2 z-0">
            <div className="inline-flex items-center justify-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 shadow-inner">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href === '/live-map' && pathname === '/heatmap') || (link.href === '/public-stats' && pathname === '/department-stats');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* 3. Right: Search + Report Issue CTA + Click-Driven User Login */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 z-10">
            
            {/* Expandable Search Input / Button */}
            <div className="relative flex items-center">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center relative animate-in fade-in zoom-in-95 duration-200">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search reports, tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 sm:w-64 bg-slate-900 border border-blue-500/60 text-xs text-slate-100 placeholder-slate-400 pl-8 pr-8 py-1.5 rounded-xl focus:outline-none ring-2 ring-blue-500/20"
                  />
                  <Search className="w-3.5 h-3.5 text-blue-400 absolute left-2.5 top-2.5" />
                  <button
                    type="button"
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="absolute right-2 top-2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  title="Search platform reports"
                >
                  <Search className="w-4 h-4 text-blue-400" />
                  <span className="hidden xl:inline text-slate-400">Search</span>
                </button>
              )}
            </div>

            {/* Primary Action: Report Issue Button */}
            <Link
              href={user ? '/report' : '/login?returnUrl=/report'}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md shadow-blue-600/30 hover:shadow-blue-600/50 transition-all active:scale-[0.98] shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Report Issue</span>
              <span className="sm:hidden">Report</span>
            </Link>

            {/* User Account / Click-Activated Portal Login */}
            {user ? (
              <div className="flex items-center gap-1.5">
                <Link
                  href={
                    activeRole === 'admin'
                      ? '/admin'
                      : activeRole === 'staff'
                      ? '/department/dashboard'
                      : '/dashboard'
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    activeRole === 'admin'
                      ? 'bg-purple-950/80 border-purple-500/50 text-purple-300 hover:bg-purple-900'
                      : activeRole === 'staff'
                      ? 'bg-amber-950/80 border-amber-500/50 text-amber-300 hover:bg-amber-900'
                      : 'bg-blue-950/80 border-blue-500/50 text-blue-300 hover:bg-blue-900'
                  }`}
                >
                  {activeRole === 'admin' ? (
                    <Shield className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  ) : activeRole === 'staff' ? (
                    <Briefcase className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  )}
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    router.push('/');
                  }}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Click-Activated Login Dropdown Selector */
              <div className="relative" ref={loginRef}>
                <button
                  type="button"
                  onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  <LogIn className="w-3.5 h-3.5 text-blue-400" />
                  <span>Login</span>
                </button>

                {loginDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1 animate-in fade-in slide-in-from-top-2">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                      Select Access Portal
                    </div>
                    
                    <Link
                      href="/login"
                      onClick={() => setLoginDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-800 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-100">Citizen Portal</div>
                        <div className="text-[10px] text-slate-400">Report & track civic issues</div>
                      </div>
                    </Link>

                    <Link
                      href="/department/login"
                      onClick={() => setLoginDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-800 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-100">Staff / Department</div>
                        <div className="text-[10px] text-slate-400">Manage departmental work queue</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Drawer Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-5 space-y-3">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 text-blue-400" />
                  {link.name}
                </Link>
              );
            })}

            {user ? (
              <div className="pt-2 border-t border-slate-800 space-y-1">
                <Link
                  href={
                    activeRole === 'admin'
                      ? '/admin'
                      : activeRole === 'staff'
                      ? '/department/dashboard'
                      : '/dashboard'
                  }
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-blue-300 bg-slate-900 border border-slate-800"
                >
                  <User className="w-4 h-4" />
                  Dashboard ({user.name})
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    router.push('/');
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/30"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Access Portals</div>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600"
                >
                  <User className="w-4 h-4" />
                  <span>Citizen Login</span>
                </Link>
                <Link
                  href="/department/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-500/40"
                >
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <span>Staff / Department Login</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
