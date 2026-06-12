'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getProductById, initializeStorage, addToCart } from '@/lib/storage'
import { Product } from '@/lib/types'

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedVariant, setSelectedVariant] = useState('')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    initializeStorage()
    const prod = getProductById(params.id as string)
    setProduct(prod || null)
    
    if (prod?.sizes) {
      setSelectedSize(prod.sizes[0])
    }
    if (prod?.variants) {
      setSelectedVariant(prod.variants[0].id)
    }
  }, [params.id])

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        productId: product.id,
        quantity,
        size: selectedSize,
        variant: selectedVariant,
      })
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Product not found</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/products" className="text-accent hover:text-foreground transition-colors mb-8">
            &larr; Back to Shop
          </Link>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Product Image */}
            <div>
              <div className="relative h-96 bg-secondary/30 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground capitalize mb-2">{product.subcategory}</p>
                <h1 className="font-heading text-4xl font-bold mb-4">{product.name}</h1>
              </div>

              <div className="mb-6 pb-6 border-b border-border">
                <p className="font-heading text-3xl font-bold">${product.price}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
              </div>

              <p className="text-muted-foreground mb-8 leading-relaxed">{product.description}</p>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">Size</label>
                  <div className="grid grid-cols-5 gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 border transition-colors ${
                          selectedSize === size
                            ? 'border-foreground bg-foreground text-background'
                            : 'border-border hover:border-foreground'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">Style</label>
                  <select
                    value={selectedVariant}
                    onChange={(e) => setSelectedVariant(e.target.value)}
                    className="w-full px-4 py-2 border border-border bg-background text-foreground"
                  >
                    {product.variants.map(variant => (
                      <option key={variant.id} value={variant.id}>
                        {variant.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-3">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 border border-border hover:bg-secondary transition-colors"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 border border-border hover:bg-secondary transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-3 font-semibold text-lg transition-colors ${
                  added
                    ? 'bg-accent text-white'
                    : product.stock === 0
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-foreground text-background hover:bg-accent hover:text-white'
                }`}
              >
                {added ? '✓ Added to Cart' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              {/* Additional Info */}
              <div className="mt-12 space-y-4 border-t border-border pt-8">
                <div>
                  <h3 className="font-semibold mb-2">Product Details</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Category: <span className="text-foreground capitalize">{product.category}</span></li>
                    <li>Type: <span className="text-foreground capitalize">{product.subcategory}</span></li>
                    {product.sizes && <li>Available Sizes: <span className="text-foreground">{product.sizes.join(', ')}</span></li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
