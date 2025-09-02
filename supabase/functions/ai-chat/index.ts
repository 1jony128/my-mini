import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

// Конфигурация моделей с fallbacks
const MODEL_CONFIG = {
  // Платные модели - прямой fallback на Grok
  'gpt-4': {
    primary: { provider: 'grok', model: 'grok-4-latest' },
    fallback: { provider: 'grok', model: 'grok-4-latest' }
  },
  'gpt-4-turbo': {
    primary: { provider: 'grok', model: 'grok-4-latest' },
    fallback: { provider: 'grok', model: 'grok-4-latest' }
  },
  'claude-3-sonnet': {
    primary: { provider: 'grok', model: 'grok-4-latest' },
    fallback: { provider: 'grok', model: 'grok-4-latest' }
  },
  'claude-3-opus-max': {
    primary: { provider: 'grok', model: 'grok-4-latest' },
    fallback: { provider: 'grok', model: 'grok-4-latest' }
  },
  // Бесплатные модели - OpenRouter с рандомным выбором из пула
  'deepseek': {
    primary: { provider: 'openrouter', model: 'deepseek/deepseek-chat' },
    fallback: { provider: 'openrouter', model: 'meta-llama/llama-2-70b-chat' }
  },
  'gpt-3.5-turbo': {
    primary: { provider: 'openrouter', model: 'openai/gpt-3.5-turbo' },
    fallback: { provider: 'openrouter', model: 'deepseek/deepseek-chat' }
  },
  'gemini-pro': {
    primary: { provider: 'openrouter', model: 'google/gemini-pro' },
    fallback: { provider: 'openrouter', model: 'deepseek/deepseek-chat' }
  }
}

