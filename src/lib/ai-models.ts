import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { AIModel } from '@/types'

// DeepSeek использует OpenAI-совместимый API
const deepseek = process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY !== 'placeholder_deepseek_key' ? new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
}) : null

// Пул GPT-4o моделей (скрытые от пользователя)
const DEEPSEEK_MODEL_POOL = [
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

// Конфигурация моделей (только видимые пользователю)
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
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'openrouter',
    is_free: true,
    max_tokens: 4096,
    daily_limit: 1000,
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
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
    daily_limit: 0, // безлимит для про
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
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'openrouter',
    is_free: false,
    max_tokens: 8192,
    daily_limit: 0,
  },
]

// Инициализация клиентов (только если API ключи доступны и не являются placeholder)
const openai = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'placeholder_openai_key' ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

const anthropic = process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'placeholder_anthropic_key' ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
}) : null

export async function generateResponse(
  modelId: string,
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
  stream: boolean = false,
  userSettings?: { ai_rules?: string; user_preferences?: string }
): Promise<any> {
  console.log('Ищем модель:', modelId)
  
  // Если запрошена модель "deepseek", выбираем случайную из пула
  let actualModelId = modelId
  if (modelId === 'deepseek') {
    actualModelId = getRandomDeepSeekModel()
    console.log('GPT-4o: выбрана модель из пула:', actualModelId)
  }
  
  const model = AI_MODELS.find(m => m.id === modelId)
  if (!model) {
    console.log('Доступные модели:', AI_MODELS.map(m => m.id))
    throw new Error('Модель не найдена')
  }
  
  console.log('Найдена модель:', model)

  // Применяем правила ИИ к сообщениям
  let enhancedMessages = [...messages]
  
  if (userSettings && userSettings.ai_rules && userSettings.ai_rules.trim()) {
    // Добавляем системное сообщение с правилами ИИ
    const systemMessage = {
      role: 'system' as const,
      content: `Ты - полезный ИИ-ассистент. Следуй этим правилам:\n\n${userSettings.ai_rules}`
    }
    
    // Вставляем системное сообщение в начало
    enhancedMessages = [systemMessage, ...messages]
    
    console.log('Применены правила ИИ:', userSettings.ai_rules)
  }

  try {
    if (model.provider === 'openrouter') {
      console.log('Используем OpenRouter для модели:', actualModelId)
      console.log('OPENROUTER_API_KEY доступен:', !!process.env.OPENROUTER_API_KEY)
      console.log('OPENROUTER_API_KEY первые 10 символов:', process.env.OPENROUTER_API_KEY?.substring(0, 10))
      console.log('OPENROUTER_API_KEY полная длина:', process.env.OPENROUTER_API_KEY?.length)
      
      if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'placeholder_openrouter_key') {
        throw new Error('OpenRouter API ключ не настроен или является placeholder')
      }
      
      const requestBody = {
        model: actualModelId,
        messages: enhancedMessages,
        stream: stream,
        max_tokens: model.max_tokens
      }
      
      console.log('OpenRouter запрос:', requestBody)
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'ChatAI App'
        },
        body: JSON.stringify(requestBody)
      })
      
      console.log('OpenRouter статус ответа:', response.status)

      if (!response.ok) {
        if (response.status === 429) {
          console.log('OpenRouter: превышен лимит запросов, пробуем fallback модели...')
          // Пробуем fallback на другие модели в порядке приоритета
          const fallbackModels = [
            // Сначала пробуем другие модели из пула GPT-4o
            ...DEEPSEEK_MODEL_POOL.filter(id => id !== actualModelId),
            
            // Затем классические fallback модели
            'gpt-3.5-turbo',
            'claude-3-haiku',
            'gemini-pro'
          ]
          
          for (const fallbackModel of fallbackModels) {
            try {
              console.log(`Пробуем fallback модель: ${fallbackModel}`)
              const fallbackResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                  'Content-Type': 'application/json',
                  'HTTP-Referer': 'http://localhost:3000',
                  'X-Title': 'ChatAI App'
                },
                body: JSON.stringify({
                  ...requestBody,
                  model: fallbackModel
                })
              })
              
              if (fallbackResponse.ok) {
                console.log(`Fallback модель ${fallbackModel} работает`)
                if (stream) {
                  return fallbackResponse
                } else {
                  const data = await fallbackResponse.json()
                  return data.choices[0]?.message?.content || ''
                }
              }
            } catch (fallbackError) {
              console.log(`Fallback модель ${fallbackModel} не работает:`, fallbackError)
              continue
            }
          }
          
          throw new Error('Все модели недоступны из-за превышения лимитов')
        } else {
          throw new Error(`OpenRouter API error: ${response.status}`)
        }
      }

      if (stream) {
        // Возвращаем Response для стриминга
        return response
      } else {
        const data = await response.json()
        return data.choices[0]?.message?.content || ''
      }
    } else if (model.provider === 'deepseek') {
      if (!deepseek) {
        throw new Error('DeepSeek API ключ не настроен')
      }
      if (stream) {
        return await deepseek.chat.completions.create({
          model: modelId,
          messages: enhancedMessages as any,
          stream: true,
        })
      } else {
        const response = await deepseek.chat.completions.create({
          model: modelId,
          messages: enhancedMessages as any,
        })
        return response.choices[0]?.message?.content || ''
      }
    } else if (model.provider === 'openai') {
      if (!openai) {
        throw new Error('OpenAI API ключ не настроен')
      }
      if (stream) {
        return await openai.chat.completions.create({
          model: modelId,
          messages: enhancedMessages as any,
          stream: true,
        })
      } else {
        const response = await openai.chat.completions.create({
          model: modelId,
          messages: enhancedMessages as any,
        })
        return response.choices[0]?.message?.content || ''
      }
    } else if (model.provider === 'anthropic') {
      if (!anthropic) {
        throw new Error('Anthropic API ключ не настроен')
      }
      if (stream) {
        return await anthropic.messages.create({
          model: modelId,
          max_tokens: model.max_tokens,
          messages: enhancedMessages.map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content,
          })),
          stream: true,
        })
      } else {
        const response = await anthropic.messages.create({
          model: modelId,
          max_tokens: model.max_tokens,
          messages: enhancedMessages.map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content,
          })),
        })
        return response.content[0]?.type === 'text' ? response.content[0].text : ''
      }
    }
  } catch (error) {
    console.error('Ошибка генерации ответа:', error)
    
    // Проверяем, является ли ошибка связанной с лимитами
    if (error instanceof Error && error.message.includes('429')) {
      throw new Error('Превышен лимит запросов к AI модели. Попробуйте позже или обновите план.')
    } else if (error instanceof Error && error.message.includes('Все модели недоступны')) {
      throw new Error('Все AI модели временно недоступны из-за превышения лимитов. Попробуйте позже.')
    } else {
      throw new Error('Ошибка при генерации ответа. Попробуйте еще раз.')
    }
  }
}

export function estimateTokens(text: string): number {
  // Простая оценка токенов (примерно 4 символа = 1 токен)
  return Math.ceil(text.length / 4)
}

// Функция для получения случайной модели из пула GPT-4o
export function getRandomDeepSeekModel(): string {
  const randomIndex = Math.floor(Math.random() * DEEPSEEK_MODEL_POOL.length)
  return DEEPSEEK_MODEL_POOL[randomIndex]
}

// Функция для получения случайной модели из списка доступных
export function getRandomAvailableModel(): string {
  const availableModels = AI_MODELS.filter(model => model.is_free)
  const randomIndex = Math.floor(Math.random() * availableModels.length)
  return availableModels[randomIndex].id
}

// Функция для получения следующей модели в fallback списке
export function getNextFallbackModel(currentModel: string): string | null {
  const fallbackModels = [
    ...DEEPSEEK_MODEL_POOL, // Пул GPT-4o моделей
    'gpt-3.5-turbo',
    'claude-3-haiku',
    'gemini-pro'
  ]
  
  const currentIndex = fallbackModels.indexOf(currentModel)
  if (currentIndex === -1 || currentIndex === fallbackModels.length - 1) {
    return null
  }
  
  return fallbackModels[currentIndex + 1]
}
