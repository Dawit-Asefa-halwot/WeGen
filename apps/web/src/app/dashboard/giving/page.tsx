'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { apiRequest } from '../../../lib/api-client';

interface DonationItem {
  id?: string;
  amt: number;
  at: number;
  t: string;
  slug?: string;
}

interface DonorProfile {
  name?: string;
  photo?: string;
}

const SH = 'M14,20 Q113,-8 212,20 Q227,24 225,38 L203,162 Q200,178 185,177 Q113,164 41,177 Q26,178 23,162 L1,38 Q-1,24 14,20Z';

const sampleDonations = (): DonationItem[] => {
  const d = (n: number) => Date.now() - n * 864e5;
  return [
    { amt: 500, at: d(3), t: 'Cataract surgery for W/ro Almaz', slug: 'cataract-surgery-almaz' },
    { amt: 1000, at: d(21), t: 'Clean water for three Gurage villages', slug: 'emergency-clean-water-well' },
    { amt: 200, at: d(40), t: 'Cataract surgery for W/ro Almaz', slug: 'cataract-surgery-almaz' },
    { amt: 300, at: d(75), t: 'School fees for Sara’s first year at university', slug: 'rebuilding-classroom-desks' },
  ];
};

const f0 = (n: number) => Math.round(n).toLocaleString('en-US');
const fd = (t: number) =>
  new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

// Official Ethio Fund circular stamp component
function OfficialStamp({ sz = 150 }: { sz?: number }) {
  const t = 'OFFICIAL GIVING RECORD • ETHIO FUND • ';
  const n = t.length;
  const ch = [...t].map((c, i) => (
    <text
      key={i}
      x="100"
      y="33"
      textAnchor="middle"
      transform={`rotate(${((i * 360) / n).toFixed(2)} 100 100)`}
    >
      {c === ' ' ? '\u00A0' : c}
    </text>
  ));

  return (
    <svg
      className="stamp shrink-0"
      width={sz}
      height={sz}
      viewBox="0 0 200 200"
      role="img"
      aria-label="Ethio Fund official stamp"
      style={{ transform: 'rotate(-12deg)' }}
    >
      <defs>
        <filter id="ink" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={2} seed={4} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.8" />
        </filter>
      </defs>
      <g filter="url(#ink)" fill="#2F5D2A" stroke="#2F5D2A" opacity="0.9">
        <circle cx="100" cy="100" r="95" fill="none" strokeWidth="5" />
        <circle cx="100" cy="100" r="86" fill="none" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="57" fill="none" strokeWidth="1.5" />
        <g stroke="none" fontFamily="Figtree, system-ui, sans-serif" fontWeight="700" fontSize="13">
          {ch}
        </g>
        <circle cx="100" cy="72" r="9" fill="none" strokeWidth="3" />
        <g
          stroke="none"
          fontFamily="Bricolage Grotesque, system-ui, sans-serif"
          fontWeight="700"
          fontSize="25"
          textAnchor="middle"
        >
          <text x="100" y="108">ETHIO</text>
          <text x="100" y="133">FUND</text>
        </g>
      </g>
    </svg>
  );
}

