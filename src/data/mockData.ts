import { 
  Complaint, Student, WardenUser, StaffMember, 
  MaintenanceTeam, EmergencyContact, MaintenanceSLA, AuditLog 
} from '../types';
import { SAMPLE_ISSUE_PHOTOS } from './sampleImages';

export const DEFAULT_STUDENT: Student = {
  name: 'Student Account',
  email: 'vinaydiggavi@gmail.com',
  usn: '2BA21CS042',
  roomNumber: '304',
  hostelBlock: 'Block A - Kaveri',
  avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=SA&backgroundColor=be123c&textColor=ffffff',
  role: 'student'
};

export const DEFAULT_WARDEN: WardenUser = {
  name: 'Authorized Hostel Administrator',
  email: 'warden.hostel@becbgk.edu',
  designation: 'Central Hostel Office',
  employeeId: 'BEC-WRD-01',
  avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=WA&backgroundColor=9f1239&textColor=ffffff',
  role: 'warden'
};

// Initial complaints with generic role assignments preserving historical structure
export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'c-101',
    ticketNumber: 'HC-2026-1042',
    studentName: 'Student Account',
    studentEmail: 'vinaydiggavi@gmail.com',
    usn: '2BA21CS042',
    roomNumber: '304',
    hostelBlock: 'Block A - Kaveri',
    category: 'Plumbing',
    title: 'Continuous tap leak in bathroom washbasin',
    description: 'The bathroom washbasin cold water tap valve is worn out. Water is leaking continuously leading to water wastage and slippery tiles.',
    photoUrl: SAMPLE_ISSUE_PHOTOS.plumbing,
    priority: 'High',
    status: 'In Progress',
    createdAt: '2026-10-04T14:30:00Z',
    updatedAt: '2026-10-05T09:15:00Z',
    preferredSlot: 'Morning (9:00 AM - 12:00 PM)',
    assignedStaffRole: 'Plumbing Maintenance Unit',
    timeline: [
      {
        status: 'Pending Review',
        timestamp: '2026-10-04T14:30:00Z',
        note: 'Complaint registered by student via Google Portal.',
        author: 'Student'
      },
      {
        status: 'Technician Assigned',
        timestamp: '2026-10-04T16:00:00Z',
        note: 'Assigned to Plumbing Maintenance Unit.',
        author: 'Authorized Hostel Administrator'
      },
      {
        status: 'In Progress',
        timestamp: '2026-10-05T09:15:00Z',
        note: 'Technician inspected faucet. Valve cartridge replacement in progress.',
        author: 'Plumbing Maintenance Unit'
      }
    ]
  },
  {
    id: 'c-102',
    ticketNumber: 'HC-2026-1038',
    studentName: 'Hostel Resident',
    studentEmail: 'resident.hostel@becbgk.edu',
    usn: '2BA22ME019',
    roomNumber: '212',
    hostelBlock: 'Block B - Godavari',
    category: 'Electrical',
    title: 'Ceiling fan speed regulator sparking on speed 3',
    description: 'The ceiling fan regulator sparks when switched between speed 2 and 3. Emitting a slight burning plastic smell. Fan runs only at maximum speed.',
    photoUrl: SAMPLE_ISSUE_PHOTOS.electrical,
    priority: 'Emergency',
    status: 'Technician Assigned',
    createdAt: '2026-10-05T02:20:00Z',
    updatedAt: '2026-10-05T07:45:00Z',
    preferredSlot: 'Immediately / Any time',
    assignedStaffRole: 'Electrical Maintenance Unit',
    timeline: [
      {
        status: 'Pending Review',
        timestamp: '2026-10-05T02:20:00Z',
        note: 'Complaint registered with Emergency priority (Electrical spark).',
        author: 'Student'
      },
      {
        status: 'Technician Assigned',
        timestamp: '2026-10-05T07:45:00Z',
        note: 'Work order dispatched to Electrical Maintenance Unit. Switchboard isolated.',
        author: 'Authorized Hostel Administrator'
      }
    ]
  },
  {
    id: 'c-103',
    ticketNumber: 'HC-2026-1029',
    studentName: 'Hostel Resident',
    studentEmail: 'resident.hostel@becbgk.edu',
    usn: '2BA21EC088',
    roomNumber: '115',
    hostelBlock: 'Block C - Krishna',
    category: 'Carpentry',
    title: 'Cupboard door hinge loose and study table drawer jammed',
    description: 'The steel cupboard left door bottom hinge screws have fallen off. The study desk bottom drawer cannot be pulled out.',
    photoUrl: SAMPLE_ISSUE_PHOTOS.carpentry,
    priority: 'Medium',
    status: 'Resolved',
    createdAt: '2026-10-02T10:15:00Z',
    updatedAt: '2026-10-03T16:40:00Z',
    preferredSlot: 'Evening (4:00 PM - 7:00 PM)',
    assignedStaffRole: 'Carpentry Maintenance Unit',
    resolutionNotes: 'Hinges replaced with heavy-duty brackets. Drawer runners lubricated and aligned.',
    rating: 5,
    feedback: 'Repaired on time before evening study hours. Very helpful!',
    timeline: [
      {
        status: 'Pending Review',
        timestamp: '2026-10-02T10:15:00Z',
        note: 'Complaint registered.',
        author: 'Student'
      },
      {
        status: 'Technician Assigned',
        timestamp: '2026-10-02T14:00:00Z',
        note: 'Assigned to Carpentry Maintenance Unit.',
        author: 'Authorized Hostel Administrator'
      },
      {
        status: 'In Progress',
        timestamp: '2026-10-03T11:20:00Z',
        note: 'Work in progress in Room 115.',
        author: 'Carpentry Maintenance Unit'
      },
      {
        status: 'Resolved',
        timestamp: '2026-10-03T16:40:00Z',
        note: 'Hinges and runners repaired. Student confirmed functionality.',
        author: 'Authorized Hostel Administrator'
      }
    ]
  },
  {
    id: 'c-104',
    ticketNumber: 'HC-2026-1025',
    studentName: 'Student Account',
    studentEmail: 'vinaydiggavi@gmail.com',
    usn: '2BA21CS042',
    roomNumber: '304',
    hostelBlock: 'Block A - Kaveri',
    category: 'Wi-Fi & LAN',
    title: 'Ethernet port faceplate loose with no IP allocation',
    description: 'The wall RJ45 LAN port pins are bent. The Wi-Fi access point in the corridor shows full signal but internet throughput is very low.',
    photoUrl: SAMPLE_ISSUE_PHOTOS.wifi,
    priority: 'Medium',
    status: 'Resolved',
    createdAt: '2026-09-29T11:00:00Z',
    updatedAt: '2026-09-30T15:30:00Z',
    preferredSlot: 'Afternoon (1:00 PM - 4:00 PM)',
    assignedStaffRole: 'Campus IT & Network Cell',
    resolutionNotes: 'Re-punched RJ45 keystone jack. Gateway switch port reset.',
    rating: 5,
    feedback: 'High speed restored. Able to attend project demo smoothly.',
    timeline: [
      {
        status: 'Pending Review',
        timestamp: '2026-09-29T11:00:00Z',
        note: 'Complaint registered.',
        author: 'Student'
      },
      {
        status: 'Resolved',
        timestamp: '2026-09-30T15:30:00Z',
        note: 'Port re-crimped and bandwidth verified.',
        author: 'Campus IT & Network Cell'
      }
    ]
  }
];

