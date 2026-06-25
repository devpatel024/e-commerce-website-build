'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface RingSizeFinderProps {
  isOpen: boolean
  onClose: () => void
  onSelectSize: (size: string) => void
}

const RING_SIZES = [
  { us: 4, eu: 47 },
  { us: 4.5, eu: 48 },
  { us: 5, eu: 49 },
  { us: 5.5, eu: 50 },
  { us: 6, eu: 51 },
  { us: 6.5, eu: 52 },
  { us: 7, eu: 54 },
  { us: 7.5, eu: 55 },
  { us: 8, eu: 57 },
  { us: 8.5, eu: 58 },
  { us: 9, eu: 59 },
  { us: 9.5, eu: 60 },
  { us: 10, eu: 62 },
  { us: 10.5, eu: 63 },
  { us: 11, eu: 64 },
  { us: 11.5, eu: 65 },
  { us: 12, eu: 67 },
  { us: 12.5, eu: 68 },
  { us: 13, eu: 69 },
]

export default function RingSizeFinder({ isOpen, onClose, onSelectSize }: RingSizeFinderProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-background border border-border max-w-2xl w-full max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-6 sticky top-0 bg-background">
            <h2 className="font-heading text-xl font-bold">Find Your Ring Size</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-secondary transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <h3 className="font-semibold mb-3">How to Measure</h3>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Use a ring that fits perfectly</li>
                <li>Measure the inside diameter in millimeters</li>
                <li>Use the chart below to find your size</li>
              </ol>
            </div>

            {/* Size Chart */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Ring Size Chart</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {RING_SIZES.map(size => (
                  <button
                    key={size.us}
                    onClick={() => {
                      onSelectSize(`${size.us}`)
                      onClose()
                    }}
                    className="p-3 border border-border hover:bg-secondary transition-colors text-center text-sm font-medium"
                  >
                    <div>US {size.us}</div>
                    <div className="text-xs text-muted-foreground">EU {size.eu}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tip */}
            <div className="bg-secondary/50 border border-border p-4 rounded text-sm text-muted-foreground">
              <p>
                <strong>Tip:</strong> Ring sizes can vary between brands. If you&apos;re unsure, we recommend sizing up rather than down.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
