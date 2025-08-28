import { NextResponse } from 'next/server'

export async function GET() {
  const svgContent = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="8" fill="#3B82F6"/>
  <path d="M16 6L14.088 11.813C13.813 12.275 13.275 12.813 12.813 13.088L7 15L12.813 16.912C13.275 17.187 13.813 17.725 14.088 18.187L16 24L17.912 18.187C18.187 17.725 18.725 17.187 19.187 16.912L25 15L19.187 13.088C18.725 12.813 18.187 12.275 17.912 11.813L16 6Z" fill="white"/>
  <path d="M10 6V10" stroke="white" stroke-width="2" stroke-linecap="round"/>
  <path d="M22 22V26" stroke="white" stroke-width="2" stroke-linecap="round"/>
  <path d="M6 10H10" stroke="white" stroke-width="2" stroke-linecap="round"/>
  <path d="M22 22H26" stroke="white" stroke-width="2" stroke-linecap="round"/>
</svg>`

  return new NextResponse(svgContent, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
