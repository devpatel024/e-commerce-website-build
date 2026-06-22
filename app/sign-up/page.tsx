'use client'

import { redirect } from 'next/navigation'
import { useAuthContext } from '@/components/AuthProvider'
import Link from 'next/link'

export default function SignUpPage() {
  const { user, isLoading } = useAuthContext()

  if (!isLoading && user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground">Please use the login page to create your account</p>
        </div>
        <div className="text-center">
          <Link href="/auth/login" className="text-foreground font-semibold hover:underline">
            Go to Login Page
          </Link>
        </div>
      </div>
    </div>
  )
}
