import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ChatAIPRO',
    short_name: 'ChatAIPRO',
    description: 'Чат GPT без VPN - бесплатный доступ к ИИ',
    start_url: '/',
    display: 'standalone',
    background_color: '#3B82F6',
    theme_color: '#3B82F6',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable'
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ],
    categories: ['productivity', 'utilities'],
    lang: 'ru',
    dir: 'ltr'
  }
}
