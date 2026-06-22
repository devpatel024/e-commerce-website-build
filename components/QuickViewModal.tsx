'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, Heart, Share2, ShoppingBag, Star } from 'lucide-react'
import { Product } from '@/lib/types'
import { formatPrice } from '@/lib/price-formatter'
import { useCart } from '@/context/CartContext'
import {
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
} from '@/lib/storage'

interface QuickViewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
}: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [isWishlisted, setIsWishlisted] = useState(
    product ? isInWishlist(product.id) : false
  )
  const { addToCart } = useCart()

  if (!isOpen || !product) return null

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      size: selectedSize,
    })
    onClose()
  }

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product.id)
    }
    setIsWishlisted(!isWishlisted)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-scale-in">
        <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border">
          {/* Header */}
          <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10">
            <h3 className="font-heading text-xl font-bold">Quick View</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="relative h-96 bg-secondary/30 rounded-lg overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.badge && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-full">
                  {product.badge.toUpperCase()}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">
                  {product.subcategory}
                </p>
                <h2 className="font-heading text-2xl font-bold mb-4">
                  {product.name}
                </h2>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-1">
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
                    <span className="text-sm text-muted-foreground">
                      ({product.reviewCount || 0} reviews)
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-6">{product.description}</p>

                {/* Stock */}
                <div className="mb-6">
                  {product.stock > 0 ? (
                    <p className="text-green-600 font-semibold">In Stock</p>
                  ) : (
                    <p className="text-red-600 font-semibold">Out of Stock</p>
                  )}
                  {product.stock > 0 && product.stock < 5 && (
                    <p className="text-sm text-orange-600">
                      Only {product.stock} left!
                    </p>
                  )}
                </div>

                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2">
                      Size
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 border rounded transition-colors ${
                            selectedSize === size
                              ? 'bg-foreground text-background border-foreground'
                              : 'border-border hover:border-foreground'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 border border-border hover:bg-secondary rounded"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 border border-border hover:bg-secondary rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-foreground text-background py-3 font-semibold rounded-lg hover:bg-accent transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group hover:shadow-lg"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={handleWishlist}
                    className={`flex-1 py-3 border rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 ${
                      isWishlisted
                        ? 'bg-red-100 border-red-300 text-red-600'
                        : 'border-border hover:border-red-600 hover:text-red-600'
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`}
                    />
                    Wishlist
                  </button>

                  <button className="flex-1 py-3 border border-border rounded-lg hover:bg-secondary transition-colors font-semibold flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
