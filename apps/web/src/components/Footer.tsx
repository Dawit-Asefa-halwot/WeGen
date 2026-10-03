'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShieldCheck, Mail, Phone, MapPin, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                WE<span className="text-emerald-500">GEN</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              WeGen is Ethiopia&apos;s verified crowdfunding, giving, and organization fundraising platform. We empower individuals, referrers, and organizations to create verified campaigns with total financial transparency.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800/50 p-2.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" />
              100% Verified Campaigns & Financial Integrity
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Fundraising</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/discover" className="hover:text-emerald-400 transition-colors">Discover Causes</Link></li>
              <li><Link href="/dashboard/campaigns/new" className="hover:text-emerald-400 transition-colors">Personal Fundraiser</Link></li>
              <li><Link href="/dashboard/campaigns/new?type=referral" className="hover:text-emerald-400 transition-colors">Refer Someone in Need</Link></li>
              <li><Link href="/organizations" className="hover:text-emerald-400 transition-colors">NGO & Org Fundraising</Link></li>
              <li><Link href="/how-it-works" className="hover:text-emerald-400 transition-colors">How Fees Work (10% Rule)</Link></li>
            </ul>
          </div>

          {/* Platform & Trust */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Trust & Policies</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/how-it-works" className="hover:text-emerald-400 transition-colors">Verification Safeguards</Link></li>
              <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About WeGen</Link></li>
              <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund-policy" className="hover:text-emerald-400 transition-colors">Donation & Refund Policy</Link></li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact Ethiopia</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>support@wegen.et</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+251 911 000 000</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} WeGen Platform. All rights reserved. Ethiopian Crowdfunding & Giving.</p>
          <div className="flex items-center gap-6">
            <span>Powered by Secure Payment Gateway Integrations</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
