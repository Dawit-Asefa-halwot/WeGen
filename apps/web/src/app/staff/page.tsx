import React from 'react';
import Link from 'next/link';

export default function StaffOverviewPage() {
  // Staff Overview metrics - NO MONEY/DONATION/FEE FIGURES
  const metrics = [
    { label: 'Waiting for Review', value: '7', change: '+2 today', alert: true },
    { label: 'Live Campaigns', value: '42', change: 'Active across platform' },
    { label: 'Registered Users', value: '384', change: 'Fundraisers & donors' },
  ];

  const staffGuidelines = [
    {
      title: 'Verify Account Holder & ID Match',
      desc: 'Verify that the recipient payout bank or Telebirr account matches the government ID full name exactly.',
      status: 'Required',
    },
    {
      title: 'Inspect Government ID Validity',
      desc: 'Ensure national ID (Kebele / Fayda / Passport) photo is clear, all 4 corners visible, and not expired.',
      status: 'Required',
    },
    {
      title: 'Assess Campaign Authenticity',
      desc: 'Confirm the story, category, and proposed beneficiaries are clear, realistic, and substantiated.',
      status: 'Required',
    },
    {
      title: 'Action Protocol: Changes or Admin Hand-off',
      desc: 'Staff can request revisions (minimum 5 characters reason) or forward with recommendation to Admin. Staff never approve or reject directly.',
      status: 'Enforced',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A1A1A]">Staff Overview</h1>
        <p className="text-sm text-[#6E6E6E] mt-1">
          Review queue status and operational guidelines. Staff workspace is restricted to application verification.
        </p>
      </div>

      {/* Metrics Row (Strictly Non-Monetary) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {metrics.map((m, i) => (
          <div
            key={i}
            className={`p-6 rounded-[22px] border ${
              m.alert ? 'bg-[#CCF88E]/20 border-[#CCF88E]' : 'bg-white border-[#EBEBEB]'
            } shadow-sm`}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-[#6E6E6E] mb-2">{m.label}</div>
            <div className="text-3xl font-extrabold text-[#1A1A1A]">{m.value}</div>
            <div className="text-xs font-semibold text-[#6E6E6E] mt-1.5">{m.change}</div>
          </div>
        ))}
      </div>

      {/* Operational Protocol & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[24px] p-6 sm:p-7 border border-[#EBEBEB] shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[#1A1A1A]">Staff Reviewer Protocols</h2>
            <span className="px-2.5 py-1 text-xs font-bold bg-[#F6F6F6] text-[#6E6E6E] rounded-full">Policy 2026</span>
          </div>

          <div className="space-y-4">
            {staffGuidelines.map((g, idx) => (
              <div key={idx} className="p-4 bg-[#F9FAFB] border border-[#EBEBEB] rounded-2xl flex items-start gap-3.5">
                <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-[#1A1A1A]">{g.title}</h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white border border-[#EBEBEB] text-[#1A1A1A]">
                      {g.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#6E6E6E] mt-1 leading-relaxed">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launch Card */}
        <div className="bg-[#1A1A1A] text-white rounded-[24px] p-6 sm:p-7 flex flex-col justify-between shadow-sm">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-[#CCF88E] text-[#1A1A1A] text-xs font-black mb-4">
              ACTION REQUIRED
            </div>
            <h3 className="text-xl font-bold">7 Applications Awaiting Verification</h3>
            <p className="text-xs text-[#A0A0A0] mt-2 leading-relaxed">
              Oldest pending application submitted 3 days ago. Ensure KYC name matching and story documentation checks are conducted thoroughly.
            </p>
          </div>

          <Link
            href="/staff/reviews"
            className="w-full mt-6 py-3.5 px-5 rounded-full bg-[#CCF88E] hover:bg-[#bbf070] text-[#1A1A1A] font-extrabold text-center text-sm transition-all shadow-sm"
          >
            Open Reviews Queue →
          </Link>
        </div>
      </div>
    </div>
  );
}
