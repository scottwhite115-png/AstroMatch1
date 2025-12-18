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
  // Disable Turbopack (Tailwind v4 CSS parsing issue)
  experimental: {},
}

export default nextConfig
