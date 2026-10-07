'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface AdminDecision {
  st: 'live' | 'rejected' | 'changes' | 'review';
  reason?: string;
  at: number;
}

interface AdminActivityLog {
  t: number;
  m: string;
}

interface AdminStorageData {
  d: Record<string, AdminDecision>;
  p: Record<string, boolean>; // paused state
  s: Record<string, boolean>; // suspended users
  log: AdminActivityLog[];
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  joined: number;
}

interface AdminCampaign {
  id: string;
  t: string;
  cat: string;
  goal: number;
  o: string; // user id
  st: 'live' | 'review' | 'paused' | 'rejected' | 'changes';
  days: number;
  raised?: number;
  acct?: {
    t: string; // e.g. Telebirr, Commercial Bank of Ethiopia
    n: string; // account number
    h: string; // account holder
  } | null;
  idName?: string;
  photo?: string;
  local?: number;
}

interface AdminDonation {
  id: string;
  c: string; // campaign id
  a: number; // amount
  tip: number;
  pm: string;
  day: number;
}

// Pseudo-random deterministic generator for consistent sample data
function createSeededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const R = createSeededRandom(7);
const pick = <T,>(arr: T[]): T => arr[Math.floor(R() * arr.length)];

const USER_NAMES = [
  'Abebe Kebede', 'Selam Tesfaye', 'Dawit Alemu', 'Meron Haile', 'Yonas Bekele',
  'Hana Girma', 'Tigist Mulugeta', 'Samuel Assefa', 'Rahel Desta', 'Biruk Tadesse'
];

const INITIAL_USERS: AdminUser[] = USER_NAMES.map((n, i) => ({
  id: 'u' + i,
  name: n,
  email: n.split(' ')[0].toLowerCase() + '@example.com',
  joined: 12 + i * 29
}));

const INITIAL_CAMPAIGNS_RAW: Array<[string, string, number, number, 'live' | 'review' | 'paused']> = [
  ['Heart surgery for Dawit’s mother', 'Medical', 150000, 2, 'live'],
  ['University tuition for Selam', 'Education', 60000, 1, 'live'],
  ['Rebuild Meron’s family shop', 'Business', 200000, 3, 'live'],
  ['Flood relief for families in Dire Dawa', 'Emergencies', 500000, 0, 'live'],
  ['Medical bills for Yonas', 'Medical', 90000, 4, 'live'],
  ['Clean water for Hana’s village school', 'Community', 120000, 5, 'review'],
  ['Funeral costs for Tigist’s father', 'Funerals and memorials', 40000, 6, 'review'],
  ['Tools for Samuel’s workshop', 'Business', 75000, 7, 'review'],
  ['Wheelchairs through Cheshire Services', 'Medical', 100000, 8, 'paused']
];

const INITIAL_CAMPAIGNS: AdminCampaign[] = INITIAL_CAMPAIGNS_RAW.map((c, i) => ({
  id: 'c' + i,
  t: c[0],
  cat: c[1],
  goal: c[2],
  o: 'u' + c[3],
  st: c[4],
  days: c[4] === 'review' ? [1, 3, 4][i - 5] || 2 : 20,
}));

INITIAL_CAMPAIGNS.filter(c => c.st === 'review').forEach((c, i) => {
  const u = INITIAL_USERS.find(x => x.id === c.o);
  c.acct = {
    t: ['Telebirr', 'Commercial Bank of Ethiopia', 'Telebirr'][i] || 'Telebirr',
    n: ['0911223344', '1000123456789', '0922334455'][i] || '0911223344',
    h: i === 2 ? 'Samuel A.' : (u ? u.name : 'Unknown')
  };
  c.idName = u ? u.name : '';
});

const liveCamps = INITIAL_CAMPAIGNS.filter(c => c.st === 'live');
liveCamps.forEach(c => {
  c.raised = Math.round(c.goal * (0.1 + R() * 0.7));
});

const PAYMENT_METHODS = ['Telebirr', 'CBE Birr', 'Card (Chapa)'];
const INITIAL_DONATIONS: AdminDonation[] = Array.from({ length: 140 }, (_, i) => {
  const c = pick(liveCamps);
  const a = pick([100, 200, 250, 500, 500, 1000, 2000, 5000]);
  return {
    id: 'd' + i,
    c: c.id,
    a,
    tip: Math.round(a * pick([0, 0.05, 0.05, 0.1])),
    pm: pick(PAYMENT_METHODS),
    day: Math.floor(R() * 14)
  };
});

