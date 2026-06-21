'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroCarousel from '@/components/HeroCarousel'
import ProductShowcase from '@/components/ProductShowcase'
import TestimonialSection from '@/components/TestimonialSection'
import FAQSection from '@/components/FAQSection'
import TrustBadges from '@/components/TrustBadges'
import FeaturedCollections from '@/components/FeaturedCollections'
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
        {/* Hero Section with Carousel */}
        <HeroCarousel />

        {/* New Arrivals Showcase */}
        <ProductShowcase
          title="New Arrivals"
          description="Discover our latest collection with fresh designs and premium materials"
          products={products.filter(p => p.badge === 'new')}
          badge="new"
          showCount={8}
        />

        {/* Best Sellers Showcase */}
        <ProductShowcase
          title="Best Sellers"
          description="Customer favorites that consistently deliver excellence"
          products={products.filter(p => p.badge === 'bestseller' || p.reviewCount! > 20).sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))}
          badge="bestseller"
          showCount={8}
        />

        {/* Flash Deals Section */}
        <ProductShowcase
          title="Flash Deals"
          description="Limited time offers on selected premium items"
          products={products.filter(p => p.badge === 'sale' || p.originalPrice)}
          badge="sale"
          showCount={8}
        />

        {/* Trending Section */}
        <ProductShowcase
          title="Trending Now"
          description="The hottest items everyone is talking about"
          products={products.filter(p => p.badge === 'trending' || p.rating! >= 4.7).sort((a, b) => (b.rating || 0) - (a.rating || 0))}
          badge="trending"
          showCount={8}
        />

        {/* Trust Badges */}
        <TrustBadges />

        {/* Featured Collections */}
        <FeaturedCollections />

        {/* Testimonials */}
        <TestimonialSection />

        {/* FAQ */}
        <FAQSection />

        {/* Newsletter Signup */}
        <NewsletterSignup />
      </main>

      <Footer />
    </div>
  )
}
