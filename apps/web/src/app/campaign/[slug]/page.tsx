'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { DonationModal } from '../../../components/DonationModal';
import { 
  ShieldCheck, MapPin, Users, Heart, Share2, Calendar, HeartHandshake, 
  Building2, CheckCircle2, AlertCircle, FileText, ArrowRight 
} from 'lucide-react';

export default function CampaignDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [activeTab, setActiveTab] = useState<'story' | 'updates' | 'transparency'>('story');
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  // Mock campaign detail matching backend response
  const campaign = {
    id: 'c1',
    slug: 'help-chala-cardiac-surgery',
    title: 'Support Urgent Cardiac Surgery for 7-Year-Old Chala in Addis Ababa',
    story: `Chala is a bright, cheerful 7-year-old boy living in Addis Ababa. Recently, he was diagnosed with a complex congenital heart defect requiring open-heart surgery.

Our local medical specialists have recommended urgent surgery. Our family has managed to raise 145,000 ETB through personal savings and family contributions, but the total medical costs amount to 250,000 ETB.

We are reaching out to our compassionate Ethiopian community and international supporters to help us bridge the remaining gap. Every contribution, no matter the size, directly supports Chala's surgery and post-operative medical care. All medical documents and identification have been verified by the WeGen verification team.`,
    categoryName: 'Medical & Healthcare',
    location: 'Addis Ababa, Ethiopia',
    goalEtb: 250000,
    raisedEtb: 145000,
    percentComplete: 58,
    supporterCount: 38,
    coverImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    campaignType: 'PERSONAL' as 'PERSONAL' | 'REFERRAL' | 'ORGANIZATION',
    isVerified: true,
    creatorName: 'Abebe Bikila',
    createdAt: '2026-09-15',
    beneficiary: {
      name: 'Chala Bikila',
      relationship: 'Son / Family',
      bankName: 'Commercial Bank of Ethiopia (CBE)',
    },
    updates: [
      {
        id: 'u1',
        title: 'Hospital Admission Update',
        content: 'Chala was admitted to the hospital cardiology wing today for pre-operative consultations.',
        createdAt: '2026-09-28',
      }
    ],
  };

  const platformFeeEtb = campaign.campaignType === 'ORGANIZATION' ? 0 : (campaign.raisedEtb * 0.10);
  const netBeneficiaryEtb = campaign.raisedEtb - platformFeeEtb;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Header Title Section */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
              {campaign.categoryName}
            </span>
            {campaign.isVerified && (
              <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Campaign
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium ml-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {campaign.location}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {campaign.title}
          </h1>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Media & Tabs */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Cover Image */}
            <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-md">
              <Image
                src={campaign.coverImageUrl}
                alt={campaign.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Creator & Beneficiary Badge */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center">
                  {campaign.creatorName[0]}
                </div>
                <div>
                  <div className="text-xs text-slate-500">Fundraiser Created By</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{campaign.creatorName}</div>
                </div>
              </div>

              {campaign.beneficiary && (
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-xs">
                  <span className="text-slate-500">Beneficiary: </span>
                  <span className="font-bold text-slate-900 dark:text-white">{campaign.beneficiary.name}</span>
                  <span className="text-slate-400 font-normal"> ({campaign.beneficiary.relationship})</span>
                </div>
              )}
            </div>

            {/* Content Tabs */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <button
                  onClick={() => setActiveTab('story')}
                  className={`text-sm font-bold pb-2 transition-colors relative ${
                    activeTab === 'story'
                      ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Campaign Story
                </button>
                <button
                  onClick={() => setActiveTab('updates')}
                  className={`text-sm font-bold pb-2 transition-colors relative ${
                    activeTab === 'updates'
                      ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Updates ({campaign.updates.length})
                </button>
                <button
                  onClick={() => setActiveTab('transparency')}
                  className={`text-sm font-bold pb-2 transition-colors relative ${
                    activeTab === 'transparency'
                      ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Financial Ledger
                </button>
              </div>

              {/* Story Tab */}
              {activeTab === 'story' && (
                <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {campaign.story}
                </div>
              )}

              {/* Updates Tab */}
              {activeTab === 'updates' && (
                <div className="space-y-4">
                  {campaign.updates.map((u) => (
                    <div key={u.id} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-bold text-slate-900 dark:text-white">{u.title}</span>
                        <span>{u.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{u.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Financial Ledger Tab */}
              {activeTab === 'transparency' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2">
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">Financial Transparency Breakdown</h4>
                    <p className="text-slate-600 dark:text-slate-300">
                      WeGen maintains an immutable double-entry financial ledger for every donation.
                    </p>
                  </div>
                  <div className="space-y-2 font-medium">
                    <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <span>Gross Raised Amount:</span>
                      <span className="font-bold">{campaign.raisedEtb.toLocaleString()} ETB</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <span>WeGen Platform Fee (10% Personal Rule):</span>
                      <span className="font-bold text-amber-600">-{platformFeeEtb.toLocaleString()} ETB</span>
                    </div>
                    <div className="flex justify-between p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl font-bold text-emerald-900 dark:text-emerald-300">
                      <span>Available Net Amount for Beneficiary:</span>
                      <span>{netBeneficiaryEtb.toLocaleString()} ETB</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Right Column: Support Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 sticky top-28">
              
              {/* Goal vs Raised */}
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    {campaign.raisedEtb.toLocaleString()} <span className="text-base font-bold text-slate-500">ETB</span>
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    Goal: {campaign.goalEtb.toLocaleString()} ETB
                  </span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full"
                    style={{ width: `${Math.min(100, campaign.percentComplete)}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>{campaign.percentComplete}% Funded</span>
                  <span>{campaign.supporterCount} Generous Supporters</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setIsDonateOpen(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-base"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  Support This Cause Now
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Campaign link copied to clipboard!');
                  }}
                  className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <Share2 className="w-4 h-4" />
                  Share Campaign
                </button>
              </div>

              {/* Verification Info Box */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" /> 100% Identity & Evidence Verified
                </div>
                <p className="text-slate-500 leading-relaxed">
                  Identity documentation, beneficiary relations, and medical records have been verified by the WeGen compliance team.
                </p>
              </div>

            </div>
          </div>

        </div>

      </main>

      <DonationModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        campaignId={campaign.id}
        campaignTitle={campaign.title}
        campaignType={campaign.campaignType}
      />

      <Footer />
    </div>
  );
}
