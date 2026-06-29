import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'About ADs - Premium Luxury Fashion & Jewelry',
  description: 'Discover the story behind ADs, your premier destination for exquisite luxury jewelry and fashion.',
}

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-5xl md:text-6xl font-light mb-6 text-foreground">
              Our Story
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              ADs is a celebration of timeless elegance, craftsmanship, and the pursuit of beauty in every detail.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-heading text-4xl font-light mb-4 text-foreground">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  We believe that luxury isn't just about price—it's about the journey, the craftsmanship, and the story behind every piece. Our mission is to curate and deliver exquisite items that elevate your lifestyle and celebrate your unique taste.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Every product in our collection is handpicked with meticulous attention to detail, ensuring that you receive nothing less than the finest quality and design.
                </p>
              </div>
              <div className="bg-muted/20 rounded-lg p-12 text-center">
                <div className="text-5xl font-light mb-4 text-accent">✨</div>
                <p className="text-xl font-light text-foreground">Premium Quality</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/5">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading text-4xl font-light mb-12 text-center text-foreground">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Authenticity', description: 'Every piece is genuine, verified, and comes with certificates of authenticity.' },
                { title: 'Craftsmanship', description: 'We partner with master artisans who pour their expertise into every creation.' },
                { title: 'Sustainability', description: 'We are committed to ethical sourcing and environmentally responsible practices.' },
              ].map((value, index) => (
                <div key={index} className="p-8 border border-border rounded-lg hover:shadow-lg transition-shadow">
                  <h3 className="font-heading text-2xl font-light mb-3 text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-4xl font-light mb-6 text-foreground">Ready to Explore?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Discover our curated collections and find the perfect piece for yourself or someone special.
            </p>
            <a href="/products" className="inline-block px-8 py-3 bg-foreground text-background font-semibold rounded-full hover:bg-accent transition-colors">
              Shop Now
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
