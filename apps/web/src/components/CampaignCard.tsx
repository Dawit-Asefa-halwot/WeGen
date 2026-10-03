'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, MapPin, Users, ArrowRight, Building2, HeartHandshake } from 'lucide-react';

export interface CampaignCardProps {
  id: string;
  slug: string;
  title: string;
  categoryName: string;
  location: string;
  goalEtb: number;
  raisedEtb: number;
  percentComplete: number;
  supporterCount: number;
  coverImageUrl?: string;
  campaignType: 'PERSONAL' | 'REFERRAL' | 'ORGANIZATION';
  isVerified: boolean;
  organizationName?: string;
  onDonateClick?: (campaignId: string) => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  slug,
  title,
  categoryName,
  location,
  goalEtb,
  raisedEtb,
  percentComplete,
  supporterCount,
  coverImageUrl,
  campaignType,
  isVerified,
  organizationName,
}) => {
  const fallbackImage = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      <div>
        {/* Cover Image Container */}
        <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Image
            src={coverImageUrl || fallbackImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/10">
              {categoryName}
            </span>

            {isVerified && (
              <span className="bg-emerald-500/90 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md shadow-emerald-900/20 border border-emerald-400/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            )}
          </div>

          {/* Campaign Type Indicator */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-white/90 font-medium">
            {campaignType === 'ORGANIZATION' ? (
              <span className="flex items-center gap-1 bg-blue-600/80 backdrop-blur-md px-2.5 py-0.5 rounded-md">
                <Building2 className="w-3 h-3" /> {organizationName || 'Verified Org'}
              </span>
            ) : campaignType === 'REFERRAL' ? (
              <span className="flex items-center gap-1 bg-amber-600/80 backdrop-blur-md px-2.5 py-0.5 rounded-md">
                <HeartHandshake className="w-3 h-3" /> Referral Campaign
              </span>
            ) : null}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{location}</span>
          </div>

          <Link href={`/campaign/${slug}`}>
            <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors leading-snug">
              {title}
            </h3>
          </Link>

          {/* Progress Section */}
          <div className="space-y-2 pt-1">
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, percentComplete)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                {raisedEtb.toLocaleString()} ETB <span className="text-xs text-slate-400 font-normal">raised</span>
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                {percentComplete}% of {goalEtb.toLocaleString()} ETB
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-5 pt-0 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800/80 mt-2">
        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span>{supporterCount} Supporters</span>
        </div>

        <Link
          href={`/campaign/${slug}`}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm shadow-emerald-600/20 hover:scale-105"
        >
          Support Now
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
