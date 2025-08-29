/** @type {import('next').NextConfig} */
const nextConfig = {
  // Настройка для Docker деплоя с SSR
  output: 'standalone',
  
  // Настройки изображений
  images: {
    // Разрешенные домены для изображений
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
    // Отключаем оптимизацию для Docker
    unoptimized: true,
  },
}

module.exports = nextConfig
