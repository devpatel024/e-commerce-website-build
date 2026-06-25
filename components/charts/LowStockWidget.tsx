'use client'

import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { LowStockProduct } from '@/lib/dashboard-analytics'

interface LowStockWidgetProps {
  products: LowStockProduct[]
}

export function LowStockWidget({ products }: LowStockWidgetProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-orange-500" />
        <h3 className="font-semibold text-lg">Low Stock Products</h3>
      </div>
      
      {products.length === 0 ? (
        <p className="text-muted-foreground text-sm">All products have sufficient stock</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/admin/products/${product.id}/edit`}
              className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded hover:bg-orange-100 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{product.name}</p>
                <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
              </div>
              <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded">
                {product.stock <= 0 ? 'Out of Stock' : 'Low Stock'}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
