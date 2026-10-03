'use client';

import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ShieldCheck, Heart, Building2, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Transparency & Financial Integrity
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            How WeGen Works
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
            Understanding our 10% platform fee rule for personal/referral campaigns, 0% campaign fee rental model for organizations, and verified trust workflow.
          </p>
        </div>

        {/* Business Model Rule Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Rule A */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Personal & Referral Campaigns</h3>
            <div className="text-3xl font-black text-emerald-600">10% WeGen Platform Fee</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              When a donor contributes 1,000 ETB to a personal or referral campaign, WeGen receives 100 ETB (10%) to maintain verified identity checking, secure cloud infrastructure, and customer support. The remaining 900 ETB is preserved for the beneficiary.
            </p>
          </div>

          {/* Rule B */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">NGO & Organization Campaigns</h3>
            <div className="text-3xl font-black text-blue-600">0% Campaign Fee Deduction</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Registered NGOs, charities, and community organizations pay a predictable monthly or yearly subscription rental fee. Consequently, <strong className="text-slate-900 dark:text-white font-bold">0% is deducted from their campaign donations</strong>.
            </p>
          </div>

        </div>

        {/* Call to action */}
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-10 rounded-3xl text-center space-y-4 shadow-xl">
          <h2 className="text-3xl font-extrabold">Ready to make an impact or raise funds?</h2>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard/campaigns/new"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg transition-all"
            >
              Start Fundraiser
            </Link>
            <Link
              href="/discover"
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-3.5 rounded-2xl transition-all"
            >
              Discover Campaigns
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
