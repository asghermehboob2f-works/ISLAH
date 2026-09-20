'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signupCitizen } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName || !email || !phone || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const res = await signupCitizen(fullName, email, phone, password);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setErrorMessage(res.error || 'Failed to create account. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-12 space-y-6 font-sans">

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center mx-auto">
          <Image
            src="/logo.png?v=4"
            alt="Islah Logo"
            width={64}
            height={64}
            className="h-14 w-auto object-contain"
            unoptimized
          />
        </div>
        <h1 className="text-2xl font-extrabold text-[--text-primary] tracking-tight">
          Create your account
        </h1>
        <p className="text-xs text-[--text-secondary]">
          Join the ISLAH civic network to report and track municipal progress
        </p>
      </div>

      {/* Card */}
      <div className="bg-[--bg-surface] rounded-xl border border-[--border] p-6 sm:p-8 space-y-5 shadow-sm">

        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-xs rounded-xl font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-[--text-primary] block mb-1">Full Name</label>
            <div className="relative">
              <input
                required
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full border border-[--border] rounded-xl pl-9 pr-3 py-2.5 bg-[--bg-subtle] text-[--text-primary] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-xs"
              />
              <User className="w-4 h-4 text-[--text-secondary] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="font-semibold text-[--text-primary] block mb-1">Email Address</label>
            <div className="relative">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full border border-[--border] rounded-xl pl-9 pr-3 py-2.5 bg-[--bg-subtle] text-[--text-primary] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-xs"
              />
              <Mail className="w-4 h-4 text-[--text-secondary] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="font-semibold text-[--text-primary] block mb-1">Phone Number</label>
            <div className="relative">
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full border border-[--border] rounded-xl pl-9 pr-3 py-2.5 bg-[--bg-subtle] text-[--text-primary] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-xs"
              />
              <Phone className="w-4 h-4 text-[--text-secondary] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="font-semibold text-[--text-primary] block mb-1">Password</label>
            <div className="relative">
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-[--border] rounded-xl pl-9 pr-3 py-2.5 bg-[--bg-subtle] text-[--text-primary] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-xs"
              />
              <Lock className="w-4 h-4 text-[--text-secondary] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="font-semibold text-[--text-primary] block mb-1">Confirm Password</label>
            <div className="relative">
              <input
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-[--border] rounded-xl pl-9 pr-3 py-2.5 bg-[--bg-subtle] text-[--text-primary] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-xs"
              />
              <Lock className="w-4 h-4 text-[--text-secondary] absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-xs active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-3 border-t border-[--border] text-center text-xs text-[--text-secondary]">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            Login
          </Link>
        </div>

      </div>

    </div>
  );
}
