import React from 'react';

export default function StaffCampaignsPage() {
  const campaigns = [
    {
      id: 'c-1',
      title: 'Emergency Cardiac Surgery for Bethlehem',
      applicant: 'Abebe Kebede',
      email: 'a•••@gmail.com',
      category: 'Medical',
      status: 'Live',
      created: '04 Oct 2026',
    },
    {
      id: 'c-2',
      title: 'Clean Drinking Water for Ambo Primary School',
      applicant: 'Chaltu Desta',
      email: 'c•••@telecom.et',
      category: 'Education',
      status: 'Live',
      created: '01 Oct 2026',
    },
    {
      id: 'c-3',
      title: 'Rebuilding Fire-Damaged Bakery in Merkato',
      applicant: 'Yonas Haile',
      email: 'y•••@outlook.com',
      category: 'Community',
      status: 'Pending',
      created: '08 Oct 2026',
    },
    {
      id: 'c-4',
      title: 'Drought Relief Food Packages in Somali Region',
      applicant: 'Fatima Ahmed',
      email: 'f•••@gmail.com',
      category: 'Emergency',
      status: 'Live',
      created: '28 Sep 2026',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A1A1A]">Campaigns (Read Only)</h1>
        <p className="text-sm text-[#6E6E6E] mt-1">
          Platform campaigns view for verification staff. Sensitive emails are masked; financial figures and pause actions are omitted.
        </p>
      </div>

      <div className="bg-white rounded-[24px] border border-[#EBEBEB] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#EBEBEB] text-[#6E6E6E] text-xs uppercase font-extrabold tracking-wider">
                <th className="py-3.5 px-5">Campaign Title</th>
                <th className="py-3.5 px-5">Organizer</th>
                <th className="py-3.5 px-5">Masked Email</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-4 px-5 font-bold text-[#1A1A1A]">{c.title}</td>
                  <td className="py-4 px-5 font-semibold text-[#1A1A1A]">{c.applicant}</td>
                  <td className="py-4 px-5 text-xs text-[#6E6E6E] font-mono">{c.email}</td>
                  <td className="py-4 px-5">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F5F5F5] text-[#1A1A1A]">
                      {c.category}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                      c.status === 'Live' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right text-xs text-[#6E6E6E] font-medium">{c.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
