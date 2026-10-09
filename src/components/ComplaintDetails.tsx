import React from 'react';
import { 
  ArrowLeft, CheckCircle2, Clock, MapPin, 
  Calendar, Shield, AlertTriangle, FileText, Check 
} from 'lucide-react';
import { Complaint, ComplaintStatus } from '../types';

interface ComplaintDetailsProps {
  complaint: Complaint;
  onBack: () => void;
}

export const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({
  complaint,
  onBack,
}) => {
  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#2E8B68] border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Resolved</span>
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-[#C58A32] border border-amber-200">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>In Progress</span>
          </span>
        );
      case 'Assigned':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#5577A8] border border-blue-200">
            <span>Staff Assigned</span>
          </span>
        );
      case 'Reviewed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span>Reviewed</span>
          </span>
        );
      case 'Rejected/Closed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200">
            <span>Closed</span>
          </span>
        );
      case 'Submitted':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F8DDE1] text-[#A94F61] border border-[#D98F9B]">
            <span>Submitted</span>
          </span>
        );
    }
  };

  return (
    <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top back navigation button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5F6368] hover:text-[#A94F61] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Complaints</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-[#E9D9D5] p-6 sm:p-8 shadow-xs">
        
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9D9D5] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#5F6368]">
              <span className="font-mono-tabular font-bold text-sm text-[#A94F61]">
                {complaint.complaintId}
              </span>
              <span aria-hidden="true">·</span>
              <span>{complaint.category}</span>
              <span aria-hidden="true">·</span>
              <span className={`font-semibold ${complaint.priority === 'Urgent' ? 'text-red-600' : 'text-[#5F6368]'}`}>
                {complaint.priority} Priority
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#202124] font-display mt-1">
              {complaint.title}
            </h1>
          </div>

          <div className="self-start sm:self-auto">
            {getStatusBadge(complaint.status)}
          </div>
        </div>

        {/* 2-Column Layout from Sections 12 & 13 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          
          {/* Left Column: Complaint Information */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Room & Registration summary */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#FFF8F5] border border-[#E9D9D5] text-xs">
              <div>
                <p className="text-[#5F6368]">Room & Block</p>
                <p className="font-bold text-[#202124] text-sm mt-0.5">
                  Room {complaint.roomNumber}, {complaint.hostelBlock}
                </p>
              </div>

              <div>
                <p className="text-[#5F6368]">Student USN</p>
                <p className="font-bold font-mono-tabular text-[#202124] text-sm mt-0.5">
                  {complaint.usn}
                </p>
              </div>

              <div>
                <p className="text-[#5F6368]">Registered On</p>
                <p className="font-medium text-[#202124] mt-0.5">
                  {new Date(complaint.createdAt).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div>
                <p className="text-[#5F6368]">Assigned Dispatch</p>
                <p className="font-medium text-[#202124] mt-0.5">
                  {complaint.assignedUnit || 'Pending Queue Triage'}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xs font-bold text-[#5F6368] uppercase tracking-wider mb-2">
                Detailed Issue Description
              </h2>
              <p className="text-sm text-[#202124] bg-[#FFF8F5] p-4 rounded-2xl border border-[#E9D9D5] leading-relaxed">
                {complaint.description}
              </p>
            </div>

            {/* Resolution Information from Section 13 (if resolved) */}
            {complaint.status === 'Resolved' && (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#2E8B68] uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Resolution</span>
                </div>
                <p className="text-xs sm:text-sm text-[#202124] leading-relaxed">
                  {complaint.resolutionNote || 'Technicians completed all required component repairs and verified correct operation.'}
                </p>
                <p className="text-[11px] text-[#5F6368] pt-1">
                  Resolved and closed by Authorized Hostel Administrator.
                </p>
              </div>
            )}

            {/* Privacy notice badge */}
            <div className="p-3 rounded-xl bg-[#FFF1EC] border border-[#E9D9D5] text-[11px] text-[#5F6368] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#A94F61] shrink-0" />
              <span>Data Protection: Only authorized hostel personnel have access to this ticket.</span>
            </div>

          </div>

          {/* Right Column: Uploaded Issue Photo & Status Timeline */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Uploaded Issue Photo */}
            <div>
              <h2 className="text-xs font-bold text-[#5F6368] uppercase tracking-wider mb-2">
                Uploaded Issue Photo
              </h2>
              {complaint.imageUrl ? (
                <div className="rounded-2xl overflow-hidden border border-[#E9D9D5] bg-[#FFF8F5] max-h-64 flex items-center justify-center">
                  <img
                    src={complaint.imageUrl}
                    alt={complaint.title}
                    referrerPolicy="no-referrer"
                    className="max-h-64 w-full object-contain"
                  />
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-[#FFF8F5] border border-[#E9D9D5] text-center text-xs text-[#5F6368]">
                  <span>No photo was attached during initial filing.</span>
                </div>
              )}
            </div>

            {/* Status Timeline from Section 12 */}
            <div>
              <h2 className="text-xs font-bold text-[#5F6368] uppercase tracking-wider mb-3">
                Resolution Timeline
              </h2>

              <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E9D9D5]">
                {complaint.timeline.map((step) => (
                  <div key={step.id} className="flex items-start gap-3 relative pl-1">
                    <div className="w-5 h-5 rounded-full bg-[#A94F61] text-white flex items-center justify-center shrink-0 z-10 text-[10px]">
                      <Check className="w-3 h-3" />
                    </div>
                    <div className="flex-1 bg-[#FFF8F5] border border-[#E9D9D5] p-3 rounded-xl text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#202124]">{step.status}</span>
                        <span className="text-[10px] text-[#5F6368] font-mono-tabular">
                          {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[#5F6368] mt-1">{step.note}</p>
                      <p className="text-[10px] text-[#A94F61] font-semibold mt-1">
                        Recorded by: {step.updatedBy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
