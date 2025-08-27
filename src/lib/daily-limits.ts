// @ts-nocheck
import { supabaseAdmin } from './supabase'

export interface DailyLimitCheck {
  allowed: boolean
  reason?: string
  limit: number
  used: number
  remaining: number
}

// Лимиты для разных типов пользователей
const DAILY_LIMITS = {
  free: {
    requests: 20, // 20 запросов в день для бесплатных
    tokens: 5000 // 5k токенов в день
  },
  pro: {
    requests: 100, // 100 запросов в день для PRO
    tokens: 25000 // 25k токенов в день
  }
}

export async function checkDailyLimits(userId: string, isPro: boolean): Promise<DailyLimitCheck> {
  const today = new Date().toISOString().split('T')[0]
  const limits = isPro ? DAILY_LIMITS.pro : DAILY_LIMITS.free

  try {
    // Получаем или создаем запись о дневном использовании
    const { data: dailyUsage, error: fetchError } = await supabaseAdmin
      .from('daily_usage')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Ошибка получения дневного использования:', fetchError)
      return { allowed: false, reason: 'DATABASE_ERROR', limit: limits.requests, used: 0, remaining: 0 }
    }

    let currentUsage = dailyUsage || {
      user_id: userId,
      date: today,
      requests_count: 0,
      tokens_used: 0
    }

    // Проверяем лимит запросов
    if (currentUsage.requests_count >= limits.requests) {
      return {
        allowed: false,
        reason: 'DAILY_REQUEST_LIMIT_EXCEEDED',
        limit: limits.requests,
        used: currentUsage.requests_count,
        remaining: 0
      }
    }

    // Проверяем лимит токенов
    if (currentUsage.tokens_used >= limits.tokens) {
      return {
        allowed: false,
        reason: 'DAILY_TOKEN_LIMIT_EXCEEDED',
        limit: limits.tokens,
        used: currentUsage.tokens_used,
        remaining: 0
      }
    }

    return {
      allowed: true,
      limit: limits.requests,
      used: currentUsage.requests_count,
      remaining: limits.requests - currentUsage.requests_count
    }

  } catch (error) {
    console.error('Ошибка проверки дневных лимитов:', error)
    return { allowed: false, reason: 'DATABASE_ERROR', limit: limits.requests, used: 0, remaining: 0 }
  }
}

export async function updateDailyUsage(userId: string, tokensUsed: number): Promise<void> {
  const today = new Date().toISOString().split('T')[0]

  try {
    // Используем upsert для создания или обновления записи
    const { error } = await supabaseAdmin
      .from('daily_usage')
      .upsert({
        user_id: userId,
        date: today,
        requests_count: 1, // Увеличиваем счетчик запросов
        tokens_used: tokensUsed,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,date',
        ignoreDuplicates: false
      })

    if (error) {
      console.error('Ошибка обновления дневного использования:', error)
    }

  } catch (error) {
    console.error('Ошибка обновления дневного использования:', error)
  }
}

export async function incrementDailyUsage(userId: string, tokensUsed: number): Promise<void> {
  const today = new Date().toISOString().split('T')[0]

  try {
    // Сначала получаем текущие значения
    const { data: currentUsage, error: fetchError } = await supabaseAdmin
      .from('daily_usage')
      .select('requests_count, tokens_used')
      .eq('user_id', userId)
      .eq('date', today)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Ошибка получения текущего использования:', fetchError)
      return
    }

    if (currentUsage) {
      // Обновляем существующую запись
      const { error: updateError } = await supabaseAdmin
        .from('daily_usage')
        .update({
          requests_count: currentUsage.requests_count + 1,
          tokens_used: currentUsage.tokens_used + tokensUsed,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('date', today)

      if (updateError) {
        console.error('Ошибка обновления дневного использования:', updateError)
      }
    } else {
      // Создаем новую запись
      const { error: insertError } = await supabaseAdmin
        .from('daily_usage')
        .insert({
          user_id: userId,
          date: today,
          requests_count: 1,
          tokens_used: tokensUsed,
          updated_at: new Date().toISOString()
        })

      if (insertError) {
        console.error('Ошибка создания записи дневного использования:', insertError)
      }
    }

  } catch (error) {
    console.error('Ошибка инкремента дневного использования:', error)
  }
}
