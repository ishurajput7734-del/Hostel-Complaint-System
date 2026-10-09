/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ComplaintForm } from './components/ComplaintForm';
import { ComplaintTracker } from './components/ComplaintTracker';
import { WardenDashboard } from './components/WardenDashboard';
import { HostelDirectory } from './components/HostelDirectory';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

import { 
  Complaint, Student, WardenUser, Status, 
  StaffMember, MaintenanceTeam, EmergencyContact, MaintenanceSLA, AuditLog 
} from './types';
import { 
  INITIAL_COMPLAINTS, DEFAULT_STUDENT, DEFAULT_WARDEN, 
  INITIAL_STAFF_MEMBERS, INITIAL_MAINTENANCE_TEAMS, 
  INITIAL_EMERGENCY_CONTACTS, INITIAL_MAINTENANCE_SLAS, INITIAL_AUDIT_LOGS 
} from './data/mockData';

export default function App() {
  // Database states with localStorage persistence
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem('bec_hostel_complaints');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_COMPLAINTS;
  });

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem('bec_hostel_staff');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_STAFF_MEMBERS;
  });

  const [maintenanceTeams, setMaintenanceTeams] = useState<MaintenanceTeam[]>(() => {
    try {
      const saved = localStorage.getItem('bec_hostel_teams');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MAINTENANCE_TEAMS;
  });

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(() => {
    try {
      const saved = localStorage.getItem('bec_hostel_emergency');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_EMERGENCY_CONTACTS;
  });

  const [slas, setSlas] = useState<MaintenanceSLA[]>(() => {
    try {
      const saved = localStorage.getItem('bec_hostel_slas');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MAINTENANCE_SLAS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem('bec_hostel_audit');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_AUDIT_LOGS;
  });

  // User session state
  const [currentUser, setCurrentUser] = useState<Student | WardenUser | null>(() => {
    try {
      const saved = localStorage.getItem('bec_hostel_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_STUDENT;
  });

  const [currentView, setCurrentView] = useState<'student' | 'warden'>('student');
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [wardenTabTarget, setWardenTabTarget] = useState<
    'overview' | 'complaints' | 'staff' | 'wardens' | 'teams' | 'emergency' | 'sla' | 'audit' | 'reports'
  >('overview');

  // Persistence effects
  useEffect(() => {
    try { localStorage.setItem('bec_hostel_complaints', JSON.stringify(complaints)); } catch (e) {}
  }, [complaints]);

  useEffect(() => {
    try { localStorage.setItem('bec_hostel_staff', JSON.stringify(staffMembers)); } catch (e) {}
  }, [staffMembers]);

  useEffect(() => {
    try { localStorage.setItem('bec_hostel_emergency', JSON.stringify(emergencyContacts)); } catch (e) {}
  }, [emergencyContacts]);

  useEffect(() => {
    try { localStorage.setItem('bec_hostel_slas', JSON.stringify(slas)); } catch (e) {}
  }, [slas]);

  useEffect(() => {
    try { localStorage.setItem('bec_hostel_audit', JSON.stringify(auditLogs)); } catch (e) {}
  }, [auditLogs]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('bec_hostel_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('bec_hostel_user');
      }
    } catch (e) {}
  }, [currentUser]);

  // Record audit log helper
  const recordAudit = (action: string, affectedRecord: string, details: string) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      adminId: currentUser?.role === 'warden' ? (currentUser as WardenUser).employeeId : 'SYSTEM',
      adminRole: currentUser?.role === 'warden' ? 'Authorized Hostel Administrator' : 'System',
      action,
      affectedRecord,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Staff management actions (Sections 4, 5, 6, 7, 8)
  const handleAddStaff = (newStaffData: Omit<StaffMember, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `stf-${Date.now()}`;
    const now = new Date().toISOString();
    const newStaff: StaffMember = {
      ...newStaffData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    setStaffMembers((prev) => [newStaff, ...prev]);
    recordAudit('STAFF_ADDED', newStaff.name, `Added staff member ${newStaff.name} as ${newStaff.designation} (${newStaff.specialization}).`);
  };

  const handleUpdateStaff = (id: string, updates: Partial<StaffMember>) => {
    const now = new Date().toISOString();
    let staffName = '';
    setStaffMembers((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          staffName = s.name;
          return { ...s, ...updates, updatedAt: now };
        }
        return s;
      })
    );
    recordAudit('STAFF_UPDATED', staffName || id, `Updated staff information for ${staffName}.`);
  };

  const handleDeactivateStaff = (id: string, reason?: string) => {
    const now = new Date().toISOString();
    let staffName = '';
    setStaffMembers((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          staffName = s.name;
          return {
            ...s,
            status: 'Inactive',
            updatedAt: now,
            deactivatedAt: now
          };
        }
        return s;
      })
    );
    recordAudit('STAFF_DEACTIVATED', staffName || id, `Deactivated staff member ${staffName}. ${reason || 'Removed from active maintenance assignments.'}`);
  };

  const handleReactivateStaff = (id: string) => {
    const now = new Date().toISOString();
    let staffName = '';
    setStaffMembers((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          staffName = s.name;
          return {
            ...s,
            status: 'Active',
            updatedAt: now,
            deactivatedAt: undefined
          };
        }
        return s;
      })
    );
    recordAudit('STAFF_REACTIVATED', staffName || id, `Reactivated staff member ${staffName} to active duty.`);
  };

  const handleDeleteStaff = (id: string) => {
    const staff = staffMembers.find((s) => s.id === id);
    setStaffMembers((prev) => prev.filter((s) => s.id !== id));
    recordAudit('STAFF_DELETED', staff?.name || id, `Deleted personnel record for ${staff?.name || id}.`);
  };

  // Emergency contacts actions (Section 12)
  const handleAddEmergencyContact = (contactData: Omit<EmergencyContact, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `em-${Date.now()}`;
    const now = new Date().toISOString();
    const newContact: EmergencyContact = {
      ...contactData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    setEmergencyContacts((prev) => [newContact, ...prev]);
    recordAudit('EMERGENCY_CONTACT_ADDED', newContact.name, `Configured emergency contact: ${newContact.name} (${newContact.phone}).`);
  };

  const handleUpdateEmergencyContact = (id: string, updates: Partial<EmergencyContact>) => {
    const now = new Date().toISOString();
    let contactName = '';
    setEmergencyContacts((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          contactName = c.name;
          return { ...c, ...updates, updatedAt: now };
        }
        return c;
      })
    );
    recordAudit('EMERGENCY_CONTACT_UPDATED', contactName || id, `Updated emergency contact ${contactName}.`);
  };

  const handleDeleteEmergencyContact = (id: string) => {
    const contact = emergencyContacts.find((c) => c.id === id);
    setEmergencyContacts((prev) => prev.filter((c) => c.id !== id));
    recordAudit('EMERGENCY_CONTACT_DELETED', contact?.name || id, `Deleted emergency contact ${contact?.name || id}.`);
  };

  // SLA actions (Section 13)
  const handleAddSLA = (slaData: Omit<MaintenanceSLA, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `sla-${Date.now()}`;
    const now = new Date().toISOString();
    const newSLA: MaintenanceSLA = {
      ...slaData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    setSlas((prev) => [newSLA, ...prev]);
    recordAudit('SLA_CONFIGURED', `${newSLA.category} - ${newSLA.priority}`, `Created SLA rule: ${newSLA.category} (${newSLA.priority}) -> Response: ${newSLA.responseTime}, Resolution: ${newSLA.resolutionTime}.`);
  };

  const handleUpdateSLA = (id: string, updates: Partial<MaintenanceSLA>) => {
    const now = new Date().toISOString();
    setSlas((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: now } : s))
    );
    recordAudit('SLA_UPDATED', id, `Updated maintenance SLA rule.`);
  };

  const handleDeleteSLA = (id: string) => {
    setSlas((prev) => prev.filter((s) => s.id !== id));
    recordAudit('SLA_DELETED', id, `Removed maintenance SLA rule.`);
  };

  // Complaint submission
  const handleAddComplaint = (
    newComplaintData: Omit<Complaint, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'timeline' | 'status'>
  ) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `HC-2026-${randomNum}`;
    const newId = `c-${Date.now()}`;
    const now = new Date().toISOString();

    const newComplaint: Complaint = {
      ...newComplaintData,
      id: newId,
      ticketNumber,
      status: 'Pending Review',
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          status: 'Pending Review',
          timestamp: now,
          note: `Grievance submitted by ${newComplaintData.studentName} for Room ${newComplaintData.roomNumber}.`,
          author: 'Student'
        }
      ]
    };

    setComplaints((prev) => [newComplaint, ...prev]);
  };

  // Complaint rating
  const handleRateComplaint = (complaintId: string, rating: number, feedback: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return {
            ...c,
            rating,
            feedback,
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      })
    );
  };

  // Warden complaint update and assignment (Section 14 & 20)
  const handleWardenComplaintUpdate = (
    complaintId: string,
    newStatus: Status,
    note: string,
    assignedStaffId?: string,
    assignedStaffName?: string,
    assignedStaffRole?: string,
    assignedStaffPhone?: string
  ) => {
    const now = new Date().toISOString();
    let ticketNum = '';

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          ticketNum = c.ticketNumber;
          const updatedTimeline = [
            ...c.timeline,
            {
              status: newStatus,
              timestamp: now,
              note: note || `Status updated to ${newStatus}.`,
              author: 'Authorized Hostel Administrator'
            }
          ];

          return {
            ...c,
            status: newStatus,
            updatedAt: now,
            resolutionNotes: newStatus === 'Resolved' ? (c.resolutionNotes || note) : c.resolutionNotes,
            assignedStaffId: assignedStaffId || c.assignedStaffId,
            assignedStaffName: assignedStaffName || c.assignedStaffName,
            assignedStaffRole: assignedStaffRole || c.assignedStaffRole,
            assignedStaffPhone: assignedStaffPhone || c.assignedStaffPhone,
            timeline: updatedTimeline
          };
        }
        return c;
      })
    );

    recordAudit(
      newStatus === 'Resolved' ? 'COMPLAINT_RESOLVED' : 'COMPLAINT_UPDATED',
      ticketNum || complaintId,
      `Updated status to ${newStatus}. Assigned worker: ${assignedStaffName || 'None'}.`
    );
  };

  // Navigation smoothly
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHeroSearch = (term: string) => {
    setSelectedTicketId(term);
    handleNavigate('track');
  };

  // Secure view toggle (Section 2)
  const handleViewChange = (view: 'student' | 'warden') => {
    if (view === 'warden') {
      if (currentUser?.role !== 'warden') {
        setIsAuthOpen(true);
        return;
      }
      setCurrentView('warden');
    } else {
      setCurrentView('student');
    }
  };

  // Direct jump from directory button to Warden tab
  const handleManageContactsJump = (tab: 'staff' | 'wardens' | 'emergency' | 'slas') => {
    if (currentUser?.role !== 'warden') {
      setIsAuthOpen(true);
      return;
    }
    const tabMap: Record<string, any> = {
      staff: 'staff',
      wardens: 'wardens',
      emergency: 'emergency',
      slas: 'sla'
    };
    setWardenTabTarget(tabMap[tab] || 'staff');
    setCurrentView('warden');
  };

  const studentUSN = currentUser && currentUser.role === 'student' ? currentUser.usn : '';
  const myComplaintsCount = studentUSN
    ? complaints.filter((c) => c.usn.toLowerCase() === studentUSN.toLowerCase()).length
    : 0;

  const resolvedCount = complaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;

  return (
    <div className="min-h-screen bg-[#FFF5F6] text-[#1F1A1D] flex flex-col font-sans selection:bg-[#F3CAD2] selection:text-[#881337]">
      
      {/* Top Bar */}
      <Navbar
        currentView={currentView}
        onViewChange={handleViewChange}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onNavigate={handleNavigate}
        activeSection={activeSection}
        myComplaintsCount={myComplaintsCount}
      />

      <main className="flex-1">
        {/* Warden Mode View (Protected - Section 2 & 3) */}
        {currentView === 'warden' && currentUser?.role === 'warden' ? (
          <WardenDashboard
            complaints={complaints}
            staffMembers={staffMembers}
            maintenanceTeams={maintenanceTeams}
            emergencyContacts={emergencyContacts}
            slas={slas}
            auditLogs={auditLogs}
            onUpdateComplaint={handleWardenComplaintUpdate}
            onAddStaff={handleAddStaff}
            onUpdateStaff={handleUpdateStaff}
            onDeactivateStaff={handleDeactivateStaff}
            onReactivateStaff={handleReactivateStaff}
            onDeleteStaff={handleDeleteStaff}
            onAddEmergencyContact={handleAddEmergencyContact}
            onUpdateEmergencyContact={handleUpdateEmergencyContact}
            onDeleteEmergencyContact={handleDeleteEmergencyContact}
            onAddSLA={handleAddSLA}
            onUpdateSLA={handleUpdateSLA}
            onDeleteSLA={handleDeleteSLA}
            onExitWardenMode={() => setCurrentView('student')}
            initialTab={wardenTabTarget}
          />
        ) : (
          /* Student Portal View */
          <>
            {/* Collegiate Hero Section */}
            <Hero
              onFileComplaint={() => handleNavigate('raise')}
              onTrackComplaint={() => handleNavigate('track')}
              onSearchUSN={handleHeroSearch}
              currentUser={currentUser?.role === 'student' ? currentUser : null}
              totalComplaintsCount={complaints.length}
              resolvedComplaintsCount={resolvedCount}
            />

            {/* Complaint Filing Section */}
            <ComplaintForm
              currentUser={currentUser?.role === 'student' ? currentUser : null}
              onOpenAuth={() => setIsAuthOpen(true)}
              onSubmitComplaint={handleAddComplaint}
              onViewTicket={(ticketId) => {
                setSelectedTicketId(ticketId);
                handleNavigate('track');
              }}
            />

            {/* Live Grievance Tracking Board */}
            <ComplaintTracker
              complaints={complaints}
              currentUser={currentUser?.role === 'student' ? currentUser : null}
              onRateComplaint={handleRateComplaint}
              selectedTicketId={selectedTicketId}
              onClearSelectedTicket={() => setSelectedTicketId(null)}
            />

            {/* Dynamic Hostel Contacts & SLA Directory (Section 9 & 10) */}
            <HostelDirectory
              staffMembers={staffMembers}
              emergencyContacts={emergencyContacts}
              slas={slas}
              isWarden={currentUser?.role === 'warden'}
              onManageContacts={handleManageContactsJump}
            />
          </>
        )}
      </main>

      {/* Collegiate Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onSignInStudent={(student) => {
          setCurrentUser(student);
          setCurrentView('student');
        }}
        onSignInWarden={(warden) => {
          setCurrentUser(warden);
          setCurrentView('warden');
        }}
        onSignOut={() => {
          setCurrentUser(null);
          setCurrentView('student');
        }}
      />

    </div>
  );
}
