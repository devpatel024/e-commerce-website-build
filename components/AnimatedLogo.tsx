'use client'

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
}

export default function AnimatedLogo({ size = 'small' }: LogoProps) {
  const sizeMap = {
    small: { width: 48, height: 48, viewBox: '0 0 48 48' },
    medium: { width: 64, height: 64, viewBox: '0 0 64 64' },
    large: { width: 96, height: 96, viewBox: '0 0 96 96' },
  }

  const config = sizeMap[size]

  return (
    <svg
      width={config.width}
      height={config.height}
      viewBox={config.viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hover:opacity-80 transition-opacity duration-300"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8A5F41" />
          <stop offset="100%" stopColor="#CCD67F" />
        </linearGradient>
      </defs>

      {/* Letter A */}
      <g>
        {/* Left diagonal */}
        <line x1="8" y1="40" x2="16" y2="8" stroke="url(#logoGradient)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Right diagonal */}
        <line x1="24" y1="8" x2="32" y2="40" stroke="url(#logoGradient)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Horizontal bar */}
        <line x1="10" y1="28" x2="30" y2="28" stroke="url(#logoGradient)" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Letter D */}
      <g>
        {/* Vertical line */}
        <line x1="36" y1="8" x2="36" y2="40" stroke="#8A5F41" strokeWidth="2.5" strokeLinecap="round" />
        {/* Top curve */}
        <path d="M 36 8 Q 48 8 48 16 Q 48 24 42 24" stroke="#8A5F41" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Bottom curve */}
        <path d="M 36 24 Q 48 24 48 32 Q 48 40 36 40" stroke="#8A5F41" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </g>

      {/* Accent dot */}
      <circle cx="20" cy="44" r="1.5" fill="#CCD67F" />
    </svg>
  )
}
