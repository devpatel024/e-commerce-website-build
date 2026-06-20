'use client'

import { useState } from 'react'
import { AuthForm } from '@/components/auth-form'
import Link from 'next/link'

export default function LoginPageContent() {
  const [userType, setUserType] = useState<'user' | 'admin' | null>(null)

  if (!userType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl font-bold mb-2 text-foreground">Luxe</h1>
            <p className="text-muted-foreground">Premium Fashion & Jewellery</p>
          </div>

          <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
            <h2 className="font-heading text-2xl font-semibold mb-6 text-center text-foreground">
              Welcome Back
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Choose how you&apos;d like to login
            </p>

            <div className="space-y-4">
              <button
                onClick={() => setUserType('user')}
                className="w-full bg-foreground text-background py-3 px-4 font-semibold hover:bg-accent hover:text-white transition-colors rounded-md"
              >
                Login as Customer
              </button>

              <button
                onClick={() => setUserType('admin')}
                className="w-full bg-secondary text-foreground py-3 px-4 font-semibold hover:bg-accent hover:text-white transition-colors rounded-md border border-border"
              >
                Login as Admin
              </button>
            </div>

            <div className="mt-8 text-center text-sm">
              <p className="text-muted-foreground mb-2">Demo Admin Credentials:</p>
              <p className="font-mono text-xs bg-secondary/50 p-2 rounded">
                Email: admin@example.com
              </p>
              <p className="font-mono text-xs bg-secondary/50 p-2 rounded mt-1">
                Password: Admin@123
              </p>
            </div>

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/sign-up" className="text-accent font-semibold hover:underline">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <button
            onClick={() => setUserType(null)}
            className="mb-4 text-muted-foreground hover:text-foreground text-sm font-semibold"
          >
            ← Back
          </button>
          <h1 className="font-heading text-4xl font-bold mb-2 text-foreground">Luxe</h1>
          <p className="text-muted-foreground">
            {userType === 'admin' ? 'Admin Login' : 'Customer Login'}
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
          <AuthForm mode="sign-in" isAdmin={userType === 'admin'} />
        </div>
      </div>
    </div>
  )
}
