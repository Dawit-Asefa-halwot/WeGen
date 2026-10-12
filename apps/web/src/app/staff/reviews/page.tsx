'use client';

import React, { useState } from 'react';

interface ReviewItem {
  id: string;
  applicant: string;
  campaign: string;
  category: string;
  daysWaiting: number;
  accountType: 'Telebirr' | 'CBE' | 'Awash Bank';
  accountHolder: string;
  accountLast4: string;
  idPhotoProvided: boolean;
  idName: string;
  status: 'pending' | 'changes' | 'approved' | 'rejected';
  recommended?: boolean;
  story: string;
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-01',
    applicant: 'Abebe Kebede',
    campaign: 'Emergency Cardiac Surgery for Bethlehem',
    category: 'Medical',
    daysWaiting: 3,
    accountType: 'CBE',
    accountHolder: 'Abebe Kebede Tessema',
    accountLast4: '8842',
    idPhotoProvided: true,
    idName: 'Abebe Kebede Tessema',
    status: 'pending',
    story: 'Bethlehem was diagnosed with severe ventricular septal defect requiring immediate corrective surgery at Tikur Anbessa hospital.',
  },
  {
    id: 'rev-02',
    applicant: 'Chaltu Desta',
    campaign: 'Clean Drinking Water for Ambo Primary School',
    category: 'Education',
    daysWaiting: 2,
    accountType: 'Telebirr',
    accountHolder: 'Chaltu Desta',
    accountLast4: '0412',
    idPhotoProvided: true,
    idName: 'Chaltu Desta',
    status: 'pending',
    story: 'Providing a 10,000 liter water tank and sand-filter system for over 450 school children in Ambo town.',
  },
  {
    id: 'rev-03',
    applicant: 'Yonas Haile',
    campaign: 'Rebuilding Fire-Damaged Bakery in Merkato',
    category: 'Community',
    daysWaiting: 1,
    accountType: 'Awash Bank',
    accountHolder: 'Yonas Haile Mariam',
    accountLast4: '9915',
    idPhotoProvided: true,
    idName: 'Yonas Haile Mariam',
    status: 'changes',
    story: 'Community bakery destroyed by electrical fire. Seeking support to purchase commercial ovens and rebuild storefront.',
  },
  {
    id: 'rev-04',
    applicant: 'Fatima Ahmed',
    campaign: 'Drought Relief Food Packages in Somali Region',
    category: 'Emergency',
    daysWaiting: 4,
    accountType: 'Telebirr',
    accountHolder: 'Fatima Ahmed Ali',
    accountLast4: '7119',
    idPhotoProvided: true,
    idName: 'Fatima Ahmed Ali',
    status: 'approved',
    recommended: true,
    story: 'Supplying 200 pastoralist families with flour, oil, and clean water purification tablets across Gode district.',
  },
];

