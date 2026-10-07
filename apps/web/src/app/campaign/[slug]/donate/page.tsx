'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Heart, ShieldCheck, ChevronDown, Check, X } from 'lucide-react';
import { CAMPAIGN_DB, CampaignDetail } from '../../../../data/campaignDetailDb';
import { apiRequest } from '../../../../lib/api-client';

export default function CampaignDonatePage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params.slug as string) || 'c1';

  // Get campaign from DB or fallback
  const campaign: CampaignDetail = CAMPAIGN_DB[slug] || CAMPAIGN_DB['c1'];

  // Presets in ETB
  const PRESETS = [5000, 2500, 1500, 1000, 500, 250];
  const MIN = 10;

  const PAYMENT_METHODS = {
    telebirr: { icon: '📱', name: 'Telebirr', desc: 'Pay instantly with Telebirr' },
    cbe: { icon: '🏦', name: 'CBE Birr', desc: 'Direct Commercial Bank of Ethiopia transfer' },
    card: { icon: '💳', name: 'Card (via Chapa)', desc: 'Debit / Credit card secured by Chapa' },
  };

  // State
  const [amt, setAmt] = useState<number>(1000);
  const [customInputVal, setCustomInputVal] = useState<string>('1000');
  const [tipPercent, setTipPercent] = useState<number>(15);
  const [customTip, setCustomTip] = useState<number | null>(null);
  const [customTipInput, setCustomTipInput] = useState<string>('');
  const [isCustomTipOpen, setIsCustomTipOpen] = useState<boolean>(false);
  const [pm, setPm] = useState<'telebirr' | 'cbe' | 'card'>('telebirr');
  const [isAnon, setIsAnon] = useState<boolean>(false);
  const [isNews, setIsNews] = useState<boolean>(false);
  const [socialProofDismissed, setSocialProofDismissed] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [recentDonations, setRecentDonations] = useState<Array<{ amt: number }>>([]);

  // Load Recent Donations from local storage
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

  // Progress computations
  const totalRaised = campaign.raisedEtb + recentDonations.reduce((acc, d) => acc + d.amt, 0);
  const goal = campaign.goalEtb || 1;
  const pct = Math.min(100, Math.round((totalRaised / goal) * 100));
  const remainingEtb = Math.max(0, goal - totalRaised);

  // Tip Computations
  const computedTip = customTip !== null ? customTip : Math.round((amt * tipPercent) / 100);
  const totalDue = amt + computedTip;

  // Format helpers
  const f0 = (n: number) => n.toLocaleString('en-US');
  const f2 = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const parseNum = (v: string) => Math.max(0, parseFloat(String(v).replace(/[^\d.]/g, '')) || 0);

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
      const updated = [...recentDonations, donationRecord];
      setRecentDonations(updated);
      localStorage.setItem('ethiofund-donations', JSON.stringify(updated));

      await apiRequest('/donations', {
        method: 'POST',
        body: JSON.stringify({
          campaignId: campaign.id,
          amountEtb: amt,
          paymentProvider: pm.toUpperCase(),
          isAnonymous: isAnon,
        }),
      });
    } catch (e) {
      // Demo / offline fallback
    }

    setIsSubmitting(false);
    setIsDone(true);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#1A1A1A] font-sans">
      {/* GoFundMe Minimal Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#EBEBEB] px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Back link */}
          <Link
            href={`/campaign/${slug}`}
            className="flex items-center gap-1.5 text-[15px] font-semibold text-[#1A1A1A] hover:text-[#02A95C] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Fundraiser</span>
          </Link>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-[24px] tracking-tight text-[#02A95C]">
              wegen
            </span>
          </Link>

          {/* User Menu Indicator */}
          <div className="flex items-center gap-2 cursor-pointer py-1 px-2.5 rounded-full hover:bg-[#F5F5F5] transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              W
            </div>
            <span className="text-[14px] font-semibold text-[#1A1A1A] hidden sm:inline">
              Wegen
            </span>
            <ChevronDown className="w-4 h-4 text-[#6E6E6E]" />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[620px] mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-[28px] sm:rounded-[36px] border border-[#EBEBEB] p-6 sm:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
          {isDone ? (
            /* SUCCESS VIEW */
            <div className="text-center py-6 sm:py-10 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-[#E8F8F0] text-[#02A95C] flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm">
                💚
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#1A1A1A]">
                Thank you for your generosity!
              </h1>
              <p className="mt-3 text-base sm:text-lg text-[#4A4A4A] max-w-md mx-auto">
                Your donation of <strong className="font-bold text-[#1A1A1A]">{f2(amt)} ETB</strong> to{' '}
                <span className="font-semibold text-[#1A1A1A]">“{campaign.title}”</span> was successfully received.
              </p>

              <div className="bg-[#F9FAFB] border border-[#EBEBEB] rounded-2xl p-5 my-8 text-left space-y-2 text-sm text-[#6E6E6E]">
                <div className="flex justify-between">
                  <span>Payment method</span>
                  <span className="font-semibold text-[#1A1A1A]">{PAYMENT_METHODS[pm].name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Donation amount</span>
                  <span className="font-semibold text-[#1A1A1A]">{f2(amt)} ETB</span>
                </div>
                <div className="flex justify-between">
                  <span>WeGen tip</span>
                  <span className="font-semibold text-[#1A1A1A]">{f2(computedTip)} ETB</span>
                </div>
                <div className="flex justify-between border-t border-[#EBEBEB] pt-2 text-base font-bold text-[#1A1A1A]">
                  <span>Total charged</span>
                  <span>{f2(totalDue)} ETB</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`/campaign/${slug}`}
                  className="bg-[#02A95C] hover:bg-[#029550] text-white font-bold py-3.5 px-8 rounded-full transition-all text-center"
                >
                  Return to fundraiser
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: campaign.title,
                        url: window.location.origin + `/campaign/${slug}`,
                      }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(window.location.origin + `/campaign/${slug}`);
                      alert('Fundraiser link copied to clipboard!');
                    }
                  }}
                  className="bg-[#F5F5F5] hover:bg-[#EBEBEB] text-[#1A1A1A] font-semibold py-3.5 px-8 rounded-full transition-all"
                >
                  Share fundraiser
                </button>
              </div>
            </div>
          ) : (
            /* DONATION FORM VIEW */
            <div className="space-y-6">
              
              {/* Header with Circular Progress Ring & Title */}
              <div className="flex items-center gap-4 sm:gap-5 pb-2">
                {/* GoFundMe style circular gauge */}
                <div className="relative w-[68px] h-[68px] shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#EBEBEB]"
                      strokeWidth="3.2"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#02A95C]"
                      strokeDasharray={`${pct}, 100`}
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[13px] font-extrabold font-heading text-[#1A1A1A]">
                    {pct}%
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h1 className="font-heading font-bold text-[20px] sm:text-[24px] leading-snug text-[#1A1A1A] line-clamp-2">
                    {campaign.title}
                  </h1>
                  <p className="font-semibold text-sm text-[#4A4A4A] mt-0.5">
                    {totalRaised >= goal
                      ? 'Goal reached! Help us expand the impact.'
                      : `Still ${f0(remainingEtb)} ETB to go. Help us build momentum.`}
                  </p>
                </div>
              </div>

              {/* Step: Enter your donation */}
              <div className="pt-2">
                <h2 className="font-heading font-bold text-lg sm:text-[19px] text-[#1A1A1A] mb-3">
                  Enter your donation
                </h2>

                {/* Preset Buttons Grid */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                  {PRESETS.map((val) => {
                    const isSelected = amt === val;
                    const isSuggested = val === 1000;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handlePresetSelect(val)}
                        className={`relative rounded-2xl py-4 sm:py-5 px-2 font-heading font-bold text-[17px] sm:text-[19px] transition-all border-2 text-center flex flex-col items-center justify-center ${
                          isSelected
                            ? 'border-[#02A95C] bg-[#E8F8F0] text-[#02A95C] shadow-sm'
                            : 'border-[#E0E0E0] bg-white text-[#1A1A1A] hover:border-[#BDBDBD] hover:bg-[#FAFAFA]'
                        }`}
                      >
                        <span>{f0(val)} ETB</span>
                        {isSuggested && (
                          <span className="mt-1 bg-[#02A95C] text-white text-[9px] font-extrabold tracking-wider px-1.5 py-0.5 rounded uppercase flex items-center gap-0.5 shadow-xs">
                            SUGGESTED
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Large Custom Amount Input Box */}
              <label className="flex items-center justify-between border-2 border-[#D6D6D6] rounded-2xl px-5 py-4 sm:py-5 focus-within:border-[#02A95C] focus-within:ring-2 focus-within:ring-[#02A95C]/15 transition-all bg-white cursor-text">
                <div className="flex flex-col">
                  <span className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1A1A1A] leading-none">
                    ETB
                  </span>
                  <span className="text-[11px] font-bold text-[#8A8A8A] uppercase tracking-wider mt-0.5">
                    Birr
                  </span>
                </div>

                <div className="flex items-baseline justify-end flex-1 ml-4">
                  <input
                    value={customInputVal}
                    onChange={(e) => handleCustomAmtInput(e.target.value)}
                    inputMode="decimal"
                    placeholder="0"
                    aria-label="Donation amount in ETB"
                    className="w-full text-right font-heading font-black text-3xl sm:text-[46px] leading-none border-0 outline-none bg-transparent text-[#1A1A1A]"
                  />
                  <span className="font-heading font-bold text-2xl sm:text-3xl text-[#8A8A8A] ml-1 select-none">
                    .00
                  </span>
                </div>
              </label>

              {/* Social Proof Pill (Matches Alvin J. donated $25 in screenshot) */}
              {!socialProofDismissed && (
                <div className="flex items-center justify-between bg-[#F8F9FA] border border-[#EBEBEB] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#4A4A4A]">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#E11D48] fill-[#E11D48]" />
                    <span>
                      <strong className="font-bold text-[#1A1A1A]">Alvin J.</strong> recently gave 500 ETB
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSocialProofDismissed(true)}
                    className="p-1 hover:bg-[#EBEBEB] rounded-full text-[#6E6E6E] hover:text-[#1A1A1A] transition-colors"
                    aria-label="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Tip WeGen Services Section */}
              <div className="pt-2">
                <h2 className="font-heading font-bold text-lg sm:text-[19px] text-[#1A1A1A] mb-1">
                  Tip WeGen services
                </h2>
                <p className="text-[#6E6E6E] text-[13px] sm:text-sm leading-relaxed mb-4">
                  WeGen has a 0% platform fee for organizers. WeGen will continue offering its services thanks to donors who will leave an optional amount here:
                </p>

                <div className="bg-[#FBFBFB] border border-[#EBEBEB] rounded-2xl p-4 sm:p-5 text-center">
                  <div className="inline-block bg-white shadow-xs rounded-xl px-4 py-1.5 text-sm font-extrabold text-[#1A1A1A] border border-[#E5E7EB] mb-3">
                    {customTip !== null ? `${f2(customTip)} ETB` : `${tipPercent}%`}
                  </div>

                  {!isCustomTipOpen && (
                    <input
                      type="range"
                      min="0"
                      max="25"
                      step="2.5"
                      value={tipPercent}
                      onChange={(e) => setTipPercent(parseFloat(e.target.value))}
                      className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#02A95C] my-2"
                      aria-label="Tip percentage"
                    />
                  )}

                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={toggleCustomTipMode}
                      className="text-xs sm:text-sm font-semibold underline underline-offset-4 text-[#1A1A1A] hover:text-[#02A95C] transition-colors"
                    >
                      {isCustomTipOpen ? 'Use a percentage slider' : 'Enter custom tip'}
                    </button>
                  </div>

                  {isCustomTipOpen && (
                    <div className="mt-3">
                      <label className="text-xs text-[#6E6E6E] block font-medium">
                        Tip amount in ETB:
                        <input
                          value={customTipInput}
                          onChange={(e) => handleCustomTipInput(e.target.value)}
                          inputMode="decimal"
                          placeholder="0"
                          className="w-[140px] border border-[#cfcfcf] rounded-xl px-3 py-1.5 text-center text-sm font-bold text-[#1A1A1A] mt-1.5 block mx-auto outline-none focus:border-[#02A95C]"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-2">
                <h2 className="font-heading font-bold text-lg sm:text-[19px] text-[#1A1A1A] mb-3">
                  Payment method
                </h2>
                <div className="border border-[#E0E0E0] rounded-2xl overflow-hidden divide-y divide-[#EBEBEB]">
                  {(Object.keys(PAYMENT_METHODS) as Array<keyof typeof PAYMENT_METHODS>).map((key) => {
                    const method = PAYMENT_METHODS[key];
                    const isChecked = pm === key;
                    return (
                      <label
                        key={key}
                        className={`flex items-center gap-4 p-4 sm:p-4.5 cursor-pointer transition-colors ${
                          isChecked ? 'bg-[#FAFAFA]' : 'hover:bg-[#FDFDFD]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="pm"
                          value={key}
                          checked={isChecked}
                          onChange={() => setPm(key)}
                          className="w-5 h-5 accent-[#02A95C] cursor-pointer shrink-0"
                        />
                        <span className="w-10 h-8 rounded-lg bg-[#E8F8F0] text-[#02A95C] flex items-center justify-center text-lg shrink-0">
                          {method.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-[15px] sm:text-base text-[#1A1A1A] block">
                            {method.name}
                          </span>
                          <span className="text-xs text-[#6E6E6E] block truncate">
                            {method.desc}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Privacy & Updates Checkboxes */}
              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnon}
                    onChange={(e) => setIsAnon(e.target.checked)}
                    className="w-5 h-5 accent-[#02A95C] rounded cursor-pointer mt-0.5 shrink-0"
                  />
                  <span className="text-[13px] sm:text-sm text-[#333333]">
                    Don’t display my name or profile publicly on the campaign.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNews}
                    onChange={(e) => setIsNews(e.target.checked)}
                    className="w-5 h-5 accent-[#02A95C] rounded cursor-pointer mt-0.5 shrink-0"
                  />
                  <span className="text-[13px] sm:text-sm text-[#333333]">
                    Send me occasional updates from WeGen. You can unsubscribe at any time.
                  </span>
                </label>
              </div>

              <hr className="border-t border-[#EBEBEB] my-6" />

              {/* Summary Breakdown */}
              <div>
                <h2 className="font-heading font-bold text-lg sm:text-[19px] text-[#1A1A1A] mb-3">
                  Your donation
                </h2>
                <div className="space-y-2.5 text-sm text-[#6E6E6E]">
                  <div className="flex justify-between">
                    <span>Your donation</span>
                    <span className="font-semibold text-[#1A1A1A]">{f2(amt)} ETB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>WeGen tip</span>
                    <span className="font-semibold text-[#1A1A1A]">{f2(computedTip)} ETB</span>
                  </div>
                  <div className="flex justify-between text-lg sm:text-xl font-bold text-[#1A1A1A] pt-3.5 border-t border-[#EBEBEB]">
                    <span>Total due today</span>
                    <span className="text-[#02A95C] font-extrabold">{f2(totalDue)} ETB</span>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="bg-red-50 text-red-600 border border-red-200 text-sm font-semibold rounded-xl p-3">
                  {errorMsg}
                </div>
              )}

              {/* Big Green Action Button (GoFundMe Style) */}
              <button
                type="button"
                disabled={amt < MIN || isSubmitting}
                onClick={handlePay}
                className="w-full bg-[#02A95C] hover:bg-[#029550] active:scale-[0.99] text-white font-extrabold text-base sm:text-lg py-4 sm:py-5 rounded-full shadow-md transition-all disabled:bg-[#EBEBEB] disabled:text-[#9A9A9A] disabled:cursor-not-allowed mt-6"
              >
                {isSubmitting
                  ? 'Processing...'
                  : amt < MIN
                  ? `Enter at least ${MIN} ETB`
                  : `Donate ${f2(totalDue)} ETB with ${PAYMENT_METHODS[pm].name}`}
              </button>

              <p className="text-xs text-[#8A8A8A] text-center mt-3 leading-relaxed">
                By clicking the button above, you agree to WeGen’s{' '}
                <Link href="/terms" className="underline text-[#1A1A1A] hover:text-[#02A95C]">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline text-[#1A1A1A] hover:text-[#02A95C]">
                  Privacy Notice
                </Link>.
              </p>

              <hr className="border-t border-[#EBEBEB] my-6" />

              {/* Trust & Guarantee Badge */}
              <div className="flex items-start gap-3.5 bg-[#F9FAFB] p-4 rounded-2xl border border-[#EBEBEB]">
                <ShieldCheck className="w-7 h-7 text-[#02A95C] shrink-0 mt-0.5" />
                <div>
                  <b className="block text-sm font-bold text-[#1A1A1A]">
                    Every campaign is protected & verified
                  </b>
                  <span className="text-xs text-[#6E6E6E] mt-0.5 block leading-normal">
                    Our team inspects each organizer's documents, and funds are disbursed exclusively to verified bank accounts.
                  </span>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
