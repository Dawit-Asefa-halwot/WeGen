'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../../lib/api-client';
import { useAuthStore } from '../../../../lib/auth-store';
import AuthGateModal from '../../../../components/AuthGateModal';

const KEY = 'ethiofund-draft';
const MIN_WORDS = 50;
const MIN_GOAL = 1000;

const CATS = [
  'Medical', 'Education', 'Emergencies', 'Family', 'Funerals and memorials',
  'Faith', 'Community', 'Business', 'Animals', 'Environment', 'Events',
  'Newlyweds', 'Monthly bills', 'Creative', 'Sports', 'Volunteer', 'Other'
];

const CITIES = [
  'Addis Ababa', 'Adama', 'Bahir Dar', 'Dire Dawa', 'Gondar',
  'Hawassa', 'Jimma', 'Mekelle', 'Another place in Ethiopia'
];

const WHO = [
  { id: 'me', icon: '🌱', title: 'Yourself', desc: 'Funds go to your own Telebirr or bank account.' },
  { id: 'other', icon: '👥', title: 'Someone else', desc: 'Invite a beneficiary to receive the funds, or pass them on yourself.' },
  { id: 'org', icon: '🎗️', title: 'Charity', desc: 'Funds are delivered to your chosen nonprofit for you.' }
];

const CHARITIES = [
  { n: 'Ethiopian Red Cross Society', s: 'Humanitarian', c: 'Addis Ababa' },
  { n: 'Hamlin Fistula Ethiopia', s: 'Health', c: 'Addis Ababa' },
  { n: 'Mekedonia Home for the Elderly and Mentally Disabled', s: 'Elder care', c: 'Addis Ababa' },
  { n: 'SOS Children’s Villages Ethiopia', s: 'Children', c: 'Addis Ababa' },
  { n: 'Cheshire Services Ethiopia', s: 'Disability', c: 'Addis Ababa' }
];

