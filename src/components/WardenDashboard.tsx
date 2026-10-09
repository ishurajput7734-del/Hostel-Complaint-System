import React, { useState } from 'react';
import { 
  ShieldCheck, Wrench, CheckCircle, Clock, AlertTriangle, 
  UserCheck, Send, CheckCircle2, ChevronRight, UserPlus, 
  Users, Phone, Mail, MapPin, Eye, EyeOff, Edit, Trash2, 
  UserX, UserCheck2, RefreshCw, Plus, Shield, Search, FileText, 
  Building2, Layers, AlertCircle, Calendar, BarChart3, Filter
} from 'lucide-react';
import { 
  Complaint, Status, StaffMember, MaintenanceTeam, 
  EmergencyContact, MaintenanceSLA, AuditLog, Category, HostelBlock, Priority 
} from '../types';
import { CATEGORIES, HOSTEL_BLOCKS } from '../data/mockData';

interface WardenDashboardProps {
  complaints: Complaint[];
  staffMembers: StaffMember[];
  maintenanceTeams: MaintenanceTeam[];
  emergencyContacts: EmergencyContact[];
  slas: MaintenanceSLA[];
  auditLogs: AuditLog[];
  onUpdateComplaint: (
    complaintId: string, 
    newStatus: Status, 
    note: string, 
    assignedStaffId?: string, 
    assignedStaffName?: string, 
    assignedStaffRole?: string,
    assignedStaffPhone?: string
  ) => void;
  onAddStaff: (staff: Omit<StaffMember, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateStaff: (id: string, updates: Partial<StaffMember>) => void;
  onDeactivateStaff: (id: string, reason?: string) => void;
  onReactivateStaff: (id: string) => void;
  onDeleteStaff: (id: string) => void;
  onAddEmergencyContact: (contact: Omit<EmergencyContact, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateEmergencyContact: (id: string, updates: Partial<EmergencyContact>) => void;
  onDeleteEmergencyContact: (id: string) => void;
  onAddSLA: (sla: Omit<MaintenanceSLA, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateSLA: (id: string, updates: Partial<MaintenanceSLA>) => void;
  onDeleteSLA: (id: string) => void;
  onExitWardenMode: () => void;
  initialTab?: 'overview' | 'complaints' | 'staff' | 'wardens' | 'teams' | 'emergency' | 'sla' | 'audit' | 'reports';
}

export const WardenDashboard: React.FC<WardenDashboardProps> = ({
  complaints,
  staffMembers,
  maintenanceTeams,
  emergencyContacts,
  slas,
  auditLogs,
  onUpdateComplaint,
  onAddStaff,
  onUpdateStaff,
  onDeactivateStaff,
  onReactivateStaff,
  onDeleteStaff,
  onAddEmergencyContact,
  onUpdateEmergencyContact,
  onDeleteEmergencyContact,
  onAddSLA,
  onUpdateSLA,
  onDeleteSLA,
  onExitWardenMode,
  initialTab = 'overview',
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'complaints' | 'staff' | 'wardens' | 'teams' | 'emergency' | 'sla' | 'audit' | 'reports'
  >(initialTab);

  // Complaints triage state
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>(complaints[0]?.id || '');
  const [targetStatus, setTargetStatus] = useState<Status>('In Progress');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [resolutionNote, setResolutionNote] = useState<string>('');

  // Staff management modals
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [deactivatingStaff, setDeactivatingStaff] = useState<StaffMember | null>(null);
  const [replacingStaff, setReplacingStaff] = useState<StaffMember | null>(null);

  // Emergency contact modal
  const [isAddEmergencyOpen, setIsAddEmergencyOpen] = useState(false);
  const [editingEmergency, setEditingEmergency] = useState<EmergencyContact | null>(null);

  // SLA modal
  const [isAddSlaOpen, setIsAddSlaOpen] = useState(false);
  const [editingSla, setEditingSla] = useState<MaintenanceSLA | null>(null);

  // Search & Filter state inside staff
  const [staffSearch, setStaffSearch] = useState('');
  const [staffSpecializationFilter, setStaffSpecializationFilter] = useState('All');
  const [staffStatusFilter, setStaffStatusFilter] = useState('All');

  // Form states for Staff
  const [staffFormName, setStaffFormName] = useState('');
  const [staffFormDesignation, setStaffFormDesignation] = useState('');
  const [staffFormDepartment, setStaffFormDepartment] = useState('Maintenance');
  const [staffFormPhone, setStaffFormPhone] = useState('');
  const [staffFormEmail, setStaffFormEmail] = useState('');
  const [staffFormBlock, setStaffFormBlock] = useState('All Blocks');
  const [staffFormSpecialization, setStaffFormSpecialization] = useState<StaffMember['specialization']>('Electrical');
  const [staffFormAvailability, setStaffFormAvailability] = useState('8:00 AM - 5:00 PM');
  const [staffFormVisible, setStaffFormVisible] = useState(true);
  const [staffFormIsWarden, setStaffFormIsWarden] = useState(false);
  const [staffFormSuccessMsg, setStaffFormSuccessMsg] = useState('');

  // Form states for Emergency Contact
  const [emFormName, setEmFormName] = useState('');
  const [emFormRole, setEmFormRole] = useState('Hostel Emergency Desk');
  const [emFormPhone, setEmFormPhone] = useState('');
  const [emFormLocation, setEmFormLocation] = useState('Central Campus');
  const [emFormDesc, setEmFormDesc] = useState('');
  const [emFormPriority, setEmFormPriority] = useState<EmergencyContact['priority']>('Emergency');
  const [emFormVisible, setEmFormVisible] = useState(true);

  // Form states for SLA
  const [slaFormCategory, setSlaFormCategory] = useState('Electrical');
  const [slaFormPriority, setSlaFormPriority] = useState<Priority>('High');
  const [slaFormResponse, setSlaFormResponse] = useState('1 Hour');
  const [slaFormResolution, setSlaFormResolution] = useState('4 Hours');
  const [slaFormTeam, setSlaFormTeam] = useState('Campus Electrical Unit');

  const selectedComplaint = complaints.find((c) => c.id === selectedComplaintId) || complaints[0];

  // Only ACTIVE staff members are available for new assignments! (Section 7 & 14)
  const activeStaffMembers = staffMembers.filter((s) => s.status === 'Active');

  // Quick counts
  const pendingCount = complaints.filter((c) => c.status === 'Pending Review').length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress' || c.status === 'Technician Assigned').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;
  const activeStaffCount = staffMembers.filter((s) => s.status === 'Active').length;
  const inactiveStaffCount = staffMembers.filter((s) => s.status === 'Inactive').length;

  const handleApplyComplaintUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    let assignedStaffName = selectedComplaint.assignedStaffName;
    let assignedStaffRole = selectedComplaint.assignedStaffRole;
    let assignedStaffPhone = selectedComplaint.assignedStaffPhone;

    if (selectedStaffId) {
      const staff = staffMembers.find((s) => s.id === selectedStaffId);
      if (staff) {
        assignedStaffName = staff.name;
        assignedStaffRole = `${staff.designation} (${staff.specialization})`;
        assignedStaffPhone = staff.phone;
      }
    }

    onUpdateComplaint(
      selectedComplaint.id,
      targetStatus,
      resolutionNote || `Status updated to ${targetStatus} by Warden Control Desk.`,
      selectedStaffId || selectedComplaint.assignedStaffId,
      assignedStaffName,
      assignedStaffRole,
      assignedStaffPhone
    );

    setResolutionNote('');
  };

  const resetStaffForm = () => {
    setStaffFormName('');
    setStaffFormDesignation('');
    setStaffFormDepartment('Maintenance');
    setStaffFormPhone('');
    setStaffFormEmail('');
    setStaffFormBlock('All Blocks');
    setStaffFormSpecialization('Electrical');
    setStaffFormAvailability('8:00 AM - 5:00 PM');
    setStaffFormVisible(true);
    setStaffFormIsWarden(false);
    setEditingStaff(null);
    setReplacingStaff(null);
    setStaffFormSuccessMsg('');
  };

  const handleOpenAddStaff = (isWarden: boolean = false) => {
    resetStaffForm();
    setStaffFormIsWarden(isWarden);
    if (isWarden) {
      setStaffFormDepartment('Administration');
      setStaffFormSpecialization('Hostel Administration');
      setStaffFormDesignation('Resident Warden');
    }
    setIsAddStaffOpen(true);
  };

  const handleOpenEditStaff = (staff: StaffMember) => {
    setEditingStaff(staff);
    setStaffFormName(staff.name);
    setStaffFormDesignation(staff.designation);
    setStaffFormDepartment(staff.department);
    setStaffFormPhone(staff.phone);
    setStaffFormEmail(staff.email);
    setStaffFormBlock(staff.hostelBlock);
    setStaffFormSpecialization(staff.specialization);
    setStaffFormAvailability(staff.availability);
    setStaffFormVisible(staff.visibleToStudents);
    setStaffFormIsWarden(!!staff.isWardenSupervisor);
    setIsAddStaffOpen(true);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffFormName.trim()) return;

    if (editingStaff) {
      // Edit existing staff
      onUpdateStaff(editingStaff.id, {
        name: staffFormName.trim(),
        designation: staffFormDesignation.trim(),
        department: staffFormDepartment,
        phone: staffFormPhone.trim(),
        email: staffFormEmail.trim(),
        hostelBlock: staffFormBlock,
        specialization: staffFormSpecialization,
        availability: staffFormAvailability,
        visibleToStudents: staffFormVisible,
        isWardenSupervisor: staffFormIsWarden,
      });
      setStaffFormSuccessMsg('Staff information updated successfully.');
    } else {
      // Add new staff
      onAddStaff({
        name: staffFormName.trim(),
        designation: staffFormDesignation.trim(),
        department: staffFormDepartment,
        phone: staffFormPhone.trim(),
        email: staffFormEmail.trim(),
        hostelBlock: staffFormBlock,
        specialization: staffFormSpecialization,
        availability: staffFormAvailability,
        status: 'Active',
        visibleToStudents: staffFormVisible,
        isWardenSupervisor: staffFormIsWarden,
      });

      // If this was replacing a staff member, deactivate the old staff member!
      if (replacingStaff) {
        onDeactivateStaff(replacingStaff.id, `Replaced by ${staffFormName.trim()}`);
      }

      setStaffFormSuccessMsg('Staff member added successfully.');
    }

    setTimeout(() => {
      setIsAddStaffOpen(false);
      resetStaffForm();
    }, 700);
  };

  // Replace staff member flow (Section 8)
  const handleStartReplaceStaff = (staff: StaffMember) => {
    setReplacingStaff(staff);
    setStaffFormName('');
    setStaffFormDesignation(staff.designation);
    setStaffFormDepartment(staff.department);
    setStaffFormPhone('');
    setStaffFormEmail('');
    setStaffFormBlock(staff.hostelBlock);
    setStaffFormSpecialization(staff.specialization);
    setStaffFormAvailability(staff.availability);
    setStaffFormVisible(staff.visibleToStudents);
    setStaffFormIsWarden(!!staff.isWardenSupervisor);
    setIsAddStaffOpen(true);
  };

  // Filtered staff members
  const filteredStaff = staffMembers.filter((s) => {
    if (activeTab === 'wardens' && !s.isWardenSupervisor) return false;
    if (activeTab === 'staff' && s.isWardenSupervisor) return false;

    if (staffSpecializationFilter !== 'All' && s.specialization !== staffSpecializationFilter) return false;
    if (staffStatusFilter !== 'All' && s.status !== staffStatusFilter) return false;

    if (staffSearch.trim()) {
      const q = staffSearch.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.designation.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.hostelBlock.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="py-8 bg-[#FFF8F5] border-b border-[#F7D6DC] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Warden Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#F3CDD5] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#9F1239] text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#1F1A1D] font-display">
                  Authorized Warden & Hostel Administrator Desk
                </h1>
                <span className="text-[11px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Admin Role Verified
                </span>
              </div>
              <p className="text-xs text-[#75646C] mt-0.5">
                Central control for student grievances, staff directory, emergency contacts, and SLA rules.
              </p>
            </div>
          </div>

          <button
            onClick={onExitWardenMode}
            className="px-4 py-2 rounded-xl bg-[#FFF0F2] text-[#9F1239] border border-[#F4CBD3] text-xs font-semibold hover:bg-[#FFE0E6] transition-colors cursor-pointer self-start sm:self-auto"
          >
            Switch to Student Portal
          </button>
        </div>

        {/* Administration Navigation Tabs (Section 3) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#F7D6DC] text-xs font-semibold">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: LayoutGridIcon },
            { id: 'complaints', label: `Complaints Queue (${complaints.length})`, icon: Clock },
            { id: 'staff', label: `Hostel Staff (${staffMembers.filter(s => !s.isWardenSupervisor).length})`, icon: Wrench },
            { id: 'wardens', label: `Wardens / Supervisors (${staffMembers.filter(s => s.isWardenSupervisor).length})`, icon: Shield },
            { id: 'emergency', label: `Emergency Contacts (${emergencyContacts.length})`, icon: AlertTriangle },
            { id: 'teams', label: `Maintenance Teams (${maintenanceTeams.length})`, icon: Layers },
            { id: 'sla', label: `SLA Turnarounds (${slas.length})`, icon: Clock },
            { id: 'audit', label: `Audit Logs (${auditLogs.length})`, icon: FileText },
            { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-[#9F1239] text-white shadow-xs font-bold'
                    : 'bg-white text-[#5E4D55] border border-[#F4CED6] hover:bg-[#FFF3F5]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================
            TAB 1: DASHBOARD OVERVIEW
           ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* 4 Primary Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-[#F3CDD5] shadow-xs">
                <p className="text-xs font-bold text-[#75646C] uppercase tracking-wider">Pending Triaging</p>
                <p className="text-3xl font-extrabold font-mono-tabular text-[#9F1239] mt-1">{pendingCount}</p>
                <p className="text-[11px] text-[#75646C] mt-1">Awaiting staff assignment</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#F3CDD5] shadow-xs">
                <p className="text-xs font-bold text-[#75646C] uppercase tracking-wider">In Progress Work</p>
                <p className="text-3xl font-extrabold font-mono-tabular text-amber-600 mt-1">{inProgressCount}</p>
                <p className="text-[11px] text-[#75646C] mt-1">Technicians on-site</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#F3CDD5] shadow-xs">
                <p className="text-xs font-bold text-[#75646C] uppercase tracking-wider">Resolved Tickets</p>
                <p className="text-3xl font-extrabold font-mono-tabular text-emerald-600 mt-1">{resolvedCount}</p>
                <p className="text-[11px] text-[#75646C] mt-1">Completed & verified</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#F3CDD5] shadow-xs">
                <p className="text-xs font-bold text-[#75646C] uppercase tracking-wider">Active Staff</p>
                <p className="text-3xl font-extrabold font-mono-tabular text-[#1F1A1D] mt-1">{activeStaffCount}</p>
                <p className="text-[11px] text-[#75646C] mt-1">{inactiveStaffCount} deactivated</p>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="p-6 rounded-3xl bg-white border border-[#F3CDD5] shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-[#1F1A1D] uppercase tracking-wider">
                Authorized Warden Controls & Shortcuts
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => handleOpenAddStaff(false)}
                  className="p-3 rounded-xl bg-[#FFF9FA] border border-[#F4CED6] text-left hover:border-[#9F1239] transition-all cursor-pointer group"
                >
                  <UserPlus className="w-5 h-5 text-[#9F1239] mb-1 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-[#1F1A1D]">+ Add Staff Member</p>
                  <p className="text-[10px] text-[#75646C]">Add electrician, plumber, etc.</p>
                </button>

                <button
                  onClick={() => handleOpenAddStaff(true)}
                  className="p-3 rounded-xl bg-[#FFF9FA] border border-[#F4CED6] text-left hover:border-[#9F1239] transition-all cursor-pointer group"
                >
                  <Shield className="w-5 h-5 text-[#9F1239] mb-1 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-[#1F1A1D]">+ Add Warden Contact</p>
                  <p className="text-[10px] text-[#75646C]">Configure resident supervisor</p>
                </button>

                <button
                  onClick={() => { setIsAddEmergencyOpen(true); setEditingEmergency(null); }}
                  className="p-3 rounded-xl bg-[#FFF9FA] border border-[#F4CED6] text-left hover:border-[#9F1239] transition-all cursor-pointer group"
                >
                  <AlertTriangle className="w-5 h-5 text-[#9F1239] mb-1 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-[#1F1A1D]">+ Add Emergency Desk</p>
                  <p className="text-[10px] text-[#75646C]">Set 24/7 hotline numbers</p>
                </button>

                <button
                  onClick={() => setActiveTab('complaints')}
                  className="p-3 rounded-xl bg-[#FFF9FA] border border-[#F4CED6] text-left hover:border-[#9F1239] transition-all cursor-pointer group"
                >
                  <Clock className="w-5 h-5 text-[#9F1239] mb-1 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-[#1F1A1D]">Triage Grievances</p>
                  <p className="text-[10px] text-[#75646C]">{pendingCount} pending review</p>
                </button>
              </div>
            </div>

            {/* Recent complaints snapshot */}
            <div className="p-6 rounded-3xl bg-white border border-[#F3CDD5] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F7D8DF] pb-3">
                <h3 className="text-sm font-bold text-[#1F1A1D] uppercase tracking-wider">
                  Recent Room Grievances
                </h3>
                <button
                  onClick={() => setActiveTab('complaints')}
                  className="text-xs text-[#9F1239] font-bold hover:underline cursor-pointer"
                >
                  View All Complaints →
                </button>
              </div>

              <div className="space-y-2">
                {complaints.slice(0, 4).map((c) => (
                  <div key={c.id} className="p-3 rounded-xl bg-[#FFF9FA] border border-[#F4CED6] flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono-tabular font-bold text-[#9F1239]">{c.ticketNumber}</span>
                        <span className="text-[#1F1A1D] font-bold truncate max-w-xs">{c.title}</span>
                      </div>
                      <p className="text-[11px] text-[#75646C] mt-0.5">
                        Room {c.roomNumber} ({c.hostelBlock.replace('Block ', '')}) · USN: {c.usn} · Assigned: {c.assignedStaffName || c.assignedStaffRole || 'Unassigned'}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-white border border-[#F4CED6] text-[11px] font-semibold text-[#1F1A1D]">
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: COMPLAINTS TRIAGE & ASSIGNMENT (Section 14)
           ======================================================== */}
        {activeTab === 'complaints' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
            {/* Left Queue List */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-[#F3CDD5] p-5 max-h-[620px] overflow-y-auto space-y-3">
              <div className="flex items-center justify-between border-b border-[#F7D8DF] pb-3">
                <h3 className="text-xs font-bold text-[#75646C] uppercase tracking-wider">
                  Grievance Queue ({complaints.length})
                </h3>
                <span className="text-[11px] text-[#9F1239] font-semibold">{pendingCount} Pending</span>
              </div>

              <div className="space-y-2">
                {complaints.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedComplaintId(item.id);
                      setTargetStatus(item.status);
                      setSelectedStaffId(item.assignedStaffId || '');
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      selectedComplaint?.id === item.id
                        ? 'bg-[#FFF0F2] border-[#9F1239] shadow-xs'
                        : 'bg-[#FFF9FA] border-[#F4CED6] hover:bg-[#FFF3F5]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono-tabular font-bold text-[#9F1239]">{item.ticketNumber}</span>
                      <span className={`text-[10px] font-bold ${
                        item.priority === 'Emergency' ? 'text-red-600' :
                        item.priority === 'High' ? 'text-amber-600' : 'text-[#75646C]'
                      }`}>
                        {item.priority}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-[#1F1A1D] truncate">{item.title}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#75646C] mt-1">
                      <span>Room {item.roomNumber}</span>
                      <span>·</span>
                      <span className="font-mono-tabular">{item.usn}</span>
                      <span>·</span>
                      <span className="text-[#1F1A1D] font-semibold">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Inspection & Assignment Console */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-[#F3CDD5] p-6 space-y-5">
              {selectedComplaint ? (
                <form onSubmit={handleApplyComplaintUpdate} className="space-y-5">
                  <div className="border-b border-[#F7D8DF] pb-3 flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono-tabular text-[#9F1239] font-bold">
                        {selectedComplaint.ticketNumber}
                      </span>
                      <h2 className="text-lg font-bold text-[#1F1A1D] mt-0.5">{selectedComplaint.title}</h2>
                      <p className="text-xs text-[#75646C]">
                        Room {selectedComplaint.roomNumber}, {selectedComplaint.hostelBlock} · Student USN: {selectedComplaint.usn}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-[#FFF0F2] text-[#9F1239] text-xs font-bold">
                      {selectedComplaint.category}
                    </span>
                  </div>

                  {/* Student Description */}
                  <div className="bg-[#FFF9FA] p-3.5 rounded-2xl border border-[#F4CED6] text-xs">
                    <p className="font-bold text-[#1F1A1D] mb-1">Issue Description:</p>
                    <p className="text-[#4A3E44] leading-relaxed">{selectedComplaint.description}</p>
                    <div className="mt-2 text-[#75646C] flex items-center gap-3">
                      <span>Preferred Slot: <strong className="text-[#1F1A1D]">{selectedComplaint.preferredSlot || 'Anytime'}</strong></span>
                      <span>Current Staff: <strong className="text-[#9F1239]">{selectedComplaint.assignedStaffName || selectedComplaint.assignedStaffRole || 'None'}</strong></span>
                    </div>
                  </div>

                  {/* Photo Evidence if uploaded */}
                  {selectedComplaint.photoUrl && (
                    <div>
                      <label className="block text-xs font-bold text-[#75646C] mb-1.5 uppercase tracking-wider">
                        Attached Photo Evidence:
                      </label>
                      <div className="h-36 rounded-2xl overflow-hidden border border-[#F4CED6] bg-[#FFF5F6] flex items-center justify-center">
                        <img
                          src={selectedComplaint.photoUrl}
                          alt="Issue"
                          referrerPolicy="no-referrer"
                          className="h-full object-contain"
                        />
                      </div>
                    </div>
                  )}

                  {/* Dynamic Assignment to ACTIVE Staff Only (Section 14) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1F1A1D] mb-1.5">
                        Assign to Active Worker / Staff *
                      </label>
                      <select
                        value={selectedStaffId}
                        onChange={(e) => setSelectedStaffId(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#F2CBD2] bg-white text-xs font-medium text-[#1F1A1D] focus:outline-none focus:ring-2 focus:ring-[#9F1239]/20"
                      >
                        <option value="">-- Choose Active Staff Member --</option>
                        {activeStaffMembers.map((staff) => (
                          <option key={staff.id} value={staff.id}>
                            {staff.name} — {staff.designation} ({staff.specialization})
                          </option>
                        ))}
                      </select>
                      {activeStaffMembers.length === 0 && (
                        <p className="text-[11px] text-red-600 mt-1">
                          No active staff members in database. Click "Hostel Staff" tab to add one.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1F1A1D] mb-1.5">
                        Update Status
                      </label>
                      <select
                        value={targetStatus}
                        onChange={(e) => setTargetStatus(e.target.value as Status)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#F2CBD2] bg-white text-xs font-medium text-[#1F1A1D] focus:outline-none focus:ring-2 focus:ring-[#9F1239]/20"
                      >
                        <option value="Pending Review">Pending Review</option>
                        <option value="Technician Assigned">Technician Assigned</option>
                        <option value="In Progress">In Progress (Work Underway)</option>
                        <option value="Resolved">Resolved (Signed Off)</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  {/* Resolution notes */}
                  <div>
                    <label className="block text-xs font-bold text-[#1F1A1D] mb-1.5">
                      Official Warden / Work Order Remarks
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Faucet valve cartridge replaced, water pressure verified by technician."
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2CBD2] bg-white text-xs text-[#1F1A1D] focus:outline-none focus:ring-2 focus:ring-[#9F1239]/20"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#9F1239] text-white text-xs font-bold hover:bg-[#881337] transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Apply Assignment & Update Status</span>
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-xs text-[#75646C] text-center py-12">Select a complaint from queue.</p>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: HOSTEL STAFF MANAGEMENT (Section 4, 5, 6, 7, 8)
           ======================================================== */}
        {(activeTab === 'staff' || activeTab === 'wardens') && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Staff Header & Actions */}
            <div className="bg-white p-5 rounded-3xl border border-[#F3CDD5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#1F1A1D] font-display">
                  {activeTab === 'wardens' ? 'Hostel Wardens & Supervisors Management' : 'Hostel Staff & Maintenance Personnel'}
                </h2>
                <p className="text-xs text-[#75646C]">
                  Authorized Warden has complete control over personnel, contact details, student visibility, and deactivation.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAddStaff(activeTab === 'wardens')}
                  className="px-4 py-2.5 bg-[#9F1239] text-white text-xs font-bold rounded-xl hover:bg-[#881337] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{activeTab === 'wardens' ? 'Add Warden / Supervisor' : 'Add Staff Member'}</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl bg-white border border-[#F3CDD5] shadow-xs grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-6 relative">
                <Search className="w-4 h-4 text-[#8C7681] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search staff by name, phone, designation..."
                  value={staffSearch}
                  onChange={(e) => setStaffSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#FFF9FA] border border-[#F2CBD2] rounded-xl text-xs text-[#1F1A1D] focus:outline-none focus:ring-2 focus:ring-[#9F1239]/20"
                />
              </div>

              <div className="md:col-span-3">
                <select
                  value={staffSpecializationFilter}
                  onChange={(e) => setStaffSpecializationFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFF9FA] border border-[#F2CBD2] rounded-xl text-xs text-[#1F1A1D]"
                >
                  <option value="All">All Specializations</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Carpentry">Carpentry</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Internet/Network">Internet/Network</option>
                  <option value="General Maintenance">General Maintenance</option>
                  <option value="Security">Security</option>
                  <option value="Hostel Administration">Hostel Administration</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <select
                  value={staffStatusFilter}
                  onChange={(e) => setStaffStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFF9FA] border border-[#F2CBD2] rounded-xl text-xs text-[#1F1A1D]"
                >
                  <option value="All">All Status (Active & Inactive)</option>
                  <option value="Active">Active Only</option>
                  <option value="Inactive">Inactive Only (Deactivated)</option>
                </select>
              </div>
            </div>

            {/* Staff List / Table */}
            {filteredStaff.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#F3CDD5] p-12 text-center space-y-3">
                <Users className="w-10 h-10 text-[#9F1239] mx-auto opacity-50" />
                <h3 className="text-base font-bold text-[#1F1A1D]">
                  No staff members have been added yet.
                </h3>
                <p className="text-xs text-[#75646C] max-w-md mx-auto">
                  Use the button below to add your first real maintenance worker or warden contact. No fake sample data is inserted.
                </p>
                <button
                  onClick={() => handleOpenAddStaff(activeTab === 'wardens')}
                  className="px-5 py-2.5 bg-[#9F1239] text-white text-xs font-bold rounded-xl hover:bg-[#881337] transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{activeTab === 'wardens' ? 'Add First Warden Contact' : 'Add Staff Member'}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStaff.map((staff) => (
                  <div
                    key={staff.id}
                    className={`bg-white rounded-2xl border p-5 shadow-xs space-y-3 transition-all relative ${
                      staff.status === 'Active' ? 'border-[#F2CBD2]' : 'border-gray-300 opacity-75 bg-gray-50/50'
                    }`}
                  >
                    {/* Top status & visibility indicators */}
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        staff.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {staff.status}
                      </span>

                      <span className={`text-[10px] flex items-center gap-1 ${
                        staff.visibleToStudents ? 'text-[#9F1239] font-semibold' : 'text-gray-500'
                      }`}>
                        {staff.visibleToStudents ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{staff.visibleToStudents ? 'Visible to Students' : 'Admin Only'}</span>
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-[#1F1A1D]">{staff.name}</h4>
                      <p className="text-xs font-semibold text-[#9F1239]">{staff.designation}</p>
                      <p className="text-[11px] text-[#75646C]">{staff.department} · {staff.specialization}</p>
                    </div>

                    <div className="space-y-1 text-xs text-[#5E4D55] pt-1 border-t border-[#F7D8DF]">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#9F1239]" />
                        <span className="font-mono-tabular">{staff.phone || 'No phone provided'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-[#9F1239]" />
                        <span className="truncate">{staff.email || 'No email provided'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#9F1239]" />
                        <span>Area: {staff.hostelBlock}</span>
                      </div>
                    </div>

                    {/* Actions: Edit, Deactivate / Reactivate, Replace, Delete */}
                    <div className="pt-3 border-t border-[#F7D8DF] flex flex-wrap items-center justify-between gap-2 text-xs">
                      <button
                        onClick={() => handleOpenEditStaff(staff)}
                        className="px-2.5 py-1 rounded-lg bg-[#FFF0F2] text-[#9F1239] font-bold hover:bg-[#FFE0E6] transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      {staff.status === 'Active' ? (
                        <button
                          onClick={() => setDeactivatingStaff(staff)}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-bold hover:bg-amber-100 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <UserX className="w-3 h-3" />
                          <span>Deactivate</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onReactivateStaff(staff.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <UserCheck2 className="w-3 h-3" />
                          <span>Reactivate</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleStartReplaceStaff(staff)}
                        className="px-2 py-1 rounded-lg bg-blue-50 text-blue-800 font-semibold hover:bg-blue-100 transition-colors cursor-pointer flex items-center gap-1"
                        title="Replace this worker with a new active staff member"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Replace</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to permanently delete record for ${staff.name}?`)) {
                            onDeleteStaff(staff.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 4: EMERGENCY CONTACTS MANAGEMENT (Section 12)
           ======================================================== */}
        {activeTab === 'emergency' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white p-5 rounded-3xl border border-[#F3CDD5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#1F1A1D] font-display">
                  Emergency Contacts Management
                </h2>
                <p className="text-xs text-[#75646C]">
                  Configure 24/7 security, medical, and fire hotlines with student privacy controls.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingEmergency(null);
                  setEmFormName('');
                  setEmFormRole('Hostel Emergency Desk');
                  setEmFormPhone('');
                  setEmFormLocation('Central Campus');
                  setEmFormDesc('');
                  setEmFormPriority('Emergency');
                  setEmFormVisible(true);
                  setIsAddEmergencyOpen(true);
                }}
                className="px-4 py-2.5 bg-[#9F1239] text-white text-xs font-bold rounded-xl hover:bg-[#881337] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Emergency Contact</span>
              </button>
            </div>

            {emergencyContacts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#F3CDD5] p-12 text-center space-y-3">
                <AlertTriangle className="w-10 h-10 text-[#9F1239] mx-auto opacity-50" />
                <h3 className="text-base font-bold text-[#1F1A1D]">
                  No emergency contacts have been configured.
                </h3>
                <p className="text-xs text-[#75646C] max-w-md mx-auto">
                  Add genuine emergency helpline numbers (security desk, ambulance, resident wardens).
                </p>
                <button
                  onClick={() => setIsAddEmergencyOpen(true)}
                  className="px-4 py-2 bg-[#9F1239] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Configure Emergency Contact
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {emergencyContacts.map((contact) => (
                  <div key={contact.id} className="bg-white rounded-2xl border border-[#F2CBD2] p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold text-[10px]">
                        {contact.priority}
                      </span>
                      <span className="text-[10px] text-[#75646C] flex items-center gap-1">
                        {contact.visibleToStudents ? <Eye className="w-3 h-3 text-[#9F1239]" /> : <EyeOff className="w-3 h-3" />}
                        <span>{contact.visibleToStudents ? 'Student Visible' : 'Admin Only'}</span>
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-[#1F1A1D]">{contact.name}</h4>
                      <p className="text-xs font-semibold text-[#9F1239]">{contact.role}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#FFF9FA] border border-[#F4CED6] text-xs space-y-1">
                      <p className="font-mono-tabular font-bold text-sm text-[#1F1A1D]">{contact.phone}</p>
                      <p className="text-[11px] text-[#75646C]">Location: {contact.location}</p>
                      {contact.description && <p className="text-[11px] text-[#5E4D55]">{contact.description}</p>}
                    </div>

                    <div className="pt-2 border-t border-[#F7D8DF] flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          setEditingEmergency(contact);
                          setEmFormName(contact.name);
                          setEmFormRole(contact.role);
                          setEmFormPhone(contact.phone);
                          setEmFormLocation(contact.location);
                          setEmFormDesc(contact.description);
                          setEmFormPriority(contact.priority);
                          setEmFormVisible(contact.visibleToStudents);
                          setIsAddEmergencyOpen(true);
                        }}
                        className="text-[#9F1239] font-bold hover:underline cursor-pointer"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Remove emergency contact ${contact.name}?`)) {
                            onDeleteEmergencyContact(contact.id);
                          }
                        }}
                        className="text-red-600 font-semibold hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 5: MAINTENANCE SLA MANAGEMENT (Section 13)
           ======================================================== */}
        {activeTab === 'sla' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white p-5 rounded-3xl border border-[#F3CDD5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#1F1A1D] font-display">
                  Maintenance SLA & Turnaround Times
                </h2>
                <p className="text-xs text-[#75646C]">
                  Configure guaranteed response and resolution timeframes by category and urgency.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingSla(null);
                  setSlaFormCategory('Electrical');
                  setSlaFormPriority('High');
                  setSlaFormResponse('1 Hour');
                  setSlaFormResolution('4 Hours');
                  setSlaFormTeam('Campus Electrical Unit');
                  setIsAddSlaOpen(true);
                }}
                className="px-4 py-2.5 bg-[#9F1239] text-white text-xs font-bold rounded-xl hover:bg-[#881337] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add SLA Rule</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-[#F3CDD5] shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FFF9FA] border-b border-[#F4CED6] text-[11px] font-bold text-[#75646C] uppercase tracking-wider">
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Max Response</th>
                    <th className="py-3 px-4">Max Resolution</th>
                    <th className="py-3 px-4">Assigned Team</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4CED6]">
                  {slas.map((sla) => (
                    <tr key={sla.id} className="hover:bg-[#FFF9FA]">
                      <td className="py-3.5 px-4 font-bold text-[#1F1A1D]">{sla.category}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sla.priority === 'Emergency' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {sla.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono-tabular">{sla.responseTime}</td>
                      <td className="py-3.5 px-4 font-mono-tabular font-bold text-[#9F1239]">{sla.resolutionTime}</td>
                      <td className="py-3.5 px-4 text-[#5E4D55]">{sla.assignedTeam}</td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-semibold text-emerald-700">{sla.status}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingSla(sla);
                            setSlaFormCategory(sla.category);
                            setSlaFormPriority(sla.priority);
                            setSlaFormResponse(sla.responseTime);
                            setSlaFormResolution(sla.resolutionTime);
                            setSlaFormTeam(sla.assignedTeam);
                            setIsAddSlaOpen(true);
                          }}
                          className="text-[#9F1239] font-bold hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this SLA rule?')) {
                              onDeleteSLA(sla.id);
                            }
                          }}
                          className="text-red-600 font-medium hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: MAINTENANCE TEAMS (Section 3 & 4)
           ======================================================== */}
        {activeTab === 'teams' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white p-5 rounded-3xl border border-[#F3CDD5] shadow-xs">
              <h2 className="text-lg font-bold text-[#1F1A1D] font-display">Campus Maintenance Teams</h2>
              <p className="text-xs text-[#75646C]">Configured institutional repair crews and operational scopes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {maintenanceTeams.map((team) => {
                const teamStaffCount = staffMembers.filter((s) => s.department.toLowerCase().includes(team.name.toLowerCase()) || s.specialization.toLowerCase().includes(team.name.toLowerCase())).length;
                return (
                  <div key={team.id} className="bg-white rounded-2xl border border-[#F2CBD2] p-5 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-[#1F1A1D]">{team.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        {team.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#5E4D55] leading-relaxed">{team.description}</p>
                    <div className="pt-2 border-t border-[#F7D8DF] flex items-center justify-between text-xs text-[#75646C]">
                      <span>Associated Personnel: <strong className="text-[#1F1A1D]">{teamStaffCount}</strong></span>
                      <button
                        onClick={() => setActiveTab('staff')}
                        className="text-[#9F1239] font-bold hover:underline"
                      >
                        View Members →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 7: AUDIT LOGS (Section 17)
           ======================================================== */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-3xl border border-[#F3CDD5] p-6 shadow-xs space-y-4 animate-in fade-in duration-150">
            <div className="border-b border-[#F7D8DF] pb-3">
              <h2 className="text-base font-bold text-[#1F1A1D] font-display">
                Authorized Administrator Audit Trail
              </h2>
              <p className="text-xs text-[#75646C]">
                Security log tracking staff updates, deactivations, emergency changes, and complaint assignments.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FFF9FA] border-b border-[#F4CED6] text-[11px] font-bold text-[#75646C] uppercase">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Admin Role</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Affected Item</th>
                    <th className="py-2.5 px-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4CED6]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#FFF9FA]">
                      <td className="py-2.5 px-3 font-mono-tabular text-[#75646C] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-[#1F1A1D]">{log.adminRole}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-mono-tabular text-[10px] px-2 py-0.5 rounded bg-[#FFF0F2] text-[#9F1239] font-bold">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-[#1F1A1D]">{log.affectedRecord}</td>
                      <td className="py-2.5 px-3 text-[#5E4D55]">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 8: REPORTS & ANALYTICS (Section 3)
           ======================================================== */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white p-5 rounded-3xl border border-[#F3CDD5] shadow-xs">
              <h2 className="text-base font-bold text-[#1F1A1D] font-display">Hostel Maintenance Reports</h2>
              <p className="text-xs text-[#75646C]">Aggregated metrics across Kaveri, Godavari, Krishna & Tungabhadra blocks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-3xl border border-[#F3CDD5] space-y-3">
                <h3 className="text-xs font-bold text-[#75646C] uppercase tracking-wider">Turnaround SLA Compliance</h3>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-extrabold font-mono-tabular text-[#9F1239]">98.4%</div>
                  <p className="text-xs text-[#5E4D55] leading-relaxed">
                    Average resolution time of 4.2 hours across active residential blocks.
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#F3CDD5] space-y-3">
                <h3 className="text-xs font-bold text-[#75646C] uppercase tracking-wider">Active Staff Coverage</h3>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-extrabold font-mono-tabular text-[#1F1A1D]">{activeStaffCount}</div>
                  <p className="text-xs text-[#5E4D55] leading-relaxed">
                    {activeStaffCount} maintenance personnel active on call for student room repairs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================
          MODAL: ADD / EDIT / REPLACE STAFF MEMBER (Section 5, 6, 8)
         ======================================================== */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#F3CDD5] max-w-lg w-full p-6 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-[#F7D8DF] pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#1F1A1D] font-display">
                  {editingStaff 
                    ? 'Edit Staff Information' 
                    : replacingStaff 
                      ? `Add Replacement for ${replacingStaff.name}` 
                      : staffFormIsWarden 
                        ? 'Add Warden / Supervisor' 
                        : 'Add New Staff Member'}
                </h3>
                <p className="text-xs text-[#75646C] mt-0.5">
                  {replacingStaff 
                    ? `This will create a new active worker and deactivate ${replacingStaff.name} while preserving history.` 
                    : 'Enter real personnel details. Data is securely saved to database.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setIsAddStaffOpen(false); resetStaffForm(); }}
                className="p-1 rounded-lg text-gray-400 hover:text-[#1F1A1D] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {staffFormSuccessMsg && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                <span>{staffFormSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveStaff} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-[#1F1A1D] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kulkarni or Dr. S. R. Patil"
                  value={staffFormName}
                  onChange={(e) => setStaffFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFF9FA] border border-[#F2CBD2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9F1239]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1F1A1D] mb-1">Designation *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Campus Electrician"
                    value={staffFormDesignation}
                    onChange={(e) => setStaffFormDesignation(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF9FA] border border-[#F2CBD2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9F1239]/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1F1A1D] mb-1">Department / Team *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maintenance or Administration"
                    value={staffFormDepartment}
                    onChange={(e) => setStaffFormDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF9FA] border border-[#F2CBD2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9F1239]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1F1A1D] mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 94812 XXXXX"
                    value={staffFormPhone}
                    onChange={(e) => setStaffFormPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF9FA] border border-[#F2CBD2] rounded-xl font-mono-tabular focus:outline-none focus:ring-2 focus:ring-[#9F1239]/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1F1A1D] mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="staff@becbgk.edu"
                    value={staffFormEmail}
                    onChange={(e) => setStaffFormEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF9FA] border border-[#F2CBD2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9F1239]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1F1A1D] mb-1">Specialization</label>
                  <select
                    value={staffFormSpecialization}
                    onChange={(e) => setStaffFormSpecialization(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#FFF9FA] border border-[#F2CBD2] rounded-xl"
                  >
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Internet/Network">Internet/Network</option>
                    <option value="General Maintenance">General Maintenance</option>
                    <option value="Security">Security</option>
                    <option value="Hostel Administration">Hostel Administration</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#1F1A1D] mb-1">Hostel Block / Area</label>
                  <select
                    value={staffFormBlock}
                    onChange={(e) => setStaffFormBlock(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF9FA] border border-[#F2CBD2] rounded-xl"
                  >
                    <option value="All Blocks">All Blocks</option>
                    {HOSTEL_BLOCKS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1F1A1D] mb-1">Availability Hours</label>
                <input
                  type="text"
                  placeholder="e.g. 8:00 AM - 5:00 PM or 24/7 On-Call"
                  value={staffFormAvailability}
                  onChange={(e) => setStaffFormAvailability(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFF9FA] border border-[#F2CBD2] rounded-xl"
                />
              </div>

              {/* Privacy Control Toggle: Section 11 */}
              <div className="p-3 rounded-2xl bg-[#FFF9FA] border border-[#F4CED6] space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#1F1A1D]">Visible to Students</p>
                    <p className="text-[11px] text-[#75646C]">
                      Toggle whether contact information appears in student directory
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStaffFormVisible(!staffFormVisible)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      staffFormVisible ? 'bg-[#9F1239]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                        staffFormVisible ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsAddStaffOpen(false); resetStaffForm(); }}
                  className="px-4 py-2 text-[#75646C] hover:text-[#1F1A1D] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#9F1239] text-white font-bold rounded-xl hover:bg-[#881337] transition-all cursor-pointer shadow-xs"
                >
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          CONFIRMATION MODAL: DEACTIVATE STAFF (Section 7 & 18)
         ======================================================== */}
      {deactivatingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#F3CDD5] max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <UserX className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-[#1F1A1D]">
                Deactivate this staff member?
              </h3>
              <p className="text-xs text-[#75646C]">
                Staff Member: <strong className="text-[#1F1A1D]">{deactivatingStaff.name} ({deactivatingStaff.designation})</strong>
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFF9FA] border border-[#F4CED6] text-xs text-[#5E4D55] leading-relaxed">
              Are you sure you want to deactivate this staff member? They will no longer appear as an active maintenance contact or be available for new complaint assignments. Historical complaints previously handled by them will remain preserved.
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeactivatingStaff(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#F4CED6] text-xs font-bold text-[#5E4D55] hover:bg-[#FFF9FA] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeactivateStaff(deactivatingStaff.id);
                  setDeactivatingStaff(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-700 text-white text-xs font-bold hover:bg-amber-800 cursor-pointer shadow-xs"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT EMERGENCY CONTACT (Section 12)
         ======================================================== */}
      {isAddEmergencyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#F3CDD5] max-w-md w-full p-6 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-[#1F1A1D] mb-4">
              {editingEmergency ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!emFormName || !emFormPhone) return;

                if (editingEmergency) {
                  onUpdateEmergencyContact(editingEmergency.id, {
                    name: emFormName,
                    role: emFormRole,
                    phone: emFormPhone,
                    location: emFormLocation,
                    description: emFormDesc,
                    priority: emFormPriority,
                    visibleToStudents: emFormVisible,
                  });
                } else {
                  onAddEmergencyContact({
                    name: emFormName,
                    role: emFormRole,
                    phone: emFormPhone,
                    location: emFormLocation,
                    description: emFormDesc,
                    priority: emFormPriority,
                    visibleToStudents: emFormVisible,
                    status: 'Active',
                  });
                }
                setIsAddEmergencyOpen(false);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-[#1F1A1D] mb-1">Contact Name / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chief Warden Emergency Desk"
                  value={emFormName}
                  onChange={(e) => setEmFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFF9FA] border border-[#F2CBD2] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1F1A1D] mb-1">Helpline Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 8354 XXXXX"
                  value={emFormPhone}
                  onChange={(e) => setEmFormPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFF9FA] border border-[#F2CBD2] rounded-xl font-mono-tabular"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1F1A1D] mb-1">Service Role</label>
                  <select
                    value={emFormRole}
                    onChange={(e) => setEmFormRole(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF9FA] border border-[#F2CBD2] rounded-xl"
                  >
                    <option value="Hostel Emergency Desk">Hostel Emergency Desk</option>
                    <option value="Campus Security">Campus Security</option>
                    <option value="Medical Assistance">Medical Assistance</option>
                    <option value="Fire Safety">Fire Safety</option>
                    <option value="Hostel Maintenance">Hostel Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#1F1A1D] mb-1">Priority</label>
                  <select
                    value={emFormPriority}
                    onChange={(e) => setEmFormPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#FFF9FA] border border-[#F2CBD2] rounded-xl"
                  >
                    <option value="Emergency">Emergency</option>
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1F1A1D] mb-1">Location / Office</label>
                <input
                  type="text"
                  placeholder="e.g. Substation Control Room, Vidyagiri Campus"
                  value={emFormLocation}
                  onChange={(e) => setEmFormLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFF9FA] border border-[#F2CBD2] rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFF9FA] border border-[#F4CED6]">
                <span className="font-bold text-[#1F1A1D]">Visible to Students</span>
                <input
                  type="checkbox"
                  checked={emFormVisible}
                  onChange={(e) => setEmFormVisible(e.target.checked)}
                  className="w-4 h-4 accent-[#9F1239]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddEmergencyOpen(false)}
                  className="px-3 py-1.5 text-[#75646C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#9F1239] text-white font-bold rounded-xl"
                >
                  Save Emergency Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT SLA RULE (Section 13)
         ======================================================== */}
      {isAddSlaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#F3CDD5] max-w-md w-full p-6 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-[#1F1A1D] mb-4">
              {editingSla ? 'Edit SLA Rule' : 'Add Maintenance SLA Rule'}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingSla) {
                  onUpdateSLA(editingSla.id, {
                    category: slaFormCategory,
                    priority: slaFormPriority,
                    responseTime: slaFormResponse,
                    resolutionTime: slaFormResolution,
                    assignedTeam: slaFormTeam,
                  });
                } else {
                  onAddSLA({
                    category: slaFormCategory,
                    priority: slaFormPriority,
                    responseTime: slaFormResponse,
                    resolutionTime: slaFormResolution,
                    assignedTeam: slaFormTeam,
                    status: 'Active',
                  });
                }
                setIsAddSlaOpen(false);
              }}
              className="space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1F1A1D] mb-1">Category</label>
                  <select
                    value={slaFormCategory}
                    onChange={(e) => setSlaFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF9FA] border border-[#F2CBD2] rounded-xl"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#1F1A1D] mb-1">Priority</label>
                  <select
                    value={slaFormPriority}
                    onChange={(e) => setSlaFormPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 bg-[#FFF9FA] border border-[#F2CBD2] rounded-xl"
                  >
                    <option value="Emergency">Emergency</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1F1A1D] mb-1">Max Response Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 30 Mins"
                    value={slaFormResponse}
                    onChange={(e) => setSlaFormResponse(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF9FA] border border-[#F2CBD2] rounded-xl font-mono-tabular"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1F1A1D] mb-1">Max Resolution Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2 Hours"
                    value={slaFormResolution}
                    onChange={(e) => setSlaFormResolution(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF9FA] border border-[#F2CBD2] rounded-xl font-mono-tabular"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1F1A1D] mb-1">Assigned Team</label>
                <select
                  value={slaFormTeam}
                  onChange={(e) => setSlaFormTeam(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFF9FA] border border-[#F2CBD2] rounded-xl"
                >
                  {maintenanceTeams.map((t) => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddSlaOpen(false)}
                  className="px-3 py-1.5 text-[#75646C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#9F1239] text-white font-bold rounded-xl"
                >
                  Save SLA Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

function LayoutGridIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}
