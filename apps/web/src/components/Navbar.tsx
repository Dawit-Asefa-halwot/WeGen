'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart,
  Search,
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  HandHeart,
  Users,
  Globe,
  Sparkles,
  Building2,
} from 'lucide-react';
import { useAuthStore } from '../lib/auth-store';

const donateCategories = [
  { icon: HandHeart, label: 'Medical', href: '/discover?category=medical' },
  { icon: Users, label: 'Community', href: '/discover?category=community' },
  { icon: Sparkles, label: 'Education', href: '/discover?category=education' },
  { icon: Globe, label: 'Emergency', href: '/discover?category=emergency' },
  { icon: Building2, label: 'Organizations', href: '/organizations' },
];

const aboutLinks = [
  { label: 'About WeGen', href: '/about' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
];

interface DropdownMenuProps {
  label: string;
  children: React.ReactNode;
}

function DropdownMenu({ label, children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-emerald-700 transition-colors px-2 py-1.5 rounded-lg hover:bg-slate-100"
      >
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50"
          style={{ animation: 'wgDropdown 0.16s ease' }}>
          {children}
        </div>
      )}
    </div>
  );
}

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [checkAuth]);

  return (
    <>
      <style>{`
        @keyframes wgDropdown {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100' : 'bg-white border-b border-slate-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between gap-6 relative">

          {/* ── LEFT: Search + Donate + How It Works ── */}
          <div className="hidden md:flex items-center gap-0.5">
            {/* Search */}
            <Link
              href="/discover"
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-emerald-700 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Search className="w-4 h-4" />
              Search
            </Link>

            {/* Donate Dropdown */}
            <DropdownMenu label="Donate">
              <div className="px-3 pt-1 pb-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-2">Categories</p>
                {donateCategories.map(({ icon: Icon, label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="flex items-center gap-3 px-2 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center flex-shrink-0 transition-colors">
                      <Icon className="w-3.5 h-3.5 text-emerald-700" />
                    </span>
                    {label}
                  </Link>
                ))}
              </div>
            </DropdownMenu>

            {/* How It Works */}
            <Link
              href="/how-it-works"
              className="text-sm font-semibold px-2 py-1.5 rounded-lg transition-colors text-slate-700 hover:text-emerald-700 hover:bg-slate-100"
            >
              How It Works
            </Link>
          </div>

          {/* ── CENTER: Logo (absolutely centered) ── */}
          <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  WE<span className="text-emerald-600">GEN</span>
                </span>
                <span className="text-[9px] font-semibold tracking-widest text-slate-400 uppercase">
                  Ethiopia Giving
                </span>
              </div>
            </Link>
          </div>

          {/* ── RIGHT: About + Sign In + Start a Campaign ── */}
          <div className="hidden md:flex items-center gap-1 ml-auto">
            {/* About Dropdown */}
            <DropdownMenu label="About">
              <div className="px-2 py-1">
                {aboutLinks.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </DropdownMenu>

            {/* Auth */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-1">
                <Link
                  href={user.roles.includes('ADMIN') ? '/admin' : '/dashboard'}
                  className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-emerald-700 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {user.roles.includes('ADMIN') ? 'Admin' : 'Dashboard'}
                </Link>
                <button
                  onClick={logout}
                  title="Log Out"
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-emerald-700 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}

            {/* Start a Campaign CTA */}
            <Link
              href="/dashboard/campaigns/new"
              className="flex items-center gap-1.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-5 py-2 rounded-full transition-all shadow-sm hover:shadow-md hover:scale-[1.02] ml-1"
            >
              Start a Campaign
            </Link>
          </div>

          {/* ── MOBILE hamburger ── */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden ml-auto p-2 text-slate-700 rounded-lg hover:bg-slate-100"
            aria-label="Toggle Navigation"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* ── MOBILE drawer ── */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-6 space-y-1">
            <Link href="/discover" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Search className="w-4 h-4" /> Search
            </Link>
            <p className="px-3 pt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Donate by Category</p>
            {donateCategories.map(({ icon: Icon, label, href }) => (
              <Link key={label} href={href} onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700">
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}
            <div className="border-t border-slate-100 pt-3 mt-2 space-y-1">
              <Link href="/how-it-works" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">How It Works</Link>
              <Link href="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">About</Link>
            </div>
            <div className="border-t border-slate-100 pt-3 mt-2 flex flex-col gap-2">
              {isAuthenticated ? (
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="w-full text-center bg-slate-900 text-white py-2.5 rounded-xl font-semibold text-sm">Dashboard</Link>
              ) : (
                <Link href="/auth/login" onClick={() => setIsOpen(false)} className="w-full text-center border border-slate-300 text-slate-700 py-2.5 rounded-xl font-semibold text-sm">Sign In</Link>
              )}
              <Link href="/dashboard/campaigns/new" onClick={() => setIsOpen(false)} className="w-full text-center bg-emerald-600 text-white py-2.5 rounded-full font-bold text-sm">
                Start a Campaign
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