async function callOpenRouter(model: string, messages: ChatMessage[], stream: boolean = false) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://aichat-pro.ru',
      'X-Title': 'ChatAI PRO'
    },
    body: JSON.stringify({
      model,
      messages,
      stream,
      temperature: 0.7,
      max_tokens: 4096
    })
  })

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`)
  }

  return response
}

async function callGrok(model: string, messages: ChatMessage[], stream: boolean = false) {
  try {
    console.log(`Calling Grok API with model: ${model}`)
    
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('GROK_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        stream,
        temperature: 0.7,
        max_tokens: 4096
      })
    })

    console.log(`Grok API response status: ${response.status}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Grok API error ${response.status}:`, errorText)
      throw new Error(`Grok API error: ${response.status} - ${errorText}`)
    }

    return response
  } catch (error) {
    console.error('Grok API call failed:', error)
    throw error
  }
}

async function generateAIResponse(modelId: string, messages: ChatMessage[], stream: boolean = false) {
  const config = MODEL_CONFIG[modelId as keyof typeof MODEL_CONFIG]
  if (!config) {
    throw new Error(`Unsupported model: ${modelId}`)
  }

  // Для платных моделей (GPT-4, Claude) используем только Grok
  if (['gpt-4', 'gpt-4-turbo', 'claude-3-sonnet', 'claude-3-opus-max'].includes(modelId)) {
    try {
      // Для Grok используем правильное название модели (как было в старом коде)
      return await callGrok('grok-4-latest', messages, stream)
    } catch (error) {
      console.error(`Grok failed for ${modelId}:`, error)
      throw new Error(`Grok service unavailable for ${modelId}`)
    }
  }

  // Для бесплатных моделей пробуем OpenRouter с fallback
  try {
    // Пробуем основной провайдер
    if (config.primary.provider === 'openrouter') {
      return await callOpenRouter(config.primary.model, messages, stream)
    } else if (config.primary.provider === 'grok') {
      return await callGrok(config.primary.model, messages, stream)
    }
  } catch (error) {
    console.log(`Primary provider failed for ${modelId}, trying fallback:`, error)
    
    // Пробуем fallback
    try {
      if (config.fallback.provider === 'openrouter') {
        return await callOpenRouter(config.fallback.model, messages, stream)
      } else if (config.fallback.provider === 'grok') {
        return await callGrok(config.fallback.model, messages, stream)
      }
    } catch (fallbackError) {
      console.error(`Both primary and fallback failed for ${modelId}:`, fallbackError)
      throw new Error(`All providers failed for model ${modelId}`)
    }
  }

  throw new Error(`No valid provider configuration for ${modelId}`)
}

function estimateTokens(text: string): number {
  // Примерная оценка токенов (1 токен ≈ 4 символа для русского языка)
  return Math.ceil(text.length / 3)
}

async function checkUserLimits(supabase: any, userId: string, estimatedTokens: number) {
  try {
    // Получаем данные пользователя
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('tokens_balance, daily_tokens_used, is_pro')
      .eq('id', userId)
      .single()

    if (userError || !userData) {
      console.log('User not found in users table, using default limits')
      // Если пользователь не найден, используем базовые лимиты
      return {
        tokens_balance: 1000,
        daily_tokens_used: 0,
        is_pro: false,
        daily_limit: 1250
      }
    }

    // Получаем сегодняшнее использование из таблицы daily_usage
    const today = new Date().toISOString().split('T')[0]
    const { data: dailyUsage, error: dailyError } = await supabase
      .from('daily_usage')
      .select('tokens_used, requests_count')
      .eq('user_id', userId)
      .eq('date', today)
      .single()

    let todayTokensUsed = 0
    if (!dailyError && dailyUsage) {
      todayTokensUsed = dailyUsage.tokens_used || 0
    }

    // Проверяем лимиты для бесплатных пользователей
    if (!userData.is_pro) {
      const dailyLimit = 1250 // Фиксированный лимит для бесплатных пользователей
      const remainingTokens = Math.max(0, dailyLimit - todayTokensUsed)
      
      if (remainingTokens < estimatedTokens) {
        throw new Error('Daily token limit exceeded. Please upgrade to PRO or wait until tomorrow.')
      }
    }

    return {
      ...userData,
      daily_limit: 1250,
      daily_tokens_used: todayTokensUsed
    }
  } catch (error) {
    console.error('Error in checkUserLimits:', error)
    // В случае ошибки, разрешаем запрос с базовыми лимитами
    return {
      tokens_balance: 1000,
      daily_tokens_used: 0,
      is_pro: false,
      daily_limit: 1250
    }
  }
}

async function updateTokenUsage(supabase: any, userId: string, tokensUsed: number) {
  try {
    const today = new Date().toISOString().split('T')[0]
    
    // Сначала проверяем, есть ли уже запись на сегодня
    const { data: existingRecord, error: selectError } = await supabase
      .from('daily_usage')
      .select('id, tokens_used, requests_count')
      .eq('user_id', userId)
      .eq('date', today)
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      // PGRST116 = "не найдено", это нормально для первого запроса дня
      console.error('Error checking existing daily_usage:', selectError)
    }

    if (existingRecord) {
      // Обновляем существующую запись
      const { error: updateError } = await supabase
        .from('daily_usage')
        .update({
          tokens_used: existingRecord.tokens_used + tokensUsed,
          requests_count: existingRecord.requests_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingRecord.id)

      if (updateError) {
        console.error('Failed to update existing daily_usage:', updateError)
      }
    } else {
      // Создаем новую запись на сегодня
      const { error: insertError } = await supabase
        .from('daily_usage')
        .insert({
          user_id: userId,
          date: today,
          tokens_used: tokensUsed,
          requests_count: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      
      if (insertError) {
        console.error('Failed to insert new daily_usage:', insertError)
      }
    }
  } catch (error) {
    console.error('Error updating token usage:', error)
    // Игнорируем ошибки обновления токенов
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Проверяем авторизацию
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Invalid authentication token')
    }

    const { messages, model, chatId, stream = true }: ChatRequest = await req.json()

    if (!messages || !model || !chatId) {
      throw new Error('Missing required fields: messages, model, chatId')
    }

    // Оцениваем токены для запроса
    const userMessage = messages[messages.length - 1]
    const estimatedTokens = estimateTokens(userMessage.content)

    // Проверяем лимиты пользователя
    const userData = await checkUserLimits(supabase, user.id, estimatedTokens)

    // Сохраняем сообщение пользователя
    const { error: userMsgError } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        user_id: user.id,
        content: userMessage.content,
        role: 'user',
        model: model,
        tokens_used: estimatedTokens,
        created_at: new Date().toISOString()
      })

    if (userMsgError) {
      console.error('Error saving user message:', userMsgError)
    }

    // Ограничиваем историю последними 10 сообщениями
    const limitedMessages = messages.slice(-10)

    // Получаем ответ от AI
    const aiResponse = await generateAIResponse(model, limitedMessages, stream)

    if (stream) {
      // Для streaming ответов
      const readable = new ReadableStream({
        async start(controller) {
          const reader = aiResponse.body?.getReader()
          if (!reader) {
            controller.close()
            return
          }

          let fullResponse = ''
          const encoder = new TextEncoder()

          try {
            while (true) {
              const { done, value } = await reader.read()
              if (done) break

              const chunk = new TextDecoder().decode(value)
              const lines = chunk.split('\n')

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6)
                  if (data === '[DONE]') {
                    // Сохраняем полный ответ AI
                    if (fullResponse.trim()) {
                      await supabase
                        .from('messages')
                        .insert({
                          chat_id: chatId,
                          user_id: user.id,
                          content: fullResponse,
                          role: 'assistant',
                          model: model,
                          tokens_used: estimateTokens(fullResponse),
                          created_at: new Date().toISOString()
                        })

                      // Обновляем использование токенов
                      await updateTokenUsage(supabase, user.id, estimatedTokens + estimateTokens(fullResponse))
                    }
                    
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                    controller.close()
                    return
                  }

                  try {
                    const parsed = JSON.parse(data)
                    if (parsed.choices?.[0]?.delta?.content) {
                      fullResponse += parsed.choices[0].delta.content
                    }
                  } catch (e) {
                    // Игнорируем ошибки парсинга
                  }

                  controller.enqueue(encoder.encode(`${line}\n\n`))
                }
              }
            }
          } catch (error) {
            console.error('Streaming error:', error)
            controller.error(error)
          }
        }
      })

      return new Response(readable, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        }
      })
    } else {
      // Для обычных ответов
      const data = await aiResponse.json()
      const content = data.choices?.[0]?.message?.content || ''

      if (content) {
        // Сохраняем ответ AI
        await supabase
          .from('messages')
          .insert({
            chat_id: chatId,
            user_id: user.id,
            content: content,
            role: 'assistant',
            model: model,
            tokens_used: estimateTokens(content),
            created_at: new Date().toISOString()
          })

        // Обновляем использование токенов
        await updateTokenUsage(supabase, user.id, estimatedTokens + estimateTokens(content))
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

  } catch (error) {
    console.error('AI Chat Error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