export default function NewCampaignWizardPage() {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [step, setStep] = useState<number>(1);
  const [subStepCharity, setSubStepCharity] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // null = closed; '__step3__' = advance wizard after auth; any URL = navigate there
  const [authGate, setAuthGate] = useState<string | null>(null);

  useEffect(() => { checkAuth(); }, [checkAuth]);


  // Form State
  const [city, setCity] = useState<string>('Addis Ababa');
  const [cat, setCat] = useState<string>('');
  const [who, setWho] = useState<string>('');
  const [goal, setGoal] = useState<string>('');
  const [autoGoal, setAutoGoal] = useState<boolean>(true);
  const [photo, setPhoto] = useState<string>('');
  const [smallPhoto, setSmallPhoto] = useState<boolean>(false);
  const [extraPhotos, setExtraPhotos] = useState<string[]>([]);
  const [ytUrl, setYtUrl] = useState<string>('');
  const [story, setStory] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [selectedOrg, setSelectedOrg] = useState<{ n: string; s: string; c: string } | null>(null);

  // Charity Search & Modal State
  const [charityQuery, setCharityQuery] = useState<string>('');
  const [confirmOrg, setConfirmOrg] = useState<{ n: string; s: string; c: string } | null>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string>('');

  // Load Saved Draft
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        const d = JSON.parse(saved);
        if (d.city) setCity(d.city);
        if (d.cat) setCat(d.cat);
        if (d.who) setWho(d.who);
        if (d.goal) setGoal(d.goal);
        if (d.auto !== undefined) setAutoGoal(d.auto);
        if (d.yt) setYtUrl(d.yt);
        if (d.story) setStory(d.story);
        if (d.title) setTitle(d.title);
        if (d.org) setSelectedOrg(d.org);
        if (d.extraPhotos) setExtraPhotos(d.extraPhotos);
      }
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  // Save Draft Changes
  useEffect(() => {
    try {
      const draft = { city, cat, who, goal, auto: autoGoal, yt: ytUrl, story, title, org: selectedOrg, extraPhotos };
      localStorage.setItem(KEY, JSON.stringify(draft));
    } catch (e) {
      // Ignore
    }
  }, [city, cat, who, goal, autoGoal, ytUrl, story, title, selectedOrg, extraPhotos]);

  // Helpers
  const numVal = (v: string) => Number(String(v).replace(/\D/g, '')) || 0;
  const fmtNum = (n: number) => n.toLocaleString('en-US');
  const wordCount = (t: string) => (t.trim().match(/\S+/g) || []).length;
  const isYtOk = (u: string) => /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]{6,}/.test(u.trim());

  // Step Validation Check
  const isStepOk = (): boolean => {
    if (subStepCharity) return false;
    if (step === 1) return Boolean(city && cat);
    if (step === 2) return Boolean(who); // 'org' redirects to charity-setup on click

    if (step === 3) return numVal(goal) >= MIN_GOAL;
    if (step === 4) return Boolean(photo || isYtOk(ytUrl));
    if (step === 5) return wordCount(story) >= MIN_WORDS;
    if (step === 6) return Boolean(title.trim());
    if (step === 7) return true;
    return true;
  };

  // Image Upload Handler (Cover Photo)
  const handleFileUpload = (file?: File) => {
    setFileError('');
    if (!file) return;
    if (!/^image\//.test(file.type) || file.size > 10 * 1024 * 1024) {
      setFileError('Choose an image under 10 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setPhoto(reader.result as string);
        setYtUrl('');
        setSmallPhoto(img.naturalWidth < 720 || img.naturalHeight < 405);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Extra Photos Upload Handler
  const handleExtraPhotoUpload = (file?: File) => {
    setFileError('');
    if (!file) return;
    if (!/^image\//.test(file.type) || file.size > 10 * 1024 * 1024) {
      setFileError('Choose an image under 10 MB.');
      return;
    }
    if (extraPhotos.length >= 5) {
      setFileError('Maximum 5 additional photos.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setExtraPhotos((prev) => [...prev, reader.result as string]);
    };
    reader.readAsDataURL(file);
  };

  const removeExtraPhoto = (index: number) => {
    setExtraPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Submission Handler
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    const payload = {
      title,
      goal: numVal(goal),
      autoGoal,
      who,
      org: who === 'org' ? selectedOrg : null,
      city,
      cat,
      story,
      ytUrl,
      coverImageUrl: photo || (ytUrl ? 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80' : ''),
      extraPhotos,
      createdAt: Date.now(),
    };

    try {
      localStorage.setItem('ethiofund-campaign', JSON.stringify(payload));
      localStorage.removeItem(KEY);
      // Attempt API call
      await apiRequest('/campaigns', {
        method: 'POST',
        body: JSON.stringify({
          title,
          story,
          location: city,
          goalEtb: numVal(goal),
          coverImageUrl: payload.coverImageUrl,
        }),
      });
    } catch (e) {
      // Continue locally even if offline
    }

    setIsSubmitting(false);
    setIsDone(true);
  };

  // Navigation Logic
  const handleNext = () => {
    if (!isStepOk()) return;

    // Step 2: user has chosen who they raise for — gate auth here
    if (step === 2) {
      if (!isAuthenticated) {
        // For charity → after auth redirect to charity-setup
        // For yourself/someone else → after auth advance to step 3
        setAuthGate(who === 'org' ? '/dashboard/campaigns/charity-setup' : '__step3__');
        return;
      }
      // Already authenticated:
      if (who === 'org') {
        router.push('/dashboard/campaigns/charity-setup');
        return;
      }
    }

    if (step === 7) {
      handleFinalSubmit();
    } else {
      setStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  // Called by AuthGateModal after successful sign in / sign up
  const afterAuth = (next: string) => {
    setAuthGate(null);
    if (next === '__step3__') {
      setStep(3);
      window.scrollTo(0, 0);
    } else {
      router.push(next);
    }
  };

  const handleBack = () => {
    if (subStepCharity) {
      setSubStepCharity(false);
    } else {
      setStep((prev) => Math.max(1, prev - 1));
    }
    window.scrollTo(0, 0);
  };

  // Filtered Charities
  const filteredCharities = CHARITIES.filter((c) =>
    (c.n + c.c + c.s).toLowerCase().includes(charityQuery.trim().toLowerCase())
  );

  // Dynamic Headings & Subtitles per Step
  const getHeaderInfo = () => {
    if (isDone) {
      return {
        cnt: '',
        title: 'You’re almost live',
        desc: 'Our team reviews every campaign before donors can see it.',
      };
    }
    if (subStepCharity) {
      return {
        cnt: '2 of 6',
        title: 'Tell us who you’re raising funds for',
        desc: 'This helps us understand you and what you need.',
      };
    }
    switch (step) {
      case 1:
        return { cnt: '1 of 6', title: 'Let’s begin your fundraising journey', desc: 'We’re here to guide you every step of the way.' };
      case 2:
        return { cnt: '2 of 6', title: 'Tell us who you’re raising funds for', desc: 'This helps us understand you and what you need.' };
      case 3:
        return { cnt: '3 of 6', title: 'Tell us how much you’d like to raise', desc: 'You can change your goal at any time.' };
      case 4:
        return { cnt: '4 of 6', title: 'Add media', desc: 'A bright, clear photo helps people connect with your campaign right away.' };
      case 5:
        return { cnt: '5 of 6', title: 'Tell donors your story', desc: 'Say who you are, what happened, and how the money will be used.' };
      case 6:
        return { cnt: '6 of 6', title: 'Give your campaign a title & review', desc: 'Check everything before you send it to our team.' };
      default:
        return { cnt: '', title: '', desc: '' };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="min-h-screen bg-[#F6F6F6] text-[#1A1A1A] font-sans antialiased">
      <div className="grid grid-cols-1 min-[900px]:grid-cols-[5fr_7fr] min-h-screen">
        
        {/* ==========================================
            LEFT SIDEBAR (.side)
        ========================================== */}
        <aside className="p-8 min-[900px]:p-[32px_48px] flex flex-col gap-6">
          <Link href="/" className="font-heading font-bold text-[19px] flex items-center gap-[9px] text-[#1A1A1A]">
            <i className="w-[22px] h-[22px] rounded-full bg-[#CCF88E] border-2 border-[#1A1A1A] inline-block shrink-0" />
            Ethio Fund
          </Link>

          <div className="my-auto pb-[10vh]">
            <div className="text-[#6E6E6E] text-[15px] min-h-[24px] font-medium">
              {headerInfo.cnt}
            </div>
            <h1 className="font-heading text-[clamp(30px,3.6vw,46px)] leading-[1.08] font-medium my-[10px] max-w-[11em] text-[#1A1A1A]">
              {headerInfo.title}
            </h1>
            <p className="text-[#6E6E6E] max-w-[22em] text-base leading-relaxed">
              {headerInfo.desc}
            </p>
          </div>
        </aside>

        {/* ==========================================
            RIGHT MAIN SECTION (.main)
        ========================================== */}
        <section className="bg-white rounded-[28px_28px_0_0] min-[900px]:rounded-[48px_0_0_48px] flex flex-col min-h-[100svh] relative">
          
          {/* Top Header Link */}
          <div className="hidden min-[900px]:flex justify-end p-[32px_48px_0] min-h-[64px]">
            <Link href="/auth/login" className="font-medium text-[#1A1A1A] hover:underline">
              Log in
            </Link>
          </div>

          {/* Form Pane Body (.body) */}
          <div className="flex-1 flex items-center justify-center p-6 min-[900px]:p-[24px_48px]">
            <div className="w-full max-w-[620px]">
              
              {/* DONE STATE */}
              {isDone ? (
                <div className="text-center py-6">
                  <div className="w-[72px] h-[72px] rounded-full bg-[#CCF88E] grid place-items-center text-3xl mx-auto mb-5">
                    ✓
                  </div>
                  <h2 className="font-heading text-2xl font-bold leading-snug mb-4">
                    “{title}” was sent for review
                  </h2>
                  <ul className="list-none p-0 my-6 text-left border-t border-[#EBEBEB]">
                    <li className="py-3.5 border-b border-[#EBEBEB] text-[#6E6E6E]">
                      <b className="text-[#1A1A1A]">Add your documents.</b> Upload your ID and any supporting letters so we can verify the campaign.
                    </li>
                    <li className="py-3.5 border-b border-[#EBEBEB] text-[#6E6E6E]">
                      <b className="text-[#1A1A1A]">We review it.</b> Once approved, your campaign goes live and you can share the link.
                    </li>
                    <li className="py-3.5 border-b border-[#EBEBEB] text-[#6E6E6E]">
                      <b className="text-[#1A1A1A]">Share early.</b> Message close family and friends first to get your first donations.
                    </li>
                  </ul>
                  <div className="flex flex-wrap gap-3 justify-center pt-2">
                    <Link href="/dashboard" className="btn-pill btn-dark">
                      Go to my dashboard
                    </Link>
                    <Link href="/" className="btn-pill btn-outline">
                      Back to home
                    </Link>
                  </div>
                </div>
              ) : subStepCharity ? (

                /* CHARITY SUB-STEP VIEW */
                <div className="space-y-4">
                  <label className="fld">
                    <span className="text-xs text-[#6E6E6E] block mb-1">Charity name, city or sector</span>
                    <input
                      value={charityQuery}
                      onChange={(e) => setCharityQuery(e.target.value)}
                      placeholder="Search charities..."
                      className="w-full border-0 outline-none text-[17px] bg-transparent"
                    />
                  </label>
                  <p className="text-[#6E6E6E] text-sm mt-5 mb-1">Browse suggested charities</p>
                  
                  <div className="max-h-[46vh] overflow-y-auto divide-y divide-[#EBEBEB]">
                    {filteredCharities.length > 0 ? (
                      filteredCharities.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setConfirmOrg(item)}
                          className="flex items-center gap-4 w-full text-left p-4 hover:bg-[#F6F6F6] transition-colors rounded-xl"
                        >
                          <i className="w-[52px] h-[52px] rounded-full bg-[#CCF88E] grid place-items-center font-heading font-bold text-xl shrink-0 not-italic">
                            {item.n[0]}
                          </i>
                          <div>
                            <b className="block text-[#1A1A1A] text-base">{item.n}</b>
                            <span className="text-[#6E6E6E] text-sm">{item.s} · {item.c}</span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="text-[#6E6E6E] text-sm py-4">No charity found. Check the spelling or try a city.</p>
                    )}
                  </div>
                </div>

              ) : (

                /* REGULAR STEPS (1 TO 6) */
                <div className="space-y-6">

                  {/* STEP 1: LOCATION & CATEGORY */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <h2 className="font-heading font-bold text-[22px] leading-snug">
                        Where will the funds go?
                      </h2>
                      <p className="text-[#6E6E6E] text-sm mt-1 mb-4">
                        Choose where you plan to withdraw your funds.
                      </p>

                      <label className="fld">
                        <span className="text-xs text-[#6E6E6E] block mb-1">Location</span>
                        <select
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full border-0 outline-none text-[17px] bg-transparent cursor-pointer"
                        >
                          {CITIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </label>

                      <h2 className="font-heading font-bold text-[22px] leading-snug pt-4">
                        What best describes why you’re fundraising?
                      </h2>
                      <div className="flex flex-wrap gap-2.5 pt-2">
                        {CATS.map((c) => {
                          const isSelected = cat === c;
                          return (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setCat(c)}
                              className={`border rounded-full px-5 py-3 font-semibold text-sm transition-all ${
                                isSelected ? 'bg-[#CCF88E] border-[#1A1A1A]' : 'bg-white border-[#cfcfcf] hover:bg-[#F6F6F6]'
                              }`}
                            >
                              {c}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 2: WHO ARE YOU FUNDRAISING FOR? */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <h2 className="font-heading font-bold text-[22px] leading-snug">
                        Who are you fundraising for?
                      </h2>
                      <div className="grid gap-3.5 pt-2">
                        {WHO.map((item) => {
                          const isSelected = who === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setWho(item.id)}
                              className={`flex items-center gap-5 text-left border rounded-[20px] p-5.5 transition-all w-full ${
                                isSelected
                                  ? 'border-[#1A1A1A] shadow-[0_0_0_1px_#1A1A1A] bg-[#F4FDE6]'
                                  : 'border-[#cfcfcf] bg-white hover:bg-[#F6F6F6]'
                              }`}
                            >
                              <div className="w-14 h-14 rounded-2xl bg-[#CCF88E] grid place-items-center text-2xl shrink-0">
                                {item.icon}
                              </div>
                              <div>
                                <b className="block text-[17px] text-[#1A1A1A]">{item.title}</b>
                                <span className="text-[#6E6E6E] text-[15px] leading-relaxed block">{item.desc}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {who === 'org' && selectedOrg && (
                        <div className="bg-[#E5F6F8] rounded-2xl p-4 text-sm flex items-center justify-between mt-4">
                          <div>
                            <span className="text-[#6E6E6E] text-xs block">Selected Charity</span>
                            <b className="text-[#1A1A1A] font-bold">{selectedOrg.n}</b>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSubStepCharity(true)}
                            className="text-xs font-bold underline text-[#1A1A1A]"
                          >
                            Change
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 3: GOAL AMOUNT */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <label className={`fld flex items-center gap-3 p-4 border rounded-2xl bg-white ${numVal(goal) > 0 && numVal(goal) < MIN_GOAL ? 'border-[#B3261E]' : 'border-[#cfcfcf]'}`}>
                        <input
                          value={goal}
                          onChange={(e) => {
                            const raw = numVal(e.target.value);
                            setGoal(raw ? fmtNum(raw) : '');
                          }}
                          placeholder="Enter amount"
                          inputMode="numeric"
                          className="w-full text-xl border-0 outline-none bg-transparent"
                        />
                        <b className="text-xs bg-[#F6F6F6] rounded-lg px-2.5 py-1 text-[#1A1A1A]">ETB</b>
                      </label>

                      <div className={`text-sm flex justify-between ${numVal(goal) > 0 && numVal(goal) < MIN_GOAL ? 'text-[#B3261E]' : 'text-[#6E6E6E]'}`}>
                        <span>Minimum {fmtNum(MIN_GOAL)} ETB</span>
                      </div>

                      <div className="flex flex-wrap gap-2.5 pt-2">
                        {[50000, 100000, 250000, 500000].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setGoal(fmtNum(n))}
                            className="border border-[#cfcfcf] bg-white rounded-full px-5 py-3 font-semibold text-sm hover:bg-[#F6F6F6]"
                          >
                            {fmtNum(n)} ETB
                          </button>
                        ))}
                      </div>

                      <label className="flex items-center justify-between gap-4 bg-[#F6F6F6] rounded-2xl p-5 mt-6 cursor-pointer">
                        <div>
                          <b className="block text-[#1A1A1A]">Automated goal setting</b>
                          <span className="text-sm text-[#6E6E6E]">We’ll gradually raise your goal as donations come in to build momentum.</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={autoGoal}
                          onChange={(e) => setAutoGoal(e.target.checked)}
                          className="w-6 h-6 accent-[#1A1A1A] cursor-pointer"
                        />
                      </label>
                    </div>
                  )}

                  {/* STEP 4: COVER MEDIA */}
                  {step === 4 && (
                    <div className="space-y-6">
                      {photo ? (
                        <div className="space-y-8">
                          {/* ── Cover Photo Preview ── */}
                          <div>
                            <h2 className="font-heading font-bold text-[22px] leading-snug mb-1">Add a cover photo or video</h2>
                            <p className="text-[#6E6E6E] text-sm mb-4">Cover media helps tell your story. You can change it later.</p>
                            <div className="rounded-2xl overflow-hidden bg-[#1A1A1A] aspect-video relative">
                              <img src={photo} alt="Cover preview" className="w-full h-full object-cover" />
                              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#1A1A1A] shadow-sm">
                                Cover photo
                              </span>
                            </div>
                            {smallPhoto && (
                              <div className="bg-[#E5F6F8] rounded-xl p-3.5 text-xs text-[#1A1A1A] mt-3">
                                <b>This image is small.</b> For it to display well, use a photo at least 720 × 405 pixels.
                              </div>
                            )}
                            <div className="flex justify-center gap-6 mt-3">
                              <label className="font-semibold text-sm underline cursor-pointer text-[#1A1A1A] hover:text-[#6E6E6E] transition-colors">
                                Replace ↻
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(e.target.files?.[0])}
                                  className="hidden"
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => { setPhoto(''); setSmallPhoto(false); }}
                                className="font-semibold text-sm underline text-[#B3261E] hover:text-[#8c1c16] transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>

                          {/* ── Additional Photos (Optional) ── */}
                          <div>
                            <div className="flex items-baseline gap-2 mb-1">
                              <h3 className="font-heading font-bold text-[18px] leading-snug">Add more images</h3>
                              <span className="text-[#6E6E6E] text-sm">(Optional)</span>
                            </div>
                            <p className="text-[#6E6E6E] text-sm mb-4">
                              These images will be used to create posts and messages for you and your network to share.
                            </p>

                            <div className="flex flex-wrap gap-3">
                              {/* Existing Extra Photo Thumbnails */}
                              {extraPhotos.map((ep, idx) => (
                                <div key={idx} className="relative w-[130px] h-[100px] rounded-xl overflow-hidden bg-[#F6F6F6] group">
                                  <img src={ep} alt={`Photo ${idx + 2}`} className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => removeExtraPhoto(idx)}
                                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#1A1A1A]/70 text-white text-xs font-bold grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#B3261E]"
                                    title="Remove photo"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}

                              {/* Add More Photos Button */}
                              {extraPhotos.length < 5 && (
                                <label className="w-[130px] h-[100px] border-2 border-dashed border-[#bdbdbd] rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-[#F6F6F6] hover:border-[#1A1A1A] transition-colors">
                                  <span className="text-2xl">🖼️</span>
                                  <span className="text-[12px] font-semibold text-[#6E6E6E] text-center leading-tight">Add more<br />photos</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => { handleExtraPhotoUpload(e.target.files?.[0]); if (e.target) e.target.value = ''; }}
                                    className="hidden"
                                  />
                                </label>
                              )}
                            </div>
                          </div>

                          {/* ── YouTube Link ── */}
                          <div>
                            <h3 className="font-heading font-bold text-[18px] leading-snug mb-1">YouTube video link</h3>
                            <p className="text-[#6E6E6E] text-sm mb-3">(Optional) Add a video to tell your story in your own words.</p>
                            <label className="fld block">
                              <input
                                type="url"
                                value={ytUrl}
                                onChange={(e) => setYtUrl(e.target.value)}
                                placeholder="Paste a YouTube link"
                                className="w-full border-0 outline-none text-[17px] bg-transparent"
                              />
                            </label>
                          </div>

                          {fileError && <p className="text-[#B3261E] text-xs mt-2">{fileError}</p>}
                        </div>
                      ) : (
                        <div>
                          <h2 className="font-heading font-bold text-[22px] leading-snug">Add a cover photo or video</h2>
                          <p className="text-[#6E6E6E] text-sm mt-1 mb-4">Cover media helps tell your story. You can change it later.</p>
                          
                          <label
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileUpload(e.dataTransfer.files?.[0]); }}
                            className={`flex flex-col items-center justify-center gap-2 min-h-[220px] border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                              dragOver ? 'bg-[#F6F6F6] border-[#1A1A1A]' : 'border-[#bdbdbd] hover:bg-[#F6F6F6]'
                            }`}
                          >
                            <em className="text-3xl not-italic">🖼️</em>
                            <span className="font-semibold text-[#1A1A1A]">Upload a photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e.target.files?.[0])}
                              className="hidden"
                            />
                          </label>

                          <label className="fld block mt-4">
                            <span className="text-xs text-[#6E6E6E] block mb-1">Or add a YouTube link</span>
                            <input
                              type="url"
                              value={ytUrl}
                              onChange={(e) => setYtUrl(e.target.value)}
                              placeholder="Paste a link"
                              className="w-full border-0 outline-none text-[17px] bg-transparent"
                            />
                          </label>

                          {fileError && <p className="text-[#B3261E] text-xs mt-2">{fileError}</p>}
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 5: TELL DONORS YOUR STORY */}
                  {step === 5 && (
                    <div className="space-y-4">
                      <label className="fld block">
                        <textarea
                          value={story}
                          onChange={(e) => setStory(e.target.value)}
                          placeholder="Introduce yourself and what you’re raising funds for…"
                          className="w-full min-h-[210px] border-0 outline-none text-[17px] bg-transparent resize-y"
                        />
                      </label>

                      <div className="bg-[#FFF3C9] rounded-2xl p-5">
                        <b className="block text-[#1A1A1A] font-bold text-sm">
                          {wordCount(story) >= MIN_WORDS
                            ? `${wordCount(story)} words · Looks good`
                            : `${MIN_WORDS - wordCount(story)} more words needed`}
                        </b>
                        <span className="text-xs text-[#5b4a00] block mt-1">
                          Donors give more when they know who you are, why you need help, and where the money goes.
                        </span>
                        <div className="h-1.5 rounded-full bg-[#1A1A1A]/13 mt-3 overflow-hidden">
                          <div
                            className="h-full bg-[#1A1A1A] transition-all duration-300"
                            style={{ width: `${Math.min(100, (wordCount(story) / MIN_WORDS) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 6: CAMPAIGN TITLE */}
                  {step === 6 && (
                    <div className="space-y-6">
                      <label className="fld block border p-4 rounded-2xl">
                        <div className="flex items-center justify-between gap-3">
                          <input
                            value={title}
                            maxLength={60}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Donate to help…"
                            className="w-full border-0 outline-none text-[17px] bg-transparent"
                          />
                          <b className="text-xs font-normal text-[#6E6E6E] shrink-0">{60 - title.length}</b>
                        </div>
                      </label>
                    </div>
                  )}

                  {/* STEP 7: REVIEW */}
                  {step === 7 && (
                    <div className="space-y-6">
                      {/* REVIEW SUMMARY */}
                      <div className="divide-y divide-[#EBEBEB]">
                        {photo && (
                          <div className="pb-4">
                            <div className="rounded-2xl overflow-hidden bg-[#1A1A1A] aspect-video max-h-[180px]">
                              <img src={photo} alt="Cover" className="w-full h-full object-cover" />
                            </div>
                          </div>
                        )}

                        <div className="flex items-start justify-between gap-4 py-3.5">
                          <div>
                            <small className="text-xs text-[#6E6E6E] block">Title</small>
                            <p className="text-sm font-medium text-[#1A1A1A]">{title || 'Untitled'}</p>
                          </div>
                          <button type="button" onClick={() => setStep(6)} className="btn-pill btn-outline btn-small">Edit</button>
                        </div>

                        <div className="flex items-start justify-between gap-4 py-3.5">
                          <div>
                            <small className="text-xs text-[#6E6E6E] block">Cover media</small>
                            <p className="text-sm font-medium text-[#1A1A1A]">{photo ? 'Photo added' : ytUrl ? ytUrl : 'No cover media yet'}</p>
                          </div>
                          <button type="button" onClick={() => setStep(4)} className="btn-pill btn-outline btn-small">Edit</button>
                        </div>

                        <div className="flex items-start justify-between gap-4 py-3.5">
                          <div>
                            <small className="text-xs text-[#6E6E6E] block">Fundraising goal {autoGoal ? '(automated)' : ''}</small>
                            <p className="text-sm font-medium text-[#1A1A1A]">{fmtNum(numVal(goal))} ETB</p>
                          </div>
                          <button type="button" onClick={() => setStep(3)} className="btn-pill btn-outline btn-small">Edit</button>
                        </div>

                        <div className="flex items-start justify-between gap-4 py-3.5">
                          <div>
                            <small className="text-xs text-[#6E6E6E] block">Raising funds for</small>
                            <p className="text-sm font-medium text-[#1A1A1A]">
                              {who === 'org' && selectedOrg ? `Charity: ${selectedOrg.n}` : who === 'me' ? 'Yourself' : 'Someone else'}
                            </p>
                          </div>
                          <button type="button" onClick={() => setStep(2)} className="btn-pill btn-outline btn-small">Edit</button>
                        </div>

                        <div className="flex items-start justify-between gap-4 py-3.5">
                          <div>
                            <small className="text-xs text-[#6E6E6E] block">Location and category</small>
                            <p className="text-sm font-medium text-[#1A1A1A]">{city} · {cat}</p>
                          </div>
                          <button type="button" onClick={() => setStep(1)} className="btn-pill btn-outline btn-small">Edit</button>
                        </div>

                        <div className="flex items-start justify-between gap-4 py-3.5">
                          <div>
                            <small className="text-xs text-[#6E6E6E] block">Story</small>
                            <p className="text-sm text-[#6E6E6E] line-clamp-2">{story}</p>
                          </div>
                          <button type="button" onClick={() => setStep(5)} className="btn-pill btn-outline btn-small">Edit</button>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}

            </div>
          </div>

          {/* Bottom Action Bar (.bar) */}
          {!isDone && (
            <div className="relative flex items-center gap-3 p-[20px_48px] border-t border-[#EBEBEB]">
              {/* Progress line */}
              <div
                className="absolute top-[-1px] left-0 h-[2px] bg-[#1A1A1A] transition-all duration-400"
                style={{ width: `${(step / 7) * 100}%` }}
              />

              {/* Back Button */}
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-12 h-12 rounded-full border border-[#EBEBEB] hover:bg-[#F6F6F6] flex items-center justify-center text-xl shrink-0"
                  aria-label="Go back"
                >
                  ←
                </button>
              )}

              <div className="flex-1" />

              {/* Skip for now (Step 4) */}
              {step === 4 && !photo && !ytUrl && (
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="font-semibold text-sm underline px-3"
                >
                  Skip for now
                </button>
              )}

              {/* Continue / Review / Submit Button */}
              {!subStepCharity && (
                <button
                  type="button"
                  disabled={!isStepOk() || isSubmitting}
                  onClick={handleNext}
                  className="btn-pill btn-dark"
                >
                  {isSubmitting ? 'Submitting...' : step === 6 ? 'Review' : step === 7 ? 'Submit for review' : 'Continue'}
                </button>
              )}
            </div>
          )}

        </section>

      </div>

      {/* CONFIRM CHARITY DIALOG MODAL */}
      {confirmOrg && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-7 max-w-[440px] w-full space-y-4">
            <h2 className="font-heading font-bold text-xl">
              Raise funds for {confirmOrg.n}?
            </h2>
            <p className="text-sm text-[#6E6E6E]">
              Donations will be delivered to this charity, not to you. Make sure it’s the right one.
            </p>
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setConfirmOrg(null)}
                className="btn-pill btn-outline btn-small"
              >
                Choose another
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedOrg(confirmOrg);
                  setConfirmOrg(null);
                  setSubStepCharity(false);
                  setStep(3);
                }}
                className="btn-pill btn-dark btn-small"
              >
                Yes, choose this charity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth gate — slides up when unauthenticated user clicks Continue on step 2 */}
      {authGate && (
        <AuthGateModal
          next={authGate}
          onClose={() => setAuthGate(null)}
          onSuccess={afterAuth}
        />
      )}

    </div>
  );
}
