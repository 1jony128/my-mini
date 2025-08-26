import { NextResponse } from 'next/server'
import { AI_MODELS } from '@/lib/ai-models'

export async function GET() {
  return NextResponse.json(AI_MODELS)
}

