'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroCarousel from '@/components/HeroCarousel'
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
      <Header />

      <main className="flex-1">
        {/* Hero Section with Carousel */}
        <HeroCarousel />

        {/* Featured Jewellery Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="font-heading text-4xl font-bold mb-2">Jewellery</h2>
            <p className="text-muted-foreground">Elegant pieces crafted with precision and passion</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {jewelleryProducts.map((product, idx) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group"
              >
                <div className={`relative h-72 bg-secondary/30 overflow-hidden mb-4 animate-fade-in delay-${idx * 100}`}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-1 group-hover:text-accent transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-3">{product.subcategory}</p>
                <p className="font-semibold text-foreground">{formatPrice(product.price)}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/products?category=jewellery"
              className="inline-block border border-foreground text-foreground px-6 py-2 font-medium hover:bg-foreground hover:text-background transition-colors"
            >
              View All Jewellery
            </Link>
          </div>
        </section>

        {/* Featured Clothes Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border">
          <div className="mb-12">
            <h2 className="font-heading text-4xl font-bold mb-2">Clothes</h2>
            <p className="text-muted-foreground">Premium apparel for the discerning fashionista</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {clothesProducts.map((product, idx) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group"
              >
                <div className={`relative h-72 bg-secondary/30 overflow-hidden mb-4 animate-fade-in delay-${idx * 100}`}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-1 group-hover:text-accent transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-3">{product.subcategory}</p>
                <p className="font-semibold text-foreground">{formatPrice(product.price)}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/products?category=clothes"
              className="inline-block border border-foreground text-foreground px-6 py-2 font-medium hover:bg-foreground hover:text-background transition-colors"
            >
              View All Clothes
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
