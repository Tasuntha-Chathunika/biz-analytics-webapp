import React from 'react';

const teamMembers = [
  { name: 'Sarah Connor', role: 'Admin', email: 'sarah@bizanalytics.app', avatar: 'bg-indigo-500' },
  { name: 'John Doe', role: 'Manager', email: 'john@bizanalytics.app', avatar: 'bg-emerald-500' },
  { name: 'Alice Smith', role: 'Viewer', email: 'alice@bizanalytics.app', avatar: 'bg-amber-500' },
  { name: 'Bob Johnson', role: 'Viewer', email: 'bob@bizanalytics.app', avatar: 'bg-rose-500' },
];

export default function TeamPage({ userRole }) {
  return (
    <div className="space-y-6 pb-6 animate-fade-up">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Team Management</h2>
          <p className="text-sm text-slate-500 mt-1">Manage users, roles, and access permissions</p>
        </div>
        {userRole === 'admin' && (
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all">
            + Invite Member
          </button>
        )}
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Member</th>
                <th className="text-left py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="text-left py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="text-right py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${member.avatar}`}>
                        {member.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{member.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-slate-500">{member.email}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      member.role === 'Admin' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                      member.role === 'Manager' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors px-2">Edit</button>
                    {userRole === 'admin' && <button className="text-xs font-medium text-slate-400 hover:text-rose-600 transition-colors px-2">Remove</button>}
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
