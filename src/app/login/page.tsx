'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Lock, Mail, ArrowRight, Briefcase } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const { loginCitizen } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!identifier.trim()) { setErrorMessage('Please enter your email or mobile number.'); return; }
    setLoading(true);
    const res = await loginCitizen(identifier.trim(), password);
    if (res.success) {
      router.push(returnUrl || '/dashboard');
    } else {
      setErrorMessage(res.error || 'Invalid credentials. Account not found.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-14 space-y-6 font-sans">

      {/* Brand */}
      <div className="text-center space-y-3">
        <Link href="/" className="inline-flex items-center justify-center gap-2">
          <Image src="/logo.png?v=4" alt="ISLAH Logo" width={48} height={38} className="h-10 w-auto object-contain" unoptimized />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[--text-primary] tracking-tight">Welcome back</h1>
          <p className="text-xs text-[--text-muted] mt-1">Sign in to your citizen account</p>
        </div>
      </div>

      {/* Card */}
      <div className="bg-[--bg-surface] rounded-xl border border-[--border] p-6 sm:p-8 space-y-5 shadow-sm">

        {errorMessage && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs rounded-xl">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">

          <div className="space-y-1.5">
            <label className="font-semibold text-[--text-primary] block">Email or Mobile</label>
            <div className="relative">
              <input
                required
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="you@domain.org"
                className="w-full border border-[--border] rounded-xl pl-9 pr-3 py-2.5 bg-[--bg-subtle] text-[--text-primary] placeholder-[--text-muted] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none transition-all"
              />
              <Mail className="w-4 h-4 text-[--text-muted] absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-[--text-primary]">Password</label>
              <button type="button" onClick={() => alert('Password reset link sent to your registered email/phone.')} className="text-[11px] text-[--text-muted] hover:text-[--text-primary] transition-colors cursor-pointer">
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-[--border] rounded-xl pl-9 pr-3 py-2.5 bg-[--bg-subtle] text-[--text-primary] placeholder-[--text-muted] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none transition-all"
              />
              <Lock className="w-4 h-4 text-[--text-muted] absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs active:scale-[0.99] disabled:opacity-50 shadow-sm cursor-pointer"
          >
            <span>{loading ? 'Signing in…' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-3 border-t border-[--border] text-center text-xs text-[--text-secondary] space-y-2">
          <div>
            No account?{' '}
            <Link href="/signup" className="font-semibold text-[--text-primary] hover:opacity-70 transition-opacity">Create one</Link>
          </div>
          <div>
            <Link href="/department/login" className="inline-flex items-center gap-1.5 text-[11px] text-[--text-muted] hover:text-[--text-primary] transition-colors">
              <Briefcase className="w-3.5 h-3.5" />
              Department Staff Login →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-[--bg-base] min-h-screen">
      <Suspense fallback={<div className="p-12 text-center text-xs text-[--text-muted]">Loading…</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
