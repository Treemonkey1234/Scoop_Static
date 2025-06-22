import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ScoopSocials - Trust-Based Social Network',
  description: 'Connect with verified, trustworthy people in your community. Share reviews, discover events, and build meaningful relationships.',
  keywords: 'social network, trust, reviews, community, events, verified users',
  authors: [{ name: 'ScoopSocials Team' }],
  colorScheme: 'light',
  themeColor: '#06b6d4',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  openGraph: {
    title: 'ScoopSocials - Trust-Based Social Network',
    description: 'Connect with verified, trustworthy people in your community.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScoopSocials - Trust-Based Social Network',
    description: 'Connect with verified, trustworthy people in your community.',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.className} h-full overflow-x-hidden`}>
        <div id="root" className="min-h-full">
          {children}
        </div>
      </body>
    </html>
  )
} 