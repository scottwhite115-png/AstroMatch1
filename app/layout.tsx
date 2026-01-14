import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { NavigationWrapper } from "@/components/navigation-wrapper"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700"],
})

export const metadata: Metadata = {
  title: "AstroMatch - Astrology Matchmaking",
  description: "Discover cosmic compatibility through Western and Chinese astrology. Connect with astrologically compatible profiles.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`font-sans ${inter.variable} ${playfair.variable} lg:pl-64 min-h-screen`} suppressHydrationWarning>
        <div id="app-root">
          <Providers>
            {children}
            <NavigationWrapper />
          </Providers>
        </div>
        <noscript>
          <div style={{ padding: '20px', textAlign: 'center', background: 'white', color: 'black' }}>
            <h1>JavaScript Required</h1>
            <p>Please enable JavaScript to use AstroMatch.</p>
          </div>
        </noscript>
      </body>
    </html>
  )
}
