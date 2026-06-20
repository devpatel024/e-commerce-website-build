'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, UserRole } from '@/lib/types'
import { getSession, loginUser, registerUser, logoutUser, isAdmin, hasRole } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, name: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAdmin: boolean
  hasRole: (role: UserRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
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

  const login = async (email: string, password: string) => {
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
  }

  const register = async (email: string, name: string, password: string) => {
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
  }

  const logout = () => {
    logoutUser()
    setUser(null)
  }

  const checkIsAdmin = user?.role === 'admin'

  const checkHasRole = (role: UserRole) => {
    return user?.role === role
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    login,
    register,
    logout,
    isAdmin: checkIsAdmin,
    hasRole: checkHasRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
