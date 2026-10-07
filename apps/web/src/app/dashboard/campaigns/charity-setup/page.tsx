"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Data ───────────────────────────────────────────────────────────────────
const ORGS = [
  { id: 1, n: "Hope Ethiopia",                   c: "Human Services",    l: "Addis Ababa",       v: true,  bg: "#CCF88E" },
  { id: 2, n: "Selam Children'\''s Home",           c: "Child Welfare",     l: "Hawassa, Sidama",   v: true,  bg: "#1A1A1A" },
  { id: 3, n: "Gurage Clean Water Initiative",    c: "Water & Sanitation",l: "Wolkite, SNNP",     v: true,  bg: "#E8E8E8" },
  { id: 4, n: "Addis Mothers'\'' Health Trust",     c: "Health",            l: "Addis Ababa",       v: false, bg: "#CCF88E" },
  { id: 5, n: "Bright Futures Education Fund",    c: "Education",         l: "Bahir Dar, Amhara", v: false, bg: "#E8E8E8" },
];

const REGIONS = [
  "Addis Ababa","Dire Dawa","Oromia","Amhara","Tigray","Sidama",
  "South Ethiopia","Central Ethiopia","Somali","Afar","Benishangul-Gumuz","Gambela","Harari",
];

const PLANS = {
  monthly: { label: "Monthly",  price: 3000,  per: "month", posts: "15 campaign posts",       save: "" },
  yearly:  { label: "Yearly",   price: 10000, per: "year",  posts: "Unlimited campaign posts", save: "Save 26,000 ETB vs. 12 months" },
};

type Step = "search" | "add" | "plan" | "pay" | "done";
type Plan = "monthly" | "yearly";
type Method = "telebirr" | "chapa" | "card";

interface Org { id: number; n: string; c: string; l: string; v: boolean; bg: string }

// ─── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n: number) => n.toLocaleString("en-US");
const initials = (name: string) =>
  name.split(" ").filter(w => /^[A-Za-z\u1200-\u137F]/.test(w)).slice(0, 2).map(w => w[0]).join("").toUpperCase();
