// High quality SVG data URIs for realistic issue previews and campus cards
export const SAMPLE_ISSUE_PHOTOS = {
  plumbing: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
      <rect width="600" height="400" fill="#FCECEF"/>
      <rect x="40" y="40" width="520" height="320" rx="16" fill="#FFF9FA" stroke="#F3CBD3" stroke-width="2"/>
      <circle cx="300" cy="180" r="70" fill="#FFE4E8"/>
      <!-- Faucet & Drip graphic -->
      <path d="M260 210 V140 C260 110 340 110 340 140 V160" stroke="#9F1239" stroke-width="12" stroke-linecap="round"/>
      <rect x="240" y="210" width="40" height="20" rx="4" fill="#9F1239"/>
      <path d="M340 160 H330 V175 H350 V160 Z" fill="#BE123C"/>
      <path d="M340 195 C336 205 344 215 340 225 C336 215 344 205 340 195 Z" fill="#0284C7"/>
      <circle cx="340" cy="240" r="5" fill="#0284C7"/>
      <!-- Water pool -->
      <ellipse cx="300" cy="280" rx="140" ry="18" fill="#E0F2FE" stroke="#38BDF8" stroke-width="2"/>
      <text x="300" y="330" fill="#881337" font-family="sans-serif" font-weight="600" font-size="16" text-anchor="middle">Bathroom Washbasin Continuous Tap Leakage</text>
      <text x="300" y="352" fill="#75646C" font-family="sans-serif" font-size="13" text-anchor="middle">Reported in Room 304, Kaveri Block</text>
    </svg>
  `)}`,

  electrical: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
      <rect width="600" height="400" fill="#FCECEF"/>
      <rect x="40" y="40" width="520" height="320" rx="16" fill="#FFF9FA" stroke="#F3CBD3" stroke-width="2"/>
      <circle cx="300" cy="170" r="70" fill="#FEF3C7"/>
      <!-- Fan / Switch graphic -->
      <circle cx="300" cy="160" r="22" fill="#9F1239"/>
      <path d="M300 138 C300 95 335 80 345 100 C330 115 315 130 300 138 Z" fill="#BE123C"/>
      <path d="M280 170 C240 185 225 155 245 140 C260 152 272 162 280 170 Z" fill="#BE123C"/>
      <path d="M315 175 C335 210 365 200 355 180 C340 175 325 174 315 175 Z" fill="#BE123C"/>
      <!-- Spark / fault indicator -->
      <path d="M360 120 L375 135 L365 140 L385 160" stroke="#DC2626" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="300" y="330" fill="#881337" font-family="sans-serif" font-weight="600" font-size="16" text-anchor="middle">Ceiling Fan Humming & Regulator Sparking</text>
      <text x="300" y="352" fill="#75646C" font-family="sans-serif" font-size="13" text-anchor="middle">Speed regulator stuck at 1, burning smell</text>
    </svg>
  `)}`,

  carpentry: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
      <rect width="600" height="400" fill="#FCECEF"/>
      <rect x="40" y="40" width="520" height="320" rx="16" fill="#FFF9FA" stroke="#F3CBD3" stroke-width="2"/>
      <rect x="220" y="110" width="160" height="120" rx="6" fill="#78350F" stroke="#92400E" stroke-width="4"/>
      <!-- Broken drawer latch -->
      <line x1="220" y1="170" x2="380" y2="170" stroke="#B45309" stroke-width="3"/>
      <rect x="280" y="130" width="40" height="12" rx="3" fill="#D97706"/>
      <rect x="275" y="188" width="50" height="12" rx="3" fill="#D97706" transform="rotate(15 275 188)"/>
      <line x1="330" y1="180" x2="350" y2="200" stroke="#DC2626" stroke-width="3" stroke-dasharray="3 3"/>
      <text x="300" y="330" fill="#881337" font-family="sans-serif" font-weight="600" font-size="16" text-anchor="middle">Study Table Drawer Latch & Cupboard Hinge Broken</text>
      <text x="300" y="352" fill="#75646C" font-family="sans-serif" font-size="13" text-anchor="middle">Cupboard door unable to lock safely</text>
    </svg>
  `)}`,

  wifi: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
      <rect width="600" height="400" fill="#FCECEF"/>
      <rect x="40" y="40" width="520" height="320" rx="16" fill="#FFF9FA" stroke="#F3CBD3" stroke-width="2"/>
      <!-- Wall faceplate -->
      <rect x="240" y="100" width="120" height="140" rx="8" fill="#F1F5F9" stroke="#94A3B8" stroke-width="3"/>
      <!-- RJ45 Ethernet Port with loose pins -->
      <rect x="275" y="140" width="50" height="40" rx="4" fill="#0F172A"/>
      <path d="M285 140 V155 H315 V140" fill="#334155"/>
      <circle cx="300" cy="120" r="4" fill="#EF4444"/>
      <!-- Broken line -->
      <line x1="300" y1="185" x2="300" y2="230" stroke="#DC2626" stroke-width="4" stroke-linecap="round"/>
      <text x="300" y="330" fill="#881337" font-family="sans-serif" font-weight="600" font-size="16" text-anchor="middle">Room LAN Port No Signal / Loose RJ45 Socket</text>
      <text x="300" y="352" fill="#75646C" font-family="sans-serif" font-size="13" text-anchor="middle">Frequent disconnects during online class/exams</text>
    </svg>
  `)}`,
};
