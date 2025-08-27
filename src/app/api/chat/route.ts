import { NextRequest, NextResponse } from 'next/server'
import { generateResponse, estimateTokens } from '@/lib/ai-models'
import { checkProLimits, updateProUsage } from '@/lib/pro-credits'
import { checkDailyLimits, incrementDailyUsage } from '@/lib/daily-limits'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { messages, model, chatId } = await request.json()

    // Проверяем аутентификацию через Supabase
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Получаем данные пользователя для проверки лимитов
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('tokens_balance, daily_tokens_used, is_pro, pro_plan_type')
      .eq('id', user.id)
      .single()

    // Проверяем доступность модели для пользователя
    const { data: modelData } = await supabaseAdmin
      .from('ai_models')
      .select('is_free')
      .eq('id', model)
      .single()

    // Если модель платная и пользователь не PRO, блокируем доступ
    if (modelData && !(modelData as any).is_free && !(userData as any)?.is_pro) {
      return NextResponse.json({ 
        error: 'Эта модель доступна только для PRO пользователей. Обновитесь до PRO для доступа к платным моделям.' 
      }, { status: 403 })
    }

    // Типизируем данные пользователя
    const userDataTyped = userData as {
      tokens_balance?: number
      daily_tokens_used?: number
      is_pro?: boolean
      pro_plan_type?: string
    } | null

    if (userError || !userDataTyped) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
    }

    // Проверяем дневные лимиты для всех пользователей
    const dailyLimitCheck = await checkDailyLimits(user.id, userDataTyped.is_pro || false)
    if (!dailyLimitCheck.allowed) {
      let errorMessage = 'Превышен дневной лимит'
      
      switch (dailyLimitCheck.reason) {
        case 'DAILY_REQUEST_LIMIT_EXCEEDED':
          errorMessage = `Превышен дневной лимит запросов (${dailyLimitCheck.used}/${dailyLimitCheck.limit}). Завтра лимиты обновятся автоматически. Обновите план для увеличения лимитов.`
          break
        case 'DAILY_TOKEN_LIMIT_EXCEEDED':
          errorMessage = `Превышен дневной лимит токенов (${dailyLimitCheck.used}/${dailyLimitCheck.limit}). Завтра лимиты обновятся автоматически. Обновите план для увеличения лимитов.`
          break
        case 'DATABASE_ERROR':
          errorMessage = 'Ошибка проверки лимитов. Попробуйте позже.'
          break
      }
      
      return NextResponse.json({ error: errorMessage }, { status: 429 })
    }

    // Проверяем лимиты для PRO пользователей
    if (userDataTyped.is_pro && userDataTyped.pro_plan_type) {
      // Если модель "deepseek", используем случайную модель из пула для проверки лимитов
      const modelForLimits = model === 'deepseek' ? 'deepseek/deepseek-r1:free' : model
      const proLimitCheck = await checkProLimits(user.id, modelForLimits)
      
      if (!proLimitCheck.allowed) {
        let errorMessage = 'Превышен лимит использования'
        
        switch (proLimitCheck.reason) {
          case 'INSUFFICIENT_CREDITS':
            errorMessage = `Недостаточно кредитов. Осталось: ${proLimitCheck.remaining}, нужно: ${proLimitCheck.needed}`
            break
          case 'MODEL_NOT_AVAILABLE_FOR_PLAN':
            errorMessage = `Модель недоступна для вашего плана. Стоимость модели: ${proLimitCheck.model_cost}x, максимальная для плана: ${proLimitCheck.plan_max_cost}x. Обновите план для доступа к этой модели.`
            break
          case 'DAILY_MESSAGE_LIMIT_EXCEEDED':
            errorMessage = `Превышен дневной лимит сообщений. Лимит: ${proLimitCheck.limit}, использовано: ${proLimitCheck.used}`
            break
          case 'DAILY_TOKEN_LIMIT_EXCEEDED':
            errorMessage = `Превышен дневной лимит токенов. Лимит: ${proLimitCheck.limit}, использовано: ${proLimitCheck.used}`
            break
          case 'SUBSCRIPTION_EXPIRED':
            errorMessage = 'Подписка PRO истекла. Продлите подписку для продолжения использования.'
            break
          case 'NOT_PRO_USER':
            errorMessage = 'Эта модель доступна только для PRO пользователей.'
            break
        }
        
        return NextResponse.json({ error: errorMessage }, { status: 402 })
      }
    } else {
      // Проверяем лимиты для бесплатных пользователей
      const remainingTokens = Math.max(0, (userDataTyped.tokens_balance || 1250) - (userDataTyped.daily_tokens_used || 0))
      const estimatedTokens = estimateTokens(messages[messages.length - 1].content)
      
      if (remainingTokens < estimatedTokens) {
        return NextResponse.json(
          { error: 'Недостаточно токенов. Обновите план или купите токены.' },
          { status: 402 }
        )
      }
    }

    // Загружаем настройки пользователя
    const { data: userSettings, error: settingsError } = await supabaseAdmin
      .from('users')
      .select('ai_rules, user_preferences')
      .eq('id', user.id)
      .single()

    if (settingsError) {
      console.error('Ошибка загрузки настроек пользователя:', settingsError)
    }

               // Сохраняем сообщение пользователя
                        const { data: userMsgData, error: userMsgError } = await supabaseAdmin
               .from('messages')
               .insert({
                 chat_id: chatId,
                 user_id: user.id,
                 content: messages[messages.length - 1].content,
                 role: 'user',
                 model: model, // Сохраняем "deepseek" для пользователя
                 tokens_used: estimateTokens(messages[messages.length - 1].content),
                 created_at: new Date().toISOString(),
               } as any)
               .select()
               .single()

           if (userMsgError) {
             console.error('Ошибка сохранения сообщения пользователя:', userMsgError)
           }

          // Ограничиваем контекст для бесплатных моделей (последние 10 сообщений)
      const limitedMessages = messages.slice(-10)
      
      // Получаем ответ от AI с стримингом
      console.log('=== API CHAT DEBUG ===')
      console.log('Отправляем запрос к AI модели:', model)
      console.log('Сообщения (ограничено):', limitedMessages)
      console.log('OPENROUTER_API_KEY доступен в API:', !!process.env.OPENROUTER_API_KEY)
      console.log('OPENROUTER_API_KEY первые 10 символов в API:', process.env.OPENROUTER_API_KEY?.substring(0, 10))
      console.log('Все env переменные:', Object.keys(process.env).filter(key => key.includes('OPENROUTER')))
      
      const stream = await generateResponse(model, limitedMessages, true, userSettings || {})
    
    console.log('Получен ответ от AI:', stream)
    console.log('=== END API CHAT DEBUG ===')

    if (!stream) {
      throw new Error('Не удалось получить ответ от AI модели. Возможно, превышен лимит запросов.')
    }

    if (stream instanceof Response) {
      // Если это уже Response (для OpenRouter)
      // Нужно обработать стрим и сохранить ответ
      const reader = stream.body?.getReader()
      if (!reader) {
        return NextResponse.json({ error: 'Stream error' }, { status: 500 })
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

                                   for (const line of lines) {
                       if (line.startsWith('data: ')) {
                         const data = line.slice(6)
                         if (data === '[DONE]') {
                           // Сохраняем ответ AI
                           if (fullResponse) {
                             const { data: aiMsgData, error: aiMsgError } = await supabaseAdmin
                               .from('messages')
                               .insert({
                                 chat_id: chatId,
                                 user_id: user.id,
                                 content: fullResponse,
                                 role: 'assistant',
                                 model: model, // Сохраняем "deepseek" для пользователя
                                 tokens_used: estimateTokens(fullResponse),
                                 created_at: new Date().toISOString(),
                               } as any)
                               .select()
                               .single()

                             if (aiMsgError) {
                               console.error('Ошибка сохранения ответа AI:', aiMsgError)
                                                            } else {
                                 // Обновляем использование PRO
                                 if (userDataTyped.is_pro && userDataTyped.pro_plan_type) {
                                   const tokensUsed = estimateTokens(fullResponse)
                                   const messageLength = fullResponse.length
                                   // Используем случайную модель из пула для обновления PRO
                                   const modelForPro = model === 'deepseek' ? 'deepseek/deepseek-r1:free' : model
                                   await updateProUsage(user.id, chatId, modelForPro, tokensUsed, messageLength)
                                 }
                                 
                                 // Обновляем дневное использование для всех пользователей
                                 const tokensUsed = estimateTokens(fullResponse)
                                 await incrementDailyUsage(user.id, tokensUsed)
                               }
                           }
                           console.log('Полный ответ:', fullResponse)
                           break
                         }
                         try {
                           const parsed = JSON.parse(data)
                           if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                             const content = parsed.choices[0].delta.content
                             fullResponse += content
                             controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
                           }
                         } catch (e) {
                           // Игнорируем ошибки парсинга
                         }
                       }
                     }
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          } catch (error) {
            console.error('Ошибка обработки OpenRouter стрима:', error)
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
    }

    // Для других провайдеров создаем стрим
    const encoder = new TextEncoder()
    let fullResponse = ''

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              fullResponse += content
              const data = `data: ${JSON.stringify({ content })}\n\n`
              controller.enqueue(encoder.encode(data))
            }
          }
          
          // Сохраняем ответ AI
          const { error: aiMsgError } = await supabaseAdmin
            .from('messages')
            .insert({
              chat_id: chatId,
              user_id: user.id,
              content: fullResponse,
              role: 'assistant',
              model: model,
              tokens_used: estimateTokens(fullResponse),
              created_at: new Date().toISOString(),
            } as any)
            .select()
            .single()

          if (aiMsgError) {
            console.error('Ошибка сохранения ответа AI:', aiMsgError)
          } else {
            // Обновляем использование PRO
            if (userDataTyped.is_pro && userDataTyped.pro_plan_type) {
              const tokensUsed = estimateTokens(fullResponse)
              const messageLength = fullResponse.length
              // Используем случайную модель из пула для обновления PRO
              const modelForPro = model === 'deepseek' ? 'deepseek/deepseek-r1:free' : model
              await updateProUsage(user.id, chatId, modelForPro, tokensUsed, messageLength)
            }
            
            // Обновляем дневное использование для всех пользователей
            const tokensUsed = estimateTokens(fullResponse)
            await incrementDailyUsage(user.id, tokensUsed)
          }
          
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        } catch (error) {
          console.error('Ошибка стриминга:', error)
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
