'use client'

import { Volume2, VolumeX } from 'lucide-react'
import { useAudio } from '@/context/AudioContext'

export default function HeroCarousel() {
  const videoUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/855854-hd_1280_720_24fps-MvGBt9GqY9xgxCvWeoIewloFZ0CZFn.mp4'
  const { isPlaying, toggleAudio } = useAudio()

  return (
    <section className="relative w-full h-screen bg-background overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />

      {/* Floating Text Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div className="text-center max-w-5xl mx-auto px-6 space-y-8">
          <h1 className="text-6xl md:text-7xl lg:text-8xl text-white mb-8 tracking-tight drop-shadow-lg animate-in fade-in slide-in-from-bottom-8 duration-1000 leading-tight font-heading">
            Timeless Elegance
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 leading-relaxed drop-shadow-md animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 font-light tracking-wide">
            Discover exquisite jewelry crafted with precision and passion
          </p>
        </div>
      </div>

      {/* Sound Toggle Button */}
      <button
        onClick={toggleAudio}
        className="absolute bottom-8 right-4 md:right-8 z-20 bg-white/10 backdrop-blur-md hover:bg-white/30 text-white p-3 md:p-4 transition-all duration-300 hover:scale-110 rounded-full border border-white/20"
        aria-label={isPlaying ? 'Mute ambient sound' : 'Play ambient sound'}
      >
        {isPlaying ? (
          <Volume2 className="w-6 h-6 md:w-8 md:h-8" />
        ) : (
          <VolumeX className="w-6 h-6 md:w-8 md:h-8" />
        )}
      </button>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-5" />
    </section>
  )
}
