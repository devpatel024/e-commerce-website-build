'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQ {
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy on all products. Items must be in original condition with tags attached. Simply contact our customer service to initiate a return.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business days. All orders are carefully packaged and tracked.',
  },
  {
    question: 'Are your products authentic?',
    answer: 'Yes, 100% of our products are authentic and sourced directly from verified manufacturers. We guarantee authenticity on all items.',
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'Currently, we ship to major Indian cities. International shipping coming soon! Subscribe to our newsletter for updates.',
  },
  {
    question: 'How do I care for jewelry?',
    answer: 'Store jewelry in a cool, dry place. Clean regularly with a soft cloth. For diamonds and gemstones, use specialized jewelry cleaner. Avoid contact with chemicals.',
  },
  {
    question: 'What sizes are available?',
    answer: 'We offer a full range of sizes for all products. Check individual product pages for specific sizing information. Our team can help with sizing questions.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/5">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions about our products and services.
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`border border-border rounded-lg overflow-hidden animate-fade-in transition-all duration-300 ${
                openIndex === idx ? 'bg-secondary/10' : 'bg-card hover:bg-secondary/5'
              }`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-6 flex items-center justify-between hover:no-underline text-left transition-colors"
              >
                <h3 className="font-semibold text-lg">{faq.question}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-accent transition-transform duration-300 flex-shrink-0 ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === idx && (
                <div className="px-6 pb-6 border-t border-border pt-4 animate-fade-in">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 p-8 bg-gradient-to-r from-accent/10 to-purple-600/10 border border-accent/20 rounded-lg text-center animate-fade-in">
          <h3 className="font-heading text-xl font-bold mb-2">
            Didn&apos;t find your answer?
          </h3>
          <p className="text-muted-foreground mb-4">
            Our customer support team is here to help. Contact us anytime.
          </p>
          <button className="bg-accent text-white px-6 py-2 font-semibold rounded-lg hover:bg-accent/90 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  )
}