export const HOSTEL_BLOCKS = [
  'Block A - Kaveri',
  'Block B - Godavari',
  'Block C - Krishna',
  'Block D - Tungabhadra'
] as const;

export const CATEGORIES = [
  { id: 'Plumbing', label: 'Plumbing', icon: 'Wrench', desc: 'Taps, washbasins, flush, shower, leakage' },
  { id: 'Electrical', label: 'Electrical', icon: 'Zap', desc: 'Fans, lights, switches, sockets, geyser' },
  { id: 'Carpentry', label: 'Carpentry', icon: 'Hammer', desc: 'Study tables, cots, cupboard locks, door hinges' },
  { id: 'Wi-Fi & LAN', label: 'Wi-Fi & LAN', icon: 'Wifi', desc: 'Corridor AP, room LAN port, DNS issues' },
  { id: 'Cleanliness', label: 'Sanitation & Cleanliness', icon: 'Sparkles', desc: 'Corridor dusting, washroom cleaning, waste bins' },
  { id: 'Drinking Water', label: 'Drinking Water & Cooler', icon: 'Droplets', desc: 'RO water purifier, water cooler temperature' },
  { id: 'Civil & Windows', label: 'Civil & Windows', icon: 'ShieldAlert', desc: 'Window mesh, glass panes, door stoppers, ceiling seepage' },
  { id: 'Other', label: 'General / Other', icon: 'HelpCircle', desc: 'General hostel infrastructure inquiries' }
] as const;

