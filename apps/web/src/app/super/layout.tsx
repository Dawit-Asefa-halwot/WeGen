import React from 'react';
import Link from 'next/link';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F6F6F6] text-[#1A1A1A] flex flex-col md:flex-row antialiased">
      {/* ── Sidebar (Super Admin Console) ── */}
      <aside className="w-full md:w-64 bg-white border-r border-[#EBEBEB] flex flex-col justify-between shrink-0 p-5">
        <div>
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] text-[#CCF88E] flex items-center justify-center font-black text-base shadow-sm">
              W
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight block">WeGen Super</span>
              <span className="text-[11px] text-[#6E6E6E] font-medium block">Owner Console</span>
            </div>
          </div>

          {/* Navigation Links - 8 Items */}
          <nav className="space-y-1 text-sm font-semibold">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all hover:bg-[#F6F6F6] text-[#1A1A1A]"
            >
              <svg className="w-4 h-4 text-[#6E6E6E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Overview & Money
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all hover:bg-[#F6F6F6] text-[#1A1A1A]"
            >
              <svg className="w-4 h-4 text-[#6E6E6E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all hover:bg-[#F6F6F6] text-[#1A1A1A]"
            >
              <svg className="w-4 h-4 text-[#6E6E6E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Donations
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all hover:bg-[#F6F6F6] text-[#1A1A1A]"
            >
              <svg className="w-4 h-4 text-[#6E6E6E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Approvals & Reviews
            </Link>

            <Link
              href="/super/reports"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all hover:bg-[#F6F6F6] text-[#1A1A1A]"
            >
              <svg className="w-4 h-4 text-[#6E6E6E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Reports (Unmasked)
            </Link>

            <Link
              href="/super/team"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all bg-[#F6F6F6] text-[#1A1A1A]"
            >
              <svg className="w-4 h-4 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Team & Roles
            </Link>

            <Link
              href="/super/audit"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all hover:bg-[#F6F6F6] text-[#1A1A1A]"
            >
              <svg className="w-4 h-4 text-[#6E6E6E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Audit Log
            </Link>

            <Link
              href="/super/settings"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all hover:bg-[#F6F6F6] text-[#1A1A1A]"
            >
              <svg className="w-4 h-4 text-[#6E6E6E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Platform Fee Settings
            </Link>
          </nav>
        </div>

        {/* ── Super Admin Status Footer ── */}
        <div className="pt-4 border-t border-[#EBEBEB]">
          <div className="p-3 bg-[#1A1A1A] text-white rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#CCF88E] text-[#1A1A1A] flex items-center justify-center font-black text-xs shrink-0">
              SA
            </div>
            <div className="overflow-hidden">
              <span className="block text-xs font-bold truncate">Super Admin</span>
              <span className="inline-block px-2 py-0.5 mt-0.5 text-[10px] font-bold bg-[#CCF88E] text-[#1A1A1A] rounded-full">
                Owner Access
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