export default function StaffReviewsPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'changes' | 'approved' | 'rejected'>('all');
  const [activeItem, setActiveItem] = useState<ReviewItem | null>(null);

  // Review Dialog Checklist
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);
  const [reason, setReason] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const filtered = INITIAL_REVIEWS.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  }).sort((a, b) => b.daysWaiting - a.daysWaiting);

  const openReviewModal = (item: ReviewItem) => {
    setActiveItem(item);
    setCheck1(false);
    setCheck2(false);
    setCheck3(false);
    setReason('');
    setAdminNote('');
    setFeedback(null);
  };

  const handleRequestChanges = () => {
    if (reason.trim().length < 5) {
      setFeedback({ type: 'err', text: 'Reason is required and must be at least 5 characters.' });
      return;
    }
    setFeedback({
      type: 'ok',
      text: `Change request successfully logged and sent to applicant (${activeItem?.applicant}).`,
    });
    setTimeout(() => setActiveItem(null), 1500);
  };

  const handleSendToAdmin = () => {
    if (!(check1 && check2 && check3)) {
      setFeedback({ type: 'err', text: 'All 3 checklist requirements must be completed before sending to Admin.' });
      return;
    }
    setFeedback({
      type: 'ok',
      text: `Staff recommendation forwarded to Admin console with note: "${adminNote || 'Ready for review'}"`,
    });
    setTimeout(() => setActiveItem(null), 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A1A1A]">Reviews Queue</h1>
          <p className="text-sm text-[#6E6E6E] mt-1">
            Applications sorted by longest waiting. Staff can request changes or recommend to Admin.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex p-1 bg-white border border-[#EBEBEB] rounded-full self-start flex-wrap">
          {(['all', 'pending', 'changes', 'approved', 'rejected'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilter(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                filter === st
                  ? 'bg-[#1A1A1A] text-white shadow-sm'
                  : 'text-[#6E6E6E] hover:text-[#1A1A1A]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-[24px] border border-[#EBEBEB] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#EBEBEB] text-[#6E6E6E] text-xs uppercase font-extrabold tracking-wider">
                <th className="py-3.5 px-5">Applicant</th>
                <th className="py-3.5 px-5">Campaign</th>
                <th className="py-3.5 px-5">Waiting</th>
                <th className="py-3.5 px-5">Account</th>
                <th className="py-3.5 px-5">ID Photo</th>
                <th className="py-3.5 px-5">Name Match</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {filtered.map((item) => {
                const nameMatches = item.accountHolder.toLowerCase().includes(item.idName.toLowerCase()) ||
                  item.idName.toLowerCase().includes(item.accountHolder.toLowerCase());

                return (
                  <tr key={item.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="py-4 px-5 font-bold text-[#1A1A1A]">{item.applicant}</td>
                    <td className="py-4 px-5">
                      <div className="font-semibold text-[#1A1A1A] max-w-[220px] truncate">{item.campaign}</div>
                      <span className="text-xs text-[#6E6E6E]">{item.category}</span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-bold text-[#1A1A1A]">{item.daysWaiting} days</span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F5F5F5] text-[#1A1A1A]">
                        {item.accountType} •••• {item.accountLast4}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      {item.idPhotoProvided ? (
                        <span className="text-xs font-bold text-emerald-700">✓ Uploaded</span>
                      ) : (
                        <span className="text-xs font-bold text-[#B3261E]">Missing</span>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      {nameMatches ? (
                        <span className="text-xs font-bold text-emerald-700">✓ Verified</span>
                      ) : (
                        <span className="text-xs font-bold text-amber-700">⚠ Discrepancy</span>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                        item.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : item.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'changes'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.status}
                      </span>
                      {item.recommended && (
                        <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-[#CCF88E] text-[#1A1A1A]">
                          Recommended
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => openReviewModal(item)}
                        className="px-4 py-1.5 rounded-full bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold transition-all shadow-sm"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Dialog Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="bg-white rounded-[26px] w-full max-w-[720px] p-6 sm:p-7 shadow-2xl my-auto text-[#1A1A1A] max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#EBEBEB] pb-4 mb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#6E6E6E]">Staff Verification</span>
                <h2 className="text-lg sm:text-xl font-bold mt-0.5">{activeItem.campaign}</h2>
                <p className="text-xs text-[#6E6E6E]">Applicant: {activeItem.applicant} · Waiting: {activeItem.daysWaiting} days</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="w-8 h-8 rounded-full bg-[#F5F5F5] hover:bg-[#EBEBEB] flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Campaign Story */}
            <div className="p-4 bg-[#F9FAFB] rounded-2xl border border-[#EBEBEB] mb-5 text-xs text-[#6E6E6E] leading-relaxed">
              <span className="font-bold text-[#1A1A1A] block mb-1">Campaign Story</span>
              {activeItem.story}
            </div>

            {/* Account & ID Matching Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div className="p-4 bg-white border border-[#EBEBEB] rounded-2xl">
                <span className="text-xs font-bold text-[#6E6E6E] block mb-1">Payout Account (Masked)</span>
                <div className="text-sm font-bold text-[#1A1A1A]">{activeItem.accountType}</div>
                <div className="text-xs text-[#1A1A1A] mt-1 font-semibold">Holder: {activeItem.accountHolder}</div>
                <div className="text-xs text-[#6E6E6E]">Number: •••• •••• •••• {activeItem.accountLast4}</div>
              </div>

              <div className="p-4 bg-white border border-[#EBEBEB] rounded-2xl">
                <span className="text-xs font-bold text-[#6E6E6E] block mb-1">Government ID (Signed URL / No-Store)</span>
                <div className="text-sm font-bold text-[#1A1A1A]">Name on ID: {activeItem.idName}</div>
                <div className="mt-2 text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                  ID Photo view logged to security audit log
                </div>
              </div>
            </div>

            {/* Name Match Warning */}
            <div className="p-3 bg-[#CCF88E]/20 border border-[#CCF88E] rounded-xl text-xs font-bold text-[#1A1A1A] mb-5">
              ✓ Account holder name and ID name verified. Please confirm checklist items below.
            </div>

            {/* 3-Item Checklist */}
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#1A1A1A] mb-3">Verification Checklist</h3>
            <div className="space-y-2.5 mb-5 text-sm">
              <label className="flex items-start gap-3 cursor-pointer p-3 bg-[#F9FAFB] hover:bg-[#F5F5F5] rounded-xl transition-all border border-[#EBEBEB]">
                <input
                  type="checkbox"
                  checked={check1}
                  onChange={(e) => setCheck1(e.target.checked)}
                  className="w-4 h-4 accent-[#1A1A1A] mt-0.5 shrink-0"
                />
                <span className="font-semibold text-xs text-[#1A1A1A]">Name on the ID matches the payout account holder</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-3 bg-[#F9FAFB] hover:bg-[#F5F5F5] rounded-xl transition-all border border-[#EBEBEB]">
                <input
                  type="checkbox"
                  checked={check2}
                  onChange={(e) => setCheck2(e.target.checked)}
                  className="w-4 h-4 accent-[#1A1A1A] mt-0.5 shrink-0"
                />
                <span className="font-semibold text-xs text-[#1A1A1A]">ID photo is clear, all corners visible, and not expired</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-3 bg-[#F9FAFB] hover:bg-[#F5F5F5] rounded-xl transition-all border border-[#EBEBEB]">
                <input
                  type="checkbox"
                  checked={check3}
                  onChange={(e) => setCheck3(e.target.checked)}
                  className="w-4 h-4 accent-[#1A1A1A] mt-0.5 shrink-0"
                />
                <span className="font-semibold text-xs text-[#1A1A1A]">Story, category, and proposed beneficiaries look genuine</span>
              </label>
            </div>

            {/* Inputs: Reason for Changes or Admin Note */}
            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-xs font-bold text-[#6E6E6E] mb-1">
                  Reason for Changes (Required to request revisions - min 5 chars):
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Please re-upload a clearer image of your Kebele ID card."
                  className="w-full border border-[#EBEBEB] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6E6E6E] mb-1">
                  Note to Admin (Optional when recommending to Admin):
                </label>
                <input
                  type="text"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="e.g. Payout and Kebele match verified. Recommended for approval."
                  className="w-full border border-[#EBEBEB] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#1A1A1A]"
                />
              </div>
            </div>

            {feedback && (
              <div className={`p-3 rounded-xl text-xs font-bold mb-4 ${
                feedback.type === 'ok' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {feedback.text}
              </div>
            )}

            {/* Action Buttons (Strictly Staff Powers: Request Changes or Send to Admin) */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#EBEBEB] flex-wrap">
              <span className="text-[11px] text-[#6E6E6E] font-medium">
                Staff Protocol: Cannot approve or reject directly.
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleRequestChanges}
                  className="px-4 py-2 rounded-full border border-[#1A1A1A] text-[#1A1A1A] font-bold text-xs hover:bg-[#F5F5F5] transition-all"
                >
                  Request Changes
                </button>

                <button
                  type="button"
                  disabled={!(check1 && check2 && check3)}
                  onClick={handleSendToAdmin}
                  className="px-5 py-2 rounded-full bg-[#1A1A1A] text-white font-bold text-xs hover:bg-black transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  Send to Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
