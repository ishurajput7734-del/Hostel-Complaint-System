import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, CheckCircle2, Clock, AlertTriangle, 
  User, MapPin, Eye, Star, MessageSquare, ChevronRight, X, Phone, Check 
} from 'lucide-react';
import { Complaint, Status, Student, Category } from '../types';

interface ComplaintTrackerProps {
  complaints: Complaint[];
  currentUser: Student | null;
  onRateComplaint: (id: string, rating: number, feedback: string) => void;
  selectedTicketId?: string | null;
  onClearSelectedTicket?: () => void;
}

export const ComplaintTracker: React.FC<ComplaintTrackerProps> = ({
  complaints,
  currentUser,
  onRateComplaint,
  selectedTicketId,
  onClearSelectedTicket,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [showOnlyMine, setShowOnlyMine] = useState<boolean>(false);
  const [activeComplaintModal, setActiveComplaintModal] = useState<Complaint | null>(null);

  // Rating state inside modal
  const [tempRating, setTempRating] = useState<number>(5);
  const [tempFeedback, setTempFeedback] = useState<string>('');
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);

  // If selectedTicketId passed from hero/form search
  React.useEffect(() => {
    if (selectedTicketId) {
      const match = complaints.find(
        (c) => c.ticketNumber.toLowerCase() === selectedTicketId.toLowerCase() ||
               c.usn.toLowerCase() === selectedTicketId.toLowerCase()
      );
      if (match) {
        setActiveComplaintModal(match);
      } else {
        setSearchQuery(selectedTicketId);
      }
    }
  }, [selectedTicketId, complaints]);

  // Filter complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      // USN filter if "Only Mine"
      if (showOnlyMine && currentUser && item.usn.toLowerCase() !== currentUser.usn.toLowerCase()) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'All' && item.status !== statusFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'All' && item.category !== categoryFilter) {
        return false;
      }

      // Search query (ticket number, USN, room, title, student name)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQuery = 
          item.ticketNumber.toLowerCase().includes(query) ||
          item.usn.toLowerCase().includes(query) ||
          item.roomNumber.toLowerCase().includes(query) ||
          item.title.toLowerCase().includes(query) ||
          item.hostelBlock.toLowerCase().includes(query) ||
          item.studentName.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [complaints, showOnlyMine, currentUser, statusFilter, categoryFilter, searchQuery]);

  const handleOpenModal = (complaint: Complaint) => {
    setActiveComplaintModal(complaint);
    setTempRating(complaint.rating || 5);
    setTempFeedback(complaint.feedback || '');
    setRatingSubmitted(false);
  };

  const handleCloseModal = () => {
    setActiveComplaintModal(null);
    if (onClearSelectedTicket) onClearSelectedTicket();
  };

  const handleSaveRating = (complaintId: string) => {
    onRateComplaint(complaintId, tempRating, tempFeedback);
    setRatingSubmitted(true);
    // Update local modal view
    if (activeComplaintModal) {
      setActiveComplaintModal({
        ...activeComplaintModal,
        rating: tempRating,
        feedback: tempFeedback,
      });
    }
  };

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Resolved</span>
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            <span>In Progress</span>
          </span>
        );
      case 'Technician Assigned':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-800">
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>Staff Assigned</span>
          </span>
        );
      case 'Pending Review':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#9F1239]">
            <Clock className="w-3.5 h-3.5 text-[#9F1239]" />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  return (
    <section id="track" className="py-12 bg-white border-b border-[#F7D6DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#9F1239] mb-1">
              <span>Real-Time Grievance Pipeline</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F1A1D] tracking-tight font-display">
              Track Complaint Status
            </h2>
            <p className="text-xs sm:text-sm text-[#4A3E44] mt-1">
              Filter by USN, Room, or Ticket ID to check technician assignment and resolution time.
            </p>
          </div>

          {/* Quick toggle: My complaints vs all hostel complaints */}
          {currentUser && (
            <div className="flex items-center gap-2 p-1 bg-[#FFF5F6] border border-[#F3CDD5] rounded-xl self-start md:self-auto">
              <button
                onClick={() => setShowOnlyMine(false)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  !showOnlyMine ? 'bg-[#9F1239] text-white shadow-xs' : 'text-[#75646C] hover:text-[#1F1A1D]'
                }`}
              >
                All Hostel Tickets ({complaints.length})
              </button>
              <button
                onClick={() => setShowOnlyMine(true)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  showOnlyMine ? 'bg-[#9F1239] text-white shadow-xs' : 'text-[#75646C] hover:text-[#1F1A1D]'
                }`}
              >
                <span>My Room Tickets</span>
                <span className="font-mono-tabular">
                  ({complaints.filter((c) => c.usn.toLowerCase() === currentUser.usn.toLowerCase()).length})
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#FFF9FA] border border-[#F4CED6] rounded-2xl p-4 mb-6 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-[#8C7681] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by USN (2BA21CS...), Room (304), or Ticket (#HC...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-[#F2CBD2] rounded-xl text-xs sm:text-sm text-[#1F1A1D] placeholder:text-[#9C8892] focus:outline-none focus:ring-2 focus:ring-[#9F1239]/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C7681] hover:text-[#1F1A1D]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Status Segmented Tabs */}
            <div className="md:col-span-4 flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
              {['All', 'Pending Review', 'In Progress', 'Resolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-white text-[#9F1239] border border-[#F0CCD4] shadow-xs'
                      : 'text-[#64525B] hover:text-[#1F1A1D]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#F2CBD2] rounded-xl text-xs text-[#1F1A1D] focus:outline-none focus:ring-2 focus:ring-[#9F1239]/20"
              >
                <option value="All">All Categories</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Wi-Fi & LAN">Wi-Fi & LAN</option>
                <option value="Cleanliness">Cleanliness</option>
                <option value="Drinking Water">Drinking Water</option>
              </select>
            </div>

          </div>

        </div>

        {/* Complaints Grid / List */}
        {filteredComplaints.length === 0 ? (
          <div className="text-center py-16 px-4 bg-[#FFF9FA] border border-[#F4CED6] rounded-2xl">
            <Clock className="w-8 h-8 text-[#9F1239] mx-auto mb-3 opacity-60" />
            <h4 className="text-base font-semibold text-[#1F1A1D]">No grievances found</h4>
            <p className="text-xs text-[#75646C] mt-1 max-w-sm mx-auto">
              {searchQuery 
                ? `No complaint matches "${searchQuery}". Check the USN or ticket code.`
                : 'No grievances in this filter category.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setStatusFilter('All'); setCategoryFilter('All'); }}
                className="mt-4 px-4 py-1.5 text-xs font-semibold text-[#9F1239] bg-[#FFE4E8] rounded-lg hover:bg-[#FDD5DC] transition-colors"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredComplaints.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenModal(item)}
                className="bg-white rounded-2xl border border-[#F2CBD2] p-5 shadow-xs hover:shadow-md hover:border-[#9F1239]/40 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  
                  {/* Top line unboxed metadata */}
                  <div className="flex items-center justify-between text-xs text-[#75646C] mb-2">
                    <span className="font-mono-tabular font-bold text-[#9F1239]">
                      {item.ticketNumber}
                    </span>
                    <span className="text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-[#1F1A1D] group-hover:text-[#9F1239] transition-colors line-clamp-1">
                    {item.title}
                  </h3>

                  {/* Clean unboxed student & room metadata with typographic separators */}
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-[#5E4D55] flex-wrap">
                    <span className="font-semibold text-[#1F1A1D]">Room {item.roomNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.hostelBlock.replace('Block ', '')}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular">{item.usn}</span>
                  </div>

                  {/* Issue description preview */}
                  <p className="mt-2.5 text-xs text-[#5E4D55] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Photo Thumbnail if exists */}
                  {item.photoUrl && (
                    <div className="mt-3 w-full h-24 rounded-lg overflow-hidden border border-[#F4CCD5] bg-[#FFF5F6]">
                      <img
                        src={item.photoUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                    </div>
                  )}

                </div>

                {/* Card Footer: Status and Action */}
                <div className="mt-4 pt-3 border-t border-[#F7D8DF] flex items-center justify-between">
                  <div>
                    {getStatusBadge(item.status)}
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-[#9F1239] group-hover:translate-x-0.5 transition-transform">
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Complaint Detail & Rating Modal */}
      {activeComplaintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#F4CCD5] max-w-2xl w-full shadow-2xl p-6 sm:p-7 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#F7D8DF] pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#75646C]">
                  <span className="font-mono-tabular font-bold text-[#9F1239] text-sm">
                    {activeComplaintModal.ticketNumber}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeComplaintModal.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#9F1239] font-medium">{activeComplaintModal.priority} Priority</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1F1A1D] mt-1 font-display">
                  {activeComplaintModal.title}
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1 rounded-lg text-[#8C7681] hover:text-[#1F1A1D] hover:bg-[#FFF0F2] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-5 space-y-6 max-h-[70vh] overflow-y-auto pr-1">
              
              {/* Room & Student Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-[#FFF8F9] border border-[#F4CED6] text-xs">
                <div>
                  <p className="text-[#75646C]">Student USN</p>
                  <p className="font-bold text-[#1F1A1D] font-mono-tabular mt-0.5">{activeComplaintModal.usn}</p>
                </div>
                <div>
                  <p className="text-[#75646C]">Room & Block</p>
                  <p className="font-semibold text-[#1F1A1D] mt-0.5">{activeComplaintModal.roomNumber}, {activeComplaintModal.hostelBlock.split(' - ')[1] || activeComplaintModal.hostelBlock}</p>
                </div>
                <div>
                  <p className="text-[#75646C]">Registered By</p>
                  <p className="font-semibold text-[#1F1A1D] mt-0.5 truncate">{activeComplaintModal.studentName}</p>
                </div>
                <div>
                  <p className="text-[#75646C]">Current Status</p>
                  <div className="mt-0.5">{getStatusBadge(activeComplaintModal.status)}</div>
                </div>
              </div>

              {/* Full Description & Preferred Slot */}
              <div>
                <h4 className="text-xs font-semibold text-[#75646C] uppercase tracking-wider mb-1">
                  Issue Description
                </h4>
                <p className="text-sm text-[#2D2126] bg-[#FFF9FA] p-3 rounded-xl border border-[#F5D4DC] leading-relaxed">
                  {activeComplaintModal.description}
                </p>
                {activeComplaintModal.preferredSlot && (
                  <p className="text-xs text-[#75646C] mt-2">
                    Preferred Visit Slot: <strong className="text-[#1F1A1D]">{activeComplaintModal.preferredSlot}</strong>
                  </p>
                )}
              </div>

              {/* Photo Evidence */}
              {activeComplaintModal.photoUrl && (
                <div>
                  <h4 className="text-xs font-semibold text-[#75646C] uppercase tracking-wider mb-2">
                    Photo Evidence Submitted by Student
                  </h4>
                  <div className="rounded-xl overflow-hidden border border-[#F2CCD3] bg-[#FFF5F6] max-h-64 flex items-center justify-center">
                    <img
                      src={activeComplaintModal.photoUrl}
                      alt={activeComplaintModal.title}
                      referrerPolicy="no-referrer"
                      className="max-h-64 w-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Assigned Technician Card if assigned */}
              {(activeComplaintModal.assignedStaffName || activeComplaintModal.assignedStaffRole) && (
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider">
                        Assigned Maintenance Personnel
                      </span>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">
                        {activeComplaintModal.assignedStaffName || activeComplaintModal.assignedStaffRole}
                      </p>
                      {activeComplaintModal.assignedStaffRole && activeComplaintModal.assignedStaffName && (
                        <p className="text-xs text-slate-600">
                          {activeComplaintModal.assignedStaffRole}
                        </p>
                      )}
                    </div>
                    {activeComplaintModal.assignedStaffPhone && (
                      <a
                        href={`tel:${activeComplaintModal.assignedStaffPhone}`}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-blue-700 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{activeComplaintModal.assignedStaffPhone}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Resolution Notes if resolved */}
              {activeComplaintModal.resolutionNotes && (
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs">
                  <span className="font-semibold text-emerald-800 uppercase tracking-wider text-[11px]">
                    Technician Resolution Report
                  </span>
                  <p className="text-slate-800 mt-1 leading-relaxed">
                    {activeComplaintModal.resolutionNotes}
                  </p>
                </div>
              )}

              {/* Status Timeline */}
              <div>
                <h4 className="text-xs font-semibold text-[#75646C] uppercase tracking-wider mb-3">
                  Resolution Progress Timeline
                </h4>
                <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#F4CED6]">
                  {activeComplaintModal.timeline.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 relative pl-1">
                      <div className="w-5 h-5 rounded-full bg-[#9F1239] text-white flex items-center justify-center shrink-0 z-10 text-[10px]">
                        ✓
                      </div>
                      <div className="flex-1 bg-[#FFF9FA] border border-[#F5D5DD] p-2.5 rounded-lg text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#1F1A1D]">{step.status}</span>
                          <span className="text-[10px] text-[#75646C]">
                            {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[#4A3E44] mt-0.5">{step.note}</p>
                        <p className="text-[10px] text-[#8C7681] mt-1 italic">Action by: {step.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Rating & Feedback Section (Visible if resolved) */}
              {activeComplaintModal.status === 'Resolved' && (
                <div className="p-4 rounded-xl bg-[#FFF5F6] border border-[#F4CCD5]">
                  <h4 className="text-xs font-bold text-[#1F1A1D] mb-2 flex items-center justify-between">
                    <span>Student Resolution Rating</span>
                    {activeComplaintModal.rating && (
                      <span className="text-emerald-700 font-medium">Rating Recorded</span>
                    )}
                  </h4>

                  {ratingSubmitted || activeComplaintModal.rating ? (
                    <div className="text-xs text-[#4A3E44]">
                      <div className="flex items-center gap-1 text-amber-500 mb-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${
                              s <= (activeComplaintModal.rating || tempRating) ? 'fill-current' : 'opacity-30'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="italic text-[#75646C]">
                        "{activeComplaintModal.feedback || tempFeedback || 'Work completed satisfactorily.'}"
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#75646C]">Rate service:</span>
                        <div className="flex items-center gap-1 text-amber-500">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setTempRating(s)}
                              className="p-1 hover:scale-110 transition-transform cursor-pointer"
                            >
                              <Star
                                className={`w-5 h-5 ${s <= tempRating ? 'fill-current' : 'opacity-30'}`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <input
                        type="text"
                        placeholder="Add quick feedback (e.g. Technician arrived on time and repaired cleanly)..."
                        value={tempFeedback}
                        onChange={(e) => setTempFeedback(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#F2CBD2] rounded-lg text-xs text-[#1F1A1D]"
                      />

                      <button
                        onClick={() => handleSaveRating(activeComplaintModal.id)}
                        className="px-4 py-1.5 bg-[#9F1239] text-white text-xs font-semibold rounded-lg hover:bg-[#881337] transition-colors cursor-pointer"
                      >
                        Submit Feedback
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-[#F7D8DF] flex items-center justify-end">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2 rounded-xl bg-[#FFF0F2] text-[#9F1239] font-semibold text-xs hover:bg-[#FFE2E7] transition-colors cursor-pointer"
              >
                Close Ticket View
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
