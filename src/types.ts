export type Category = 
  | 'Plumbing' 
  | 'Electrical' 
  | 'Carpentry' 
  | 'Wi-Fi & LAN' 
  | 'Cleanliness' 
  | 'Drinking Water' 
  | 'Civil & Windows'
  | 'Other';

export type Status = 
  | 'Pending Review' 
  | 'Technician Assigned' 
  | 'In Progress' 
  | 'Resolved' 
  | 'Closed';

export type Priority = 'Low' | 'Medium' | 'High' | 'Emergency';

export type HostelBlock = 
  | 'Block A - Kaveri' 
  | 'Block B - Godavari' 
  | 'Block C - Krishna' 
  | 'Block D - Tungabhadra';

export type UserRole = 'student' | 'warden';

export interface Student {
  name: string;
  email: string;
  usn: string;
  roomNumber: string;
  hostelBlock: HostelBlock;
  avatarUrl?: string;
  phoneNumber?: string;
  role: 'student';
}

export interface WardenUser {
  name: string;
  email: string;
  designation: string;
  employeeId: string;
  avatarUrl?: string;
  role: 'warden';
}

export interface ComplaintTimelineEvent {
  status: Status;
  timestamp: string;
  note: string;
  author: string;
}

export interface Complaint {
  id: string;
  ticketNumber: string;
  studentName: string;
  studentEmail: string;
  usn: string;
  roomNumber: string;
  hostelBlock: HostelBlock;
  category: Category;
  title: string;
  description: string;
  photoUrl?: string;
  priority: Priority;
  status: Status;
  createdAt: string;
  updatedAt: string;
  preferredSlot?: string;
  // Dynamic staff assignment fields preserving historical data
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedStaffRole?: string;
  assignedStaffPhone?: string;
  timeline: ComplaintTimelineEvent[];
  resolutionNotes?: string;
  rating?: number;
  feedback?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  designation: string; // e.g. "Campus Electrician", "Chief Warden", "Senior Plumber"
  department: string; // e.g. "Maintenance", "Administration", "IT & Network", "Housekeeping"
  phone: string;
  email: string;
  hostelBlock: string; // e.g. "All Blocks", "Block A - Kaveri", etc.
  specialization: 'Electrical' | 'Plumbing' | 'Carpentry' | 'Cleaning' | 'Internet/Network' | 'General Maintenance' | 'Security' | 'Hostel Administration' | 'Other';
  availability: string; // e.g. "8:00 AM - 5:00 PM", "24/7 Emergency"
  status: 'Active' | 'Inactive';
  visibleToStudents: boolean; // Privacy control toggle
  isWardenSupervisor?: boolean;
  createdAt: string;
  updatedAt: string;
  deactivatedAt?: string;
}

export interface MaintenanceTeam {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string; // e.g. "Hostel Emergency Desk", "Campus Security", "Medical Center"
  phone: string;
  location: string;
  description: string;
  priority: 'Emergency' | 'High' | 'Normal';
  visibleToStudents: boolean;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceSLA {
  id: string;
  category: string;
  priority: Priority;
  responseTime: string; // e.g. "30 Mins"
  resolutionTime: string; // e.g. "4 Hours"
  assignedTeam: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminRole: string;
  action: string;
  affectedRecord: string;
  details: string;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
}
