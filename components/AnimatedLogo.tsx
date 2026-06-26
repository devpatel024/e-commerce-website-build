'use client'

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
}

export default function AnimatedLogo({ size = 'medium' }: LogoProps) {
  const sizeMap = {
    small: { width: 60, height: 60, fontSize: 24, padding: 12 },
    medium: { width: 100, height: 100, fontSize: 40, padding: 16 },
    large: { width: 160, height: 160, fontSize: 64, padding: 24 },
  }

  const config = sizeMap[size]

  return (
    <div
      className="flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold tracking-tighter drop-shadow-md hover:shadow-lg transition-all duration-300"
      style={{
        width: `${config.width}px`,
        height: `${config.height}px`,
        fontSize: `${config.fontSize}px`,
        padding: `${config.padding}px`,
      }}
    >
      AD
    </div>
  )
}
