import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { CartProvider } from '@/context/CartContext'
import { AddressProvider } from '@/context/AddressContext'
import PageLoadingBar from '@/components/PageLoadingBar'
import ScrollProgressBar from '@/components/ScrollProgressBar'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const playfairDisplay = Playfair_Display({
  variable: '--font-playfair-display',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Luxe - Fashion & Jewellery',
  description: 'Discover premium fashion and jewellery collections. Elegant, timeless pieces for the modern aesthetic.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf8f6' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} bg-background`}>
      <body className="font-sans antialiased">
        <PageLoadingBar />
        <ScrollProgressBar />
        <AuthProvider>
          <AddressProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AddressProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
