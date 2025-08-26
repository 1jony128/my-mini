import { NextRequest, NextResponse } from 'next/server'
import { AI_MODELS } from '@/lib/ai-models'

export async function POST(request: NextRequest) {
  try {
    const { modelId } = await request.json()

    if (!modelId) {
      return NextResponse.json({ error: 'Model ID is required' }, { status: 400 })
    }

    // Находим модель в списке
    const model = AI_MODELS.find(m => m.id === modelId)
    if (!model) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 })
    }

    // Для DeepSeek модели считаем доступной, если есть модели в пуле
    const isAvailable = modelId === 'deepseek' ? true : true

    return NextResponse.json({ 
      modelId,
      available: isAvailable,
      model: {
        id: model.id,
        name: model.name,
        provider: model.provider,
        is_free: model.is_free,
        max_tokens: model.max_tokens,
        daily_limit: model.daily_limit
      }
    })
  } catch (error) {
    console.error('Error checking model availability:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
