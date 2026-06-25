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
            <Link href="/products?category=jewellery" className="group relative overflow-hidden rounded-lg h-96 flex items-center justify-center hover:shadow-lg transition-all duration-300">
              <Image 
                src="/category-jewellery.png" 
                alt="Jewellery Collection"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />
              <div className="relative z-10 text-center px-6">
                <h2 className="font-heading text-4xl md:text-5xl font-light text-white mb-2">Jewellery</h2>
                <p className="text-white/85 text-sm md:text-base mb-6 font-light">Elegant pieces crafted with precision</p>
                <button className="inline-block bg-white text-black px-8 py-3 font-semibold hover:bg-accent transition-all duration-300 shadow-lg">
                  Explore Collection
                </button>
              </div>
            </Link>

            {/* Clothes Banner */}
            <Link href="/products?category=clothes" className="group relative overflow-hidden rounded-lg h-96 flex items-center justify-center hover:shadow-lg transition-all duration-300">
              <Image 
                src="/category-clothes.png" 
                alt="Clothes Collection"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />
              <div className="relative z-10 text-center px-6">
                <h2 className="font-heading text-4xl md:text-5xl font-light text-white mb-2">Clothes</h2>
                <p className="text-white/85 text-sm md:text-base mb-6 font-light">Contemporary styles for modern living</p>
                <button className="inline-block bg-white text-black px-8 py-3 font-semibold hover:bg-accent transition-all duration-300 shadow-lg">
                  Explore Collection
                </button>
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
