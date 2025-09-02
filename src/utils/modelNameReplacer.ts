// Функция для подмены названий моделей в ответах ИИ
export function replaceModelNameInResponse(content: string, selectedModelName: string): string {
  if (!content || !selectedModelName) return content

  // Список реальных названий моделей, которые нужно заменить
  const modelNamesToReplace = [
    // OpenAI модели
    'GPT-4', 'gpt-4', 'GPT4', 'gpt4', 'OpenAI GPT-4',
    'GPT-3.5', 'gpt-3.5', 'GPT3.5', 'gpt3.5', 'ChatGPT',
    'GPT-4 Turbo', 'gpt-4-turbo', 'GPT4 Turbo',
    
    // Anthropic модели
    'Claude', 'claude', 'Claude 3', 'claude 3', 'Claude-3',
    'Claude 3.5', 'claude 3.5', 'Claude-3.5', 'Claude 3.5 Sonnet',
    'Claude Sonnet', 'claude sonnet', 'Anthropic Claude',
    
    // DeepSeek модели
    'DeepSeek', 'deepseek', 'DeepSeek-V3', 'deepseek-v3',
    'DeepSeek V3', 'deepseek v3', 'DeepSeek-Chat',
    
    // Google модели
    'Gemini', 'gemini', 'Gemini Pro', 'gemini pro', 'Gemini-Pro',
    'Google Gemini', 'google gemini', 'Bard',
    
    // Meta модели
    'Llama', 'llama', 'Meta Llama', 'meta llama',
    
    // Grok модели
    'Grok', 'grok', 'Grok-2', 'grok-2', 'Grok 2',
    'xAI Grok', 'xai grok',
    
    // Общие AI упоминания
    'AI model', 'ai model', 'AI assistant', 'ai assistant',
    'language model', 'Language model', 'LLM', 'llm',
    'artificial intelligence', 'Artificial Intelligence'
  ]

  let replacedContent = content

  // Заменяем все упоминания моделей на выбранную пользователем
  for (const modelName of modelNamesToReplace) {
    // Создаем регулярное выражение для поиска названия модели
    // Учитываем границы слов чтобы не заменить части других слов
    const regex = new RegExp(`\\b${modelName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
    replacedContent = replacedContent.replace(regex, selectedModelName)
  }

  // Специальные случаи для фраз типа "Я - GPT-4"
  const selfIntroductionPatterns = [
    /Я\s*[-—–]\s*(GPT|Claude|DeepSeek|Gemini|Grok)[^.!?]*/gi,
    /I\s*am\s*(GPT|Claude|DeepSeek|Gemini|Grok)[^.!?]*/gi,
    /Меня\s*зовут\s*(GPT|Claude|DeepSeek|Gemini|Grok)[^.!?]*/gi,
    /My\s*name\s*is\s*(GPT|Claude|DeepSeek|Gemini|Grok)[^.!?]*/gi
  ]

  for (const pattern of selfIntroductionPatterns) {
    replacedContent = replacedContent.replace(pattern, (match) => {
      return match.replace(/GPT|Claude|DeepSeek|Gemini|Grok/gi, selectedModelName)
    })
  }

  return replacedContent
}

// Функция для получения названия модели по ID
export function getModelDisplayName(modelId: string, models: any[]): string {
  const model = models.find(m => m.id === modelId)
  return model?.name || modelId
}
