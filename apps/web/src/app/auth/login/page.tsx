'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiRequest } from '../../../lib/api-client';
import { useAuthStore } from '../../../lib/auth-store';

// ── Dedicated role credentials (demo / prototype) ──
const SUPER_ADMIN_EMAIL = 'superadmin@wegen.et';
const SUPER_ADMIN_PW    = 'SuperAdmin@2026';

const ADMIN_EMAIL       = 'admin@wegen.et';
const ADMIN_PASSWORD    = 'Admin@2026';

const STAFF_EMAIL       = 'staff@wegen.et';
const STAFF_PASSWORD    = 'Staff@2026';

function LoginContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const setAuth      = useAuthStore((s) => s.setAuth);

  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg,     setErrorMsg]     = useState('');
  const [socialNotice, setSocialNotice] = useState('');
  const [loading,      setLoading]      = useState(false);

  const nextUrl = searchParams.get('next') || '/dashboard';

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSocialNotice('');

    if (!validateEmail(email)) {
      setErrorMsg('Enter a valid email address.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    const normEmail = email.trim().toLowerCase();

    // ── Check Super Admin credentials ──
    if (normEmail === SUPER_ADMIN_EMAIL && password === SUPER_ADMIN_PW) {
      setAuth(
        {
          id: 'superadmin-001',
          email: SUPER_ADMIN_EMAIL,
          firstName: 'Super',
          lastName: 'Admin',
          roles: ['SUPER_ADMIN', 'ADMIN'],
          isEmailVerified: true,
        },
        'superadmin-demo-token'
      );
      localStorage.setItem('ethiofund-user', JSON.stringify({ email: SUPER_ADMIN_EMAIL, role: 'SUPER_ADMIN' }));
      setLoading(false);
      router.push('/super');
      return;
    }

    // ── Check Admin credentials ──
    if (normEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setAuth(
        {
          id: 'admin-001',
          email: ADMIN_EMAIL,
          firstName: 'WeGen',
          lastName: 'Admin',
          roles: ['ADMIN'],
          isEmailVerified: true,
        },
        'admin-demo-token'
      );
      localStorage.setItem('ethiofund-user', JSON.stringify({ email: ADMIN_EMAIL, role: 'ADMIN' }));
      setLoading(false);
      router.push('/admin');
      return;
    }

    // ── Check Staff credentials ──
    if (normEmail === STAFF_EMAIL && password === STAFF_PASSWORD) {
      setAuth(
        {
          id: 'staff-001',
          email: STAFF_EMAIL,
          firstName: 'Verification',
          lastName: 'Staff',
          roles: ['STAFF'],
          isEmailVerified: true,
        },
        'staff-demo-token'
      );
      localStorage.setItem('ethiofund-user', JSON.stringify({ email: STAFF_EMAIL, role: 'STAFF' }));
      setLoading(false);
      router.push('/staff');
      return;
    }

    try {
      localStorage.setItem('ethiofund-user', JSON.stringify({ email: email.trim() }));

      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password: password || 'Password123!' }),
      });

      setLoading(false);

      if (res.success && res.data) {
        setAuth(res.data.user, res.data.tokens.accessToken);
        if (res.data.user.roles.includes('ADMIN')) {
          router.push('/admin');
          return;
        }
      } else {
        setAuth(
          {
            id: 'u1',
            email: email.trim(),
            firstName: email.split('@')[0],
            lastName: 'User',
            roles: ['FUNDRAISER'],
            isEmailVerified: true,
          },
          'demo-access-token'
        );
      }

      router.push(nextUrl);
    } catch {
      setLoading(false);
      router.push(nextUrl);
    }
  };

  const handleSocialClick = (provider: string) => {
    setErrorMsg('');
    setSocialNotice(`${provider} sign-in isn't connected yet. Use your email for now.`);
  };

  return (
    <div className="min-h-svh bg-[#E4E4E4] text-[#1A1A1A] font-sans grid place-items-center p-6 antialiased">
      <main className="relative bg-white rounded-[28px] min-[520px]:rounded-[40px] w-full max-w-[520px] p-[60px_22px_28px] min-[520px]:p-[64px_44px_40px] text-center shadow-[0_24px_80px_rgba(0,0,0,0.18)]">

        {/* Close */}
        <Link
          href="/"
          className="absolute top-[22px] right-[26px] w-[40px] h-[40px] grid place-items-center rounded-full text-[#1A1A1A] hover:bg-[#F6F6F6] text-xl transition-colors"
          aria-label="Close"
        >
          ✕
        </Link>

        {/* Logo */}
        <div className="inline-flex items-center gap-[9px] font-heading font-bold text-[17px] mb-5 text-[#1A1A1A]">
          <i className="w-[20px] h-[20px] rounded-full bg-[#CCF88E] border-2 border-[#1A1A1A] inline-block shrink-0 not-italic" />
          WeGen
        </div>

        <h1 className="font-heading font-bold text-[34px] leading-tight tracking-tight text-[#1A1A1A]">
          Welcome back
        </h1>
        <p className="mt-2 mb-6 text-[#1A1A1A] text-base">
          Sign in to WeGen to continue.
        </p>

        {/* Social buttons */}
        <div className="space-y-3 mb-5">
          <button
            type="button"
            onClick={() => handleSocialClick('Google')}
            className="flex items-center justify-center gap-3 w-full border border-[#d6d6d6] bg-white rounded-full p-[15px] font-semibold text-base hover:bg-[#F6F6F6] transition-colors cursor-pointer"
          >
            <b className="w-[22px] h-[22px] grid place-items-center font-heading font-bold text-lg bg-clip-text text-transparent bg-[conic-gradient(#ea4335_0_25%,#fbbc05_0_50%,#34a853_0_75%,#4285f4_0)] not-italic">G</b>
            <span>Sign in with Google</span>
          </button>
          <button
            type="button"
            onClick={() => handleSocialClick('Apple')}
            className="flex items-center justify-center gap-3 w-full border border-[#d6d6d6] bg-white rounded-full p-[15px] font-semibold text-base hover:bg-[#F6F6F6] transition-colors cursor-pointer"
          >
            <b className="w-[22px] h-[22px] grid place-items-center text-xs text-white bg-[#1A1A1A] rounded-full not-italic">A</b>
            <span>Continue with Apple</span>
          </button>
        </div>

        {socialNotice && (
          <div className="bg-[#FFF3C9] rounded-xl p-3 text-xs text-[#5b4a00] font-medium mb-4 text-left">
            {socialNotice}
          </div>
        )}

        <div className="flex items-center gap-4 my-5 text-[#1A1A1A] text-sm font-medium before:flex-1 before:h-[1px] before:bg-[#EBEBEB] after:flex-1 after:h-[1px] after:bg-[#EBEBEB]">
          or
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email */}
          <label className={`block text-left border rounded-[14px] p-[8px_18px_10px] bg-white transition-all ${
            errorMsg ? 'border-[#B3261E]' : 'border-[#cfcfcf] focus-within:border-[#1A1A1A] focus-within:ring-1 focus-within:ring-[#1A1A1A]'
          }`}>
            <span className="block text-xs text-[#6E6E6E] mb-0.5">Email address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
              autoComplete="email"
              inputMode="email"
              placeholder="name@example.com"
              className="w-full border-0 outline-none text-[17px] bg-transparent text-[#1A1A1A]"
            />
          </label>

          {/* Password */}
          <label className="block text-left border border-[#cfcfcf] rounded-[14px] p-[8px_18px_10px] bg-white transition-all focus-within:border-[#1A1A1A] focus-within:ring-1 focus-within:ring-[#1A1A1A]">
            <span className="block text-xs text-[#6E6E6E] mb-0.5">Password</span>
            <div className="flex items-center gap-2">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="flex-1 border-0 outline-none text-[17px] bg-transparent text-[#1A1A1A]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#6E6E6E] hover:text-[#1A1A1A] text-xs font-medium transition-colors"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <div className="text-[#B3261E] text-sm text-left min-h-[20px] font-medium" role="alert">
            {errorMsg}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A1A1A] hover:bg-black text-white font-semibold text-base py-4 rounded-full transition-all cursor-pointer disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Demo Quick-Fill Credentials */}
        <div className="mt-6 p-4 bg-[#F0F0F0] rounded-2xl text-left border border-[#E0E0E0]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E6E6E] block mb-2">
            Quick-Fill Credentials (Click to fill)
          </span>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => { setEmail(SUPER_ADMIN_EMAIL); setPassword(SUPER_ADMIN_PW); }}
              className="text-left p-2 rounded-xl bg-white hover:bg-[#FAF9F5] border border-[#E5E5E5] transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A1A1A]">Super Admin (Owner)</span>
                <span className="text-[10px] bg-[#1A1A1A] text-white px-2 py-0.5 rounded-full font-bold">/super</span>
              </div>
              <div className="text-[11px] text-[#6E6E6E] font-mono mt-0.5">superadmin@wegen.et · SuperAdmin@2026</div>
            </button>

            <button
              type="button"
              onClick={() => { setEmail(ADMIN_EMAIL); setPassword(ADMIN_PASSWORD); }}
              className="text-left p-2 rounded-xl bg-white hover:bg-[#FAF9F5] border border-[#E5E5E5] transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A1A1A]">Admin</span>
                <span className="text-[10px] bg-[#CCF88E] text-[#1A1A1A] px-2 py-0.5 rounded-full font-bold">/admin</span>
              </div>
              <div className="text-[11px] text-[#6E6E6E] font-mono mt-0.5">admin@wegen.et · Admin@2026</div>
            </button>

            <button
              type="button"
              onClick={() => { setEmail(STAFF_EMAIL); setPassword(STAFF_PASSWORD); }}
              className="text-left p-2 rounded-xl bg-white hover:bg-[#FAF9F5] border border-[#E5E5E5] transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A1A1A]">Staff (Reviewer)</span>
                <span className="text-[10px] bg-[#E0F2FE] text-[#0369A1] px-2 py-0.5 rounded-full font-bold">/staff</span>
              </div>
              <div className="text-[11px] text-[#6E6E6E] font-mono mt-0.5">staff@wegen.et · Staff@2026</div>
            </button>
          </div>
        </div>

        <small className="block mt-5 text-[#6E6E6E] text-xs">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="underline text-[#6E6E6E]">Terms of Service</Link> and{' '}
          <Link href="/privacy" className="underline text-[#6E6E6E]">Privacy Notice</Link>.
        </small>

        <p className="mt-5 text-sm text-[#6E6E6E]">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="font-semibold text-[#1A1A1A] underline underline-offset-2 hover:text-[#6E6E6E] transition-colors">
            Sign up
          </Link>
        </p>

      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F6F6F6] grid place-items-center"><p className="text-sm font-medium text-[#6E6E6E]">Loading...</p></div>}>
      <LoginContent />
    </Suspense>
  );
}
