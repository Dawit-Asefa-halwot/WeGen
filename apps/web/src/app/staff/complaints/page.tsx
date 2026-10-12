'use client';

import React, { useState } from 'react';

interface ComplaintItem {
  id: string;
  campaignId: string;
  campaignTitle: string;
  campaignCategory: string;
  ownerName: string;
  reason: string;
  text: string;
  reporterName: string;
  reporterEmail: string;
  reporterRel: string;
  docs: Array<[string, string, string]>;
  daysWaiting: number;
  status: 'new' | 'investigating' | 'escalated' | 'docs' | 'action' | 'dismissed';
  notes: Array<{ by: string; t: number; x: string }>;
}

const INITIAL_COMPLAINTS: ComplaintItem[] = [
  {
    id: 'r1',
    campaignId: 'c0',
    campaignTitle: 'Heart surgery for Dawit’s mother',
    campaignCategory: 'Medical',
    ownerName: 'Dawit Alemu',
    reason: 'Fraud or scam',
    text: 'I believe this fundraiser is a scam. The story does not match what the family told people in our area, and the donation account belongs to someone else.',
    reporterName: 'Abel Tadesse',
    reporterEmail: 'abel@example.com',
    reporterRel: 'Donor',
    docs: [['chat-screenshot.jpg', 'Image', '1.2 MB']],
    daysWaiting: 2,
    status: 'new',
    notes: [],
  },
  {
    id: 'r2',
    campaignId: 'c0',
    campaignTitle: 'Heart surgery for Dawit’s mother',
    campaignCategory: 'Medical',
    ownerName: 'Dawit Alemu',
    reason: 'Fake story or photos',
    text: 'The photos are copied from another page and the hospital named in the story says it has no such patient.',
    reporterName: 'Bethel Wolde',
    reporterEmail: 'bethel@example.com',
    reporterRel: 'Friend of the owner',
    docs: [['hospital-letter.pdf', 'PDF', '340 KB'], ['original-post.png', 'Image', '860 KB']],
    daysWaiting: 5,
    status: 'investigating',
    notes: [{ by: 'Staff', t: Date.now() - 3600000, x: 'Checked hospital name against national registry. Needs admin decision.' }],
  },
  {
    id: 'r3',
    campaignId: 'c3',
    campaignTitle: 'Flood relief for families in Dire Dawa',
    campaignCategory: 'Emergencies',
    ownerName: 'Abebe Kebede',
    reason: 'Misuse of funds',
    text: 'The owner already received money, but posted no update and is asking for more with a different story.',
    reporterName: 'Chala Kassa',
    reporterEmail: 'chala@example.com',
    reporterRel: 'Family member',
    docs: [['chat-screenshot.jpg', 'Image', '1.2 MB'], ['hospital-letter.pdf', 'PDF', '340 KB'], ['id-copy.jpg', 'Image', '2.1 MB']],
    daysWaiting: 1,
    status: 'escalated',
    notes: [{ by: 'Staff', t: Date.now() - 7200000, x: 'Escalated to admin: multiple donors reporting absence of relief delivery.' }],
  },
  {
    id: 'r4',
    campaignId: 'c2',
    campaignTitle: 'Rebuild Meron’s family shop',
    campaignCategory: 'Business',
    ownerName: 'Meron Haile',
    reason: 'Impersonation',
    text: 'This person is using my relative’s name and photo without permission.',
    reporterName: 'Eden Gebre',
    reporterEmail: 'eden@example.com',
    reporterRel: 'Stranger',
    docs: [['id-copy.jpg', 'Image', '2.1 MB']],
    daysWaiting: 9,
    status: 'new',
    notes: [],
  },
  {
    id: 'r5',
    campaignId: 'c4',
    campaignTitle: 'Medical bills for Yonas',
    campaignCategory: 'Medical',
    ownerName: 'Abebe Kebede',
    reason: 'Fake story or photos',
    text: 'The photos are copied from another page and the hospital named in the story says it has no such patient.',
    reporterName: 'Fikir Hailu',
    reporterEmail: 'fikir@example.com',
    reporterRel: 'Neighbour',
    docs: [['original-post.png', 'Image', '860 KB'], ['id-copy.jpg', 'Image', '2.1 MB']],
    daysWaiting: 3,
    status: 'docs',
    notes: [{ by: 'Admin', t: Date.now() - 14400000, x: 'Requested hospital medical discharge certificate.' }],
  },
  {
    id: 'r6',
    campaignId: 'c1',
    campaignTitle: 'University tuition for Selam',
    campaignCategory: 'Education',
    ownerName: 'Selam Tesfaye',
    reason: 'Duplicate fundraiser',
    text: 'The same story and photos are running on a second fundraiser by the same person.',
    reporterName: 'Genet Mekonnen',
    reporterEmail: 'genet@example.com',
    reporterRel: 'Donor',
    docs: [['chat-screenshot.jpg', 'Image', '1.2 MB']],
    daysWaiting: 12,
    status: 'investigating',
    notes: [],
  },
  {
    id: 'r7',
    campaignId: 'c5',
    campaignTitle: 'Clean water for Hana’s village school',
    campaignCategory: 'Community',
    ownerName: 'Selam Tesfaye',
    reason: 'Inappropriate content',
    text: 'The story contains content that should not be public.',
    reporterName: 'Henok Negash',
    reporterEmail: 'henok@example.com',
    reporterRel: 'Friend of the owner',
    docs: [['chat-screenshot.jpg', 'Image', '1.2 MB'], ['hospital-letter.pdf', 'PDF', '340 KB']],
    daysWaiting: 0,
    status: 'new',
    notes: [],
  },
  {
    id: 'r8',
    campaignId: 'c3',
    campaignTitle: 'Flood relief for families in Dire Dawa',
    campaignCategory: 'Emergencies',
    ownerName: 'Abebe Kebede',
    reason: 'Fraud or scam',
    text: 'I believe this fundraiser is a scam. The story does not match what the family told people in our area.',
    reporterName: 'Iman Teshome',
    reporterEmail: 'iman@example.com',
    reporterRel: 'Donor',
    docs: [['id-copy.jpg', 'Image', '2.1 MB']],
    daysWaiting: 20,
    status: 'dismissed',
    notes: [{ by: 'Super Admin', t: Date.now() - 86400000, x: 'Investigated with regional bureau; verified genuine.' }],
  },
];

