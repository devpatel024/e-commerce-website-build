'use client'

import React, { createContext, useContext, useRef, useEffect, useState } from 'react'

interface AudioContextType {
  audioRef: React.RefObject<HTMLAudioElement | null>
  isPlaying: boolean
  toggleAudio: () => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProviderContext({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    // Initialize audio state from localStorage
    const savedState = localStorage.getItem('audioPlaying')
    const shouldPlay = savedState === null ? true : savedState === 'true'
    setIsPlaying(shouldPlay)

    if (shouldPlay && audioRef.current) {
      audioRef.current.play().catch(() => {
        console.log('[v0] Audio autoplay prevented')
      })
    }
  }, [])

  const toggleAudio = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      localStorage.setItem('audioPlaying', 'false')
    } else {
      audioRef.current.play().catch(() => {
        console.log('[v0] Audio playback failed')
      })
      setIsPlaying(true)
      localStorage.setItem('audioPlaying', 'true')
    }
  }

  return (
    <AudioContext.Provider value={{ audioRef, isPlaying, toggleAudio }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within AudioProviderContext')
  }
  return context
}
