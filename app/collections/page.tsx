import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Collections - ADs',
  description: 'Explore our curated luxury collections.',
}

const collections = [
  {
    id: '1',
    name: 'Summer Elegance',
    slug: 'summer-elegance',
    description: 'Light, breezy pieces perfect for warm seasons',
    image: '/images/collection-summer.jpg',
    productCount: 24
  },
  {
    id: '2',
    name: 'Winter Luxe',
    slug: 'winter-luxe',
    description: 'Rich, sophisticated pieces for the cold season',
    image: '/images/collection-winter.jpg',
    productCount: 18
  },
  {
    id: '3',
    name: 'Minimalist Chic',
    slug: 'minimalist-chic',
    description: 'Clean lines and understated elegance',
    image: '/images/collection-minimalist.jpg',
    productCount: 15
  },
  {
    id: '4',
    name: 'Vintage Revival',
    slug: 'vintage-revival',
    description: 'Timeless pieces inspired by classic designs',
    image: '/images/collection-vintage.jpg',
    productCount: 20
  },
]

export default function Collections() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-5xl md:text-6xl font-light mb-6 text-foreground">
              Collections
            </h1>
            <p className="text-lg text-muted-foreground">
              Curated collections designed to inspire and elevate your style.
            </p>
          </div>
        </section>

        {/* Collections Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {collections.map(collection => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.slug}`}
                  className="group cursor-pointer"
                >
                  <div className="relative h-64 bg-secondary/30 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                    <div className="text-center p-8">
                      <h3 className="font-heading text-3xl font-light text-foreground mb-2">
                        {collection.name}
                      </h3>
                      <p className="text-muted-foreground mb-4">{collection.description}</p>
                      <span className="inline-block px-4 py-2 bg-foreground text-background text-sm font-semibold rounded-full group-hover:bg-accent transition-colors">
                        View Collection
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-2xl font-light text-foreground group-hover:text-accent transition-colors">
                      {collection.name}
                    </h3>
                    <span className="text-sm text-muted-foreground">{collection.productCount} items</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
