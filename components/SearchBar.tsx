'use client'

import { useState, useCallback, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import Link from 'next/link'
import { getProducts } from '@/lib/storage'
import { Product } from '@/lib/types'
import { formatPrice } from '@/lib/price-formatter'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  // Get all products once
  const allProducts = useMemo(() => getProducts(), [])

  // Filter products based on query
  const results: Product[] = useMemo(() => {
    if (!query.trim()) return []
    
    const searchTerm = query.toLowerCase()
    return allProducts
      .filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.subcategory.toLowerCase().includes(searchTerm)
      )
      .slice(0, 8) // Limit to 8 results
  }, [query, allProducts])

  const handleClear = useCallback(() => {
    setQuery('')
    setIsOpen(false)
  }, [])

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary/50 rounded transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="divide-y divide-border">
              {results.map(product => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  onClick={() => handleClear()}
                  className="flex items-center gap-3 p-3 hover:bg-secondary/30 transition-colors group"
                >
                  <div className="w-12 h-12 rounded bg-secondary/50 flex-shrink-0 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-accent transition-colors">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {product.subcategory}
                    </p>
                  </div>
                  <p className="text-sm font-semibold flex-shrink-0">
                    {formatPrice(product.price)}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No products found matching "{query}"
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
