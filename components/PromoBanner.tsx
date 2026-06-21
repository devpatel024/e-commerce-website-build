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
    <div className="bg-gradient-to-r from-accent via-purple-600 to-pink-600 text-white animate-slide-down">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="font-semibold text-sm sm:text-base">{title}</p>
            <p className="text-xs sm:text-sm text-white/90">{message}</p>
          </div>

          {ctaText && ctaHref && (
            <a
              href={ctaHref}
              className="px-4 py-2 bg-white text-accent font-semibold rounded hover:bg-white/90 transition-colors whitespace-nowrap text-sm"
            >
              {ctaText}
            </a>
          )}

          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Close banner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