// Initial staff database: Empty or dynamic by default to allow authorized Warden full control!
export const INITIAL_STAFF_MEMBERS: StaffMember[] = [];

// Initial maintenance teams
export const INITIAL_MAINTENANCE_TEAMS: MaintenanceTeam[] = [
  { id: 'tm-1', name: 'Campus Electrical Unit', description: 'Power grid, wiring, lights, fans and distribution panels', status: 'Active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'tm-2', name: 'Hostel Plumbing Crew', description: 'Pipes, sanitary fixtures, overhead tanks and valves', status: 'Active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'tm-3', name: 'Campus Carpentry Unit', description: 'Furniture, cots, study desks, locks and door fittings', status: 'Active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'tm-4', name: 'Campus IT & Network Cell', description: 'Wi-Fi access points, fiber switches and room LAN sockets', status: 'Active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'tm-5', name: 'Housekeeping & Sanitation', description: 'Corridor cleanliness, washroom sanitation and waste management', status: 'Active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' }
];

// Initial emergency contacts: Dynamic!
export const INITIAL_EMERGENCY_CONTACTS: EmergencyContact[] = [];

// Initial configurable SLAs:
export const INITIAL_MAINTENANCE_SLAS: MaintenanceSLA[] = [
  { id: 'sla-1', category: 'Electrical', priority: 'Emergency', responseTime: '30 Mins', resolutionTime: '1 Hour', assignedTeam: 'Campus Electrical Unit', status: 'Active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'sla-2', category: 'Plumbing', priority: 'Emergency', responseTime: '45 Mins', resolutionTime: '2 Hours', assignedTeam: 'Hostel Plumbing Crew', status: 'Active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'sla-3', category: 'Electrical', priority: 'High', responseTime: '1 Hour', resolutionTime: '4 Hours', assignedTeam: 'Campus Electrical Unit', status: 'Active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'sla-4', category: 'Wi-Fi & LAN', priority: 'Medium', responseTime: '2 Hours', resolutionTime: '6 Hours', assignedTeam: 'Campus IT & Network Cell', status: 'Active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'sla-5', category: 'Carpentry', priority: 'Medium', responseTime: '2 Hours', resolutionTime: '8 Hours', assignedTeam: 'Campus Carpentry Unit', status: 'Active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'sla-6', category: 'Cleanliness', priority: 'High', responseTime: '1 Hour', resolutionTime: '3 Hours', assignedTeam: 'Housekeeping & Sanitation', status: 'Active', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-101',
    adminId: 'BEC-WRD-01',
    adminRole: 'Authorized Hostel Administrator',
    action: 'SYSTEM_INITIALIZATION',
    affectedRecord: 'Hostel Care Database',
    details: 'BEC Hostel Complaint Management System initialized with dynamic staff directory and SLA rules.',
    timestamp: '2026-10-01T08:00:00Z'
  }
];
