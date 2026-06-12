'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getProducts, initializeStorage } from '@/lib/storage'
import { Product, Category, ProductSubcategory } from '@/lib/types'

const subcategoriesByCategory: Record<Category, ProductSubcategory[]> = {
  jewellery: ['rings', 'necklaces', 'earrings', 'bracelets'],
  clothes: ['tops', 'bottoms', 'dresses', 'accessories'],
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>(
    (searchParams.get('category') as Category) || 'all'
  )
  const [selectedSubcategory, setSelectedSubcategory] = useState<ProductSubcategory | 'all'>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [sortBy, setSortBy] = useState('popular')

  useEffect(() => {
    initializeStorage()
    const allProducts = getProducts()
    setProducts(allProducts)
  }, [])

  useEffect(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Filter by subcategory
    if (selectedSubcategory !== 'all') {
      filtered = filtered.filter(p => p.subcategory === selectedSubcategory)
    }

    // Filter by price
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'newest') {
      // Keep original order or reverse if needed
      filtered.reverse()
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, selectedSubcategory, priceRange, sortBy])

  const availableSubcategories =
    selectedCategory !== 'all' ? subcategoriesByCategory[selectedCategory] : []

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-heading text-4xl font-bold mb-2">Shop</h1>
            <p className="text-muted-foreground">
              {filteredProducts.length} products found
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6 sticky top-4">
                {/* Category Filter */}
                <div>
                  <h3 className="font-semibold mb-3">Category</h3>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value="all"
                        checked={selectedCategory === 'all'}
                        onChange={(e) => {
                          setSelectedCategory('all')
                          setSelectedSubcategory('all')
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">All Products</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value="jewellery"
                        checked={selectedCategory === 'jewellery'}
                        onChange={(e) => {
                          setSelectedCategory('jewellery')
                          setSelectedSubcategory('all')
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">Jewellery</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value="clothes"
                        checked={selectedCategory === 'clothes'}
                        onChange={(e) => {
                          setSelectedCategory('clothes')
                          setSelectedSubcategory('all')
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">Clothes</span>
                    </label>
                  </div>
                </div>

                {/* Subcategory Filter */}
                {availableSubcategories.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Type</h3>
                    <div className="space-y-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="subcategory"
                          value="all"
                          checked={selectedSubcategory === 'all'}
                          onChange={() => setSelectedSubcategory('all')}
                          className="mr-2"
                        />
                        <span className="text-sm">All Types</span>
                      </label>
                      {availableSubcategories.map(sub => (
                        <label key={sub} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="subcategory"
                            value={sub}
                            checked={selectedSubcategory === sub}
                            onChange={() => setSelectedSubcategory(sub as ProductSubcategory)}
                            className="mr-2"
                          />
                          <span className="text-sm capitalize">{sub}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Filter */}
                <div>
                  <h3 className="font-semibold mb-3">Price Range</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Min: ${priceRange[0]}</label>
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([Math.min(+e.target.value, priceRange[1]), priceRange[1]])
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Max: ${priceRange[1]}</label>
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([priceRange[0], Math.max(+e.target.value, priceRange[0])])
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <h3 className="font-semibold mb-3">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-border bg-background text-foreground"
                  >
                    <option value="popular">Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {filteredProducts.length === 0 ? (
                <div className="flex items-center justify-center h-96">
                  <p className="text-muted-foreground">No products found. Try adjusting your filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="group"
                    >
                      <div className="relative h-72 bg-secondary/30 overflow-hidden mb-4">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="font-heading text-lg font-semibold mb-1 group-hover:text-accent transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3">{product.subcategory}</p>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-foreground">${product.price}</p>
                        <p className="text-xs text-muted-foreground">{product.stock} in stock</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  )
}
