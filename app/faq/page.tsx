'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQ {
  id: string
  category: string
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    id: '1',
    category: 'Shipping',
    question: 'How long does shipping take?',
    answer: 'We typically dispatch orders within 2-3 business days. Shipping to major cities takes 5-7 business days. You will receive a tracking number via email once your order is dispatched.'
  },
  {
    id: '2',
    category: 'Shipping',
    question: 'Do you offer free shipping?',
    answer: 'Free shipping is available on orders above ₹2000. For orders below this amount, standard shipping charges apply.'
  },
  {
    id: '3',
    category: 'Shipping',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy on most items. Products must be unused and in original packaging. For jewelry, we accept returns if there are manufacturing defects.'
  },
  {
    id: '4',
    category: 'Products',
    question: 'Are all products authentic?',
    answer: 'Yes, every product is 100% authentic. We work directly with certified manufacturers and provide certificates of authenticity with premium items.'
  },
  {
    id: '5',
    category: 'Products',
    question: 'Do you offer customization?',
    answer: 'Yes! We offer customization services for select items. Please contact our support team at support@ads.com to discuss your requirements.'
  },
  {
    id: '6',
    category: 'Products',
    question: 'How do I know the size/fit?',
    answer: 'Each product page includes detailed size guides and specifications. You can also contact our customer service team for personalized recommendations.'
  },
  {
    id: '7',
    category: 'Payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and digital payment methods. All transactions are secure and encrypted.'
  },
  {
    id: '8',
    category: 'Payment',
    question: 'Is my payment information safe?',
    answer: 'Yes, we use industry-standard SSL encryption and partner with secure payment gateways to protect your information.'
  },
  {
    id: '9',
    category: 'Account',
    question: 'Can I track my order?',
    answer: 'Yes! Once your order ships, you\'ll receive a tracking link via email. You can monitor your delivery status in real-time.'
  },
  {
    id: '10',
    category: 'Account',
    question: 'How do I contact customer support?',
    answer: 'You can reach our support team at support@ads.com or through the contact form on our website. We typically respond within 24 hours.'
  },
]

const categories = ['All', 'Shipping', 'Products', 'Payment', 'Account']

export default function FAQ() {
  const [expanded, setExpanded] = useState<string | null>('1')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredFAQs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-5xl md:text-6xl font-light mb-6 text-foreground">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about our products, shipping, and services.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Category Filter */}
            <div className="mb-12 flex flex-wrap gap-3 justify-center">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat)
                    setExpanded(null)
                  }}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-foreground text-background'
                      : 'bg-secondary text-foreground hover:bg-secondary/70'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFAQs.map(faq => (
                <div 
                  key={faq.id} 
                  className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
                  >
                    <h3 className="font-semibold text-left text-foreground">{faq.question}</h3>
                    {expanded === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-accent flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>

                  {expanded === faq.id && (
                    <div className="px-6 py-4 bg-secondary/10 border-t border-border">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Still Need Help */}
            <div className="mt-16 p-8 bg-muted/10 border border-border rounded-lg text-center">
              <h3 className="font-heading text-2xl font-light mb-3 text-foreground">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">
                Our support team is here to help. Reach out to us anytime.
              </p>
              <a href="mailto:support@ads.com" className="inline-block px-8 py-2 bg-foreground text-background font-semibold rounded-full hover:bg-accent transition-colors">
                Contact Support
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