export default function DonorDashboardPage() {
  const [profile, setProfile] = useState<DonorProfile>({});
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [monthlyStatus, setMonthlyStatus] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>('selam@example.com');
  const [realMode, setRealMode] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<'returning' | 'new'>('returning');
  const [loadingDb, setLoadingDb] = useState<boolean>(true);

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [editingName, setEditingName] = useState<boolean>(false);
  const [photoMsg, setPhotoMsg] = useState<string>('');
  const [tempName, setTempName] = useState<string>('');

  // Document modal states
  const [docType, setDocType] = useState<string | null>(null);
  const [docPeriod, setDocPeriod] = useState<string>('all');
  const [zoomFactor, setZoomFactor] = useState<number>(1);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const docBodyRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Initialize from API database & local fallback
  useEffect(() => {
    async function loadData() {
      try {
        // 1. Load cached donor profile / user
        const storedDonor = localStorage.getItem('ethiofund-donor');
        if (storedDonor) {
          const parsed = JSON.parse(storedDonor);
          setProfile(parsed);
          if (parsed.name) setTempName(parsed.name);
        }

        let activeEmail = 'donor@wegen.et';
        const storedWegenUser = localStorage.getItem('wegen_user');
        if (storedWegenUser) {
          const wu = JSON.parse(storedWegenUser);
          if (wu.email) {
            activeEmail = wu.email;
            setUserEmail(wu.email);
          }
          if (!storedDonor && (wu.firstName || wu.lastName)) {
            const fullName = `${wu.firstName || ''} ${wu.lastName || ''}`.trim();
            setProfile((prev) => ({ ...prev, name: fullName }));
            setTempName(fullName);
          }
        } else {
          const storedEthioUser = localStorage.getItem('ethiofund-user');
          if (storedEthioUser) {
            const u = JSON.parse(storedEthioUser);
            if (u.email) {
              activeEmail = u.email;
              setUserEmail(u.email);
            }
          }
        }

        // 2. Fetch from WeGen Database API (/donations/my-donations)
        const emailParam = encodeURIComponent(activeEmail);
        const res = await apiRequest<any[]>(`/donations/my-donations?email=${emailParam}`);
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: DonationItem[] = res.data.map((item: any) => ({
            id: item.id || item.donationReference,
            amt: Number(item.amountEtb || item.amountCents / 100 || 0),
            at: new Date(item.createdAt).getTime(),
            t: item.campaignTitle || 'Ethio Fund campaign',
            slug: item.campaignSlug || 'help-chala-cardiac-surgery',
          }));
          setDonations(mapped);
          setRealMode(true);
          setLoadingDb(false);
          return;
        }

        // 3. Fallback to localStorage records if API returned empty
        const storedDg = localStorage.getItem('ethiofund-donations');
        if (storedDg) {
          const arr = JSON.parse(storedDg);
          if (Array.isArray(arr) && arr.length > 0) {
            setDonations(
              arr.map((x) => ({
                ...x,
                slug: x.slug || 'help-chala-cardiac-surgery',
              }))
            );
            setRealMode(true);
          }
        }

        const storedMonthly = localStorage.getItem('ethiofund-monthly');
        if (storedMonthly) {
          setMonthlyStatus(JSON.parse(storedMonthly));
        }
      } catch (e) {
        // error handling
      } finally {
        setLoadingDb(false);
      }
    }

    loadData();
  }, []);

  // Save profile changes
  const saveProfile = (updated: DonorProfile) => {
    setProfile(updated);
    try {
      localStorage.setItem('ethiofund-donor', JSON.stringify(updated));
    } catch (e) {
      setPhotoMsg('Could not save data.');
    }
  };

  const getDonorName = () => {
    if (profile.name && profile.name.trim()) return profile.name.trim();
    if (userEmail) {
      const part = userEmail.split('@')[0];
      return part.charAt(0).toUpperCase() + part.slice(1);
    }
    return 'friend';
  };

  const activeDonations: DonationItem[] = realMode
    ? donations
    : previewMode === 'new'
    ? []
    : sampleDonations();

  const totalAmount = activeDonations.reduce((acc, d) => acc + d.amt, 0);

  // Aggregation by campaign
  const byCampaign: Record<string, { t: string; amt: number; n: number; last: number; slug: string }> = {};
  activeDonations.forEach((d) => {
    const k = d.t || 'Ethio Fund campaign';
    const slug = d.slug || 'help-chala-cardiac-surgery';
    const obj = (byCampaign[k] = byCampaign[k] || { t: k, amt: 0, n: 0, last: 0, slug });
    obj.amt += d.amt;
    obj.n += 1;
    obj.last = Math.max(obj.last, d.at);
  });
  const peopleList = Object.values(byCampaign).sort((a, b) => b.amt - a.amt);
  const peopleCount = peopleList.length;

  // Badges calculation
  const isMonthlyActive = monthlyStatus && monthlyStatus.status === 'active';
  const BADGES = [
    { icon: '🌱', title: 'First gift', desc: 'Make your first donation', cur: activeDonations.length, target: 1, unit: 'gift' },
    { icon: '🤝', title: 'Helping hand', desc: 'Give 3 times', cur: activeDonations.length, target: 3, unit: 'gift' },
    { icon: '🌍', title: 'Community builder', desc: 'Help 3 different people', cur: peopleCount, target: 3, unit: 'person' },
    { icon: '💚', title: 'Generous heart', desc: 'Give 1,000 ETB in total', cur: totalAmount, target: 1000, unit: 'ETB' },
    { icon: '🔁', title: 'Monthly giver', desc: 'Start a monthly gift', cur: isMonthlyActive ? 1 : 0, target: 1, unit: 'plan' },
    { icon: '🏆', title: 'Champion', desc: 'Give 10,000 ETB in total', cur: totalAmount, target: 10000, unit: 'ETB' },
  ];

  const earnedBadges = BADGES.filter((b) => b.cur >= b.target);
  const nextBadge = BADGES.filter((b) => b.cur < b.target).sort(
    (a, b) => b.cur / b.target - a.cur / a.target
  )[0];

  const getLeftText = (b: typeof BADGES[0]) => {
    if (b.unit === 'ETB') return `${f0(b.target - b.cur)} ETB more`;
    if (b.unit === 'plan') return 'Start a monthly gift';
    const rem = b.target - b.cur;
    return `${rem} more ${b.unit}${rem > 1 ? 's' : ''}`;
  };

  // Certificate / Statement helper codes
  const getDocNumber = (kind: string, list: DonationItem[]) => {
    let h = 0;
    const str = getDonorName() + list.length + list.reduce((t, d) => t + d.amt, 0) + kind;
    for (const c of str) {
      h = ((h * 31 + c.charCodeAt(0)) >>> 0);
    }
    return `EF-${kind}-${h.toString(36).toUpperCase().padStart(6, '0').slice(-6)}`;
  };

  const getEarnedDate = (badgeIndex: number) => {
    let n = 0;
    let t = 0;
    const q = new Set<string>();
    const sorted = [...activeDonations].sort((a, b) => a.at - b.at);
    for (const x of sorted) {
      n++;
      t += x.amt;
      q.add(x.t || 'x');
      const conditions = [n >= 1, n >= 3, q.size >= 3, t >= 1000, false, t >= 10000];
      if (conditions[badgeIndex]) return x.at;
    }
    return Date.now();
  };

  const badgeDescriptions = [
    (f: DonationItem) => (
      <span>
        for making their first gift of <b>{f0(f?.amt || 0)} ETB</b> to <b>{f?.t || 'an Ethio Fund campaign'}</b>
      </span>
    ),
    () => <span>for giving three times and showing up for others again and again</span>,
    () => <span>for helping three different people</span>,
    () => <span>for giving 1,000 ETB in total</span>,
    () => <span>for starting a monthly gift that helps someone every month</span>,
    () => <span>for giving 10,000 ETB in total</span>,
  ];

  // Photo upload handling
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) {
      setPhotoMsg('Choose an image under 10 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const W = 452;
        const H = 364;
        const canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        const k = Math.max(W / img.width, H / img.height);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, (W - img.width * k) / 2, (H - img.height * k) / 2, img.width * k, img.height * k);
          const photoUrl = canvas.toDataURL('image/jpeg', 0.85);
          saveProfile({ ...profile, photo: photoUrl });
          setPhotoMsg('');
        }
      };
      img.onerror = () => setPhotoMsg('We could not read that photo.');
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Resize listener for document modal
  useEffect(() => {
    if (docType && docBodyRef.current) {
      const w = docBodyRef.current.clientWidth;
      setZoomFactor(Math.min(1, (w - 16) / 794));
    }
  }, [docType]);

  // Robust PDF / Print handler that guarantees exact design rendering
  const handleDownloadPdf = () => {
    const el = document.getElementById('print-document-node');
    if (!el) return;

    // Direct native print with pd class for 100% fidelity
    document.body.classList.add('pd');
    
    // Also use hidden iframe method to guarantee clean printable document without popup blocker issues
    try {
      const existingIframe = document.getElementById('print-doc-iframe');
      if (existingIframe) existingIframe.remove();

      const iframe = document.createElement('iframe');
      iframe.id = 'print-doc-iframe';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${docType?.startsWith('cert:') ? 'Certificate of Generosity' : 'Giving Statement'} · Ethio Fund</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=Figtree:wght@400;500;600&family=Noto+Sans+Ethiopic:wght@500;700&display=swap" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { background: #fff; color: #1A1A1A; font-family: 'Figtree', 'Noto Sans Ethiopic', system-ui, sans-serif; display: flex; justify-content: center; }
    .font-display { font-family: 'Bricolage Grotesque', 'Noto Sans Ethiopic', system-ui, sans-serif; }
    .paper { width: 794px; min-height: 1123px; background: #fff; margin: 0 auto; position: relative; overflow: hidden; color: #1A1A1A; font: 14px/1.5 'Figtree', sans-serif; }
    .pbar { height: 12px; background: linear-gradient(90deg, #CCF88E, #6E9A4A 60%, #22421E); }
    .pin { padding: 44px 56px 48px; }
    .ph { display: flex; justify-content: space-between; align-items: flex-start; }
    .plogo { display: flex; align-items: center; gap: 10px; font: 700 24px 'Bricolage Grotesque', sans-serif; }
    .plogo i { width: 28px; height: 28px; border-radius: 50%; background: #CCF88E; border: 3px solid #1A1A1A; display: inline-block; font-style: normal; }
    .pm2 { text-align: right; display: grid; gap: 2px; font-size: 12px; color: #6E6E6E; }
    .pm2 b { font: 700 15px 'Bricolage Grotesque', sans-serif; letter-spacing: .08em; color: #1A1A1A; }
    .pt { margin: 44px 0 26px; padding: 30px 32px; border-radius: 24px; background: linear-gradient(135deg, #E9FBCF, #CDF68E 60%, #B6EA6C); }
    .pt small { font-weight: 600; opacity: .65; display: block; }
    .pt h1 { font: 700 44px/1.05 'Bricolage Grotesque', sans-serif; letter-spacing: -.02em; margin: 2px 0 4px; overflow-wrap: anywhere; }
    .pt p { margin: 0; }
    .ps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 28px; }
    .ps div { border: 1px solid #EBEBEB; border-radius: 18px; padding: 14px 18px; }
    .ps b { display: block; font: 700 28px/1.1 'Bricolage Grotesque', sans-serif; }
    .ps span { color: #6E6E6E; font-size: 12px; }
    .pt2 { width: 100%; border-collapse: collapse; }
    .pt2 th { text-align: left; font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: #6E6E6E; padding: 8px 10px; border-bottom: 2px solid #1A1A1A; }
    .pt2 td { padding: 10px; border-bottom: 1px solid #EBEBEB; }
    .pt2 tr { break-inside: avoid; }
    .pt2 .r { text-align: right; }
    .pt2 .tt td { font-weight: 700; border-bottom: 0; background: #F6F6F6; }
    .pf2 { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; break-inside: avoid; }
    .sig { width: 220px; }
    .sig .ln { border-top: 1.5px solid #1A1A1A; margin-bottom: 6px; }
    .sig b { display: block; }
    .sig span { font-size: 12px; color: #6E6E6E; }
    .fine { font-size: 11px; color: #6E6E6E; margin-top: 22px; }
    .wm { position: absolute; inset: 0; display: grid; place-items: center; font: 700 150px 'Bricolage Grotesque', sans-serif; color: rgba(26,26,26,.05); transform: rotate(-30deg); pointer-events: none; letter-spacing: .1em; user-select: none; }
    .cert { background: linear-gradient(180deg, #fff, #F6FFE6); }
    .cb1 { position: absolute; inset: 26px; border: 3px solid #2F5D2A; border-radius: 6px; pointer-events: none; }
    .cb2 { position: absolute; inset: 8px; border: 1px solid #6E9A4A; border-radius: 3px; pointer-events: none; }
    .cin { position: relative; height: 100%; min-height: 1123px; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 70px 76px 60px; box-sizing: border-box; }
    .ey { letter-spacing: .35em; font-weight: 700; color: #2F5D2A; margin-top: 30px; font-size: 13px; }
    .cph { position: relative; display: inline-block; background: linear-gradient(155deg, #E9FBCF 0%, #CDF68E 22%, #6E9A4A 55%, #22421E 100%); border-radius: 28px; padding: 30px 80px 26px; margin: 20px 0 10px; }
    .cph svg { display: block; }
    .cbd { position: absolute; right: 44px; bottom: -24px; width: 84px; height: 84px; border-radius: 50%; background: #fff; border: 4px solid #2F5D2A; display: grid; place-items: center; font-size: 44px; box-shadow: 0 8px 20px rgba(0,0,0,.25); }
    .bn { letter-spacing: .2em; font-weight: 700; font-size: 13px; color: #2F5D2A; margin: 26px 0 2px; }
    .pre { color: #6E6E6E; margin: 8px 0; font-size: 14px; }
    .cn { font: 700 64px/1.05 'Bricolage Grotesque', sans-serif; letter-spacing: -.02em; margin: 6px 0 22px; overflow-wrap: anywhere; color: #1A1A1A; }
    .ctx { font-size: 18px; line-height: 1.7; max-width: 540px; color: #1A1A1A; }
    .cf { display: flex; justify-content: space-between; align-items: flex-end; width: 100%; margin-top: auto; padding-top: 60px; text-align: left; }
    .stamp { transform: rotate(-12deg); flex: none; }
  </style>
</head>
<body>
  ${el.outerHTML}
</body>
</html>`);
        doc.close();

        // Remove any zoom on print element inside iframe
        const frameDocNode = doc.getElementById('print-document-node');
        if (frameDocNode) {
          (frameDocNode as HTMLElement).style.zoom = '1';
        }

        setTimeout(() => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          document.body.classList.remove('pd');
        }, 300);
        return;
      }
    } catch (err) {
      console.warn('Iframe print error, falling back to window.print', err);
    }

    // Fallback directly to native window print with class pd
    window.onafterprint = () => {
      document.body.classList.remove('pd');
    };
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const donorInitial = (getDonorName()[0] || 'D').toUpperCase();

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans antialiased pb-safe">
      <style jsx global>{`
        :root {
          --ink: #1A1A1A;
          --mute: #6E6E6E;
          --line: #EBEBEB;
          --soft: #F6F6F6;
          --lime: #CCF88E;
          --lime-deep: #B6EA6C;
          --display: 'Bricolage Grotesque', 'Noto Sans Ethiopic', system-ui, sans-serif;
          --body: 'Figtree', 'Noto Sans Ethiopic', system-ui, sans-serif;
        }
        .num, .font-display {
          font-family: var(--display);
          letter-spacing: -0.02em;
        }
        
        /* Dedicated styles for Certificate & Statement */
        .paper {
          width: 794px;
          min-height: 1123px;
          background: #fff;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
          color: #1A1A1A;
          font-family: 'Figtree', 'Noto Sans Ethiopic', system-ui, sans-serif;
          font-size: 14px;
          line-height: 1.5;
        }
        .pbar { height: 12px; background: linear-gradient(90deg, #CCF88E, #6E9A4A 60%, #22421E); }
        .pin { padding: 44px 56px 48px; }
        .ph { display: flex; justify-content: space-between; align-items: flex-start; }
        .plogo { display: flex; align-items: center; gap: 10px; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 24px; }
        .plogo i { width: 28px; height: 28px; border-radius: 50%; background: #CCF88E; border: 3px solid #1A1A1A; display: inline-block; font-style: normal; }
        .pm2 { text-align: right; display: grid; gap: 2px; font-size: 12px; color: #6E6E6E; }
        .pm2 b { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 15px; letter-spacing: .08em; color: #1A1A1A; }
        .pt { margin: 44px 0 26px; padding: 30px 32px; border-radius: 24px; background: linear-gradient(135deg, #E9FBCF, #CDF68E 60%, #B6EA6C); }
        .pt small { font-weight: 600; opacity: .65; display: block; }
        .pt h1 { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 44px; line-height: 1.05; letter-spacing: -.02em; margin: 2px 0 4px; overflow-wrap: anywhere; }
        .pt p { margin: 0; }
        .ps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 28px; }
        .ps div { border: 1px solid #EBEBEB; border-radius: 18px; padding: 14px 18px; }
        .ps b { display: block; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 28px; line-height: 1.1; }
        .ps span { color: #6E6E6E; font-size: 12px; }
        .pt2 { width: 100%; border-collapse: collapse; }
        .pt2 th { text-align: left; font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: #6E6E6E; padding: 8px 10px; border-bottom: 2px solid #1A1A1A; }
        .pt2 td { padding: 10px; border-bottom: 1px solid #EBEBEB; }
        .pt2 tr { break-inside: avoid; }
        .pt2 .r { text-align: right; }
        .pt2 .tt td { font-weight: 700; border-bottom: 0; background: #F6F6F6; }
        .pf2 { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; break-inside: avoid; }
        .sig { width: 220px; }
        .sig .ln { border-top: 1.5px solid #1A1A1A; margin-bottom: 6px; }
        .sig b { display: block; }
        .sig span { font-size: 12px; color: #6E6E6E; }
        .fine { font-size: 11px; color: #6E6E6E; margin-top: 22px; }
        .wm { position: absolute; inset: 0; display: grid; place-items: center; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 150px; color: rgba(26,26,26,.05); transform: rotate(-30deg); pointer-events: none; letter-spacing: .1em; user-select: none; }
        .cert { background: linear-gradient(180deg, #fff, #F6FFE6) !important; }
        .cb1 { position: absolute; inset: 26px; border: 3px solid #2F5D2A; border-radius: 6px; pointer-events: none; }
        .cb2 { position: absolute; inset: 8px; border: 1px solid #6E9A4A; border-radius: 3px; pointer-events: none; }
        .cin { position: relative; height: 100%; min-height: 1123px; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 70px 76px 60px; box-sizing: border-box; }
        .ey { letter-spacing: .35em; font-weight: 700; color: #2F5D2A; margin-top: 30px; font-size: 13px; }
        .cph { position: relative; display: inline-block; background: linear-gradient(155deg, #E9FBCF 0%, #CDF68E 22%, #6E9A4A 55%, #22421E 100%); border-radius: 28px; padding: 30px 80px 26px; margin: 20px 0 10px; }
        .cph svg { display: block; }
        .cbd { position: absolute; right: 44px; bottom: -24px; width: 84px; height: 84px; border-radius: 50%; background: #fff; border: 4px solid #2F5D2A; display: grid; place-items: center; font-size: 44px; box-shadow: 0 8px 20px rgba(0,0,0,.25); }
        .bn { letter-spacing: .2em; font-weight: 700; font-size: 13px; color: #2F5D2A; margin: 26px 0 2px; }
        .pre { color: #6E6E6E; margin: 8px 0; font-size: 14px; }
        .cn { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 64px; line-height: 1.05; letter-spacing: -.02em; margin: 6px 0 22px; overflow-wrap: anywhere; color: #1A1A1A; }
        .ctx { font-size: 18px; line-height: 1.7; max-width: 540px; color: #1A1A1A; }
        .cf { display: flex; justify-content: space-between; align-items: flex-end; width: 100%; margin-top: auto; padding-top: 60px; text-align: left; }

        @page {
          size: A4 portrait;
          margin: 0;
        }
        @media print {
          body.pd > *:not(#print-dialog-wrap) {
            display: none !important;
          }
          body.pd #print-dialog-wrap {
            position: static !important;
            inset: auto !important;
            width: 100% !important;
            max-width: none !important;
            max-height: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: none !important;
            backdrop-filter: none !important;
            box-shadow: none !important;
            border: none !important;
            display: block !important;
          }
          body.pd #print-dialog-wrap > div {
            background: none !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            max-height: none !important;
            width: 100% !important;
            max-width: none !important;
          }
          body.pd .dbar-strip {
            display: none !important;
          }
          body.pd .dsc-scroll {
            padding: 0 !important;
            overflow: visible !important;
            max-height: none !important;
            display: block !important;
          }
          body.pd .paper {
            zoom: 1 !important;
            box-shadow: none !important;
            margin: 0 auto !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          body.pd * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* ── STICKY HEADER ── */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#EBEBEB]">
        <div className="max-w-[1000px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-[19px] flex items-center gap-[9px] text-[#1A1A1A] no-underline">
            <i className="w-[22px] h-[22px] rounded-full bg-[#CCF88E] border-2 border-[#1A1A1A] inline-block shrink-0 not-italic" />
            <span>Ethio Fund</span>
          </Link>

          <div className="flex items-center gap-3.5">
            <Link
              href="/discover"
              className="bg-[#CCF88E] text-[#1A1A1A] border border-[#CCF88E] hover:bg-[#B6EA6C] rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
            >
              Donate
            </Link>

            <span
              className="w-10 h-10 rounded-full bg-[#CCF88E] font-bold text-sm grid place-items-center text-[#1A1A1A] bg-cover bg-center shrink-0 border border-[#EBEBEB]"
              style={profile.photo ? { backgroundImage: `url(${profile.photo})` } : {}}
            >
              {!profile.photo && donorInitial}
            </span>

            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.removeItem('ethiofund-user');
                  localStorage.removeItem('wegen_token');
                  localStorage.removeItem('wegen_user');
                } catch (e) {}
                window.location.href = '/auth/login';
              }}
              className="text-[#6E6E6E] text-sm hover:text-[#1A1A1A] underline underline-offset-4 cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN DASHBOARD VIEW ── */}
      <main className="max-w-[1000px] mx-auto px-6 py-8 pb-24">
        
        {/* 1. PROFILE SHIELD HERO CARD (.pf) */}
        <section className="grid grid-cols-1 md:grid-cols-2 border border-[#dcdcdc] rounded-[32px] overflow-hidden min-h-[400px] bg-white mb-6 shadow-xs">
          {/* Left shield photo column */}
          <div className="relative bg-gradient-to-br from-[#E9FBCF] via-[#CDF68E] via-55%-[#6E9A4A] to-[#22421E] flex flex-col items-center justify-center gap-6 p-8 min-h-[300px]">
            <svg
              className="w-[min(226px,65%)] h-auto block drop-shadow-md"
              viewBox="0 0 226 182"
              role="img"
              aria-label="Your profile picture"
            >
              <defs>
                <clipPath id="shield-clip">
                  <path d={SH} />
                </clipPath>
              </defs>
              <path d={SH} fill="#F4F4F4" />
              {profile.photo ? (
                <image
                  href={profile.photo}
                  width="226"
                  height="182"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#shield-clip)"
                />
              ) : (
                <text
                  x="113"
                  y="120"
                  textAnchor="middle"
                  fontFamily="Bricolage Grotesque, system-ui, sans-serif"
                  fontWeight="700"
                  fontSize="86"
                  fill="#1A1A1A"
                >
                  {donorInitial}
                </text>
              )}
            </svg>

            {/* Shield Action Menu (···) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 rounded-full border border-white/90 bg-white/10 text-white text-lg tracking-wider flex items-center justify-center cursor-pointer hover:bg-white/25 transition-colors"
                aria-label="Profile photo options"
              >
                ···
              </button>

              {menuOpen && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl p-1.5 min-w-[210px] z-30 border border-[#EBEBEB]">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setPhotoMsg('');
                      fileInputRef.current?.click();
                    }}
                    className="w-full text-left bg-none border-0 rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#1A1A1A] hover:bg-[#F6F6F6] flex items-center gap-2 cursor-pointer"
                  >
                    <span>📷</span> Choose a photo
                  </button>
                  {profile.photo && (
                    <button
                      type="button"
                      onClick={() => {
                        const { photo, ...rest } = profile;
                        saveProfile(rest);
                        setMenuOpen(false);
                        setPhotoMsg('');
                      }}
                      className="w-full text-left bg-none border-0 rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#B3261E] hover:bg-[#FBE0DD] flex items-center gap-2 cursor-pointer"
                    >
                      <span>🗑️</span> Remove photo
                    </button>
                  )}
                </div>
              )}
            </div>

            {photoMsg && (
              <p className="text-white text-xs bg-black/40 px-3.5 py-1 rounded-full absolute bottom-4">
                {photoMsg}
              </p>
            )}
          </div>

          {/* Right profile info & edit column */}
          <div className="flex flex-col items-center justify-center gap-3.5 p-8 text-center">
            {editingName ? (
              <input
                ref={nameInputRef}
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveProfile({ ...profile, name: tempName.trim() });
                    setEditingName(false);
                  } else if (e.key === 'Escape') {
                    setEditingName(false);
                  }
                }}
                onBlur={() => {
                  saveProfile({ ...profile, name: tempName.trim() });
                  setEditingName(false);
                }}
                placeholder="Your name"
                maxLength={40}
                autoFocus
                className="font-display font-bold text-[34px] text-center border-0 border-b-2 border-[#1A1A1A] outline-none w-full max-w-[340px] bg-transparent"
              />
            ) : (
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#1A1A1A]">
                {getDonorName()}
              </h1>
            )}

            <p className="text-[#6E6E6E] text-base">
              {activeDonations.length} gift{activeDonations.length === 1 ? '' : 's'} · {f0(totalAmount)} ETB given
            </p>

            <Link
              href="/discover"
              className="bg-[#1A1A1A] text-white hover:bg-black rounded-full px-6 py-2.5 font-semibold text-sm transition-colors mt-2"
            >
              Donate now
            </Link>

            <button
              type="button"
              onClick={() => {
                if (!editingName) {
                  setTempName(profile.name || getDonorName());
                  setEditingName(true);
                } else {
                  saveProfile({ ...profile, name: tempName.trim() });
                  setEditingName(false);
                }
              }}
              className="text-[#6E6E6E] text-sm hover:text-[#1A1A1A] underline underline-offset-4 cursor-pointer mt-1"
            >
              {editingName ? 'Press Enter to save' : 'Edit name'}
            </button>
          </div>
        </section>

        {/* 2. THREE SUMMARY STATS */}
        <div className="grid grid-cols-3 gap-3.5 mb-12">
          <div className="border border-[#EBEBEB] rounded-[22px] p-4 sm:p-5 text-center bg-white shadow-2xs">
            <b className="font-display font-bold text-2xl sm:text-3xl leading-tight block text-[#1A1A1A]">
              {f0(totalAmount)}
            </b>
            <span className="text-[#6E6E6E] text-xs sm:text-sm">ETB given</span>
          </div>

          <div className="border border-[#EBEBEB] rounded-[22px] p-4 sm:p-5 text-center bg-white shadow-2xs">
            <b className="font-display font-bold text-2xl sm:text-3xl leading-tight block text-[#1A1A1A]">
              {peopleCount}
            </b>
            <span className="text-[#6E6E6E] text-xs sm:text-sm">
              {peopleCount === 1 ? 'person' : 'people'} helped
            </span>
          </div>

          <div className="border border-[#EBEBEB] rounded-[22px] p-4 sm:p-5 text-center bg-white shadow-2xs">
            <b className="font-display font-bold text-2xl sm:text-3xl leading-tight block text-[#1A1A1A]">
              {earnedBadges.length}/{BADGES.length}
            </b>
            <span className="text-[#6E6E6E] text-xs sm:text-sm">badges earned</span>
          </div>
        </div>

        {/* 3. PEOPLE YOU'VE HELPED */}
        <h2 className="font-display font-bold text-2xl text-[#1A1A1A] mt-10 mb-1.5">
          People you’ve helped
        </h2>
        <p className="text-[#6E6E6E] mb-4 text-sm sm:text-base">
          Every gift reached someone. Thank you.
        </p>

        {peopleList.length > 0 ? (
          <div className="grid gap-3 mb-12">
            {peopleList.map((p, idx) => (
              <div
                key={idx}
                className="flex flex-wrap sm:flex-nowrap gap-4 items-center border border-[#EBEBEB] rounded-[22px] p-4 sm:px-5 bg-white shadow-2xs"
              >
                <div className="w-[52px] h-[52px] rounded-full bg-[#CCF88E] grid place-items-center font-display font-bold text-[22px] shrink-0 text-[#1A1A1A]">
                  {(p.t[0] || 'C').toUpperCase()}
                </div>

                <div className="flex-1 min-w-[200px]">
                  <b className="block text-[15px] font-semibold text-[#1A1A1A] leading-tight">
                    {p.t}
                  </b>
                  <span className="text-[#6E6E6E] text-xs sm:text-sm">
                    {p.n} gift{p.n > 1 ? 's' : ''} · last on {fd(p.last)}
                  </span>
                </div>

                <div className="font-display font-bold text-lg text-[#1A1A1A] whitespace-nowrap">
                  {f0(p.amt)} ETB
                </div>

                <Link
                  href={p.slug ? `/donate/${p.slug}` : '/discover'}
                  className="rounded-full border border-[#1A1A1A] px-4 py-1.5 text-xs font-semibold hover:bg-[#F6F6F6] transition-colors shrink-0"
                >
                  Give again
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-1.5 border-dashed border-[#cfcfcf] rounded-[22px] p-7 text-center text-[#6E6E6E] mb-12">
            No one yet. Your first donation will show up here.
            <br />
            <br />
            <Link
              href="/discover"
              className="inline-block bg-[#1A1A1A] text-white hover:bg-black rounded-full px-5 py-2 text-sm font-semibold transition-colors"
            >
              Find someone to help
            </Link>
          </div>
        )}

        {/* 4. YOUR BADGES */}
        <h2 className="font-display font-bold text-2xl text-[#1A1A1A] mt-10 mb-1.5">
          Your badges
        </h2>
        <p className="text-[#6E6E6E] mb-4 text-sm sm:text-base">
          You have earned {earnedBadges.length} of {BADGES.length} badges.
        </p>

        {nextBadge ? (
          <div className="flex flex-wrap items-center gap-4.5 bg-[#F6F6F6] rounded-[24px] p-5 sm:px-6 mb-6">
            <span className="text-4xl">{nextBadge.icon}</span>
            <div className="flex-1 min-w-[220px]">
              <b className="block font-semibold text-base text-[#1A1A1A]">
                Next badge: {nextBadge.title}
              </b>
              <span className="text-[#6E6E6E] text-sm">
                {nextBadge.desc}. {getLeftText(nextBadge)}.
              </span>
              <div className="h-2 rounded-full bg-[#EBEBEB] mt-2 max-w-[320px] overflow-hidden">
                <i
                  className="block h-full bg-[#1A1A1A] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (nextBadge.cur / nextBadge.target) * 100)}%` }}
                />
              </div>
            </div>

            <Link
              href="/discover"
              className="bg-[#1A1A1A] text-white hover:bg-black rounded-full px-5 py-2 text-sm font-semibold transition-colors"
            >
              Donate now
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4 bg-[#F6F6F6] rounded-[24px] p-5 sm:px-6 mb-6">
            <span className="text-4xl">🎉</span>
            <div>
              <b className="block font-semibold text-base text-[#1A1A1A]">
                You’ve earned every badge
              </b>
              <span className="text-[#6E6E6E] text-sm">Thank you for being so generous.</span>
            </div>
          </div>
        )}

        {/* 5. DOWNLOAD CERTIFICATES */}
        <h2 className="font-display font-bold text-2xl text-[#1A1A1A] mt-10 mb-1.5">
          Download your certificates
        </h2>
        <p className="text-[#6E6E6E] mb-4 text-sm sm:text-base">
          Official records with your photo, your badge and the Ethio Fund stamp. Save them as PDF.
        </p>

        {earnedBadges.length === 0 && (
          <div className="border-1.5 border-dashed border-[#cfcfcf] rounded-[22px] p-6 text-center text-[#6E6E6E] mb-4">
            Earn your first badge to unlock a certificate.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {BADGES.map((b, i) =>
            b.cur >= b.target ? (
              <div
                key={i}
                className="border border-[#EBEBEB] rounded-[24px] p-5 flex flex-col justify-between gap-4 bg-white shadow-2xs"
              >
                <div className="bg-gradient-to-br from-[#F1FBDF] to-[#F6F6F6] rounded-[18px] h-[170px] grid place-items-center overflow-hidden">
                  <div className="w-[108px] h-[138px] bg-white rounded-md shadow-lg p-3 relative -rotate-3 border-2 border-[#2F5D2A] text-center">
                    <i className="block h-[5px] rounded-full bg-[#CCF88E] mb-2 mx-auto w-[70%]" />
                    <i className="block h-[5px] rounded-full bg-[#E3E3E3] mb-2 mx-auto w-[80%]" />
                    <span className="text-[30px] block my-1">{b.icon}</span>
                    <div className="absolute -right-3 -bottom-3">
                      <OfficialStamp sz={48} />
                    </div>
                  </div>
                </div>

                <div>
                  <b className="font-semibold text-base text-[#1A1A1A] block">
                    {b.title} certificate
                  </b>
                  <p className="text-[#6E6E6E] text-sm mt-0.5">{b.desc}.</p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDocType(`cert:${i}`);
                    }}
                    className="w-full bg-[#1A1A1A] text-white hover:bg-black rounded-full px-5 py-2 text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Preview and download
                  </button>
                </div>
              </div>
            ) : null
          )}

          {/* Giving Statement Card */}
          <div className="border border-[#EBEBEB] rounded-[24px] p-5 flex flex-col justify-between gap-4 bg-white shadow-2xs">
            <div className="bg-gradient-to-br from-[#F1FBDF] to-[#F6F6F6] rounded-[18px] h-[170px] grid place-items-center overflow-hidden">
              <div className="w-[108px] h-[138px] bg-white rounded-md shadow-lg p-3 relative -rotate-3">
                <i className="block h-[8px] rounded-full bg-[#CCF88E] w-[60%] mb-2" />
                <i className="block h-[5px] rounded-full bg-[#E3E3E3] mb-2" />
                <i className="block h-[5px] rounded-full bg-[#E3E3E3] mb-2" />
                <i className="block h-[5px] rounded-full bg-[#E3E3E3] mb-2" />
                <i className="block h-[5px] rounded-full bg-[#E3E3E3] w-[70%] mb-2" />
                <div className="absolute -right-3 -bottom-3">
                  <OfficialStamp sz={48} />
                </div>
              </div>
            </div>

            <div>
              <b className="font-semibold text-base text-[#1A1A1A] block">Giving statement</b>
              <p className="text-[#6E6E6E] text-sm mt-0.5">
                Every gift, the people you helped and your total.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap pt-2">
              <select
                value={docPeriod}
                onChange={(e) => setDocPeriod(e.target.value)}
                aria-label="Period"
                className="border border-[#cfcfcf] rounded-full px-4 py-2 text-sm bg-white outline-none cursor-pointer"
              >
                <option value="all">All time</option>
                {[
                  ...new Set(activeDonations.map((g) => new Date(g.at).getFullYear())),
                ]
                  .sort((a, b) => b - a)
                  .map((y) => (
                    <option key={y} value={String(y)}>
                      {y}
                    </option>
                  ))}
              </select>

              <button
                type="button"
                disabled={activeDonations.length === 0}
                onClick={() => setDocType('stm')}
                className="flex-1 bg-[#1A1A1A] text-white hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed rounded-full px-5 py-2 text-sm font-semibold transition-colors cursor-pointer"
              >
                Preview and download
              </button>
            </div>
          </div>
        </div>

        {/* 6. CALL TO ACTION BANNER */}
        <section className="bg-[#1A1A1A] text-white rounded-[32px] p-8 sm:p-12 text-center mt-12 shadow-md">
          <h2 className="font-display font-bold text-2xl sm:text-3xl mb-2">
            Someone needs your help today
          </h2>
          <p className="text-white/75 text-sm sm:text-base max-w-[500px] mx-auto mb-6">
            Even a small gift adds up. Pick a person and give in a minute.
          </p>
          <Link
            href="/discover"
            className="inline-block bg-[#CCF88E] text-[#1A1A1A] border border-[#CCF88E] hover:bg-[#B6EA6C] rounded-full px-8 py-3.5 text-base font-bold transition-colors shadow-xs"
          >
            Donate now
          </Link>
        </section>

        {/* Preview State Toggle Buttons (when not loaded from real database) */}
        {!realMode && (
          <p className="text-[#6E6E6E] text-sm text-center mt-8">
            Sample data for preview:{' '}
            <button
              type="button"
              onClick={() => setPreviewMode('returning')}
              className={`underline underline-offset-4 cursor-pointer font-medium ${
                previewMode === 'returning' ? 'text-[#1A1A1A] font-bold' : ''
              }`}
            >
              Returning donor
            </button>{' '}
            ·{' '}
            <button
              type="button"
              onClick={() => setPreviewMode('new')}
              className={`underline underline-offset-4 cursor-pointer font-medium ${
                previewMode === 'new' ? 'text-[#1A1A1A] font-bold' : ''
              }`}
            >
              New donor
            </button>
          </p>
        )}
      </main>

      {/* Hidden File Input for Avatar Photo */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* ── MODAL DIALOG: CERTIFICATE & GIVING STATEMENT (.dsc / .paper) ── */}
      {docType && (
        <div
          id="print-dialog-wrap"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs"
        >
          <div className="bg-[#EDEDED] rounded-[24px] w-full max-w-[900px] max-h-[94vh] flex flex-col overflow-hidden shadow-2xl border border-white/20">
            {/* Modal Header Controls */}
            <div className="dbar-strip flex justify-between items-center gap-3 p-3.5 px-5 bg-white border-b border-[#EBEBEB]">
              <div>
                <b className="font-semibold text-base text-[#1A1A1A] block">
                  {docType.startsWith('cert:')
                    ? `${BADGES[parseInt(docType.slice(5), 10)]?.title} certificate`
                    : 'Giving statement'}
                </b>
                <span className="text-[#6E6E6E] text-xs">
                  In the print window, choose “Save as PDF”.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDocType(null)}
                  className="rounded-full border border-[#1A1A1A] px-4 py-1.5 text-xs font-semibold hover:bg-[#F6F6F6] transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="bg-[#1A1A1A] text-white hover:bg-black rounded-full px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  Download PDF
                </button>
              </div>
            </div>

            {/* Modal Scrollable Document Canvas */}
            <div
              ref={docBodyRef}
              className="dsc-scroll flex-1 overflow-auto p-4 sm:p-7 flex justify-center items-start"
            >
              {/* === RENDER 1: GIVING STATEMENT PAPER === */}
              {docType === 'stm' && (() => {
                const list = (docPeriod === 'all'
                  ? activeDonations
                  : activeDonations.filter((g) => String(new Date(g.at).getFullYear()) === docPeriod)
                )
                  .slice()
                  .sort((a, b) => a.at - b.at);

                const totalPeriodAmount = list.reduce((t, d) => t + d.amt, 0);
                const peopleHelped = new Set(list.map((g) => g.t || 'Ethio Fund campaign')).size;

                return (
                  <div
                    id="print-document-node"
                    className="paper bg-white w-[794px] min-h-[1123px] relative overflow-hidden text-[#1A1A1A] font-sans text-sm leading-relaxed shadow-xl shrink-0"
                    style={{ zoom: zoomFactor }}
                  >
                    <div className="pbar h-3 bg-gradient-to-r from-[#CCF88E] via-[#6E9A4A] via-60% to-[#22421E]" />
                    
                    <div className="pin p-11 sm:p-14">
                      {/* Document Header */}
                      <div className="ph flex justify-between items-start">
                        <div className="plogo flex items-center gap-2.5 font-display font-bold text-2xl text-[#1A1A1A]">
                          <i className="w-7 h-7 rounded-full bg-[#CCF88E] border-[3px] border-[#1A1A1A] inline-block not-italic" />
                          <span>Ethio Fund</span>
                        </div>

                        <div className="pm2 text-right text-xs text-[#6E6E6E] space-y-0.5">
                          <b className="font-display font-bold text-sm tracking-widest text-[#1A1A1A] block">
                            GIVING STATEMENT
                          </b>
                          <span>No. {getDocNumber('S', list)}</span>
                          <span className="block">Issued {fd(Date.now())}</span>
                        </div>
                      </div>

                      {/* Prepared For Banner */}
                      <div className="pt my-9 p-8 rounded-[24px] bg-gradient-to-br from-[#E9FBCF] via-[#CDF68E] via-60% to-[#B6EA6C]">
                        <small className="font-semibold opacity-70 block text-xs">Prepared for</small>
                        <h1 className="font-display font-bold text-4xl leading-tight my-1 text-[#1A1A1A]">
                          {getDonorName()}
                        </h1>
                        <p className="text-sm text-[#1A1A1A]/80 m-0">
                          {docPeriod === 'all' ? 'All gifts to date' : `Gifts in ${docPeriod}`}
                        </p>
                      </div>

                      {/* Stat Metrics Box */}
                      <div className="ps grid grid-cols-3 gap-3 mb-7">
                        <div className="border border-[#EBEBEB] rounded-[18px] p-4">
                          <b className="font-display font-bold text-2xl leading-none block text-[#1A1A1A]">
                            {f0(totalPeriodAmount)}
                          </b>
                          <span className="text-[#6E6E6E] text-xs">ETB given</span>
                        </div>
                        <div className="border border-[#EBEBEB] rounded-[18px] p-4">
                          <b className="font-display font-bold text-2xl leading-none block text-[#1A1A1A]">
                            {list.length}
                          </b>
                          <span className="text-[#6E6E6E] text-xs">{list.length === 1 ? 'Gift' : 'Gifts'}</span>
                        </div>
                        <div className="border border-[#EBEBEB] rounded-[18px] p-4">
                          <b className="font-display font-bold text-2xl leading-none block text-[#1A1A1A]">
                            {peopleHelped}
                          </b>
                          <span className="text-[#6E6E6E] text-xs">
                            {peopleHelped === 1 ? 'Person helped' : 'People helped'}
                          </span>
                        </div>
                      </div>

                      {/* Transactions Table */}
                      <table className="pt2 w-full border-collapse text-left mb-8">
                        <thead>
                          <tr className="border-b-2 border-[#1A1A1A] text-xs uppercase tracking-wider text-[#6E6E6E]">
                            <th className="py-2.5 px-3">Date</th>
                            <th className="py-2.5 px-3">Campaign</th>
                            <th className="py-2.5 px-3">Receipt no.</th>
                            <th className="py-2.5 px-3 text-right">Amount (ETB)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {list.map((d, idx) => (
                            <tr key={idx} className="border-b border-[#EBEBEB]">
                              <td className="py-2.5 px-3 text-sm">{fd(d.at)}</td>
                              <td className="py-2.5 px-3 font-medium text-sm">
                                {d.t || 'Ethio Fund campaign'}
                              </td>
                              <td className="py-2.5 px-3 text-xs text-[#6E6E6E]">
                                EF-{String(d.at).slice(-6)}
                              </td>
                              <td className="py-2.5 px-3 text-right font-display font-semibold text-sm">
                                {f0(d.amt)}
                              </td>
                            </tr>
                          ))}
                          <tr className="tt font-bold bg-[#F6F6F6]">
                            <td colSpan={3} className="py-3 px-3 text-sm">
                              Total
                            </td>
                            <td className="py-3 px-3 text-right font-display text-base">
                              {f0(totalPeriodAmount)}
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Document Footer with Signature & Official Stamp */}
                      <div className="pf2 flex justify-between items-end mt-12 pt-6">
                        <div className="sig w-[220px]">
                          <div className="ln border-t-2 border-[#1A1A1A] mb-1.5" />
                          <b className="block text-sm">Ethio Fund</b>
                          <span className="text-xs text-[#6E6E6E]">Authorized record of giving</span>
                        </div>
                        <OfficialStamp sz={150} />
                      </div>

                      <p className="fine text-[11px] text-[#6E6E6E] mt-8">
                        This statement is a record of gifts made through Ethio Fund. Tips to Ethio Fund are not included. It is not a tax invoice.
                        {!realMode && ' SAMPLE DATA.'}
                      </p>
                    </div>

                    {!realMode && (
                      <div className="wm absolute inset-0 grid place-items-center font-display font-bold text-[150px] text-[#1A1A1A]/5 -rotate-30 pointer-events-none select-none tracking-widest">
                        SAMPLE
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* === RENDER 2: CERTIFICATE OF GENEROSITY === */}
              {docType.startsWith('cert:') && (() => {
                const badgeIndex = parseInt(docType.slice(5), 10);
                const b = BADGES[badgeIndex];
                const firstGift = [...activeDonations].sort((a, b) => a.at - b.at)[0];
                const dateEarned = getEarnedDate(badgeIndex);

                return (
                  <div
                    id="print-document-node"
                    className="paper cert w-[794px] min-h-[1123px] relative overflow-hidden text-[#1A1A1A] font-sans text-sm leading-relaxed shadow-xl shrink-0"
                    style={{ zoom: zoomFactor, background: 'linear-gradient(180deg, #ffffff, #F6FFE6)' }}
                  >
                    {/* Double decorative border nesting */}
                    <div className="cb1">
                      <div className="cb2">
                        <div className="cin">
                          <div className="plogo flex items-center gap-2.5 font-display font-bold text-2xl text-[#1A1A1A]">
                            <i className="w-7 h-7 rounded-full bg-[#CCF88E] border-[3px] border-[#1A1A1A] inline-block not-italic" />
                            <span>Ethio Fund</span>
                          </div>

                          <div className="ey tracking-[0.35em] font-bold text-[#2F5D2A] mt-8 text-xs">
                            CERTIFICATE OF GENEROSITY
                          </div>

                          {/* Shield Photo Container with Badge Seal */}
                          <div className="cph relative inline-block bg-gradient-to-br from-[#E9FBCF] via-[#CDF68E] via-22% via-[#6E9A4A] via-55% to-[#22421E] rounded-[28px] px-20 py-7 my-5">
                            <svg
                              viewBox="0 0 226 182"
                              width="230"
                              role="img"
                              aria-label={getDonorName()}
                              className="block"
                            >
                              <defs>
                                <clipPath id="cert-shield-clip">
                                  <path d={SH} />
                                </clipPath>
                              </defs>
                              <path d={SH} fill="#F4F4F4" />
                              {profile.photo ? (
                                <image
                                  href={profile.photo}
                                  width="226"
                                  height="182"
                                  preserveAspectRatio="xMidYMid slice"
                                  clipPath="url(#cert-shield-clip)"
                                />
                              ) : (
                                <text
                                  x="113"
                                  y="120"
                                  textAnchor="middle"
                                  fontFamily="Bricolage Grotesque, system-ui, sans-serif"
                                  fontWeight="700"
                                  fontSize="86"
                                  fill="#1A1A1A"
                                >
                                  {donorInitial}
                                </text>
                              )}
                            </svg>

                            <div className="cbd" role="img" aria-label={`${b?.title} badge`}>
                              {b?.icon}
                            </div>
                          </div>

                          <div className="bn tracking-[0.2em] font-bold text-xs text-[#2F5D2A] mt-6 mb-1">
                            {b?.title.toUpperCase()} BADGE
                          </div>

                          <p className="pre text-[#6E6E6E] text-sm my-1">
                            This certificate is proudly presented to
                          </p>

                          <div className="cn font-display font-bold text-5xl leading-tight my-2 text-[#1A1A1A]">
                            {getDonorName()}
                          </div>

                          <p className="ctx text-lg leading-relaxed max-w-[540px] text-[#1A1A1A]">
                            {badgeDescriptions[badgeIndex](firstGift)}
                            {dateEarned ? (
                              <>
                                , on <b>{fd(dateEarned)}</b>
                              </>
                            ) : null}
                            , and for helping someone when it mattered most.
                          </p>

                          {/* Certificate Footer with Signature and Stamp */}
                          <div className="cf flex justify-between items-end w-full mt-auto pt-16 text-left">
                            <div className="sig w-[220px]">
                              <div className="ln border-t-2 border-[#1A1A1A] mb-1.5" />
                              <b className="block text-sm">Ethio Fund Team</b>
                              <span className="text-xs text-[#6E6E6E]">Issued {fd(Date.now())}</span>
                            </div>
                            <OfficialStamp sz={150} />
                          </div>

                          <p className="fine text-[11px] text-[#6E6E6E] mt-4">
                            Certificate no. {getDocNumber(`C${badgeIndex}`, activeDonations)}
                            {!realMode && ' · SAMPLE DATA'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {!realMode && (
                      <div className="wm absolute inset-0 grid place-items-center font-display font-bold text-[150px] text-[#1A1A1A]/5 -rotate-30 pointer-events-none select-none tracking-widest">
                        SAMPLE
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
