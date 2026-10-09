import React, { useState } from 'react';
import { X, Check, Mail, Lock, Shield, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { Student, WardenUser, HostelBlock, UserRole } from '../types';
import { HOSTEL_BLOCKS, DEFAULT_WARDEN } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Student | WardenUser | null;
  onSignInStudent: (student: Student) => void;
  onSignInWarden: (warden: WardenUser) => void;
  onSignOut: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSignInStudent,
  onSignInWarden,
  onSignOut,
}) => {
  const [authRole, setAuthRole] = useState<UserRole>(currentUser ? currentUser.role : 'student');
  
  // Student fields
  const [email, setEmail] = useState('vinaydiggavi@gmail.com');
  const [name, setName] = useState('Student Account');
  const [usn, setUsn] = useState('2BA21CS042');
  const [roomNumber, setRoomNumber] = useState('304');
  const [hostelBlock, setHostelBlock] = useState<HostelBlock>('Block A - Kaveri');

  // Warden fields
  const [wardenEmail, setWardenEmail] = useState('warden.hostel@becbgk.edu');
  const [wardenEmpId, setWardenEmpId] = useState('BEC-WRD-01');
  const [wardenPassword, setWardenPassword] = useState('WardenAdmin2026!');
  const [wardenError, setWardenError] = useState('');

  if (!isOpen) return null;

  const handleStudentCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !usn || !roomNumber) return;

    onSignInStudent({
      name: name || 'Student Account',
      email,
      usn: usn.toUpperCase(),
      roomNumber,
      hostelBlock,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}&backgroundColor=be123c&textColor=ffffff`,
      role: 'student'
    });
    onClose();
  };

  const handleQuickGoogleSignIn = () => {
    onSignInStudent({
      name: 'Student Account',
      email: 'vinaydiggavi@gmail.com',
      usn: '2BA21CS042',
      roomNumber: '304',
      hostelBlock: 'Block A - Kaveri',
      avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=SA&backgroundColor=be123c&textColor=ffffff',
      phoneNumber: '+91 94812 34567',
      role: 'student'
    });
    onClose();
  };

  const handleWardenLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setWardenError('');

    // Check institutional administrator authorization
    if (wardenEmail.toLowerCase().includes('warden') || wardenEmail.toLowerCase().includes('admin')) {
      onSignInWarden({
        name: 'Authorized Hostel Administrator',
        email: wardenEmail,
        designation: 'Central Hostel Office',
        employeeId: wardenEmpId.toUpperCase(),
        avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=WA&backgroundColor=9f1239&textColor=ffffff',
        role: 'warden'
      });
      onClose();
    } else {
      setWardenError('Invalid authorization. Official BEC warden credentials required.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-[#F4CCD5] max-w-md w-full shadow-2xl p-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-[#8C7681] hover:text-[#1F1A1D] hover:bg-[#FFF0F2] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0F2] border border-[#F5CBD4] text-[#9F1239] flex items-center justify-center mx-auto mb-3 shadow-xs">
            {authRole === 'warden' ? <ShieldCheck className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
          </div>
          <h3 className="text-xl font-bold text-[#1F1A1D] font-display">
            {authRole === 'warden' ? 'Authorized Warden Authentication' : 'Student Google Login'}
          </h3>
          <p className="text-xs text-[#75646C] mt-1">
            Basaveshwar Engineering College (BEC BGK) · Hostel Portal
          </p>
        </div>

        {/* Role Switcher Tabs (Section 2) */}
        <div className="flex items-center p-1 bg-[#FFF0F2] rounded-xl border border-[#F5CBD4] mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setAuthRole('student')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              authRole === 'student' ? 'bg-white text-[#9F1239] shadow-xs' : 'text-[#75646C] hover:text-[#1F1A1D]'
            }`}
          >
            Student Access
          </button>
          <button
            type="button"
            onClick={() => setAuthRole('warden')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authRole === 'warden' ? 'bg-[#9F1239] text-white shadow-xs' : 'text-[#75646C] hover:text-[#1F1A1D]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Warden / Admin</span>
          </button>
        </div>

        {/* Logged in view */}
        {currentUser && currentUser.role === authRole ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#FFF5F6] border border-[#F4CCD5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#9F1239] text-white flex items-center justify-center font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1F1A1D]">{currentUser.name}</p>
                  <p className="text-xs text-[#75646C]">{currentUser.email}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#F5D4DC] text-xs">
                {currentUser.role === 'student' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div><span className="text-[#8C7681]">USN:</span> <strong className="font-mono-tabular">{currentUser.usn}</strong></div>
                    <div><span className="text-[#8C7681]">Room:</span> <strong>{currentUser.roomNumber}</strong></div>
                  </div>
                ) : (
                  <div>
                    <span className="text-[#8C7681]">Role:</span> <strong className="text-[#9F1239]">Authorized Hostel Administrator</strong>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-[#9F1239] text-white text-xs font-semibold rounded-xl hover:bg-[#881337] transition-colors cursor-pointer"
              >
                Continue to Portal
              </button>
              <button
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="px-4 py-2.5 bg-[#FFF0F2] text-[#9F1239] border border-[#F4CBD3] text-xs font-semibold rounded-xl hover:bg-[#FFE2E7] transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : authRole === 'warden' ? (
          /* Warden Login Form */
          <form onSubmit={handleWardenLogin} className="space-y-3.5 text-xs">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
              <strong>Administrative Security:</strong> Complete control over hostel staff, emergency contacts, complaints assignment, and SLAs.
            </div>

            {wardenError && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{wardenError}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-[#1F1A1D] mb-1">Official Warden Email *</label>
              <input
                type="email"
                required
                value={wardenEmail}
                onChange={(e) => setWardenEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#FFF9FA] border border-[#F2CBD2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9F1239]/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1F1A1D] mb-1">Employee / Admin ID *</label>
              <input
                type="text"
                required
                value={wardenEmpId}
                onChange={(e) => setWardenEmpId(e.target.value)}
                className="w-full px-3 py-2 bg-[#FFF9FA] border border-[#F2CBD2] rounded-xl font-mono-tabular uppercase focus:outline-none focus:ring-2 focus:ring-[#9F1239]/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1F1A1D] mb-1">Password *</label>
              <input
                type="password"
                required
                value={wardenPassword}
                onChange={(e) => setWardenPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#FFF9FA] border border-[#F2CBD2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9F1239]/20"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 bg-[#9F1239] text-white font-bold rounded-xl hover:bg-[#881337] transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify & Access Warden Desk</span>
            </button>
          </form>
        ) : (
          /* Student Login Options */
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleQuickGoogleSignIn}
              className="w-full py-3 px-4 bg-white border border-[#E2B6C1] hover:border-[#9F1239] rounded-xl flex items-center justify-center gap-3 text-xs font-semibold text-[#1F1A1D] hover:bg-[#FFF9FA] transition-all shadow-xs cursor-pointer group"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.15C3.25 21.3 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.28C.46 8.23 0 10.06 0 12s.46 3.77 1.28 5.39l3.99-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-[#F5D5DD]"></div>
              <span className="flex-shrink mx-3 text-[11px] text-[#8C7681]">or verify room details</span>
              <div className="flex-grow border-t border-[#F5D5DD]"></div>
            </div>

            <form onSubmit={handleStudentCustomLogin} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1F1A1D] mb-1">Student USN *</label>
                <input
                  type="text"
                  required
                  placeholder="2BA21CS042"
                  value={usn}
                  onChange={(e) => setUsn(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl border border-[#F2CCD3] bg-[#FFF9FA] font-mono-tabular uppercase focus:outline-none focus:ring-1 focus:ring-[#9F1239]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-[#1F1A1D] mb-1">Hostel Block</label>
                  <select
                    value={hostelBlock}
                    onChange={(e) => setHostelBlock(e.target.value as HostelBlock)}
                    className="w-full px-2 py-2 rounded-xl border border-[#F2CCD3] bg-[#FFF9FA] text-[11px]"
                  >
                    {HOSTEL_BLOCKS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1F1A1D] mb-1">Room No. *</label>
                  <input
                    type="text"
                    required
                    placeholder="304"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#F2CCD3] bg-[#FFF9FA]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-[#9F1239] text-white font-semibold rounded-xl hover:bg-[#881337] transition-colors cursor-pointer"
              >
                Sign In to Room Account
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
