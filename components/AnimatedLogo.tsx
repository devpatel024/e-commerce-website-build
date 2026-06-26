'use client'

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
}

export default function AnimatedLogo({ size = 'medium' }: LogoProps) {
  const sizeMap = {
    small: { width: 48, height: 48, viewBox: '0 0 64 64' },
    medium: { width: 64, height: 64, viewBox: '0 0 64 64' },
    large: { width: 96, height: 96, viewBox: '0 0 64 64' },
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
      {/* Rounded Square Background */}
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="#8A5F41" />
      
      {/* Decorative corner accents */}
      <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="url(#bgGradient)" opacity="0.15" />

      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#CCD67F" />
          <stop offset="100%" stopColor="#A77F60" />
        </linearGradient>
      </defs>

      {/* Letter A - Modern geometric style */}
      <g>
        {/* Left stroke of A */}
        <path d="M 18 44 L 28 14" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        {/* Right stroke of A */}
        <path d="M 38 14 L 28 44" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        {/* Horizontal bar of A */}
        <path d="M 20 30 L 36 30" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Letter D - Overlapped with A */}
      <g>
        {/* Vertical line of D */}
        <path d="M 38 14 L 38 44" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        {/* Top curve of D */}
        <path d="M 38 14 Q 50 14 50 24 Q 50 30 46 30" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Bottom curve of D */}
        <path d="M 38 30 Q 50 30 50 40 Q 50 44 38 44" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      {/* Accent highlight */}
      <circle cx="52" cy="20" r="1.5" fill="#CCD67F" opacity="0.8" />
    </svg>
  )
}
