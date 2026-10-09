import React from 'react';
import { BecLogo } from './BecLogo';
import { Shield, ExternalLink, Lock } from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="bg-[#FFF1EC] border-t border-[#E9D9D5] text-[#5F6368] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Top 3-Column Info */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Col 1: BEC Brand & Application Name */}
          <div className="md:col-span-5 space-y-3">
            <BecLogo size="md" />
            
            <p className="text-xs text-[#5F6368] leading-relaxed max-w-sm mt-3">
              <strong className="text-[#202124]">BEC Hostel Complaint Management System</strong><br />
              A secure digital platform for students to report and track hostel-related issues.
            </p>

            <div className="pt-2 text-[11px] text-[#5F6368] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#2E8B68]" />
              <span>Role-segregated records · 10,000+ student capacity architecture</span>
            </div>
          </div>

          {/* Col 2: Navigation Links from Section 32 */}
          <div className="md:col-span-3 space-y-2">
            <p className="font-bold text-[#202124] text-xs uppercase tracking-wider">
              Quick Navigation
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab('home')}
                  className="hover:text-[#A94F61] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('raise-complaint')}
                  className="hover:text-[#A94F61] transition-colors cursor-pointer"
                >
                  Raise Complaint
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('my-complaints')}
                  className="hover:text-[#A94F61] transition-colors cursor-pointer"
                >
                  Track Complaint
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('help')}
                  className="hover:text-[#A94F61] transition-colors cursor-pointer"
                >
                  Help & FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('privacy')}
                  className="hover:text-[#A94F61] transition-colors cursor-pointer"
                >
                  Privacy Notice
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Official College Location & Affiliation */}
          <div className="md:col-span-4 space-y-2">
            <p className="font-bold text-[#202124] text-xs uppercase tracking-wider">
              Institution Details
            </p>
            <p className="text-xs text-[#5F6368] leading-relaxed">
              Basaveshwar Engineering College (Autonomous)<br />
              Established 1963 · S. Nijalingappa Vidyanagar<br />
              Vidyagiri, Bagalkot - 587102, Karnataka, India
            </p>
            
            <div className="pt-2">
              <a
                href="https://www.becbgk.edu/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A94F61] hover:underline"
              >
                <span>Official BEC College Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright and student welfare banner */}
        <div className="pt-6 border-t border-[#E9D9D5] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#5F6368]">
          <p>© {new Date().getFullYear()} Basaveshwar Engineering College, Bagalkot. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span>BEC Hostel Services Administration</span>
            <span aria-hidden="true">·</span>
            <span>Vidyagiri Campus</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
