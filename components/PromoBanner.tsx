'use client'

import { X } from 'lucide-react'
import { useState } from 'react'

interface PromoBannerProps {
  title: string
  message: string
  ctaText?: string
  ctaHref?: string
}

export default function PromoBanner({
  title,
  message,
  ctaText,
  ctaHref,
}: PromoBannerProps) {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) return null

  return (
    <div className="bg-background animate-slide-down" style={{ visibility: 'hidden' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="font-semibold text-sm sm:text-base" style={{ color: '#6B8E23' }}>{title}</p>
            <p className="text-xs sm:text-sm" style={{ color: '#6B8E23' }}>{message}</p>
          </div>

          {ctaText && ctaHref && (
            <a
              href={ctaHref}
              className="px-4 py-2 font-semibold rounded hover:opacity-90 transition-opacity whitespace-nowrap text-sm"
              style={{ backgroundColor: '#6B8E23', color: '#ffffff' }}
            >
              {ctaText}
            </a>
          )}

          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded transition-colors hover:opacity-80"
            style={{ color: '#6B8E23' }}
            aria-label="Close banner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
