'use client';

import React, { useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { CampaignCard } from '../../components/CampaignCard';
import { DonationModal } from '../../components/DonationModal';
import { Search, Filter, ShieldCheck, Heart } from 'lucide-react';

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [activeModal, setActiveModal] = useState<{ id: string; title: string; type: 'PERSONAL' | 'REFERRAL' | 'ORGANIZATION' } | null>(null);

  const campaigns = [
    {
      id: 'c1',
      slug: 'help-chala-cardiac-surgery',
      title: 'Support Urgent Cardiac Surgery for 7-Year-Old Chala in Addis Ababa',
      categoryName: 'Medical & Healthcare',
      categorySlug: 'medical',
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
      categorySlug: 'emergency',
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
      categorySlug: 'education',
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

  const filtered = campaigns.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || c.categorySlug === selectedCategory;
    const matchesType = selectedType === 'all' || c.campaignType === selectedType;
    return matchesSearch && matchesCat && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Page Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            <Heart className="w-4 h-4 fill-emerald-500" /> Verified Ethiopian Causes
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Discover & Support Verified Campaigns
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Explore personal fundraisers, referral causes, and verified organization campaigns across Ethiopia.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search campaigns by title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Type Select */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Campaign Types</option>
            <option value="PERSONAL">Personal Fundraisers</option>
            <option value="REFERRAL">Referral Campaigns</option>
            <option value="ORGANIZATION">Organization & NGO</option>
          </select>

          {/* Category Select */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Categories</option>
            <option value="medical">Medical & Healthcare</option>
            <option value="education">Education & Schools</option>
            <option value="emergency">Emergency & Relief</option>
          </select>
        </div>

        {/* Campaign Cards Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((camp) => (
              <CampaignCard
                key={camp.id}
                {...camp}
                onDonateClick={(id) => setActiveModal({ id, title: camp.title, type: camp.campaignType })}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No campaigns found</h3>
            <p className="text-xs text-slate-500">Try adjusting your search terms or filters.</p>
          </div>
        )}

      </main>

      {activeModal && (
        <DonationModal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          campaignId={activeModal.id}
          campaignTitle={activeModal.title}
          campaignType={activeModal.type}
        />
      )}

      <Footer />
    </div>
  );
}
