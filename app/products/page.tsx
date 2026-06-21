'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getProducts, initializeStorage } from '@/lib/storage'
import { Product } from '@/lib/types'
import { formatPrice } from '@/lib/price-formatter'

const subcategories = {
  jewellery: ['rings', 'necklaces', 'earrings', 'bracelets'],
  clothes: ['tops', 'bottoms', 'dresses', 'accessories'],
}

function ProductsContent({
  category,
  subcategory,
  minPrice,
  maxPrice,
  sort,
  products: allProducts,
}: {
  category?: string
  subcategory?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
  products: Product[]
}) {

  let filtered = allProducts

  // Filter by category
  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category)
  }

  // Filter by subcategory
  if (subcategory && subcategory !== 'all') {
    filtered = filtered.filter(p => p.subcategory === subcategory)
  }

  // Filter by price
  const min = minPrice ? parseFloat(minPrice) : 0
  const max = maxPrice ? parseFloat(maxPrice) : 10000
  filtered = filtered.filter(p => parseFloat(p.price.toString()) >= min && parseFloat(p.price.toString()) <= max)

  // Sort
  if (sort === 'price-low') {
    filtered.sort((a, b) => parseFloat(a.price.toString()) - parseFloat(b.price.toString()))
  } else if (sort === 'price-high') {
    filtered.sort((a, b) => parseFloat(b.price.toString()) - parseFloat(a.price.toString()))
  } else if (sort === 'newest') {
    filtered.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
  }

  const availableSubcategories =
    category && category !== 'all' ? subcategories[category as keyof typeof subcategories] : []

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
      {/* Filters Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-card rounded-lg shadow p-6 border border-border sticky top-24 animate-fade-in">
          <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </h3>

          {/* Category Filter */}
          <div className="mb-6 pb-6 border-b border-border">
            <label className="text-sm font-semibold text-foreground mb-2 block">Category</label>
            <select
              defaultValue={category || 'all'}
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
            >
              <option value="all">All Categories</option>
              <option value="jewellery">Jewellery</option>
              <option value="clothes">Clothes</option>
            </select>
          </div>

          {/* Subcategory Filter */}
          {availableSubcategories.length > 0 && (
            <div className="mb-6 pb-6 border-b border-border">
              <label className="text-sm font-semibold text-foreground mb-2 block">Subcategory</label>
              <select
                defaultValue={subcategory || 'all'}
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
              >
                <option value="all">All</option>
                {availableSubcategories.map(sub => (
                  <option key={sub} value={sub}>
                    {sub.charAt(0).toUpperCase() + sub.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Price Filter */}
          <div className="mb-6 pb-6 border-b border-border">
            <label className="text-sm font-semibold text-foreground mb-2 block">Price Range</label>
            <div className="space-y-2">
              <input
                type="number"
                defaultValue={minPrice || 0}
                placeholder="Min"
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
              />
              <input
                type="number"
                defaultValue={maxPrice || 10000}
                placeholder="Max"
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
              />
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Sort By</label>
            <select
              defaultValue={sort || 'popular'}
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
            >
              <option value="popular">Popular</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="lg:col-span-3">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">{filtered.length} products found</p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((prod, idx) => (
              <Link key={prod.id} href={`/product/${prod.id}`} className="group">
                <div className={`relative h-80 bg-secondary/30 overflow-hidden rounded-lg mb-4 animate-fade-in delay-${idx * 100}`}>
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {prod.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <p className="text-white font-semibold">Out of Stock</p>
                    </div>
                  )}
                </div>
                <h3 className="font-heading text-lg font-semibold mb-1 group-hover:text-accent transition-colors duration-300 line-clamp-2">
                  {prod.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-2">{prod.subcategory}</p>
                <p className="font-semibold text-foreground">{formatPrice(prod.price)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    initializeStorage()
    setProducts(getProducts())
  }, [])

  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined
  const subcategory = typeof searchParams.subcategory === 'string' ? searchParams.subcategory : undefined
  const minPrice = typeof searchParams.minPrice === 'string' ? searchParams.minPrice : undefined
  const maxPrice = typeof searchParams.maxPrice === 'string' ? searchParams.maxPrice : undefined
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : undefined

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-heading text-4xl font-bold mb-2">Shop</h1>
            <p className="text-muted-foreground">Discover our premium collections</p>
          </div>

          {products.length > 0 ? (
            <ProductsContent
              category={category}
              subcategory={subcategory}
              minPrice={minPrice}
              maxPrice={maxPrice}
              sort={sort}
              products={products}
            />
          ) : (
            <div className="text-center py-12">Loading products...</div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
