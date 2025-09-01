export interface AIModel {
  id: string
  name: string
  provider: string
  is_free: boolean
  max_tokens?: number
  description?: string
  daily_limit?: number
}

// Пул бесплатных моделей (OpenRouter), используем для подмены "deepseek"
const DEEPSEEK_MODEL_POOL: string[] = [
  'deepseek/deepseek-r1:free',
  'deepseek/deepseek-chat-v3-0324:free',
  'deepseek/deepseek-r1-0528:free',
  'deepseek/deepseek-r1-0528-qwen3-8b:free',
  'deepseek/deepseek-r1-distill-llama-70b:free',
  'tngtech/deepseek-r1t2-chimera:free',
  'tngtech/deepseek-r1t-chimera:free',
  'qwen/qwen3-coder:free',
  'qwen/qwen3-235b-a22b:free',
  'qwen/qwen3-14b:free',
  'qwen/qwen-2.5-coder-32b-instruct:free',
  'z-ai/glm-4.5-air:free',
  'moonshotai/kimi-k2:free',
  'google/gemini-2.0-flash-exp:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'microsoft/mai-ds-r1:free',
  'openai/gpt-oss-20b:free',
  'mistralai/mistral-small-3.2-24b-instruct:free',
  'mistralai/mistral-nemo:free',
  'google/gemma-3-27b-it:free'
]

// Видимые пользователю модели (как в Next)
export const AI_MODELS: AIModel[] = [
  {
    id: 'deepseek',
    name: 'GPT-4o',
    provider: 'openrouter',
    is_free: true,
    max_tokens: 8192,
    daily_limit: 1000,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openrouter',
    is_free: true,
    max_tokens: 4096,
    daily_limit: 1000,
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'openrouter',
    is_free: false,
    max_tokens: 8192,
    daily_limit: 0,
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'openrouter',
    is_free: false,
    max_tokens: 4096,
    daily_limit: 1000,
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'openrouter',
    is_free: false,
    max_tokens: 8192,
    daily_limit: 0,
  },
  {
    id: 'claude-3-opus-max',
    name: 'Claude 3 Opus Max',
    provider: 'openrouter',
    is_free: false,
    max_tokens: 8192,
    daily_limit: 0,
  },
]

export const getModelById = (id: string): AIModel | undefined => {
  return AI_MODELS.find(model => model.id === id)
}

export const getFreeModels = (): AIModel[] => {
  return AI_MODELS.filter(model => model.is_free)
}

export const getProModels = (): AIModel[] => {
  return AI_MODELS.filter(model => !model.is_free)
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

function getRandomDeepSeekModel(): string {
  const randomIndex = Math.floor(Math.random() * DEEPSEEK_MODEL_POOL.length)
  return DEEPSEEK_MODEL_POOL[randomIndex]
}

// В реакт-версии используем fetch к внешним API (OpenRouter, Grok)
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY as string | undefined
const GROK_API_KEY = import.meta.env.VITE_GROK_API_KEY as string | undefined

export async function generateResponse(
  modelId: string,
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
  stream: boolean = false,
  userSettings?: { ai_rules?: string; user_preferences?: string }
): Promise<any> {
  // Подмена модели для бесплатного "GPT-4o"
  let actualModelId = modelId
  if (modelId === 'deepseek') {
    actualModelId = getRandomDeepSeekModel()
  }

  const model = AI_MODELS.find(m => m.id === modelId)
  if (!model) {
    throw new Error('Модель не найдена')
  }

  // Применяем правила ИИ (system сообщение)
  let enhancedMessages = [...messages]
  if (userSettings && userSettings.ai_rules && userSettings.ai_rules.trim()) {
    const systemMessage = {
      role: 'system' as const,
      content: `Ты - полезный ИИ-ассистент, если спросят какая у тебя модель, отвечай что ты ${model.name}. Следуй этим правилам:\n\n${userSettings.ai_rules}`
    }
    enhancedMessages = [systemMessage, ...messages]
  }

  // Платные модели: сначала пробуем Grok
  if (!model.is_free && GROK_API_KEY) {
    try {
      const grokBody = {
        model: 'grok-4-latest',
        messages: enhancedMessages,
        stream: !!stream,
        temperature: 0.7,
        max_tokens: model.max_tokens
      }
      const grokResp = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(grokBody)
      })

      if (!grokResp.ok) {
        throw new Error(`Grok error: ${grokResp.status}`)
      }

      if (stream) return grokResp

      const data = await grokResp.json()
      const content = data.choices?.[0]?.message?.content || ''
      return content
    } catch (err) {
      // Падаем на OpenRouter
    }
  }

  // Все прочие случаи — OpenRouter
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API ключ не настроен')
  }

  const requestBody: any = {
    model: actualModelId,
    messages: enhancedMessages,
    stream: !!stream,
    max_tokens: model.max_tokens
  }

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': window?.location?.origin || 'http://localhost:3000',
    'X-Title': 'ChatAIPRO App'
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody)
  })

  // Обработка лимитов: пробуем fallback для 429
  if (!response.ok) {
    if (response.status === 429) {
      // Для платных — Grok как fallback (если не пробовали)
      if (!model.is_free && GROK_API_KEY) {
        try {
          const grokBody = {
            model: 'grok-4-latest',
            messages: enhancedMessages,
            stream: !!stream,
            temperature: 0.7,
            max_tokens: model.max_tokens
          }
          const grokResp = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${GROK_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(grokBody)
          })
          if (grokResp.ok) {
            if (stream) return grokResp
            const d = await grokResp.json()
            return d.choices?.[0]?.message?.content || ''
          }
        } catch {}
      }

      // Для бесплатных — пробуем другие free-модели
      const fallbackModels = [
        ...DEEPSEEK_MODEL_POOL.filter(id => id !== actualModelId),
        'gpt-3.5-turbo',
        'claude-3-haiku',
        'gemini-pro'
      ]

      for (const fb of fallbackModels) {
        try {
          const fbResp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers,
            body: JSON.stringify({ ...requestBody, model: fb })
          })
          if (fbResp.ok) {
            if (stream) return fbResp
            const d = await fbResp.json()
            return d.choices?.[0]?.message?.content || ''
          }
        } catch {
          continue
        }
      }

      throw new Error('Все модели недоступны из-за превышения лимитов')
    }

    throw new Error(`OpenRouter API error: ${response.status}`)
  }

  if (stream) {
    return response
  }

  const json = await response.json()
  return json.choices?.[0]?.message?.content || ''
}