const slugify = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const renews = (plan: Plan) => {
  const d = new Date();
  plan === "yearly" ? d.setFullYear(d.getFullYear() + 1) : d.setMonth(d.getMonth() + 1);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const META: Record<Step, { step: number; title: string; desc: string }> = {
  search: { step: 1, title: "Find your charity",    desc: "Search for your organization. Charities with a check mark have been verified by our team." },
  add:    { step: 1, title: "Add your organization",desc: "Tell us the basics. You can verify your organization later from your profile to earn the verified badge." },
  plan:   { step: 2, title: "Choose your plan",     desc: "A subscription lets your organization post campaigns and receive donations." },
  pay:    { step: 3, title: "Payment",               desc: "Review your order and pay securely with Telebirr, Chapa or card." },
  done:   { step: 4, title: "You'\''re all set",       desc: "" },
};

// ─── Logo Avatar ────────────────────────────────────────────────────────────
function OrgAvatar({ org }: { org: Org }) {
  const textColor = org.bg === "#1A1A1A" ? "#fff" : "#1A1A1A";
  return (
    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base shrink-0"
      style={{ background: org.bg, color: textColor }}>
      {initials(org.n)}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function CharitySetupPage() {
  const router = useRouter();

  // Step state
  const [step, setStep] = useState<Step>("search");
  const [busy, setBusy] = useState(false);
  const [payError, setPayError] = useState("");

  // Search step
  const [query, setQuery] = useState("");
  const [selectedOrg, setSelectedOrg] = useState<Org | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Add step
  const [newName, setNewName] = useState("");
  const [newLoc, setNewLoc]  = useState("");
  const [banner, setBanner]  = useState<string | null>(null);
  const [bannerErr, setBannerErr] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Plan & pay
  const [plan, setPlan]     = useState<Plan>("yearly");
  const [method, setMethod] = useState<Method>("telebirr");
  const [tel, setTel]       = useState("");
  const [card, setCard]     = useState("");
  const [exp, setExp]       = useState("");
  const [cvc, setCvc]       = useState("");

  // ─── Derived ──────────────────────────────────────────────────────────────
  const filtered = ORGS.filter(o =>
    !query.trim() || (o.n + o.l + o.c).toLowerCase().includes(query.trim().toLowerCase())
  );

  const canContinue = () => {
    if (step === "search") return !!selectedOrg;
    if (step === "add")    return !!(newName.trim() && newLoc && banner && authorized);
    if (step === "plan")   return true;
    if (step === "pay")    return true;
    return false;
  };

  // ─── Navigation ───────────────────────────────────────────────────────────
  const goBack = () => {
    if (step === "add")  { setStep("search"); return; }
    if (step === "plan") { setStep("search"); return; }
    if (step === "pay")  { setStep("plan");   return; }
    router.push("/dashboard/campaigns/new");
  };

  const goNext = () => {
    if (step === "search") { setStep("plan"); return; }
    if (step === "add") {
      setSelectedOrg({ id: 99, n: newName.trim(), c: "Charity", l: newLoc, v: false, bg: "#CCF88E" });
      setIsNew(true);
      setStep("plan");
      return;
    }
    if (step === "plan") { setStep("pay"); return; }
    if (step === "pay")  { handlePay(); }
  };

  const handlePay = () => {
    // Validation
    if (method === "telebirr" && !/^(0?9|7)\d{8}$/.test(tel.replace(/\s/g, ""))) {
      setPayError("Enter a valid Ethiopian mobile number."); return;
    }
    if (method === "card" && (card.replace(/\s/g, "").length < 13 || !/^\d\d ?\/ ?\d\d$/.test(exp) || cvc.length < 3)) {
      setPayError("Check your card number, expiry and CVC."); return;
    }
    setPayError("");
    setBusy(true);
    setTimeout(() => {
      // Persist org session → /org/[slug] reads this on mount
      if (selectedOrg && typeof window !== "undefined") {
        const renewDate = new Date();
        plan === "yearly"
          ? renewDate.setFullYear(renewDate.getFullYear() + 1)
          : renewDate.setMonth(renewDate.getMonth() + 1);
        localStorage.setItem("ethiofund-org", JSON.stringify({
          name:      selectedOrg.n,
          category:  selectedOrg.c,
          location:  selectedOrg.l,
          verified:  selectedOrg.v,
          bg:        selectedOrg.bg,
          banner:    banner ?? null,
          isNew,
          plan,
          planLabel: PLANS[plan].label,
          price:     PLANS[plan].price,
          per:       PLANS[plan].per,
          cap:       plan === "monthly" ? 15 : 0,
          renews:    renewDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
          openedAt:  Date.now(),
        }));
      }
      setBusy(false);
      setStep("done");
    }, 1300);
  };

  // ─── Banner upload ─────────────────────────────────────────────────────────
  const handleBannerFile = (file: File) => {
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setBannerErr("Image must be JPG or PNG under 5 MB."); return;
    }
    const reader = new FileReader();
    reader.onload = () => { setBanner(reader.result as string); setBannerErr(""); };
    reader.readAsDataURL(file);
  };

  const m = META[step];
  const p = PLANS[plan];

  // ─── Sidebar ──────────────────────────────────────────────────────────────
  const sidebarTitle = step === "plan" && !isNew ? "Renew your subscription" : m.title;

  return (
    <div className="min-h-screen bg-white flex flex-col lg:grid lg:grid-cols-[minmax(280px,5fr)_8fr] lg:h-screen lg:overflow-hidden font-sans text-[#1A1A1A]">

      {/* ── Left sidebar ── */}
      <aside className="bg-[#CCF88E] px-8 py-10 lg:px-14 flex flex-col">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-[19px] w-max">
          <div className="w-[22px] h-[22px] rounded-full bg-white border-2 border-[#1A1A1A]" />
          WeGen
        </Link>

        <div className="mt-auto lg:mt-[auto] lg:mb-auto py-10">
          {/* Progress indicator */}
          <p className="text-[14px] font-semibold text-[#1A1A1A] mb-2">{m.step} of 4</p>
          <div className="flex gap-1.5 mb-7">
            {[1,2,3,4].map(i => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= m.step ? "bg-[#1A1A1A]" : "bg-[#1A1A1A]/20"}`} />
            ))}
          </div>
          <h1 className="font-bold text-[clamp(28px,3.4vw,44px)] leading-[1.08] tracking-tight">{sidebarTitle}</h1>
          {m.desc && <p className="mt-4 text-[#1A1A1A]/70 max-w-[24em] text-[15px]">{m.desc}</p>}
        </div>
      </aside>

      {/* ── Right content ── */}
      <section className="flex flex-col min-h-0">
        {/* Top bar */}
        <div className="hidden lg:flex justify-end px-12 pt-7 text-[15px] font-medium">
          <Link href="/auth/login" className="underline underline-offset-4 hover:opacity-70">Sign in</Link>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-6 lg:px-12">
          <div className="max-w-[660px] mx-auto">

            {/* ══ SEARCH STEP ══ */}
            {step === "search" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Search input */}
                <div className="flex items-center gap-3 border-[1.5px] border-[#E4E4E4] rounded-2xl px-4 focus-within:border-[#1A1A1A] transition-colors">
                  <svg className="w-5 h-5 text-[#6E6E6E] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
                  <input
                    className="flex-1 py-4 border-0 outline-none bg-transparent text-[16px] placeholder:text-[#6E6E6E]"
                    placeholder="Charity name or location"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    autoFocus
                  />
                </div>

                <p className="text-[#6E6E6E] text-[13px] font-medium mt-5 mb-2 uppercase tracking-wider">Browse suggested charities</p>

                <div className="space-y-2">
                  {filtered.length > 0 ? filtered.map(org => (
                    <button
                      key={org.id}
                      onClick={() => { setSelectedOrg(org); setIsNew(false); }}
                      className={`w-full flex items-center gap-4 text-left rounded-2xl px-4 py-3.5 border-[1.5px] transition-all ${
                        selectedOrg?.id === org.id
                          ? "border-[#1A1A1A] bg-[#CCF88E]"
                          : "border-transparent hover:bg-[#F6F6F6]"
                      }`}
                    >
                      <OrgAvatar org={org} />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold flex items-center gap-2">
                          {org.n}
                          {org.v ? (
                            <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-[#1A1A1A]">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#CCF88E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-[#6E6E6E] border border-[#E4E4E4] rounded-full px-2 py-px">Not verified</span>
                          )}
                        </div>
                        <div className="text-[13px] text-[#6E6E6E]">{org.c} · {org.l}</div>
                      </div>
                    </button>
                  )) : (
                    <p className="text-[#6E6E6E] py-4 text-[14px]">No charity found for &ldquo;{query}&rdquo;. Add it below.</p>
                  )}
                </div>

                {/* Add org CTA */}
                <div className="mt-6 bg-[#F6F6F6] rounded-2xl p-5 flex items-start sm:items-center justify-between gap-4 flex-wrap">
                  <div>
                    <b className="block text-[15px]">Can&apos;t find your organization?</b>
                    <span className="text-[13px] text-[#6E6E6E]">Add it now. It will show without a verified badge until you verify it from your profile.</span>
                  </div>
                  <button
                    onClick={() => { setNewName(query); setStep("add"); }}
                    className="shrink-0 border-[1.5px] border-[#1A1A1A] bg-white rounded-full px-5 py-2.5 font-semibold text-[14px] hover:bg-[#F6F6F6] transition-colors"
                  >
                    Add your organization
                  </button>
                </div>
              </div>
            )}

            {/* ══ ADD STEP ══ */}
            {step === "add" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-[14px] font-semibold mb-1.5" htmlFor="nm">Name of charity</label>
                  <input id="nm" className="w-full border-[1.5px] border-[#E4E4E4] rounded-xl px-4 py-3.5 outline-none focus:border-[#1A1A1A] transition-colors bg-white"
                    placeholder="e.g. Hope Ethiopia" value={newName} onChange={e => setNewName(e.target.value)} />
                </div>
                {/* Location */}
                <div>
                  <label className="block text-[14px] font-semibold mb-1.5" htmlFor="lc">Location</label>
                  <select id="lc" className="w-full border-[1.5px] border-[#E4E4E4] rounded-xl px-4 py-3.5 outline-none focus:border-[#1A1A1A] transition-colors bg-white"
                    value={newLoc} onChange={e => setNewLoc(e.target.value)}>
                    <option value="">Select region</option>
                    {REGIONS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                {/* Banner */}
                <div>
                  <span className="block text-[14px] font-semibold mb-1.5">Banner</span>
                  {banner ? (
                    <div className="relative rounded-2xl overflow-hidden aspect-[3/1] bg-[#F6F6F6]">
                      <img src={banner} alt="Banner preview" className="w-full h-full object-cover" />
                      <button onClick={() => setBanner(null)}
                        className="absolute top-2.5 right-2.5 bg-white border-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold hover:bg-[#F6F6F6]">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label
                      className="flex flex-col items-center justify-center gap-1.5 border-[1.5px] border-dashed border-[#BDBDBD] rounded-2xl cursor-pointer text-[#6E6E6E] text-[14px] aspect-[3/1] hover:border-[#1A1A1A] hover:bg-[#F6F6F6] transition-colors"
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleBannerFile(f); }}
                    >
                      <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) handleBannerFile(f); }} />
                      <span className="font-semibold text-[#1A1A1A]">Upload a banner image</span>
                      <span>JPG or PNG, wide format (3:1), up to 5 MB</span>
                    </label>
                  )}
                  {bannerErr && <p className="text-[#B3261E] text-[13px] mt-1.5">{bannerErr}</p>}
                </div>
                {/* Note */}
                <div className="bg-[#CCF88E] rounded-2xl px-4 py-3 text-[14px]">
                  Your organization will appear <b>without a verified badge</b>. Verify it from your profile to earn one.
                </div>
                {/* Authorize */}
                <label className="flex gap-3 text-[14px] text-[#6E6E6E] cursor-pointer">
                  <input type="checkbox" className="mt-1 w-4 h-4 accent-[#1A1A1A] shrink-0"
                    checked={authorized} onChange={e => setAuthorized(e.target.checked)} />
                  I am authorized to represent this organization.
                </label>
              </div>
            )}

            {/* ══ PLAN STEP ══ */}
            {step === "plan" && selectedOrg && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Org status card */}
                <div className="flex items-center gap-4 border-[1.5px] border-[#E4E4E4] rounded-2xl px-4 py-3.5 mb-6">
                  <OrgAvatar org={selectedOrg} />
                  <div className="flex-1">
                    <b className="flex items-center gap-2 font-semibold">
                      {selectedOrg.n}
                      {selectedOrg.v ? (
                        <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-[#1A1A1A]">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#CCF88E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-[#6E6E6E] border border-[#E4E4E4] rounded-full px-2 py-px">Not verified</span>
                      )}
                    </b>
                    <span className="text-[13px] text-[#6E6E6E]">{isNew ? "New organization" : "Your subscription ended on 30 Sep 2026"}</span>
                  </div>
                  {!isNew && <span className="text-[12px] font-semibold bg-[#FBE9E7] text-[#B3261E] px-3 py-1 rounded-full">Expired</span>}
                </div>

                <h2 className="text-[22px] font-bold mb-5">{isNew ? "Pick a plan to open your account" : "Renew your subscription"}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {(["monthly", "yearly"] as Plan[]).map(k => {
                    const pl = PLANS[k];
                    const active = plan === k;
                    return (
                      <button key={k} onClick={() => setPlan(k)}
                        className={`relative text-left rounded-2xl border-[1.5px] p-6 transition-all ${active ? "border-[#1A1A1A] bg-[#CCF88E]" : "border-[#E4E4E4] hover:border-[#aaa]"}`}>
                        {k === "yearly" && (
                          <span className="absolute -top-3 right-4 bg-[#1A1A1A] text-white text-[12px] font-semibold rounded-full px-3 py-1">Best value</span>
                        )}
                        <h3 className="font-bold text-[17px] mb-2">{pl.label}</h3>
                        <div className="font-bold text-[36px] leading-none mb-0.5">
                          {fmt(pl.price)} <span className="text-[15px] font-medium text-[#6E6E6E]">ETB / {pl.per}</span>
                        </div>
                        {pl.save && <p className="text-[13px] font-semibold mt-1 mb-3">{pl.save}</p>}
                        <ul className="mt-4 space-y-2 text-[14px]">
                          {[pl.posts, "Organization page with your banner", "Donations via Telebirr, Chapa and card", "Withdrawal requests and reports"].map((item, i) => (
                            <li key={i} className={`flex gap-2 items-start ${i === 0 ? "font-semibold" : ""}`}>
                              <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[13px] text-[#6E6E6E]">Prices are in Ethiopian Birr. You will review your order before paying.</p>
              </div>
            )}

            {/* ══ PAY STEP ══ */}
            {step === "pay" && selectedOrg && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Order summary */}
                <div className="border-[1.5px] border-[#E4E4E4] rounded-2xl px-5 py-4 mb-6 space-y-1">
                  {[
                    ["Organization", selectedOrg.n],
                    ["Plan",         `${p.label} · ${p.posts}`],
                    [isNew ? "Starts" : "Renews until", isNew ? "Today" : renews(plan)],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between text-[15px] py-1">
                      <span className="text-[#6E6E6E]">{label}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-[15px] font-bold border-t border-[#E4E4E4] pt-3 mt-2">
                    <span>Total</span>
                    <span>{fmt(p.price)} ETB</span>
                  </div>
                </div>

                {/* Payment method */}
                <span className="block text-[14px] font-semibold mb-3">Pay with</span>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {(["telebirr","chapa","card"] as Method[]).map(m => (
                    <button key={m} onClick={() => setMethod(m)}
                      className={`py-3.5 rounded-2xl border-[1.5px] font-semibold text-[14px] capitalize transition-all ${method === m ? "border-[#1A1A1A] bg-[#CCF88E]" : "border-[#E4E4E4] bg-white hover:border-[#aaa]"}`}>
                      {m === "telebirr" ? "Telebirr" : m === "chapa" ? "Chapa" : "Card"}
                    </button>
                  ))}
                </div>

                {/* Payment fields */}
                {method === "telebirr" && (
                  <div>
                    <label className="block text-[14px] font-semibold mb-1.5" htmlFor="tel">Telebirr phone number</label>
                    <input id="tel" type="tel" inputMode="tel" className="w-full border-[1.5px] border-[#E4E4E4] rounded-xl px-4 py-3.5 outline-none focus:border-[#1A1A1A] transition-colors bg-white"
                      placeholder="9XX XXX XXX" value={tel} onChange={e => setTel(e.target.value)} />
                    <p className="text-[13px] text-[#6E6E6E] mt-1.5">You will get a prompt on your phone to approve the payment.</p>
                  </div>
                )}
                {method === "chapa" && (
                  <div className="bg-[#F6F6F6] rounded-2xl px-5 py-4 text-[14px] text-[#6E6E6E]">
                    <b className="text-[#1A1A1A]">You will be redirected to Chapa</b> to complete payment with your bank or mobile wallet, then brought back here.
                  </div>
                )}
                {method === "card" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[14px] font-semibold mb-1.5" htmlFor="card">Card number</label>
                      <input id="card" inputMode="numeric" className="w-full border-[1.5px] border-[#E4E4E4] rounded-xl px-4 py-3.5 outline-none focus:border-[#1A1A1A] transition-colors bg-white"
                        placeholder="1234 5678 9012 3456" value={card} onChange={e => setCard(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[14px] font-semibold mb-1.5" htmlFor="exp">Expiry</label>
                        <input id="exp" className="w-full border-[1.5px] border-[#E4E4E4] rounded-xl px-4 py-3.5 outline-none focus:border-[#1A1A1A] transition-colors bg-white"
                          placeholder="MM / YY" value={exp} onChange={e => setExp(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-[14px] font-semibold mb-1.5" htmlFor="cvc">CVC</label>
                        <input id="cvc" inputMode="numeric" className="w-full border-[1.5px] border-[#E4E4E4] rounded-xl px-4 py-3.5 outline-none focus:border-[#1A1A1A] transition-colors bg-white"
                          placeholder="123" value={cvc} onChange={e => setCvc(e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}
                {payError && <p className="text-[#B3261E] text-[14px] mt-3">{payError}</p>}
              </div>
            )}

            {/* ══ DONE STEP ══ */}
            {step === "done" && selectedOrg && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="w-[68px] h-[68px] rounded-full bg-[#CCF88E] flex items-center justify-center mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
                </div>
                <h2 className="text-[30px] font-bold tracking-tight mb-5">
                  {isNew ? "Your organization account is open" : "Subscription renewed"}
                </h2>

                <div className="border-[1.5px] border-[#E4E4E4] rounded-2xl px-5 py-4 mb-5 space-y-1">
                  {[
                    ["Organization", selectedOrg.n],
                    ["Plan",         p.label],
                    ["Campaign posts", p.posts.replace(" campaign posts","").replace("Unlimited","Unlimited")],
                    ["Renews on",    renews(plan)],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between text-[15px] py-1">
                      <span className="text-[#6E6E6E]">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>

                <p className="text-[#6E6E6E] text-[14px] mb-4">A receipt has been sent to you.</p>

                {!selectedOrg.v && (
                  <div className="bg-[#F6F6F6] rounded-2xl px-5 py-4 text-[14px] text-[#6E6E6E] mb-5">
                    <b className="text-[#1A1A1A]">Next, verify your organization.</b> Upload your registration documents from your profile to earn the verified badge. Donors trust verified charities more.
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-2">
                  <Link
                    href={`/org/${slugify(selectedOrg.n)}`}
                    className="bg-[#1A1A1A] hover:bg-black text-white font-semibold rounded-full px-6 py-3 transition-colors"
                  >
                    View my organization
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── Footer nav ── */}
        {step !== "done" && (
          <div className="flex items-center justify-between px-5 py-4 lg:px-12 border-t border-[#E4E4E4] bg-white">
            <button
              onClick={goBack}
              disabled={step === "search"}
              className="w-[52px] h-[52px] rounded-full border-[1.5px] border-[#E4E4E4] bg-white flex items-center justify-center hover:bg-[#F6F6F6] disabled:opacity-30 disabled:cursor-default transition-colors"
              aria-label="Go back"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>

            <button
              onClick={goNext}
              disabled={!canContinue() || busy}
              className="bg-[#CCF88E] hover:bg-[#B6EA6C] disabled:opacity-40 disabled:cursor-default text-[#1A1A1A] font-semibold rounded-full px-8 py-3.5 text-[15px] transition-colors"
            >
              {busy ? "Processing…" :
               step === "add"  ? "Add organization" :
               step === "plan" ? "Continue to payment" :
               step === "pay"  ? `Pay ${fmt(p.price)} ETB` :
               "Continue"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
