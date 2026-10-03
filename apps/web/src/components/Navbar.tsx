'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Menu, X, PlusCircle, User, ShieldCheck, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../lib/auth-store';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [checkAuth]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Discover', href: '/discover' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Organizations', href: '/organizations' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-slate-800' : 'bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
              WE<span className="text-emerald-600 dark:text-emerald-400">GEN</span>
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase leading-tight">
              Ethiopia Giving
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded-full border border-slate-100 dark:border-slate-800">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/dashboard/campaigns/new"
            className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 px-4 py-2.5 rounded-xl transition-all border border-emerald-200 dark:border-emerald-800/50"
          >
            <PlusCircle className="w-4 h-4" />
            Start Fundraiser
          </Link>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                href={user.roles.includes('ADMIN') ? '/admin' : '/dashboard'}
                className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-slate-800 transition-all shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                {user.roles.includes('ADMIN') ? 'Admin Panel' : 'Dashboard'}
              </Link>
              <button
                onClick={logout}
                title="Log Out"
                className="p-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md shadow-emerald-600/20 hover:scale-[1.02]"
            >
              <User className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Toggle Navigation"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-900 flex flex-col gap-2">
            <Link
              href="/dashboard/campaigns/new"
              onClick={() => setIsOpen(false)}
              className="w-full text-center bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 py-2.5 rounded-xl font-semibold text-sm border border-emerald-200 dark:border-emerald-800"
            >
              Start Fundraiser
            </Link>
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="w-full text-center bg-slate-900 text-white py-2.5 rounded-xl font-semibold text-sm"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center bg-emerald-600 text-white py-2.5 rounded-xl font-semibold text-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
