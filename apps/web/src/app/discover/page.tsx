'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { CAMPAIGN_DB } from '../../data/campaignDetailDb';

/* ───────── Derive unified campaign list from shared DB ───────── */
const CAMPAIGNS = Object.values(CAMPAIGN_DB).map((c) => ({
  id: c.id,
  title: c.title,
  by: c.creatorName,
  location: c.location.split(',')[0].trim(),
  goalEtb: c.goalEtb,
  raisedEtb: c.raisedEtb,
  coverUrl: c.coverImageUrl,
  // Map to discover tabs: orgs with large goals = nonprofits, personal = fundraisers
  tab: c.supporterCount > 100 ? 'nonprofits' : 'fundraisers',
}));

const TABS = [
  { id: 'fundraisers', label: 'Fundraisers' },
  { id: 'nonprofits', label: 'Nonprofits' },
  { id: 'profiles', label: 'Profiles' },
  { id: 'communities', label: 'Communities' },
];

/* ───────── Helpers ───────── */
const fmtNum = (n: number) => n.toLocaleString('en-US');



export default function DiscoverPage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('fundraisers');

  const filtered = useMemo(() => {
    let list = CAMPAIGNS;
    // Tab filter
    if (activeTab === 'fundraisers') list = list.filter((c) => c.tab === 'fundraisers');
    else if (activeTab === 'nonprofits') list = list.filter((c) => c.tab === 'nonprofits');
    // For profiles/communities show all for now (placeholder tabs)
    // Search filter
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.by.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
      );
    }
    return list;
  }, [query, activeTab]);

  const sectionLabel =
    activeTab === 'fundraisers'
      ? 'Fundraisers'
      : activeTab === 'nonprofits'
        ? 'Nonprofits'
        : activeTab === 'profiles'
          ? 'Profiles'
          : 'Communities';

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans">

      {/* ── Top Header (same as homepage) ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EBEBEB]">
        <div className="max-w-[1120px] mx-auto px-6 h-[64px] flex items-center justify-between relative">
          {/* Left */}
          <div className="hidden min-[900px]:flex items-center gap-0.5">
            <span className="flex items-center gap-1.5 text-[14px] font-semibold text-[#1A1A1A] px-2.5 py-1.5 rounded-lg bg-[#F5F5F5]">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              Search
            </span>
            <Link href="/#campaigns" className="text-[14px] font-semibold text-[#1A1A1A] hover:text-[#6E6E6E] px-2.5 py-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors">Donate</Link>
            <Link href="/#ways" className="text-[14px] font-semibold text-[#1A1A1A] hover:text-[#6E6E6E] px-2.5 py-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors">How It Works</Link>
          </div>
          {/* Center */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-[22px] h-[22px] rounded-full bg-[#CCF88E] border-2 border-[#1A1A1A] flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
              </div>
              <span className="text-[19px] font-bold tracking-tight text-[#1A1A1A]">WeGen</span>
            </Link>
          </div>
          {/* Right */}
          <div className="hidden min-[900px]:flex items-center gap-1 ml-auto">
            <Link href="/about" className="text-[14px] font-semibold text-[#1A1A1A] hover:text-[#6E6E6E] px-2.5 py-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors">About</Link>
            <Link href="/auth/login" className="text-[14px] font-semibold text-[#1A1A1A] hover:text-[#6E6E6E] px-3 py-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors">Sign In</Link>
            <Link href="/dashboard/campaigns/new" className="btn-pill btn-lime btn-small ml-1">Start a Campaign</Link>
          </div>
        </div>
      </header>

      {/* ── Search Bar ── */}
      <div className="max-w-[660px] mx-auto px-6 pt-10 pb-6">
        <div className="flex items-center gap-3 border border-[#cfcfcf] rounded-full px-5 py-3 bg-white shadow-sm focus-within:border-[#1A1A1A] focus-within:shadow-md transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#6E6E6E] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find fundraisers, nonprofits, and people"
            className="w-full text-[16px] text-[#1A1A1A] placeholder:text-[#6E6E6E] border-0 outline-none bg-transparent"
            autoFocus
          />
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="max-w-[1120px] mx-auto px-6 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-[14px] font-semibold border transition-colors ${
                  isActive
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-white text-[#1A1A1A] border-[#cfcfcf] hover:bg-[#F5F5F5]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Section Heading ── */}
      <div className="max-w-[1120px] mx-auto px-6 pt-6 pb-4">
        <h2 className="font-heading text-[28px] font-bold text-[#1A1A1A]">{sectionLabel}</h2>
      </div>

      {/* ── Campaign Grid (4 cols) ── */}
      <div className="max-w-[1120px] mx-auto px-6 pb-16">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 min-[560px]:grid-cols-2 min-[900px]:grid-cols-3 min-[1100px]:grid-cols-4 gap-x-5 gap-y-8">
            {filtered.map((c) => {
              const pct = Math.round((c.raisedEtb / c.goalEtb) * 100);
              return (
                <Link
                  key={c.id}
                  href={`/campaign/${c.id}`}
                  className="group block"
                >
                  {/* Image */}
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#F0F0F0] mb-3">
                    <img
                      src={c.coverUrl}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {/* Title */}
                  <h3 className="text-[15px] font-bold text-[#1A1A1A] leading-snug mb-1 line-clamp-2 group-hover:underline">
                    {c.title}
                  </h3>
                  {/* Author */}
                  <p className="text-[13px] text-[#6E6E6E] mb-2.5">by {c.by}</p>
                  {/* Progress bar */}
                  <div className="w-full h-[5px] bg-[#E8E8E8] rounded-full overflow-hidden mb-1.5">
                    <div
                      className="h-full bg-[#02A95C] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                  {/* Raised */}
                  <p className="text-[14px] font-bold text-[#1A1A1A]">{fmtNum(c.raisedEtb)} ETB raised</p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-[#F5F5F5] grid place-items-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-[#cfcfcf]" />
            </div>
            <h3 className="font-heading text-xl font-bold text-[#1A1A1A] mb-1">No results found</h3>
            <p className="text-[#6E6E6E] text-sm">Try adjusting your search or switching tabs.</p>
          </div>
        )}
      </div>

      {/* ── Simple Footer ── */}
      <footer className="border-t border-[#EBEBEB] py-8">
        <div className="max-w-[1120px] mx-auto px-6 flex items-center justify-between text-sm text-[#6E6E6E]">
          <span>© 2026 WeGen. Addis Ababa, Ethiopia.</span>
          <Link href="/" className="font-semibold text-[#1A1A1A] hover:underline">Back to home</Link>
        </div>
      </footer>
    </div>
  );
}
