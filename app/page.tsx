'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroCarousel from '@/components/HeroCarousel'
import NewsletterSignup from '@/components/NewsletterSignup'
import PromoBanner from '@/components/PromoBanner'
import { getProducts, initializeStorage } from '@/lib/storage'
import { Product } from '@/lib/types'
import { formatPrice } from '@/lib/price-formatter'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    initializeStorage()
    setProducts(getProducts())
  }, [])

  const jewelleryProducts = products.filter(p => p.category === 'jewellery').slice(0, 4)
  const clothesProducts = products.filter(p => p.category === 'clothes').slice(0, 4)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PromoBanner
        title="Summer Sale"
        message="Get up to 50% off on selected items. Limited time offer!"
        ctaText="Shop Now"
        ctaHref="/products?badge=sale"
      />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroCarousel />

        {/* Category Banners */}
        <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Jewellery Banner */}
            <Link href="/products?category=jewellery" className="group relative overflow-hidden rounded-lg h-96 bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />
              <div className="relative z-10 text-center px-6">
                <h2 className="font-heading text-5xl font-bold text-foreground mb-3">Jewellery</h2>
                <p className="text-muted-foreground text-lg mb-6">Elegant pieces crafted with precision</p>
                <div className="inline-block bg-foreground text-background px-8 py-3 font-semibold hover:bg-accent transition-colors">
                  Explore Collection
                </div>
              </div>
            </Link>

            {/* Clothes Banner */}
            <Link href="/products?category=clothes" className="group relative overflow-hidden rounded-lg h-96 bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />
              <div className="relative z-10 text-center px-6">
                <h2 className="font-heading text-5xl font-bold text-foreground mb-3">Clothes</h2>
                <p className="text-muted-foreground text-lg mb-6">Contemporary styles for modern living</p>
                <div className="inline-block bg-foreground text-background px-8 py-3 font-semibold hover:bg-accent transition-colors">
                  Explore Collection
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Newsletter Signup */}
        <NewsletterSignup />
      </main>

      <Footer />
    </div>
  )
}
