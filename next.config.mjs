/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/new-year-2026',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
 
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
