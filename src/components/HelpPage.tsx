import React, { useState } from 'react';
import { 
  ChevronDown, ChevronUp, HelpCircle, Shield, 
  Clock, CheckCircle2, AlertCircle, Phone, ArrowRight 
} from 'lucide-react';
import { BecLogo } from './BecLogo';

export const HelpPage: React.FC<{ onRaiseComplaint: () => void }> = ({ onRaiseComplaint }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: '1. How do I log in to the portal?',
      a: 'Students can sign in directly using the "Continue with Google" button or via the "USN & Password" tab using your registered University Seat Number (e.g., 2BA22CS045) and room allocation. Administrative personnel must use their designated credentials via the Admin tab.'
    },
    {
      q: '2. How do I raise a new room complaint?',
      a: 'Once authenticated, navigate to "Raise Complaint" from the header or click the primary CTA button. Your USN and Room Number will auto-fill from your session. Select the category (Electrical, Plumbing, Wi-Fi, Furniture, etc.), provide a short title and description, and attach a photo of the problem before clicking Submit.'
    },
    {
      q: '3. How do I upload an issue photo and what formats are supported?',
      a: 'In the Raise Complaint form, you can click "Choose from Files" to upload an image or tap "Use Camera" on supported mobile phones to take a live photo of the damaged fixture. Accepted formats are JPG, JPEG, PNG, and WebP up to 5MB. You can preview, reselect, or remove the photo prior to submission.'
    },
    {
      q: '4. How do I track an existing complaint?',
      a: 'Go to "My Complaints" or your Student Dashboard. Every grievance contains a unique reference ID (e.g., BEC-2026-9142). Click "Details" to open the live interactive timeline showing all milestone steps from initial submission to technician dispatch and final sign-off.'
    },
    {
      q: '5. How do complaint statuses work?',
      a: 'Complaints progress sequentially through 5 official stages: 1) Submitted: Received by the hostel portal; 2) Reviewed: Verified by hostel supervisors; 3) Assigned: Dispatched to the specialized maintenance trade (Electrical, Plumbing, etc.); 4) In Progress: Technicians actively working on site; 5) Resolved: Work verified complete with official administrator notes.'
    },
    {
      q: '6. What should I do if an emergency issue is unresolved?',
      a: 'For urgent safety threats (electrical fire hazard, pipe burst, or water grid failure), mark the priority as "Urgent" during filing. You may also contact the 24/7 Hostel Emergency Desk located at the Campus Substation Control Room (Bagalkot Campus) directly.'
    },
    {
      q: '7. How do I log out of my session?',
      a: 'Click your profile badge in the top right of the navigation header and click the logout icon (or select "Logout" from the mobile menu). This safely clears your active student session.'
    }
  ];

  return (
    <div className="py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Title */}
      <div className="bg-white rounded-3xl border border-[#E9D9D5] p-6 sm:p-8 shadow-xs text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8DDE1] text-[#A94F61] text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Student Support & SLA Guidelines</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202124] font-display">
          Hostel Help Desk & Guidelines
        </h1>
        <p className="text-xs sm:text-sm text-[#5F6368] max-w-xl mx-auto">
          Learn how to submit, document, and track room grievances across all campus residential blocks.
        </p>
      </div>

      {/* Accordion List */}
      <div className="bg-white rounded-3xl border border-[#E9D9D5] p-6 sm:p-8 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-[#202124] uppercase tracking-wider border-b border-[#E9D9D5] pb-3 mb-4">
          Frequently Asked Questions & User Guide
        </h2>

        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index}
              className="border border-[#E9D9D5] rounded-2xl overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 bg-[#FFF8F5] hover:bg-[#FFF1EC] transition-colors cursor-pointer"
              >
                <span className="font-bold text-xs sm:text-sm text-[#202124]">
                  {faq.q}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#A94F61] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#5F6368] shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="p-4 bg-white text-xs sm:text-sm text-[#5F6368] leading-relaxed border-t border-[#E9D9D5]">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* SLA Matrix Container */}
      <div className="bg-white rounded-3xl border border-[#E9D9D5] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E9D9D5] pb-3">
          <div>
            <h2 className="text-sm font-bold text-[#202124] uppercase tracking-wider">
              Maintenance Service Level Agreements (SLA)
            </h2>
            <p className="text-xs text-[#5F6368]">Committed turnaround standards for hostel student rooms</p>
          </div>
          <Clock className="w-5 h-5 text-[#A94F61]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#FFF8F5] border border-[#E9D9D5] flex justify-between items-center">
            <div>
              <p className="font-bold text-[#202124]">Electrical Sparks & Fire Hazards</p>
              <p className="text-[11px] text-[#5F6368]">Campus Substation Dispatch</p>
            </div>
            <span className="font-mono-tabular font-bold text-red-600">1 Hour</span>
          </div>

          <div className="p-3 rounded-xl bg-[#FFF8F5] border border-[#E9D9D5] flex justify-between items-center">
            <div>
              <p className="font-bold text-[#202124]">Water Pipe Bursts & Drainage</p>
              <p className="text-[11px] text-[#5F6368]">Hostel Plumbing Crew</p>
            </div>
            <span className="font-mono-tabular font-bold text-red-600">2 Hours</span>
          </div>

          <div className="p-3 rounded-xl bg-[#FFF8F5] border border-[#E9D9D5] flex justify-between items-center">
            <div>
              <p className="font-bold text-[#202124]">Ceiling Fan & Room Lighting</p>
              <p className="text-[11px] text-[#5F6368]">Campus Electricians</p>
            </div>
            <span className="font-mono-tabular font-bold text-[#A94F61]">4 Hours</span>
          </div>

          <div className="p-3 rounded-xl bg-[#FFF8F5] border border-[#E9D9D5] flex justify-between items-center">
            <div>
              <p className="font-bold text-[#202124]">Hostel Wi-Fi & LAN Network</p>
              <p className="text-[11px] text-[#5F6368]">Campus IT Network Cell</p>
            </div>
            <span className="font-mono-tabular font-bold text-[#5577A8]">6 Hours</span>
          </div>
        </div>
      </div>

    </div>
  );
};
