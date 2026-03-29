import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Using Inter for both as Space Grotesk fallback
const spaceGrotesk = Inter({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'NextEdgeAI — AI Film Production Studio',
  description:
    'Premium AI-powered film production, advertising campaigns, and cinematic storytelling. Where artificial intelligence meets cinematic artistry.',
  keywords: [
    'AI film production',
    'cinematic AI',
    'advertising campaigns',
    'visual storytelling',
    'virtual production',
    'AI cinema',
    'brand films',
  ],
  authors: [{ name: 'NextEdgeAI' }],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'NextEdgeAI — AI Film Production Studio',
    description: 'Where artificial intelligence meets cinematic artistry.',
    type: 'website',
    siteName: 'NextEdgeAI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NextEdgeAI — AI Film Production Studio',
    description: 'Where artificial intelligence meets cinematic artistry.',
  },
}

export const viewport: Viewport = {
  themeColor: '#06060c',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-[#06060c] text-white antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  )
}
