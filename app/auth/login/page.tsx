'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuthContext } from '@/components/AuthProvider'
import { Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

const AnimatedLogo = dynamic(() => import('@/components/AnimatedLogo'), { ssr: true })

type AuthTab = 'user-login' | 'user-register' | 'admin-login'

function AuthPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading, login, register } = useAuthContext()
  const [activeTab, setActiveTab] = useState<AuthTab>('user-login')
  const returnTo = searchParams.get('returnTo')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Redirect if already logged in
    if (!isLoading && user) {
      // If user is admin, always go to admin dashboard
      if (user.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        // For regular users, go to returnTo if specified, otherwise home
        const destination = returnTo && (returnTo.startsWith('/') || returnTo.startsWith('http'))
          ? returnTo
          : '/'
        router.push(destination)
      }
    }
  }, [user, isLoading, router, returnTo])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const result = await login(formData.email, formData.password)
      if (result.success) {
        router.push('/')
      } else {
        setError(result.error || 'Login failed')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUserRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await register(formData.email, formData.name, formData.password)
      if (result.success) {
        router.push('/')
      } else {
        setError(result.error || 'Registration failed')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // Admin login with demo credentials
      const result = await login('admin@luxe.com', formData.password)
      if (result.success) {
        router.push('/admin/dashboard')
      } else {
        setError(result.error || 'Invalid admin password')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <AnimatedLogo size="small" />
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-md">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-border">
            <button
              onClick={() => {
                setActiveTab('user-login')
                setError('')
                setFormData({ email: '', password: '', name: '', confirmPassword: '' })
              }}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'user-login'
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Customer Login
            </button>
            <button
              onClick={() => {
                setActiveTab('user-register')
                setError('')
                setFormData({ email: '', password: '', name: '', confirmPassword: '' })
              }}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'user-register'
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Create Account
            </button>
            <button
              onClick={() => {
                setActiveTab('admin-login')
                setError('')
                setFormData({ email: '', password: '', name: '', confirmPassword: '' })
              }}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'admin-login'
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Admin Access
            </button>
          </div>

          {/* User Login Tab */}
          {activeTab === 'user-login' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold font-heading mb-2">Welcome Back</h1>
                <p className="text-muted-foreground">Sign in to your account to continue shopping</p>
              </div>

              <form onSubmit={handleUserLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="customer@example.com"
                    className="w-full px-4 py-2 border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-foreground text-background py-2 font-semibold hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="text-center text-xs text-muted-foreground space-y-1">
                <p>Demo credentials:</p>
                <p>Email: <span className="font-semibold">customer@example.com</span></p>
                <p>Password: <span className="font-semibold">user123</span></p>
              </div>
            </div>
          )}

          {/* User Register Tab */}
          {activeTab === 'user-register' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold font-heading mb-2">Create Account</h1>
                <p className="text-muted-foreground">Join ADs to access exclusive collections</p>
              </div>

              <form onSubmit={handleUserRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className="w-full px-4 py-2 border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="At least 6 characters"
                    className="w-full px-4 py-2 border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-2 border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-foreground text-background py-2 font-semibold hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            </div>
          )}

          {/* Admin Login Tab */}
          {activeTab === 'admin-login' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold font-heading mb-2">ADs Admin Portal</h1>
                <p className="text-muted-foreground">Access restricted admin features</p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Admin Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter admin password"
                    className="w-full px-4 py-2 border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-foreground text-background py-2 font-semibold hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? 'Verifying...' : 'Admin Login'}
                </button>
              </form>

              <div className="text-center text-xs text-muted-foreground space-y-1">
                <p>Demo credentials:</p>
                <p>Password: <span className="font-semibold">admin123</span></p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 ADs. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPageContent />
    </Suspense>
  )
}