const TG_LABELS: Record<string, string> = {
  live: 'Live',
  review: 'In review',
  paused: 'Paused',
  rejected: 'Rejected',
  changes: 'Changes requested',
  approved: 'Approved',
  ok: 'Verified',
  pending: 'Pending',
  suspended: 'Suspended'
};

const norm = (s: string) => String(s || '').toLowerCase().replace(/[^a-z]/g, '');
const same = (a: string | undefined, b: string | undefined) => !!a && norm(a) === norm(b);
const f0 = (n: number) => Math.round(n).toLocaleString('en-US');
const dt = (d: number) => new Date(Date.now() - d * 864e5).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

export default function AdminPage() {
  const [tab, setTab] = useState<'overview' | 'reviews' | 'campaigns' | 'users' | 'donations'>('overview');
  const [flt, setFlt] = useState<string>('review');
  const [q, setQ] = useState<string>('');
  
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_USERS);
  const [campaigns, setCampaigns] = useState<AdminCampaign[]>(INITIAL_CAMPAIGNS);
  const [donations] = useState<AdminDonation[]>(INITIAL_DONATIONS);

  const [adminData, setAdminData] = useState<AdminStorageData>({
    d: {},
    p: {},
    s: {},
    log: []
  });

  // Modal State
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);
  const [reasonInput, setReasonInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ethiofund-admin') || localStorage.getItem('wegen-admin');
      if (saved) {
        setAdminData(JSON.parse(saved));
      }

      // Check local campaign from creator
      const lc = localStorage.getItem('ethiofund-campaign') || localStorage.getItem('wegen-campaign');
      if (lc) {
        const parsedLc = JSON.parse(lc);
        const p = JSON.parse(localStorage.getItem('ethiofund-profile') || '{}');
        const us = JSON.parse(localStorage.getItem('ethiofund-user') || '{}');
        const newUid = 'u' + INITIAL_USERS.length;

        const localUser: AdminUser = {
          id: newUid,
          name: (us.email || 'Creator User').split('@')[0],
          email: us.email || 'creator@wegen.et',
          joined: 0
        };

        const localCampaign: AdminCampaign = {
          id: 'c-local',
          t: parsedLc.title,
          cat: parsedLc.cat || 'Medical',
          goal: parsedLc.goal || 100000,
          o: newUid,
          st: 'review',
          days: 0,
          acct: p.acct || null,
          idName: '',
          photo: p.id || '',
          local: 1
        };

        // Guard against duplicate entries (React Strict Mode fires effects twice in dev)
        setUsers(prev => prev.some(u => u.id === newUid) ? prev : [localUser, ...prev]);
        setCampaigns(prev => prev.some(c => c.id === 'c-local') ? prev : [localCampaign, ...prev]);
      }
    } catch (e) {
      // Ignore parse errors
    }
  }, []);


  const saveAdminData = (updated: AdminStorageData) => {
    setAdminData(updated);
    try {
      localStorage.setItem('ethiofund-admin', JSON.stringify(updated));
      localStorage.setItem('wegen-admin', JSON.stringify(updated));
    } catch (e) {}
  };

  const getStatus = (c: AdminCampaign) => {
    if (adminData.d[c.id]) return adminData.d[c.id].st;
    if (adminData.p[c.id]) return 'paused';
    return c.st;
  };

  const getUser = (id: string) => users.find(u => u.id === id) || { id, name: 'Unknown User', email: 'unknown@wegen.et', joined: 0 };
  const getCampaign = (id: string) => campaigns.find(c => c.id === id);

  // Stats calculation
  const totalDonations = donations.reduce((acc, d) => acc + d.a, 0);
  const totalTips = donations.reduce((acc, d) => acc + d.tip, 0);
  const pendingReviews = campaigns.filter(c => getStatus(c) === 'review');
  const oldPendingReviews = pendingReviews.filter(c => c.days >= 3).length;

  const donationsByDay = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const targetDay = 13 - i;
      return donations.filter(d => d.day === targetDay).reduce((acc, d) => acc + d.a, 0);
    });
  }, [donations]);

  const maxDailyDonation = Math.max(...donationsByDay, 1);

  const topCategories = useMemo(() => {
    const cats: Record<string, number> = {};
    donations.forEach(d => {
      const camp = getCampaign(d.c);
      const cat = camp?.cat || 'General';
      cats[cat] = (cats[cat] || 0) + d.a;
    });
    return Object.entries(cats).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [donations, campaigns]);

  const maxCategoryAmount = topCategories[0] ? topCategories[0][1] : 1;

  // Actions
  const togglePause = (id: string) => {
    const isPaused = !adminData.p[id];
    const camp = getCampaign(id);
    const updated: AdminStorageData = {
      ...adminData,
      p: { ...adminData.p, [id]: isPaused },
      log: [
        { t: Date.now(), m: `${isPaused ? 'Paused' : 'Resumed'} “${camp?.t || id}”` },
        ...adminData.log
      ]
    };
    saveAdminData(updated);
  };

  const toggleSuspendUser = (id: string) => {
    const isSuspended = !adminData.s[id];
    const u = getUser(id);
    const updated: AdminStorageData = {
      ...adminData,
      s: { ...adminData.s, [id]: isSuspended },
      log: [
        { t: Date.now(), m: `${isSuspended ? 'Suspended' : 'Restored'} ${u.name}` },
        ...adminData.log
      ]
    };
    saveAdminData(updated);
  };

  const openReviewModal = (id: string) => {
    setActiveReviewId(id);
    setCheck1(false);
    setCheck2(false);
    setCheck3(false);
    setReasonInput('');
    setErrorMsg('');
  };

  const submitDecision = (s: 'live' | 'rejected' | 'changes') => {
    if (!activeReviewId) return;
    const trimmedReason = reasonInput.trim();
    if (s !== 'live' && trimmedReason.length < 5) {
      setErrorMsg('Add a short reason so the applicant knows what to fix.');
      return;
    }

    const camp = getCampaign(activeReviewId);
    const label = s === 'live' ? 'Approved' : s === 'rejected' ? 'Rejected' : 'Requested changes on';

    const updated: AdminStorageData = {
      ...adminData,
      d: {
        ...adminData.d,
        [activeReviewId]: { st: s, reason: trimmedReason, at: Date.now() }
      },
      log: [
        { t: Date.now(), m: `${label} “${camp?.t || activeReviewId}”` },
        ...adminData.log
      ]
    };

    saveAdminData(updated);
    setActiveReviewId(null);
  };

  const activeReviewCampaign = activeReviewId ? getCampaign(activeReviewId) : null;
  const activeReviewUser = activeReviewCampaign ? getUser(activeReviewCampaign.o) : null;
  const activeAcct = activeReviewCampaign?.acct;
  const activeNameMatch = activeAcct && activeReviewCampaign?.idName ? same(activeAcct.h, activeReviewCampaign.idName) : null;
  const activeDecision = activeReviewId ? adminData.d[activeReviewId] : null;

  return (
    <>
      {/* Exact CSS from provided artifact */}
      <style jsx global>{`
        :root {
          --ink: #1A1A1A;
          --mute: #6E6E6E;
          --line: #EBEBEB;
          --soft: #F6F6F6;
          --lime: #CCF88E;
          --lime-deep: #B6EA6C;
          --err: #B3261E;
          --warn: #8A5A00;
          --display: 'Bricolage Grotesque', 'Noto Sans Ethiopic', system-ui, sans-serif;
          --body: 'Figtree', 'Noto Sans Ethiopic', system-ui, sans-serif;
        }
        .admin-root {
          background: var(--soft);
          color: var(--ink);
          font: 15px/1.5 var(--body);
          min-height: 100vh;
        }
        .num {
          font-family: var(--display);
          letter-spacing: -0.02em;
        }
        .app-layout {
          display: grid;
          grid-template-columns: 230px minmax(0, 1fr);
          min-height: 100vh;
        }
        .sb {
          background: #fff;
          border-right: 1px solid var(--line);
          padding: 22px 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }
        .sb-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          font: 700 18px var(--display);
          padding: 0 10px 14px;
        }
        .sb-logo i {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--lime);
          border: 2px solid var(--ink);
          display: inline-block;
        }
        .sb-logo em {
          font: 600 11px var(--body);
          background: var(--ink);
          color: #fff;
          border-radius: 6px;
          padding: 1px 7px;
          font-style: normal;
        }
        .sb-btn {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: none;
          border: 0;
          border-radius: 12px;
          padding: 10px 12px;
          cursor: pointer;
          text-align: left;
          font-size: 15px;
          color: var(--ink);
          transition: background 0.15s ease;
        }
        .sb-btn:hover {
          background: var(--soft);
        }
        .sb-btn.on {
          background: var(--lime);
          font-weight: 600;
        }
        .sb-btn b {
          background: var(--ink);
          color: #fff;
          border-radius: 99px;
          font-size: 12px;
          padding: 0 8px;
        }
        .sb-footnote {
          margin-top: auto;
          color: var(--mute);
          font-size: 12px;
          padding: 10px;
          line-height: 1.4;
        }
        .main-pane {
          padding: 32px 36px 60px;
          min-width: 0;
        }
        .main-pane > h1 {
          font-size: 30px;
          margin-bottom: 4px;
          font-weight: 700;
        }
        .sub {
          color: var(--mute);
          margin-bottom: 22px;
        }
        .kp {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 14px;
          margin-bottom: 20px;
        }
        .k {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: 16px 18px;
          text-align: left;
          cursor: default;
        }
        button.k {
          cursor: pointer;
        }
        button.k:hover {
          border-color: var(--ink);
        }
        .k small {
          color: var(--mute);
          display: block;
        }
        .k b {
          font: 700 26px var(--display);
          display: block;
          margin: 4px 0 0;
        }
        .k.al {
          background: #FFF3C9;
          border-color: #F0DC8C;
        }
        .g2 {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 14px;
        }
        .pn {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: 18px 20px;
          margin-bottom: 14px;
        }
        .pn h2 {
          font-size: 17px;
          margin-bottom: 12px;
          font-weight: 700;
        }
        .bars {
          display: grid;
          gap: 10px;
        }
        .bars div {
          display: grid;
          grid-template-columns: 110px 1fr 70px;
          gap: 10px;
          align-items: center;
          font-size: 14px;
        }
        .bars i {
          display: block;
          height: 10px;
          border-radius: 6px;
          background: var(--ink);
        }
        .lg {
          list-style: none;
          padding: 0;
          display: grid;
          gap: 10px;
          font-size: 14px;
        }
        .lg span {
          color: var(--mute);
          margin-left: 8px;
        }
        .tw {
          overflow-x: auto;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 18px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
          min-width: 620px;
        }
        th {
          text-align: left;
          color: var(--mute);
          font-weight: 500;
          padding: 12px 16px;
          border-bottom: 1px solid var(--line);
          white-space: nowrap;
        }
        td {
          padding: 12px 16px;
          border-bottom: 1px solid var(--line);
          vertical-align: middle;
        }
        tr:last-child td {
          border: 0;
        }
        tr[data-r] {
          cursor: pointer;
        }
        tr[data-r]:hover td {
          background: var(--soft);
        }
        .ct {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 14px;
          align-items: center;
        }
        .ct input, .ct select {
          border: 1px solid #cfcfcf;
          border-radius: 99px;
          padding: 8px 16px;
          background: #fff;
          outline: none;
        }
        .f {
          border: 1px solid #cfcfcf;
          background: #fff;
          border-radius: 99px;
          padding: 7px 16px;
          cursor: pointer;
          font-size: 14px;
        }
        .f.on {
          background: var(--ink);
          color: #fff;
          border-color: var(--ink);
        }
        .tg {
          display: inline-block;
          border-radius: 99px;
          padding: 1px 10px;
          font-size: 12px;
          font-weight: 600;
          background: var(--soft);
          white-space: nowrap;
        }
        .tg.live, .tg.approved, .tg.ok {
          background: var(--lime);
        }
        .tg.review, .tg.pending {
          background: #FFF3C9;
        }
        .tg.rejected, .tg.paused, .tg.suspended {
          background: #FBE0DD;
          color: var(--err);
        }
        .tg.changes {
          background: #E5F6F8;
        }
        .pr {
          height: 6px;
          border-radius: 6px;
          background: var(--line);
          width: 110px;
          overflow: hidden;
          margin-top: 4px;
        }
        .pr i {
          display: block;
          height: 100%;
          background: var(--ink);
        }
        .btn {
          background: var(--lime);
          border: 1px solid var(--lime);
          border-radius: 99px;
          padding: 9px 20px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .btn:hover {
          background: var(--lime-deep);
        }
        .btn.d {
          background: var(--ink);
          color: #fff;
          border-color: var(--ink);
        }
        .btn.o {
          background: none;
          border-color: var(--ink);
        }
        .btn.s {
          padding: 4px 14px;
          font-size: 13px;
        }
        .btn:disabled {
          background: var(--line);
          border-color: var(--line);
          color: #9a9a9a;
          cursor: not-allowed;
        }
        .wn {
          color: var(--warn);
          font-weight: 600;
        }
        .emp {
          text-align: center;
          color: var(--mute);
          padding: 36px 12px;
        }
        @media(max-width: 900px) {
          .app-layout {
            grid-template-columns: 1fr;
          }
          .sb {
            flex-direction: row;
            overflow-x: auto;
            height: auto;
            position: static;
            padding: 12px;
            align-items: center;
          }
          .sb-logo {
            padding: 0 8px;
          }
          .sb-footnote {
            display: none;
          }
          .sb-btn {
            flex: none;
            gap: 8px;
          }
          .main-pane {
            padding: 22px 16px 50px;
          }
          .g2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="admin-root">
        <div className="app-layout">
          
          {/* SIDEBAR NAVIGATION */}
          <nav className="sb" aria-label="Admin Navigation">
            <Link href="/" className="sb-logo focus-visible:outline-none">
              <i></i>
              <span>WeGen</span>
              <em>Admin</em>
            </Link>

            <button
              type="button"
              onClick={() => { setTab('overview'); setQ(''); setFlt('all'); }}
              className={`sb-btn ${tab === 'overview' ? 'on' : ''}`}
            >
              <span>Overview</span>
            </button>

            <button
              type="button"
              onClick={() => { setTab('reviews'); setQ(''); setFlt('review'); }}
              className={`sb-btn ${tab === 'reviews' ? 'on' : ''}`}
            >
              <span>Reviews</span>
              {pendingReviews.length > 0 && <b>{pendingReviews.length}</b>}
            </button>

            <button
              type="button"
              onClick={() => { setTab('campaigns'); setQ(''); setFlt('all'); }}
              className={`sb-btn ${tab === 'campaigns' ? 'on' : ''}`}
            >
              <span>Campaigns</span>
            </button>

            <button
              type="button"
              onClick={() => { setTab('users'); setQ(''); setFlt('all'); }}
              className={`sb-btn ${tab === 'users' ? 'on' : ''}`}
            >
              <span>Users</span>
            </button>

            <button
              type="button"
              onClick={() => { setTab('donations'); setQ(''); setFlt('all'); }}
              className={`sb-btn ${tab === 'donations' ? 'on' : ''}`}
            >
              <span>Donations</span>
            </button>

            <small className="sb-footnote">
              Sensitive data. Every ID view should be logged on your server.
            </small>
          </nav>

          {/* MAIN VIEW CONTENT */}
          <main className="main-pane">
            
            {/* 1. OVERVIEW VIEW */}
            {tab === 'overview' && (
              <div>
                <h1 className="num">Overview</h1>
                <p className="sub">Last 14 days. Sample data until your backend is connected.</p>

                {/* KPI Cards */}
                <div className="kp">
                  <div className="k">
                    <small>Donations</small>
                    <b>{f0(totalDonations)} ETB</b>
                  </div>
                  <div className="k">
                    <small>Tips to WeGen</small>
                    <b>{f0(totalTips)} ETB</b>
                  </div>
                  <div className="k">
                    <small>Donation count</small>
                    <b>{donations.length}</b>
                  </div>
                  <div className="k">
                    <small>Live campaigns</small>
                    <b>{campaigns.filter(c => getStatus(c) === 'live').length}</b>
                  </div>
                  <div className="k">
                    <small>Users</small>
                    <b>{users.length}</b>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setTab('reviews'); setFlt('review'); }}
                    className={`k ${oldPendingReviews ? 'al' : ''}`}
                  >
                    <small>Waiting for review</small>
                    <b>{pendingReviews.length}</b>
                    {oldPendingReviews > 0 && <small>{oldPendingReviews} waiting 3+ days</small>}
                  </button>
                </div>

                {/* 2-column Charts Grid */}
                <div className="g2">
                  {/* Donations per day SVG chart */}
                  <div className="pn">
                    <h2>Donations per day (ETB)</h2>
                    <svg viewBox="0 0 420 150" width="100%" role="img" aria-label="Donations per day">
                      {donationsByDay.map((val, idx) => {
                        const h = (val / maxDailyDonation) * 120;
                        const y = 130 - h;
                        const x = idx * 30 + 4;
                        return (
                          <rect key={idx} x={x} y={y} width="22" height={h} rx="4" fill="#1A1A1A">
                            <title>{`${dt(13 - idx)}: ${f0(val)} ETB`}</title>
                          </rect>
                        );
                      })}
                      <text x="4" y="148" fontSize="10" fill="#6E6E6E">{dt(13)}</text>
                      <text x="416" y="148" fontSize="10" fill="#6E6E6E" textAnchor="end">{dt(0)}</text>
                    </svg>
                  </div>

                  {/* Top categories bars */}
                  <div className="pn">
                    <h2>Top categories</h2>
                    <div className="bars">
                      {topCategories.map(([catName, amtVal]) => (
                        <div key={catName}>
                          <span>{catName}</span>
                          <i style={{ width: `${(amtVal / maxCategoryAmount) * 100}%` }}></i>
                          <span>{f0(amtVal)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent admin activity */}
                <div className="pn">
                  <h2>Recent admin activity</h2>
                  {adminData.log.length > 0 ? (
                    <ul className="lg">
                      {adminData.log.slice(0, 6).map((logItem, idx) => (
                        <li key={idx}>
                          {logItem.m}
                          <span>
                            {new Date(logItem.t).toLocaleString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="emp" style={{ padding: '8px 0' }}>No decisions yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* 2. REVIEWS VIEW */}
            {tab === 'reviews' && (
              <div>
                <h1 className="num">Reviews</h1>
                <p className="sub">Check each payout account and national ID before a campaign goes live.</p>

                {/* Filter Pills */}
                <div className="ct">
                  {[
                    ['review', 'Pending'],
                    ['changes', 'Changes requested'],
                    ['live', 'Approved'],
                    ['rejected', 'Rejected']
                  ].map(([fKey, fLabel]) => {
                    const count = campaigns.filter(c => c.st === 'review' && getStatus(c) === fKey).length;
                    return (
                      <button
                        key={fKey}
                        type="button"
                        onClick={() => setFlt(fKey)}
                        className={`f ${flt === fKey ? 'on' : ''}`}
                      >
                        {fLabel} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Reviews Table */}
                <div className="tw">
                  <table>
                    <thead>
                      <tr>
                        <th>Applicant</th>
                        <th>Campaign</th>
                        <th>Waiting</th>
                        <th>Account</th>
                        <th>ID photo</th>
                        <th>Name check</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const reviewRows = campaigns
                          .filter(c => c.st === 'review')
                          .filter(c => {
                            const currentSt = getStatus(c);
                            return flt === 'live' ? currentSt === 'live' : currentSt === flt;
                          })
                          .sort((a, b) => b.days - a.days);

                        if (reviewRows.length === 0) {
                          return (
                            <tr>
                              <td colSpan={7} className="emp">Nothing here.</td>
                            </tr>
                          );
                        }

                        return reviewRows.map(c => {
                          const u = getUser(c.o);
                          const isMatch = c.acct && c.idName ? same(c.acct.h, c.idName) : null;
                          return (
                            <tr key={c.id} data-r={c.id} onClick={() => openReviewModal(c.id)}>
                              <td><b>{u.name}</b></td>
                              <td>{c.t}</td>
                              <td>{c.days ? `${c.days} d` : 'Today'}</td>
                              <td>
                                {c.acct ? '✓' : <span className="wn">Missing</span>}
                              </td>
                              <td>
                                {c.local ? (c.photo ? '✓' : <span className="wn">Missing</span>) : '✓'}
                              </td>
                              <td>
                                {isMatch === null ? '—' : isMatch ? '✓' : <span className="wn">Differs</span>}
                              </td>
                              <td>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); openReviewModal(c.id); }}
                                  className="btn s"
                                >
                                  Review
                                </button>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. CAMPAIGNS VIEW */}
            {tab === 'campaigns' && (
              <div>
                <h1 className="num">Campaigns</h1>
                <p className="sub">{campaigns.length} campaigns</p>

                <div className="ct">
                  <input
                    placeholder="Search title or owner"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                  <select
                    value={flt}
                    onChange={(e) => setFlt(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="live">Live</option>
                    <option value="review">In review</option>
                    <option value="paused">Paused</option>
                    <option value="rejected">Rejected</option>
                    <option value="changes">Changes requested</option>
                  </select>
                </div>

                <div className="tw">
                  <table>
                    <thead>
                      <tr>
                        <th>Campaign</th>
                        <th>Owner</th>
                        <th>Status</th>
                        <th>Raised</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const campRows = campaigns.filter(c => {
                          const currentSt = getStatus(c);
                          const matchesFlt = flt === 'all' || currentSt === flt;
                          const matchesQ = (c.t + getUser(c.o).name).toLowerCase().includes(q.toLowerCase());
                          return matchesFlt && matchesQ;
                        });

                        if (campRows.length === 0) {
                          return (
                            <tr>
                              <td colSpan={5} className="emp">No campaigns found.</td>
                            </tr>
                          );
                        }

                        return campRows.map(c => {
                          const currentSt = getStatus(c);
                          const pct = c.raised ? Math.round((c.raised / c.goal) * 100) : 0;
                          return (
                            <tr key={c.id}>
                              <td>
                                <b>{c.t}</b>
                                <br />
                                <small style={{ color: 'var(--mute)' }}>{c.cat}</small>
                              </td>
                              <td>{getUser(c.o).name}</td>
                              <td>
                                <span className={`tg ${currentSt}`}>
                                  {TG_LABELS[currentSt] || currentSt}
                                </span>
                              </td>
                              <td>
                                {c.raised ? `${f0(c.raised)} / ${f0(c.goal)} ETB` : `${f0(c.goal)} ETB goal`}
                                <div className="pr">
                                  <i style={{ width: `${pct}%` }}></i>
                                </div>
                              </td>
                              <td>
                                {(currentSt === 'live' || currentSt === 'paused') && (
                                  <button
                                    type="button"
                                    onClick={() => togglePause(c.id)}
                                    className="btn o s"
                                  >
                                    {currentSt === 'live' ? 'Pause' : 'Resume'}
                                  </button>
                                )}
                                {currentSt === 'review' && (
                                  <button
                                    type="button"
                                    onClick={() => openReviewModal(c.id)}
                                    className="btn s"
                                  >
                                    Review
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. USERS VIEW */}
            {tab === 'users' && (
              <div>
                <h1 className="num">Users</h1>
                <p className="sub">{users.length} accounts</p>

                <div className="ct">
                  <input
                    placeholder="Search name or email"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>

                <div className="tw">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Joined</th>
                        <th>Campaigns</th>
                        <th>Verification</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .filter(u => (u.name + u.email).toLowerCase().includes(q.toLowerCase()))
                        .map(u => {
                          const userCamps = campaigns.filter(c => c.o === u.id);
                          const isVerified = userCamps.some(c => getStatus(c) === 'live');
                          const isPending = userCamps.some(c => getStatus(c) === 'review');
                          const isSuspended = adminData.s[u.id];

                          return (
                            <tr key={u.id}>
                              <td><b>{u.name}</b></td>
                              <td>{u.email}</td>
                              <td>{u.joined ? dt(u.joined) : 'Today'}</td>
                              <td>{userCamps.length}</td>
                              <td>
                                {isVerified ? (
                                  <span className="tg ok">Verified</span>
                                ) : isPending ? (
                                  <span className="tg pending">Pending</span>
                                ) : (
                                  '—'
                                )}
                              </td>
                              <td>
                                {isSuspended ? (
                                  <span className="tg suspended">Suspended</span>
                                ) : (
                                  'Active'
                                )}
                              </td>
                              <td>
                                <button
                                  type="button"
                                  onClick={() => toggleSuspendUser(u.id)}
                                  className="btn o s"
                                >
                                  {isSuspended ? 'Restore' : 'Suspend'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. DONATIONS VIEW */}
            {tab === 'donations' && (
              <div>
                <h1 className="num">Donations</h1>
                <p className="sub">Latest 40 of {donations.length}</p>

                <div className="tw">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Campaign</th>
                        <th>Amount</th>
                        <th>Tip</th>
                        <th>Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...donations]
                        .sort((a, b) => a.day - b.day)
                        .slice(0, 40)
                        .map(d => {
                          const camp = getCampaign(d.c);
                          return (
                            <tr key={d.id}>
                              <td>{dt(d.day)}</td>
                              <td>{camp?.t || 'Fundraiser'}</td>
                              <td>{f0(d.a)} ETB</td>
                              <td>{f0(d.tip)} ETB</td>
                              <td>{d.pm}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </main>
        </div>

        {/* REVIEW VERIFICATION MODAL DIALOG */}
        {activeReviewId && activeReviewCampaign && activeReviewUser && (
          <div
            className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={() => setActiveReviewId(null)}
          >
            <div
              className="bg-white rounded-[24px] w-full max-w-[760px] p-6 sm:p-7 shadow-2xl my-auto text-[#1A1A1A] max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-[22px] font-bold font-heading mb-1.5 leading-snug">
                {activeReviewCampaign.t}
              </h2>
              <p className="text-[#6E6E6E] text-sm mb-4">
                {activeReviewUser.name} · {activeReviewUser.email} · {activeReviewCampaign.cat} · goal {f0(activeReviewCampaign.goal)} ETB
              </p>

              {/* 2-box details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                {/* Payout account */}
                <div className="border border-[#EBEBEB] rounded-2xl p-3.5 sm:p-4">
                  <small className="text-[12px] font-bold text-[#6E6E6E] uppercase tracking-wider block mb-1">
                    Payout account
                  </small>
                  {activeAcct ? (
                    <div>
                      <b>{activeAcct.t}</b>
                      <br />
                      <span>{activeAcct.n}</span>
                      <br />
                      <span>Holder: {activeAcct.h}</span>
                    </div>
                  ) : (
                    <span className="wn">Not provided</span>
                  )}
                </div>

                {/* National ID */}
                <div className="border border-[#EBEBEB] rounded-2xl p-3.5 sm:p-4">
                  <small className="text-[12px] font-bold text-[#6E6E6E] uppercase tracking-wider block mb-1">
                    National ID
                  </small>
                  {activeReviewCampaign.local ? (
                    activeReviewCampaign.photo ? (
                      <img
                        src={activeReviewCampaign.photo}
                        alt="Uploaded national ID"
                        className="w-full rounded-lg mt-2 bg-[#F6F6F6] max-h-40 object-cover"
                      />
                    ) : (
                      <span className="wn">Not uploaded</span>
                    )
                  ) : (
                    <div className="mt-2 border-[1.5px] border-dashed border-[#bbb] rounded-lg aspect-[1.6] grid place-items-center text-xs text-[#6E6E6E] text-center p-2">
                      Sample ID photo
                      <br />
                      {activeReviewCampaign.idName}
                    </div>
                  )}
                  {activeReviewCampaign.idName && (
                    <div className="mt-2 text-xs">
                      Name on ID: <strong>{activeReviewCampaign.idName}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Name Match Indicator */}
              {activeNameMatch !== null && (
                <p className={`text-sm my-2 ${activeNameMatch ? 'text-emerald-700' : 'wn'}`}>
                  {activeNameMatch
                    ? '✓ Account holder matches the name on the ID.'
                    : '⚠ Account holder differs from the name on the ID. Check before approving.'}
                </p>
              )}

              {/* Existing Decision if already reviewed */}
              {activeDecision && (
                <p className={`tg ${activeDecision.st} mt-2`}>
                  Decision: {TG_LABELS[activeDecision.st]}
                  {activeDecision.reason ? ` · ${activeDecision.reason}` : ''}
                </p>
              )}

              {/* Verification Checklist */}
              <h3 className="mt-4 mb-2 text-base font-bold">Checklist</h3>
              <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={check1}
                    onChange={(e) => setCheck1(e.target.checked)}
                    className="w-5 h-5 accent-[#1A1A1A] mt-0.5 shrink-0"
                  />
                  <span>Name on the ID matches the account holder</span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={check2}
                    onChange={(e) => setCheck2(e.target.checked)}
                    className="w-5 h-5 accent-[#1A1A1A] mt-0.5 shrink-0"
                  />
                  <span>ID photo is clear, complete and not expired</span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={check3}
                    onChange={(e) => setCheck3(e.target.checked)}
                    className="w-5 h-5 accent-[#1A1A1A] mt-0.5 shrink-0"
                  />
                  <span>Story, category and goal look genuine</span>
                </label>
              </div>

              {/* Rejection / Changes reason */}
              <textarea
                value={reasonInput}
                onChange={(e) => { setReasonInput(e.target.value); setErrorMsg(''); }}
                placeholder="Reason (required to reject or request changes)"
                className="w-full border border-[#cfcfcf] rounded-xl p-3 min-h-[76px] my-3 text-sm outline-none resize-y focus:border-[#1A1A1A]"
              />

              {errorMsg && (
                <div className="text-[#B3261E] text-sm mb-3 font-semibold" role="alert">
                  {errorMsg}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 flex-wrap pt-2">
                <button
                  type="button"
                  onClick={() => setActiveReviewId(null)}
                  className="btn o text-sm"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => submitDecision('changes')}
                  className="btn o text-sm"
                >
                  Request changes
                </button>
                <button
                  type="button"
                  onClick={() => submitDecision('rejected')}
                  className="btn o text-sm"
                >
                  Reject
                </button>
                <button
                  type="button"
                  disabled={!(check1 && check2 && check3)}
                  onClick={() => submitDecision('live')}
                  className="btn d text-sm"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
