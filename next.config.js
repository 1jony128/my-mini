/** @type {import('next').NextConfig} */
const nextConfig = {
  // Для статической генерации (Timeweb Apps)
  // output: 'export',
  // trailingSlash: true,
  
  // Для Docker деплоя (Timeweb Docker)
  output: 'standalone',
  
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
    unoptimized: true,
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
