'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  getWishlist,
  getFavorites,
  getProducts,
  getProductById,
  removeFromWishlist,
  removeFromFavorites,
  initializeStorage,
} from '@/lib/storage'
import { Product } from '@/lib/types'
import { formatPrice } from '@/lib/price-formatter'
import { Heart, Star, Trash2, ArrowRight } from 'lucide-react'

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'wishlist' | 'favorites' | 'recently-viewed'>('wishlist')
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([])
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])

  useEffect(() => {
    initializeStorage()
    const products = getProducts()
    setAllProducts(products)

    const wishlistIds = getWishlist()
    const wishlistProds = wishlistIds
      .map(id => getProductById(id))
      .filter(Boolean) as Product[]
    setWishlistProducts(wishlistProds)

    const favoriteIds = getFavorites()
    const favoriteProds = favoriteIds
      .map(id => getProductById(id))
      .filter(Boolean) as Product[]
    setFavoriteProducts(favoriteProds)
  }, [])

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId)
    setWishlistProducts(
      wishlistProducts.filter(p => p.id !== productId)
    )
  }

  const handleRemoveFromFavorites = (productId: string) => {
    removeFromFavorites(productId)
    setFavoriteProducts(
      favoriteProducts.filter(p => p.id !== productId)
    )
  }

  const ProductCard = ({
    product,
    onRemove,
  }: {
    product: Product
    onRemove: (id: string) => void
  }) => (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-60 bg-secondary/30 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.badge && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-accent text-white text-xs font-bold rounded-full">
            {product.badge}
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1 uppercase">
          {product.subcategory}
        </p>
        <h3 className="font-semibold text-sm mb-2 line-clamp-2">
          {product.name}
        </h3>

        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.round(product.rating || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-lg">
            {formatPrice(product.price)}
          </p>
          {product.originalPrice && (
            <p className="text-xs text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            href={`/product/${product.id}`}
            className="flex-1 py-2 bg-foreground text-background text-xs font-semibold rounded hover:bg-accent transition-colors text-center"
          >
            View
          </Link>
          <button
            onClick={() => onRemove(product.id)}
            className="p-2 border border-border rounded hover:border-red-600 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 animate-fade-in">
            <h1 className="font-heading text-4xl font-bold mb-2">My Account</h1>
            <p className="text-muted-foreground text-lg">
              Manage your wishlist, favorites, and preferences
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-border overflow-x-auto animate-fade-in delay-100">
            {['wishlist', 'favorites', 'recently-viewed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-4 font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'text-accent border-b-2 border-accent'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'wishlist' && 'Wishlist'}
                {tab === 'favorites' && 'Favorites'}
                {tab === 'recently-viewed' && 'Recently Viewed'}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="animate-fade-in delay-200">
            {activeTab === 'wishlist' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-2xl font-bold">
                    My Wishlist
                  </h2>
                  <span className="px-3 py-1 bg-secondary text-foreground rounded-full text-sm font-semibold">
                    {wishlistProducts.length} items
                  </span>
                </div>

                {wishlistProducts.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {wishlistProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onRemove={handleRemoveFromWishlist}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Your wishlist is empty
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Add products to your wishlist to save them for later.
                    </p>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 font-semibold rounded-lg hover:bg-accent transition-colors"
                    >
                      Browse Products
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-2xl font-bold">
                    My Favorites
                  </h2>
                  <span className="px-3 py-1 bg-secondary text-foreground rounded-full text-sm font-semibold">
                    {favoriteProducts.length} items
                  </span>
                </div>

                {favoriteProducts.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {favoriteProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onRemove={handleRemoveFromFavorites}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Star className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      No favorites yet
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Mark your favorite products to keep track of them.
                    </p>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 font-semibold rounded-lg hover:bg-accent transition-colors"
                    >
                      Browse Products
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'recently-viewed' && (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-4">
                  Recently viewed products will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
