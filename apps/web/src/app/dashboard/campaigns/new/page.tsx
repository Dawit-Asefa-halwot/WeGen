'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../../../components/Navbar';
import { Footer } from '../../../../components/Footer';
import { apiRequest } from '../../../../lib/api-client';
import { Heart, ShieldCheck, HeartHandshake, ArrowRight, ArrowLeft, CheckCircle2, Upload } from 'lucide-react';

export default function NewCampaignWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [categoryId, setCategoryId] = useState('3a010471-1d54-411a-8263-233630f5b901'); // Medical default
  const [location, setLocation] = useState('');
  const [goalEtb, setGoalEtb] = useState<number>(100000);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isReferral, setIsReferral] = useState(false);
  const [referralReason, setReferralReason] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryPhone, setBeneficiaryPhone] = useState('');
  const [beneficiaryRelationship, setBeneficiaryRelationship] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1 && !title.trim()) {
      setErrorMsg('Please enter a campaign title');
      return;
    }
    if (step === 2 && story.trim().length < 20) {
      setErrorMsg('Please provide a detailed story (at least 20 characters)');
      return;
    }
    setStep((prev) => Math.min(6, prev + 1));
  };

  const handleBack = () => setStep((prev) => Math.max(1, prev - 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg('');

    const res = await apiRequest('/campaigns', {
      method: 'POST',
      body: JSON.stringify({
        title,
        story,
        categoryId: '3a010471-1d54-411a-8263-233630f5b901',
        location: location || 'Addis Ababa, Ethiopia',
        goalEtb,
        coverImageUrl: coverImageUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
        isReferral,
        referralReason: isReferral ? referralReason : undefined,
        beneficiaryName,
        beneficiaryPhone,
        beneficiaryRelationship,
      }),
    });

    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.message || 'Failed to submit campaign');
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-10 space-y-8">
        
        {/* Title */}
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-widest">
            <Heart className="w-4 h-4 fill-emerald-500" /> Fundraiser Creation Wizard
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Start a Verified Fundraiser</h1>
          <p className="text-xs text-slate-500">Step {step} of 6 • Follow guided steps to submit for verification.</p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all ${
                i <= step ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Wizard Form Box */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
              {errorMsg}
            </div>
          )}

          {/* Step 1: Basics & Type */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Step 1: Campaign Title & Type</h3>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Campaign Title</label>
                <input
                  type="text"
                  placeholder="e.g. Support Urgent Cardiac Surgery for 7-Year-Old Chala"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Who are you raising funds for?</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsReferral(false)}
                    className={`p-4 rounded-2xl border text-left space-y-1 transition-all ${
                      !isReferral
                        ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600'
                    }`}
                  >
                    <div className="font-bold text-sm">Myself or Immediate Family</div>
                    <div className="text-xs text-slate-500">Personal campaign created by beneficiary or parent.</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsReferral(true)}
                    className={`p-4 rounded-2xl border text-left space-y-1 transition-all ${
                      isReferral
                        ? 'border-amber-600 bg-amber-50/80 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600'
                    }`}
                  >
                    <div className="font-bold text-sm">Referring Someone Else</div>
                    <div className="text-xs text-slate-500">Creating on behalf of another beneficiary in need.</div>
                  </button>
                </div>
              </div>

              {isReferral && (
                <div className="space-y-1 pt-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Reason for Referral</label>
                  <textarea
                    placeholder="Explain why you are referring this beneficiary..."
                    value={referralReason}
                    onChange={(e) => setReferralReason(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 2: Story */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Step 2: Campaign Story & Need</h3>
              <p className="text-xs text-slate-500">Explain the background, medical or emergency situation, and how funds will be used.</p>

              <textarea
                placeholder="Write a clear, compassionate story explaining the situation..."
                value={story}
                onChange={(e) => setStory(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800"
              />
            </div>
          )}

          {/* Step 3: Beneficiary */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Step 3: Beneficiary Information</h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Beneficiary Name</label>
                  <input
                    type="text"
                    placeholder="Full Beneficiary Name"
                    value={beneficiaryName}
                    onChange={(e) => setBeneficiaryName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Relationship to You</label>
                  <input
                    type="text"
                    placeholder="e.g. Self, Son, Neighbor"
                    value={beneficiaryRelationship}
                    onChange={(e) => setBeneficiaryRelationship(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Beneficiary Phone Number</label>
                <input
                  type="tel"
                  placeholder="+251 911 000 000"
                  value={beneficiaryPhone}
                  onChange={(e) => setBeneficiaryPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>
          )}

          {/* Step 4: Goal & Location */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Step 4: Goal & Location</h3>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Fundraising Goal (ETB)</label>
                <input
                  type="number"
                  min="1000"
                  value={goalEtb}
                  onChange={(e) => setGoalEtb(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Location in Ethiopia</label>
                <input
                  type="text"
                  placeholder="e.g. Addis Ababa, Ethiopia"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>
          )}

          {/* Step 5: Media */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Step 5: Photos & Cover Image</h3>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Cover Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>
          )}

          {/* Step 6: Review & Submit */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="w-5 h-5" /> Submission Notice
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Upon submission, your campaign will enter <strong className="text-slate-900 dark:text-white font-bold">SUBMITTED</strong> verification status. The WeGen compliance team will inspect documents before approving and publishing.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl space-y-2 text-xs">
                <div><span className="text-slate-500">Title:</span> <strong className="text-slate-900 dark:text-white">{title}</strong></div>
                <div><span className="text-slate-500">Goal:</span> <strong className="text-emerald-600 font-bold">{goalEtb.toLocaleString()} ETB</strong></div>
                <div><span className="text-slate-500">Beneficiary:</span> <strong className="text-slate-900 dark:text-white">{beneficiaryName || 'Self'}</strong></div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            {step < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-8 py-3 rounded-xl shadow-lg shadow-emerald-600/30"
              >
                {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
