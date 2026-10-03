'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Heart, ShieldCheck, ArrowRight, UserPlus, Building2, HeartHandshake, 
  HeartPulse, GraduationCap, AlertTriangle, Utensils, Home, Baby, Flame, Users, CheckCircle2 
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CampaignCard } from '../components/CampaignCard';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { name: 'All Causes', slug: 'all', icon: Heart },
    { name: 'Medical', slug: 'medical', icon: HeartPulse },
    { name: 'Education', slug: 'education', icon: GraduationCap },
    { name: 'Emergency', slug: 'emergency', icon: AlertTriangle },
    { name: 'Food & Relief', slug: 'food', icon: Utensils },
    { name: 'Housing', slug: 'housing', icon: Home },
    { name: 'Children', slug: 'children', icon: Baby },
    { name: 'Disaster Relief', slug: 'disaster-relief', icon: Flame },
    { name: 'Community', slug: 'community', icon: Users },
  ];

  const featuredCampaigns = [
    {
      id: 'c1',
      slug: 'help-chala-cardiac-surgery',
      title: 'Support Urgent Cardiac Surgery for 7-Year-Old Chala in Addis Ababa',
      categoryName: 'Medical & Healthcare',
      location: 'Addis Ababa, Ethiopia',
      goalEtb: 250000,
      raisedEtb: 145000,
      percentComplete: 58,
      supporterCount: 38,
      coverImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
      campaignType: 'PERSONAL' as const,
      isVerified: true,
    },
    {
      id: 'c2',
      slug: 'clean-water-initiative-somali-region',
      title: 'Emergency Clean Water & Solar Borehole Well Construction in Somali Region',
      categoryName: 'Disaster Relief',
      location: 'Jijiga, Somali Region',
      goalEtb: 800000,
      raisedEtb: 520000,
      percentComplete: 65,
      supporterCount: 124,
      coverImageUrl: 'https://images.unsplash.com/photo-1541976844346-f18aeac57b06?w=800&auto=format&fit=crop&q=80',
      campaignType: 'ORGANIZATION' as const,
      isVerified: true,
      organizationName: 'Ethiopian Red Cross',
    },
    {
      id: 'c3',
      slug: 'rebuild-primary-school-tigray',
      title: 'Rebuilding Classroom Desks & Library Books for 400 Rural Students',
      categoryName: 'Education & Schools',
      location: 'Mekelle, Tigray',
      goalEtb: 180000,
      raisedEtb: 92000,
      percentComplete: 51,
      supporterCount: 47,
      coverImageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
      campaignType: 'REFERRAL' as const,
      isVerified: true,
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col selection:bg-emerald-500 selection:text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.35),rgba(255,255,255,0))]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Verified Ethiopian Crowdfunding & Giving Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                Together, We Can <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-200 to-amber-300">Change Someone&apos;s Story.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
                WeGen connects people in financial need, compassionate referrers, generous donors, and verified organizations across Ethiopia with 100% verified transparency.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  href="/discover"
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-emerald-900/30 transition-all hover:scale-105 flex items-center justify-center gap-2 text-base"
                >
                  Donate Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/dashboard/campaigns/new"
                  className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 text-white font-semibold px-7 py-4 rounded-2xl border border-slate-700 backdrop-blur-md transition-all flex items-center justify-center gap-2 text-base"
                >
                  Start a Fundraiser
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-emerald-900/60 max-w-xl mx-auto lg:mx-0 text-slate-300">
                <div>
                  <div className="text-2xl font-black text-white">100%</div>
                  <div className="text-xs text-slate-400">Verified Identity</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-400">10%</div>
                  <div className="text-xs text-slate-400">Personal Fee Rule</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-amber-300">0%</div>
                  <div className="text-xs text-slate-400">Org Campaign Fee</div>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500 to-amber-500 opacity-30 blur-2xl animate-pulse-glow" />
                
                <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
                  <div className="relative h-56 rounded-2xl overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80"
                      alt="Verified Campaign"
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Urgent Need
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">Support Urgent Open-Heart Surgery for 7-Year-Old Chala</h3>
                    <p className="text-xs text-slate-400 mt-1">Addis Ababa, Ethiopia • Medical & Healthcare</p>
                  </div>

                  <div className="space-y-2">
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[58%] rounded-full" />
                    </div>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-emerald-400">145,000 ETB raised</span>
                      <span className="text-slate-400">Goal: 250,000 ETB</span>
                    </div>
                  </div>

                  <Link
                    href="/campaign/help-chala-cardiac-surgery"
                    className="block w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-md"
                  >
                    Support This Cause
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* THREE FUNDRAISING PATHS SECTION */}
      <section className="py-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              Three Flexible Fundraising Paths
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Designed for Every Giving Need
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Whether you need assistance yourself, want to advocate for someone in need, or manage an NGO.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
            
            {/* Path 1: Personal */}
            <div className="bg-slate-50 dark:bg-slate-950 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 transition-all group space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Heart className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">I Need Help</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Create a personal campaign for medical bills, emergency expenses, education, or crisis relief with identity verification.
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                Start Personal Campaign <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Path 2: Referral */}
            <div className="bg-slate-50 dark:bg-slate-950 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-amber-500 transition-all group space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">Refer Someone</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Refer a neighbor, family member, or community beneficiary who needs financial support. The system maintains strict separation between referrer and beneficiary.
              </p>
              <div className="pt-2 text-xs font-semibold text-amber-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                Submit a Referral <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Path 3: Organization */}
            <div className="bg-slate-50 dark:bg-slate-950 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 transition-all group space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Building2 className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">Organization & NGO</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Approved charities, NGOs, and community organizations use a rental subscription model with <strong className="text-blue-600">0% campaign fee deductions</strong>.
              </p>
              <div className="pt-2 text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                Register Organization <ArrowRight className="w-4 h-4" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* DISCOVER CAUSES & CATEGORIES */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <h2 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                Discover Causes
              </h2>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Support Campaigns Across Ethiopia
              </h3>
            </div>

            <Link
              href="/discover"
              className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              View All Campaigns <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Featured Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCampaigns.map((camp) => (
              <CampaignCard key={camp.id} {...camp} />
            ))}
          </div>

        </div>
      </section>

      {/* TRUST & VERIFICATION PROCESS */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                Rigorous Verification Safeguards
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                How WeGen Protects Donors and Beneficiaries
              </h2>

              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                Every campaign submitted to WeGen must complete identity verification, document validation, and beneficiary evidence review before publication.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shrink-0">1</div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">Document & Evidence Verification</h4>
                    <p className="text-xs text-slate-500 mt-1">Private verification documents (IDs, medical records, tax registration) are thoroughly reviewed by our admin team using encrypted private storage.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shrink-0">2</div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">Referrer vs Beneficiary Auditing</h4>
                    <p className="text-xs text-slate-500 mt-1">For referral fundraisers, the platform enforces strict beneficiary authorization so funds are disbursed directly to verified bank accounts.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shrink-0">3</div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">10% Fee Transparency Rule</h4>
                    <p className="text-xs text-slate-500 mt-1">For personal and referral campaigns, WeGen platform fee is strictly 10%, preserving 90% for the beneficiary. Organization campaigns carry 0% campaign fee.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-50 dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Financial Ledger Sample Breakdown</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Donation Amount</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">1,000.00 ETB</span>
                </div>
                <div className="flex justify-between p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">WeGen Platform Fee (10%)</span>
                  <span className="font-mono font-bold text-amber-600">-100.00 ETB</span>
                </div>
                <div className="flex justify-between p-3.5 bg-emerald-50 dark:bg-emerald-950/80 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold">
                  <span>Net Available to Beneficiary</span>
                  <span className="font-mono">900.00 ETB</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MONTHLY RECURRING GIVING */}
      <section className="py-20 bg-gradient-to-r from-emerald-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-block bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Ongoing Impact
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto">
            Give 100 ETB Every Month and Make a Lasting Difference
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
            Set up recurring monthly donations to support emergency medical relief and clean water programs automatically.
          </p>
          <div className="pt-4">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-8 py-4 rounded-2xl shadow-xl transition-all hover:scale-105"
            >
              Start Recurring Giving
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
