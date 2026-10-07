'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

/* ─────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────── */
interface OrgSession {
  name: string;
  category: string;
  location: string;
  verified: boolean;
  bg: string;
  banner: string | null;
  isNew: boolean;
  plan: 'monthly' | 'yearly';
  planLabel: string;
  price: number;
  per: string;
  cap: number;          // 0 = unlimited (yearly)
  renews: string;
  openedAt: number;
}

interface Camp  { icon: string; title: string; raised: number; goal: number; }
interface Don   { name: string; method: string; when: string; amt: string; }
interface Member { initials: string; name: string; role: string; }

/* ─────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────── */
const fmt = (n: number) => n.toLocaleString('en-US');

const makeInitials = (name: string) =>
  name.split(' ')
    .filter(w => /^[A-Za-z\u1200-\u137F]/.test(w))
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

const NAV = ['Overview','Campaigns','Donations','Team','Withdrawals','Subscription','Profile'];

/* ─────────────────────────────────────────────────────
   Static data for the "active / established" sample view
   (shown when org has pre-existing data; real data comes
    from the API in production)
───────────────────────────────────────────────────── */
const ACTIVE_CAMPS: Camp[] = [
  { icon: '💧', title: 'Clean water for Gurage villages', raised: 720000, goal: 900000 },
  { icon: '🍞', title: 'School feeding program',          raised: 655000, goal: 800000 },
  { icon: '🚑', title: 'Mobile clinic, Afar region',      raised: 465000, goal: 800000 },
];
const ACTIVE_DONS: Don[] = [
  { name: 'Selamawit K.',  method: 'Telebirr', when: '2 min ago',  amt: '1,500' },
  { name: 'Anonymous',     method: 'Chapa',    when: '25 min ago', amt: '500' },
  { name: 'Yonas & Tigist',method: 'Card',     when: '1 hr ago',   amt: '3,000' },
  { name: 'Meron B.',      method: 'Telebirr', when: '3 hr ago',   amt: '250' },
];

/* ─────────────────────────────────────────────────────
   SVGs
───────────────────────────────────────────────────── */
function CheckLime() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CCF88E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}
function CheckDark() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────
   Animated progress bar
