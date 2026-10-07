'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#EBEBEB] py-12 bg-white text-[#1A1A1A]">
      <div className="max-w-[1120px] mx-auto px-6 flex flex-col min-[900px]:flex-row items-center justify-between gap-6 text-sm">
        <div className="text-[#6E6E6E]">
          © 2026 WeGen. Addis Ababa, Ethiopia.
        </div>

        <div className="flex flex-wrap items-center gap-6 font-medium">
          <Link href="/about" className="hover:text-[#6E6E6E] transition-colors">About</Link>
          <Link href="/how-it-works" className="hover:text-[#6E6E6E] transition-colors">Fees</Link>
          <Link href="/how-it-works" className="hover:text-[#6E6E6E] transition-colors">Help</Link>
          <Link href="/privacy" className="hover:text-[#6E6E6E] transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-[#6E6E6E] transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
};
