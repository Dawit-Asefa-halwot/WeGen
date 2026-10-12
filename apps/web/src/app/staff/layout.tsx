import React from 'react';
import Link from 'next/link';

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F6F6F6] text-[#1A1A1A] flex flex-col md:flex-row antialiased">
      {/* ── Sidebar (Staff Console) ── */}
      <aside className="w-full md:w-64 bg-white border-r border-[#EBEBEB] flex flex-col justify-between shrink-0 p-5">
        <div>
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#CCF88E] flex items-center justify-center font-black text-base text-[#1A1A1A] shadow-sm">
              W
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight block">WeGen Staff</span>
              <span className="text-[11px] text-[#6E6E6E] font-medium block">Verification Workspace</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-sm font-semibold">
            <Link
              href="/staff"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all hover:bg-[#F6F6F6] text-[#1A1A1A]"
            >
              <svg className="w-4 h-4 text-[#6E6E6E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Overview
            </Link>

            <Link
              href="/staff/reviews"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all hover:bg-[#F6F6F6] text-[#1A1A1A]"
            >
              <svg className="w-4 h-4 text-[#6E6E6E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Reviews Queue
            </Link>

            <Link
              href="/staff/campaigns"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all hover:bg-[#F6F6F6] text-[#1A1A1A]"
            >
              <svg className="w-4 h-4 text-[#6E6E6E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Campaigns
            </Link>

            <Link
              href="/staff/users"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all hover:bg-[#F6F6F6] text-[#1A1A1A]"
            >
              <svg className="w-4 h-4 text-[#6E6E6E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Users
            </Link>
          </nav>
        </div>

        {/* ── Role Status Footer ── */}
        <div className="pt-4 border-t border-[#EBEBEB]">
          <div className="p-3 bg-[#F6F6F6] rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-xs shrink-0">
              ST
            </div>
            <div className="overflow-hidden">
              <span className="block text-xs font-bold truncate">Verification Staff</span>
              <span className="inline-block px-2 py-0.5 mt-0.5 text-[10px] font-semibold bg-[#E0F2FE] text-[#0369A1] rounded-full">
                Signed in as Staff
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