───────────────────────────────────────────────────── */
function AnimatedBar({ pct, dark }: { pct: number; dark?: boolean }) {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    el.style.width = '0%';
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => { el.style.width = `${Math.max(pct, 1)}%`; })
    );
    return () => cancelAnimationFrame(id);
  }, [pct]);
  return (
    <div className="h-[6px] rounded-full overflow-hidden"
         style={{ background: dark ? 'rgba(26,26,26,.14)' : '#EBEBEB' }}>
      <div ref={barRef} className="h-full rounded-full"
           style={{ background: dark ? '#1A1A1A' : '#B6EA6C', width: '0%',
                    transition: 'width 0.9s cubic-bezier(.2,.8,.2,1)' }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────── */
export default function OrgDashboardPage() {
  const params = useParams();
  const slug = (params?.slug as string) ?? '';

  /* ── org data from localStorage ── */
  const [org, setOrg]   = useState<OrgSession | null>(null);
  const [ready, setReady] = useState(false);
  const [activeNav, setActiveNav] = useState('Overview');
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('ethiofund-org');
      if (raw) setOrg(JSON.parse(raw));
    } catch { /* ignore */ }
    setReady(true);
  }, []);

  if (!ready) return null; // avoid hydration flash

  /* ── derived identity from localStorage or slug fallback ── */
  const orgName     = org?.name     ?? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const orgCategory = org?.category ?? 'Human Services';
  const orgLocation = org?.location ?? 'Addis Ababa';
  const orgVerified = org?.verified ?? false;
  const orgInitials = makeInitials(orgName);

  /* ── plan & subscription ── */
  const planLabel  = org?.planLabel ?? 'Monthly';
  const planPrice  = org ? fmt(org.price) : '3,000';
  const planPer    = org?.per ?? 'month';
  const planCap    = org?.cap ?? 15;          // 0 = unlimited
  const planRenews = org?.renews ?? '—';
  const isUnlimited = planCap === 0;
  const postsUsed   = 0;                      // real usage from API in production
  const subPct      = isUnlimited ? 100 : 0;  // new account: 0 posts used

  /* ── mode: "new" org that just signed up, vs existing data ── */
  const isNewOrg = org?.isNew !== false;      // default to new if no session

  /* ── verification state ──
       new account:  not verified, no review yet → step 1 is "now"
       for Hope Ethiopia (pre-existing verified org): rev = true
  ── */
  const orgRev = !isNewOrg; // submitted docs = went through renewal flow

  /* ── setup checklist (only for brand-new accounts) ── */
  const TODO = isNewOrg ? [
    { done: true,  title: 'Account created and plan paid',     desc: `${planLabel} plan is active`,                                    cta: '',                 href: '' },
    { done: false, title: 'Verify your organization',           desc: 'Upload your registration documents to earn the verified badge',  cta: 'Upload documents', href: '#' },
    { done: false, title: 'Complete your profile',              desc: 'Add a logo and a short description of your work',                cta: 'Edit profile',     href: '#' },
    { done: false, title: 'Create your first campaign',         desc: 'Share a story with a video, documents and a goal',              cta: 'Create campaign',  href: '/dashboard/campaigns/new' },
    { done: false, title: 'Add a payout account',               desc: 'Choose where withdrawals are sent: bank or Telebirr',           cta: 'Add account',      href: '#' },
  ] : [];

  const doneCount = TODO.filter(t => t.done).length;
  const checklistPct = TODO.length ? (doneCount / TODO.length) * 100 : 0;

  /* ── stats ── */
  const stats: [string, string, string][] = isNewOrg
    ? [
        ['Total raised',           '0 ETB',        'No donations yet'],
        ['Live campaigns',         '0',            `${isUnlimited ? 'Unlimited' : planCap} posts available`],
        ['Donors',                 '0',            'Share a campaign to start'],
        ['Available to withdraw',  '0 ETB',        'Add a payout account'],
      ]
    : [
        ['Total raised',           '1,840,000 ETB','Up 12% this month'],
        ['Live campaigns',         '6',            '2 near their goal'],
        ['Donors',                 '2,310',        '146 give monthly'],
        ['Available to withdraw',  '1,206,000 ETB','After platform fee'],
      ];

  /* ── campaigns & donations ── */
  const camps = isNewOrg ? [] : ACTIVE_CAMPS;
  const dons  = isNewOrg ? [] : ACTIVE_DONS;

  /* ── team (owner only for new, full team for established) ── */
  const team: Member[] = isNewOrg
    ? [{ initials: orgInitials, name: orgName.split(' ').slice(0,2).join(' '), role: 'Owner · you' }]
    : [
        { initials: 'AT', name: 'Abebe Tadesse', role: 'Owner · you' },
        { initials: 'MG', name: 'Marta Girma',   role: 'Admin' },
        { initials: 'DK', name: 'Dawit Kebede',  role: 'Editor' },
      ];

  /* ── verification steps ── */
  const verSteps = [
    { label: 'Submit documents', sub: 'Registration certificate and tax ID' },
    { label: 'Team review',      sub: 'Usually within 48 hours' },
    { label: 'Verified badge',   sub: 'Shown on your page and campaigns' },
  ];
  const getStepCls = (i: number) => {
    if (!orgRev) return i === 0 ? 'now' : '';
    return i === 0 ? 'ok' : i === 1 ? 'now' : '';
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans antialiased">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-10 bg-white border-b border-[#EBEBEB]">
        <div className="max-w-[1120px] mx-auto px-6 flex items-center gap-7 h-16">
          <Link href="/" className="font-heading font-bold text-[19px] flex items-center gap-[9px] shrink-0 text-[#1A1A1A] no-underline">
            <i className="w-[22px] h-[22px] rounded-full bg-[#CCF88E] border-2 border-[#1A1A1A] inline-block not-italic shrink-0" />
            Ethio Fund
          </Link>

          <nav className="hidden md:flex gap-0.5 flex-1 overflow-x-auto" aria-label="Main">
            {NAV.map(label => (
              <button key={label} onClick={() => setActiveNav(label)}
                className={`px-3 py-1.5 rounded-full font-medium text-[15px] whitespace-nowrap transition-colors cursor-pointer border-0
                  ${activeNav === label ? 'bg-[#CCF88E] text-[#1A1A1A]' : 'bg-transparent text-[#6E6E6E] hover:text-[#1A1A1A]'}`}>
                {label}
              </button>
            ))}
          </nav>

          <div className="w-[34px] h-[34px] rounded-full bg-[#1A1A1A] text-white grid place-items-center font-semibold text-[13px] shrink-0 ml-auto"
               title={orgName}>{orgInitials}</div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="max-w-[1120px] mx-auto px-4 md:px-6 py-5 pb-20">

        {/* Welcome banner — new accounts only */}
        {isNewOrg && !welcomeDismissed && (
          <div className="flex justify-between items-center gap-3 bg-[#CCF88E] rounded-2xl px-[18px] py-3 mb-4 font-medium">
            <span>Your organization account is open. Welcome to Ethio Fund!</span>
            <button aria-label="Dismiss" onClick={() => setWelcomeDismissed(true)}
              className="border-0 bg-transparent text-xl leading-none px-1.5 py-0.5 cursor-pointer hover:opacity-70">×</button>
          </div>
        )}

        {/* Banner image area */}
        <div className="h-[200px] max-[900px]:h-[150px] rounded-[24px] max-[900px]:rounded-[18px] relative overflow-hidden
                        bg-gradient-to-br from-[#F1FBDF] via-[#CCF88E] to-[#B6EA6C]">
          {org?.banner ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={org.banner} alt="Organization banner" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <span className="absolute right-4 bottom-3.5 text-[12px] font-semibold bg-white/85 rounded-full px-2.5 py-0.5">
              Your banner appears here
            </span>
          )}
        </div>

        {/* ── ORG HEADER ROW ── */}
        <div className="flex flex-wrap gap-5 items-end -mt-10 ml-6 max-[900px]:-mt-9 max-[900px]:ml-3 relative">
          {/* Logo circle */}
          <div className="w-[88px] h-[88px] max-[900px]:w-[72px] max-[900px]:h-[72px] rounded-full border-[5px] border-white grid place-items-center
                          font-heading font-bold text-[28px] max-[900px]:text-[24px] shrink-0 z-[1]"
               style={{ background: org?.bg ?? '#CCF88E', color: org?.bg === '#1A1A1A' ? '#fff' : '#1A1A1A' }}>
            {orgInitials}
          </div>

          {/* Name + location */}
          <div className="flex-1 min-w-[200px] pt-11 max-[900px]:pt-[34px]">
            <h1 className="font-heading font-bold text-[clamp(22px,3.4vw,34px)] leading-[1.15] flex items-center gap-2.5 flex-wrap">
              {orgName}
              {orgVerified ? (
                <span className="w-[22px] h-[22px] rounded-full bg-[#1A1A1A] inline-grid place-items-center" title="Verified">
                  <CheckLime />
                </span>
              ) : orgRev ? (
                <span className="text-[12px] font-semibold bg-[#CCF88E] rounded-full px-2.5 py-0.5">Verification in review</span>
              ) : (
                <span className="text-[12px] font-semibold text-[#6E6E6E] border border-[#EBEBEB] rounded-full px-2.5 py-0.5">Not verified</span>
              )}
            </h1>
            <p className="text-[#6E6E6E] text-[14px]">{orgCategory} · {orgLocation}</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2.5 flex-wrap pt-11 max-[900px]:pt-0 max-[900px]:pl-3 max-[900px]:ml-0 max-[900px]:w-full pr-6 max-[900px]:pr-0">
            {!orgRev && !orgVerified && (
              <a href="#" className="inline-flex items-center font-semibold text-[15px] bg-white border-[1.5px] border-[#1A1A1A] rounded-full px-5 py-2.5 hover:bg-[#F6F6F6] transition-colors">
                Verify organization
              </a>
            )}
            <Link href="/dashboard/campaigns/new"
              className="inline-flex items-center font-semibold text-[15px] bg-[#CCF88E] border-[1.5px] border-[#CCF88E] rounded-full px-5 py-2.5 hover:bg-[#B6EA6C] transition-colors">
              New campaign
            </Link>
          </div>
        </div>

        {/* ── SETUP CHECKLIST (new accounts only) ── */}
        {TODO.length > 0 && (
          <section className="border border-[#EBEBEB] rounded-[20px] p-[22px] mt-8">
            <h2 className="font-heading font-bold text-[19px] flex justify-between items-baseline gap-2.5">
              Finish setting up
              <span className="text-[#6E6E6E] text-[14px] font-normal">{doneCount} of {TODO.length} complete</span>
            </h2>
            <p className="text-[#6E6E6E] text-[14px]">A few steps to get your first donation.</p>
            <div className="mt-3.5 mb-2"><AnimatedBar pct={checklistPct} /></div>

            {TODO.map((item, i) => (
              <div key={i} className="flex items-center gap-3.5 py-3.5 border-t border-[#EBEBEB]">
                <span className={`w-[26px] h-[26px] rounded-full border-2 shrink-0 grid place-items-center text-[12px] font-semibold
                  ${item.done ? 'bg-[#CCF88E] border-[#CCF88E] text-[#1A1A1A]' : 'border-[#EBEBEB] text-[#6E6E6E]'}`}>
                  {item.done ? <CheckDark /> : i + 1}
                </span>
                <div className="flex-1">
                  <b className={`block font-semibold ${item.done ? 'line-through text-[#aaa]' : ''}`}>{item.title}</b>
                  <span className="text-[#6E6E6E] text-[14px]">{item.desc}</span>
                </div>
                {!item.done && item.cta && (
                  <Link href={item.href}
                    className="inline-flex items-center font-semibold text-[14px] bg-white border-[1.5px] border-[#1A1A1A] rounded-full px-4 py-[7px] hover:bg-[#F6F6F6] transition-colors shrink-0">
                    {item.cta}
                  </Link>
                )}
              </div>
            ))}
          </section>
        )}

        {/* ── STATS ── */}
        <section className="grid grid-cols-2 md:grid-cols-4 mt-7 border-b border-[#EBEBEB]">
          {stats.map(([label, value, sub], i) => (
            <div key={i} className={`pb-6 ${i > 0 ? 'pl-5 border-l border-[#EBEBEB]' : ''} ${i === 2 ? 'max-[900px]:pl-0 max-[900px]:border-l-0' : ''}`}>
              <small className="text-[#6E6E6E] text-[13px] block">{label}</small>
              <div className="font-heading font-bold text-[28px] leading-[1.2] mt-0.5">{value}</div>
              <em className="not-italic text-[13px] text-[#6E6E6E]">{sub}</em>
            </div>
          ))}
        </section>

        {/* ── TWO-COLUMN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 mt-9 items-start max-[900px]:gap-9">

          {/* LEFT */}
          <div>
            {/* Campaigns */}
            <section>
              <h2 className="font-heading font-bold text-[19px] flex justify-between items-baseline gap-2.5 mb-1.5">
                Campaigns
                <Link href="#" className="font-normal text-[14px] text-[#1A1A1A] hover:underline">View all</Link>
              </h2>

              {camps.length > 0 ? camps.map((c, i) => {
                const pct = Math.round((c.raised / c.goal) * 100);
                return (
                  <div key={i} className="grid grid-cols-[52px_1fr_auto] gap-4 items-center py-4 border-b border-[#EBEBEB]">
                    <div className="w-[52px] h-[52px] rounded-[14px] bg-[#F6F6F6] grid place-items-center text-[22px]">{c.icon}</div>
                    <div>
                      <b className="block font-semibold text-[15px]">{c.title}</b>
                      <div className="h-[6px] rounded-full bg-[#EBEBEB] overflow-hidden my-[7px]">
                        <div className="h-full bg-[#B6EA6C] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <small className="text-[#6E6E6E] text-[13px]">{fmt(c.raised)} of {fmt(c.goal)} ETB · {pct}%</small>
                    </div>
                    <span className="text-[12px] font-semibold px-3 py-[3px] rounded-full bg-[#CCF88E] border border-[#CCF88E] whitespace-nowrap">Live</span>
                  </div>
                );
              }) : (
                <div className="border-[1.5px] border-dashed border-[#c8c8c8] rounded-[18px] py-8 px-5 text-center text-[#6E6E6E] mt-3">
                  <b className="block text-[#1A1A1A] font-heading font-bold text-[18px] mb-1">No campaigns yet</b>
                  Tell your first story with a video, documents and a goal in Birr.<br />
                  <Link href="/dashboard/campaigns/new"
                    className="inline-flex mt-4 font-semibold text-[15px] bg-[#CCF88E] border-[1.5px] border-[#CCF88E] rounded-full px-5 py-2.5 hover:bg-[#B6EA6C] transition-colors">
                    Create your first campaign
                  </Link>
                </div>
              )}
            </section>

            {/* Recent donations */}
            <section className="mt-10">
              <h2 className="font-heading font-bold text-[19px] flex justify-between items-baseline gap-2.5 mb-1.5">
                Recent donations
                <Link href="#" className="font-normal text-[14px] text-[#1A1A1A] hover:underline">See all</Link>
              </h2>

              {dons.length > 0 ? dons.map((don, i) => (
                <div key={i} className="flex justify-between items-center gap-2.5 py-3 border-b border-[#EBEBEB]">
                  <div>
                    <b className="block font-semibold text-[15px]">{don.name}</b>
                    <small className="text-[#6E6E6E] text-[13px]">{don.method} · {don.when}</small>
                  </div>
                  <strong className="font-heading font-bold text-[16px]">+{don.amt} ETB</strong>
                </div>
              )) : (
                <div className="border-[1.5px] border-dashed border-[#c8c8c8] rounded-[18px] py-8 px-5 text-center text-[#6E6E6E] mt-3">
                  <b className="block text-[#1A1A1A] font-heading font-bold text-[18px] mb-1">Donations will show up here</b>
                  Once a campaign is live, every gift appears in real time.
                </div>
              )}
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="flex flex-col gap-9">

            {/* Subscription card */}
            <section className="bg-[#CCF88E] rounded-[24px] p-[26px]">
              <div className="flex justify-between items-start gap-2.5">
                <h2 className="font-heading font-bold text-[19px] m-0">Subscription</h2>
                <span className="text-[12px] font-semibold bg-[#1A1A1A] text-white rounded-full px-3 py-[3px]">Active</span>
              </div>
              <div className="font-heading font-bold text-[30px] leading-[1.1] mt-1.5">
                {planLabel} <small className="font-sans font-normal text-[14px]">· {planPrice} ETB / {planPer}</small>
              </div>
              <div className="mt-3.5 mb-2"><AnimatedBar pct={subPct} dark /></div>
              <p className="text-[14px] m-0">
                <b>{isUnlimited ? `${postsUsed} posts live` : `${postsUsed} of ${planCap} campaign posts used`}</b>
                {isUnlimited && ' · unlimited'}
              </p>
              <p className="text-[14px] mt-0.5 mb-0">Renews on {planRenews}</p>

              {isUnlimited ? (
                <a href="#" className="inline-flex mt-3.5 font-semibold text-[14px] bg-[#1A1A1A] text-white rounded-full px-4 py-[7px] hover:bg-black transition-colors">
                  Manage subscription
                </a>
              ) : (
                <>
                  <p className="text-[14px] mt-3.5 mb-0">Switch to yearly for unlimited posts at 10,000 ETB a year. That saves 26,000 ETB.</p>
                  <a href="#" className="inline-flex mt-3.5 font-semibold text-[14px] bg-[#1A1A1A] text-white rounded-full px-4 py-[7px] hover:bg-black transition-colors">
                    Switch to yearly
                  </a>
                </>
              )}
            </section>

            {/* Verification */}
            <section>
              <h2 className="font-heading font-bold text-[19px] mb-3.5">Verification</h2>
              <ul className="list-none p-0 m-0">
                {verSteps.map((step, i) => {
                  const cls = getStepCls(i);
                  return (
                    <li key={i} className="flex gap-3 pb-[18px] relative text-[14px]">
                      {i < verSteps.length - 1 && (
                        <span className="absolute left-[11px] top-[26px] bottom-0.5 w-[2px] bg-[#EBEBEB]" aria-hidden="true" />
                      )}
                      <span className={`w-6 h-6 rounded-full shrink-0 grid place-items-center text-[11px] font-semibold border-2 z-[1]
                        ${cls === 'ok'  ? 'bg-[#CCF88E] border-[#CCF88E]' :
                          cls === 'now' ? 'bg-white border-[#1A1A1A]' :
                                         'bg-white border-[#EBEBEB] text-[#6E6E6E]'}`}>
                        {cls === 'ok' ? <CheckDark /> : i + 1}
                      </span>
                      <div>
                        <span className="font-medium">{step.label}</span>
                        <small className="text-[#6E6E6E] block">{step.sub}</small>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {orgRev ? (
                <p className="text-[#6E6E6E] text-[14px]">We will notify you as soon as the review is done.</p>
              ) : (
                <a href="#" className="inline-flex font-semibold text-[14px] bg-[#CCF88E] border-[1.5px] border-[#CCF88E] rounded-full px-4 py-[7px] hover:bg-[#B6EA6C] transition-colors">
                  Upload documents
                </a>
              )}
            </section>

            {/* Team */}
            <section>
              <h2 className="font-heading font-bold text-[19px] flex justify-between items-baseline gap-2.5 mb-1.5">
                Team
                <Link href="#" className="font-normal text-[14px] text-[#1A1A1A] hover:underline">Manage</Link>
              </h2>

              {team.map((m, i) => (
                <div key={i} className="flex items-center gap-3 py-3 border-b border-[#EBEBEB] last:border-0">
                  <div className="w-9 h-9 rounded-full bg-[#F6F6F6] grid place-items-center font-semibold text-[13px] shrink-0">{m.initials}</div>
                  <div>
                    <b className="block font-semibold text-[15px]">{m.name}</b>
                    <small className="text-[#6E6E6E] text-[13px]">{m.role}</small>
                  </div>
                </div>
              ))}

              <a href="#" className="inline-flex mt-3.5 font-semibold text-[14px] bg-white border-[1.5px] border-[#1A1A1A] rounded-full px-4 py-[7px] hover:bg-[#F6F6F6] transition-colors">
                Invite teammate
              </a>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}