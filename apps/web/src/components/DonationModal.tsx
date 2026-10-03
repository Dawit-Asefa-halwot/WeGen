'use client';

import React, { useState } from 'react';
import { X, Heart, ShieldCheck, CreditCard, Smartphone, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '../lib/api-client';

export interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  campaignTitle: string;
  campaignType: 'PERSONAL' | 'REFERRAL' | 'ORGANIZATION';
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  campaignId,
  campaignTitle,
  campaignType,
}) => {
  const [amountEtb, setAmountEtb] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('500');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentProvider, setPaymentProvider] = useState<'CHAPA' | 'TELEBIRR' | 'CBE_BIRR' | 'MOCK'>('CHAPA');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successResult, setSuccessResult] = useState<{ checkoutUrl?: string; reference?: string } | null>(null);

  if (!isOpen) return null;

  const presets = [100, 250, 500, 1000, 2500, 5000];

  const handlePresetClick = (val: number) => {
    setAmountEtb(val);
    setCustomAmount(val.toString());
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    const num = parseFloat(e.target.value);
    if (!isNaN(num) && num > 0) {
      setAmountEtb(num);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    // 1. Create donation
    const res = await apiRequest('/donations', {
      method: 'POST',
      body: JSON.stringify({
        campaignId,
        amountEtb,
        isAnonymous,
        donorName: donorName || undefined,
        donorEmail: donorEmail || undefined,
        donorPhone: donorPhone || undefined,
        paymentProvider,
        message: message || undefined,
      }),
    });

    if (!res.success) {
      setIsSubmitting(false);
      setErrorMsg(res.message || 'Failed to initiate donation');
      return;
    }

    // 2. Initiate Payment Gateway
    const payRes = await apiRequest('/payments/initiate', {
      method: 'POST',
      body: JSON.stringify({
        donationId: res.data.donationId,
        providerCode: paymentProvider,
      }),
    });

    setIsSubmitting(false);

    if (!payRes.success) {
      setErrorMsg(payRes.message || 'Payment provider error');
      return;
    }

    setSuccessResult({
      checkoutUrl: payRes.data.checkoutUrl,
      reference: res.data.donationReference,
    });
  };

  const platformFeePercentage = campaignType === 'ORGANIZATION' ? 0 : 10;
  const platformFeeEtb = (amountEtb * platformFeePercentage) / 100;
  const netBeneficiaryEtb = amountEtb - platformFeeEtb;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 fill-emerald-400" />
            Support Verified Cause
          </div>
          <h2 className="text-xl font-bold line-clamp-1 pr-6">{campaignTitle}</h2>
        </div>

        {/* Content */}
        {successResult ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Donation Created!</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Donation Ref: <span className="font-mono font-bold text-emerald-600">{successResult.reference}</span>
            </p>
            <p className="text-xs text-slate-500">
              Click below to complete secure payment processing via <span className="font-bold text-slate-700">{paymentProvider}</span>.
            </p>

            <a
              href={successResult.checkoutUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
            >
              Complete Payment ({amountEtb.toLocaleString()} ETB)
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {errorMsg && (
              <div className="p-3.5 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
                {errorMsg}
              </div>
            )}

            {/* Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Select Amount (ETB)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {presets.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handlePresetClick(val)}
                    className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
                      amountEtb === val
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                    }`}
                  >
                    {val.toLocaleString()} ETB
                  </button>
                ))}
              </div>
              <div className="pt-2">
                <input
                  type="number"
                  min="10"
                  value={customAmount}
                  onChange={handleCustomChange}
                  placeholder="Custom ETB Amount"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Financial Transparency Box */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 rounded-2xl p-4 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-700 dark:text-slate-300 font-medium">
                <span>Total Donation:</span>
                <span className="font-bold">{amountEtb.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>WeGen Platform Fee ({platformFeePercentage}%):</span>
                <span>-{platformFeeEtb.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-bold border-t border-emerald-200/60 pt-1.5">
                <span>Available Beneficiary Amount:</span>
                <span>{netBeneficiaryEtb.toLocaleString()} ETB</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Payment Provider
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentProvider('CHAPA')}
                  className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                    paymentProvider === 'CHAPA'
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  Chapa (Telebirr/Cards)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentProvider('MOCK')}
                  className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                    paymentProvider === 'MOCK'
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  Development Mock
                </button>
              </div>
            </div>

            {/* Donor Information */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Donor Details
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  Donate Anonymously
                </label>
              </div>

              {!isAnonymous && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              )}

              <textarea
                placeholder="Words of encouragement/message (optional)..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || amountEtb < 10}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.01]"
            >
              {isSubmitting ? 'Initiating Secure Payment...' : `Donate ${amountEtb.toLocaleString()} ETB Now`}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
