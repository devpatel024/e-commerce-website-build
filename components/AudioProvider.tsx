'use client'

import { useEffect, useRef, useState } from 'react'
import { useAudio } from '@/context/AudioContext'

const AUDIO_FILES = [
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the_mountain-soft-background-492811-h6hrmcAYOucXpuolQxtEYagqYKc1pC.mp3',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/atlasaudio-background-inspiring-519617-ujeRrEuX2uVeRqllcWU99dfeBSUeXc.mp3',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the_mountain-piano-background-487020-R7Uu6zqf7X3istq3lv63ahYnxovhDm.mp3',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lux-aeterna-limitless-506217-soMzFMtC5jWMkAIKiuVUxcZgpELY6V.mp3',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tomomi_kato-madame-bijou-233810-EG2RhRbZ3Xueq7s7nljuAId5SnXSil.mp3',
]

export default function AudioProvider() {
  const { audioRef, isPlaying } = useAudio()
  const currentTrackRef = useRef<number>(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      currentTrackRef.current = (currentTrackRef.current + 1) % AUDIO_FILES.length
      audio.src = AUDIO_FILES[currentTrackRef.current]
      audio.play().catch(() => {
        console.log('[v0] Error playing next track')
      })
    }

    audio.addEventListener('ended', handleEnded)
    return () => audio.removeEventListener('ended', handleEnded)
  }, [audioRef])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Set initial volume
    audio.volume = 0.2

    if (isPlaying) {
      audio.play().catch(() => {
        console.log('[v0] Audio playback prevented')
      })
    } else {
      audio.pause()
    }
  }, [isPlaying, audioRef])

  return (
    <audio
      ref={audioRef}
      src={AUDIO_FILES[0]}
      loop={false}
      preload="auto"
      crossOrigin="anonymous"
    />
  )
}
