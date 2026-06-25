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
import { ArrowRight } from 'lucide-react'

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

        {/* Asymmetric Showcase Section */}
        <section className="bg-background py-20 sm:py-32 lg:py-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-stretch">
              
              {/* Left Column - Large Image */}
              <div className="lg:col-span-3">
                <Link 
                  href="/products?category=jewellery" 
                  className="group relative overflow-hidden rounded-2xl h-96 sm:h-[480px] lg:h-[560px] flex flex-col justify-end block"
                >
                  <Image
                    src="/category-jewellery.png"
                    alt="Discover the collections"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  
                  {/* Text overlay at bottom */}
                  <div className="relative z-10 p-8 sm:p-12">
                    <p className="text-sm font-medium tracking-widest text-white/80 uppercase mb-3">Premium Collection</p>
                    <h2 className="text-[2.5rem] sm:text-4xl lg:text-5xl font-serif-display leading-tight text-white mb-2">
                      Discover the Collections
                    </h2>
                    <p className="text-white/75 text-sm sm:text-base max-w-md">
                      Curated pieces for those who appreciate quality and artistry
                    </p>
                  </div>
                </Link>
              </div>

              {/* Right Column - Stacked Cards */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                
                {/* Top Card - New Arrivals */}
                <Link 
                  href="/products?category=clothes" 
                  className="group bg-muted hover:bg-muted/80 rounded-2xl p-8 sm:p-10 transition-all duration-300 flex-1 flex flex-col justify-between relative overflow-hidden"
                >
                  <div>
                    <p className="text-xs font-medium tracking-widest text-foreground/60 uppercase mb-4">New Arrivals</p>
                    <h3 className="text-2xl sm:text-3xl font-serif-display text-foreground mb-2 leading-tight">
                      Fashion Essentials
                    </h3>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                      Contemporary designs for the modern wardrobe
                    </p>
                  </div>

                  {/* Layered Images Background */}
                  <div className="mt-8 relative h-40 -mx-8 -mb-8 sm:-mx-10 sm:-mb-10">
                    <div className="absolute inset-0 flex items-end justify-center gap-4 px-4 sm:px-6">
                      <div className="relative w-24 h-32 rounded-lg overflow-hidden shadow-lg bg-white">
                        <Image
                          src="/category-clothes.png"
                          alt="Fashion"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="relative w-24 h-32 rounded-lg overflow-hidden shadow-lg bg-white transform translate-y-4">
                        <Image
                          src="/category-jewellery.png"
                          alt="Collection"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Bottom Card - Featured */}
                <Link 
                  href="/products?badge=sale" 
                  className="group bg-secondary hover:bg-secondary/90 rounded-2xl p-8 sm:p-10 transition-all duration-300 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="text-xs font-medium tracking-widest text-foreground/60 uppercase mb-2">Limited Offer</p>
                    <p className="text-lg sm:text-xl text-foreground font-medium">
                      Exclusive Sales
                    </p>
                  </div>
                  <div className="ml-4 p-3 rounded-full bg-accent text-white group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <NewsletterSignup />
      </main>

      <Footer />
    </div>
  )
}
