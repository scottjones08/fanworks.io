/**
 * A clear-barrel ballpoint, drawn tip-first along +x so a rotate() lays it
 * into the hand. Tip at the origin; the barrel runs to about x = 236.
 */
export function PenDefs() {
  return (
    <>
      <linearGradient id="pen-barrel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="0.28" stopColor="#f8f7f3" stopOpacity="0.5" />
        <stop offset="0.62" stopColor="#e9e6df" stopOpacity="0.55" />
        <stop offset="1" stopColor="#bdb8ad" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="pen-cone" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f1e7c9" />
        <stop offset="0.45" stopColor="#c9b67c" />
        <stop offset="1" stopColor="#7d6a3c" />
      </linearGradient>
      <linearGradient id="pen-cap" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4a63f0" />
        <stop offset="0.5" stopColor="#2036c9" />
        <stop offset="1" stopColor="#14238a" />
      </linearGradient>
      <linearGradient id="pen-ink" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3a52e6" />
        <stop offset="0.5" stopColor="#2036c9" />
        <stop offset="1" stopColor="#182a9e" />
      </linearGradient>
      <filter id="pen-shadow" x="-30%" y="-80%" width="160%" height="260%">
        <feDropShadow dx="3" dy="9" stdDeviation="5" floodColor="#121212" floodOpacity="0.22" />
      </filter>
    </>
  );
}

export function PenArt() {
  return (
    <>
      {/* ball and brass cone */}
      <circle cx="0.6" cy="0" r="1.1" fill="#2a2a2a" />
      <path d="M1 0 C 8 -1.6, 16 -3.2, 30 -5.2 L30 5.2 C 16 3.2, 8 1.6, 1 0 Z" fill="url(#pen-cone)" />
      <path d="M12 -2.4 C 18 -3.2, 24 -3.9, 30 -4.4 L30 -2.2 C 24 -2.4, 18 -2.2, 12 -1.6 Z" fill="#fff" opacity="0.45" />
      {/* collar */}
      <rect x="29" y="-6.4" width="6" height="12.8" rx="1" fill="#8e8778" />
      {/* clear barrel */}
      <rect x="34" y="-6.8" width="174" height="13.6" rx="2" fill="url(#pen-barrel)" stroke="rgba(18,18,18,0.32)" strokeWidth="0.9" />
      {/* ink refill inside */}
      <rect x="36" y="-2.3" width="150" height="4.6" rx="2.3" fill="url(#pen-ink)" opacity="0.92" />
      <rect x="36" y="-1.9" width="150" height="1.1" rx="0.6" fill="#fff" opacity="0.35" />
      {/* facet highlights */}
      <rect x="34" y="-6.2" width="174" height="2" rx="1" fill="#fff" opacity="0.75" />
      <rect x="34" y="4.2" width="174" height="1.2" rx="0.6" fill="#121212" opacity="0.14" />
      {/* cap and plug */}
      <rect x="206" y="-7.4" width="24" height="14.8" rx="3.2" fill="url(#pen-cap)" />
      <rect x="229" y="-3.6" width="8" height="7.2" rx="2.4" fill="url(#pen-cap)" />
      <rect x="208" y="-6.2" width="20" height="1.6" rx="0.8" fill="#fff" opacity="0.45" />
      {/* clip */}
      <path d="M212 -7.4 L212 -13.6 C212 -15.6, 213.6 -17, 215.6 -17 L222 -17 C224 -17, 225.4 -15.6, 225.4 -13.6 L225.4 -12.4 L219 -12.4 L219 -9.6 C147 -9.6, 150 -9.6, 150 -9.6 L150 -7.4 Z" fill="url(#pen-cap)" />
      <path d="M150 -9.6 L219 -9.6 L219 -8.4 L150 -8.4 Z" fill="#fff" opacity="0.28" />
    </>
  );
}
