import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, CheckCircle2, Clock, Eye, 
  Send, Wrench, Shield, ChevronLeft, ChevronRight, X, AlertTriangle 
} from 'lucide-react';
import { Complaint, ComplaintStatus, ComplaintCategory, HostelBlock } from '../types';
import { COMPLAINT_CATEGORIES, HOSTEL_BLOCKS } from '../data/mockData';

interface AdminComplaintManagementProps {
  complaints: Complaint[];
  onUpdateComplaint: (
    complaintId: string, 
    newStatus: ComplaintStatus, 
    note: string, 
    assignedUnit?: string
  ) => void;
}

export const AdminComplaintManagement: React.FC<AdminComplaintManagementProps> = ({
  complaints,
  onUpdateComplaint,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [blockFilter, setBlockFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected complaint for resolution inspection modal
  const [activeModalComplaint, setActiveModalComplaint] = useState<Complaint | null>(null);
  const [modalStatus, setModalStatus] = useState<ComplaintStatus>('In Progress');
  const [modalAssignedUnit, setModalAssignedUnit] = useState<string>('Maintenance Unit - Electrical');
  const [modalResolutionNote, setModalResolutionNote] = useState<string>('');

  // Filtering
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      if (statusFilter !== 'All' && c.status !== statusFilter) return false;
      if (categoryFilter !== 'All' && c.category !== categoryFilter) return false;
      if (blockFilter !== 'All' && c.hostelBlock !== blockFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          c.complaintId.toLowerCase().includes(q) ||
          c.usn.toLowerCase().includes(q) ||
          c.roomNumber.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [complaints, statusFilter, categoryFilter, blockFilter, searchQuery]);

  // Pagination for 10,000+ users scalability
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage) || 1;
  const paginatedComplaints = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredComplaints.slice(start, start + itemsPerPage);
  }, [filteredComplaints, currentPage, itemsPerPage]);

  const handleOpenModal = (c: Complaint) => {
    setActiveModalComplaint(c);
    setModalStatus(c.status);
    setModalAssignedUnit(c.assignedUnit || 'Maintenance Unit - Electrical');
    setModalResolutionNote(c.resolutionNote || '');
  };

  const handleCloseModal = () => {
    setActiveModalComplaint(null);
  };

  const handleSaveModalUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalComplaint) return;

    onUpdateComplaint(
      activeModalComplaint.id,
      modalStatus,
      modalResolutionNote || `Status updated to ${modalStatus} by Authorized Hostel Administrator.`,
      modalAssignedUnit
    );

    setActiveModalComplaint(null);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-[#202124] font-display">
          Hostel Grievance Management Queue
        </h1>
        <p className="text-xs sm:text-sm text-[#5F6368] mt-1">
          Review, assign maintenance units, inspect evidence photos, and sign off resolutions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-[#E9D9D5] p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-[#5F6368] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by Complaint ID, USN, Room..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-[#FFF8F5] border border-[#E9D9D5] rounded-xl text-xs sm:text-sm text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#A94F61]"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-[#FFF8F5] border border-[#E9D9D5] rounded-xl text-xs text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#A94F61]"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted (New)</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected/Closed">Rejected/Closed</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-2">
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-[#FFF8F5] border border-[#E9D9D5] rounded-xl text-xs text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#A94F61]"
            >
              <option value="All">All Categories</option>
              {COMPLAINT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Block Filter */}
          <div className="md:col-span-2">
            <select
              value={blockFilter}
              onChange={(e) => { setBlockFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-[#FFF8F5] border border-[#E9D9D5] rounded-xl text-xs text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#A94F61]"
            >
              <option value="All">All Blocks</option>
              {HOSTEL_BLOCKS.map((b) => (
                <option key={b} value={b}>{b.replace('Block ', '')}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-[#E9D9D5] shadow-xs overflow-hidden">
        {filteredComplaints.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Clock className="w-8 h-8 text-[#A94F61] mx-auto mb-2 opacity-60" />
            <h4 className="text-sm font-bold text-[#202124]">No matching complaints found</h4>
            <p className="text-xs text-[#5F6368] mt-1">Try resetting the search or status filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E9D9D5] bg-[#FFF8F5] text-[11px] font-bold text-[#5F6368] uppercase tracking-wider">
                    <th className="py-3 px-4">Complaint ID</th>
                    <th className="py-3 px-4">Room & Block</th>
                    <th className="py-3 px-4">Student USN</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Assigned Unit</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9D9D5] text-xs">
                  {paginatedComplaints.map((item) => (
                    <tr 
                      key={item.id} 
                      className="hover:bg-[#FFF8F5] transition-colors cursor-pointer"
                      onClick={() => handleOpenModal(item)}
                    >
                      <td className="py-3.5 px-4 font-mono-tabular font-bold text-[#A94F61]">
                        {item.complaintId}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#202124]">
                        Room {item.roomNumber}, {item.hostelBlock.replace('Block ', '')}
                      </td>
                      <td className="py-3.5 px-4 font-mono-tabular text-[#5F6368]">
                        {item.usn}
                      </td>
                      <td className="py-3.5 px-4 text-[#202124]">
                        {item.category}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[11px] font-bold ${
                          item.priority === 'Urgent' ? 'text-red-600' : 'text-[#5F6368]'
                        }`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#202124]">{item.status}</span>
                      </td>
                      <td className="py-3.5 px-4 text-[#5F6368]">
                        {item.assignedUnit || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(item);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#A94F61] text-white font-semibold text-xs hover:bg-[#8C2E42] transition-colors cursor-pointer"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls for 10,000+ records */}
            <div className="p-4 border-t border-[#E9D9D5] flex items-center justify-between text-xs text-[#5F6368]">
              <div>
                Showing <strong className="text-[#202124]">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
                <strong className="text-[#202124]">
                  {Math.min(currentPage * itemsPerPage, filteredComplaints.length)}
                </strong>{' '}
                of <strong className="text-[#202124]">{filteredComplaints.length}</strong> complaints
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-[#E9D9D5] disabled:opacity-40 hover:bg-[#FFF8F5] cursor-pointer"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono-tabular font-semibold">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-lg border border-[#E9D9D5] disabled:opacity-40 hover:bg-[#FFF8F5] cursor-pointer"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Admin Complaint Inspection & Resolution Modal */}
      {activeModalComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E9D9D5] max-w-2xl w-full shadow-2xl p-6 sm:p-8 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#E9D9D5] pb-4">
              <div>
                <span className="font-mono-tabular font-bold text-sm text-[#A94F61]">
                  {activeModalComplaint.complaintId}
                </span>
                <h3 className="text-lg font-bold text-[#202124] mt-0.5">
                  {activeModalComplaint.title}
                </h3>
                <p className="text-xs text-[#5F6368] mt-0.5">
                  Room {activeModalComplaint.roomNumber}, {activeModalComplaint.hostelBlock} · USN: {activeModalComplaint.usn}
                </p>
              </div>

              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-xl text-[#5F6368] hover:text-[#202124] hover:bg-[#FFF1EC] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveModalUpdate} className="space-y-5 mt-5">
              
              {/* Description */}
              <div className="p-3.5 rounded-2xl bg-[#FFF8F5] border border-[#E9D9D5] text-xs">
                <p className="font-semibold text-[#202124] mb-1">Student's Description:</p>
                <p className="text-[#5F6368] leading-relaxed">{activeModalComplaint.description}</p>
              </div>

              {/* Photo Preview if submitted */}
              {activeModalComplaint.imageUrl && (
                <div>
                  <label className="block text-xs font-bold text-[#5F6368] uppercase tracking-wider mb-1.5">
                    Attached Evidence Photo:
                  </label>
                  <div className="h-44 rounded-2xl overflow-hidden border border-[#E9D9D5] bg-[#FFF8F5] flex items-center justify-center">
                    <img
                      src={activeModalComplaint.imageUrl}
                      alt="Complaint proof"
                      referrerPolicy="no-referrer"
                      className="h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Status & Unit Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#202124] mb-1.5">Update Status</label>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value as ComplaintStatus)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E9D9D5] bg-[#FFF8F5] font-semibold text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#A94F61]"
                  >
                    <option value="Submitted">Submitted (New)</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress (Work Underway)</option>
                    <option value="Resolved">Resolved (Completed)</option>
                    <option value="Rejected/Closed">Rejected/Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#202124] mb-1.5">Assign Maintenance Trade</label>
                  <select
                    value={modalAssignedUnit}
                    onChange={(e) => setModalAssignedUnit(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E9D9D5] bg-[#FFF8F5] font-semibold text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#A94F61]"
                  >
                    <option value="Maintenance Unit - Electrical">Maintenance Unit - Electrical</option>
                    <option value="Maintenance Unit - Plumbing">Maintenance Unit - Plumbing</option>
                    <option value="Maintenance Unit - Carpentry">Maintenance Unit - Carpentry</option>
                    <option value="Campus IT & Network Cell">Campus IT & Network Cell</option>
                    <option value="Maintenance Unit - Sanitation">Maintenance Unit - Sanitation</option>
                    <option value="Maintenance Unit - Water Purification">Maintenance Unit - Water Purification</option>
                  </select>
                </div>
              </div>

              {/* Resolution / Action Notes */}
              <div className="text-xs">
                <label className="block font-semibold text-[#202124] mb-1.5">
                  Official Administrator / Maintenance Resolution Notes
                </label>
                <textarea
                  rows={3}
                  value={modalResolutionNote}
                  onChange={(e) => setModalResolutionNote(e.target.value)}
                  placeholder="e.g. Washbasin tap spindle replaced, seal tested, no leakage observed."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9D9D5] bg-[#FFF8F5] focus:outline-none focus:ring-2 focus:ring-[#A94F61] resize-none"
                />
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-3 border-t border-[#E9D9D5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 text-xs text-[#5F6368] hover:text-[#202124] font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#A94F61] text-white text-xs font-semibold rounded-xl hover:bg-[#8C2E42] transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Update & Append Audit Log</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
