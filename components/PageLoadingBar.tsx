'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PageLoadingBar() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Listen for navigation events
    let timeout: NodeJS.Timeout

    const handleStart = () => {
      setIsLoading(true)
    }

    const handleStop = () => {
      // Delay hiding to ensure smooth transition
      timeout = setTimeout(() => {
        setIsLoading(false)
      }, 300)
    }

    // Navigation events
    window.addEventListener('routeChangeStart', handleStart)
    window.addEventListener('routeChangeComplete', handleStop)
    window.addEventListener('routeChangeError', handleStop)

    return () => {
      window.removeEventListener('routeChangeStart', handleStart)
      window.removeEventListener('routeChangeComplete', handleStop)
      window.removeEventListener('routeChangeError', handleStop)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <>
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-foreground via-accent to-foreground animate-pulse z-50" />
      )}
    </>
  )
}
