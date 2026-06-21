'use client'

import { useState } from 'react'
import { Mail, Check } from 'lucide-react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      setEmail('')
      setTimeout(() => setSubmitted(false), 3000)
    }, 800)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-accent via-purple-600 to-accent">
      <div className="mx-auto max-w-2xl text-center">
        {/* Content */}
        <div className="mb-8 animate-fade-in">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Get Exclusive Offers
          </h2>
          <p className="text-white/80 text-lg">
            Subscribe to our newsletter and receive early access to new collections, special discounts, and insider tips.
          </p>
        </div>

        {/* Newsletter Form */}
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto animate-fade-in delay-100">
          <div className="flex-1 relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-foreground text-white font-semibold rounded-lg hover:bg-white hover:text-accent transition-all duration-300 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </>
            ) : submitted ? (
              <>
                <Check className="w-4 h-4" />
                Subscribed
              </>
            ) : (
              'Subscribe'
            )}
          </button>
        </form>

        {/* Success Message */}
        {submitted && (
          <div className="mt-4 animate-slide-up">
            <p className="text-white font-semibold">
              Welcome to our exclusive club! Check your email for special welcome offer.
            </p>
          </div>
        )}

        {/* Terms */}
        <p className="text-white/60 text-xs mt-4">
          We&apos;ll never share your information. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}
