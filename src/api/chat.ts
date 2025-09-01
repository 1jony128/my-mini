import { generateResponse, estimateTokens } from '@/lib/ai-models'
import { supabase } from '@/lib/supabase'

interface ChatRequest {
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[]
  model: string
  chatId: string
}

export async function sendChatMessage(request: ChatRequest, accessToken: string): Promise<Response> {
  try {
    // Проверяем аутентификацию
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Получаем данные пользователя
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('tokens_balance, daily_tokens_used, is_pro')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      throw new Error('Пользователь не найден')
    }

    // Проверяем лимиты для бесплатных пользователей
    if (!userData.is_pro) {
      const remainingTokens = Math.max(0, (userData.tokens_balance || 1250) - (userData.daily_tokens_used || 0))
      const estimatedTokens = estimateTokens(request.messages[request.messages.length - 1].content)
      
      if (remainingTokens < estimatedTokens) {
        throw new Error('Недостаточно токенов. Обновите план или купите токены.')
      }
    }

    // Сохраняем сообщение пользователя
    const { error: userMsgError } = await supabase
      .from('messages')
      .insert({
        chat_id: request.chatId,
        user_id: user.id,
        content: request.messages[request.messages.length - 1].content,
        role: 'user',
        model: request.model,
        tokens_used: estimateTokens(request.messages[request.messages.length - 1].content),
        created_at: new Date().toISOString(),
      })

    if (userMsgError) {
      console.error('Ошибка сохранения сообщения пользователя:', userMsgError)
    }

    // Ограничиваем контекст для бесплатных моделей (последние 10 сообщений)
    const limitedMessages = request.messages.slice(-10)
    
    // Получаем ответ от AI с стримингом
    const stream = await generateResponse(request.model, limitedMessages, true)

    if (!stream) {
      throw new Error('Не удалось получить ответ от AI модели')
    }

    // Обрабатываем стрим
    const reader = stream.body?.getReader()
    if (!reader) {
      throw new Error('Stream error')
    }

    const encoder = new TextEncoder()
    let fullResponse = ''

    const readable = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = new TextDecoder().decode(value)
            const lines = chunk.split('\n')

            for (const rawLine of lines) {
              const line = rawLine.trim()
              if (!line) continue

              // Поддержка SSE формата "data: ..." и сырого JSON
              const payload = line.startsWith('data: ') ? line.slice(6) : line

              if (payload === '[DONE]') {
                // Сохраняем ответ AI
                if (fullResponse) {
                  const { error: aiMsgError } = await supabase
                    .from('messages')
                    .insert({
                      chat_id: request.chatId,
                      user_id: user.id,
                      content: fullResponse,
                      role: 'assistant',
                      model: request.model,
                      tokens_used: estimateTokens(fullResponse),
                      created_at: new Date().toISOString(),
                    })

                  if (aiMsgError) {
                    console.error('Ошибка сохранения ответа AI:', aiMsgError)
                  }
                  
                  // Обновляем дневное использование
                  const tokensUsed = estimateTokens(fullResponse)
                  await supabase
                    .from('users')
                    .update({ 
                      daily_tokens_used: (userData.daily_tokens_used || 0) + tokensUsed 
                    })
                    .eq('id', user.id)
                }
                break
              }

              try {
                const parsed = JSON.parse(payload)

                // OpenRouter/Grok форматы:
                // - parsed.choices[0].delta.content (частичный чанк)
                // - parsed.choices[0].message.content (финальный без стрима)
                // - parsed.content (наш внутренний формат)
                const deltaContent = parsed?.choices?.[0]?.delta?.content
                const finalMessageContent = parsed?.choices?.[0]?.message?.content
                const simpleContent = parsed?.content

                const piece = (typeof deltaContent === 'string' && deltaContent.length > 0)
                  ? deltaContent
                  : (typeof simpleContent === 'string' && simpleContent.length > 0)
                    ? simpleContent
                    : (typeof finalMessageContent === 'string' && finalMessageContent.length > 0)
                      ? finalMessageContent
                      : ''

                if (piece) {
                  fullResponse += piece
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: piece })}\n\n`))
                }
              } catch (e) {
                // Игнорируем ошибки парсинга
              }
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        } catch (error) {
          console.error('Ошибка обработки стрима:', error)
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('Ошибка API чата:', error)
    throw error
  }
}
