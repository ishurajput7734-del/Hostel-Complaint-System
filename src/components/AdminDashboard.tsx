import React from 'react';
import { 
  ShieldCheck, AlertTriangle, Clock, CheckCircle2, 
  BarChart3, Users, Building2, Wrench, ArrowRight 
} from 'lucide-react';
import { Complaint, AuditLogEntry, UserSession } from '../types';

interface AdminDashboardProps {
  currentUser: UserSession;
  complaints: Complaint[];
  auditLogs: AuditLogEntry[];
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  complaints,
  auditLogs,
  onNavigateTab,
}) => {
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === 'Submitted' || c.status === 'Reviewed').length;
  const inProgressCount = complaints.filter((c) => c.status === 'Assigned' || c.status === 'In Progress').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;
  const urgentCount = complaints.filter((c) => c.priority === 'Urgent' && c.status !== 'Resolved').length;

  // Category breakdown for charts
  const categoryCounts = complaints.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Block breakdown
  const blockCounts = complaints.reduce((acc, c) => {
    const key = c.hostelBlock.replace('Block ', '');
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Administrator Header */}
      <div className="bg-white rounded-3xl border border-[#E9D9D5] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#A94F61] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Authorized Administrator Terminal · Role-Protected Access</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202124] font-display">
            Hostel Maintenance Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6368] mt-1">
            Basaveshwar Engineering College Bagalkot · Central Grievance Dispatch Console
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('admin-complaints')}
            className="px-5 py-2.5 bg-[#A94F61] text-white font-semibold text-xs sm:text-sm rounded-xl hover:bg-[#8C2E42] transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span>Open Grievance Queue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5 Required Metric Cards from Section 15 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <div className="bg-white rounded-2xl border border-[#E9D9D5] p-5 shadow-xs">
          <p className="text-xs font-bold text-[#5F6368] uppercase tracking-wider">Total Complaints</p>
          <p className="text-3xl font-extrabold font-mono-tabular text-[#202124] mt-2">{totalCount}</p>
          <p className="text-[11px] text-[#5F6368] mt-1">Hostel-wide logged</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E9D9D5] p-5 shadow-xs">
          <p className="text-xs font-bold text-[#A94F61] uppercase tracking-wider">Pending</p>
          <p className="text-3xl font-extrabold font-mono-tabular text-[#A94F61] mt-2">{pendingCount}</p>
          <p className="text-[11px] text-[#5F6368] mt-1">Needs review</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E9D9D5] p-5 shadow-xs">
          <p className="text-xs font-bold text-[#C58A32] uppercase tracking-wider">In Progress</p>
          <p className="text-3xl font-extrabold font-mono-tabular text-[#C58A32] mt-2">{inProgressCount}</p>
          <p className="text-[11px] text-[#5F6368] mt-1">Assigned to staff</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E9D9D5] p-5 shadow-xs">
          <p className="text-xs font-bold text-[#2E8B68] uppercase tracking-wider">Resolved</p>
          <p className="text-3xl font-extrabold font-mono-tabular text-[#2E8B68] mt-2">{resolvedCount}</p>
          <p className="text-[11px] text-[#5F6368] mt-1">Signed off</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E9D9D5] p-5 shadow-xs">
          <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Urgent</p>
          <p className="text-3xl font-extrabold font-mono-tabular text-red-600 mt-2">{urgentCount}</p>
          <p className="text-[11px] text-[#5F6368] mt-1">Immediate priority</p>
        </div>

      </div>

      {/* Analytics Charts Section from Section 15 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Complaints by Category */}
        <div className="bg-white rounded-3xl border border-[#E9D9D5] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E9D9D5] pb-3">
            <h2 className="text-sm font-bold text-[#202124] uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#A94F61]" />
              <span>Complaints by Category</span>
            </h2>
            <span className="text-xs text-[#5F6368]">Total {totalCount}</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#202124]">{cat}</span>
                    <span className="font-mono-tabular text-[#5F6368]">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#FFF1EC] overflow-hidden">
                    <div 
                      className="h-full bg-[#A94F61] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Complaints by Hostel Block */}
        <div className="bg-white rounded-3xl border border-[#E9D9D5] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E9D9D5] pb-3">
            <h2 className="text-sm font-bold text-[#202124] uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#A94F61]" />
              <span>Complaints by Hostel Block</span>
            </h2>
            <span className="text-xs text-[#5F6368]">Kaveri · Godavari · Krishna · Tungabhadra</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(blockCounts).map(([block, count]) => {
              const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
              return (
                <div key={block} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#202124]">{block}</span>
                    <span className="font-mono-tabular text-[#5F6368]">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#FFF1EC] overflow-hidden">
                    <div 
                      className="h-full bg-[#D98F9B] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#E9D9D5] text-[11px] text-[#5F6368]">
            <span>Average turnaround SLA adherence: </span>
            <strong className="text-[#2E8B68] font-bold">98.4%</strong> across all wings.
          </div>
        </div>

      </div>

      {/* Recent Audit Log Feed Preview from Section 17 */}
      <div className="bg-white rounded-3xl border border-[#E9D9D5] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E9D9D5] pb-3">
          <div>
            <h2 className="text-sm font-bold text-[#202124] uppercase tracking-wider">
              Recent Administrative Audit Trail
            </h2>
            <p className="text-xs text-[#5F6368]">Security log of technician dispatches and status changes</p>
          </div>

          <button
            onClick={() => onNavigateTab('admin-audit')}
            className="text-xs font-semibold text-[#A94F61] hover:underline cursor-pointer"
          >
            View Full Logs
          </button>
        </div>

        <div className="space-y-2">
          {auditLogs.slice(0, 3).map((log) => (
            <div key={log.id} className="p-3 rounded-xl bg-[#FFF8F5] border border-[#E9D9D5] flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-[#202124] font-mono-tabular">{log.complaintId}</span>
                <span className="text-[#5F6368] mx-2">·</span>
                <span className="text-[#5F6368]">{log.details}</span>
              </div>
              <span className="text-[11px] font-mono-tabular text-[#5F6368] whitespace-nowrap">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
