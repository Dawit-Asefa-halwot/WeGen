'use client';

import React, { useState } from 'react';

export default function SuperReportsPage() {
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  const donors = [
    {
      id: 'd-1',
      name: 'Dr. Tedros Bekele',
      unmaskedPhone: '+251 911 234 567',
      maskedPhone: '+251 91 **** 567',
      email: 'tedros.bekele@health.et',
      campaign: 'Emergency Cardiac Surgery for Bethlehem',
      amount: '5,000 ETB',
      method: 'Telebirr',
      date: '12 Oct 2026',
    },
    {
      id: 'd-2',
      name: 'Marta Asfaw',
      unmaskedPhone: '+251 922 876 543',
      maskedPhone: '+251 92 **** 543',
      email: 'marta.asfaw@gmail.com',
      campaign: 'Clean Drinking Water for Ambo Primary School',
      amount: '2,500 ETB',
      method: 'CBE Birr',
      date: '11 Oct 2026',
    },
    {
      id: 'd-3',
      name: 'Ephrem Girma',
      unmaskedPhone: '+251 930 112 233',
      maskedPhone: '+251 93 **** 233',
      email: 'ephrem.girma@outlook.com',
      campaign: 'Drought Relief Food Packages in Somali Region',
      amount: '10,000 ETB',
      method: 'Card / PSS',
      date: '10 Oct 2026',
    },
  ];

  const handleDownloadUnmasked = () => {
    const headers = 'Donor Name,Unmasked Phone,Email,Campaign,Amount,Payment Method,Date\r\n';
    const rows = donors
      .map(
        (d) =>
          `"${d.name}","${d.unmaskedPhone}","${d.email}","${d.campaign}","${d.amount}","${d.method}","${d.date}"`
      )
      .join('\r\n');
    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `superadmin_unmasked_donors_report_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadMsg('Export logged to Security Audit Log as EXPORT_REPORT (Unmasked).');
    setTimeout(() => setDownloadMsg(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-[#1A1A1A] text-[#CCF88E] text-[11px] font-black mb-2">
            SUPER ADMIN PRIVILEGE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A1A1A]">
            Donor Records & Reports (Unmasked Access)
          </h1>
          <p className="text-sm text-[#6E6E6E] mt-1">
            Donor contact phone numbers are visible in full exclusively to the Super Admin. Regular Admins receive masked entries.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadUnmasked}
          className="px-5 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold transition-all shadow-sm self-start sm:self-auto flex items-center gap-2"
        >
          ⬇ Export Unmasked Report (CSV)
        </button>
      </div>

      {downloadMsg && (
        <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold">
          {downloadMsg}
        </div>
      )}

      {/* Donors Table */}
      <div className="bg-white rounded-[24px] border border-[#EBEBEB] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#EBEBEB] text-[#6E6E6E] uppercase font-extrabold tracking-wider">
                <th className="py-3.5 px-5">Donor Name</th>
                <th className="py-3.5 px-5">Unmasked Phone</th>
                <th className="py-3.5 px-5">Admin Masked View</th>
                <th className="py-3.5 px-5">Campaign</th>
                <th className="py-3.5 px-5">Donation</th>
                <th className="py-3.5 px-5 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {donors.map((d) => (
                <tr key={d.id} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-4 px-5">
                    <span className="font-bold text-[#1A1A1A] block">{d.name}</span>
                    <span className="text-[11px] text-[#6E6E6E]">{d.email}</span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                      {d.unmaskedPhone}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-mono text-[#6E6E6E]">{d.maskedPhone}</td>
                  <td className="py-4 px-5 font-medium text-[#1A1A1A]">{d.campaign}</td>
                  <td className="py-4 px-5">
                    <strong className="text-emerald-700">{d.amount}</strong>
                    <span className="block text-[10px] text-[#6E6E6E]">{d.method}</span>
                  </td>
                  <td className="py-4 px-5 text-right font-medium text-[#6E6E6E]">{d.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
