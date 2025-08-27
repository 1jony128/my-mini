import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { SupabaseProvider } from '@/components/providers/supabase-provider'
import { AppProvider } from '@/components/providers/app-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import Script from 'next/script'

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
  metadataBase: new URL('https://aichat-pro.ru'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ChatAIPRO - Чат GPT без VPN | Бесплатный доступ к ИИ',
    description: 'Чат GPT без VPN - бесплатный доступ к GPT-4, Claude, DeepSeek и другим ИИ моделям. Общайтесь с искусственным интеллектом без ограничений.',
    url: 'https://aichat-pro.ru',
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
    google: 'google1234567890abcdef',
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
        {/* Favicon для разных устройств и браузеров */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Sitemap */}
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        
        {/* Meta теги */}
        <meta name="theme-color" content="#3B82F6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Структурированные данные для Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "ChatAIPRO",
              "description": "Чат GPT без VPN - бесплатный доступ к GPT-4, Claude, DeepSeek и другим ИИ моделям",
              "url": "https://aichat-pro.ru",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://aichat-pro.ru/chat?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        
        {/* Google Analytics (добавьте свой код) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
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
