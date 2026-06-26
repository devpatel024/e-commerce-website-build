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
    <div 
      className="fixed top-0 left-0 right-0 h-2 z-50 pointer-events-none" 
      style={{ 
        backgroundColor: 'var(--accent)',
        color: 'rgba(250, 250, 250, 0)',
        borderColor: '#6B7152',
        borderBottom: '1px solid #6B7152'
      }}
    >
      <div
        className="h-full transition-all duration-300 ease-out"
        style={{ 
          width: `${progress}%`,
          backgroundColor: '#6B7152'
        }}
      />
    </div>
  )
}
