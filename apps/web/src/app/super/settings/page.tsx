'use client';

import React, { useState } from 'react';

export default function SuperSettingsPage() {
  const [currentFee, setCurrentFee] = useState<string>('10.0');
  const [effectiveDate, setEffectiveDate] = useState<string>('2026-11-01');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordConfirm !== 'Admin@2026') {
      setMsg({ type: 'err', text: 'Re-authentication failed: incorrect Super Admin password.' });
      return;
    }

    setMsg({
      type: 'ok',
      text: `Platform fee rate of ${currentFee}% scheduled with effective date: ${effectiveDate}. Historical statements remain unchanged.`,
    });
    setPasswordConfirm('');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A1A1A]">Platform Fee Settings</h1>
        <p className="text-sm text-[#6E6E6E] mt-1">
          Adjust the system platform fee rate. Changes take effect on the specified future date so prior reconciliation runs remain audited.
        </p>
      </div>

      <div className="bg-white rounded-[24px] border border-[#EBEBEB] p-6 sm:p-7 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#6E6E6E] mb-1">Current Active Fee Rate</label>
            <div className="text-2xl font-black text-[#1A1A1A]">10.0%</div>
            <span className="text-[11px] text-[#6E6E6E]">Enforced across all incoming campaign donations.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#6E6E6E] mb-1">New Platform Fee Percentage (%)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="25"
              required
              value={currentFee}
              onChange={(e) => setCurrentFee(e.target.value)}
              className="w-full border border-[#EBEBEB] rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-[#1A1A1A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#6E6E6E] mb-1">Effective From Date</label>
            <input
              type="date"
              required
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="w-full border border-[#EBEBEB] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#1A1A1A]"
            />
          </div>

          <div className="p-4 bg-[#F9FAFB] border border-[#EBEBEB] rounded-2xl">
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
              Super Admin Password Re-Authentication (Required)
            </label>
            <input
              type="password"
              required
              placeholder="Enter your password to authorize configuration change"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full border border-[#EBEBEB] bg-white rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#1A1A1A]"
            />
          </div>

          {msg && (
            <div className={`p-3.5 rounded-xl text-xs font-bold ${
              msg.type === 'ok' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {msg.text}
            </div>
          )}

          <div className="flex justify-end pt-3 border-t border-[#EBEBEB]">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold transition-all shadow-sm"
            >
              Update Fee Policy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
