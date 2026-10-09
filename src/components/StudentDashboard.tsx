import React, { useState, useMemo } from 'react';
import { 
  Plus, Clock, CheckCircle2, AlertTriangle, Eye, 
  Search, Filter, ChevronRight, FileText, Calendar, Building2, MapPin 
} from 'lucide-react';
import { Complaint, UserSession, ComplaintStatus } from '../types';

interface StudentDashboardProps {
  currentUser: UserSession;
  complaints: Complaint[];
  onRaiseComplaint: () => void;
  onViewComplaintDetails: (complaint: Complaint) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  complaints,
  onRaiseComplaint,
  onViewComplaintDetails,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter ONLY this student's complaints
  const studentComplaints = useMemo(() => {
    return complaints.filter((c) => c.userId === currentUser.id || c.usn === currentUser.usn);
  }, [complaints, currentUser]);

  // Metric counts
  const totalCount = studentComplaints.length;
  const pendingCount = studentComplaints.filter((c) => c.status === 'Submitted' || c.status === 'Reviewed').length;
  const inProgressCount = studentComplaints.filter((c) => c.status === 'Assigned' || c.status === 'In Progress').length;
  const resolvedCount = studentComplaints.filter((c) => c.status === 'Resolved').length;

  // Filtered list
  const filteredList = useMemo(() => {
    return studentComplaints.filter((c) => {
      if (statusFilter !== 'All' && c.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          c.complaintId.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.roomNumber.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [studentComplaints, statusFilter, searchQuery]);

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-[#2E8B68] border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Resolved</span>
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-[#C58A32] border border-amber-200">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>In Progress</span>
          </span>
        );
      case 'Assigned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-[#5577A8] border border-blue-200">
            <span>Assigned</span>
          </span>
        );
      case 'Reviewed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span>Reviewed</span>
          </span>
        );
      case 'Rejected/Closed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200">
            <span>Closed</span>
          </span>
        );
      case 'Submitted':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#F8DDE1] text-[#A94F61] border border-[#D98F9B]">
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Required Header from Section 9 */}
      <div className="bg-white rounded-3xl border border-[#E9D9D5] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#A94F61] uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Basaveshwar Engineering College · Hostel Resident</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202124] font-display">
            Welcome to your Hostel Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6368] mt-1">
            Registered Room: <strong className="text-[#202124] font-semibold">{currentUser.roomNumber} ({currentUser.hostelBlock})</strong> · 
            USN: <strong className="text-[#202124] font-mono-tabular font-semibold">{currentUser.usn}</strong>
          </p>
        </div>

        <button
          onClick={onRaiseComplaint}
          className="px-5 py-3 rounded-2xl bg-[#A94F61] text-white font-semibold text-xs sm:text-sm hover:bg-[#8C2E42] transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer self-start md:self-auto hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Raise New Complaint</span>
        </button>
      </div>

      {/* Required 4 Metric Cards from Section 9 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Complaints */}
        <div className="bg-white rounded-2xl border border-[#E9D9D5] p-5 shadow-xs">
          <p className="text-xs font-bold text-[#5F6368] uppercase tracking-wider">
            Total Complaints
          </p>
          <p className="text-3xl font-extrabold font-mono-tabular text-[#202124] mt-2">
            {totalCount}
          </p>
          <p className="text-[11px] text-[#5F6368] mt-1">
            Registered for Room {currentUser.roomNumber}
          </p>
        </div>

        {/* Card 2: Pending */}
        <div className="bg-white rounded-2xl border border-[#E9D9D5] p-5 shadow-xs">
          <p className="text-xs font-bold text-[#A94F61] uppercase tracking-wider">
            Pending
          </p>
          <p className="text-3xl font-extrabold font-mono-tabular text-[#A94F61] mt-2">
            {pendingCount}
          </p>
          <p className="text-[11px] text-[#5F6368] mt-1">
            Awaiting inspection review
          </p>
        </div>

