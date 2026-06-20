'use client'

import { useState, useEffect, useCallback } from 'react'
import { User, UserRole } from '@/lib/types'
import { getSession, loginUser, registerUser, logoutUser, isAdmin, hasRole } from '@/lib/auth'

interface UseAuthReturn {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, name: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  hasRole: (role: UserRole) => boolean
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load session on mount
  useEffect(() => {
    const session = getSession()
    if (session) {
      setUser(session.user)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const result = loginUser(email, password)
      if (result.success && result.session) {
        setUser(result.session.user)
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (email: string, name: string, password: string) => {
    setIsLoading(true)
    try {
      const result = registerUser(email, name, password)
      if (result.success && result.session) {
        setUser(result.session.user)
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    logoutUser()
    setUser(null)
  }, [])

  const checkIsAdmin = useCallback(() => {
    return isAdmin()
  }, [])

  const checkHasRole = useCallback((role: UserRole) => {
    return hasRole(role)
  }, [])

  return {
    user,
    isLoading,
    isAuthenticated: user !== null,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    hasRole: checkHasRole,
  }
}
