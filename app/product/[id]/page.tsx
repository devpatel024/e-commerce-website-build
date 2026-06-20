'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getProductById } from '@/app/actions/products'

interface Product {
  id: string
  name: string
  description: string
  price: string | number
  image: string
  category: string
  subcategory: string
  stock: number
  createdAt?: Date
  updatedAt?: Date
}

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const prod = await getProductById(params.id as string)
        setProduct(prod as Product || null)
        if (!prod) {
          setError('Product not found')
        }
      } catch (err) {
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [params.id])

  const handleAddToCart = () => {
    if (product) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const existingItem = cart.find((item: any) => item.productId === product.id)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        cart.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        })
      }

      localStorage.setItem('cart', JSON.stringify(cart))
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading product...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">{error || 'Product not found'}</p>
            <Link href="/products" className="text-accent font-semibold hover:underline">
              Back to Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const price = parseFloat(product.price.toString()).toFixed(2)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm">
            <Link href="/products" className="text-accent hover:underline">
              Products
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link
              href={`/products?category=${product.category}`}
              className="text-accent hover:underline capitalize"
            >
              {product.category}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground capitalize">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Product Image */}
            <div className="flex items-center justify-center">
              <div className="relative w-full aspect-square bg-secondary/30 rounded-lg overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-center">
              <div className="mb-6">
                <p className="text-sm text-accent font-semibold uppercase tracking-wide mb-2">
                  {product.subcategory}
                </p>
                <h1 className="font-heading text-4xl font-bold mb-4 text-foreground">{product.name}</h1>
                <p className="text-3xl font-semibold text-foreground mb-6">${price}</p>
                <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <p className="text-sm text-green-600 font-semibold">In Stock ({product.stock} available)</p>
                ) : (
                  <p className="text-sm text-destructive font-semibold">Out of Stock</p>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-foreground mb-3">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 border border-border rounded hover:bg-secondary transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 px-3 py-2 border border-border rounded text-center bg-background"
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 border border-border rounded hover:bg-secondary transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-foreground text-background py-4 px-6 font-semibold rounded-lg hover:bg-accent hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {added ? '✓ Added to Cart' : 'Add to Cart'}
              </button>

              {/* Wishlist Button */}
              <button className="w-full border border-foreground text-foreground py-3 px-6 font-semibold rounded-lg hover:bg-secondary transition-colors">
                Add to Wishlist
              </button>

              {/* Product Info */}
              <div className="mt-12 pt-8 border-t border-border">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Category</p>
                    <p className="font-semibold text-foreground capitalize">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Type</p>
                    <p className="font-semibold text-foreground capitalize">{product.subcategory}</p>
                  </div>
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
