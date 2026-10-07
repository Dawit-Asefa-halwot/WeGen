'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { CAMPAIGN_DB } from '../../../data/campaignDetailDb';
import { 
  ShieldCheck, MapPin, Users, Heart, Share2, Calendar, HeartHandshake, 
  Building2, CheckCircle2, AlertCircle, FileText, ArrowRight,
  TrendingUp, Flag, MessageCircle, ChevronLeft, ChevronRight, Link as LinkIcon, Facebook, MessageCircle as MessageCircleIcon, Linkedin
} from 'lucide-react';

export default function CampaignDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Dynamic campaign data based on slug
  const campaign = CAMPAIGN_DB[slug] || CAMPAIGN_DB['c1'];

  const fmtNum = (n: number) => n.toLocaleString('en-US');

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans">
      <Navbar />

      <main className="max-w-[1040px] mx-auto px-4 sm:px-6 py-8">
        
        {/* Header Title Section */}
        <div className="mb-6">
          <h1 className="font-heading text-[32px] sm:text-[40px] font-bold text-[#1A1A1A] tracking-tight leading-tight">
            {campaign.title}
          </h1>
        </div>

        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Media & Story */}
          <div className="flex-1 min-w-0 space-y-8">
            
            {/* Cover Image Carousel Area */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-[#F5F5F5] group">
              <img
                src={campaign.coverImageUrl}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
              {/* Carousel Controls (Visual Only) */}
              <button className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60">
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                <div className="w-4 h-1.5 rounded-full bg-white"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
              </div>
            </div>

            {/* Organizer Info */}
            <div className="flex items-center gap-3 py-2 border-b border-[#EBEBEB] pb-6">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
                <img src="https://ui-avatars.com/api/?name=Abebe+Bikila&background=random" alt="Avatar" className="w-full h-full" />
              </div>
              <div className="text-[15px] text-[#1A1A1A]">
                <strong>{campaign.creatorName}</strong> is organizing this fundraiser for <strong>{campaign.beneficiary.name}</strong>.
              </div>
            </div>

            {/* Protection Badge & Story */}
            <div className="space-y-6 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E6F4F1] text-[#02845A] rounded-md text-[13px] font-bold">
                <ShieldCheck className="w-4 h-4" /> Donation protected
              </div>

              <div className="text-[#1A1A1A] text-[16px] leading-[1.6] whitespace-pre-line">
                {campaign.story}
              </div>

              <button className="text-[15px] font-bold underline underline-offset-2 hover:text-[#6E6E6E]">
                Read more
              </button>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-6 border-b border-[#EBEBEB] pb-8">
                <Link 
                  href={`/campaign/${slug}/donate`}
                  className="flex-1 py-3 px-4 border border-[#cfcfcf] rounded-full font-semibold text-[15px] hover:border-[#1A1A1A] transition-colors text-center"
                >
                  Donate
                </Link>
                <button className="flex-1 py-3 px-4 border border-[#cfcfcf] rounded-full font-semibold text-[15px] hover:border-[#1A1A1A] transition-colors">
                  Share
                </button>
              </div>
            </div>

            {/* Updates Section */}
            <div className="pt-2 border-b border-[#EBEBEB] pb-8">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="font-heading text-[24px] font-bold">Updates</h2>
                <span className="bg-[#F5F5F5] text-[#1A1A1A] text-xs font-bold px-2 py-0.5 rounded">1</span>
              </div>

              {campaign.updates.map(u => (
                <div key={u.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F5F5F5] text-[#6E6E6E] font-bold flex items-center justify-center shrink-0">
                      {u.author[0]}
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-[#1A1A1A]">{u.title}</div>
                      <div className="text-[13px] text-[#6E6E6E]">{u.author} · {campaign.beneficiary.relationship}</div>
                    </div>
                  </div>
                  <div className="text-[15px] leading-[1.6] text-[#1A1A1A] whitespace-pre-line">
                    {u.content}
                  </div>
                  <button className="text-[15px] font-bold underline underline-offset-2 hover:text-[#6E6E6E]">
                    Read more
                  </button>
                </div>
              ))}
            </div>

            {/* Suggested Nonprofits (Placeholder) */}
            <div className="pt-2 border-b border-[#EBEBEB] pb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-[24px] font-bold">Suggested nonprofits to follow</h2>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-full border border-[#cfcfcf] flex items-center justify-center text-[#cfcfcf]"><ChevronLeft className="w-4 h-4" /></button>
                  <button className="w-8 h-8 rounded-full border border-[#cfcfcf] flex items-center justify-center text-[#1A1A1A] hover:bg-[#F5F5F5]"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex gap-4 overflow-hidden">
                {/* Card 1 */}
                <div className="flex-1 border border-[#EBEBEB] rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-4 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center relative">
                        <span className="text-[10px]">🌍</span>
                        <CheckCircle2 className="w-3 h-3 text-blue-500 absolute -bottom-1 -right-1 bg-white rounded-full" />
                      </div>
                      <span className="text-[13px] font-bold truncate max-w-[120px]">World Central Kitc...</span>
                    </div>
                    <button className="text-[13px] font-semibold text-[#1A1A1A] flex items-center gap-1"><span className="text-lg leading-none">+</span> Follow</button>
                  </div>
                  <div className="h-32 bg-[#F5F5F5]">
                    <img src="https://images.unsplash.com/photo-1593113511365-021c2725ccdb?w=400&q=80" className="w-full h-full object-cover" alt="org" />
                  </div>
                </div>
                {/* Card 2 */}
                <div className="flex-1 border border-[#EBEBEB] rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-4 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center relative">
                        <span className="text-[10px]">🛡️</span>
                        <CheckCircle2 className="w-3 h-3 text-blue-500 absolute -bottom-1 -right-1 bg-white rounded-full" />
                      </div>
                      <span className="text-[13px] font-bold truncate max-w-[120px]">The Salvation Army</span>
                    </div>
                    <button className="text-[13px] font-semibold text-[#1A1A1A] flex items-center gap-1"><span className="text-lg leading-none">+</span> Follow</button>
                  </div>
                  <div className="h-32 bg-[#F5F5F5]">
                    <img src="https://images.unsplash.com/photo-1593113512304-4b533e4d9eeb?w=400&q=80" className="w-full h-full object-cover" alt="org" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sharing helps more than you think */}
            <div className="pt-2 border-b border-[#EBEBEB] pb-8">
              <h2 className="font-heading text-[24px] font-bold mb-2">Sharing helps more than you think</h2>
              <p className="text-[15px] text-[#1A1A1A] mb-6">
                On average, <strong>each share can inspire {fmtNum(50)} ETB</strong> in donations by helping this fundraiser reach more people.
              </p>
              
              <div className="bg-[#F9F9F9] rounded-3xl p-6 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="flex-1">
                    <div className="inline-block text-[#02845A] mb-2"><HeartHandshake className="w-6 h-6" /></div>
                    <h3 className="font-bold text-[18px] leading-tight mb-2">A Heart for Chala 💗 Support for His Family</h3>
                    <p className="text-[13px] text-[#6E6E6E] mb-2">Organized for {campaign.beneficiary.name}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full border-2 border-[#02A95C] flex items-center justify-center text-[10px] font-bold text-[#02A95C]">96%</div>
                      <span className="text-[13px] font-bold bg-[#CCF88E] px-2 py-0.5 rounded">{fmtNum(campaign.raisedEtb)} raised</span>
                      <span className="text-[12px] font-bold text-[#1A1A1A] bg-[#FFD700] px-2 py-0.5 rounded shadow-sm relative -rotate-3 top-1">Donate now!</span>
                    </div>
                  </div>
                  <div className="w-full sm:w-48 aspect-video sm:aspect-square rounded-2xl overflow-hidden bg-slate-200">
                    <img src={campaign.coverImageUrl} className="w-full h-full object-cover" alt="share preview" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center hover:bg-[#EBEBEB] text-[#1A1A1A]"><LinkIcon className="w-5 h-5" /></button>
                <button className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white"><Facebook className="w-5 h-5 fill-current" /></button>
                <button className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white"><MessageCircleIcon className="w-5 h-5 fill-current" /></button>
                <button className="w-10 h-10 rounded-full bg-[#0084FF] flex items-center justify-center text-white"><MessageCircleIcon className="w-5 h-5 fill-current" /></button>
                <button className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center text-white"><Linkedin className="w-5 h-5 fill-current" /></button>
              </div>
            </div>

            {/* Organizer and beneficiary */}
            <div className="pt-2 border-b border-[#EBEBEB] pb-8">
              <h2 className="font-heading text-[24px] font-bold mb-6">Organizer and beneficiary</h2>
              <div className="flex items-start gap-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
                    <img src="https://ui-avatars.com/api/?name=Abebe+Bikila&background=random" alt="Avatar" className="w-full h-full" />
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-[#1A1A1A]">{campaign.creatorName}</div>
                    <div className="text-[13px] text-[#6E6E6E]">Organizer</div>
                    <div className="text-[13px] text-[#6E6E6E]">{campaign.location}</div>
                    <button className="mt-3 px-4 py-1.5 border border-[#cfcfcf] rounded-full text-[13px] font-semibold hover:border-[#1A1A1A]">Message</button>
                  </div>
                </div>
                <div className="hidden sm:block text-[#cfcfcf] pt-2"><ArrowRight className="w-5 h-5" /></div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#6E6E6E] font-bold shrink-0">
                    C
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-[#1A1A1A]">{campaign.beneficiary.name}</div>
                    <div className="text-[13px] text-[#6E6E6E]">{campaign.beneficiary.relationship}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Meta: Created Date & Report */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[13px] text-[#6E6E6E]">
              <div className="flex items-center gap-4">
                <span>Created {campaign.createdAt}</span>
                <span>•</span>
                <span>Medical</span>
              </div>
              <button className="flex items-center gap-1 hover:underline underline-offset-2">
                <AlertCircle className="w-4 h-4" /> Report fundraiser
              </button>
            </div>

          </div>

          {/* Right Column: Sticky Support Card */}
          <div className="w-full lg:w-[360px] shrink-0">
            <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-[#EBEBEB] p-6 sticky top-24">
              
              {/* Progress & Amount */}
              <div className="flex items-center gap-4 mb-5">
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#EBEBEB]"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#02A95C]"
                      strokeDasharray={`${campaign.percentComplete}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#1A1A1A]">
                    {campaign.percentComplete}%
                  </div>
                </div>
                <div>
                  <div className="text-[20px] leading-tight text-[#1A1A1A]">
                    <strong>{fmtNum(campaign.raisedEtb)} ETB raised</strong> of
                  </div>
                  <div className="text-[15px] text-[#6E6E6E]">
                    <span className="underline decoration-[#cfcfcf] underline-offset-4">{fmtNum(campaign.goalEtb)} ETB</span> goal
                  </div>
                  <div className="text-[13px] text-[#6E6E6E] mt-0.5">
                    {campaign.supporterCount} donations
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <Link
                  href={`/campaign/${slug}/donate`}
                  className="w-full btn-lime py-3.5 rounded-xl font-bold text-[16px] shadow-sm hover:scale-[1.02] transition-transform text-center block"
                >
                  Donate now
                </Link>
                <button
                  className="w-full btn-dark py-3.5 rounded-xl font-bold text-[16px] hover:scale-[1.02] transition-transform"
                >
                  Share
                </button>
              </div>

              {/* Recent Donations Trend */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#F3E8FF] flex items-center justify-center text-[#9333EA]">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-[14px] font-bold text-[#9333EA]">
                  395 recent donations
                </div>
              </div>

              {/* Donations List */}
              <div className="space-y-5 mb-6">
                {campaign.donations.map((d, i) => (
                  <div key={d.id} className={`flex items-start gap-3 ${i !== 0 ? 'pt-4 border-t border-[#F5F5F5]' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[13px] font-bold text-[#6E6E6E] shrink-0">
                      {d.isIcon ? <Heart className="w-4 h-4" /> : d.initial}
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-[#1A1A1A]">{d.name}</div>
                      <div className="text-[13px] text-[#6E6E6E]">
                        <span className="font-bold">{fmtNum(d.amount)} ETB</span> · {d.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center gap-3">
                <button className="flex-1 py-2.5 border border-[#cfcfcf] rounded-full text-[14px] font-semibold hover:border-[#1A1A1A] transition-colors">
                  See all
                </button>
                <button className="flex-1 py-2.5 border border-[#cfcfcf] rounded-full text-[14px] font-semibold hover:border-[#1A1A1A] transition-colors flex items-center justify-center gap-1">
                  <span>☆</span> See top
                </button>
              </div>

            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
