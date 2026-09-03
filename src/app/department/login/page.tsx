'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  ShieldCheck, 
  Briefcase, 
  KeyRound, 
  Lock, 
  ArrowRight
} from 'lucide-react';

export default function DepartmentLoginPage() {
  const router = useRouter();
  const { loginStaff } = useApp();

  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!staffId.trim()) {
      setErrorMessage('Please enter your official Staff ID or Email.');
      return;
    }

    setLoading(true);
    const res = await loginStaff(staffId.trim(), password);

    if (res.success) {
      router.push('/department/dashboard');
    } else {
      setErrorMessage(res.error || 'Invalid Staff ID or password. Please verify your department credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-12 space-y-6 font-sans">
      
      <div className="text-center space-y-3">
        <Link href="/" className="inline-flex items-center justify-center gap-2 focus:outline-none">
          <Image 
            src="/logo.png?v=4" 
            alt="ISLAH Logo" 
            width={56} 
            height={44} 
            className="h-12 w-auto object-contain" 
            unoptimized 
          />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Staff Authentication
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Authorized municipal department officers & field dispatch personnel
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">
        
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleStaffLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Official Staff ID or Email
            </label>
            <div className="relative">
              <input
                required
                type="text"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                placeholder="STF-PW-001 or officer@metro.gov"
                className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all text-xs font-mono"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all text-xs"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl shadow-md shadow-amber-600/30 transition-all flex items-center justify-center gap-2 text-xs active:scale-[0.99] disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating Staff...' : 'Authenticate & Enter Queue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-600">
          Are you a citizen?{' '}
          <Link href="/login" className="font-bold text-blue-600 hover:underline">
            Citizen Login
          </Link>
        </div>

      </div>

    </div>
  );
}
