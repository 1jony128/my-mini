import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    openrouter_key_exists: !!process.env.OPENROUTER_API_KEY,
    openrouter_key_prefix: process.env.OPENROUTER_API_KEY?.substring(0, 10),
    supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    deepseek_key_exists: !!process.env.DEEPSEEK_API_KEY,
  })
}

