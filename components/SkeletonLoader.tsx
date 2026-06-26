'use client'

export function ProductSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
      <div className="relative h-60 bg-secondary/30" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-secondary rounded w-16" />
        <div className="h-4 bg-secondary rounded w-full" />
        <div className="h-4 bg-secondary rounded w-3/4" />
        <div className="flex gap-2 pt-2">
          <div className="flex-1 h-8 bg-secondary rounded" />
          <div className="w-10 h-8 bg-secondary rounded" />
        </div>
      </div>
    </div>
  )
}

export function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      {/* Image skeleton */}
      <div className="relative w-full aspect-square bg-secondary/30 rounded-lg animate-pulse" />

      {/* Details skeleton */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="h-3 bg-secondary rounded w-20 animate-pulse" />
          <div className="h-8 bg-secondary rounded w-full animate-pulse" />
          <div className="h-6 bg-secondary rounded w-32 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-secondary rounded w-full animate-pulse" />
            <div className="h-4 bg-secondary rounded w-5/6 animate-pulse" />
          </div>
        </div>

        <div className="h-4 bg-secondary rounded w-24 animate-pulse" />

        {/* Quantity selector skeleton */}
        <div className="space-y-3">
          <div className="h-3 bg-secondary rounded w-16 animate-pulse" />
          <div className="h-10 bg-secondary rounded w-32 animate-pulse" />
        </div>

        {/* Buttons skeleton */}
        <div className="space-y-3">
          <div className="h-12 bg-secondary rounded w-full animate-pulse" />
          <div className="h-12 bg-secondary rounded w-full animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export function CartSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 bg-background rounded-lg border border-border animate-pulse">
          <div className="w-24 h-24 bg-secondary rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-secondary rounded w-full" />
            <div className="h-3 bg-secondary rounded w-1/2" />
            <div className="h-3 bg-secondary rounded w-1/3" />
          </div>
          <div className="h-24 bg-secondary rounded w-20" />
        </div>
      ))}
    </div>
  )
}
