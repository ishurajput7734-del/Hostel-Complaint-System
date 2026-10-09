import React, { useState } from 'react';
import { Shield, Search, Calendar, FileText } from 'lucide-react';
import { AuditLogEntry } from '../types';

interface AdminAuditLogsProps {
  auditLogs: AuditLogEntry[];
}

export const AdminAuditLogs: React.FC<AdminAuditLogsProps> = ({ auditLogs }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter((log) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.complaintId.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.adminId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#A94F61] uppercase tracking-wider mb-1">
          <Shield className="w-3.5 h-3.5" />
          <span>Security & Compliance Auditing</span>
        </div>
        <h1 className="text-2xl font-bold text-[#202124] font-display">
          Administrative Action Audit Logs
        </h1>
        <p className="text-xs sm:text-sm text-[#5F6368] mt-1">
          Immutable historical records of every status change, maintenance dispatch, and resolution sign-off.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E9D9D5] p-5 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-[#5F6368] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Complaint ID or action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FFF8F5] border border-[#E9D9D5] rounded-xl text-xs sm:text-sm text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#A94F61]"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#E9D9D5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E9D9D5] bg-[#FFF8F5] text-[11px] font-bold text-[#5F6368] uppercase tracking-wider">
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Admin Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Complaint ID</th>
                <th className="py-3 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9D9D5] text-xs">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FFF8F5] transition-colors">
                  <td className="py-3 px-4 font-mono-tabular font-bold text-[#A94F61]">
                    {log.id}
                  </td>
                  <td className="py-3 px-4 font-mono-tabular text-[#5F6368] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#202124]">
                    {log.adminRole}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono-tabular text-[11px] px-2 py-0.5 rounded bg-[#FFF1EC] text-[#A94F61] font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono-tabular font-bold text-[#202124]">
                    {log.complaintId}
                  </td>
                  <td className="py-3 px-4 text-[#5F6368]">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
