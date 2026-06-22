'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getProducts } from '@/lib/storage'
import { Product } from '@/lib/types'
import { formatPrice } from '@/lib/price-formatter'

interface RelatedProductsProps {
  product: Product
  limit?: number
}

export default function RelatedProducts({ product, limit = 4 }: RelatedProductsProps) {
  const relatedProducts = useMemo(() => {
    const allProducts = getProducts()
    
    // Find products with same category or subcategory, excluding current product
    const related = allProducts.filter(p => 
      p.id !== product.id && (
        p.category === product.category ||
        p.subcategory === product.subcategory
      )
    )
    
    // Sort by similarity and limit
    return related.slice(0, limit)
  }, [product, limit])

  if (relatedProducts.length === 0) return null

  return (
    <section className="py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-semibold mb-8">You Might Also Like</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map(relProduct => (
            <Link
              key={relProduct.id}
              href={`/product/${relProduct.id}`}
              className="group block transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-60 bg-secondary/30 overflow-hidden rounded-lg mb-3 border border-border/40 group-hover:border-accent/30 group-hover:shadow-lg transition-all duration-300">
                <Image
                  src={relProduct.image}
                  alt={relProduct.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {relProduct.stock === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <p className="text-white font-semibold text-sm">Out of Stock</p>
                  </div>
                )}
              </div>
              <h3 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-accent transition-colors">
                {relProduct.name}
              </h3>
              <p className="text-sm text-muted-foreground capitalize mb-2">
                {relProduct.subcategory}
              </p>
              <p className="text-sm font-semibold">{formatPrice(relProduct.price)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
