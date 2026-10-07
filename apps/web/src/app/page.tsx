'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { 
  Heart, PlusCircle, User, ArrowRight, Play, Pause, 
  ChevronRight, CheckCircle2, RotateCcw 
} from 'lucide-react';
import { CAMPAIGN_DATA, HERO_SLIDES, STORIES, PHOTOS, Campaign } from '../data/campaigns';
import AttentionPopup from '../components/AttentionPopup';

// ==========================================
// SIMULATED DONATIONS FEED CONFIGURATION
// ==========================================
// TODO: Set SIMULATE_FEED = false in production when connecting to live WebSocket/SSE endpoint
const SIMULATE_FEED = true;

interface LiveDonation {
  id: string;
  donorName: string;
  amountEtb: number;
  timeAgo: string;
  timestamp: number;
}

const DONATION_POOL = [
  { name: 'Selamawit K.', amount: 1500 },
  { name: 'Meron B.', amount: 250 },
  { name: 'Henok T.', amount: 1000 },
  { name: 'Anonymous', amount: 2000 },
  { name: 'Bethlehem A.', amount: 500 },
  { name: 'Samuel & Lia', amount: 5000 },
  { name: 'Kidist M.', amount: 750 },
];

export default function EthioFundLandingPage() {
  // ------------------------------------------
  // 1. HERO SLIDESHOW STATE
  // ------------------------------------------
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Mouse tilt tracking for card
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);

  // ------------------------------------------
  // 2. LIVE DONATIONS FEED STATE (SLIDE 1 CARD)
  // ------------------------------------------
  const [raisedAmount, setRaisedAmount] = useState(0);
  const [donationsFeed, setDonationsFeed] = useState<LiveDonation[]>([
    { id: '1', donorName: 'Yonas & Tigist', amountEtb: 3000, timeAgo: 'just now', timestamp: Date.now() },
    { id: '2', donorName: 'Anonymous', amountEtb: 500, timeAgo: '1 min ago', timestamp: Date.now() - 60000 },
  ]);
  const poolIndexRef = useRef(0);

  // ------------------------------------------
  // 3. CAMPAIGNS FILTER STATE
  // ------------------------------------------
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  // ------------------------------------------
  // 4. STORY SECTION STATE
  // ------------------------------------------
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [storyCountUp, setStoryCountUp] = useState(0);

  // Track desktop breakpoint safely for SSR
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 900);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Check reduced motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // ------------------------------------------
  // HERO SLIDESHOW TIMER
  // ------------------------------------------
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (!isPlaying || isHovered || reducedMotion) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 6500);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, reducedMotion, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'SELECT') return;
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // 3D Card tilt handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !isDesktop) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: (y / rect.height) * -12,
      y: (x / rect.width) * 12,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  // ------------------------------------------
  // LIVE DONATIONS ANIMATION & STREAMING
  // ------------------------------------------
  // 1. Initial count up on load
  useEffect(() => {
    let start = 0;
    const target = 402000;
    const duration = 1600;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setRaisedAmount(target);
        clearInterval(timer);
      } else {
        setRaisedAmount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  // 2. Add donation every 3.8s if SIMULATE_FEED is enabled
  useEffect(() => {
    if (!SIMULATE_FEED || document.hidden) return;

    const interval = setInterval(() => {
      const nextDonationData = DONATION_POOL[poolIndexRef.current % DONATION_POOL.length];
      poolIndexRef.current += 1;

      setRaisedAmount((prev) => {
        if (prev >= 650000 - 60000) return prev; // Stop if near goal
        return prev + nextDonationData.amount;
      });

      setDonationsFeed((prevFeed) => {
        const newDonation: LiveDonation = {
          id: String(Date.now()),
          donorName: nextDonationData.name,
          amountEtb: nextDonationData.amount,
          timeAgo: 'just now',
          timestamp: Date.now(),
        };

        const updated = [
          newDonation,
          ...prevFeed.map((item, idx) => ({
            ...item,
            timeAgo: idx === 0 ? '1 min ago' : `${idx + 1} min ago`,
          })),
        ].slice(0, 3); // keep max 3 rows

        return updated;
      });
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  // ------------------------------------------
  // FILTERING LOGIC (AND Combination)
  // ------------------------------------------
  const filteredCampaigns = CAMPAIGN_DATA.filter((campaign) => {
    // 1. Category Filter
    let matchesCategory = true;
    if (selectedCategory === 'close-to-goal') {
      matchesCategory = campaign.percent >= 75;
    } else if (selectedCategory === 'just-launched') {
      matchesCategory = campaign.daysLive <= 7;
    } else if (selectedCategory === 'needs-momentum') {
      matchesCategory = campaign.percent < 40 && campaign.daysLive > 7;
    } else if (selectedCategory === 'charities') {
      matchesCategory = campaign.type === 'organization';
    }

    // 2. City Filter
    let matchesCity = true;
    if (selectedCity !== 'all') {
      matchesCity = campaign.city.toLowerCase().includes(selectedCity.toLowerCase());
    }

    return matchesCategory && matchesCity;
  });

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedCity('all');
  };

  // ------------------------------------------
  // STORY SECTION COUNT-UP ANIMATION
  // ------------------------------------------
  useEffect(() => {
    const target = STORIES[activeStoryIndex].number;
    let current = 0;
    const duration = 1100;
    const steps = 30;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setStoryCountUp(target);
        clearInterval(timer);
      } else {
        setStoryCountUp(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [activeStoryIndex]);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1A1A1A] font-sans">

      {/* ── Attention Popup (appears after 3s, once per session) ── */}
      <AttentionPopup />

      {/* ==========================================
          1. STICKY HEADER — GoFundMe-style layout
             Left: Search + Donate▾ (categories) + How It Works
             Center: Logo
             Right: About▾ + Sign In + Start a Campaign
      ========================================== */}
      <style>{`
        @keyframes hdrDrop {
          from { opacity:0; transform:translateY(-6px) scale(.97); }
          to   { opacity:1; transform:translateY(0)   scale(1);   }
        }
        .hdr-drop { animation: hdrDrop .16s ease; }
      `}</style>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EBEBEB]">
        <div className="max-w-[1120px] mx-auto px-6 h-[64px] flex items-center justify-between relative gap-4">

          {/* ── LEFT: Search · Donate▾ · How It Works ── */}
          <div className="hidden min-[900px]:flex items-center gap-0.5">
            {/* Search */}
            <a href="/discover"
              className="flex items-center gap-1.5 text-[14px] font-semibold text-[#1A1A1A] hover:text-[#6E6E6E] px-2.5 py-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              Search
            </a>

            {/* Donate Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-[14px] font-semibold text-[#1A1A1A] hover:text-[#6E6E6E] px-2.5 py-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors">
                Donate
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:rotate-180 duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div className="absolute left-0 top-full mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-[#EBEBEB] py-2 hidden group-hover:block hdr-drop">
                <p className="px-4 pt-1 pb-1 text-[10px] font-bold text-[#6E6E6E] uppercase tracking-widest">Categories</p>
                {[
                  { emoji: '🏥', label: 'Medical', href: '#campaigns' },
                  { emoji: '🤝', label: 'Community', href: '#campaigns' },
                  { emoji: '📚', label: 'Education', href: '#campaigns' },
                  { emoji: '🌍', label: 'Emergency', href: '#campaigns' },
                  { emoji: '🏢', label: 'Organizations', href: '#orgs' },
                ].map(({ emoji, label, href }) => (
                  <a key={label} href={href}
                    className="flex items-center gap-3 px-4 py-2 text-[14px] font-medium text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors">
                    <span className="text-base">{emoji}</span>{label}
                  </a>
                ))}
              </div>
            </div>

            {/* How It Works */}
            <a href="#ways"
              className="text-[14px] font-semibold text-[#1A1A1A] hover:text-[#6E6E6E] px-2.5 py-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors">
              How It Works
            </a>
          </div>

          {/* ── CENTER: Logo (absolutely centered) ── */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-none">
              <div className="w-[22px] h-[22px] rounded-full bg-[#CCF88E] border-2 border-[#1A1A1A] flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
              </div>
              <span className="text-[19px] font-bold tracking-tight text-[#1A1A1A]">
                WeGen
              </span>
            </Link>
          </div>

          {/* ── RIGHT: About▾ · Sign In · Start a Campaign ── */}
          <div className="hidden min-[900px]:flex items-center gap-1 ml-auto">
            {/* About Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-[14px] font-semibold text-[#1A1A1A] hover:text-[#6E6E6E] px-2.5 py-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors">
                About
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:rotate-180 duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-[#EBEBEB] py-2 hidden group-hover:block hdr-drop">
                {[
                  { label: 'About WeGen', href: '/about' },
                  { label: 'How It Works', href: '#ways' },
                  { label: 'Blog', href: '#' },
                  { label: 'Contact Us', href: '#' },
                ].map(({ label, href }) => (
                  <a key={label} href={href}
                    className="block px-4 py-2 text-[14px] font-medium text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors">
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Sign In */}
            <Link href="/auth/login"
              className="text-[14px] font-semibold text-[#1A1A1A] hover:text-[#6E6E6E] px-3 py-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors">
              Sign In
            </Link>

            {/* Start a Campaign CTA */}
            <Link href="/dashboard/campaigns/new"
              className="btn-pill btn-lime btn-small ml-1">
              Start a Campaign
            </Link>
          </div>

          {/* ── MOBILE: hamburger placeholder ── */}
          <button className="min-[900px]:hidden ml-auto p-2 rounded-lg hover:bg-[#F5F5F5]" aria-label="Open menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>

        </div>
      </header>

      {/* ==========================================
          2. HERO SLIDESHOW SECTION
      ========================================== */}
      <section 
        className="relative overflow-hidden min-h-[calc(100vh-64px)] flex flex-col justify-between py-10"
        style={{ background: 'linear-gradient(160deg, #F1FBDF 0%, #CCF88E 55%, #B6EA6C 100%)' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Orbs Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-180px] left-[-140px] w-[540px] max-[900px]:w-[320px] h-[540px] max-[900px]:h-[320px] rounded-full bg-white opacity-65 blur-[64px]" />
          <div className="absolute right-[-120px] bottom-[-160px] w-[480px] max-[900px]:w-[320px] h-[480px] max-[900px]:h-[320px] rounded-full bg-[#8FDB3E] opacity-55 blur-[64px]" />
          <div className="hidden min-[900px]:block absolute right-[34%] top-[18%] w-[300px] h-[300px] rounded-full bg-white opacity-50 blur-[64px]" />
        </div>

        {/* Main Content Grid */}
        <div className="relative z-10 max-w-[1120px] mx-auto px-6 w-full my-auto">
          <div className="grid grid-cols-1 min-[900px]:grid-cols-[1.3fr_1fr] gap-12 items-center min-h-[500px]">

            {/* TEXT COLUMN — static, never changes with slide */}
            <div className="space-y-6">

              {/* H1 Heading */}
              <div className="space-y-1">
                <h1 className="text-[clamp(88px,12vw,208px)] font-bold leading-[1.02] tracking-normal text-[#1A1A1A] block">
                  {HERO_SLIDES[0].amharic}
                </h1>
                <p className="text-[clamp(24px,3.5vw,46px)] font-medium leading-[1.15] text-[#1A1A1A] max-w-[14em]">
                  {HERO_SLIDES[0].english}
                </p>
              </div>

              {/* Lead Paragraph */}
              <p className="text-[#1A1A1A]/80 text-base min-[900px]:text-lg max-w-[500px] leading-relaxed">
                {HERO_SLIDES[0].lead}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {HERO_SLIDES[0].buttons.map((btn, idx) => (
                  <Link
                    key={idx}
                    href={btn.href}
                    className={`btn-pill ${btn.type === 'dark' ? 'btn-dark' : 'btn-outline'}`}
                  >
                    {btn.text}
                  </Link>
                ))}
              </div>
            </div>

            {/* FEATURED CARD COLUMN */}
            <div className="relative flex justify-center min-[900px]:justify-end">
              <div 
                className="glass-card-hero w-full max-w-[420px] p-6 transition-transform duration-300 relative"
                style={{
                  transform: isDesktop && !reducedMotion
                    ? `perspective(1000px) rotateY(${tilt.y}deg) rotateX(${tilt.x}deg)`
                    : 'none',
                }}
              >
                {/* Photo Container */}
                <div className="relative h-[210px] w-full rounded-[20px] overflow-hidden bg-slate-200 mb-5">
                  <img 
                    src={PHOTOS[slide.card.photoKey] || PHOTOS['dawit']} 
                    alt={slide.card.title} 
                    className="w-full h-full object-cover"
                  />
                  {currentSlide === 0 && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#1A1A1A] flex items-center gap-2 shadow-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                      </span>
                      Live now
                    </div>
                  )}
                </div>

                {/* Card Title & Subtitle */}
                <h3 className="font-heading font-bold text-lg leading-tight mb-1 text-[#1A1A1A]">
                  {slide.card.title}
                </h3>
                <p className="text-xs text-[#6E6E6E] font-medium mb-4">
                  {slide.card.sub}
                </p>

                {/* Progress Bar & Amounts */}
                <div className="space-y-3">
                  <div className="w-full h-2.5 bg-[#EBEBEB] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#1A1A1A] transition-all duration-1000 rounded-full"
                      style={{ 
                        width: currentSlide === 0 
                          ? `${Math.min(100, (raisedAmount / slide.card.goalEtb) * 100)}%`
                          : `${slide.card.percent}%` 
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>
                      {currentSlide === 0 ? raisedAmount.toLocaleString() : slide.card.raisedEtb.toLocaleString()} of {slide.card.goalEtb.toLocaleString()} ETB
                    </span>
                    <span className="text-[#6E6E6E]">
                      {currentSlide === 0 ? Math.round((raisedAmount / slide.card.goalEtb) * 100) : slide.card.percent}%
                    </span>
                  </div>
                </div>

                {/* Live Donations Feed (Slide 1) */}
                {currentSlide === 0 && (
                  <div className="mt-5 pt-4 border-t border-[#1A1A1A]/10 space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#6E6E6E]">
                      Live Donations Feed
                    </div>
                    <div className="space-y-1.5 min-h-[90px]">
                      {donationsFeed.map((donation, idx) => (
                        <div 
                          key={donation.id}
                          className="flex items-center justify-between text-xs bg-white/70 backdrop-blur-sm p-2 rounded-xl transition-all duration-500"
                          style={{ opacity: idx === 0 ? 1 : idx === 1 ? 0.6 : 0.3 }}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            <span className="font-semibold text-[#1A1A1A]">{donation.donorName}</span>
                            <span className="text-[#6E6E6E] text-[10px]">· {donation.timeAgo}</span>
                          </div>
                          <span className="font-bold text-emerald-700">+{donation.amountEtb.toLocaleString()} ETB</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Floating Chips — removed */}

              </div>
            </div>

          </div>
        </div>

        {/* CONTROLS AT BOTTOM */}
        <div className="relative z-10 max-w-[1120px] mx-auto px-6 w-full flex items-center justify-between pt-6">
          
          {/* Slide Progress Bars */}
          <div className="flex items-center gap-3">
            {HERO_SLIDES.map((s, index) => {
              const isActive = index === currentSlide;
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(index)}
                  className="w-12 h-6 flex items-center focus-visible:outline-none"
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={isActive ? 'true' : 'false'}
                >
                  <div className="w-full h-1.5 bg-[#1A1A1A]/20 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-[#1A1A1A] rounded-full transition-all ${isActive && isPlaying && !isHovered ? 'w-full ease-linear' : isActive ? 'w-full' : 'w-0'}`}
                      style={{ transitionDuration: isActive && isPlaying && !isHovered ? '6500ms' : '300ms' }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Pause / Play Toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-md border border-[#1A1A1A]/10 flex items-center justify-center text-[#1A1A1A] transition-all"
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-[#1A1A1A]" /> : <Play className="w-3.5 h-3.5 fill-[#1A1A1A] ml-0.5" />}
          </button>

        </div>
      </section>

      {/* ==========================================
          3. THREE WAYS TO RAISE MONEY (#ways)
      ========================================== */}
      <section id="ways" className="py-[88px] max-[900px]:py-[56px] section-border">
        <div className="max-w-[1120px] mx-auto px-6">
          <h2 className="text-3xl min-[900px]:text-4xl font-bold mb-12 text-[#1A1A1A]">
            Three ways to raise money
          </h2>

          <div className="grid grid-cols-1 min-[900px]:grid-cols-3 border-y border-[#EBEBEB]">
            
            {/* Column 1: For yourself */}
            <div className="p-8 min-[900px]:pr-10 min-[900px]:border-r border-[#EBEBEB] space-y-4 max-[900px]:border-b">
              <h3 className="text-xl font-bold text-[#1A1A1A]">For yourself</h3>
              <p className="text-[#6E6E6E] text-base leading-relaxed">
                Tell your own story with a video, your documents and updates as things change.
              </p>
              <Link href="/dashboard/campaigns/new" className="inline-block font-bold text-[#1A1A1A] underline hover:text-[#6E6E6E] pt-2">
                Start personally →
              </Link>
            </div>

            {/* Column 2: For someone else */}
            <div className="p-8 min-[900px]:px-10 min-[900px]:border-r border-[#EBEBEB] space-y-4 max-[900px]:border-b">
              <h3 className="text-xl font-bold text-[#1A1A1A]">For someone else</h3>
              <p className="text-[#6E6E6E] text-base leading-relaxed">
                Know a family in need? Refer them, with their consent, and we guide you through verification.
              </p>
              <Link href="/dashboard/campaigns/new?type=referral" className="inline-block font-bold text-[#1A1A1A] underline hover:text-[#6E6E6E] pt-2">
                Refer someone →
              </Link>
            </div>

            {/* Column 3: For your organization */}
            <div id="orgs" className="p-8 min-[900px]:pl-10 space-y-4">
              <h3 className="text-xl font-bold text-[#1A1A1A]">For your organization</h3>
              <p className="text-[#6E6E6E] text-base leading-relaxed">
                Run several campaigns, add your team and give monthly donors a way to stay with you.
              </p>
              <Link href="/organizations" className="inline-block font-bold text-[#1A1A1A] underline hover:text-[#6E6E6E] pt-2">
                See organization plans →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          4. VERIFICATION SECTION (#trust)
      ========================================== */}
      <section id="trust" className="py-[88px] max-[900px]:py-[56px] section-border">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="grid grid-cols-1 min-[900px]:grid-cols-2 gap-12 items-start">
            
            {/* Left Description */}
            <div className="space-y-6">
              <h2 className="text-3xl min-[900px]:text-4xl font-bold leading-tight text-[#1A1A1A]">
                Every campaign is checked before it goes live
              </h2>
              <p className="text-[#6E6E6E] text-lg leading-relaxed">
                Documents stay private and are seen only by our verification team. Donors see a verified badge, the story and regular updates from the campaign owner.
              </p>
            </div>

            {/* Right Steps */}
            <div className="divide-y divide-[#EBEBEB]">
              
              <div className="flex items-start gap-5 py-6 first:pt-0">
                <div className="w-[30px] h-[30px] rounded-full bg-[#CCF88E] text-[#1A1A1A] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg text-[#1A1A1A]">Share your story</h4>
                  <p className="text-[#6E6E6E] text-base">Add a video, a short description and your goal in Birr.</p>
                </div>
              </div>

              <div className="flex items-start gap-5 py-6">
                <div className="w-[30px] h-[30px] rounded-full bg-[#CCF88E] text-[#1A1A1A] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg text-[#1A1A1A]">Upload documents</h4>
                  <p className="text-[#6E6E6E] text-base">ID, medical or school letters and a kebele letter, kept private.</p>
                </div>
              </div>

              <div className="flex items-start gap-5 py-6">
                <div className="w-[30px] h-[30px] rounded-full bg-[#CCF88E] text-[#1A1A1A] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg text-[#1A1A1A]">We review within 48 hours</h4>
                  <p className="text-[#6E6E6E] text-base">Our team checks everything and tells you if anything is missing.</p>
                </div>
              </div>

              <div className="flex items-start gap-5 py-6 last:pb-0">
                <div className="w-[30px] h-[30px] rounded-full bg-[#CCF88E] text-[#1A1A1A] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  4
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg text-[#1A1A1A]">Receive donations</h4>
                  <p className="text-[#6E6E6E] text-base">Withdraw to your account once the campaign is approved.</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          5. CAMPAIGNS CATALOG & FILTERS (#campaigns)
      ========================================== */}
      <section id="campaigns" className="py-[88px] max-[900px]:py-[56px] section-border">
        <div className="max-w-[1120px] mx-auto px-6">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-3xl min-[900px]:text-4xl font-bold text-[#1A1A1A]">
              People you can help today
            </h2>
            <Link href="/discover" className="font-bold text-[#1A1A1A] underline hover:text-[#6E6E6E]">
              View all campaigns →
            </Link>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-[#F6F6F6] p-3 rounded-2xl border border-[#EBEBEB]">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              
              {/* Category Dropdown */}
              <div className="relative flex-1 sm:flex-initial">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="custom-select w-full bg-white text-[#1A1A1A] font-medium text-sm px-4 py-2.5 rounded-xl border border-[#EBEBEB] focus:outline-none cursor-pointer"
                  aria-label="Filter by category"
                >
                  <option value="all">All campaigns</option>
                  <option value="close-to-goal">Close to goal</option>
                  <option value="just-launched">Just launched</option>
                  <option value="needs-momentum">Needs momentum</option>
                  <option value="charities">Charities</option>
                </select>
              </div>

              {/* City Dropdown */}
              <div className="relative flex-1 sm:flex-initial">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="custom-select w-full bg-white text-[#1A1A1A] font-medium text-sm px-4 py-2.5 rounded-xl border border-[#EBEBEB] focus:outline-none cursor-pointer"
                  aria-label="Filter by city"
                >
                  <option value="all">All cities</option>
                  <option value="addis ababa">Addis Ababa</option>
                  <option value="adama">Adama</option>
                  <option value="bahir dar">Bahir Dar</option>
                  <option value="dire dawa">Dire Dawa</option>
                  <option value="gondar">Gondar</option>
                  <option value="hawassa">Hawassa</option>
                  <option value="jimma">Jimma</option>
                  <option value="mekelle">Mekelle</option>
                  <option value="wolkite">Wolkite</option>
                </select>
              </div>

            </div>

            {/* Live Count Announcement */}
            <div 
              className="text-sm font-semibold text-[#6E6E6E] px-2"
              aria-live="polite"
            >
              {filteredCampaigns.length} {filteredCampaigns.length === 1 ? 'campaign' : 'campaigns'}
            </div>
          </div>

          {/* Campaign Grid */}
          {filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((c) => (
                <Link
                  key={c.id}
                  href={`/campaign/${c.id}`}
                  className="bg-white rounded-3xl border border-[#EBEBEB] p-5 flex flex-col justify-between cursor-pointer group transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-[#B6EA6C]/60"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="space-y-4">
                    {/* Photo Container */}
                    <div className="relative h-[210px] w-full rounded-[20px] overflow-hidden bg-gradient-to-tr from-[#CCF88E]/40 to-[#F1FBDF] flex items-center justify-center">
                      {PHOTOS[c.photoKey] ? (
                        <img
                          src={PHOTOS[c.photoKey]}
                          alt={c.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <span className="bg-white/90 text-xs font-bold text-[#1A1A1A] px-3 py-1.5 rounded-full border border-white/60">
                            Add photo: {c.title.split(' ')[0]}
                          </span>
                        </div>
                      )}

                      {/* Tag Pill */}
                      <div className="absolute top-3 left-3 bg-[#CCF88E] text-[#1A1A1A] font-bold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider border border-[#1A1A1A]/10">
                        {c.type === 'organization' ? 'Organization' : 'Verified'}
                      </div>

                      {/* Donate CTA overlay on hover */}
                      <div className="absolute inset-0 bg-[#1A1A1A]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-[20px]">
                        <span className="bg-white text-[#1A1A1A] font-bold text-sm px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                          Donate now
                        </span>
                      </div>
                    </div>

                    {/* Title & City */}
                    <div>
                      <h3 className="font-heading font-bold text-lg leading-snug text-[#1A1A1A] line-clamp-2 group-hover:text-[#4A7A1A] transition-colors">
                        {c.title}
                      </h3>
                      <p className="text-xs text-[#6E6E6E] font-medium mt-1">
                        {c.city}
                      </p>
                    </div>
                  </div>

                  {/* Progress & Goal */}
                  <div className="mt-6 pt-4 border-t border-[#EBEBEB] space-y-2">
                    <div className="w-full h-[6px] bg-[#EBEBEB] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#B6EA6C] rounded-full"
                        style={{ width: `${c.percent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>
                        {c.raisedEtb.toLocaleString()} <span className="text-[#6E6E6E] font-normal">of {c.goalEtb.toLocaleString()} ETB</span>
                      </span>
                      <span className="text-[#1A1A1A]">{c.percent}%</span>
                    </div>
                  </div>

                </Link>
              ))}
            </div>

          ) : (
            /* Empty State */
            <div className="border-2 border-dashed border-[#EBEBEB] rounded-3xl p-12 text-center space-y-4">
              <p className="text-[#6E6E6E] text-base font-medium">
                No campaigns match these filters yet.
              </p>
              <button
                onClick={handleResetFilters}
                className="btn-pill btn-outline btn-small"
              >
                <RotateCcw className="w-4 h-4" />
                Show all campaigns
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ==========================================
          6. STICKY SCROLL STORY SECTION
      ========================================== */}
      <section className="py-[88px] max-[900px]:py-[56px] section-border bg-[#F6F6F6]">
        <div className="max-w-[1120px] mx-auto px-6 space-y-8">
          
          <h2 className="text-3xl min-[900px]:text-4xl font-bold text-[#1A1A1A]">
            Because of donors like you
          </h2>

          {/* Story Selector Bar */}
          <div className="flex gap-2 border-b border-[#EBEBEB] pb-4">
            {STORIES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveStoryIndex(idx)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeStoryIndex === idx ? 'bg-[#1A1A1A] text-white' : 'bg-white text-[#1A1A1A] hover:bg-[#EBEBEB]'}`}
              >
                Story {idx + 1}: {s.label.split('·')[0]}
              </button>
            ))}
          </div>

          {/* Story Stage */}
          <div className="grid grid-cols-1 min-[900px]:grid-cols-2 gap-12 items-center bg-white p-8 min-[900px]:p-12 rounded-[32px] border border-[#EBEBEB] shadow-sm">
            
            {/* Story Text */}
            <div className="space-y-6">
              <div className="text-xs font-bold uppercase tracking-wider text-[#6E6E6E]">
                {STORIES[activeStoryIndex].label}
              </div>

              <h3 className="text-2xl min-[900px]:text-3xl font-bold leading-tight text-[#1A1A1A]">
                {STORIES[activeStoryIndex].headline}
              </h3>

              <div className="space-y-1">
                <div className="text-4xl min-[900px]:text-5xl font-bold text-[#1A1A1A] font-heading">
                  {storyCountUp.toLocaleString()} ETB raised
                </div>
                <div className="text-sm font-medium text-[#6E6E6E]">
                  {STORIES[activeStoryIndex].detail}
                </div>
              </div>

              <div className="pt-2">
                <Link href="#campaigns" className="btn-pill btn-lime">
                  {STORIES[activeStoryIndex].buttonText}
                </Link>
              </div>
            </div>

            {/* Story Photo Frame */}
            <div className="relative h-[340px] min-[900px]:h-[440px] rounded-[32px] overflow-hidden bg-[#CCF88E]">
              <img 
                src={STORIES[activeStoryIndex].photoUrl} 
                alt={STORIES[activeStoryIndex].headline} 
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute bottom-4 right-4 bg-white text-[#1A1A1A] font-bold text-xs px-4 py-2 rounded-full shadow-lg border border-[#EBEBEB]">
                ✓ {STORIES[activeStoryIndex].photoChip}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ==========================================
          7. STATS SECTION
      ========================================== */}
      <section className="py-[88px] max-[900px]:py-[56px] section-border">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="grid grid-cols-2 min-[900px]:grid-cols-4 divide-x divide-[#EBEBEB] text-center">
            
            <div className="p-6 space-y-1">
              <div className="text-[clamp(32px,4vw,52px)] font-bold text-[#1A1A1A] font-heading leading-none">
                12.4M
              </div>
              <div className="text-sm font-medium text-[#6E6E6E]">ETB raised</div>
            </div>

            <div className="p-6 space-y-1">
              <div className="text-[clamp(32px,4vw,52px)] font-bold text-[#1A1A1A] font-heading leading-none">
                1,280
              </div>
              <div className="text-sm font-medium text-[#6E6E6E]">campaigns verified</div>
            </div>

            <div className="p-6 space-y-1">
              <div className="text-[clamp(32px,4vw,52px)] font-bold text-[#1A1A1A] font-heading leading-none">
                34,000
              </div>
              <div className="text-sm font-medium text-[#6E6E6E]">donors</div>
            </div>

            <div className="p-6 space-y-1">
              <div className="text-[clamp(32px,4vw,52px)] font-bold text-[#1A1A1A] font-heading leading-none">
                11
              </div>
              <div className="text-sm font-medium text-[#6E6E6E]">regions reached</div>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          8. FINAL CALL TO ACTION
      ========================================== */}
      <section className="py-[88px] max-[900px]:py-[56px] section-border">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="bg-[#CCF88E] rounded-[32px] p-12 min-[900px]:p-16 text-center space-y-6">
            <h2 className="text-3xl min-[900px]:text-4xl font-bold text-[#1A1A1A]">
              Ready to ask for help?
            </h2>
            <p className="text-[#1A1A1A]/80 text-lg max-w-[600px] mx-auto leading-relaxed">
              It takes about ten minutes to set up. We will guide you through each step.
            </p>
            <div>
              <Link href="/dashboard/campaigns/new" className="btn-pill btn-dark">
                Start a campaign
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          9. FOOTER
      ========================================== */}
      <footer className="border-t border-[#EBEBEB] py-12 bg-white text-[#1A1A1A]">
        <div className="max-w-[1120px] mx-auto px-6 flex flex-col min-[900px]:flex-row items-center justify-between gap-6 text-sm">
          <div className="text-[#6E6E6E]">
            © 2026 Ethio Fund. Addis Ababa, Ethiopia.
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium">
            <Link href="/about" className="hover:text-[#6E6E6E] transition-colors">About</Link>
            <Link href="/how-it-works" className="hover:text-[#6E6E6E] transition-colors">Fees</Link>
            <Link href="/how-it-works" className="hover:text-[#6E6E6E] transition-colors">Help</Link>
            <Link href="/privacy" className="hover:text-[#6E6E6E] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#6E6E6E] transition-colors">Terms</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
