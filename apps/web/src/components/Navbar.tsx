'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';

import { useAuthStore } from '../lib/auth-store';

const donateCategories = [
  { emoji: '🏥', label: 'Medical', href: '/discover?category=medical' },
  { emoji: '🤝', label: 'Community', href: '/discover?category=community' },
  { emoji: '📚', label: 'Education', href: '/discover?category=education' },
  { emoji: '🌍', label: 'Emergency', href: '/discover?category=emergency' },
  { emoji: '🏢', label: 'Organizations', href: '/organizations' },
];

const aboutLinks = [
  { label: 'About WeGen', href: '/about' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const donateRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (donateRef.current && !donateRef.current.contains(e.target as Node)) {
        setDonateOpen(false);
      }
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <style>{`
        @keyframes hdrDrop {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .hdr-drop { animation: hdrDrop 0.16s ease; }
      `}</style>

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EBEBEB]">
        <div className="max-w-[1120px] mx-auto px-6 h-[64px] flex items-center justify-between relative gap-4">
          
          {/* ── LEFT: Search · Donate▾ · How It Works ── */}
          <div className="hidden min-[900px]:flex items-center gap-0.5">
            {/* Search */}
            <Link
              href="/discover"
              className="flex items-center gap-1.5 text-[14px] font-semibold text-[#1A1A1A] hover:text-[#6E6E6E] px-2.5 py-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors"
            >
              <Search className="w-4 h-4" />
              Search
            </Link>

            {/* Donate Dropdown */}
            <div ref={donateRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setDonateOpen(!donateOpen);
                  setAboutOpen(false);
                }}
                className="flex items-center gap-1 text-[14px] font-semibold text-[#1A1A1A] hover:text-[#6E6E6E] px-2.5 py-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors"
              >
                Donate
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${donateOpen ? 'rotate-180' : ''}`} />
              </button>

              {donateOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-[#EBEBEB] py-2 z-50 hdr-drop">
                  <p className="px-4 pt-1 pb-1 text-[10px] font-bold text-[#6E6E6E] uppercase tracking-widest">
                    Categories
                  </p>
                  {donateCategories.map(({ emoji, label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setDonateOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-[14px] font-medium text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors"
                    >
                      <span className="text-base">{emoji}</span>
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* How It Works */}
            <Link
              href="/how-it-works"
              className="text-[14px] font-semibold text-[#1A1A1A] hover:text-[#6E6E6E] px-2.5 py-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors"
            >
              How It Works
            </Link>
          </div>

          {/* ── CENTER: Logo (identical to Home) ── */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-none">
              <div className="w-[22px] h-[22px] rounded-full bg-[#CCF88E] border-2 border-[#1A1A1A] flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
              </div>
              <span className="text-[19px] font-bold tracking-tight text-[#1A1A1A]">
                WeGen
              </span>
            </Link>
          </div>

          {/* ── RIGHT: About▾ · Auth ── */}
          <div className="hidden min-[900px]:flex items-center gap-1 ml-auto">
            {/* About Dropdown */}
            <div ref={aboutRef} className="relative">
              <button
                type="button"
                onClick={() => { setAboutOpen(!aboutOpen); setDonateOpen(false); }}
                className="flex items-center gap-1 text-[14px] font-semibold text-[#1A1A1A] hover:text-[#6E6E6E] px-2.5 py-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors"
              >
                About
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${aboutOpen ? 'rotate-180' : ''}`} />
              </button>
              {aboutOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-[#EBEBEB] py-2 z-50 hdr-drop">
                  {aboutLinks.map(({ label, href }) => (
                    <Link key={label} href={href} onClick={() => setAboutOpen(false)}
                      className="block px-4 py-2 text-[14px] font-medium text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors">
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 ml-1">
                <Link href="/dashboard"
                  className="text-[14px] font-semibold text-[#1A1A1A] hover:text-[#6E6E6E] px-3 py-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors">
                  Dashboard
                </Link>
                <button onClick={logout}
                  className="w-[34px] h-[34px] rounded-full bg-[#1A1A1A] text-white grid place-items-center font-semibold text-[13px] border-0 cursor-pointer hover:bg-[#333] transition-colors"
                  title={`${user.firstName} ${user.lastName} — sign out`}>
                  {user.firstName[0]}{user.lastName[0]}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 ml-1">
                <Link href="/auth/login"
                  className="text-[14px] font-semibold text-[#1A1A1A] hover:text-[#6E6E6E] px-3 py-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors">
                  Sign in
                </Link>
                <Link href="/auth/register"
                  className="btn-pill btn-lime btn-small">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* ── MOBILE: hamburger ── */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="min-[900px]:hidden ml-auto p-2 rounded-lg hover:bg-[#F5F5F5]"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

        {/* ── MOBILE drawer ── */}
        {isOpen && (
          <div className="min-[900px]:hidden bg-white border-t border-[#EBEBEB] px-5 pt-3 pb-6 space-y-1 shadow-lg">
            <Link
              href="/discover"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#1A1A1A] hover:bg-[#F5F5F5]"
            >
              <Search className="w-4 h-4" /> Search
            </Link>
            <p className="px-3 pt-2 text-[10px] font-bold text-[#6E6E6E] uppercase tracking-wider">
              Donate by Category
            </p>
            {donateCategories.map(({ emoji, label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-[#1A1A1A] hover:bg-[#F5F5F5]"
              >
                <span>{emoji}</span> {label}
              </Link>
            ))}
            <div className="border-t border-[#EBEBEB] pt-3 mt-2 space-y-1">
              <Link
                href="/how-it-works"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#1A1A1A] hover:bg-[#F5F5F5]"
              >
                How It Works
              </Link>
              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#1A1A1A] hover:bg-[#F5F5F5]"
              >
                About
              </Link>
            </div>
            <div className="border-t border-[#EBEBEB] pt-4 mt-2 flex flex-col gap-2">
              {isAuthenticated && user ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}
                    className="w-full text-center bg-[#1A1A1A] text-white py-2.5 rounded-full font-semibold text-sm">
                    Dashboard
                  </Link>
                  <button onClick={() => { logout(); setIsOpen(false); }}
                    className="w-full text-center border border-[#1A1A1A] text-[#1A1A1A] py-2.5 rounded-full font-semibold text-sm hover:bg-[#F5F5F5] cursor-pointer bg-white">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/register" onClick={() => setIsOpen(false)}
                    className="w-full text-center bg-[#CCF88E] text-[#1A1A1A] py-2.5 rounded-full font-semibold text-sm">
                    Sign up
                  </Link>
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}
                    className="w-full text-center border border-[#1A1A1A] text-[#1A1A1A] py-2.5 rounded-full font-semibold text-sm hover:bg-[#F5F5F5]">
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
