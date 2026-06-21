'use client'

import { Star, Quote } from 'lucide-react'

interface Testimonial {
  name: string
  role: string
  image: string
  rating: number
  comment: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Priya Sharma',
    role: 'Fashion Influencer',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    rating: 5,
    comment: 'The jewelry collection is absolutely stunning. Every piece is crafted with perfection. I&apos;m obsessed!',
  },
  {
    name: 'Arjun Patel',
    role: 'Business Executive',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
    rating: 5,
    comment: 'Excellent quality and exceptional customer service. The clothing fits perfectly and arrived quickly.',
  },
  {
    name: 'Anjali Verma',
    role: 'Style Blogger',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali',
    rating: 5,
    comment: 'LUXE is my go-to for premium fashion. The designs are elegant and timeless. Highly recommended!',
  },
  {
    name: 'Rahul Gupta',
    role: 'Luxury Enthusiast',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    rating: 5,
    comment: 'Every detail is perfection. From packaging to product quality, LUXE exceeds expectations. Bravo!',
  },
]

export default function TestimonialSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-secondary/10 to-accent/5">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Loved by Our Customers
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust LUXE for premium fashion and jewelry.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className={`bg-card border border-border p-8 rounded-lg hover:shadow-lg transition-all duration-300 animate-fade-in`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-accent/30 mb-4" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-foreground mb-6 leading-relaxed text-sm">
                &ldquo;{testimonial.comment}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 mt-16 pt-16 border-t border-border">
          {[
            { label: '50K+', description: 'Happy Customers' },
            { label: '98%', description: 'Satisfaction Rate' },
            { label: '15+', description: 'Years Experience' },
            { label: '100%', description: 'Authentic Products' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <p className="text-3xl md:text-4xl font-bold text-accent mb-2">
                {stat.label}
              </p>
              <p className="text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
