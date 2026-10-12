'use client';

import React, { useState } from 'react';

interface AuditRow {
  id: string;
  time: string;
  actor: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF';
  action: string;
  target: string;
  ip: string;
}

const INITIAL_LOGS: AuditRow[] = [
  {
    id: 'aud-01',
    time: '12 Oct 2026, 06:40',
    actor: 'Dawit Asefa',
    role: 'SUPER_ADMIN',
    action: 'INVITE_MEMBER',
    target: 'henok.applicant@gmail.com (Role: STAFF)',
    ip: '196.189.24.11',
  },
  {
    id: 'aud-02',
    time: '12 Oct 2026, 06:15',
    actor: 'Selamawit Bekele',
    role: 'STAFF',
    action: 'VIEW_ID_PHOTO',
    target: 'Campaign ID: c-1 (Abebe Kebede)',
    ip: '197.156.78.92',
  },
  {
    id: 'aud-03',
    time: '12 Oct 2026, 05:52',
    actor: 'Selamawit Bekele',
    role: 'STAFF',
    action: 'STAFF_RECOMMEND',
    target: 'Forwarded to Admin: Emergency Surgery',
    ip: '197.156.78.92',
  },
  {
    id: 'aud-04',
    time: '12 Oct 2026, 04:30',
    actor: 'Kalkidan Mengistu',
    role: 'ADMIN',
    action: 'APPROVE_CAMPAIGN',
    target: 'Campaign ID: c-4 (Fatima Ahmed)',
    ip: '196.189.102.5',
  },
  {
    id: 'aud-05',
    time: '11 Oct 2026, 21:10',
    actor: 'Dawit Asefa',
    role: 'SUPER_ADMIN',
    action: 'EXPORT_REPORT',
    target: 'Reconciliation Statement Q1 2026 (Unmasked)',
    ip: '196.189.24.11',
  },
];

export default function SuperAuditPage() {
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const filtered = INITIAL_LOGS.filter((l) => {
    if (filterAction !== 'ALL' && l.action !== filterAction) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        l.actor.toLowerCase().includes(q) ||
        l.target.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportAuditCSV = () => {
    const headers = 'Audit ID,Timestamp,Actor Name,Actor Role,Action Type,Target Entity,IP Address\r\n';
    const rows = filtered
      .map(
        (r) =>
          `"${r.id}","${r.time}","${r.actor}","${r.role}","${r.action}","${r.target}","${r.ip}"`
      )
      .join('\r\n');
    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wegen_immutable_audit_log_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A1A1A]">Security Audit Log</h1>
          <p className="text-sm text-[#6E6E6E] mt-1">
            Immutable, append-only record of all administrative, staff reviews, ID views, and security events.
          </p>
        </div>

        <button
          type="button"
          onClick={exportAuditCSV}
          className="px-5 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold transition-all shadow-sm self-start sm:self-auto flex items-center gap-2"
        >
          ⬇ Export Audit Log (CSV)
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by actor name, target, or keyword..."
          className="flex-1 border border-[#EBEBEB] bg-white rounded-full px-4 py-2.5 text-xs outline-none focus:border-[#1A1A1A]"
        />

        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="border border-[#EBEBEB] bg-white rounded-full px-4 py-2.5 text-xs font-semibold outline-none focus:border-[#1A1A1A]"
        >
          <option value="ALL">All Actions</option>
          <option value="VIEW_ID_PHOTO">VIEW_ID_PHOTO</option>
          <option value="STAFF_RECOMMEND">STAFF_RECOMMEND</option>
          <option value="APPROVE_CAMPAIGN">APPROVE_CAMPAIGN</option>
          <option value="INVITE_MEMBER">INVITE_MEMBER</option>
          <option value="EXPORT_REPORT">EXPORT_REPORT</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-[24px] border border-[#EBEBEB] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#EBEBEB] text-[#6E6E6E] uppercase font-extrabold tracking-wider">
                <th className="py-3.5 px-5">Timestamp</th>
                <th className="py-3.5 px-5">Actor & Role</th>
                <th className="py-3.5 px-5">Security Action</th>
                <th className="py-3.5 px-5">Target Entity / Detail</th>
                <th className="py-3.5 px-5 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-4 px-5 font-mono text-[#6E6E6E]">{log.time}</td>
                  <td className="py-4 px-5">
                    <span className="font-bold text-[#1A1A1A] block">{log.actor}</span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-0.5 ${
                      log.role === 'SUPER_ADMIN'
                        ? 'bg-[#1A1A1A] text-white'
                        : log.role === 'ADMIN'
                        ? 'bg-[#CCF88E] text-[#1A1A1A]'
                        : 'bg-[#E0F2FE] text-[#0369A1]'
                    }`}>
                      {log.role}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="font-mono font-bold text-[#1A1A1A] bg-[#F5F5F5] px-2.5 py-1 rounded-md">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-medium text-[#1A1A1A]">{log.target}</td>
                  <td className="py-4 px-5 text-right font-mono text-[#6E6E6E]">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
