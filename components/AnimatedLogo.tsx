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
    small: { width: 40, height: 40, fontSize: 20 },
    medium: { width: 80, height: 80, fontSize: 40 },
    large: { width: 160, height: 160, fontSize: 80 },
  }

  const { width, height, fontSize } = sizeMap[size]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    // Set up canvas styling
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'transparent'
      ctx.clearRect(0, 0, width, height)

      if (animated) {
        timeRef.current += 0.02
      }

      const time = timeRef.current
      const centerX = width / 2
      const centerY = height / 2

      // Draw decorative circles (old money aesthetic)
      const circleRadius = width / 2 - 5
      ctx.strokeStyle = `rgba(120, 119, 98, ${0.3 + Math.sin(time * 2) * 0.15})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2)
      ctx.stroke()

      // Draw inner accent circle
      ctx.strokeStyle = `rgba(140, 130, 90, ${0.4 + Math.sin(time * 1.5) * 0.2})`
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.arc(centerX, centerY, circleRadius - 8, 0, Math.PI * 2)
      ctx.stroke()

      // Draw "AD" text with elegant styling
      ctx.font = `bold ${fontSize}px 'Garamond', 'Georgia', serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Main text with shadow
      ctx.fillStyle = `rgba(0, 0, 0, ${0.85 + Math.sin(time) * 0.1})`
      ctx.shadowColor = `rgba(184, 165, 118, ${0.3 + Math.sin(time * 2.5) * 0.2})`
      ctx.shadowBlur = 3 + Math.sin(time) * 1
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 1
      ctx.fillText('AD', centerX, centerY)

      // Reset shadow
      ctx.shadowColor = 'transparent'

      // Draw decorative elements
      const dotSize = 2
      ctx.fillStyle = `rgba(140, 130, 90, ${0.5 + Math.sin(time * 3) * 0.3})`

      // Top dot
      const topY = centerY - (fontSize / 2 + 15)
      ctx.fillRect(centerX - dotSize / 2, topY, dotSize, dotSize)

      // Bottom dot
      const bottomY = centerY + (fontSize / 2 + 15)
      ctx.fillRect(centerX - dotSize / 2, bottomY, dotSize, dotSize)

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
        filter: animated ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' : 'none',
      }}
    />
  )
}
