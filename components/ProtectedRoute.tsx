'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from './AuthProvider'
import { UserRole } from '@/lib/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter()
  const { user, isLoading } = useAuthContext()

  useEffect(() => {
    if (!isLoading) {
      // Check if user is authenticated
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Check if user has required role
      if (requiredRole && user.role !== requiredRole) {
        router.push('/')
        return
      }
    }
  }, [user, isLoading, requiredRole, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-border border-t-foreground rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show access denied if user doesn't have required role
  if (user && requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don&apos;t have permission to access this page.</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-foreground text-background hover:bg-accent transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
