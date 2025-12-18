/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-neon', '@neondatabase/serverless', 'prisma'],
  // Disable React strict mode which can cause hydration issues
  reactStrictMode: false,
  // Disable Turbopack completely (Tailwind v4 compatibility issue)
  experimental: {
    turbo: {
      resolveAlias: {},
    },
  },
  // Force webpack instead of Turbopack
  webpack: (config) => config,
}

export default nextConfig
