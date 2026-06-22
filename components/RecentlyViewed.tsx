'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getRecentlyViewedIds, clearRecentlyViewed } from '@/lib/recently-viewed'
import { getProductById, getProducts } from '@/lib/storage'
import { Product } from '@/lib/types'
import { formatPrice } from '@/lib/price-formatter'
import { X } from 'lucide-react'

export default function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const recentIds = getRecentlyViewedIds()
    if (recentIds.length > 0) {
      const recentProducts = recentIds
        .map(id => getProductById(id))
        .filter((p): p is Product => p !== null)
      setProducts(recentProducts)
    }
    setMounted(true)
  }, [])

  if (!mounted || products.length === 0) return null

  return (
    <section className="py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-heading font-semibold">Recently Viewed</h2>
            <p className="text-muted-foreground mt-1">Products you've been looking at</p>
          </div>
          <button
            onClick={clearRecentlyViewed}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group block transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-60 bg-secondary/30 overflow-hidden rounded-lg mb-3 border border-border/40 group-hover:border-accent/30 group-hover:shadow-lg transition-all duration-300">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-accent transition-colors">
                {product.name}
              </h3>
              <p className="text-sm font-semibold">{formatPrice(product.price)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
