'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <ol className="flex items-center gap-2 text-sm">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              {idx > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}

              {item.href ? (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-semibold text-foreground">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
