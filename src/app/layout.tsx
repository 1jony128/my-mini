import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { SupabaseProvider } from '@/components/providers/supabase-provider'
import { AppProvider } from '@/components/providers/app-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Chat Pro - Умный чат с ИИ',
  description: 'Современный чат с искусственным интеллектом. Поддерживает GPT-4, Claude, DeepSeek и другие модели. Безопасно, быстро, удобно.',
  keywords: 'AI чат, искусственный интеллект, GPT-4, Claude, DeepSeek, чат-бот, ИИ помощник, чат gpt, чат Claude, чат DeepSeek, gpt 4, gpt 5',
  authors: [{ name: 'AI Chat Pro Team' }],
  creator: 'AI Chat Pro',
  publisher: 'AI Chat Pro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://aichatpro.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AI Chat Pro - Умный чат с ИИ',
    description: 'Современный чат с искусственным интеллектом. Поддерживает GPT-4, Claude, DeepSeek и другие модели.',
    url: 'https://aichatpro.com',
    siteName: 'AI Chat Pro',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Chat Pro - Умный чат с ИИ',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Chat Pro - Умный чат с ИИ',
    description: 'Современный чат с искусственным интеллектом. Поддерживает GPT-4, Claude, DeepSeek и другие модели.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <SupabaseProvider>
          <AppProvider>
            {children}
            <Toaster position="top-right" />
          </AppProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
