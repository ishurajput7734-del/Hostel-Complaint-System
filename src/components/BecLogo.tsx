import React from 'react';

interface BecLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  textVariant?: 'header' | 'footer' | 'standalone';
}

export const BecLogo: React.FC<BecLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textVariant = 'header',
}) => {
  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return { w: 32, h: 32, box: 'w-8 h-8' };
      case 'lg':
        return { w: 56, h: 56, box: 'w-14 h-14' };
      case 'md':
      default:
        return { w: 42, h: 42, box: 'w-10 h-10' };
    }
  };

  const { w, h, box } = getDimensions();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official BEC Bagalkot Heraldic Emblem Vector */}
      <div 
        className={`${box} shrink-0 rounded-xl bg-gradient-to-br from-[#8C2E42] via-[#A94F61] to-[#701E2E] p-1.5 shadow-sm border border-[#D98F9B]/40 flex items-center justify-center`}
        title="Basaveshwar Engineering College (Autonomous), Bagalkot - Est. 1963"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-white"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer circle shield */}
          <circle cx="50" cy="50" r="46" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="3 2" />
          <circle cx="50" cy="50" r="42" stroke="#FDE8EC" strokeWidth="1.5" />
          
          {/* Inner temple / pillar gateway */}
          <path
            d="M30 65 V44 L50 28 L70 44 V65 Z"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Sacred Lamp of Knowledge / Diya */}
          <ellipse cx="50" cy="55" rx="14" ry="5" fill="#FFE1E7" />
          <path
            d="M50 42 C48 46 45 49 50 53 C55 49 52 46 50 42 Z"
            fill="#FFD166"
            stroke="#FFFFFF"
            strokeWidth="1"
          />
          {/* Base pedestal */}
          <rect x="24" y="65" width="52" height="7" rx="2" fill="#FFFFFF" />
          {/* Gear cog teeth representing engineering */}
          <circle cx="50" cy="50" r="19" stroke="#FFE4E8" strokeWidth="1.5" strokeOpacity="0.7" />
          <circle cx="50" cy="50" r="8" fill="#FFFFFF" fillOpacity="0.2" />
          {/* Foundation year */}
          <text
            x="50"
            y="84"
            fill="#FFFFFF"
            fontSize="8"
            fontWeight="bold"
            letterSpacing="0.8"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            BEC 1963
          </text>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-[#202124] text-sm sm:text-base leading-tight tracking-tight font-sans">
              BEC Hostel Care
            </span>
            <span className="hidden sm:inline-block text-[10px] font-bold text-[#A94F61] bg-[#F8DDE1] px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
              Autonomous
            </span>
          </div>
          <span className="text-[11px] text-[#5F6368] leading-tight mt-0.5 font-medium">
            Basaveshwar Engineering College, Bagalkot
          </span>
        </div>
      )}
    </div>
  );
};
