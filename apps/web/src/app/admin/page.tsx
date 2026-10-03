'use client';

import React, { useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { 
  ShieldCheck, Users, Heart, DollarSign, AlertCircle, FileText, 
  CheckCircle2, XCircle, ArrowUpRight, Building2, Clock 
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'verification' | 'withdrawals' | 'audit'>('overview');

  const stats = {
    totalUsers: 142,
    activeCampaigns: 18,
    pendingVerifications: 3,
    totalDonationsVolumeEtb: 1450000,
    totalPlatformFeesEtb: 125000,
    pendingWithdrawalsCount: 2,
    pendingWithdrawalAmountEtb: 85000,
    totalOrganizations: 6,
  };

  const verificationQueue = [
    {
      id: 'c101',
      title: 'Emergency Flood Aid & Temporary Shelter in Dire Dawa',
      creatorName: 'Kifle Tadesse',
      campaignType: 'PERSONAL',
      goalEtb: 120000,
      createdAt: '2026-10-02',
      status: 'SUBMITTED',
      documentsCount: 2,
    },
    {
      id: 'c102',
      title: 'Tuition & Book Assistance for 12 High School Girls',
      creatorName: 'Genet Alemu',
      campaignType: 'REFERRAL',
      goalEtb: 45000,
      createdAt: '2026-10-01',
      status: 'SUBMITTED',
      documentsCount: 1,
    }
  ];

  const withdrawalQueue = [
    {
      id: 'w1',
      reference: 'WDR-20261002-99A',
      campaignTitle: 'Support Urgent Cardiac Surgery for 7-Year-Old Chala',
      requesterName: 'Abebe Bikila',
      amountEtb: 85000,
      bankName: 'Commercial Bank of Ethiopia (CBE)',
      accountNumber: '1000123456789',
      status: 'REQUESTED',
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> System Administrator Panel
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">WeGen Control Center</h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('verification')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'verification' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Verification ({stats.pendingVerifications})
            </button>
            <button
              onClick={() => setActiveTab('withdrawals')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'withdrawals' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Withdrawals ({stats.pendingWithdrawalsCount})
            </button>
          </div>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Gross Donation Volume</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats.totalDonationsVolumeEtb.toLocaleString()} ETB
                </div>
                <div className="text-[11px] text-emerald-600 font-medium">100% Verified Ledger</div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Platform Fees Earned (10%)</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {stats.totalPlatformFeesEtb.toLocaleString()} ETB
                </div>
                <div className="text-[11px] text-slate-400">Preserved 10% Personal Rule</div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Pending Verification</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats.pendingVerifications}
                </div>
                <div className="text-[11px] text-amber-600 font-medium">Requires Admin Action</div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Pending Withdrawals</span>
                  <ArrowUpRight className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats.pendingWithdrawalAmountEtb.toLocaleString()} ETB
                </div>
                <div className="text-[11px] text-slate-400">{stats.pendingWithdrawalsCount} Requests</div>
              </div>
            </div>
          </div>
        )}

        {/* VERIFICATION QUEUE TAB */}
        {activeTab === 'verification' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Verification Queue</h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {verificationQueue.map((item) => (
                <div key={item.id} className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {item.status}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{item.campaignType} Campaign</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h4>
                    <div className="text-xs text-slate-500">
                      Creator: {item.creatorName} • Goal: {item.goalEtb.toLocaleString()} ETB • Submitted: {item.createdAt}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`Approved campaign ${item.id}`)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve & Publish
                    </button>
                    <button
                      onClick={() => alert(`Requested more info for ${item.id}`)}
                      className="bg-amber-100 text-amber-800 hover:bg-amber-200 text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      Request Info
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WITHDRAWALS QUEUE TAB */}
        {activeTab === 'withdrawals' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pending Withdrawal Disbursements</h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {withdrawalQueue.map((w) => (
                <div key={w.id} className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-mono font-bold text-emerald-600">{w.reference}</div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{w.campaignTitle}</h4>
                    <div className="text-xs text-slate-500">
                      Requester: {w.requesterName} • Bank: {w.bankName} ({w.accountNumber})
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-black text-slate-900 dark:text-white">{w.amountEtb.toLocaleString()} ETB</div>
                      <div className="text-xs text-amber-600 font-bold">{w.status}</div>
                    </div>
                    <button
                      onClick={() => alert(`Disbursed withdrawal ${w.reference}`)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Disburse & Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
