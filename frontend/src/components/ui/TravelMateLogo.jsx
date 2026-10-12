import React from 'react';

/**
 * TravelMate Custom Vector Logo Component (Option A: Himalayan Peaks with Golden Compass Star)
 * High-contrast, clean standalone vector mark without muddy background boxes.
 */
export default function TravelMateLogo({
  variant = 'full', // 'full' (mark + text) or 'mark' (icon only)
  size = 'md',      // 'sm', 'md', 'lg'
  className = '',
  textColor = null,
}) {
  const sizeMap = {
    sm: { width: 34, height: 28, fontSize: '1.05rem', taglineSize: '0.60rem' },
    md: { width: 44, height: 36, fontSize: '1.32rem', taglineSize: '0.68rem' },
    lg: { width: 58, height: 48, fontSize: '1.75rem', taglineSize: '0.80rem' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const LogoMark = (
    <svg
      width={currentSize.width}
      height={currentSize.height}
      viewBox="0 0 54 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="travelmate-logo-icon"
      aria-label="TravelMate Emblem"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* Left Mountain Ridge & Peak */}
      <path
        d="M 4 38 L 19 14 L 34 38"
        stroke="#064e3b"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#ecfdf5"
      />
      {/* Left Snowcap */}
      <polygon points="19,14 15,21 19,19 23,21" fill="#064e3b" />

      {/* Main Center-Right Mountain Peak (High Himalaya) */}
      <path
        d="M 19 38 L 36 6 L 50 38"
        stroke="#064e3b"
        strokeWidth="3.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#e6f4ea"
      />
      {/* Main Peak Snowcap Accent */}
      <polygon points="36,6 30,17 36,15 42,17" fill="#064e3b" />

      {/* Compass Navigation Guidance Ring (Clean White Backing for 100% Contrast) */}
      <circle
        cx="27"
        cy="26"
        r="10.5"
        fill="#ffffff"
        stroke="#f59e0b"
        strokeWidth="2.6"
      />

      {/* 8-Point Golden Compass Star */}
      {/* Diagonal Compass Points */}
      <polygon points="27,26 31.5,21.5 27,24 22.5,21.5" fill="#fbbf24" />
      <polygon points="27,26 31.5,30.5 27,28 22.5,30.5" fill="#fbbf24" />
      <polygon points="27,26 24.5,28.5 27,24 24.5,21.5" fill="#fbbf24" />
      <polygon points="27,26 29.5,28.5 27,28 29.5,21.5" fill="#fbbf24" />

      {/* Cardinal Points (North, South, East, West) */}
      {/* North Point (Guiding Upward) */}
      <polygon points="27,13 29.5,26 27,23.5 24.5,26" fill="#f59e0b" />
      <polygon points="27,13 27,23.5 29.5,26" fill="#d97706" />

      {/* South Point */}
      <polygon points="27,39 29.5,26 27,28.5 24.5,26" fill="#d97706" />
      <polygon points="27,39 27,28.5 24.5,26" fill="#b45309" />

      {/* East Point */}
      <polygon points="40,26 27,28.5 29.5,26 27,23.5" fill="#f59e0b" />
      <polygon points="40,26 29.5,26 27,28.5" fill="#d97706" />

      {/* West Point */}
      <polygon points="14,26 27,28.5 24.5,26 27,23.5" fill="#fbbf24" />
      <polygon points="14,26 24.5,26 27,28.5" fill="#f59e0b" />

      {/* Star Center Jewel Core */}
      <circle cx="27" cy="26" r="2.4" fill="#d97706" />
      <circle cx="27" cy="26" r="1.1" fill="#ffffff" />
    </svg>
  );

  if (variant === 'mark') {
    return <div className={`travelmate-logo-wrapper ${className}`}>{LogoMark}</div>;
  }

  return (
    <div
      className={`travelmate-logo-brand ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}
    >
      <div className="travelmate-logo-mark" style={{ display: 'flex', alignItems: 'center' }}>
        {LogoMark}
      </div>
      <div className="travelmate-logo-text-col" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span
          className="travelmate-brand-name"
          style={{
            fontFamily: "var(--font-display, 'Outfit', 'Inter', sans-serif)",
            fontSize: currentSize.fontSize,
            fontWeight: 850,
            letterSpacing: '-0.03em',
            color: textColor || '#0f172a',
          }}
        >
          Travel<span style={{ color: '#064e3b' }}>Mate</span>
        </span>
        <span
          className="travelmate-brand-sub"
          style={{
            fontSize: currentSize.taglineSize,
            fontWeight: 750,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#64748b',
            marginTop: '3px',
          }}
        >
          NEPAL
        </span>
      </div>
    </div>
  );
}
