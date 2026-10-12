'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PHOTOS } from '../data/campaigns';
import AttentionPopup from '../components/AttentionPopup';

const GIFTS = [
  { name: 'Selamawit K.', amount: 1500 },
  { name: 'Meron B.', amount: 250 },
  { name: 'Henok T.', amount: 1000 },
  { name: 'Anonymous', amount: 2000 },
  { name: 'Bethlehem A.', amount: 500 },
  { name: 'Samuel & Lia', amount: 5000 },
  { name: 'Kidist M.', amount: 750 },
];

export default function LandingPage() {
  const router = useRouter();

  // Header & Navigation States
  const [isHeaderSm, setIsHeaderSm] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live Hero Donation Feed & Bar
  const [heroRaised, setHeroRaised] = useState(402000);
  const [heroDisplayRaised, setHeroDisplayRaised] = useState(402000);
  const [heroBump, setHeroBump] = useState(false);
  const [feedItems, setFeedItems] = useState([
    { id: '1', name: 'Yonas & Tigist', time: 'just now', amount: 3000, isNew: false },
    { id: '2', name: 'Anonymous', time: '1 min ago', amount: 500, isNew: false },
    { id: '3', name: 'Meron B.', time: '2 min ago', amount: 250, isNew: false },
  ]);

  // Monthly Contribution Calculator State
  const [monthlyWho, setMonthlyWho] = useState<'organizations' | 'verified persons'>('organizations');
  const [monthlyAmt, setMonthlyAmt] = useState<string>('20');

  // Stats Counters State
  const [statRaised, setStatRaised] = useState('12.4M');
  const [statCampaigns, setStatCampaigns] = useState('1,280');
  const [statDonors, setStatDonors] = useState('34,000');
  const [statRegions, setStatRegions] = useState('11');
  const statsSectionRef = useRef<HTMLElement>(null);
  const statsAnimated = useRef(false);

  // Scroll Story Stage State
  const [storyIndex, setStoryIndex] = useState(0);
  const [storyCount, setStoryCount] = useState(650000);
  const trkRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click or escape
  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderSm(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.mi')) {
        setOpenDropdown(null);
      }
      if (!target.closest('#sbar') && !target.closest('#sb')) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Hero Raised Amount Tweener
  useEffect(() => {
    const target = heroRaised;
    const start = heroDisplayRaised;
    const startTime = performance.now();
    const duration = 900;

    let frameId: number;
    const animate = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setHeroDisplayRaised(Math.round(start + (target - start) * ease));
      if (p < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [heroRaised]);

  // Periodic simulated live donation feed
  useEffect(() => {
    let giftIndex = 0;
    const interval = setInterval(() => {
      if (document.hidden) return;
      const nextGift = GIFTS[giftIndex % GIFTS.length];
      giftIndex++;

      setHeroRaised((prev) => {
        if (prev >= 650000 - 30000) return prev;
        return prev + nextGift.amount;
      });

      setHeroBump(true);
      setTimeout(() => setHeroBump(false), 500);

      setFeedItems((prev) => {
        const newItem = {
          id: String(Date.now()),
          name: nextGift.name,
          time: 'just now',
          amount: nextGift.amount,
          isNew: true,
        };
        const updated = [newItem, ...prev.map((item, idx) => ({
          ...item,
          isNew: false,
          time: idx === 0 ? '1 min ago' : '2 min ago',
        }))].slice(0, 3);
        return updated;
      });
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  // Impact Counter IntersectionObserver Animation
  useEffect(() => {
    const el = statsSectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsAnimated.current) {
            statsAnimated.current = true;
            const startT = performance.now();
            const duration = 1600;

            const run = (now: number) => {
              const p = Math.min((now - startT) / duration, 1);
              const e = 1 - Math.pow(1 - p, 3);
              setStatRaised((12.4 * e).toFixed(1) + 'M');
              setStatCampaigns(Math.round(1280 * e).toLocaleString('en-US'));
              setStatDonors(Math.round(34000 * e).toLocaleString('en-US'));
              setStatRegions(String(Math.round(11 * e)));
              if (p < 1) {
                requestAnimationFrame(run);
              }
            };
            requestAnimationFrame(run);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Sticky Scroll Story Handler
  useEffect(() => {
    const storyValues = [650000, 250000, 120000];

    const handleScroll = () => {
      const trk = trkRef.current;
      const stg = stageRef.current;
      if (!trk || !stg) return;

      const h = trk.offsetHeight - stg.offsetHeight;
      if (h <= 0) return;

      const rect = trk.getBoundingClientRect();
      const p = Math.min(Math.max(-(rect.top - 64) / h, 0), 0.9999);
      const n = 3;
      const i = Math.floor(p * n);

      if (i !== storyIndex) {
        setStoryIndex(i);
        const targetVal = storyValues[i];
        const t0 = performance.now();
        const animCount = (t: number) => {
          const prog = Math.min((t - t0) / 1000, 1);
          setStoryCount(Math.round(targetVal * (1 - Math.pow(1 - prog, 3))));
          if (prog < 1) requestAnimationFrame(animCount);
        };
        requestAnimationFrame(animCount);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [storyIndex]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/discover?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/discover');
    }
    setSearchOpen(false);
  };

  const heroGoal = 650000;
  const heroPct = Math.min(Math.round((heroRaised / heroGoal) * 100), 100);

  return (
    <>
      {/* ── Exact CSS from Claude Design Artifact ── */}
      <style jsx global>{`
        :root {
          --bg: #ffffff;
          --ink: #1D2B21;
          --forest: #1E4A2C;
          --forest-d: #163A22;
          --olive: #7F9C3A;
          --sage: #CBDDB3;
          --mint: #F0F6E8;
          --line: #E3EBDA;
          --mute: #5E6B60;
          --display: 'Fraunces', 'Noto Sans Ethiopic', Georgia, serif;
          --body: 'Figtree', 'Noto Sans Ethiopic', system-ui, sans-serif;
          --logo: url(/gfe-logo.png);
          box-sizing: border-box;
          padding-top: env(safe-area-inset-top, 0px);
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
        html {
          scroll-padding-top: calc(84px + env(safe-area-inset-top, 0px));
          scroll-behavior: smooth;
        }
        * {
          box-sizing: border-box;
          margin: 0;
        }
        body {
          background: var(--bg);
          color: var(--ink);
          font: 16px/1.6 var(--body);
          overflow-x: hidden;
        }
        h1, h2, h3, .num {
          font-family: var(--display);
          font-weight: 500;
          letter-spacing: -0.015em;
          text-wrap: balance;
        }
        ::selection {
          background: var(--sage);
        }
        a {
          color: inherit;
        }
        button {
          font: inherit;
          color: inherit;
          cursor: pointer;
        }
        :focus-visible {
          outline: 2px solid var(--forest) !important;
          outline-offset: 3px !important;
        }
        .w {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 24px;
        }
        header {
          position: sticky;
          top: env(safe-area-inset-top, 0px);
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--line);
          z-index: 60;
          --hh: 120px;
          --hl: 104px;
          transition: height 0.3s;
        }
        header.sm {
          --hh: 84px;
          --hl: 72px;
        }
        .brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          text-decoration: none;
          font: 600 18px var(--display);
          color: var(--forest);
          line-height: 1.1;
        }
        .lg {
          --lh: 104px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: var(--lh);
          width: calc(var(--lh) * 1.45);
          transition: width 0.3s, height 0.3s;
        }
        .lg img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .brand .lg {
          --lh: var(--hl);
        }
        .hd {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 28px;
          height: var(--hh, 72px);
          transition: height 0.3s;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
        }
        .hl, .hr {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .hr {
          justify-content: flex-end;
          gap: 8px;
        }
        .mi {
          position: relative;
        }
        .mb {
          background: none;
          border: 0;
          padding: 10px 14px;
          border-radius: 99px;
          font-weight: 500;
          color: var(--ink);
          display: inline-flex;
          align-items: center;
          gap: 7px;
          text-decoration: none;
          white-space: nowrap;
        }
        .mb:hover, .mi.open > .mb {
          background: var(--mint);
        }
        .mb svg {
          flex: none;
        }
        .dd {
          position: absolute;
          top: calc(100% + 10px);
          left: 0;
          min-width: 290px;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 20px;
          padding: 8px;
          box-shadow: 0 28px 50px -24px rgba(30, 74, 44, 0.4);
          visibility: hidden;
          opacity: 0;
          transform: translateY(-6px);
          transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
          z-index: 70;
        }
        .hr .dd {
          left: auto;
          right: 0;
        }
        .mi.open .dd {
          visibility: visible;
          opacity: 1;
          transform: none;
        }
        .dd a {
          display: block;
          padding: 11px 14px;
          border-radius: 14px;
          text-decoration: none;
        }
        .dd a:hover, .dd a:focus-visible {
          background: var(--mint);
        }
        .dd b {
          display: block;
          font-weight: 600;
        }
        .dd small {
          color: var(--mute);
          font-size: 13px;
        }
        .burger {
          display: none;
          background: none;
          border: 0;
          padding: 10px;
          border-radius: 99px;
          margin-left: -10px;
        }
        .burger:hover {
          background: var(--mint);
        }
        .sbar {
          border-top: 1px solid var(--line);
          background: #fff;
        }
        .sbar .w {
          padding-top: 20px;
          padding-bottom: 24px;
          max-width: 860px;
        }
        .sl {
          display: flex;
          gap: 12px;
          align-items: center;
          border: 1.5px solid var(--line);
          border-radius: 99px;
          padding: 0 22px;
          transition: border-color 0.2s;
        }
        .sl:focus-within {
          border-color: var(--forest);
        }
        .sl input {
          flex: 1;
          min-width: 0;
          border: 0;
          outline: 0;
          padding: 16px 0;
          font: inherit;
          font-size: 17px;
          background: none;
        }
        .chips {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 14px;
        }
        .chips a {
          background: var(--mint);
          border-radius: 99px;
          padding: 6px 14px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          color: var(--forest);
        }
        .chips a:hover {
          background: var(--sage);
        }
        .mm {
          border-top: 1px solid var(--line);
          background: #fff;
          padding: 8px 24px 24px;
          max-height: calc(100svh - 72px);
          overflow: auto;
        }
        .mm p {
          font: 600 13px var(--body);
          color: var(--mute);
          margin: 20px 0 6px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .mm a:not(.btn) {
          display: block;
          padding: 11px 0;
          text-decoration: none;
          font-weight: 500;
          border-bottom: 1px solid var(--line);
        }
        .mm .btn {
          display: block;
          text-align: center;
          margin-top: 20px;
        }
        .row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
        }
        .btn {
          display: inline-block;
          background: var(--forest);
          color: #fff;
          border: 1.5px solid var(--forest);
          border-radius: 99px;
          padding: 13px 26px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s;
        }
        .btn:hover {
          background: var(--forest-d);
          border-color: var(--forest-d);
        }
        .btn.o {
          background: none;
          color: var(--forest);
        }
        .btn.o:hover {
          background: var(--mint);
        }
        .btn.l {
          background: var(--sage);
          border-color: var(--sage);
          color: var(--forest);
        }
        .btn.l:hover {
          background: #B9D09B;
          border-color: #B9D09B;
        }
        .btn.s {
          padding: 9px 18px;
          font-size: 14px;
        }
        header .btn {
          white-space: nowrap;
        }
        .hero {
          position: relative;
          padding: 80px 24px 96px;
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 64px;
          align-items: center;
        }
        .sprig {
          position: absolute;
          pointer-events: none;
          color: var(--sage);
          z-index: -1;
        }
        .sp1 {
          width: 260px;
          right: -40px;
          top: -10px;
          transform: rotate(14deg);
        }
        .sp2 {
          width: 200px;
          left: -150px;
          bottom: -50px;
          transform: rotate(-160deg);
          opacity: 0.6;
        }
        .sp3 {
          width: 240px;
          left: -70px;
          bottom: -50px;
          transform: rotate(-18deg);
          color: var(--sage);
          opacity: 0.7;
        }
        .band {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          background: var(--mint);
        }
        .cta {
          isolation: isolate;
          background: var(--forest);
          color: #fff;
          border-radius: 36px;
          padding: 72px 48px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .cta .sprig {
          color: #fff;
          opacity: 0.13;
          z-index: 0;
        }
        .cta h2, .cta p, .cta .row, .cta small {
          position: relative;
          z-index: 1;
        }
        .cs1 {
          width: 240px;
          left: -60px;
          top: -30px;
          transform: rotate(30deg);
        }
        .cs2 {
          width: 240px;
          right: -60px;
          bottom: -40px;
          transform: rotate(-150deg);
        }
        h1 {
          font-size: clamp(42px, 6vw, 72px);
          line-height: 1.04;
        }
        .lead {
          color: var(--mute);
          font-size: 19px;
          max-width: 30em;
          margin: 22px 0 32px;
        }
        .pills {
          list-style: none;
          padding: 0;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 32px;
        }
        .pills li {
          background: var(--mint);
          border-radius: 99px;
          padding: 6px 16px;
          font-weight: 600;
          font-size: 14px;
          color: var(--forest);
        }
        .feat {
          background: var(--forest);
          color: #fff;
          border-radius: 30px;
          padding: 26px;
          box-shadow: 0 30px 60px -30px rgba(30, 74, 44, 0.5);
        }
        .feat .th {
          height: 200px;
          border-radius: 20px;
        }
        .feat h3 {
          font-size: 24px;
          margin: 20px 0 4px;
          line-height: 1.2;
        }
        .feat p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.75);
        }
        .track {
          height: 10px;
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.18);
          overflow: hidden;
          margin: 18px 0 10px;
        }
        .track i {
          display: block;
          height: 100%;
          background: var(--sage);
          border-radius: 9px;
          transition: width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .fr {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          font-size: 14px;
        }
        .fr b {
          font: 600 22px var(--display);
        }
        .fr b.bump {
          animation: bump 0.5s ease;
        }
        @keyframes bump {
          40% { transform: scale(1.07); }
        }
        .ph {
          position: relative;
          overflow: hidden;
          display: block;
          background: linear-gradient(140deg, #EAF2DE, #CBDDB3 55%, #A9C27F);
        }
        .ph::after {
          content: attr(data-l);
          position: absolute;
          left: 14px;
          bottom: 12px;
          font-size: 12px;
          font-weight: 600;
          color: var(--forest);
          background: rgba(255, 255, 255, 0.88);
          border-radius: 99px;
          padding: 2px 10px;
        }
        .ph.has::after {
          display: none;
        }
        .ph img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .live {
          position: absolute;
          top: 14px;
          left: 14px;
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          font-weight: 600;
          color: var(--forest);
          background: #fff;
          border-radius: 99px;
          padding: 4px 11px;
          z-index: 2;
        }
        .live i {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--forest);
          position: relative;
        }
        .live i::after {
          content: "";
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid var(--forest);
          animation: ping 1.8s ease-out infinite;
        }
        @keyframes ping {
          from { transform: scale(0.6); opacity: 0.8; }
          to { transform: scale(2); opacity: 0; }
        }
        .feed {
          margin-top: 20px;
          display: grid;
          gap: 8px;
          align-content: start;
          min-height: 138px;
          overflow: hidden;
        }
        .feed div {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 9px 14px;
          font-size: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }
        .feed div.new {
          animation: drop 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        @keyframes drop {
          from { opacity: 0; transform: translateY(-14px) scale(0.97); }
        }
        .feed small {
          display: block;
          font-size: 12px;
          opacity: 0.7;
          line-height: 1.3;
        }
        .feed strong {
          font-family: var(--display);
          font-weight: 600;
          white-space: nowrap;
        }
        .feed div:nth-child(2) { opacity: 0.6; }
        .feed div:nth-child(3) { opacity: 0.3; }

        .counter {
          padding: 56px 0;
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        .stats > div {
          padding: 0 24px;
          border-left: 1px solid var(--line);
          text-align: center;
        }
        .stats > div:first-child {
          border-left: 0;
        }
        .stats .num {
          font-size: clamp(38px, 5.2vw, 64px);
          line-height: 1.1;
          color: var(--forest);
        }
        .stats span {
          color: var(--mute);
          font-size: 15px;
        }

        section {
          padding: 96px 0;
        }
        h2 {
          font-size: clamp(32px, 4.2vw, 50px);
          line-height: 1.08;
          max-width: 15em;
        }
        .l2 {
          color: var(--mute);
          font-size: 18px;
          max-width: 34em;
          margin-top: 16px;
        }
        .head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 16px;
          flex-wrap: wrap;
        }
        .cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 44px;
        }
        .c {
          display: block;
          text-decoration: none;
          color: inherit;
        }
        .c .th {
          height: 200px;
          border-radius: 22px;
        }
        .c .tag {
          display: inline-block;
          font-size: 12px;
          font-weight: 600;
          background: var(--sage);
          color: var(--forest);
          border-radius: 99px;
          padding: 2px 12px;
          margin: 16px 0 8px;
        }
        .c h3 {
          font-size: 21px;
          line-height: 1.25;
          min-height: 2.5em;
        }
        .c .track {
          background: var(--line);
          height: 6px;
          margin: 14px 0 8px;
        }
        .c .track i {
          background: var(--olive);
        }
        .c .fr {
          color: var(--mute);
        }
        .c .fr b {
          color: var(--ink);
          font-size: 16px;
          font-family: var(--body);
          font-weight: 600;
        }
        .four {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-top: 48px;
        }
        .cm {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--line);
          border-radius: 24px;
          padding: 26px 22px;
          background: #fff;
          transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.35s, border-color 0.35s;
        }
        .cm:hover {
          transform: translateY(-6px);
          border-color: var(--sage);
          box-shadow: 0 24px 40px -28px rgba(30, 74, 44, 0.35);
        }
        .ic {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--mint);
          display: grid;
          place-items: center;
          color: var(--forest);
          margin-bottom: 20px;
        }
        .cm h3 {
          font-size: 22px;
          margin-bottom: 8px;
        }
        .cm p {
          color: var(--mute);
          font-size: 15px;
          margin-bottom: 22px;
        }
        .cm .link {
          margin-top: auto;
        }
        .link {
          font-weight: 600;
          color: var(--forest);
          text-underline-offset: 4px;
          text-decoration: underline;
        }

        .ms {
          list-style: none;
          padding: 0;
          margin-top: 32px;
          display: grid;
          gap: 14px;
        }
        .ms li {
          display: flex;
          gap: 14px;
          align-items: center;
          font-weight: 500;
        }
        .ms span {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #fff;
          color: var(--forest);
          display: grid;
          place-items: center;
          font: 600 14px var(--body);
          box-shadow: 0 0 0 1px var(--sage);
          flex: none;
        }
        .mo {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 72px;
          align-items: center;
        }
        .mcard {
          background: #fff;
          border-radius: 28px;
          padding: 30px;
          box-shadow: 0 30px 60px -36px rgba(30, 74, 44, 0.4);
        }
        .lab {
          display: block;
          font-weight: 600;
          font-size: 14px;
          margin: 0 0 10px;
        }
        .mcard .lab:not(:first-child) {
          margin-top: 24px;
        }
        .seg {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: var(--mint);
          border-radius: 99px;
          padding: 4px;
        }
        .seg button {
          border: 0;
          background: none;
          border-radius: 99px;
          padding: 10px;
          font-weight: 600;
          color: var(--mute);
          transition: 0.25s;
        }
        .seg button[aria-pressed="true"] {
          background: var(--forest);
          color: #fff;
        }
        .amts {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .amts button {
          background: #fff;
          border: 1.5px solid var(--line);
          border-radius: 16px;
          padding: 16px 8px;
          font: 600 22px var(--display);
          transition: 0.25s;
        }
        .amts button:hover {
          border-color: var(--olive);
        }
        .amts button[aria-pressed="true"] {
          background: var(--forest);
          border-color: var(--forest);
          color: #fff;
        }
        .pay {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .pay div {
          border: 1.5px solid var(--line);
          border-radius: 16px;
          padding: 14px 10px;
          text-align: center;
          font-weight: 600;
          font-size: 14px;
        }
        .pay svg {
          display: block;
          margin: 0 auto 6px;
          color: var(--forest);
        }
        .pay small {
          display: block;
          color: var(--mute);
          font-weight: 400;
          font-size: 12px;
        }
        .sum {
          margin: 22px 0 18px;
          color: var(--mute);
          font-size: 15px;
          min-height: 24px;
        }
        .mcard .btn {
          width: 100%;
          text-align: center;
        }

        .split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 72px;
          align-items: start;
        }
        .checks {
          list-style: none;
          padding: 0;
          margin-top: 24px;
          display: grid;
          gap: 12px;
        }
        .checks li {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .checks svg {
          flex: none;
          margin-top: 3px;
          color: var(--olive);
        }
        .steps {
          list-style: none;
          padding: 0;
        }
        .steps li {
          display: flex;
          gap: 18px;
          padding: 22px 0;
          border-bottom: 1px solid var(--line);
        }
        .steps li:first-child {
          padding-top: 0;
        }
        .steps .d {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--sage);
          color: var(--forest);
          display: grid;
          place-items: center;
          font: 600 14px var(--body);
          flex: none;
        }
        .steps b {
          display: block;
          font-size: 17px;
        }
        .steps span {
          color: var(--mute);
          font-size: 15px;
        }

        .trk {
          height: 340vh;
          position: relative;
        }
        .stage {
          position: sticky;
          top: calc(72px + env(safe-area-inset-top, 0px));
          height: calc(100svh - 72px);
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 56px;
          align-items: center;
        }
        .frame {
          position: relative;
          height: min(74svh, 640px);
          border-radius: 34px;
          overflow: hidden;
          background: var(--sage);
        }
        .si {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.8s ease;
        }
        .si.on {
          opacity: 1;
        }
        .pi {
          position: absolute;
          inset: 0;
          transition: transform 0.3s ease-out;
        }
        .chip {
          position: absolute;
          right: 18px;
          bottom: 18px;
          background: var(--forest);
          color: #fff;
          border-radius: 99px;
          padding: 8px 16px;
          font-weight: 600;
          font-size: 14px;
          z-index: 2;
          transform: translateY(14px);
          opacity: 0;
          transition: 0.6s 0.3s;
        }
        .si.on .chip {
          transform: none;
          opacity: 1;
        }
        .txs {
          position: relative;
          min-height: 340px;
        }
        .sx {
          position: absolute;
          inset: 0 0 auto 0;
          opacity: 0;
          transform: translateY(26px);
          transition: opacity 0.6s, transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
          pointer-events: none;
        }
        .sx.on {
          opacity: 1;
          transform: none;
          pointer-events: auto;
        }
        .sx small {
          color: var(--mute);
          font-size: 15px;
        }
        .sx h3 {
          font-size: clamp(26px, 3.2vw, 40px);
          line-height: 1.15;
          margin: 10px 0 22px;
        }
        .sx .num {
          font-size: clamp(40px, 5vw, 64px);
          line-height: 1;
          color: var(--forest);
        }
        .sx .num span {
          font: 500 0.3em var(--body);
          margin-left: 8px;
          color: var(--mute);
        }
        .sx p {
          color: var(--mute);
          margin-top: 8px;
        }
        .sx .btn {
          margin-top: 24px;
        }
        .dots {
          display: flex;
          gap: 8px;
          margin-top: 20px;
        }
        .dots i {
          width: 28px;
          height: 4px;
          border-radius: 4px;
          background: var(--line);
          transition: background 0.4s;
          cursor: pointer;
        }
        .dots i.on {
          background: var(--forest);
        }

        .cta h2 {
          margin: 0 auto;
          max-width: 14em;
          color: #fff;
        }
        .cta p {
          color: rgba(255, 255, 255, 0.8);
          margin: 16px auto 30px;
          max-width: 30em;
        }
        .cta .row {
          justify-content: center;
        }
        .cta small {
          display: block;
          margin-top: 22px;
          color: rgba(255, 255, 255, 0.65);
          font-size: 13px;
        }

        footer {
          border-top: 1px solid var(--line);
          color: var(--mute);
          font-size: 14px;
        }
        footer .w {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
          padding-top: 40px;
          padding-bottom: 40px;
          align-items: center;
        }
        footer .lg {
          --lh: 92px;
        }
        footer nav {
          display: flex;
          flex: none;
          gap: 22px;
          flex-wrap: wrap;
        }
        .copy {
          border-top: 1px solid var(--line);
          padding: 18px 24px 22px;
          font-size: 13px;
        }

        @media (max-width: 1280px) {
          .sp2 { display: none; }
        }
        @media (max-width: 900px) {
          .hero, .mo, .split {
            grid-template-columns: 1fr;
            gap: 44px;
          }
          .hero {
            padding: 48px 24px 64px;
          }
          .four {
            grid-template-columns: 1fr 1fr;
          }
          .cards {
            grid-template-columns: 1fr;
          }
          section {
            padding: 64px 0;
          }
          .stage {
            grid-template-columns: 1fr;
            gap: 20px;
            align-content: start;
            padding-top: 12px;
          }
          .frame {
            height: 40svh;
            order: -1;
            border-radius: 24px;
          }
          .txs {
            min-height: 300px;
          }
          .cta {
            padding: 48px 24px;
            border-radius: 26px;
          }
          .sp1 {
            width: 200px;
          }
          .sprig {
            display: none;
          }
          .dsk {
            display: none !important;
          }
          .burger {
            display: flex !important;
          }
          .feat {
            padding: 18px;
          }
          .stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            row-gap: 32px;
          }
          .stats > div {
            padding: 0 10px;
          }
          .stats > div:nth-child(3) {
            border-left: 0;
          }
          .stats .num {
            font-size: clamp(32px, 9vw, 46px);
          }
          header, header.sm {
            --hh: 72px;
            --hl: 56px;
          }
        }
        @media (max-width: 560px) {
          .four {
            grid-template-columns: 1fr;
          }
          .hd .x {
            display: none;
          }
          .hd {
            padding: 0 16px;
          }
        }
      `}</style>

      {/* ── Sprig SVG definition symbol ── */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <symbol id="sprig" viewBox="0 0 200 320">
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M100 312C94 240 108 160 100 18" />
            <g id="lf">
              <path d="M0 0C14-15 40-15 54 0C40 15 14 15 0 0ZM4 0H50" />
            </g>
            <use href="#lf" transform="translate(99 270) rotate(-35)" />
            <use href="#lf" transform="translate(101 235) rotate(215)" />
            <use href="#lf" transform="translate(100 195) rotate(-40)" />
            <use href="#lf" transform="translate(101 158) rotate(220)" />
            <use href="#lf" transform="translate(100 118) rotate(-45)" />
            <use href="#lf" transform="translate(101 82) rotate(225)" />
            <use href="#lf" transform="translate(100 44) rotate(-70)" />
          </g>
        </symbol>
      </svg>

      {/* ── Attention Popup for urgent campaigns ── */}
      <AttentionPopup />

      {/* ── HEADER ── */}
      <header className={isHeaderSm ? 'sm' : ''}>
        <div className="hd">
          <div className="hl">
            <button
              className="burger"
              id="bg"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>

            {/* Search Button -> leads directly to /discover */}
            <Link
              className="mb dsk"
              id="sb"
              href="/discover"
              aria-label="Search campaigns"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              Search
            </Link>

            {/* Donate Dropdown */}
            <div className={`mi dsk ${openDropdown === 'donate' ? 'open' : ''}`}>
              <button
                className="mb"
                aria-expanded={openDropdown === 'donate'}
                aria-haspopup="true"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchOpen(false);
                  setOpenDropdown(openDropdown === 'donate' ? null : 'donate');
                }}
              >
                Donate
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                  <path d="M1 3l4 4 4-4z" />
                </svg>
              </button>
              <div className="dd" role="menu">
                <Link role="menuitem" href="/discover" onClick={() => setOpenDropdown(null)}>
                  <b>Browse campaigns</b>
                  <small>Find someone to help today</small>
                </Link>
                <a role="menuitem" href="#monthly" onClick={() => setOpenDropdown(null)}>
                  <b>Give monthly</b>
                  <small>From 10 Br a month</small>
                </a>
                <Link role="menuitem" href="/discover?type=organization" onClick={() => setOpenDropdown(null)}>
                  <b>Charity organizations</b>
                  <small>Support registered groups</small>
                </Link>
                <Link role="menuitem" href="/discover?type=verified" onClick={() => setOpenDropdown(null)}>
                  <b>Verified persons</b>
                  <small>Trusted public figures</small>
                </Link>
              </div>
            </div>

            {/* Fundraise Dropdown */}
            <div className={`mi dsk ${openDropdown === 'fundraise' ? 'open' : ''}`}>
              <button
                className="mb"
                aria-expanded={openDropdown === 'fundraise'}
                aria-haspopup="true"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchOpen(false);
                  setOpenDropdown(openDropdown === 'fundraise' ? null : 'fundraise');
                }}
              >
                Fundraise
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                  <path d="M1 3l4 4 4-4z" />
                </svg>
              </button>
              <div className="dd" role="menu">
                <Link role="menuitem" href="/dashboard/campaigns/new" onClick={() => setOpenDropdown(null)}>
                  <b>Start a campaign</b>
                  <small>Raise for yourself</small>
                </Link>
                <Link role="menuitem" href="/dashboard/campaigns/new?type=referral" onClick={() => setOpenDropdown(null)}>
                  <b>Raise for someone else</b>
                  <small>Refer a person in need</small>
                </Link>
                <Link role="menuitem" href="/dashboard/campaigns/charity-setup" onClick={() => setOpenDropdown(null)}>
                  <b>Register a charity</b>
                  <small>Run campaigns with your team</small>
                </Link>
                <a role="menuitem" href="#trust" onClick={() => setOpenDropdown(null)}>
                  <b>How it works</b>
                  <small>Verification and withdrawals</small>
                </a>
              </div>
            </div>
          </div>

          {/* Logo Center */}
          <Link className="brand" href="/" aria-label="Go Fund Me Ethiopia, home">
            <span className="lg" role="img" aria-label="Go Fund Me Ethiopia">
              <img src="/gfe-logo.png" alt="Go Fund Me Ethiopia" />
            </span>
          </Link>

          {/* Right Header Navigation */}
          <div className="hr">
            <div className={`mi dsk ${openDropdown === 'about' ? 'open' : ''}`}>
              <button
                className="mb"
                aria-expanded={openDropdown === 'about'}
                aria-haspopup="true"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchOpen(false);
                  setOpenDropdown(openDropdown === 'about' ? null : 'about');
                }}
              >
                About
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                  <path d="M1 3l4 4 4-4z" />
                </svg>
              </button>
              <div className="dd" role="menu">
                <Link role="menuitem" href="/about" onClick={() => setOpenDropdown(null)}>
                  <b>Our story</b>
                </Link>
                <a role="menuitem" href="#trust" onClick={() => setOpenDropdown(null)}>
                  <b>Trust and verification</b>
                </a>
                <Link role="menuitem" href="/how-it-works" onClick={() => setOpenDropdown(null)}>
                  <b>Fees</b>
                </Link>
                <Link role="menuitem" href="/how-it-works" onClick={() => setOpenDropdown(null)}>
                  <b>Help center</b>
                </Link>
              </div>
            </div>

            <Link className="mb dsk" href="/auth/login">
              Sign in
            </Link>
            <Link className="btn o s" href="/dashboard/campaigns/new">
              Start<span className="x"> a campaign</span>
            </Link>
          </div>
        </div>

        {/* Search Bar Overlay */}
        <div className="sbar" id="sbar" hidden={!searchOpen}>
          <div className="w">
            <form onSubmit={handleSearchSubmit}>
              <label className="sl">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
                <input
                  id="sq"
                  type="search"
                  placeholder="Search campaigns, charities and people"
                  aria-label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus={searchOpen}
                />
              </label>
            </form>
            <div className="chips">
              <Link href="/discover?category=medical" onClick={() => setSearchOpen(false)}>Medical</Link>
              <Link href="/discover?category=education" onClick={() => setSearchOpen(false)}>Education</Link>
              <Link href="/discover?category=water" onClick={() => setSearchOpen(false)}>Clean water</Link>
              <Link href="/discover?category=emergency" onClick={() => setSearchOpen(false)}>Emergency</Link>
              <Link href="/discover?type=organization" onClick={() => setSearchOpen(false)}>Charities</Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <div className="mm" id="mm" hidden={!mobileMenuOpen}>
          <form onSubmit={handleSearchSubmit}>
            <label className="sl" style={{ marginTop: '12px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>
          </form>

          <p>Donate</p>
          <Link href="/discover" onClick={() => setMobileMenuOpen(false)}>Browse campaigns</Link>
          <a href="#monthly" onClick={() => setMobileMenuOpen(false)}>Give monthly</a>
          <Link href="/discover?type=organization" onClick={() => setMobileMenuOpen(false)}>Charity organizations</Link>
          <Link href="/discover?type=verified" onClick={() => setMobileMenuOpen(false)}>Verified persons</Link>

          <p>Fundraise</p>
          <Link href="/dashboard/campaigns/new" onClick={() => setMobileMenuOpen(false)}>Start a campaign</Link>
          <Link href="/dashboard/campaigns/new?type=referral" onClick={() => setMobileMenuOpen(false)}>Raise for someone else</Link>
          <Link href="/dashboard/campaigns/charity-setup" onClick={() => setMobileMenuOpen(false)}>Register a charity</Link>
          <a href="#trust" onClick={() => setMobileMenuOpen(false)}>How it works</a>

          <p>About</p>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)}>Our story</Link>
          <a href="#trust" onClick={() => setMobileMenuOpen(false)}>Trust and verification</a>
          <Link href="/how-it-works" onClick={() => setMobileMenuOpen(false)}>Fees</Link>
          <Link href="/how-it-works" onClick={() => setMobileMenuOpen(false)}>Help center</Link>
          <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
          <Link className="btn" href="/dashboard/campaigns/new" onClick={() => setMobileMenuOpen(false)}>
            Start a campaign
          </Link>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main>
        {/* HERO SECTION */}
        <div className="w hero">
          <svg className="sprig sp1" viewBox="0 0 200 320" aria-hidden="true">
            <use href="#sprig" />
          </svg>
          <svg className="sprig sp2" viewBox="0 0 200 320" aria-hidden="true">
            <use href="#sprig" />
          </svg>

          <div>
            <h1>Connecting hearts, empowering lives.</h1>
            <p className="lead">
              Ethiopia&apos;s first digital charity ecosystem. Share your story, help someone who cannot, support a registered charity, or give monthly, all in one trusted place.
            </p>
            <div className="row">
              <Link className="btn" href="/dashboard/campaigns/new">
                Start a campaign
              </Link>
              <a className="btn o" href="#monthly">
                Give monthly
              </a>
            </div>
            <ul className="pills" aria-label="Our promise">
              <li>Trusted</li>
              <li>Transparent</li>
              <li>Impactful</li>
            </ul>
          </div>

          {/* FEATURED CARD */}
          <article className="feat" aria-label="Featured campaign">
            <div className={`th ph ${PHOTOS['dawit'] ? 'has' : ''}`} data-k="dawit" data-l="Add photo: Dawit">
              {PHOTOS['dawit'] && <img src={PHOTOS['dawit']} alt="Dawit" />}
              <span className="live">
                <i></i>Live now
              </span>
            </div>
            <h3>Heart surgery for Dawit, age 6</h3>
            <p>Addis Ababa · Referred by Hope Ethiopia</p>
            <div className="track">
              <i id="fb" style={{ width: `${heroPct}%` }}></i>
            </div>
            <div className="fr">
              <div>
                <b id="fr" className={heroBump ? 'bump' : ''}>
                  {heroDisplayRaised.toLocaleString('en-US')} Br
                </b>{' '}
                raised of 650,000
              </div>
              <Link className="btn l s" href="/campaign/c4">
                Donate
              </Link>
            </div>
            <div className="feed" id="feed" aria-live="off">
              {feedItems.map((item) => (
                <div key={item.id} className={item.isNew ? 'new' : ''}>
                  <span>
                    {item.name}
                    <small>{item.time}</small>
                  </span>
                  <strong>+{item.amount.toLocaleString('en-US')} Br</strong>
                </div>
              ))}
            </div>
          </article>
        </div>

        {/* IMPACT COUNTER */}
        <section className="counter" aria-label="Our impact" ref={statsSectionRef}>
          <div className="w stats" id="ct">
            <div>
              <div className="num" data-to="12.4" data-dec="1" data-suf="M">
                {statRaised}
              </div>
              <span>Br raised</span>
            </div>
            <div>
              <div className="num" data-to="1280">
                {statCampaigns}
              </div>
              <span>campaigns verified</span>
            </div>
            <div>
              <div className="num" data-to="34000">
                {statDonors}
              </div>
              <span>donors</span>
            </div>
            <div>
              <div className="num" data-to="11">
                {statRegions}
              </div>
              <span>regions reached</span>
            </div>
          </div>
        </section>

        {/* CAMPAIGNS SECTION */}
        <section id="campaigns" style={{ paddingTop: '80px' }}>
          <div className="w">
            <div className="head">
              <h2>People you can help today</h2>
              <Link className="link" href="/discover">
                View all campaigns
              </Link>
            </div>
            <div className="cards">
              <Link className="c" href="/campaign/c5">
                <div className={`th ph ${PHOTOS['almaz'] ? 'has' : ''}`} data-k="almaz" data-l="Add photo: Almaz">
                  {PHOTOS['almaz'] && <img src={PHOTOS['almaz']} alt="Almaz" />}
                </div>
                <span className="tag">Verified</span>
                <h3>Cataract surgery for W/ro Almaz</h3>
                <div className="track">
                  <i style={{ width: '84%' }}></i>
                </div>
                <div className="fr">
                  <span>
                    <b>210,000</b> of 250,000 Br
                  </span>
                  <span>84%</span>
                </div>
              </Link>

              <Link className="c" href="/campaign/c6">
                <div className={`th ph ${PHOTOS['sara'] ? 'has' : ''}`} data-k="sara" data-l="Add photo: Sara">
                  {PHOTOS['sara'] && <img src={PHOTOS['sara']} alt="Sara" />}
                </div>
                <span className="tag">Verified</span>
                <h3>School fees for Sara&apos;s first year at university</h3>
                <div className="track">
                  <i style={{ width: '31%' }}></i>
                </div>
                <div className="fr">
                  <span>
                    <b>37,200</b> of 120,000 Br
                  </span>
                  <span>31%</span>
                </div>
              </Link>

              <Link className="c" href="/campaign/c7">
                <div className={`th ph ${PHOTOS['water'] ? 'has' : ''}`} data-k="water" data-l="Add photo: Gurage villages">
                  {PHOTOS['water'] && <img src={PHOTOS['water']} alt="Gurage villages" />}
                </div>
                <span className="tag">Charity organization</span>
                <h3>Clean water for three Gurage villages</h3>
                <div className="track">
                  <i style={{ width: '80%' }}></i>
                </div>
                <div className="fr">
                  <span>
                    <b>720,000</b> of 900,000 Br
                  </span>
                  <span>80%</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* COMMUNITIES SECTION */}
        <section id="communities">
          <div className="w">
            <h2>One ecosystem, four communities</h2>
            <p className="l2">
              Whether you need help, want to help someone else, run a charity or lead a community, there is a place for you.
            </p>
            <div className="four">
              <article className="cm">
                <div className="ic">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
                  </svg>
                </div>
                <h3>Direct Seekers</h3>
                <p>Register and upload your own case with a video, photos and your story.</p>
                <Link className="link" href="/dashboard/campaigns/new">
                  Start your campaign
                </Link>
              </article>

              <article className="cm">
                <div className="ic">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="8" cy="8" r="3" />
                    <circle cx="17" cy="9" r="2.5" />
                    <path d="M2 20c0-3.5 2.7-5.5 6-5.5s6 2 6 5.5M15 14.5c3 0 7 1 7 5.5" />
                  </svg>
                </div>
                <h3>Referrals</h3>
                <p>Trusted community members register and help people who cannot upload for themselves.</p>
                <Link className="link" href="/dashboard/campaigns/new?type=referral">
                  Refer someone
                </Link>
              </article>

              <article className="cm">
                <div className="ic">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 21V8l8-5 8 5v13M9 21v-6h6v6M9 11h.01M15 11h.01" />
                  </svg>
                </div>
                <h3>Charity Organizations</h3>
                <p>Register your organization and raise support for the registered members you serve.</p>
                <Link className="link" href="/dashboard/campaigns/charity-setup">
                  Register your charity
                </Link>
              </article>

              <article className="cm">
                <div className="ic">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="9" r="6" />
                    <path d="M9 9l2 2 4-4M8.5 14.5L7 22l5-3 5 3-1.5-7.5" />
                  </svg>
                </div>
                <h3>Verified Persons</h3>
                <p>Public figures manage trusted accounts so the community can support causes directly.</p>
                <Link className="link" href="/dashboard/campaigns/verified-person">
                  Become a verified person
                </Link>
              </article>
            </div>
          </div>
        </section>

        {/* MONTHLY GIVING SECTION */}
        <section className="band" id="monthly">
          <svg className="sprig sp3" viewBox="0 0 200 320" aria-hidden="true">
            <use href="#sprig" />
          </svg>
          <div className="w mo">
            <div>
              <h2>Give a little, every month.</h2>
              <p className="l2">
                Subscribe to GFE and support organizations and verified persons directly with a regular contribution. Small amounts, sustained impact.
              </p>
              <ol className="ms">
                <li>
                  <span>1</span>Choose who to support
                </li>
                <li>
                  <span>2</span>Pick 10, 20 or 50 Br
                </li>
                <li>
                  <span>3</span>Pay with your wallet or bank
                </li>
              </ol>
            </div>

            <div className="mcard">
              <span className="lab">Support</span>
              <div className="seg" id="who" role="group" aria-label="Who to support">
                <button
                  type="button"
                  data-w="organizations"
                  aria-pressed={monthlyWho === 'organizations'}
                  onClick={() => setMonthlyWho('organizations')}
                >
                  Organizations
                </button>
                <button
                  type="button"
                  data-w="verified persons"
                  aria-pressed={monthlyWho === 'verified persons'}
                  onClick={() => setMonthlyWho('verified persons')}
                >
                  Verified persons
                </button>
              </div>

              <span className="lab">Monthly contribution</span>
              <div className="amts" id="am" role="group" aria-label="Amount">
                {['10', '20', '50'].map((a) => (
                  <button
                    key={a}
                    type="button"
                    data-a={a}
                    aria-pressed={monthlyAmt === a}
                    onClick={() => setMonthlyAmt(a)}
                  >
                    {a} Br
                  </button>
                ))}
              </div>

              <span className="lab">Easy payment methods</span>
              <div className="pay">
                <div>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="2" width="12" height="20" rx="3" />
                    <path d="M11 18h2" />
                  </svg>
                  Mobile wallet
                  <small>Telebirr</small>
                </div>
                <div>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 10l9-6 9 6M5 10v8M10 10v8M14 10v8M19 10v8M3 21h18" />
                  </svg>
                  Bank
                  <small>Local banks</small>
                </div>
                <div>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="3" />
                    <path d="M2 10h20" />
                  </svg>
                  Card
                  <small>via Chapa</small>
                </div>
              </div>

              <p className="sum" id="sm" aria-live="polite">
                You will give {monthlyAmt} Br every month to {monthlyWho}.
              </p>
              <Link className="btn" href={`/auth/register?next=/dashboard/giving&who=${encodeURIComponent(monthlyWho)}&amount=${monthlyAmt}`}>
                Start monthly giving
              </Link>
            </div>
          </div>
        </section>

        {/* TRUST & VERIFICATION SECTION */}
        <section id="trust">
          <div className="w split">
            <div>
              <h2>Trusted. Transparent. Impactful.</h2>
              <p className="l2">
                Every campaign is reviewed by our team before it goes live. Documents stay private, and donors see a verified badge and regular updates.
              </p>
              <ul className="checks">
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  Every campaign checked before it goes public
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  Private documents, seen only by our verification team
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  Clear updates, so you see where your gift went
                </li>
              </ul>
            </div>

            <ol className="steps">
              <li>
                <span className="d">1</span>
                <div>
                  <b>Share your story</b>
                  <span>Add a video, photos and a short description with your goal in Birr.</span>
                </div>
              </li>
              <li>
                <span className="d">2</span>
                <div>
                  <b>Upload documents</b>
                  <span>ID, medical or school letters and a kebele letter, kept private.</span>
                </div>
              </li>
              <li>
                <span className="d">3</span>
                <div>
                  <b>We review within 48 hours</b>
                  <span>Our team checks everything and tells you if anything is missing.</span>
                </div>
              </li>
              <li>
                <span className="d">4</span>
                <div>
                  <b>Receive donations</b>
                  <span>Withdraw to your account once the campaign is approved.</span>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* STORY SECTION */}
        <section className="story" style={{ padding: 0 }}>
          <div className="w">
            <h2 style={{ paddingTop: '8px' }}>Because of donors like you</h2>
          </div>
          <div className="w trk" ref={trkRef}>
            <div className="stage" ref={stageRef}>
              <div className="tc">
                <div className="txs">
                  <div className={`sx ${storyIndex === 0 ? 'on' : ''}`}>
                    <small>Heart surgery · Addis Ababa</small>
                    <h3>Home from surgery and back to playing with his brothers.</h3>
                    <div className="num">
                      <b className="cnt" data-v="650000" style={{ fontWeight: 700 }}>
                        {storyIndex === 0 ? storyCount.toLocaleString('en-US') : '650,000'}
                      </b>
                      <span>Br raised</span>
                    </div>
                    <p>by 1,204 donors in 38 days</p>
                    <Link className="btn" href="/campaign/c4">
                      Help someone like Dawit
                    </Link>
                  </div>

                  <div className={`sx ${storyIndex === 1 ? 'on' : ''}`}>
                    <small>Cataract surgery · Bahir Dar</small>
                    <h3>Seeing her grandchildren&apos;s faces again after six years.</h3>
                    <div className="num">
                      <b className="cnt" data-v="250000" style={{ fontWeight: 700 }}>
                        {storyIndex === 1 ? storyCount.toLocaleString('en-US') : '250,000'}
                      </b>
                      <span>Br raised</span>
                    </div>
                    <p>by 486 donors in 21 days</p>
                    <Link className="btn" href="/campaign/c5">
                      Help someone like Almaz
                    </Link>
                  </div>

                  <div className={`sx ${storyIndex === 2 ? 'on' : ''}`}>
                    <small>University fees · Hawassa</small>
                    <h3>The first in her family to walk through the university gates.</h3>
                    <div className="num">
                      <b className="cnt" data-v="120000" style={{ fontWeight: 700 }}>
                        {storyIndex === 2 ? storyCount.toLocaleString('en-US') : '120,000'}
                      </b>
                      <span>Br raised</span>
                    </div>
                    <p>by 312 donors in 17 days</p>
                    <Link className="btn" href="/campaign/c6">
                      Help someone like Sara
                    </Link>
                  </div>
                </div>

                <div className="dots">
                  {[0, 1, 2].map((k) => (
                    <i
                      key={k}
                      className={storyIndex === k ? 'on' : ''}
                      onClick={() => setStoryIndex(k)}
                      role="button"
                      aria-label={`Story slide ${k + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="frame">
                <div className={`si ${storyIndex === 0 ? 'on' : ''}`}>
                  <div className={`pi ph ${PHOTOS['dawit-after'] ? 'has' : ''}`} data-k="dawit-after" data-l="Add photo: Dawit, after">
                    {PHOTOS['dawit-after'] && <img src={PHOTOS['dawit-after']} alt="Dawit after surgery" />}
                  </div>
                  <span className="chip">Surgery completed</span>
                </div>

                <div className={`si ${storyIndex === 1 ? 'on' : ''}`}>
                  <div className={`pi ph ${PHOTOS['almaz-after'] ? 'has' : ''}`} data-k="almaz-after" data-l="Add photo: Almaz, after">
                    {PHOTOS['almaz-after'] && <img src={PHOTOS['almaz-after']} alt="Almaz after surgery" />}
                  </div>
                  <span className="chip">Sight restored</span>
                </div>

                <div className={`si ${storyIndex === 2 ? 'on' : ''}`}>
                  <div className={`pi ph ${PHOTOS['sara-after'] ? 'has' : ''}`} data-k="sara-after" data-l="Add photo: Sara, after">
                    {PHOTOS['sara-after'] && <img src={PHOTOS['sara-after']} alt="Sara enrolled at university" />}
                  </div>
                  <span className="chip">Enrolled this fall</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <div className="w" style={{ paddingBottom: '96px', paddingTop: '96px' }}>
          <div className="cta">
            <svg className="sprig cs1" viewBox="0 0 200 320" aria-hidden="true">
              <use href="#sprig" />
            </svg>
            <svg className="sprig cs2" viewBox="0 0 200 320" aria-hidden="true">
              <use href="#sprig" />
            </svg>
            <h2>Join + Donate + Fund = Ethiopia.</h2>
            <p>It takes about ten minutes to set up. We will guide you through each step.</p>
            <div className="row">
              <Link className="btn l" href="/dashboard/campaigns/new">
                Start a campaign
              </Link>
              <a className="btn o" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.5)' }} href="#monthly">
                Give monthly
              </a>
            </div>
            <small>Mobile apps for App Store and Google Play are coming soon.</small>
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer>
        <div className="w">
          {/* Logo on the left of footer */}
          <Link href="/" aria-label="Go Fund Me Ethiopia, home">
            <span className="lg" role="img" aria-label="Go Fund Me Ethiopia">
              <img src="/gfe-logo.png" alt="Go Fund Me Ethiopia" />
            </span>
          </Link>
          <nav aria-label="Footer">
            <Link href="/about">About</Link>
            <Link href="/how-it-works">Fees</Link>
            <Link href="/how-it-works">Help</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </div>
        <div className="w copy">
          © 2026 Go Fund Me Ethiopia · Follow @GoFundMeEthiopia · #GFE #SupportEthiopia #DigitalCharity
        </div>
      </footer>
    </>
  );
}
