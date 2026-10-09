import React from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2, Clock, Wrench, Sparkles, AlertCircle } from 'lucide-react';
import { BecLogo } from './BecLogo';

interface HeroProps {
  onRaiseComplaint: () => void;
  onTrackComplaint: () => void;
  onLearnMore: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onRaiseComplaint,
  onTrackComplaint,
  onLearnMore,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:py-20 bg-gradient-to-b from-[#FFF8F5] via-[#FFF1EC] to-[#FFF8F5] border-b border-[#E9D9D5]">
      {/* Subtle warm pink ambient glows */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-[#F8DDE1]/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#FFF1EC] rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Institutional Affiliation Header Line */}
        <div className="flex items-center gap-2 text-xs text-[#5F6368] mb-4">
          <span className="font-bold text-[#A94F61]">Basaveshwar Engineering College, Bagalkot</span>
          <span aria-hidden="true">·</span>
          <span>Central Student Hostel Grievance Portal</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#2E8B68] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E8B68]"></span>
            Active 24/7 Dispatch
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Core Hero & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Required Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8DDE1] text-[#A94F61] border border-[#D98F9B]/50 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>BEC HOSTEL SERVICES</span>
            </div>

            {/* Required Large Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#202124] tracking-tight font-display leading-[1.1]">
              Report. Track. Resolve.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#5F6368] leading-relaxed max-w-2xl">
              A secure digital platform for reporting, tracking and resolving hostel-related issues.
              Students can report room maintenance, electrical, plumbing, and network issues quickly with their 
              <strong className="text-[#202124] font-semibold"> USN</strong>, 
              <strong className="text-[#202124] font-semibold"> Room Number</strong>, and a photo. 
              Track resolution progress in real time with complete data privacy.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onRaiseComplaint}
                className="px-6 py-3.5 rounded-xl bg-[#A94F61] text-white font-semibold text-sm hover:bg-[#8C2E42] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer group"
              >
                <span>Raise a Complaint</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onTrackComplaint}
                className="px-6 py-3.5 rounded-xl bg-white border border-[#E9D9D5] text-[#202124] font-semibold text-sm hover:bg-[#FFF1EC] hover:border-[#D98F9B] transition-all shadow-xs cursor-pointer hover:-translate-y-0.5"
              >
                Track My Complaint
              </button>
            </div>

            {/* Trust and privacy indicators */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#5F6368] border-t border-[#E9D9D5]/60">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E8B68]" />
                <span>Private & Role-Protected Records</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#A94F61]" />
                <span>Verified Maintenance Turnaround</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-[#5577A8]" />
                <span>Photo Evidence Verification</span>
              </div>
            </div>

          </div>

          {/* Right Column: Premium Visual Dashboard Representation (Generic & Anonymized) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-[#E9D9D5] p-6 shadow-sm relative overflow-hidden">
              
              {/* Card Header with BEC Insignia */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E9D9D5]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#A94F61] text-white flex items-center justify-center font-bold text-xs">
                    BEC
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wide">
                      Hostel Maintenance Console
                    </h3>
                    <p className="text-[11px] text-[#5F6368]">
                      Basaveshwar Engineering College, Bagalkot
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F8DDE1] text-[#A94F61]">
                  Live Queue
                </span>
              </div>

              {/* Generic Anonymized Service Categories */}
              <div className="my-4">
                <p className="text-[11px] font-bold text-[#5F6368] uppercase tracking-wider mb-2">
                  Active Service Desks
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#FFF8F5] border border-[#E9D9D5]">
                    <span className="font-semibold text-[#202124] block">Room Maintenance</span>
                    <span className="text-[10px] text-[#5F6368]">Doors, Locks & Fixtures</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FFF8F5] border border-[#E9D9D5]">
                    <span className="font-semibold text-[#202124] block">Electrical Issue</span>
                    <span className="text-[10px] text-[#5F6368]">Fans, Regulators & Sockets</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FFF8F5] border border-[#E9D9D5]">
                    <span className="font-semibold text-[#202124] block">Plumbing & Water</span>
                    <span className="text-[10px] text-[#5F6368]">Taps, Valves & Drainage</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FFF8F5] border border-[#E9D9D5]">
                    <span className="font-semibold text-[#202124] block">Campus Internet</span>
                    <span className="text-[10px] text-[#5F6368]">Corridor Wi-Fi & LAN</span>
                  </div>
                </div>
              </div>

              {/* Anonymized Sample Ticket Status Stepper Preview */}
              <div className="p-3.5 rounded-2xl bg-[#FFF1EC] border border-[#E9D9D5] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono-tabular font-bold text-[#A94F61]">
                    Sample Ticket #BEC-2026-XXXX
                  </span>
                  <span className="text-[11px] font-semibold text-[#2E8B68] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    In Progress
                  </span>
                </div>

                <p className="text-xs text-[#202124] font-medium truncate">
                  Generic Room Fixture Maintenance Request
                </p>

                {/* Stepper visual */}
                <div className="pt-2 flex items-center justify-between text-[10px] font-semibold text-[#5F6368]">
                  <div className="flex flex-col items-center">
                    <span className="w-3 h-3 rounded-full bg-[#A94F61] mb-1"></span>
                    <span>Submitted</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-[#A94F61] mx-1"></div>
                  <div className="flex flex-col items-center">
                    <span className="w-3 h-3 rounded-full bg-[#A94F61] mb-1"></span>
                    <span>Reviewed</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-[#A94F61] mx-1"></div>
                  <div className="flex flex-col items-center">
                    <span className="w-3 h-3 rounded-full bg-[#A94F61] mb-1"></span>
                    <span>Assigned</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-[#D98F9B] mx-1"></div>
                  <div className="flex flex-col items-center">
                    <span className="w-3 h-3 rounded-full bg-[#E9D9D5] mb-1"></span>
                    <span className="text-[#5F6368]/70">Resolved</span>
                  </div>
                </div>
              </div>

              {/* Hostel Block Badges */}
              <div className="mt-4 pt-3 border-t border-[#E9D9D5] flex items-center justify-between text-[11px] text-[#5F6368]">
                <span>Hostel Blocks Covered:</span>
                <span className="font-semibold text-[#202124]">Kaveri · Godavari · Krishna · Tungabhadra</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
