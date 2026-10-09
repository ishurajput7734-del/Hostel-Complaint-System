import React from 'react';
import { Shield, Clock, Phone, Mail, MapPin, AlertTriangle, UserCheck, Wrench, Settings } from 'lucide-react';
import { StaffMember, EmergencyContact, MaintenanceSLA } from '../types';

interface HostelDirectoryProps {
  staffMembers: StaffMember[];
  emergencyContacts: EmergencyContact[];
  slas: MaintenanceSLA[];
  isWarden: boolean;
  onManageContacts?: (tab: 'staff' | 'wardens' | 'emergency' | 'slas') => void;
}

export const HostelDirectory: React.FC<HostelDirectoryProps> = ({
  staffMembers,
  emergencyContacts,
  slas,
  isWarden,
  onManageContacts,
}) => {
  // Only display contacts that are Active and marked visible to students
  const visibleWardens = staffMembers.filter(
    (s) => s.isWardenSupervisor && s.status === 'Active' && s.visibleToStudents
  );

  const visibleMaintenanceStaff = staffMembers.filter(
    (s) => !s.isWardenSupervisor && s.status === 'Active' && s.visibleToStudents
  );

  const visibleEmergencyContacts = emergencyContacts.filter(
    (e) => e.status === 'Active' && e.visibleToStudents
  );

  const activeSlas = slas.filter((s) => s.status === 'Active');

  return (
    <section id="directory" className="py-14 bg-white border-b border-[#F7D6DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#F7D6DC] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#9F1239] mb-2 px-3 py-1 bg-[#FFE4E8] rounded-full">
              <span>Official Institutional Directory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F1A1D] tracking-tight font-display">
              Hostel Wardens & Maintenance Contacts
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#4A3E44]">
              Verified contact information and official maintenance turnarounds managed by hostel administration.
            </p>
          </div>

          {isWarden && onManageContacts && (
            <button
              onClick={() => onManageContacts('staff')}
              className="px-4 py-2 bg-[#9F1239] text-white text-xs font-semibold rounded-xl hover:bg-[#881337] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Manage Contacts</span>
            </button>
          )}
        </div>

        {/* 2-Column: Warden Directory and Maintenance SLA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Hostel Wardens & Supervisors */}
          <div className="lg:col-span-6 bg-[#FFF9FA] rounded-2xl border border-[#F4CED6] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F5D5DD] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1F1A1D] font-display">
                  Hostel Wardens & Supervisors
                </h3>
                <p className="text-xs text-[#75646C]">Official administration for room allocations and welfare</p>
              </div>
              <Shield className="w-5 h-5 text-[#9F1239]" />
            </div>

            {visibleWardens.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-xl bg-white border border-[#F4CED6]">
                <UserCheck className="w-8 h-8 text-[#9F1239] mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-[#1F1A1D]">
                  No active hostel contacts have been added.
                </p>
                <p className="text-[11px] text-[#75646C] mt-1">
                  Contact details will appear here once configured by the authorized Warden.
                </p>
                {isWarden && onManageContacts && (
                  <button
                    onClick={() => onManageContacts('wardens')}
                    className="mt-3 px-3 py-1.5 bg-[#FFF0F2] text-[#9F1239] border border-[#F4CBD3] text-xs font-semibold rounded-lg hover:bg-[#FFE0E6] cursor-pointer"
                  >
                    + Add Warden / Supervisor
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {visibleWardens.map((warden) => (
                  <div key={warden.id} className="bg-white p-4 rounded-xl border border-[#F3CDD5] text-xs space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-[#1F1A1D] text-sm">{warden.name}</p>
                        <p className="text-[11px] font-medium text-[#9F1239]">{warden.designation}</p>
                      </div>
                      {warden.phone && (
                        <a
                          href={`tel:${warden.phone}`}
                          className="px-2.5 py-1 bg-[#FFF0F2] text-[#9F1239] font-mono-tabular rounded-lg font-semibold hover:bg-[#FFE2E7] transition-colors"
                        >
                          {warden.phone}
                        </a>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#75646C] pt-1">
                      {warden.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{warden.email}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{warden.hostelBlock}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{warden.availability}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Dynamic Maintenance SLAs */}
          <div id="slas" className="lg:col-span-6 bg-[#FFF9FA] rounded-2xl border border-[#F4CED6] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F5D5DD] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1F1A1D] font-display">
                  Maintenance SLA Turnarounds
                </h3>
                <p className="text-xs text-[#75646C]">Guaranteed resolution time limits set by administration</p>
              </div>
              <Clock className="w-5 h-5 text-[#9F1239]" />
            </div>

            {activeSlas.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-xl bg-white border border-[#F4CED6]">
                <Clock className="w-8 h-8 text-[#9F1239] mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-[#1F1A1D]">
                  No SLA rules currently active.
                </p>
                {isWarden && onManageContacts && (
                  <button
                    onClick={() => onManageContacts('slas')}
                    className="mt-3 px-3 py-1.5 bg-[#FFF0F2] text-[#9F1239] border border-[#F4CBD3] text-xs font-semibold rounded-lg hover:bg-[#FFE0E6] cursor-pointer"
                  >
                    Configure SLA Times
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {activeSlas.map((sla) => (
                  <div key={sla.id} className="bg-white p-3.5 rounded-xl border border-[#F3CDD5] flex items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-semibold text-[#1F1A1D]">{sla.category} Maintenance</p>
                      <p className="text-[11px] text-[#75646C] mt-0.5">Assigned: {sla.assignedTeam}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono-tabular font-bold text-sm text-[#9F1239]">
                        {sla.resolutionTime}
                      </span>
                      <p className="text-[10px] text-[#75646C] uppercase font-semibold">Priority: {sla.priority}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Hostel Maintenance Worker Contacts Section (Section 10) */}
        <div className="bg-[#FFF9FA] rounded-2xl border border-[#F4CED6] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#F5D5DD] pb-3">
            <div>
              <h3 className="text-base font-bold text-[#1F1A1D] font-display">
                Hostel Maintenance Contacts
              </h3>
              <p className="text-xs text-[#75646C]">Campus electricians, plumbers, carpenters & network technicians</p>
            </div>
            <Wrench className="w-5 h-5 text-[#9F1239]" />
          </div>

          {visibleMaintenanceStaff.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-xl bg-white border border-[#F4CED6]">
              <p className="text-xs font-semibold text-[#1F1A1D]">
                No staff members have been added yet.
              </p>
              <p className="text-[11px] text-[#75646C] mt-0.5">
                Authorized administrators can add staff members from the Warden Desk.
              </p>
              {isWarden && onManageContacts && (
                <button
                  onClick={() => onManageContacts('staff')}
                  className="mt-3 px-3 py-1.5 bg-[#9F1239] text-white text-xs font-semibold rounded-lg hover:bg-[#881337] cursor-pointer"
                >
                  + Add Staff Member
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {visibleMaintenanceStaff.map((staff) => (
                <div key={staff.id} className="bg-white p-3.5 rounded-xl border border-[#F3CDD5] text-xs space-y-1.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-[#1F1A1D]">{staff.name}</p>
                      <p className="text-[11px] text-[#9F1239] font-medium">{staff.designation}</p>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FFF0F2] text-[#9F1239] font-medium">
                      {staff.specialization}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#75646C]">Area: {staff.hostelBlock}</p>

                  {staff.phone && (
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[10px] text-[#75646C]">Hours: {staff.availability}</span>
                      <a
                        href={`tel:${staff.phone}`}
                        className="font-mono-tabular font-semibold text-[#9F1239] hover:underline"
                      >
                        {staff.phone}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Emergency Contacts Section (Section 12) */}
        <div id="emergency" className="p-6 rounded-2xl bg-gradient-to-r from-[#9F1239] to-[#7E0E2B] text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-rose-200 text-xs font-semibold uppercase tracking-wider mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>Urgent & Safety Escalations</span>
              </div>
              <h3 className="text-xl font-bold font-display text-white">
                Hostel 24/7 Security & Rapid Response Desk
              </h3>
              <p className="text-xs text-rose-100 max-w-xl mt-1 leading-relaxed">
                For electrical fire hazards, medical emergencies, or urgent security assistance.
              </p>
            </div>

            {visibleEmergencyContacts.length === 0 ? (
              <div className="bg-rose-950/40 border border-white/20 p-4 rounded-xl text-center">
                <p className="text-xs text-rose-200">No emergency contacts have been configured.</p>
                {isWarden && onManageContacts && (
                  <button
                    onClick={() => onManageContacts('emergency')}
                    className="mt-2 px-3 py-1 bg-white text-[#9F1239] rounded-lg text-xs font-bold hover:bg-rose-50 cursor-pointer"
                  >
                    Configure Emergency Contacts
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                {visibleEmergencyContacts.map((contact) => (
                  <div key={contact.id} className="bg-white/10 backdrop-blur-xs border border-white/20 px-3.5 py-2 rounded-xl text-xs">
                    <p className="font-semibold text-rose-100 text-[11px]">{contact.name} ({contact.role})</p>
                    <a
                      href={`tel:${contact.phone}`}
                      className="font-mono-tabular font-bold text-white text-sm hover:underline block mt-0.5"
                    >
                      {contact.phone}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
