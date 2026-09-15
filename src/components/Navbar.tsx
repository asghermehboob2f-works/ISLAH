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
    <header className="sticky top-0 z-50 w-full bg-[--bg-surface]/90 backdrop-blur-xl border-b border-[--border] font-sans">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center gap-2.5 focus:outline-none group">
              <Image
                src="/logo.png?v=4"
                alt="Islah Logo"
                width={42}
                height={34}
                className="h-8 sm:h-9 w-auto object-contain"
                unoptimized
              />
              <span className="brand-font text-lg sm:text-xl text-[--text-primary] leading-none translate-y-[1px] group-hover:opacity-70 transition-opacity">
                Islah
              </span>
            </Link>
          </div>

          {/* Center nav pill */}
          <nav className="hidden lg:flex items-center gap-0.5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-[--bg-subtle] border border-[--border] rounded-full px-2 py-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
                || (link.href === '/live-map' && pathname === '/heatmap')
                || (link.href === '/public-stats' && pathname === '/department-stats');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[--bg-surface] text-[--text-primary] shadow-sm border border-[--border] font-semibold'
                      : 'text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-surface]/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">

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
                    className="w-48 sm:w-56 h-9 bg-[--bg-subtle] border border-[--border] text-xs text-[--text-primary] placeholder-[--text-muted] pl-8 pr-7 rounded-full focus:outline-none focus:ring-2 focus:ring-[--ring]"
                  />
                  <Search className="w-3.5 h-3.5 text-[--text-muted] absolute left-2.5 top-2.5" />
                  <button
                    type="button"
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="absolute right-2.5 text-[--text-muted] hover:text-[--text-primary]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-9 h-9 text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-subtle] rounded-full border border-transparent hover:border-[--border] transition-all flex items-center justify-center"
                  title="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[--border] bg-[--bg-subtle] text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-surface] transition-all"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={activeRole === 'admin' ? '/admin' : activeRole === 'staff' ? '/department/dashboard' : '/dashboard'}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-[--border] bg-[--bg-subtle] text-[--text-primary] hover:bg-[--bg-surface] transition-all"
                >
                  {activeRole === 'admin' ? <Shield className="w-3.5 h-3.5 shrink-0" />
                    : activeRole === 'staff' ? <Briefcase className="w-3.5 h-3.5 shrink-0" />
                    : <User className="w-3.5 h-3.5 shrink-0" />}
                  <span className="max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={() => { logout(); router.push('/'); }}
                  title="Logout"
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-[--border] bg-[--bg-subtle] text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-surface] transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="relative" ref={loginRef}>
                <button
                  type="button"
                  onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                  className="flex items-center gap-1.5 bg-[--bg-subtle] hover:bg-[--bg-surface] text-[--text-primary] border border-[--border] text-xs font-medium px-3.5 py-2 rounded-full transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>

                {loginDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[--bg-surface] border border-[--border] rounded-2xl shadow-2xl p-1.5 z-50 space-y-0.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[--text-muted] px-3 pt-1.5 pb-1">Access Portal</p>
                    <Link
                      href="/login"
                      onClick={() => setLoginDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[--bg-subtle] transition-colors"
                    >
                      <User className="w-4 h-4 text-[--text-muted]" />
                      <div>
                        <div className="text-xs font-semibold text-[--text-primary]">Citizen Portal</div>
                        <div className="text-[10px] text-[--text-muted]">Report &amp; track civic issues</div>
                      </div>
                    </Link>
                    <Link
                      href="/department/login"
                      onClick={() => setLoginDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[--bg-subtle] transition-colors"
                    >
                      <Briefcase className="w-4 h-4 text-[--text-muted]" />
                      <div>
                        <div className="text-xs font-semibold text-[--text-primary]">Staff / Department</div>
                        <div className="text-[10px] text-[--text-muted]">Manage work queues</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Primary CTA */}
            <Link
              href={user ? '/report' : '/login?returnUrl=/report'}
              className="hidden sm:flex items-center gap-1.5 bg-[--text-primary] hover:opacity-80 text-[--bg-base] text-xs font-semibold px-4 py-2 rounded-full transition-all active:scale-[0.98] shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Report</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full border border-[--border] bg-[--bg-subtle] text-[--text-secondary]"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[--bg-surface] border-b border-[--border] px-4 pt-3 pb-5 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[--bg-subtle] text-[--text-primary] font-semibold'
                    : 'text-[--text-secondary] hover:bg-[--bg-subtle] hover:text-[--text-primary]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-[--border] space-y-1">
            <Link href="/report" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-xl text-xs font-semibold text-[--text-primary] bg-[--bg-subtle]">
              + Report Issue
            </Link>
            {!user && (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-xl text-xs font-medium text-[--text-secondary] hover:text-[--text-primary]">
                  Citizen Login
                </Link>
                <Link href="/department/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-xl text-xs font-medium text-[--text-secondary] hover:text-[--text-primary]">
                  Department Login
                </Link>
              </>
            )}
            {user && (
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); router.push('/'); }}
                className="w-full text-left px-4 py-2 rounded-xl text-xs font-medium text-[--text-secondary] hover:text-[--text-primary]"
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
