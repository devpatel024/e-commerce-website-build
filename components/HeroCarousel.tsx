'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Slide {
  id: number
  image: string
  title: string
  subtitle: string
}

const heroSlides: Slide[] = [
  {
    id: 1,
    image: '/hero-1.png',
    title: 'Timeless Elegance',
    subtitle: 'Discover exquisite jewelry crafted with precision and passion',
  },
  {
    id: 2,
    image: '/hero-2.png',
    title: 'Premium Fashion',
    subtitle: 'Elevate your style with our luxury apparel collection',
  },
  {
    id: 3,
    image: '/hero-1.png',
    title: 'Pure Luxury',
    subtitle: 'Experience sophistication in every piece',
  },
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setDirection('next')
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [autoPlay])

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 'next' : 'prev')
    setCurrentSlide(index)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 8000)
  }

  const nextSlide = () => {
    setDirection('next')
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 8000)
  }

  const prevSlide = () => {
    setDirection('prev')
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 8000)
  }

  const slide = heroSlides[currentSlide]

  return (
    <section className="relative w-full h-screen bg-background overflow-hidden group">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {heroSlides.map((s, index) => {
          const isActive = index === currentSlide
          const isNext = (index === (currentSlide + 1) % heroSlides.length)
          const isPrev = (index === (currentSlide - 1 + heroSlides.length) % heroSlides.length)
          
          return (
            <div
              key={s.id}
              className={`absolute inset-0 transition-all duration-1200 ease-out ${
                isActive
                  ? 'opacity-100 scale-100'
                  : direction === 'next'
                    ? isNext
                      ? 'opacity-0 scale-105'
                      : 'opacity-0 scale-95'
                    : isPrev
                      ? 'opacity-0 scale-105'
                      : 'opacity-0 scale-95'
              }`}
              style={{
                transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0.48, 1)',
              }}
            >
              <Image
                src={s.image}
                alt={s.title}
                fill
                className="object-cover"
                priority={index === 0}
                quality={95}
              />
              {/* Dynamic gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
            </div>
          )
        })}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div
          className={`text-center max-w-4xl mx-auto px-4 transition-all duration-1000 ease-out ${
            currentSlide === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          key={currentSlide}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight font-heading drop-shadow-lg animate-in fade-in slide-in-from-bottom-8 duration-1000 font-light">
            {slide.title}
          </h1>
          <p className="text-sm md:text-lg text-white/80 mb-12 leading-relaxed drop-shadow-md animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 font-light">
            {slide.subtitle}
          </p>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/30 text-white p-3 md:p-4 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 rounded-full border border-white/20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/30 text-white p-3 md:p-4 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 rounded-full border border-white/20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all duration-500 ${
              index === currentSlide
                ? 'bg-white w-10 h-2 md:w-12 shadow-lg'
                : 'bg-white/40 hover:bg-white/70 w-2 h-2 md:w-3 md:h-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-5" />
    </section>
  )
}
