'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)
  const [showBar, setShowBar] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    // Hide on auth pages and admin pages
    const isAuthPage = pathname?.includes('/auth/')
    const isAdminPage = pathname?.includes('/admin/')
    setShowBar(!isAuthPage && !isAdminPage)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(scrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!showBar) return null

  return (
    <div className="fixed top-0 left-0 right-0 h-2 bg-transparent z-50 pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-400 transition-all duration-300 ease-out shadow-lg shadow-green-500/50 animate-progress-glow"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
