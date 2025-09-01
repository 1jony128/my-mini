import { AI_MODELS } from '@/lib/ai-models'

interface ModelCheckRequest {
  modelId: string
}

export async function checkModelAvailability(request: ModelCheckRequest): Promise<{ available: boolean }> {
  try {
    // В реальном приложении здесь будет проверка доступности модели
    // Пока возвращаем true для всех моделей
    const model = AI_MODELS.find(m => m.id === request.modelId)
    if (!model) {
      return { available: false }
    }
    
    return { available: true }
  } catch (error) {
    console.error('Ошибка проверки модели:', error)
    return { available: false }
  }
}
