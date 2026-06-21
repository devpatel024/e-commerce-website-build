'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

interface Collection {
  id: string
  title: string
  description: string
  image: string
  href: string
  color: string
}

const collections: Collection[] = [
  {
    id: 'luxury-jewelry',
    title: 'Luxury Jewelry',
    description: 'Premium gemstones and precious metals',
    image: '/hero/slide-1.png',
    href: '/products?category=jewellery',
    color: 'from-amber-500',
  },
  {
    id: 'elegant-wear',
    title: 'Elegant Apparel',
    description: 'Sophisticated clothing for every occasion',
    image: '/hero/slide-2.png',
    href: '/products?category=clothes',
    color: 'from-emerald-500',
  },
  {
    id: 'exclusive',
    title: 'Exclusive Pieces',
    description: 'Limited edition and rare collections',
    image: '/hero/slide-3.png',
    href: '/products?badge=exclusive',
    color: 'from-purple-500',
  },
]

export default function FeaturedCollections() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Explore Collections
          </h2>
          <p className="text-muted-foreground text-lg">
            Curated collections crafted for the discerning customer
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {collections.map((collection, idx) => (
            <Link
              key={collection.id}
              href={collection.href}
              className="group relative overflow-hidden rounded-2xl h-80 animate-fade-in hover-lift"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Background Image */}
              <Image
                src={collection.image}
                alt={collection.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* Overlay Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${collection.color} to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300`}
              />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="transform group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-heading text-2xl font-bold text-white mb-2">
                    {collection.title}
                  </h3>
                  <p className="text-white/80 mb-4 line-clamp-2">
                    {collection.description}
                  </p>
                  <div className="inline-flex items-center gap-2 text-white font-semibold group-hover:gap-4 transition-all">
                    Shop Collection
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
