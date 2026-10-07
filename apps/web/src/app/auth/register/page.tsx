'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiRequest } from '../../../lib/api-client';
import { useAuthStore } from '../../../lib/auth-store';

const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
const validatePhone = (p: string) => /^(\+?251|0)[79]\d{8}$/.test(p.replace(/\s/g, ''));

export default function RegisterPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const setAuth      = useAuthStore((s) => s.setAuth);

  const nextUrl = searchParams.get('next') || '/dashboard';

  const [fullName,   setFullName]   = useState('');
  const [email,      setEmail]      = useState('');
  const [phone,      setPhone]      = useState('');
  const [password,   setPassword]   = useState('');
  const [confirm,    setConfirm]    = useState('');
  const [showPw,     setShowPw]     = useState(false);
  const [showCf,     setShowCf]     = useState(false);
  const [errorMsg,   setErrorMsg]   = useState('');
  const [loading,    setLoading]    = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) { setErrorMsg('Please enter your full name.'); return; }
    if (!validateEmail(email)) { setErrorMsg('Enter a valid email address.'); return; }
    if (phone && !validatePhone(phone)) { setErrorMsg('Enter a valid Ethiopian phone number (e.g. 0912345678).'); return; }
    if (password.length < 8) { setErrorMsg('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setErrorMsg('Passwords do not match.'); return; }

    setLoading(true);
    const parts     = fullName.trim().split(' ');
    const firstName = parts[0] || 'User';
    const lastName  = parts.slice(1).join(' ') || 'Member';

    try {
      const res = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ firstName, lastName, email: email.trim(), password, phone: phone || undefined }),
      });

      if (res.success && res.data) {
        setAuth(res.data.user, res.data.tokens.accessToken);
      } else {
        // Demo fallback
        setAuth(
          { id: 'u1', email: email.trim(), firstName, lastName, roles: ['FUNDRAISER'], isEmailVerified: false },
          'demo-token'
        );
      }
      router.push(nextUrl);
    } catch {
      // Demo fallback when API is offline
      const parts2 = fullName.trim().split(' ');
      setAuth(
        { id: 'u1', email: email.trim(), firstName: parts2[0] || 'User', lastName: parts2.slice(1).join(' ') || 'Member', roles: ['FUNDRAISER'], isEmailVerified: false },
        'demo-token'
      );
      router.push(nextUrl);
    } finally {
      setLoading(false);
    }
  };

  const fieldCls = (hasError?: boolean) =>
    `block text-left border rounded-[14px] p-[8px_18px_10px] bg-white transition-all ${
      hasError
        ? 'border-[#B3261E]'
        : 'border-[#cfcfcf] focus-within:border-[#1A1A1A] focus-within:ring-1 focus-within:ring-[#1A1A1A]'
    }`;

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
          Create your account
        </h1>
        <p className="mt-2 mb-6 text-[#1A1A1A] text-base">
          Join WeGen to start raising funds.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-left">

          {/* Full name */}
          <label className={fieldCls(!fullName.trim() && !!errorMsg && errorMsg.includes('name'))}>
            <span className="block text-xs text-[#6E6E6E] mb-0.5">Full name</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => { setFullName(e.target.value); setErrorMsg(''); }}
              autoComplete="name"
              placeholder="Abebe Kebede"
              className="w-full border-0 outline-none text-[17px] bg-transparent text-[#1A1A1A]"
            />
          </label>

          {/* Email */}
          <label className={fieldCls(!!errorMsg && errorMsg.includes('email'))}>
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

          {/* Phone */}
          <label className={fieldCls(!!errorMsg && errorMsg.includes('phone'))}>
            <span className="block text-xs text-[#6E6E6E] mb-0.5">Phone number <span className="text-[#A0A0A0] font-normal">(optional)</span></span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setErrorMsg(''); }}
              autoComplete="tel"
              inputMode="tel"
              placeholder="09 1234 5678"
              className="w-full border-0 outline-none text-[17px] bg-transparent text-[#1A1A1A]"
            />
          </label>

          {/* Password */}
          <label className={fieldCls(!!errorMsg && errorMsg.includes('Password'))}>
            <span className="block text-xs text-[#6E6E6E] mb-0.5">Password</span>
            <div className="flex items-center gap-2">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className="flex-1 border-0 outline-none text-[17px] bg-transparent text-[#1A1A1A]"
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="text-[#6E6E6E] hover:text-[#1A1A1A] text-xs font-medium transition-colors shrink-0">
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          {/* Confirm password */}
          <label className={fieldCls(!!errorMsg && errorMsg.includes('match'))}>
            <span className="block text-xs text-[#6E6E6E] mb-0.5">Confirm password</span>
            <div className="flex items-center gap-2">
              <input
                type={showCf ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setErrorMsg(''); }}
                autoComplete="new-password"
                placeholder="Repeat your password"
                className="flex-1 border-0 outline-none text-[17px] bg-transparent text-[#1A1A1A]"
              />
              <button type="button" onClick={() => setShowCf(!showCf)}
                className="text-[#6E6E6E] hover:text-[#1A1A1A] text-xs font-medium transition-colors shrink-0">
                {showCf ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          {/* Error */}
          <div className="text-[#B3261E] text-sm text-left min-h-[20px] font-medium" role="alert">
            {errorMsg}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A1A1A] hover:bg-black text-white font-semibold text-base py-4 rounded-full transition-all cursor-pointer disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <small className="block mt-5 text-[#6E6E6E] text-xs">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="underline text-[#6E6E6E]">Terms of Service</Link> and{' '}
          <Link href="/privacy" className="underline text-[#6E6E6E]">Privacy Notice</Link>.
        </small>

        <p className="mt-5 text-sm text-[#6E6E6E]">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold text-[#1A1A1A] underline underline-offset-2 hover:text-[#6E6E6E] transition-colors">
            Sign in
          </Link>
        </p>

      </main>
    </div>
  );
}
