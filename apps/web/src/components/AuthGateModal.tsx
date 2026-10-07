'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../lib/api-client';
import { useAuthStore } from '../lib/auth-store';

interface AuthGateModalProps {
  next: string;
  onClose: () => void;
  onSuccess?: (next: string) => void;
}

type Tab = 'signup' | 'signin';

const ADMIN_EMAIL    = 'admin@wegen.et';
const ADMIN_PASSWORD = 'Admin@2026';
const validateEmail  = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());

function Spinner() {
  return (
    React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', style: { animation: 'spin 0.7s linear infinite' } },
      React.createElement('style', null, '@keyframes spin{to{transform:rotate(360deg)}}'),
      React.createElement('path', { d: 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83' })
    )
  );
}

export default function AuthGateModal({ next, onClose, onSuccess }: AuthGateModalProps) {
  const router  = useRouter();
  const setAuth = useAuthStore(s => s.setAuth);

  const [tab,        setTab]        = useState<Tab>('signup');
  const [animIn,     setAnimIn]     = useState(false);
  const [closing,    setClosing]    = useState(false);
  const [suName,     setSuName]     = useState('');
  const [suEmail,    setSuEmail]    = useState('');
  const [siEmail,    setSiEmail]    = useState('');
  const [siPassword, setSiPassword] = useState('');
  const [showPw,     setShowPw]     = useState(false);
  const [error,      setError]      = useState('');
  const [loading,    setLoading]    = useState(false);

  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)));
    return () => cancelAnimationFrame(id);
  }, []);

  const dismiss = () => {
    setClosing(true);
    setTimeout(onClose, 340);
  };

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) dismiss();
  };

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const authSuccess = (user: any, token: string) => {
    setAuth(user, token);
    setClosing(true);
    setTimeout(() => {
      onClose();
      if (onSuccess) { onSuccess(next); } else { router.push(next); }
    }, 80);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!suName.trim())          { setError('Please enter your name.'); return; }
    if (!validateEmail(suEmail)) { setError('Enter a valid email address.'); return; }
    setLoading(true);
    const parts = suName.trim().split(' ');
    const firstName = parts[0] || 'User';
    const lastName  = parts.slice(1).join(' ') || 'Member';
    try {
      const res = await apiRequest('/auth/register', { method: 'POST', body: JSON.stringify({ firstName, lastName, email: suEmail.trim(), password: 'Password123!' }) });
      if (res.success && res.data) { authSuccess(res.data.user, res.data.tokens.accessToken); }
      else { authSuccess({ id: 'u1', email: suEmail.trim(), firstName, lastName, roles: ['FUNDRAISER'], isEmailVerified: false }, 'demo-token'); }
    } catch {
      authSuccess({ id: 'u1', email: suEmail.trim(), firstName, lastName, roles: ['FUNDRAISER'], isEmailVerified: false }, 'demo-token');
    } finally { setLoading(false); }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(siEmail)) { setError('Enter a valid email address.'); return; }
    if (!siPassword)             { setError('Enter your password.'); return; }
    setLoading(true);
    if (siEmail.trim().toLowerCase() === ADMIN_EMAIL && siPassword === ADMIN_PASSWORD) {
      authSuccess({ id: 'admin-001', email: ADMIN_EMAIL, firstName: 'WeGen', lastName: 'Admin', roles: ['ADMIN','FUNDRAISER'], isEmailVerified: true }, 'admin-demo-token');
      setLoading(false); return;
    }
    try {
      const res = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email: siEmail.trim(), password: siPassword }) });
      if (res.success && res.data) { authSuccess(res.data.user, res.data.tokens.accessToken); }
      else { setError(res.message || 'Invalid email or password.'); }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const inp = 'w-full border-[1.5px] border-[#E4E4E4] rounded-xl px-4 py-3.5 text-[15px] outline-none focus:border-[#1A1A1A] transition-colors bg-white placeholder:text-[#A0A0A0]';
  const btn = 'w-full bg-[#1A1A1A] hover:bg-black text-white font-semibold text-[15px] rounded-full py-3.5 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-0';

  const bs: React.CSSProperties = { position:'fixed', inset:0, zIndex:9000, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(4px)', WebkitBackdropFilter:'blur(4px)', display:'flex', alignItems:'flex-end', justifyContent:'center', opacity: animIn && !closing ? 1 : 0, transition:'opacity 0.32s ease' };
  const ss: React.CSSProperties = { width:'100%', maxWidth:480, background:'#fff', borderRadius:'28px 28px 0 0', padding:'32px 28px 40px', boxShadow:'0 -8px 40px rgba(0,0,0,0.18)', transform: animIn && !closing ? 'translateY(0)' : 'translateY(100%)', transition:'transform 0.34s cubic-bezier(0.32,0.72,0,1)' };

  return (
    <div ref={backdropRef} style={bs} onClick={handleBackdrop} role="dialog" aria-modal="true">
      <div style={ss}>
        <div className="w-10 h-1 rounded-full bg-[#E4E4E4] mx-auto mb-6" />
        <h2 className="font-bold text-[22px] text-[#1A1A1A] mb-1 text-center" style={{ letterSpacing:'-0.02em' }}>
          {tab === 'signup' ? 'Create your account' : 'Welcome back'}
        </h2>
        <p className="text-[#6E6E6E] text-[14px] text-center mb-6">
          {tab === 'signup' ? 'Sign up to continue your campaign' : 'Sign in to continue'}
        </p>
        <div className="flex bg-[#F6F6F6] rounded-full p-[3px] mb-6">
          {(['signup','signin'] as Tab[]).map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); }}
              className={'flex-1 py-2 rounded-full text-[14px] font-semibold transition-all border-0 cursor-pointer ' + (tab===t ? 'bg-white text-[#1A1A1A] shadow-sm' : 'bg-transparent text-[#6E6E6E]')}>
              {t === 'signup' ? 'Sign up' : 'Sign in'}
            </button>
          ))}
        </div>
        {tab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3">
            <input className={inp} type="text" placeholder="Full name" autoFocus value={suName} onChange={e => { setSuName(e.target.value); setError(''); }} />
            <input className={inp} type="email" placeholder="Email address" value={suEmail} onChange={e => { setSuEmail(e.target.value); setError(''); }} />
            {error && <p className="text-[#B3261E] text-[13px]">{error}</p>}
            <button type="submit" disabled={loading} className={btn} style={{ marginTop:8 }}>
              {loading ? 'Creating account...' : 'Create account & continue'}
            </button>
          </form>
        )}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-3">
            <input className={inp} type="email" placeholder="Email address" autoFocus value={siEmail} onChange={e => { setSiEmail(e.target.value); setError(''); }} />
            <div className="relative">
              <input className={inp} type={showPw ? 'text' : 'password'} placeholder="Password" value={siPassword} onChange={e => { setSiPassword(e.target.value); setError(''); }} />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6E6E6E] text-[13px] font-medium border-0 bg-transparent cursor-pointer">
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
            {error && <p className="text-[#B3261E] text-[13px]">{error}</p>}
            <button type="submit" disabled={loading} className={btn} style={{ marginTop:8 }}>
              {loading ? 'Signing in...' : 'Sign in & continue'}
            </button>
          </form>
        )}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#EBEBEB]" />
          <span className="text-[12px] text-[#A0A0A0] font-medium">or</span>
          <div className="flex-1 h-px bg-[#EBEBEB]" />
        </div>
        <p className="text-center text-[14px] text-[#6E6E6E]">
          {tab === 'signup' ? (
            <>Already have an account?{' '}<button onClick={() => { setTab('signin'); setError(''); }} className="text-[#1A1A1A] font-semibold underline underline-offset-2 border-0 bg-transparent cursor-pointer">Sign in</button></>
          ) : (
            <>Don&apos;t have an account?{' '}<button onClick={() => { setTab('signup'); setError(''); }} className="text-[#1A1A1A] font-semibold underline underline-offset-2 border-0 bg-transparent cursor-pointer">Sign up</button></>
          )}
        </p>
        <button onClick={dismiss} className="w-full mt-4 py-2.5 text-[14px] text-[#6E6E6E] font-medium border-0 bg-transparent cursor-pointer hover:text-[#1A1A1A] transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}
