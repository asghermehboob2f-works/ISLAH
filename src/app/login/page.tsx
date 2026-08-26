'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Briefcase
} from 'lucide-react';

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

    if (!identifier.trim()) {
      setErrorMessage('Please enter your email or mobile number.');
      return;
    }

    setLoading(true);
    const res = await loginCitizen(identifier.trim(), password);

    if (res.success) {
      if (returnUrl) {
        router.push(returnUrl);
      } else {
        router.push('/dashboard');
      }
    } else {
      setErrorMessage(res.error || 'Invalid credentials. Account not found.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-12 space-y-6 font-sans">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="relative w-14 h-14 flex items-center justify-center mx-auto shrink-0">
          <Image src="/logo.png?v=3" alt="ISLAH Logo" width={56} height={56} className="w-full h-full object-contain" unoptimized />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-xs text-slate-500">
          Log in to your citizen account to track reports and manage civic actions
        </p>
      </div>

      {/* Login Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">
        
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Email or Mobile Number
            </label>
            <div className="relative">
              <input
                required
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="you@domain.org or +1 (555) 000-0000"
                className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-xs"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-700">Password</label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to your registered email/phone."); }} className="text-[11px] font-semibold text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-xs"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-xs active:scale-[0.99] disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Login'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-600 space-y-2">
          <div>
            Don't have an account?{' '}
            <Link href="/signup" className="font-bold text-blue-600 hover:underline">
              Create account
            </Link>
          </div>

          <div className="pt-2">
            <Link href="/department/login" className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-800">
              <Briefcase className="w-3.5 h-3.5 text-amber-500" />
              <span>Department Staff Login →</span>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-bold text-slate-500">Loading Login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
