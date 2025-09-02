import { supabase } from '@/lib/supabase'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
  model: string
  chatId: string
  stream?: boolean
}

// Interface for future use
// interface ChatResponse {
//   content: string
//   model: string
//   tokensUsed?: number
// }

export async function sendAIMessage(request: ChatRequest): Promise<Response> {
  // Получаем текущий access token
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.access_token) {
    throw new Error('User not authenticated')
  }

  // Вызываем Supabase Edge Function
  const response = await supabase.functions.invoke('ai-chat', {
    body: request,
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    }
  })

  if (response.error) {
    throw new Error(response.error.message || 'AI service error')
  }

  // Возвращаем Response для streaming или обычного ответа
  return new Response(JSON.stringify(response.data), {
    headers: {
      'Content-Type': request.stream ? 'text/event-stream' : 'application/json'
    }
  })
}

export async function sendAIMessageStream(request: ChatRequest): Promise<ReadableStream> {
  // Получаем текущий access token
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.access_token) {
    throw new Error('User not authenticated')
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const functionUrl = `${supabaseUrl}/functions/v1/ai-chat`

  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...request, stream: true })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'AI service error')
  }

  return response.body!
}

// Функция для получения статистики токенов пользователя
export async function getUserTokenStats() {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase.rpc('get_user_token_stats', {
    user_id: user.id
  })

  if (error) {
    throw new Error('Failed to get token stats')
  }

  return data[0] || {
    total_tokens_used: 0,
    daily_tokens_used: 0,
    daily_limit: 1250,
    remaining_tokens: 1250,
    is_pro: false
  }
}

// Функция для проверки доступности модели для пользователя
export async function checkModelAvailability(modelId: string): Promise<boolean> {
  const stats = await getUserTokenStats()
  
  // Список PRO моделей
  const proModels = ['gpt-4', 'gpt-4-turbo', 'claude-3.5-sonnet', 'grok']
  
  if (proModels.includes(modelId)) {
    return stats.is_pro || stats.remaining_tokens > 0
  }
  
  // Бесплатные модели доступны всем
  return stats.remaining_tokens > 0
}
