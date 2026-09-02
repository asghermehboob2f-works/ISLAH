'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  PlusCircle,
  Search,
  User,
  Briefcase,
  Shield,
  Menu,
  X,
  LogOut,
  LogIn,
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
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown & search on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (loginRef.current && !loginRef.current.contains(event.target as Node)) {
        setLoginDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
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
    const found = issues.find(
      (i) => i.ticketNumber.toLowerCase() === trimmed.toLowerCase() || i.id.toLowerCase() === trimmed.toLowerCase()
    );

    setSearchOpen(false);
    if (found) {
      router.push(`/track/${found.ticketNumber}`);
    } else {
      router.push(`/reports?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Map', href: '/live-map' },
    { name: 'Reports', href: '/reports' },
    { name: 'Public Stats', href: '/public-stats' },
    { name: 'About Us', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 text-slate-900 font-sans transition-all">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative">
        <div className="flex items-center justify-between h-16">

          {/* 1. Left: Logo & Brand Wordmark */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center gap-2.5 focus:outline-none group">
              <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                <Image src="/logo.png?v=3" alt="Islah Logo" width={40} height={40} className="w-full h-full object-contain" unoptimized />
              </div>
              <span className="brand-font text-lg sm:text-xl text-slate-900 leading-none translate-y-[1px]">
                Islah
              </span>
            </Link>
          </div>

          {/* 2. Absolute Centered Main Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href === '/' && pathname === '/') ||
                (link.href === '/live-map' && pathname === '/heatmap') ||
                (link.href === '/public-stats' && pathname === '/department-stats');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'text-blue-600 font-semibold bg-blue-50/70 border border-blue-100/60 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* 3. Right Actions: Search + User Login + Primary Blue CTA */}
          <div className="flex items-center gap-2.5 shrink-0">

            {/* Expandable Search Input / Icon */}
            <div className="relative flex items-center" ref={searchContainerRef}>
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center relative animate-in fade-in duration-150">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search ticket # or topic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 sm:w-60 h-9 bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 pl-8 pr-7 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-2xs"
                  />
                  <Search className="w-3.5 h-3.5 text-blue-600 absolute left-2.5 top-2.5" />
                  <button
                    type="button"
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="absolute right-2 text-slate-400 hover:text-slate-700 transition-colors"
                    title="Close search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-9 h-9 text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 rounded-lg border border-transparent hover:border-slate-200 transition-all flex items-center justify-center shrink-0"
                  title="Search platform reports"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* User Account / Click-Activated Portal Login */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={
                    activeRole === 'admin'
                      ? '/admin'
                      : activeRole === 'staff'
                        ? '/department/dashboard'
                        : '/dashboard'
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    activeRole === 'admin'
                      ? 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100'
                      : activeRole === 'staff'
                        ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                        : 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100'
                  }`}
                >
                  {activeRole === 'admin' ? (
                    <Shield className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  ) : activeRole === 'staff' ? (
                    <Briefcase className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  )}
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    router.push('/');
                  }}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="relative" ref={loginRef}>
                <button
                  type="button"
                  onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                  className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100/80 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-medium px-3.5 py-2 rounded-lg transition-all shadow-2xs"
                >
                  <LogIn className="w-3.5 h-3.5 text-blue-600" />
                  <span>Login</span>
                </button>

                {loginDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-50 space-y-1 animate-in fade-in duration-100">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1">
                      Select Access Portal
                    </div>

                    <Link
                      href="/login"
                      onClick={() => setLoginDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <User className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
                      <div>
                        <div className="text-xs font-medium text-slate-900">Citizen Portal</div>
                        <div className="text-[10px] text-slate-500">Report &amp; track civic issues</div>
                      </div>
                    </Link>

                    <Link
                      href="/department/login"
                      onClick={() => setLoginDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <Briefcase className="w-4 h-4 text-amber-600 group-hover:text-amber-700" />
                      <div>
                        <div className="text-xs font-medium text-slate-900">Staff / Department</div>
                        <div className="text-[10px] text-slate-500">Manage work queues</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Primary Action: Blue Report Issue CTA */}
            <Link
              href={user ? '/report' : '/login?returnUrl=/report'}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-all active:scale-[0.98] shrink-0 shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Report an Issue</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-2 font-sans">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {user ? (
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <Link
                  href={
                    activeRole === 'admin'
                      ? '/admin'
                      : activeRole === 'staff'
                        ? '/department/dashboard'
                        : '/dashboard'
                  }
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-xs font-medium text-blue-600 bg-blue-50"
                >
                  Dashboard ({user.name})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    router.push('/');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-900 hover:bg-slate-50"
                >
                  Citizen Login
                </Link>
                <Link
                  href="/department/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-900 hover:bg-slate-50"
                >
                  Department Login
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
