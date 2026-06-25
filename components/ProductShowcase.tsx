'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product, ProductBadge } from '@/lib/types'
import { formatPrice } from '@/lib/price-formatter'
import { Heart, Zap, Star, TrendingUp } from 'lucide-react'

interface ProductShowcaseProps {
  title: string
  description?: string
  products: Product[]
  badge?: ProductBadge
  showCount?: number
}

export default function ProductShowcase({
  title,
  description,
  products,
  badge,
  showCount = 8,
}: ProductShowcaseProps) {
  const displayProducts = products.slice(0, showCount)

  const getBadgeIcon = (badgeType?: ProductBadge) => {
    switch (badgeType) {
      case 'new':
        return <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">NEW</span>
      case 'bestseller':
        return <span className="px-2 py-1 text-white text-xs font-bold rounded-full" style={{ backgroundColor: 'var(--green-primary)' }}>BESTSELLER</span>
      case 'sale':
        return <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-full">SALE</span>
      case 'trending':
        return <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">TRENDING</span>
      case 'limited':
        return <span className="px-2 py-1 bg-orange-600 text-white text-xs font-bold rounded-full">LIMITED</span>
      case 'exclusive':
        return <span className="px-2 py-1 bg-pink-600 text-white text-xs font-bold rounded-full">EXCLUSIVE</span>
      default:
        return null
    }
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-secondary/5">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            {badge === 'trending' && <TrendingUp className="w-6 h-6 text-accent" />}
            {badge === 'sale' && <Zap className="w-6 h-6 text-red-600" />}
            {badge === 'new' && <Star className="w-6 h-6 text-blue-600" />}
            <h2 className="font-heading text-3xl md:text-4xl font-bold">{title}</h2>
          </div>
          {description && (
            <p className="text-muted-foreground text-lg max-w-2xl">{description}</p>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {displayProducts.map((product, idx) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group"
            >
              <div
                className={`relative h-72 bg-secondary/30 overflow-hidden rounded-lg mb-4 animate-fade-in`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 left-4 z-10">
                    {getBadgeIcon(product.badge)}
                  </div>
                )}

                {/* Wishlist Heart */}
                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors shadow-lg">
                    <Heart className="w-5 h-5 text-red-600" />
                  </button>
                </div>

                {/* Discount Badge if Sale */}
                {product.originalPrice && product.badge === 'sale' && (
                  <div className="absolute bottom-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}
                    %
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div>
                <h3 className="font-heading text-lg font-semibold mb-1 group-hover:text-accent transition-colors duration-300 line-clamp-2">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 mb-2">
                  {product.rating && (
                    <div className="flex items-center gap-1">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(product.rating || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({product.reviewCount || 0})
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-muted-foreground text-sm mb-3 line-clamp-1">
                  {product.subcategory}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">
                      {formatPrice(product.price)}
                    </p>
                    {product.originalPrice && (
                      <p className="text-xs text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </p>
                    )}
                  </div>

                  {product.stock <= 3 && product.stock > 0 && (
                    <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded">
                      Only {product.stock} left
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center animate-fade-in">
          <Link
            href="/products"
            className="inline-block bg-foreground text-background px-8 py-3 font-semibold hover:bg-accent hover:text-white transition-all duration-300 rounded-lg hover:shadow-lg hover:scale-105"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  )
}
