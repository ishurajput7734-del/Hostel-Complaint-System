import React from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle2, UserCheck, Key } from 'lucide-react';
import { BecLogo } from './BecLogo';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Title */}
      <div className="bg-white rounded-3xl border border-[#E9D9D5] p-6 sm:p-8 shadow-xs text-center space-y-3">
        <div className="flex justify-center mb-2">
          <BecLogo size="sm" showText={false} />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8DDE1] text-[#A94F61] text-xs font-bold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>Application Data Protection Notice</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202124] font-display">
          Hostel Privacy & Information Policy
        </h1>
        <p className="text-xs sm:text-sm text-[#5F6368] max-w-xl mx-auto">
          Basaveshwar Engineering College (Autonomous), Bagalkot · Central Hostel Maintenance Platform
        </p>
      </div>

      {/* Structured Sections */}
      <div className="bg-white rounded-3xl border border-[#E9D9D5] p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm text-[#5F6368] leading-relaxed">
        
        <div>
          <h2 className="text-sm font-bold text-[#202124] uppercase tracking-wider border-b border-[#E9D9D5] pb-2 mb-2 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#A94F61]" />
            <span>1. Information We Collect</span>
          </h2>
          <p>
            When utilizing the BEC Hostel Complaint Management System, the application collects only minimal data necessary to identify the student and dispatch maintenance services:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong className="text-[#202124]">University Seat Number (USN):</strong> Required by college governance to associate room grievances with valid enrolled students.</li>
            <li><strong className="text-[#202124]">Hostel Block & Room Number:</strong> Crucial to route maintenance electricians, plumbers, and technicians to the correct physical location.</li>
            <li><strong className="text-[#202124]">Issue Description & Photographs:</strong> Visual evidence uploaded to assess the required replacement parts, tools, and urgency level before arriving at the student's room.</li>
            <li><strong className="text-[#202124]">Session Timestamps & Audit Logs:</strong> Maintained for service accountability and SLA compliance.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-[#202124] uppercase tracking-wider border-b border-[#E9D9D5] pb-2 mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#A94F61]" />
            <span>2. How Information is Protected</span>
          </h2>
          <p>
            The platform is built with institutional privacy by design:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong className="text-[#202124]">Role-Based Access Control (RBAC):</strong> Normal students can strictly query and view only complaints submitted from their own verified USN session. Under no circumstances can a student view another room's complaint history.</li>
            <li><strong className="text-[#202124]">Restricted Administrator Route Guards:</strong> Administrative triage and audit consoles are shielded behind elevated credential validation and cannot be accessed simply by altering URL paths.</li>
            <li><strong className="text-[#202124]">Private Image Handling:</strong> Uploaded fixture photographs are restricted to authorized maintenance supervisors and are never indexed into public search engines.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-[#202124] uppercase tracking-wider border-b border-[#E9D9D5] pb-2 mb-2 flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#A94F61]" />
            <span>3. Who Has Access</span>
          </h2>
          <p>
            Access to complaint records is strictly restricted to:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>The enrolled student who lodged the grievance.</li>
            <li>Authorized Hostel Administrators (Chief Warden, Resident Hostel Supervisors).</li>
            <li>Designated maintenance staff (Campus electricians, plumbers, carpenters, and network technicians) for work order completion.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-[#202124] uppercase tracking-wider border-b border-[#E9D9D5] pb-2 mb-2 flex items-center gap-2">
            <Key className="w-4 h-4 text-[#A94F61]" />
            <span>4. Student Rights & Data Retention</span>
          </h2>
          <p>
            Maintenance grievance records are retained for the duration of the academic term to compile maintenance reports and asset replacement records. Students have the right to request review of any closed ticket by contacting the Central Hostel Office at Vidyagiri Campus, Bagalkot.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#FFF8F5] border border-[#E9D9D5] text-[11px] text-[#5F6368]">
          <p className="font-semibold text-[#202124]">Institutional Notice:</p>
          <p className="mt-0.5">
            This notice outlines the digital operational standards of the BEC Hostel Complaint Management System for Basaveshwar Engineering College Bagalkot.
          </p>
        </div>

      </div>

    </div>
  );
};
