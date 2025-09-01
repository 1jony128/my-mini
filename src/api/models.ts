import { AI_MODELS } from '@/lib/ai-models'

export async function getModels() {
  try {
    // В реальном приложении здесь может быть запрос к серверу
    // Пока возвращаем локальные модели
    return AI_MODELS
  } catch (error) {
    console.error('Ошибка получения моделей:', error)
    throw new Error('Не удалось загрузить модели')
  }
}
