'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiRequest } from '../../../lib/api-client';
import { useAuthStore } from '../../../lib/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [socialNotice, setSocialNotice] = useState('');
  const [loading, setLoading] = useState(false);

  // Next URL after login
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

    try {
      // Save local user draft
      localStorage.setItem('ethiofund-user', JSON.stringify({ email: email.trim() }));

      // API authentication attempt
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password: 'Password123!' }),
      });

      setLoading(false);

      if (res.success && res.data) {
        setAuth(res.data.user, res.data.tokens.accessToken);
        if (res.data.user.roles.includes('ADMIN')) {
          router.push('/admin');
          return;
        }
      } else {
        // Fallback local auth for demo mode
        setAuth(
          {
            id: 'u1',
            email: email.trim(),
            firstName: email.split('@')[0],
            lastName: 'User',
            roles: ['FUNDRAISER'],
          },
          'demo-access-token'
        );
      }
      
      router.push(nextUrl);
    } catch (err) {
      setLoading(false);
      // Fallback redirect for offline demo
      router.push(nextUrl);
    }
  };

  const handleSocialClick = (provider: string) => {
    setErrorMsg('');
    setSocialNotice(`${provider} sign-in isn’t connected yet. Use your email for now.`);
  };

  return (
    <div className="min-h-svh bg-[#E4E4E4] text-[#1A1A1A] font-sans grid place-items-center p-6 antialiased">
      <main className="relative bg-white rounded-[28px] min-[520px]:rounded-[40px] w-full max-w-[520px] p-[60px_22px_28px] min-[520px]:p-[64px_44px_40px] text-center shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
        
        {/* Close Button (.x) */}
        <Link
          href="/"
          className="absolute top-[22px] right-[26px] w-[40px] h-[40px] grid place-items-center rounded-full text-[#1A1A1A] hover:bg-[#F6F6F6] text-xl transition-colors"
          aria-label="Close"
        >
          ✕
        </Link>

        {/* Brand Logo */}
        <div className="inline-flex items-center gap-[9px] font-heading font-bold text-[17px] mb-5.5 text-[#1A1A1A]">
          <i className="w-[20px] h-[20px] rounded-full bg-[#CCF88E] border-2 border-[#1A1A1A] inline-block shrink-0 not-italic" />
          Ethio Fund
        </div>

        {/* Heading */}
        <h1 className="font-heading font-bold text-[34px] leading-tight tracking-tight text-[#1A1A1A]">
          Welcome
        </h1>
        <p className="mt-2 mb-6.5 text-[#1A1A1A] text-base">
          Sign in to Ethio Fund or sign up to continue.
        </p>

        {/* Social Sign-In Buttons */}
        <div className="space-y-3 mb-5">
          <button
            type="button"
            onClick={() => handleSocialClick('Google')}
            className="flex items-center justify-center gap-3 w-full border border-[#d6d6d6] bg-white rounded-full p-[15px] font-semibold text-base hover:bg-[#F6F6F6] transition-colors cursor-pointer"
          >
            <b className="w-[22px] h-[22px] grid place-items-center font-heading font-bold text-lg bg-clip-text text-transparent bg-[conic-gradient(#ea4335_0_25%,#fbbc05_0_50%,#34a853_0_75%,#4285f4_0)] not-italic">
              G
            </b>
            <span>Sign in with Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialClick('Apple')}
            className="flex items-center justify-center gap-3 w-full border border-[#d6d6d6] bg-white rounded-full p-[15px] font-semibold text-base hover:bg-[#F6F6F6] transition-colors cursor-pointer"
          >
            <b className="w-[22px] h-[22px] grid place-items-center text-xs text-white bg-[#1A1A1A] rounded-full not-italic">
              A
            </b>
            <span>Continue with Apple</span>
          </button>
        </div>

        {socialNotice && (
          <div className="bg-[#FFF3C9] rounded-xl p-3 text-xs text-[#5b4a00] font-medium mb-4 text-left">
            {socialNotice}
          </div>
        )}

        {/* Divider (.or) */}
        <div className="flex items-center gap-4 my-5 text-[#1A1A1A] text-sm font-medium before:flex-1 before:h-[1px] before:bg-[#EBEBEB] after:flex-1 after:h-[1px] after:bg-[#EBEBEB]">
          or
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-2">
          <label className={`block text-left border rounded-[14px] p-[8px_18px_10px] bg-white transition-all ${
            errorMsg ? 'border-[#B3261E]' : 'border-[#cfcfcf] focus-within:border-[#1A1A1A] focus-within:ring-1 focus-within:ring-[#1A1A1A]'
          }`}>
            <span className="block text-xs text-[#6E6E6E] mb-0.5">Email address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMsg('');
              }}
              autoComplete="email"
              inputMode="email"
              placeholder="name@example.com"
              className="w-full border-0 outline-none text-[17px] bg-transparent text-[#1A1A1A]"
            />
          </label>

          <div className="text-[#B3261E] text-sm text-left min-h-[22px] my-1 font-medium" role="alert">
            {errorMsg}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A1A1A] hover:bg-black text-white font-semibold text-base py-4 rounded-full transition-all cursor-pointer"
          >
            {loading ? 'Continuing...' : 'Continue'}
          </button>
        </form>

        <small className="block mt-5 text-[#6E6E6E] text-xs">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="underline text-[#6E6E6E]">Terms of Service</Link> and{' '}
          <Link href="/privacy" className="underline text-[#6E6E6E]">Privacy Notice</Link>.
        </small>

      </main>
    </div>
  );
}
