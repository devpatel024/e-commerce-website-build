'use client'

import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductShowcase from '@/components/ProductShowcase'
import { getProducts, initializeStorage } from '@/lib/storage'
import { useEffect, useState } from 'react'

interface CollectionInfo {
  name: string
  description: string
  slug: string
}

const collectionsInfo: Record<string, CollectionInfo> = {
  'summer-elegance': {
    name: 'Summer Elegance',
    description: 'Light, breezy pieces perfect for warm seasons and sunny destinations.',
    slug: 'summer-elegance'
  },
  'winter-luxe': {
    name: 'Winter Luxe',
    description: 'Rich, sophisticated pieces designed for the cold season.',
    slug: 'winter-luxe'
  },
  'minimalist-chic': {
    name: 'Minimalist Chic',
    description: 'Clean lines and understated elegance for the modern aesthetic.',
    slug: 'minimalist-chic'
  },
  'vintage-revival': {
    name: 'Vintage Revival',
    description: 'Timeless pieces inspired by classic designs and retro aesthetics.',
    slug: 'vintage-revival'
  },
}

export default function CollectionDetail() {
  const params = useParams()
  const slug = params.slug as string
  const collectionInfo = collectionsInfo[slug]
  const [products, setProducts] = useState([])

  useEffect(() => {
    initializeStorage()
    // For demo, show all products. In production, filter by collection
    const allProducts = getProducts()
    setProducts(allProducts)
  }, [])

  if (!collectionInfo) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-3xl font-bold mb-4">Collection Not Found</h1>
            <p className="text-muted-foreground">The collection you&apos;re looking for doesn&apos;t exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-5xl md:text-6xl font-light mb-6 text-foreground">
              {collectionInfo.name}
            </h1>
            <p className="text-lg text-muted-foreground">
              {collectionInfo.description}
            </p>
          </div>
        </section>

        {/* Products Section */}
        {products.length > 0 && (
          <ProductShowcase
            title="Collection Items"
            products={products}
            showCount={12}
          />
        )}
      </main>

      <Footer />
    </div>
  )
}
