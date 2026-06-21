'use client'

import { Shield, Truck, RefreshCw, Award, Lock, Zap } from 'lucide-react'

interface Badge {
  icon: React.ReactNode
  title: string
  description: string
}

const badges: Badge[] = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: '100% Authentic',
    description: 'All products guaranteed authentic and genuine',
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: 'Free Shipping',
    description: 'Free delivery on orders above ₹500',
  },
  {
    icon: <RefreshCw className="w-8 h-8" />,
    title: '30 Days Return',
    description: 'Hassle-free returns within 30 days',
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: 'Secure Payment',
    description: 'Encrypted and secure payment processing',
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: 'Premium Quality',
    description: 'Hand-picked premium products',
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Fast Delivery',
    description: 'Quick delivery to your doorstep',
  },
]

export default function TrustBadges() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-accent/5 via-secondary/5 to-purple-600/5">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className={`flex gap-4 p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-300 animate-fade-in`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                {badge.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{badge.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
