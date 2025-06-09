/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.tiktokcdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.tiktokcdn-us.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.tiktok.com',
        pathname: '/**',
      }
    ],
  },
}

module.exports = nextConfig 