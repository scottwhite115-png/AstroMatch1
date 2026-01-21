import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { NavigationWrapper } from "@/components/navigation-wrapper"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "AstroMatch - Dating App",
  description: "Find your perfect match through astrology compatibility",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <script src="/unregister-sw.js" />
      </head>
      <body className={`font-sans ${inter.variable} lg:pl-64`}>
        <Providers>
          {children}
          <NavigationWrapper />
        </Providers>
      </body>
    </html>
  )
}
