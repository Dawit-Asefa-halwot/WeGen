'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiRequest } from '../lib/api-client';

export interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId?: string;
  campaignTitle?: string;
  campaignGoal?: number;
  campaignRaised?: number;
  campaignType?: 'PERSONAL' | 'REFERRAL' | 'ORGANIZATION';
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  campaignId = 'c1',
  campaignTitle = 'Help Dawit get heart surgery',
  campaignGoal = 150000,
  campaignRaised = 62000,
}) => {
  // Preset Amounts & Min
  const PRESETS = [100, 200, 500, 1000, 2000, 5000];
  const MIN = 10;

  const PAYMENT_METHODS = {
    telebirr: { icon: '📱', name: 'Telebirr' },
    cbe: { icon: '🏦', name: 'CBE Birr' },
    card: { icon: '💳', name: 'Card (via Chapa)' },
  };

  // State
  const [amt, setAmt] = useState<number>(500);
  const [customInputVal, setCustomInputVal] = useState<string>('500');
  const [tipPercent, setTipPercent] = useState<number>(5);
  const [customTip, setCustomTip] = useState<number | null>(null);
  const [customTipInput, setCustomTipInput] = useState<string>('');
  const [isCustomTipOpen, setIsCustomTipOpen] = useState<boolean>(false);
  const [pm, setPm] = useState<'telebirr' | 'cbe' | 'card'>('telebirr');
  const [isAnon, setIsAnon] = useState<boolean>(false);
  const [isNews, setIsNews] = useState<boolean>(false);
  const [recentDismissed, setRecentDismissed] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [recentDonations, setRecentDonations] = useState<Array<{ amt: number }>>([]);

  // Load Recent Donations
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ethiofund-donations');
      if (saved) {
        setRecentDonations(JSON.parse(saved));
      }
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  if (!isOpen) return null;

  // Progress Computations
  const totalRaised = campaignRaised + recentDonations.reduce((acc, d) => acc + d.amt, 0);
  const goal = campaignGoal || 1;
  const pct = Math.min(100, Math.round((totalRaised / goal) * 100));
  const remainingEtb = Math.max(0, goal - totalRaised);

  // Tip Computations
  const computedTip = customTip !== null ? customTip : Math.round((amt * tipPercent) / 100);
  const totalDue = amt + computedTip;

  // Formatting Helpers
  const f0 = (n: number) => n.toLocaleString('en-US');
  const f2 = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const parseNum = (v: string) => Math.max(0, parseFloat(String(v).replace(/[^\d.]/g, '')) || 0);

  // Handlers
  const handlePresetSelect = (val: number) => {
    setAmt(val);
    setCustomInputVal(val.toString());
    setErrorMsg('');
  };

  const handleCustomAmtInput = (val: string) => {
    setCustomInputVal(val);
    const parsed = parseNum(val);
    setAmt(parsed);
    setErrorMsg('');
  };

  const toggleCustomTipMode = () => {
    if (isCustomTipOpen) {
      setIsCustomTipOpen(false);
      setCustomTip(null);
      setCustomTipInput('');
    } else {
      setIsCustomTipOpen(true);
      setCustomTip(0);
      setCustomTipInput('0');
    }
  };

  const handleCustomTipInput = (val: string) => {
    setCustomTipInput(val);
    const parsed = parseNum(val);
    setCustomTip(parsed);
  };

  const handlePay = async () => {
    if (amt < MIN) {
      setErrorMsg(`Enter at least ${MIN} ETB.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const donationRecord = {
      amt,
      tip: computedTip,
      pm,
      anon: isAnon,
      news: isNews,
      at: Date.now(),
    };

    try {
      // Save locally
      const updated = [...recentDonations, donationRecord];
      setRecentDonations(updated);
      localStorage.setItem('ethiofund-donations', JSON.stringify(updated));

      // Attempt backend API call
      await apiRequest('/donations', {
        method: 'POST',
        body: JSON.stringify({
          campaignId,
          amountEtb: amt,
          paymentProvider: pm.toUpperCase(),
          isAnonymous: isAnon,
        }),
      });
    } catch (e) {
      // Continue locally even if offline
    }

    setIsSubmitting(false);
    setIsDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-full flex justify-center items-start p-4 sm:p-6">
        <div className="relative w-full max-w-[720px] bg-white rounded-[28px] min-[560px]:rounded-[40px] p-6 min-[560px]:p-10 shadow-2xl mt-2 mb-8 sm:mt-12 sm:mb-12 text-[#1A1A1A]">
        
        {/* Close Modal Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#F6F6F6] hover:bg-[#EBEBEB] grid place-items-center font-bold text-lg transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* DONE VIEW */}
        {isDone ? (
          <div className="text-center py-10">
            <div className="w-[76px] h-[76px] rounded-full bg-[#CCF88E] grid place-items-center text-4xl mx-auto mb-5">
              💚
            </div>
            <h1 className="font-heading text-3xl font-bold text-[#1A1A1A]">
              Thank you for giving
            </h1>
            <p className="mt-2 text-base text-[#1A1A1A]">
              Your donation of <b className="font-bold">{f2(amt)} ETB</b> to “{campaignTitle}” was recorded.
            </p>
            <p className="text-[#6E6E6E] text-sm mt-3.5">
              Demo mode: no real payment was taken.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-pill btn-lime px-7 py-3"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* DONATION FORM VIEW */
          <div className="space-y-6">
            
            {/* Header with Conic Ring & Progress */}
            <div className="flex items-center gap-5 pt-2">
              <div 
                className="w-[80px] h-[80px] rounded-full grid place-items-center shrink-0"
                style={{
                  background: `conic-gradient(#43A047 ${pct}%, #E3E3E3 0)`
                }}
              >
                <b className="w-[62px] h-[62px] rounded-full bg-white grid place-items-center text-sm font-bold font-heading">
                  {pct}%
                </b>
              </div>

              <div>
                <h1 className="font-heading font-bold text-[22px] min-[560px]:text-[28px] leading-[1.15] text-[#1A1A1A] break-words">
                  {campaignTitle}
                </h1>
                <p className="font-semibold text-sm mt-1 text-[#1A1A1A]">
                  {totalRaised >= goal
                    ? 'Goal reached. Thank you!'
                    : `Still ${f0(remainingEtb)} ETB to go. Help us build momentum.`}
                </p>
              </div>
            </div>

            {/* Step 1: Preset Buttons */}
            <div>
              <h2 className="font-heading font-bold text-lg mb-3">
                Enter your donation
              </h2>
              <div className="grid grid-cols-2 min-[560px]:grid-cols-3 gap-3">
                {PRESETS.map((val) => {
                  const isSelected = amt === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handlePresetSelect(val)}
                      className={`relative border rounded-xl py-5 px-2 font-heading font-bold text-lg transition-all ${
                        isSelected ? 'bg-[#CCF88E] border-[#1A1A1A]' : 'bg-white border-[#bdbdbd] hover:bg-[#F6F6F6]'
                      }`}
                    >
                      {f0(val)} ETB
                      {val === 500 && (
                        <em className="absolute left-1/2 -bottom-2.5 -translate-x-1/2 bg-[#CCF88E] border border-[#1A1A1A]/10 rounded px-2 py-0.5 font-bold text-[10px] tracking-wider uppercase not-italic text-[#1A1A1A] whitespace-nowrap">
                          Suggested
                        </em>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Amount Input */}
            <label className="amt flex items-center justify-between gap-4 border border-[#bdbdbd] rounded-2xl p-[22px_24px] focus-within:border-[#1A1A1A] focus-within:ring-1 focus-within:ring-[#1A1A1A]">
              <b className="font-heading font-bold text-xl">ETB</b>
              <input
                value={customInputVal}
                onChange={(e) => handleCustomAmtInput(e.target.value)}
                inputMode="decimal"
                placeholder="0"
                aria-label="Donation amount in ETB"
                className="w-full text-right font-heading font-bold text-3xl min-[560px]:text-[44px] leading-none border-0 outline-none bg-transparent"
              />
            </label>

            {/* Recent Donation Dismissible Banner */}
            {recentDonations.length > 0 && !recentDismissed && (
              <div className="flex items-center justify-between text-sm py-1.5 px-3 bg-[#F6F6F6] rounded-xl border border-[#EBEBEB]">
                <span>Recent donation: <b className="font-bold">{f0(recentDonations[recentDonations.length - 1].amt)} ETB</b></span>
                <button
                  type="button"
                  onClick={() => setRecentDismissed(true)}
                  className="p-1 hover:bg-[#EBEBEB] rounded-full text-xs font-bold"
                  aria-label="Dismiss"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Tip Ethio Fund Services */}
            <div>
              <h2 className="font-heading font-bold text-lg mb-1">
                Tip Ethio Fund services
              </h2>
              <p className="text-[#6E6E6E] text-sm leading-relaxed mb-4">
                Ethio Fund runs on optional tips from donors like you. Choose an amount below, or set it to 0.
              </p>

              <div className="text-center">
                <output className="inline-block bg-white shadow-md rounded-lg px-3.5 py-1 text-sm font-semibold border border-[#EBEBEB] mb-2">
                  {customTip !== null ? `${f2(customTip)} ETB` : `${tipPercent}%`}
                </output>

                {!isCustomTipOpen && (
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="2.5"
                    value={tipPercent}
                    onChange={(e) => setTipPercent(parseFloat(e.target.value))}
                    className="w-full my-3 accent-[#1A1A1A] cursor-pointer"
                    aria-label="Tip percentage"
                  />
                )}

                <div>
                  <button
                    type="button"
                    onClick={toggleCustomTipMode}
                    className="text-sm font-semibold underline underline-offset-4 text-[#1A1A1A] p-1"
                  >
                    {isCustomTipOpen ? 'Use a percentage instead' : 'Enter custom tip'}
                  </button>
                </div>

                {isCustomTipOpen && (
                  <div className="mt-3">
                    <label className="text-sm text-[#6E6E6E] block">
                      Tip in ETB
                      <input
                        value={customTipInput}
                        onChange={(e) => handleCustomTipInput(e.target.value)}
                        inputMode="decimal"
                        placeholder="0"
                        className="w-[160px] border border-[#bdbdbd] rounded-xl px-3 py-2 text-center text-sm font-bold text-[#1A1A1A] mt-1 block mx-auto outline-none focus:border-[#1A1A1A]"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <h2 className="font-heading font-bold text-lg mb-3">
                Payment method
              </h2>
              <div className="border border-[#cfcfcf] rounded-2xl overflow-hidden divide-y divide-[#cfcfcf]">
                {(Object.keys(PAYMENT_METHODS) as Array<keyof typeof PAYMENT_METHODS>).map((key) => {
                  const method = PAYMENT_METHODS[key];
                  const isChecked = pm === key;
                  return (
                    <label
                      key={key}
                      className="flex items-center gap-4 p-4 min-[560px]:p-[20px_22px] cursor-pointer hover:bg-[#F6F6F6] transition-colors"
                    >
                      <input
                        type="radio"
                        name="pm"
                        value={key}
                        checked={isChecked}
                        onChange={() => setPm(key)}
                        className="w-6.5 h-6.5 accent-[#43A047] cursor-pointer shrink-0"
                      />
                      <span className="w-[44px] h-[30px] rounded-lg bg-[#CCF88E] grid place-items-center text-base shrink-0">
                        {method.icon}
                      </span>
                      <span className="font-semibold text-base text-[#1A1A1A]">{method.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-1">
              <label className="flex items-start gap-3.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnon}
                  onChange={(e) => setIsAnon(e.target.checked)}
                  className="w-6.5 h-6.5 accent-[#43A047] rounded cursor-pointer mt-0.5 shrink-0"
                />
                <span className="text-sm text-[#1A1A1A]">Don’t display my name or profile publicly on the campaign.</span>
              </label>

              <label className="flex items-start gap-3.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNews}
                  onChange={(e) => setIsNews(e.target.checked)}
                  className="w-6.5 h-6.5 accent-[#43A047] rounded cursor-pointer mt-0.5 shrink-0"
                />
                <span className="text-sm text-[#1A1A1A]">Send me occasional updates from Ethio Fund. You can unsubscribe at any time.</span>
              </label>
            </div>

            <hr className="border-t border-[#EBEBEB] my-6" />

            {/* Summary Breakdown */}
            <div>
              <h2 className="font-heading font-bold text-lg mb-3">
                Your donation
              </h2>
              <div className="space-y-2 text-sm text-[#6E6E6E]">
                <div className="flex justify-between">
                  <span>Your donation</span>
                  <span className="font-semibold text-[#1A1A1A]">{f2(amt)} ETB</span>
                </div>
                <div className="flex justify-between">
                  <span>Ethio Fund tip</span>
                  <span className="font-semibold text-[#1A1A1A]">{f2(computedTip)} ETB</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-[#1A1A1A] pt-[14px] border-t border-[#EBEBEB]">
                  <span>Total due today</span>
                  <span>{f2(totalDue)} ETB</span>
                </div>
              </div>
            </div>

            {errorMsg && <div className="text-[#B3261E] text-sm font-semibold">{errorMsg}</div>}

            {/* Action Pay Button */}
            <button
              type="button"
              disabled={amt < MIN || isSubmitting}
              onClick={handlePay}
              className="w-full bg-[#1A1A1A] hover:bg-black text-white font-semibold text-[17px] py-5 rounded-full transition-all disabled:bg-[#EBEBEB] disabled:text-[#9a9a9a] disabled:cursor-not-allowed mt-6"
            >
              {isSubmitting
                ? 'Processing...'
                : amt < MIN
                ? `Enter at least ${MIN} ETB`
                : `Donate ${f2(totalDue)} ETB with ${PAYMENT_METHODS[pm].name}`}
            </button>

            <p className="text-xs text-[#6E6E6E] text-center mt-4">
              By clicking the button above, you agree to Ethio Fund’s{' '}
              <Link href="/terms" className="underline text-[#1A1A1A]">Terms of Service</Link> and{' '}
              <Link href="/privacy" className="underline text-[#1A1A1A]">Privacy Notice</Link>.
            </p>

            <hr className="border-t border-[#EBEBEB] my-6" />

            {/* Trust Badge */}
            <div className="flex items-start gap-4">
              <i className="text-3xl not-italic shrink-0">🛡️</i>
              <div>
                <b className="block text-sm font-bold text-[#1A1A1A]">Every campaign is reviewed</b>
                <span className="text-xs text-[#6E6E6E]">Our team checks each campaign, and funds are paid out only to verified accounts.</span>
              </div>
            </div>

          </div>
        )}

        </div>
      </div>
    </div>
  );
};
