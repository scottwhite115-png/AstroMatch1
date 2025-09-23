import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AstroMatch - Find Your Astrological Match',
  description: 'Discover your perfect astrological compatibility with others based on birth charts and zodiac signs.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
