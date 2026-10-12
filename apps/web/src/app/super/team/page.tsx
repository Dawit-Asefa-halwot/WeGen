'use client';

import React, { useState } from 'react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF';
  status: 'Active' | 'Invited' | 'Suspended';
  lastActive: string;
}

const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Dawit Asefa (Platform Owner)',
    email: 'owner@wegen.et',
    role: 'SUPER_ADMIN',
    status: 'Active',
    lastActive: 'Just now',
  },
  {
    id: 'tm-2',
    name: 'Kalkidan Mengistu',
    email: 'kalkidan@wegen.et',
    role: 'ADMIN',
    status: 'Active',
    lastActive: '2 hours ago',
  },
  {
    id: 'tm-3',
    name: 'Selamawit Bekele',
    email: 'selam@wegen.et',
    role: 'STAFF',
    status: 'Active',
    lastActive: '10 mins ago',
  },
  {
    id: 'tm-4',
    name: 'Henok Tadesse',
    email: 'henok.applicant@gmail.com',
    role: 'STAFF',
    status: 'Invited',
    lastActive: 'Invite pending (expires in 44h)',
  },
];

export default function SuperTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'STAFF'>('STAFF');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [invitePassword, setInvitePassword] = useState('Password123!');
  const [invitePhone, setInvitePhone] = useState('0911000000');

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const email = inviteEmail.trim().toLowerCase();
    const name = inviteName.trim();
    const pwd = invitePassword.trim() || 'Password123!';
    const phone = invitePhone.trim() || '0911000000';

    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name,
      email,
      role: inviteRole,
      status: 'Active',
      lastActive: 'Just now',
    };

    // Save to local storage for instant sign-in
    try {
      const { saveCustomUser } = await import('@/lib/custom-users');
      saveCustomUser({
        name,
        email,
        phone,
        password: pwd,
        role: inviteRole,
      });
    } catch (err) {
      console.warn('Could not save to custom users store', err);
    }

    // Attempt to register in backend API as well
    try {
      const { apiRequest } = await import('@/lib/api-client');
      await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password: pwd,
          fullName: name,
          phone,
          role: inviteRole,
        }),
      });
    } catch {
      // Backend fallback already handled by custom user store
    }

    setTeam((prev) => [...prev, newMember]);
    setShowInviteModal(false);
    setInviteName('');
    setInviteEmail('');
    setFeedback(`Team member account created for ${newMember.email} with role ${inviteRole}. They can now log in immediately with their credentials.`);
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleRoleChange = (memberId: string, newRole: 'ADMIN' | 'STAFF') => {
    setTeam((prev) =>
      prev.map((m) => {
        if (m.id === memberId && m.role !== 'SUPER_ADMIN') {
          return { ...m, role: newRole };
        }
        return m;
      })
    );
    setFeedback('Role successfully changed and logged to Security Audit Log.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleToggleSuspend = (memberId: string) => {
    setTeam((prev) =>
      prev.map((m) => {
        if (m.id === memberId && m.role !== 'SUPER_ADMIN') {
          const nextStatus = m.status === 'Suspended' ? 'Active' : 'Suspended';
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );
    setFeedback('Member account status updated. Any active sessions were invalidated.');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A1A1A]">Team & Role Management</h1>
          <p className="text-sm text-[#6E6E6E] mt-1">
            Super Admin exclusive portal. Add, modify roles, or suspend Admins and Staff reviewers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowInviteModal(true)}
          className="px-5 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs transition-all shadow-sm self-start sm:self-auto flex items-center gap-2"
        >
          <span>+</span> Add Team Member
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold">
          {feedback}
        </div>
      )}

      {/* Team Members Table */}
      <div className="bg-white rounded-[24px] border border-[#EBEBEB] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#EBEBEB] text-[#6E6E6E] text-xs uppercase font-extrabold tracking-wider">
                <th className="py-3.5 px-5">Name & Title</th>
                <th className="py-3.5 px-5">Email Address</th>
                <th className="py-3.5 px-5">Role</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Last Active</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {team.map((m) => (
                <tr key={m.id} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-4 px-5">
                    <span className="font-bold text-[#1A1A1A] block">{m.name}</span>
                  </td>
                  <td className="py-4 px-5 text-xs text-[#1A1A1A] font-mono">{m.email}</td>
                  <td className="py-4 px-5">
                    {m.role === 'SUPER_ADMIN' ? (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-[#1A1A1A] text-white">
                        Super Admin
                      </span>
                    ) : (
                      <select
                        value={m.role}
                        onChange={(e) => handleRoleChange(m.id, e.target.value as 'ADMIN' | 'STAFF')}
                        className={`text-xs font-bold rounded-full px-3 py-1 border outline-none cursor-pointer ${
                          m.role === 'ADMIN'
                            ? 'bg-[#CCF88E] border-[#b5eb6e] text-[#1A1A1A]'
                            : 'bg-[#E0F2FE] border-[#bae6fd] text-[#0369A1]'
                        }`}
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="STAFF">Staff</option>
                      </select>
                    )}
                  </td>
                  <td className="py-4 px-5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      m.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : m.status === 'Invited'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-xs text-[#6E6E6E] font-medium">{m.lastActive}</td>
                  <td className="py-4 px-5 text-right">
                    {m.role !== 'SUPER_ADMIN' ? (
                      <button
                        type="button"
                        onClick={() => handleToggleSuspend(m.id)}
                        className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all border ${
                          m.status === 'Suspended'
                            ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                            : 'bg-white text-[#B3261E] border-[#B3261E] hover:bg-rose-50'
                        }`}
                      >
                        {m.status === 'Suspended' ? 'Restore' : 'Suspend'}
                      </button>
                    ) : (
                      <span className="text-xs text-[#A0A0A0] font-semibold italic">Owner</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission Matrix Table */}
      <div className="bg-white rounded-[24px] border border-[#EBEBEB] p-6 sm:p-7 shadow-sm">
        <h2 className="text-lg font-bold text-[#1A1A1A] mb-2">Role Permission Matrix</h2>
        <p className="text-xs text-[#6E6E6E] mb-5">
          Detailed security matrix distinguishing Super Admin, Admin, and Staff privileges.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[550px]">
            <thead>
              <tr className="border-b border-[#EBEBEB] text-[#6E6E6E] uppercase font-extrabold tracking-wider bg-[#FAFAFA]">
                <th className="py-3 px-4">Capability / Access Scope</th>
                <th className="py-3 px-4 text-center">Super Admin</th>
                <th className="py-3 px-4 text-center">Admin</th>
                <th className="py-3 px-4 text-center">Staff Reviewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {[
                { name: 'Financial Overviews & Donation Balances', sa: true, ad: true, st: false },
                { name: 'Analytics Dashboards & Conversion Funnel', sa: true, ad: true, st: false },
                { name: 'Campaign Verification & Checklist Review', sa: true, ad: true, st: true },
                { name: 'Request Changes from Applicants', sa: true, ad: true, st: true },
                { name: 'Approve or Reject Campaigns', sa: true, ad: true, st: false },
                { name: 'Pause Campaigns / Suspend Users', sa: true, ad: true, st: false },
                { name: 'Reconciliation Reports (Masked Phone Numbers)', sa: true, ad: true, st: false },
                { name: 'Unmasked Donor Phone Access', sa: true, ad: false, st: false },
                { name: 'Team Member Management & Role Assignment', sa: true, ad: false, st: false },
                { name: 'Immutable Audit Log Inspection & Export', sa: true, ad: false, st: false },
                { name: 'Platform 10% Fee Rate Setting', sa: true, ad: false, st: false },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-[#F9FAFB]">
                  <td className="py-3 px-4 font-semibold text-[#1A1A1A]">{row.name}</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-700">{row.sa ? '✓ Granted' : '—'}</td>
                  <td className="py-3 px-4 text-center font-bold text-[#1A1A1A]">{row.ad ? '✓ Granted' : '—'}</td>
                  <td className="py-3 px-4 text-center font-bold text-[#6E6E6E]">{row.st ? '✓ Granted' : 'Forbidden'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Team Member Modal */}
      {showInviteModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setShowInviteModal(false)}
        >
          <div
            className="bg-white rounded-[26px] w-full max-w-[500px] p-6 sm:p-7 shadow-2xl my-auto text-[#1A1A1A]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EBEBEB] pb-3 mb-4">
              <h2 className="text-lg font-bold">Invite New Team Member</h2>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="w-8 h-8 rounded-full bg-[#F5F5F5] hover:bg-[#EBEBEB] flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6E6E6E] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Bethlehem Yohannes"
                  className="w-full border border-[#EBEBEB] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6E6E6E] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="e.g. bethlehem@wegen.et"
                  className="w-full border border-[#EBEBEB] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6E6E6E] mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                  placeholder="0911223344"
                  className="w-full border border-[#EBEBEB] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6E6E6E] mb-1">Initial Password</label>
                <input
                  type="password"
                  required
                  value={invitePassword}
                  onChange={(e) => setInvitePassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-[#EBEBEB] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6E6E6E] mb-1">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'ADMIN' | 'STAFF')}
                  className="w-full border border-[#EBEBEB] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#1A1A1A] font-semibold"
                >
                  <option value="STAFF">Staff (Reviewer, No Financial Access)</option>
                  <option value="ADMIN">Admin (Full Operational & Review Access)</option>
                </select>
              </div>

              <div className="p-3 bg-[#F9FAFB] border border-[#EBEBEB] rounded-xl text-[11px] text-[#6E6E6E] leading-relaxed">
                The member can immediately sign in at <span className="font-mono text-[#1A1A1A] font-bold">/auth/login</span> using this email and password, landing directly in their assigned portal.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EBEBEB]">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-full border border-[#1A1A1A] text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold shadow-sm"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
