import React from 'react';
import { User, ShieldCheck, LogIn, Bell, CheckCircle2, Lock } from 'lucide-react';
import { Student, WardenUser } from '../types';

interface NavbarProps {
  currentView: 'student' | 'warden';
  onViewChange: (view: 'student' | 'warden') => void;
  currentUser: Student | WardenUser | null;
  onOpenAuth: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  myComplaintsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  currentUser,
  onOpenAuth,
  onNavigate,
  activeSection,
  myComplaintsCount,
}) => {
  const isWarden = currentUser?.role === 'warden';

  const handleWardenViewClick = () => {
    if (!isWarden) {
      // Must authenticate as an authorized warden first!
      onOpenAuth();
    } else {
      onViewChange('warden');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFF5F6]/90 backdrop-blur-md border-b border-[#F7D6DC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#home" 
          onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8C2E42] to-[#A94F61] text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:bg-[#881337] transition-colors">
            BEC
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-[#1F1A1D] font-display leading-none">
              HostelCare
            </span>
            <span className="text-[10px] text-[#75646C] leading-none mt-0.5 font-medium">
              Basaveshwar Engineering College
            </span>
          </div>
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#4A3E44]">
          <button
            onClick={() => onNavigate('raise')}
            className={`transition-colors hover:text-[#9F1239] cursor-pointer ${
              activeSection === 'raise' ? 'text-[#9F1239] font-semibold' : ''
            }`}
          >
            File Complaint
          </button>
          
          <button
            onClick={() => onNavigate('track')}
            className={`flex items-center gap-1.5 transition-colors hover:text-[#9F1239] cursor-pointer ${
              activeSection === 'track' ? 'text-[#9F1239] font-semibold' : ''
            }`}
          >
            <span>Track Grievances</span>
            {myComplaintsCount > 0 && (
              <span className="text-xs px-1.5 py-0.2 rounded-full bg-[#FFE4E8] text-[#9F1239] font-mono-tabular font-medium">
                {myComplaintsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('directory')}
            className={`transition-colors hover:text-[#9F1239] cursor-pointer ${
              activeSection === 'directory' ? 'text-[#9F1239] font-semibold' : ''
            }`}
          >
            Hostel Contacts
          </button>

          <button
            onClick={() => onNavigate('slas')}
            className={`transition-colors hover:text-[#9F1239] cursor-pointer ${
              activeSection === 'slas' ? 'text-[#9F1239] font-semibold' : ''
            }`}
          >
            Maintenance SLA
          </button>

          <button
            onClick={() => onNavigate('emergency')}
            className={`transition-colors hover:text-[#9F1239] cursor-pointer ${
              activeSection === 'emergency' ? 'text-[#9F1239] font-semibold' : ''
            }`}
          >
            Emergency Desk
          </button>
        </nav>

        {/* Zone 3: Primary actions & User account */}
        <div className="flex items-center gap-3">
          {/* View toggle (Student / Warden) with backend authorization check */}
          <div className="flex items-center bg-[#FCE5E9] p-1 rounded-xl border border-[#F4CBD2]">
            <button
              onClick={() => onViewChange('student')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                currentView === 'student'
                  ? 'bg-white text-[#9F1239] shadow-xs'
                  : 'text-[#5E4D55] hover:text-[#1F1A1D]'
              }`}
            >
              Student Portal
            </button>
            <button
              onClick={handleWardenViewClick}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                currentView === 'warden'
                  ? 'bg-[#9F1239] text-white shadow-xs'
                  : 'text-[#5E4D55] hover:text-[#1F1A1D]'
              }`}
              title={!isWarden ? 'Authorized Warden Login Required' : 'Open Warden Administration Desk'}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Warden Desk</span>
              {!isWarden && <Lock className="w-2.5 h-2.5 opacity-60 ml-0.5" />}
            </button>
          </div>

          {/* Profile / Auth Button */}
          {currentUser ? (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-white border border-[#F0CDD4] text-[#1F1A1D] hover:border-[#9F1239]/40 hover:bg-[#FFF9FA] transition-all cursor-pointer text-xs shadow-xs"
              title="Click to view session details or switch account"
            >
              <div className={`w-6 h-6 rounded-full text-white flex items-center justify-center font-bold text-xs ${
                currentUser.role === 'warden' ? 'bg-[#9F1239]' : 'bg-[#BE123C]'
              }`}>
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <p className="font-bold text-xs leading-none truncate max-w-[120px] text-[#1F1A1D]">
                  {currentUser.role === 'warden' ? 'Authorized Warden' : currentUser.name}
                </p>
                <p className="text-[10px] text-[#75646C] leading-none mt-0.5 font-mono-tabular">
                  {currentUser.role === 'warden' ? 'Admin Access' : (currentUser as Student).usn}
                </p>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#9F1239] text-white text-xs font-semibold hover:bg-[#881337] transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
