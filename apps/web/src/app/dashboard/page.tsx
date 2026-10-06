'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CampaignData {
  title: string;
  goal: number;
  who?: string;
  city?: string;
  cat?: string;
  story?: string;
  photo?: string;
  org?: { n: string; s: string; c: string } | null;
}

interface AccountData {
  t: string; // Account type
  n: string; // Account number
  h: string; // Holder name
}

interface ProfileData {
  acct?: AccountData;
  id?: string;
  tasks?: number[];
}

const BANKS = [
  'Telebirr',
  'Commercial Bank of Ethiopia',
  'Awash Bank',
  'Bank of Abyssinia',
  'Dashen Bank',
  'Another bank',
];

const TASKS = [
  'Write down five people who would want to help',
  'Draft a short Telegram or WhatsApp message about your story',
  'Ask a friend to read your story and give feedback',
];

export default function UserDashboardPage() {
  const [tab, setTab] = useState<'today' | 'supporters' | 'share' | 'campaign'>('today');
  const [openFormKey, setOpenFormKey] = useState<'acct' | 'id' | null>(null);

  // Campaign & Profile State
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [profile, setProfile] = useState<ProfileData>({});

  // Inline Form States
  const [acctType, setAcctType] = useState<string>('');
  const [acctNum, setAcctNum] = useState<string>('');
  const [acctHolder, setAcctHolder] = useState<string>('');
  const [formErr, setFormErr] = useState<string>('');

  // Load Saved Data from LocalStorage / URL
  useEffect(() => {
    try {
      const savedCampaign = localStorage.getItem('ethiofund-campaign');
      const savedProfile = localStorage.getItem('ethiofund-profile');

      if (savedProfile) {
        const p: ProfileData = JSON.parse(savedProfile);
        setProfile(p);
        if (p.acct) {
          setAcctType(p.acct.t || '');
          setAcctNum(p.acct.n || '');
          setAcctHolder(p.acct.h || '');
        }
      }

      if (savedCampaign) {
        setCampaign(JSON.parse(savedCampaign));
      } else if (typeof window !== 'undefined' && window.location.search.includes('demo')) {
        setCampaign({
          title: 'Heart surgery for Dawit',
          goal: 150000,
          who: 'me',
          city: 'Addis Ababa',
          cat: 'Medical',
          story: 'Sample campaign story for Dawit’s heart surgery in Addis Ababa.',
          photo: '',
        });
      }
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  // Save Profile Helper
  const saveProfileData = (updated: ProfileData) => {
    setProfile(updated);
    try {
      localStorage.setItem('ethiofund-profile', JSON.stringify(updated));
    } catch (e) {
      alert('Could not save data. Try a smaller photo.');
    }
  };

  // Verification Steps Computation
  const stepSubOk = Boolean(campaign);
  const stepAcctOk = Boolean(profile.acct);
  const stepIdOk = Boolean(profile.id);

  const stepsList = [
    {
      k: 'sub',
      t: 'Campaign submitted',
      d: 'Sent to our team',
      ok: stepSubOk,
      auto: false,
    },
    {
      k: 'acct',
      t: 'Payout account',
      d: profile.acct
        ? `${profile.acct.t} · ····${profile.acct.n.slice(-4)}`
        : 'Tell us where donations should be paid',
      ok: stepAcctOk,
      auto: false,
    },
    {
      k: 'id',
      t: 'National ID photo',
      d: profile.id ? 'Sent for review' : 'Upload a clear photo of your ID',
      ok: stepIdOk,
      auto: false,
    },
    {
      k: 'rev',
      t: 'Team review',
      d: profile.acct && profile.id
        ? 'In review. We’ll let you know once you’re approved.'
        : 'Starts when the steps above are done',
      ok: false,
      auto: true,
    },
  ];

  const doneStepsCount = stepsList.filter((s) => s.ok).length;
  const nextIncompleteStep = stepsList.find((s) => !s.ok && !s.auto);

  // Form Save Handlers
  const handleSaveAcct = () => {
    setFormErr('');
    if (!acctType) {
      setFormErr('Choose an account type.');
      return;
    }
    const cleanNum = acctNum.replace(/[\s-]/g, '');
    const isPhoneValid = acctType === 'Telebirr' ? /^(09|07)\d{8}$/.test(cleanNum) : /^\d{8,16}$/.test(cleanNum);
    if (!isPhoneValid) {
      setFormErr(
        acctType === 'Telebirr'
          ? 'Enter your 10-digit Telebirr number, starting with 09 or 07.'
          : 'Enter the account number, 8 to 16 digits.'
      );
      return;
    }
    if (acctHolder.trim().length < 3) {
      setFormErr('Enter the account holder’s full name.');
      return;
    }

    const newAcct: AccountData = { t: acctType, n: cleanNum, h: acctHolder.trim() };
    saveProfileData({ ...profile, acct: newAcct });
    setOpenFormKey(null);
  };

  const handleIdUpload = (file?: File) => {
    setFormErr('');
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      setFormErr('Choose a photo (JPG or PNG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxDim = Math.max(img.width, img.height);
        const k = Math.min(1, 1000 / maxDim);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * k;
        canvas.height = img.height * k;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          saveProfileData({ ...profile, id: dataUrl });
          setOpenFormKey(null);
        }
      };
      img.onerror = () => setFormErr('We couldn’t read that photo. Try another one.');
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Toggle Daily Tasks
  const toggleTask = (taskIndex: number) => {
    const currentTasks = profile.tasks || [];
    const updatedTasks = currentTasks.includes(taskIndex)
      ? currentTasks.filter((t) => t !== taskIndex)
      : [...currentTasks, taskIndex];
    saveProfileData({ ...profile, tasks: updatedTasks });
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans antialiased pb-safe">
      
      {/* ==========================================
          STICKY HEADER
      ========================================== */}
      <header className="sticky top-0 z-10 bg-white/88 backdrop-blur-md border-b border-[#EBEBEB]">
        <div className="max-w-[1120px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-heading font-bold text-[19px] flex items-center gap-[9px] text-[#1A1A1A]">
            <i className="w-[22px] h-[22px] rounded-full bg-[#CCF88E] border-2 border-[#1A1A1A] inline-block shrink-0 not-italic" />
            Ethio Fund
          </Link>

          <Link href="/dashboard/campaigns/new" className="btn-pill btn-outline btn-small">
            Start a campaign
          </Link>
        </div>
      </header>

      {/* ==========================================
          2-COLUMN DASHBOARD LAYOUT (.lay)
      ========================================== */}
      <div className="max-w-[1000px] mx-auto px-6 py-10 pb-20 grid grid-cols-1 min-[860px]:grid-cols-[200px_minmax(0,700px)] gap-12 justify-center">
        
        {/* SIDEBAR NAV (.nv) */}
        <nav className="flex min-[860px]:grid gap-2 sticky top-[96px] h-fit overflow-x-auto min-[860px]:overflow-visible" aria-label="Dashboard">
          {[
            { id: 'today', icon: '🏠', label: 'Today' },
            { id: 'supporters', icon: '👥', label: 'Supporters' },
            { id: 'share', icon: '↗', label: 'Share' },
            { id: 'campaign', icon: '📄', label: 'Campaign' },
          ].map((item) => {
            const isActive = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setTab(item.id as typeof tab);
                  setOpenFormKey(null);
                }}
                className={`flex items-center gap-3.5 rounded-full p-1.5 pr-4 text-[17px] text-left transition-colors whitespace-nowrap ${
                  isActive ? 'font-semibold' : 'hover:bg-[#F6F6F6]'
                }`}
              >
                <i className={`w-11 h-11 rounded-full grid place-items-center not-italic shrink-0 ${
                  isActive ? 'bg-[#CCF88E]' : 'bg-[#F6F6F6]'
                }`}>
                  {item.icon}
                </i>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* MAIN CONTENT AREA */}
        <main className="space-y-7">
          
          {/* ------------------------------------------
              1. TODAY TAB
          ------------------------------------------ */}
          {tab === 'today' && (
            campaign ? (
              <div className="space-y-7">
                
                {/* Conic Ring & Hero Card */}
                <div className="relative pt-12">
                  {/* Conic Ring */}
                  <div className="w-[108px] h-[108px] rounded-full bg-[conic-gradient(#1A1A1A_0%,rgba(26,26,26,0.14)_0)] grid place-items-center mx-auto -mb-[54px] relative z-20">
                    <div className="w-[92px] h-[92px] rounded-full bg-white border-[6px] border-white overflow-hidden grid place-items-center text-3xl">
                      {campaign.photo ? (
                        <img src={campaign.photo} alt={campaign.title} className="w-full h-full object-cover" />
                      ) : (
                        <span>🌱</span>
                      )}
                    </div>
                  </div>

                  {/* Hero Card */}
                  <div className="bg-[#CCF88E] rounded-[28px] pt-[70px] p-6 text-center relative">
                    <button
                      type="button"
                      onClick={() => setTab('share')}
                      className="btn-pill btn-dark btn-small absolute -top-7 right-0"
                    >
                      Share
                    </button>

                    <h1 className="font-heading text-3xl min-[600px]:text-[34px] font-bold leading-tight text-[#1A1A1A]">
                      {campaign.goal ? campaign.goal.toLocaleString('en-US') : 0} ETB goal
                    </h1>
                    <p className="mt-0.5 text-[#1A1A1A] font-medium break-all">
                      {campaign.title}
                    </p>
                    <div className="inline-block bg-white rounded-full px-3 py-1 text-xs font-semibold mt-2.5 shadow-sm">
                      Not live yet · in verification
                    </div>

                    <div className="flex flex-wrap gap-2.5 justify-center mt-[18px]">
                      <span className="bg-white/75 rounded-full px-5 py-1.5 text-[15px] text-[#1A1A1A]">
                        <b className="font-bold">0</b> Donors
                      </span>
                      <span className="bg-white/75 rounded-full px-5 py-1.5 text-[15px] text-[#1A1A1A]">
                        <b className="font-bold">0</b> Shares
                      </span>
                      <span className="bg-white/75 rounded-full px-5 py-1.5 text-[15px] text-[#1A1A1A]">
                        <b className="font-bold">0</b> Views
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verification Checklist Card */}
                <section className="border border-[#EBEBEB] rounded-[24px] overflow-hidden bg-white">
                  <div className="p-6 pb-2">
                    <h2 className="font-heading font-bold text-[22px]">
                      {nextIncompleteStep ? 'Finish verification to go live' : 'Verification in review'}
                    </h2>
                    <p className="text-[#6E6E6E] text-[15px]">
                      {doneStepsCount} of 4 steps done
                    </p>
                    <div className="h-2 rounded-full bg-[#EBEBEB] mt-3.5 mb-1.5 overflow-hidden">
                      <div
                        className="h-full bg-[#1A1A1A] rounded-full transition-all duration-600"
                        style={{ width: `${doneStepsCount * 25}%` }}
                      />
                    </div>
                  </div>

                  <div className="divide-y divide-[#EBEBEB]">
                    {stepsList.map((s) => {
                      const isNext = nextIncompleteStep && nextIncompleteStep.k === s.k;
                      const isOpen = openFormKey === s.k;
                      return (
                        <div key={s.k} className="border-t border-[#EBEBEB]">
                          <div className="p-[18px_24px] flex items-center gap-4">
                            <span className={`w-[30px] h-[30px] rounded-full border-1.5 border-dashed border-[#aaa] grid place-items-center text-sm shrink-0 ${
                              s.ok ? 'bg-[#1A1A1A] border-0 text-white' : ''
                            }`}>
                              {s.ok ? '✓' : ''}
                            </span>
                            <div className="flex-1 min-w-0">
                              <b className="block font-semibold text-[#1A1A1A]">
                                {s.t}
                                {isNext && (
                                  <span className="inline-block bg-[#CCF88E] text-[#1A1A1A] rounded-full px-2.5 py-0.5 text-xs font-semibold ml-2">
                                    Next step
                                  </span>
                                )}
                              </b>
                              <small className="text-[#6E6E6E] text-sm block truncate">{s.d}</small>
                            </div>
                            {!s.auto && s.k !== 'sub' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenFormKey(isOpen ? null : (s.k as 'acct' | 'id'));
                                  setFormErr('');
                                }}
                                className={`btn-pill btn-small ${isNext ? 'btn-dark' : 'btn-outline'}`}
                              >
                                {s.ok ? 'Edit' : 'Start'}
                              </button>
                            )}
                          </div>

                          {/* Inline Form: Payout Account */}
                          {isOpen && s.k === 'acct' && (
                            <div className="ml-0 min-[860px]:ml-[46px] m-4 mt-0 grid gap-3 p-4 bg-[#F6F6F6] rounded-2xl">
                              <label className="fld block bg-white border border-[#cfcfcf] rounded-xl p-3">
                                <span className="text-xs text-[#6E6E6E] block mb-1">Account type</span>
                                <select
                                  value={acctType}
                                  onChange={(e) => setAcctType(e.target.value)}
                                  className="w-full border-0 outline-none text-[17px] bg-transparent cursor-pointer"
                                >
                                  <option value="">Choose…</option>
                                  {BANKS.map((b) => (
                                    <option key={b} value={b}>{b}</option>
                                  ))}
                                </select>
                              </label>

                              <label className="fld block bg-white border border-[#cfcfcf] rounded-xl p-3">
                                <span className="text-xs text-[#6E6E6E] block mb-1">
                                  {acctType === 'Telebirr' ? 'Telebirr phone number' : 'Account number'}
                                </span>
                                <input
                                  value={acctNum}
                                  onChange={(e) => setAcctNum(e.target.value)}
                                  inputMode="numeric"
                                  autoComplete="off"
                                  placeholder={acctType === 'Telebirr' ? '0911000000' : '1000123456789'}
                                  className="w-full border-0 outline-none text-[17px] bg-transparent"
                                />
                              </label>

                              <label className="fld block bg-white border border-[#cfcfcf] rounded-xl p-3">
                                <span className="text-xs text-[#6E6E6E] block mb-1">Account holder name</span>
                                <input
                                  value={acctHolder}
                                  onChange={(e) => setAcctHolder(e.target.value)}
                                  autoComplete="name"
                                  placeholder="Full Name"
                                  className="w-full border-0 outline-none text-[17px] bg-transparent"
                                />
                              </label>

                              <div className="bg-[#E5F6F8] rounded-xl p-2.5 text-xs text-[#1A1A1A]">
                                The name must match your national ID, or we can’t pay you out.
                              </div>

                              {formErr && <div className="text-[#B3261E] text-xs font-semibold">{formErr}</div>}

                              <div className="pt-1">
                                <button
                                  type="button"
                                  onClick={handleSaveAcct}
                                  className="btn-pill btn-dark btn-small"
                                >
                                  Save account
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Inline Form: National ID Photo */}
                          {isOpen && s.k === 'id' && (
                            <div className="ml-0 min-[860px]:ml-[46px] m-4 mt-0 grid gap-3 p-4 bg-[#F6F6F6] rounded-2xl">
                              <label className="fld block bg-white border border-[#cfcfcf] rounded-xl p-3">
                                <span className="text-xs text-[#6E6E6E] block mb-1">Photo of your national ID</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleIdUpload(e.target.files?.[0])}
                                  className="w-full text-sm"
                                />
                              </label>

                              <div className="bg-[#E5F6F8] rounded-xl p-2.5 text-xs text-[#1A1A1A]">
                                Make sure all four corners are visible, the text is readable and there is no glare. Only our review team sees this photo.
                              </div>

                              {profile.id && (
                                <img src={profile.id} alt="Your uploaded ID" className="w-full max-w-[260px] rounded-xl border border-[#EBEBEB] mt-2" />
                              )}

                              {formErr && <div className="text-[#B3261E] text-xs font-semibold">{formErr}</div>}
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Daily Plan Section */}
                <section className="border border-[#EBEBEB] rounded-[24px] overflow-hidden bg-white">
                  <div className="p-6 pb-2">
                    <h2 className="font-heading font-bold text-[22px]">Your daily plan</h2>
                    <p className="text-[#6E6E6E] text-[15px]">
                      {TASKS.length - (profile.tasks || []).length > 0
                        ? `${TASKS.length - (profile.tasks || []).length} tasks left`
                        : 'All done for today'}
                    </p>
                  </div>

                  <div className="divide-y divide-[#EBEBEB] pt-2">
                    {TASKS.map((taskText, idx) => {
                      const isTaskDone = (profile.tasks || []).includes(idx);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleTask(idx)}
                          className="w-full flex items-center gap-4 p-[18px_24px] text-left hover:bg-[#F6F6F6] transition-colors"
                        >
                          <span className="w-[30px] h-[30px] rounded-full border-1.5 border-dashed border-[#aaa] grid place-items-center text-sm shrink-0">
                            <span className={`w-[30px] h-[30px] rounded-full grid place-items-center text-sm ${
                              isTaskDone ? 'bg-[#1A1A1A] text-white' : ''
                            }`}>
                              {isTaskDone ? '✓' : ''}
                            </span>
                          </span>
                          <span className={`text-[15px] font-medium ${isTaskDone ? 'line-through text-[#6E6E6E]' : 'text-[#1A1A1A]'}`}>
                            {taskText}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>

              </div>
            ) : (
              /* EMPTY STATE: NO CAMPAIGN YET */
              <div className="text-center py-16 px-4 border-2 border-dashed border-[#EBEBEB] rounded-[32px] bg-white space-y-4">
                <h2 className="font-heading font-bold text-2xl">You haven’t started a campaign yet</h2>
                <p className="text-[#6E6E6E] max-w-sm mx-auto">
                  It takes a few minutes. You can finish verification afterwards.
                </p>
                <div>
                  <Link href="/dashboard/campaigns/new" className="btn-pill btn-dark">
                    Start a campaign
                  </Link>
                </div>
              </div>
            )
          )}

          {/* ------------------------------------------
              2. SUPPORTERS TAB
          ------------------------------------------ */}
          {tab === 'supporters' && (
            <div className="text-center py-16 px-4 border-2 border-dashed border-[#EBEBEB] rounded-[32px] bg-white space-y-2">
              <h2 className="font-heading font-bold text-2xl">No supporters yet</h2>
              <p className="text-[#6E6E6E]">Donors will appear here once your campaign is live.</p>
            </div>
          )}

          {/* ------------------------------------------
              3. SHARE TAB
          ------------------------------------------ */}
          {tab === 'share' && (
            <div className="text-center py-16 px-4 border-2 border-dashed border-[#EBEBEB] rounded-[32px] bg-white space-y-4">
              <h2 className="font-heading font-bold text-2xl">Sharing opens after approval</h2>
              <p className="text-[#6E6E6E] max-w-md mx-auto">
                Your link is created when our team approves your campaign. Finish verification to get there sooner.
              </p>
              <div>
                <button
                  type="button"
                  onClick={() => setTab('today')}
                  className="btn-pill btn-dark"
                >
                  See my progress
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------
              4. CAMPAIGN TAB
          ------------------------------------------ */}
          {tab === 'campaign' && (
            campaign ? (
              <div className="bg-white border border-[#EBEBEB] rounded-[24px] p-8 space-y-6">
                <h2 className="font-heading font-bold text-2xl">Your campaign</h2>
                
                <div className="divide-y divide-[#EBEBEB]">
                  <div className="py-3.5">
                    <small className="text-xs text-[#6E6E6E] block mb-0.5">Title</small>
                    <p className="text-base font-semibold text-[#1A1A1A]">{campaign.title}</p>
                  </div>

                  <div className="py-3.5">
                    <small className="text-xs text-[#6E6E6E] block mb-0.5">Goal</small>
                    <p className="text-base font-semibold text-[#1A1A1A]">
                      {campaign.goal ? campaign.goal.toLocaleString('en-US') : 0} ETB
                    </p>
                  </div>

                  <div className="py-3.5">
                    <small className="text-xs text-[#6E6E6E] block mb-0.5">Raising funds for</small>
                    <p className="text-base font-semibold text-[#1A1A1A]">
                      {campaign.who === 'org' && campaign.org
                        ? `Charity: ${campaign.org.n}`
                        : campaign.who === 'other'
                        ? 'Someone else'
                        : 'Yourself'}
                    </p>
                  </div>

                  <div className="py-3.5">
                    <small className="text-xs text-[#6E6E6E] block mb-0.5">Location and category</small>
                    <p className="text-base font-semibold text-[#1A1A1A]">
                      {campaign.city || 'Addis Ababa'} · {campaign.cat || 'General'}
                    </p>
                  </div>

                  <div className="py-3.5">
                    <small className="text-xs text-[#6E6E6E] block mb-0.5">Story</small>
                    <p className="text-base text-[#6E6E6E] whitespace-pre-wrap">{campaign.story}</p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-16 px-4 border-2 border-dashed border-[#EBEBEB] rounded-[32px] bg-white space-y-4">
                <h2 className="font-heading font-bold text-2xl">You haven’t started a campaign yet</h2>
                <p className="text-[#6E6E6E] max-w-sm mx-auto">
                  It takes a few minutes. You can finish verification afterwards.
                </p>
                <div>
                  <Link href="/dashboard/campaigns/new" className="btn-pill btn-dark">
                    Start a campaign
                  </Link>
                </div>
              </div>
            )
          )}

        </main>

      </div>

    </div>
  );
}
