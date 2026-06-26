'use client'

import { useEffect, useRef, useState } from 'react'

const AUDIO_FILES = [
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the_mountain-soft-background-492811-h6hrmcAYOucXpuolQxtEYagqYKc1pC.mp3',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/atlasaudio-background-inspiring-519617-ujeRrEuX2uVeRqllcWU99dfeBSUeXc.mp3',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the_mountain-piano-background-487020-R7Uu6zqf7X3istq3lv63ahYnxovhDm.mp3',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lux-aeterna-limitless-506217-soMzFMtC5jWMkAIKiuVUxcZgpELY6V.mp3',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tomomi_kato-madame-bijou-233810-EG2RhRbZ3Xueq7s7nljuAId5SnXSil.mp3',
]

export default function AudioProvider() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const currentTrackRef = useRef<number>(0)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize audio on first user interaction
    const handleUserInteraction = () => {
      if (!isInitialized && audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.log('[v0] Audio autoplay prevented by browser:', error.message)
        })
        setIsInitialized(true)
        document.removeEventListener('click', handleUserInteraction)
        document.removeEventListener('touchstart', handleUserInteraction)
      }
    }

    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('touchstart', handleUserInteraction)

    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }
  }, [isInitialized])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      // Move to next track
      currentTrackRef.current = (currentTrackRef.current + 1) % AUDIO_FILES.length
      audio.src = AUDIO_FILES[currentTrackRef.current]
      audio.play().catch(() => {
        console.log('[v0] Error playing next track')
      })
    }

    audio.addEventListener('ended', handleEnded)
    return () => audio.removeEventListener('ended', handleEnded)
  }, [])

  return (
    <audio
      ref={audioRef}
      src={AUDIO_FILES[0]}
      loop={false}
      preload="none"
      crossOrigin="anonymous"
    />
  )
}
