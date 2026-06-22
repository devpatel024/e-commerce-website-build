'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ArrowRight, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { getProducts, getWishlist, removeFromWishlist } from '@/lib/storage'
import type { Product } from '@/lib/types'

export default function WishlistPage() {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const wishlistIds = getWishlist()
      const allProducts = getProducts()
      const products = allProducts.filter(p => wishlistIds.includes(p.id))
      setWishlistProducts(products)
      setLoading(false)
      setMounted(true)
    }
  }, [])

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId)
    setWishlistProducts(prev => prev.filter(p => p.id !== productId))
  }

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p>Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-foreground text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 fill-current" />
            <h1 className="text-4xl font-bold font-heading">My Wishlist</h1>
          </div>
          <p className="text-white/80">
            {wishlistProducts.length === 0 ? 'Your wishlist is empty' : `${wishlistProducts.length} item${wishlistProducts.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Start adding your favorite items to your wishlist!</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-foreground text-white px-6 py-3 rounded-lg hover:bg-foreground/90 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map(product => (
              <div
                key={product.id}
                className="group bg-white rounded-lg overflow-hidden border border-border hover:border-foreground transition-all duration-300 hover:shadow-lg"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-muted overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {product.badge && (
                    <div className="absolute top-3 right-3 bg-destructive text-white px-2 py-1 text-xs font-semibold rounded">
                      {product.badge}
                    </div>
                  )}
                  <button
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    className="absolute top-3 left-3 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove from wishlist"
                  >
                    <Heart className="w-5 h-5 text-destructive fill-current" />
                  </button>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <p className="text-xs text-muted-foreground font-semibold mb-1 uppercase">
                    {product.subcategory}
                  </p>
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-semibold text-foreground hover:text-foreground/70 transition-colors line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-foreground">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div className="mb-4">
                    {product.stock > 0 ? (
                      <p className="text-xs text-green-600 font-semibold">In Stock ({product.stock})</p>
                    ) : (
                      <p className="text-xs text-destructive font-semibold">Out of Stock</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {product.stock > 0 ? (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-foreground text-white py-2 px-3 rounded hover:bg-foreground/90 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                      </button>
                    ) : (
                      <button className="flex-1 bg-muted text-muted-foreground py-2 px-3 rounded text-sm font-semibold cursor-not-allowed opacity-50">
                        Out of Stock
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="bg-muted text-muted-foreground p-2 rounded hover:bg-destructive/10 hover:text-destructive transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link
                    href={`/product/${product.id}`}
                    className="mt-3 flex items-center justify-center gap-2 text-foreground text-sm font-semibold hover:gap-3 transition-all"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Wishlist Stats */}
        {wishlistProducts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-2">
                  {wishlistProducts.length}
                </div>
                <p className="text-muted-foreground">Items in Wishlist</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-2">
                  ${wishlistProducts.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
                </div>
                <p className="text-muted-foreground">Total Wishlist Value</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-2">
                  {wishlistProducts.filter(p => p.stock === 0).length}
                </div>
                <p className="text-muted-foreground">Out of Stock</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
