import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { SupabaseProvider } from '@/components/providers/supabase-provider'
import { AppProvider } from '@/components/providers/app-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChatAIPRO - Чат GPT без VPN | Бесплатный доступ к ИИ',
  description: 'Чат GPT без VPN - бесплатный доступ к GPT-4, Claude, DeepSeek и другим ИИ моделям. Общайтесь с искусственным интеллектом без ограничений. Безопасно и быстро.',
  keywords: 'чат гпт без впн, чат gpt без vpn, gpt 4 без впн, gpt 5 без впн, чат с ии, искусственный интеллект, gpt-4, claude, deepseek, чат-бот, ИИ помощник, чат gpt, чат Claude, чат DeepSeek, бесплатный чат gpt, доступ к gpt без впн, gpt онлайн, ии чат бесплатно',
  authors: [{ name: 'ChatAIPRO Team' }],
  creator: 'ChatAIPRO',
  publisher: 'ChatAIPRO',
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
    title: 'ChatAIPRO - Чат GPT без VPN | Бесплатный доступ к ИИ',
    description: 'Чат GPT без VPN - бесплатный доступ к GPT-4, Claude, DeepSeek и другим ИИ моделям. Общайтесь с искусственным интеллектом без ограничений.',
    url: 'https://aichatpro.com',
    siteName: 'ChatAIPRO',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ChatAIPRO - Чат GPT без VPN',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChatAIPRO - Чат GPT без VPN | Бесплатный доступ к ИИ',
    description: 'Чат GPT без VPN - бесплатный доступ к GPT-4, Claude, DeepSeek и другим ИИ моделям. Общайтесь с искусственным интеллектом без ограничений.',
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
        <ThemeProvider>
          <SupabaseProvider>
            <AppProvider>
              {children}
              <Toaster position="top-right" />
            </AppProvider>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
