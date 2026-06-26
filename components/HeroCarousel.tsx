'use client'

import { useState, useRef, useEffect } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

export default function HeroCarousel() {
  const videoUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/855854-hd_1280_720_24fps-MvGBt9GqY9xgxCvWeoIewloFZ0CZFn.mp4'
  const [soundPlaying, setSoundPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const savedSoundPref = localStorage.getItem('heroSoundPlaying')
    if (savedSoundPref === 'true' && audioRef.current) {
      audioRef.current.volume = 0.2
      audioRef.current.play().catch(() => {
        setSoundPlaying(false)
      })
      setSoundPlaying(true)
    }
  }, [])

  const toggleSound = () => {
    if (!audioRef.current) return

    if (soundPlaying) {
      audioRef.current.pause()
      setSoundPlaying(false)
      localStorage.setItem('heroSoundPlaying', 'false')
    } else {
      audioRef.current.volume = 0.2
      audioRef.current.play().catch(() => {
        console.log('[v0] Audio playback blocked by browser')
      })
      setSoundPlaying(true)
      localStorage.setItem('heroSoundPlaying', 'true')
    }
  }

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
        <div className="text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg animate-in fade-in slide-in-from-bottom-8 duration-1000 font-light">
            Timeless Elegance
          </h1>
          <p className="text-lg md:text-2xl text-white/90 mb-12 leading-relaxed drop-shadow-md animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 font-light">
            Discover exquisite jewelry crafted with precision and passion
          </p>
        </div>
      </div>

      {/* Sound Toggle Button */}
      <button
        onClick={toggleSound}
        className="absolute bottom-8 right-4 md:right-8 z-20 bg-white/10 backdrop-blur-md hover:bg-white/30 text-white p-3 md:p-4 transition-all duration-300 hover:scale-110 rounded-full border border-white/20"
        aria-label={soundPlaying ? 'Mute ambient sound' : 'Play ambient sound'}
      >
        {soundPlaying ? (
          <Volume2 className="w-6 h-6 md:w-8 md:h-8" />
        ) : (
          <VolumeX className="w-6 h-6 md:w-8 md:h-8" />
        )}
      </button>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
      >
        <source src="https://cdn.pixabay.com/download/audio/2021/08/04/audio_0373394a80.mp3" type="audio/mpeg" />
      </audio>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-5" />
    </section>
  )
}
