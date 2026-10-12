import React from 'react';

export default function StaffUsersPage() {
  const users = [
    { id: 'u-1', name: 'Abebe Kebede', email: 'a•••@gmail.com', role: 'Fundraiser', joined: '12 Jan 2026', status: 'Active' },
    { id: 'u-2', name: 'Chaltu Desta', email: 'c•••@telecom.et', role: 'Fundraiser', joined: '18 Feb 2026', status: 'Active' },
    { id: 'u-3', name: 'Yonas Haile', email: 'y•••@outlook.com', role: 'Fundraiser', joined: '02 Mar 2026', status: 'Active' },
    { id: 'u-4', name: 'Tigist Assefa', email: 't•••@yahoo.com', role: 'Donor', joined: '15 Mar 2026', status: 'Active' },
    { id: 'u-5', name: 'Mekonnen Tadesse', email: 'm•••@gmail.com', role: 'Donor', joined: '22 Mar 2026', status: 'Active' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A1A1A]">Registered Users (Read Only)</h1>
        <p className="text-sm text-[#6E6E6E] mt-1">
          User directory for identity verification. All email addresses are server-masked. Suspend and edit controls are disabled.
        </p>
      </div>

      <div className="bg-white rounded-[24px] border border-[#EBEBEB] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#EBEBEB] text-[#6E6E6E] text-xs uppercase font-extrabold tracking-wider">
                <th className="py-3.5 px-5">User Full Name</th>
                <th className="py-3.5 px-5">Masked Email</th>
                <th className="py-3.5 px-5">Role</th>
                <th className="py-3.5 px-5">Joined Date</th>
                <th className="py-3.5 px-5 text-right">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-4 px-5 font-bold text-[#1A1A1A]">{u.name}</td>
                  <td className="py-4 px-5 text-xs text-[#6E6E6E] font-mono">{u.email}</td>
                  <td className="py-4 px-5">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F5F5F5] text-[#1A1A1A]">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-xs text-[#6E6E6E] font-medium">{u.joined}</td>
                  <td className="py-4 px-5 text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