export default function StaffComplaintsPage() {
  const [complaints, setComplaints] = useState<ComplaintItem[]>(INITIAL_COMPLAINTS);
  const [filter, setFilter] = useState<'open' | 'action' | 'dismissed' | 'all'>('open');
  const [query, setQuery] = useState('');
  const [activeComplaint, setActiveComplaint] = useState<ComplaintItem | null>(null);

  // Modal Checklist
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [errorText, setErrorText] = useState('');
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);

  const openList = complaints.filter(r => ['new', 'investigating', 'escalated', 'docs'].includes(r.status));
  const multiReportCount = new Set(
    openList.filter(r => openList.filter(x => x.campaignId === r.campaignId).length > 1).map(r => r.campaignId)
  ).size;

  const filtered = complaints
    .filter((r) => {
      const matchStatus =
        filter === 'all'
          ? true
          : filter === 'open'
          ? ['new', 'investigating', 'escalated', 'docs'].includes(r.status)
          : r.status === filter;
      const matchSearch =
        `${r.campaignTitle} ${r.reason} ${r.reporterName} ${r.ownerName}`.toLowerCase().includes(query.toLowerCase());
      return matchStatus && matchSearch;
    })
    .sort((a, b) => {
      const countA = complaints.filter(x => x.campaignId === a.campaignId).length;
      const countB = complaints.filter(x => x.campaignId === b.campaignId).length;
      return countB - countA || b.daysWaiting - a.daysWaiting;
    });

  const openModal = (item: ComplaintItem) => {
    setActiveComplaint(item);
    setCheck1(false);
    setCheck2(false);
    setCheck3(false);
    setNoteInput('');
    setErrorText('');
    setPreviewDoc(null);
  };

  const handleAddNote = () => {
    if (noteInput.trim().length < 5) {
      setErrorText('Write a note or reason (5+ characters).');
      return;
    }
    if (!activeComplaint) return;

    setComplaints(prev =>
      prev.map(c =>
        c.id === activeComplaint.id
          ? {
              ...c,
              notes: [...c.notes, { by: 'Staff', t: Date.now(), x: noteInput.trim() }],
            }
          : c
      )
    );
    setNoteInput('');
    setErrorText('');
  };

  const handleStartInvestigating = () => {
    if (!activeComplaint) return;
    setComplaints(prev =>
      prev.map(c =>
        c.id === activeComplaint.id
          ? {
              ...c,
              status: 'investigating',
              notes: noteInput.trim()
                ? [...c.notes, { by: 'Staff', t: Date.now(), x: noteInput.trim() }]
                : c.notes,
            }
          : c
      )
    );
    setActiveComplaint(null);
  };

  const handleEscalateToAdmin = () => {
    if (!check1 || !check2 || !check3) {
      setErrorText('All 3 checklist items must be ticked to escalate.');
      return;
    }
    if (noteInput.trim().length < 5) {
      setErrorText('Write a short note or reason (5+ characters) for escalating.');
      return;
    }
    if (!activeComplaint) return;

    setComplaints(prev =>
      prev.map(c =>
        c.id === activeComplaint.id
          ? {
              ...c,
              status: 'escalated',
              notes: [...c.notes, { by: 'Staff', t: Date.now(), x: `Escalated to Admin: ${noteInput.trim()}` }],
            }
          : c
      )
    );
    setActiveComplaint(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A1A1A]">Complaints</h1>
        <p className="text-sm text-[#6E6E6E] mt-1">
          People who reported a fundraiser. Check the reason and evidence before escalating. Staff cannot dismiss or pause.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white border border-[#EBEBEB] rounded-[18px] p-4 text-left shadow-sm">
          <small className="text-[#6E6E6E] text-xs block font-medium">Open complaints</small>
          <b className="text-2xl font-bold font-heading text-[#1A1A1A] mt-1 block">{openList.length}</b>
        </div>

        <div className={`border rounded-[18px] p-4 text-left shadow-sm ${multiReportCount > 0 ? 'bg-[#FFF3C9] border-[#F0DC8C]' : 'bg-white border-[#EBEBEB]'}`}>
          <small className="text-[#6E6E6E] text-xs block font-medium">Campaigns reported 2+ times</small>
          <b className="text-2xl font-bold font-heading text-[#1A1A1A] mt-1 block">{multiReportCount}</b>
        </div>

        <div className="bg-white border border-[#EBEBEB] rounded-[18px] p-4 text-left shadow-sm">
          <small className="text-[#6E6E6E] text-xs block font-medium">Oldest open</small>
          <b className="text-2xl font-bold font-heading text-[#1A1A1A] mt-1 block">
            {openList.length ? Math.max(...openList.map(r => r.daysWaiting)) : 0} d
          </b>
        </div>

        <div className="bg-white border border-[#EBEBEB] rounded-[18px] p-4 text-left shadow-sm">
          <small className="text-[#6E6E6E] text-xs block font-medium">Closed</small>
          <b className="text-2xl font-bold font-heading text-[#1A1A1A] mt-1 block">
            {complaints.length - openList.length}
          </b>
        </div>
      </div>

      {/* Search & Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2.5">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search campaign, reason or reporter"
          className="border border-[#cfcfcf] rounded-full px-4 py-2 bg-white text-xs outline-none focus:border-[#1A1A1A]"
        />

        {[
          ['open', 'Open', openList.length],
          ['action', 'Action taken', complaints.filter(r => r.status === 'action').length],
          ['dismissed', 'Dismissed', complaints.filter(r => r.status === 'dismissed').length],
          ['all', 'All', complaints.length],
        ].map(([val, label, count]) => (
          <button
            key={val}
            type="button"
            onClick={() => setFilter(val as any)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
              filter === val
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                : 'bg-white text-[#1A1A1A] border-[#cfcfcf] hover:border-[#1A1A1A]'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-[22px] border border-[#EBEBEB] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#EBEBEB] text-[#6E6E6E] uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Campaign</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Reporter (Masked)</th>
                <th className="py-3 px-4">Files</th>
                <th className="py-3 px-4">Waiting</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {filtered.map((r) => {
                const reportCount = complaints.filter(x => x.campaignId === r.campaignId).length;
                return (
                  <tr
                    key={r.id}
                    onClick={() => openModal(r)}
                    className="hover:bg-[#F9FAFB] cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <b className="text-[#1A1A1A] text-xs block">{r.campaignTitle}</b>
                      {reportCount > 1 && (
                        <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#FBE0DD] text-[#B3261E]">
                          {reportCount} reports
                        </span>
                      )}
                      <small className="text-[#6E6E6E] block mt-0.5">{r.ownerName}</small>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#1A1A1A]">{r.reason}</td>
                    <td className="py-3.5 px-4 text-[#6E6E6E] font-medium">{r.reporterName[0]}•••</td>
                    <td className="py-3.5 px-4">{r.docs.length}</td>
                    <td className="py-3.5 px-4">{r.daysWaiting ? `${r.daysWaiting} d` : 'Today'}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        r.status === 'action'
                          ? 'bg-[#FBE0DD] text-[#B3261E]'
                          : r.status === 'dismissed'
                          ? 'bg-[#F6F6F6] text-[#6E6E6E]'
                          : r.status === 'new'
                          ? 'bg-[#FFF3C9] text-[#8A5A00]'
                          : r.status === 'investigating'
                          ? 'bg-[#E5F6F8] text-[#0284C7]'
                          : r.status === 'escalated'
                          ? 'bg-[#FFF3C9] text-[#B45309]'
                          : 'bg-[#E5F6F8] text-[#0284C7]'
                      }`}>
                        {r.status === 'action' ? 'Campaign paused' : r.status === 'docs' ? 'Documents requested' : r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); openModal(r); }}
                        className="px-3 py-1 rounded-full bg-[#CCF88E] hover:bg-[#bbf070] text-[#1A1A1A] font-bold text-xs"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-[#6E6E6E] py-8">
                    No complaints here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Complaint Review Dialog */}
      {activeComplaint && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setActiveComplaint(null)}
        >
          <div
            className="bg-white rounded-[26px] w-full max-w-[740px] p-6 sm:p-7 shadow-2xl my-auto text-[#1A1A1A] max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold font-heading">{activeComplaint.campaignTitle}</h2>
            <p className="text-xs text-[#6E6E6E] mt-1 mb-4">
              Owner: {activeComplaint.ownerName} · {activeComplaint.campaignCategory} · {complaints.filter(x => x.campaignId === activeComplaint.campaignId).length} report(s) on this campaign
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
              <div className="border border-[#EBEBEB] rounded-2xl p-4 bg-[#FAFAFA]">
                <small className="text-[#6E6E6E] uppercase text-[10px] font-bold block mb-1">Reason</small>
                <b className="text-sm block">{activeComplaint.reason}</b>
                <p className="text-xs text-[#1A1A1A] mt-1.5 leading-relaxed">{activeComplaint.text}</p>
              </div>

              <div className="border border-[#EBEBEB] rounded-2xl p-4 bg-[#FAFAFA]">
                <small className="text-[#6E6E6E] uppercase text-[10px] font-bold block mb-1">Reporter (Staff Masked View)</small>
                <div className="text-sm font-semibold">{activeComplaint.reporterName[0]}•••</div>
                <div className="text-xs font-mono text-[#6E6E6E]">
                  {activeComplaint.reporterEmail.replace(/^(.).*(@.*)$/, '$1•••$2')}
                </div>
                <div className="text-xs text-[#6E6E6E] mt-1">{activeComplaint.reporterRel} · {activeComplaint.daysWaiting ? `${activeComplaint.daysWaiting} days ago` : 'today'}</div>
              </div>
            </div>

            {/* Evidence Files */}
            <div className="border border-[#EBEBEB] rounded-2xl p-4 mb-4">
              <small className="text-[#6E6E6E] uppercase text-[10px] font-bold block mb-2">Evidence ({activeComplaint.docs.length})</small>
              {activeComplaint.docs.map(([docName, docType, docSize], idx) => (
                <div key={idx} className="flex items-center gap-2.5 py-2 border-b border-[#EBEBEB] text-xs">
                  <span>{docType === 'PDF' ? '📄' : '🖼️'}</span>
                  <b className="flex-1 min-w-0 truncate">{docName}</b>
                  <span className="text-[#6E6E6E]">{docType} · {docSize}</span>
                  <button
                    type="button"
                    onClick={() => setPreviewDoc(docName)}
                    className="px-2.5 py-1 rounded-full border border-[#1A1A1A] font-semibold text-[11px]"
                  >
                    Preview
                  </button>
                </div>
              ))}
              {previewDoc && (
                <div className="mt-2 border-2 border-dashed border-[#cfcfcf] rounded-xl p-3 text-center text-xs text-[#6E6E6E]">
                  Sample preview of {previewDoc}.<br />
                  Signed temporary URL with Cache-Control: no-store. View logged to security audit.
                </div>
              )}
            </div>

            {/* Notes List */}
            {activeComplaint.notes.map((n, i) => (
              <div key={i} className="bg-[#F6F6F6] rounded-xl p-3 text-xs mb-2">
                <b>{n.by}</b> · {new Date(n.t).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                <br />
                {n.x}
              </div>
            ))}

            {/* Checklist & Staff Escalation */}
            <div className="mt-4 pt-3 border-t border-[#EBEBEB]">
              <h3 className="font-bold text-xs uppercase text-[#6E6E6E] mb-2">Staff Verification Checklist</h3>
              <label className="flex items-start gap-2 text-xs cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={check1}
                  onChange={(e) => setCheck1(e.target.checked)}
                  className="w-4 h-4 accent-[#1A1A1A] mt-0.5 shrink-0"
                />
                <span>The evidence supports the claim</span>
              </label>
              <label className="flex items-start gap-2 text-xs cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={check2}
                  onChange={(e) => setCheck2(e.target.checked)}
                  className="w-4 h-4 accent-[#1A1A1A] mt-0.5 shrink-0"
                />
                <span>The owner’s documents were checked again</span>
              </label>
              <label className="flex items-start gap-2 text-xs cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={check3}
                  onChange={(e) => setCheck3(e.target.checked)}
                  className="w-4 h-4 accent-[#1A1A1A] mt-0.5 shrink-0"
                />
                <span>This is not a duplicate or already-resolved report</span>
              </label>

              <textarea
                value={noteInput}
                onChange={(e) => { setNoteInput(e.target.value); setErrorText(''); }}
                placeholder="Note, staff observation, or reason for escalation (5+ characters)"
                className="w-full border border-[#cfcfcf] rounded-xl p-2.5 text-xs min-h-[65px] outline-none"
              />
              {errorText && <div className="text-[#B3261E] text-xs font-semibold mb-2">{errorText}</div>}

              <div className="flex items-center justify-between gap-2 flex-wrap pt-2">
                <span className="text-[11px] text-[#6E6E6E]">
                  Staff protocol: Only an Admin or Super Admin can dismiss or pause.
                </span>

                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setActiveComplaint(null)} className="px-3.5 py-1.5 rounded-full border border-[#1A1A1A] text-xs font-bold">
                    Close
                  </button>
                  <button type="button" onClick={handleAddNote} className="px-3.5 py-1.5 rounded-full border border-[#1A1A1A] text-xs font-bold">
                    Add note
                  </button>
                  {activeComplaint.status === 'new' && (
                    <button type="button" onClick={handleStartInvestigating} className="px-3.5 py-1.5 rounded-full border border-[#1A1A1A] text-xs font-bold">
                      Start investigating
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={!(check1 && check2 && check3)}
                    onClick={handleEscalateToAdmin}
                    className="px-4 py-1.5 rounded-full bg-[#1A1A1A] text-white text-xs font-bold disabled:opacity-40"
                  >
                    Escalate to admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
