'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { useAuthStore } from '../../lib/auth-store';
import { Heart, PlusCircle, HeartHandshake, ShieldCheck, CreditCard, LayoutDashboard, ArrowRight } from 'lucide-react';

export default function UserDashboardPage() {
  const { user, isAuthenticated } = useAuthStore();

  const mockDonations = [
    {
      id: 'd1',
      reference: 'DON-20261003-AB12',
      campaignTitle: 'Support Urgent Cardiac Surgery for 7-Year-Old Chala',
      amountEtb: 1000,
      status: 'SUCCEEDED',
      createdAt: '2026-10-02',
    },
    {
      id: 'd2',
      reference: 'DON-20260928-XY89',
      campaignTitle: 'Emergency Clean Water & Borehole Well Construction',
      amountEtb: 500,
      status: 'SUCCEEDED',
      createdAt: '2026-09-28',
    },
  ];

  const totalDonated = mockDonations.reduce((acc, curr) => acc + curr.amountEtb, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              User Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Hello, {user ? `${user.firstName} ${user.lastName}` : 'Supporter'} 👋
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/campaigns/new"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              New Fundraiser
            </Link>
            <Link
              href="/dashboard/campaigns/new?type=referral"
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <HeartHandshake className="w-4 h-4" />
              Refer Someone
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-xs text-slate-500 font-semibold">Total Funds Contributed</div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{totalDonated.toLocaleString()} ETB</div>
            <div className="text-[11px] text-slate-400">100% Verified Ledger Output</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-xs text-slate-500 font-semibold">Supported Causes</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{mockDonations.length}</div>
            <div className="text-[11px] text-slate-400">Personal & Organization Causes</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-xs text-slate-500 font-semibold">My Active Campaigns</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">1</div>
            <div className="text-[11px] text-emerald-600 font-medium">1 Published & Verified</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-xs text-slate-500 font-semibold">My Referrals</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">0</div>
            <div className="text-[11px] text-slate-400">Advocacy for Beneficiaries</div>
          </div>
        </div>

        {/* Impact Profile Box */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-950 p-8 rounded-3xl text-white space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-5 h-5" /> Your WeGen Impact Profile
          </div>
          <h2 className="text-2xl font-bold">Making Direct Impact in Ethiopian Communities</h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Your contributions directly fund verified open-heart surgery for children and solar water wells. You hold full financial transparency records for all transactions.
          </p>
        </div>

        {/* Recent Donation Receipts */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Donation Receipts</h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {mockDonations.map((d) => (
              <div key={d.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{d.campaignTitle}</div>
                  <div className="text-slate-500 font-mono">Ref: {d.reference} • {d.createdAt}</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{d.amountEtb.toLocaleString()} ETB</div>
                    <div className="text-emerald-700 dark:text-emerald-300 font-semibold text-[10px]">{d.status}</div>
                  </div>
                  <Link
                    href={`/campaign/help-chala-cardiac-surgery`}
                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 rounded-xl"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