        {/* Card 3: In Progress */}
        <div className="bg-white rounded-2xl border border-[#E9D9D5] p-5 shadow-xs">
          <p className="text-xs font-bold text-[#C58A32] uppercase tracking-wider">
            In Progress
          </p>
          <p className="text-3xl font-extrabold font-mono-tabular text-[#C58A32] mt-2">
            {inProgressCount}
          </p>
          <p className="text-[11px] text-[#5F6368] mt-1">
            Maintenance team assigned
          </p>
        </div>

        {/* Card 4: Resolved */}
        <div className="bg-white rounded-2xl border border-[#E9D9D5] p-5 shadow-xs">
          <p className="text-xs font-bold text-[#2E8B68] uppercase tracking-wider">
            Resolved
          </p>
          <p className="text-3xl font-extrabold font-mono-tabular text-[#2E8B68] mt-2">
            {resolvedCount}
          </p>
          <p className="text-[11px] text-[#5F6368] mt-1">
            Completed & verified
          </p>
        </div>

      </div>

      {/* Recent Complaints Section from Section 9 */}
      <div className="bg-white rounded-3xl border border-[#E9D9D5] p-6 shadow-xs space-y-6">
        
        {/* Section title & filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9D9D5] pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#202124] font-display">
              Recent Complaints
            </h2>
            <p className="text-xs text-[#5F6368] mt-0.5">
              Track the live timeline and technician progress for your submitted issues.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Segmented Filter */}
            <div className="flex items-center gap-1 p-1 bg-[#FFF1EC] rounded-xl border border-[#E9D9D5] text-xs">
              {['All', 'Submitted', 'In Progress', 'Resolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-white text-[#A94F61] shadow-xs font-semibold'
                      : 'text-[#5F6368] hover:text-[#202124]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search input inside list */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-[#5F6368] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Complaint ID (e.g. BEC-2026-...) or category"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FFF8F5] border border-[#E9D9D5] rounded-xl text-xs sm:text-sm text-[#202124] placeholder:text-[#5F6368]/60 focus:outline-none focus:ring-2 focus:ring-[#A94F61]"
          />
        </div>

        {/* Complaints Table / Card List */}
        {filteredList.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-[#FFF8F5] border border-[#E9D9D5]">
            <Clock className="w-8 h-8 text-[#A94F61] mx-auto mb-2 opacity-60" />
            <h4 className="text-sm font-bold text-[#202124]">No complaints found</h4>
            <p className="text-xs text-[#5F6368] mt-1 max-w-sm mx-auto">
              {totalCount === 0 
                ? 'You have not submitted any hostel complaints yet. Use the button below to report an issue.'
                : 'No complaints match your active filter criteria.'}
            </p>
            {totalCount === 0 && (
              <button
                onClick={onRaiseComplaint}
                className="mt-4 px-4 py-2 bg-[#A94F61] text-white text-xs font-semibold rounded-xl hover:bg-[#8C2E42] transition-colors"
              >
                Raise Your First Complaint
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E9D9D5] text-[11px] font-bold text-[#5F6368] uppercase tracking-wider">
                  <th className="py-3 px-3">Complaint ID</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Title / Description</th>
                  <th className="py-3 px-3">Room</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9D9D5] text-xs">
                {filteredList.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-[#FFF8F5] transition-colors cursor-pointer"
                    onClick={() => onViewComplaintDetails(item)}
                  >
                    <td className="py-3 px-3 font-mono-tabular font-bold text-[#A94F61]">
                      {item.complaintId}
                    </td>
                    <td className="py-3 px-3 font-medium text-[#202124]">
                      {item.category}
                    </td>
                    <td className="py-3 px-3 max-w-xs">
                      <p className="font-semibold text-[#202124] truncate">{item.title}</p>
                      <p className="text-[11px] text-[#5F6368] truncate">{item.description}</p>
                    </td>
                    <td className="py-3 px-3 font-medium text-[#202124]">
                      Room {item.roomNumber}
                    </td>
                    <td className="py-3 px-3 text-[#5F6368] whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3 px-3">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewComplaintDetails(item);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#FFF1EC] text-[#A94F61] font-semibold text-xs hover:bg-[#F8DDE1] transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
