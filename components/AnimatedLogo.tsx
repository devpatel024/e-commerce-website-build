'use client'

import { useEffect, useRef } from 'react'

interface AnimatedLogoProps {
  size?: 'small' | 'medium' | 'large'
  animated?: boolean
}

export default function AnimatedLogo({ size = 'medium', animated = true }: AnimatedLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const timeRef = useRef<number>(0)

  const sizeMap = {
    small: { width: 40, height: 40, fontSize: 16 },
    medium: { width: 80, height: 80, fontSize: 32 },
    large: { width: 160, height: 160, fontSize: 64 },
  }

  const { width, height, fontSize } = sizeMap[size]

  // Modern color palette
  const colors = {
    primary: '#8A5F41',
    secondary: '#A77F60',
    accent: '#CCD67F',
    light: '#F3E4C9',
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = width
    canvas.height = height
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      if (animated) {
        timeRef.current += 0.015
      }

      const time = timeRef.current
      const centerX = width / 2
      const centerY = height / 2
      const baseRadius = width / 3.5

      // Draw rotating outer ring with gradient effect
      const ringRotation = time * 0.3
      for (let i = 0; i < 3; i++) {
        const angle = ringRotation + (Math.PI * 2 * i) / 3
        const opacity = 0.3 + Math.sin(time * 1.5 + i) * 0.2
        
        ctx.strokeStyle = `rgba(138, 95, 65, ${opacity})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(centerX, centerY, baseRadius + i * 3, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Draw animated pulsing circle
      const pulseScale = 1 + Math.sin(time * 2) * 0.15
      ctx.strokeStyle = `rgba(204, 214, 127, ${0.6 + Math.sin(time * 2.5) * 0.2})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(centerX, centerY, baseRadius * 0.6 * pulseScale, 0, Math.PI * 2)
      ctx.stroke()

      // Draw "AD" text with modern styling
      ctx.font = `600 ${fontSize}px 'Geist', sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = colors.primary
      ctx.fillText('AD', centerX, centerY)

      // Add accent underline with animation
      const textWidth = ctx.measureText('AD').width
      const lineY = centerY + fontSize * 0.4
      const lineWidth = textWidth * (0.5 + Math.sin(time * 1.5) * 0.2)
      
      ctx.fillStyle = `rgba(204, 214, 127, ${0.5 + Math.sin(time * 2) * 0.3})`
      ctx.fillRect(centerX - lineWidth / 2, lineY, lineWidth, 2)

      // Draw rotating dots around the logo
      const dotRadius = baseRadius * 1.3
      for (let i = 0; i < 3; i++) {
        const angle = time * 0.8 + (Math.PI * 2 * i) / 3
        const dotX = centerX + Math.cos(angle) * dotRadius
        const dotY = centerY + Math.sin(angle) * dotRadius
        const dotOpacity = 0.4 + Math.sin(time * 2.5 + i) * 0.3

        ctx.fillStyle = `rgba(167, 127, 96, ${dotOpacity})`
        ctx.beginPath()
        ctx.arc(dotX, dotY, 2, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw corner accent rectangles with rotation
      const cornerRotation = time * 0.5
      const cornerSize = 4
      const cornerDistance = baseRadius * 1.1

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(cornerRotation)

      for (let i = 0; i < 4; i++) {
        const angle = (Math.PI / 2) * i
        const x = Math.cos(angle) * cornerDistance
        const y = Math.sin(angle) * cornerDistance
        const opacity = 0.4 + Math.sin(time * 2 + i) * 0.3

        ctx.fillStyle = `rgba(204, 214, 127, ${opacity})`
        ctx.fillRect(x - cornerSize / 2, y - cornerSize / 2, cornerSize, cornerSize)
      }

      ctx.restore()

      if (animated) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [width, height, fontSize, animated])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-lg"
      style={{
        filter: animated ? 'drop-shadow(0 4px 12px rgba(138, 95, 65, 0.15))' : 'none',
      }}
    />
  )
}
