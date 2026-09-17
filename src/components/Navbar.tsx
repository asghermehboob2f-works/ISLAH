'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import {
  PlusCircle, Search, User, Briefcase, Shield,
  Menu, X, LogOut, LogIn, Sun, Moon,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, activeRole, logout, issues } = useApp();
  const { theme, toggleTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);

  const loginRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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
    { name: 'About', href: '/about' },
  ];

  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-40 w-full bg-[--bg-surface] border-b border-[--border] font-sans">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* 1. Left: Brand Logo positioned cleanly toward the left */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center gap-2.5 focus:outline-none group">
              <Image
                src="/logo.png?v=4"
                alt="Islah Logo"
                width={38}
                height={32}
                className="h-8 w-auto object-contain"
                unoptimized
              />
              <span className="brand-font text-xl text-[--text-primary] tracking-wider leading-none translate-y-[1px] group-hover:opacity-80 transition-opacity">
                Islah
              </span>
            </Link>
          </div>

          {/* 2. Center: Page Navigation Links Centered & Balanced */}
          <nav className="hidden md:flex items-center justify-center gap-6 lg:gap-8 mx-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
                || (link.href === '/live-map' && pathname === '/heatmap')
                || (link.href === '/public-stats' && pathname === '/department-stats');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-semibold py-1.5 transition-colors relative ${isActive
                      ? 'text-blue-700 dark:text-blue-400 font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-blue-700 dark:after:bg-blue-400'
                      : 'text-[--text-secondary] hover:text-[--text-primary]'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* 3. Right: Actions (Search, Theme, Auth, Report CTA, Mobile Menu) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">

            {/* Search */}
            <div className="relative flex items-center" ref={searchContainerRef}>
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Ticket # or keyword…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-44 sm:w-56 h-9 bg-[--bg-subtle] border border-[--border] text-xs text-[--text-primary] placeholder-[--text-muted] pl-8 pr-7 rounded-lg focus:outline-none focus:ring-1 focus:ring-[--ring]"
                  />
                  <Search className="w-4 h-4 text-[--text-muted] absolute left-2.5 top-2.5" />
                  <button
                    type="button"
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="absolute right-2.5 text-[--text-muted] hover:text-[--text-primary]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-9 h-9 text-[--text-secondary] hover:text-[--text-primary] bg-[--bg-surface] hover:bg-[--bg-subtle] rounded-lg border border-[--border] transition-all flex items-center justify-center shrink-0"
                  title="Search tickets"
                  aria-label="Search tickets"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-[--border] bg-[--bg-surface] text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-subtle] transition-all shrink-0"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User / Login */}
            {user ? (
              <div className="flex items-center gap-1.5">
                <Link
                  href={activeRole === 'admin' ? '/admin' : activeRole === 'staff' ? '/department/dashboard' : '/dashboard'}
                  className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-semibold border border-[--border] bg-[--bg-surface] text-[--text-primary] hover:bg-[--bg-subtle] transition-all"
                >
                  {activeRole === 'admin' ? <Shield className="w-4 h-4 text-red-500 shrink-0" />
                    : activeRole === 'staff' ? <Briefcase className="w-4 h-4 text-amber-500 shrink-0" />
                      : <User className="w-4 h-4 text-blue-600 shrink-0" />}
                  <span className="max-w-[85px] truncate">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={() => { logout(); router.push('/'); }}
                  title="Sign out"
                  aria-label="Sign out"
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[--border] bg-[--bg-surface] text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-subtle] transition-all shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative" ref={loginRef}>
                <button
                  type="button"
                  onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                  className="flex items-center gap-1.5 h-9 bg-[--bg-surface] hover:bg-[--bg-subtle] text-[--text-primary] border border-[--border] text-xs font-semibold px-3 rounded-lg transition-all"
                >
                  <LogIn className="w-4 h-4 text-[--text-secondary]" />
                  <span>Login</span>
                </button>

                {loginDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[--bg-surface] border border-[--border] rounded-xl shadow-xl p-1.5 z-50 space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[--text-muted] px-3 pt-2 pb-1">Access Portals</p>
                    <Link
                      href="/login"
                      onClick={() => setLoginDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-[--bg-subtle] transition-colors"
                    >
                      <User className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-[--text-primary]">Citizen Portal</div>
                        <div className="text-[10px] text-[--text-muted]">Report &amp; track civic issues</div>
                      </div>
                    </Link>
                    <Link
                      href="/department/login"
                      onClick={() => setLoginDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-[--bg-subtle] transition-colors"
                    >
                      <Briefcase className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-[--text-primary]">Staff / Department</div>
                        <div className="text-[10px] text-[--text-muted]">Manage field work orders</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Primary Action CTA — Prominent Civic Navy Accent */}
            <Link
              href={user ? '/report' : '/login?returnUrl=/report'}
              className="hidden sm:inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white dark:bg-blue-600 dark:hover:bg-blue-500 text-xs font-bold h-9 px-4 rounded-lg shadow-xs transition-all active:scale-[0.98] shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-[--border] bg-[--bg-surface] text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-subtle] transition-all shrink-0"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[--bg-surface] border-b border-[--border] px-4 pt-3 pb-5 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors ${isActive
                    ? 'bg-[--bg-subtle] text-blue-700 dark:text-blue-400 border border-[--border]'
                    : 'text-[--text-secondary] hover:bg-[--bg-subtle] hover:text-[--text-primary]'
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-[--border] space-y-2">
            <Link
              href="/report"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-blue-700 dark:bg-blue-600 hover:bg-blue-800"
            >
              + Report Issue
            </Link>
            {!user ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-3 py-2 rounded-lg text-xs font-semibold text-[--text-primary] bg-[--bg-subtle] border border-[--border]"
                >
                  Citizen Login
                </Link>
                <Link
                  href="/department/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-3 py-2 rounded-lg text-xs font-semibold text-[--text-primary] bg-[--bg-subtle] border border-[--border]"
                >
                  Department Login
                </Link>
              </div>
            ) : (
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); router.push('/'); }}
                className="w-full text-left px-4 py-2 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-[--bg-subtle]"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
