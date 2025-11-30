/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    allowedDevOrigins: [
      'http://192.168.1.104:3000',
      'http://192.168.1.104:3001',
      'http://192.168.1.104:3002',
      'http://192.168.1.104:3003',
      'http://192.168.1.104',
      'http://172.20.10.11:3000',
      'http://172.20.10.11:3001',
      'http://172.20.10.11:3002',
      'http://172.20.10.11:3003',
      'http://172.20.10.11',
    ],
  },
  // Disable React strict mode which can cause hydration issues
  reactStrictMode: false,
}

export default nextConfig
