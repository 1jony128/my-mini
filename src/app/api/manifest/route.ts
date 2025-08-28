import { NextResponse } from 'next/server'

export async function GET() {
  const manifest = {
    name: "ChatAIPRO",
    short_name: "ChatAIPRO",
    description: "Чат GPT без VPN - бесплатный доступ к ИИ",
    start_url: "/",
    display: "standalone",
    background_color: "#3B82F6",
    theme_color: "#3B82F6",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/api/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any maskable"
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],
    categories: ["productivity", "utilities"],
    lang: "ru",
    dir: "ltr"
  }

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
