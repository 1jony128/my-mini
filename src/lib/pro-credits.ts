import { supabaseAdmin } from './supabase'

// Коэффициенты стоимости для разных моделей (базовая стоимость = 1 кредит)
export const MODEL_COST_MULTIPLIERS = {
  // Бесплатные модели (базовая стоимость)
  'deepseek': 1,
  'gpt-3.5-turbo': 1,
  'claude-3-haiku': 1,
  'gemini-pro': 1,
  
  // Средние модели (2-3x стоимость)
  'gpt-4': 3,
  'claude-3-sonnet': 2.5,
  'gemini-pro-vision': 2,
  'grok-beta': 2.5,
  
  // Премиум модели (4-8x стоимость)
  'gpt-4-turbo': 4,
  'claude-3-opus': 6,
  'gpt-4o': 5,
  'gpt-4o-mini': 2.5,
  
  // Экспериментальные/новые модели (высокая стоимость)
  'deepseek/deepseek-r1:free': 1,
  'deepseek/deepseek-chat-v3-0324:free': 1.5,
  'deepseek/deepseek-r1-0528:free': 1.2,
  'qwen/qwen3-235b-a22b:free': 2,
  'meta-llama/llama-3.3-70b-instruct:free': 3,
  'google/gemini-2.0-flash-exp:free': 2.5,
} as const

// Лимиты кредитов для разных планов
export const PRO_PLAN_LIMITS = {
  weekly: {
    credits: 100,
    daily_messages: 30,
    daily_tokens: 15000,
    hourly_messages: 8,
    max_model_cost: 4 // Максимальный коэффициент модели для недельного плана
  },
  monthly: {
    credits: 400,
    daily_messages: 80,
    daily_tokens: 40000,
    hourly_messages: 15,
    max_model_cost: 6 // Максимальный коэффициент модели для месячного плана
  },
  yearly: {
    credits: 5000,
    daily_messages: 150,
    daily_tokens: 75000,
    hourly_messages: 25,
    max_model_cost: 8 // Максимальный коэффициент модели для годового плана
  }
} as const

// Уровни предупреждений
export const WARNING_LEVELS = {
  WARNING: 0.7,    // 70% от лимита - предупреждение
  THROTTLE: 0.9,   // 90% от лимита - замедление
  BLOCK: 1.0       // 100% от лимита - блокировка
} as const

export interface ProUsageData {
  messages_count: number
  tokens_used: number
  credits_spent: number
  warnings_issued: number
}

export interface ProLimitCheck {
  allowed: boolean
  reason?: string
  remaining?: number
  needed?: number
  limit?: number
  used?: number
  model_cost?: number
  plan_max_cost?: number
}

// Получить стоимость модели в кредитах
export function getModelCost(modelId: string): number {
  // Нормализуем ID модели
  const normalizedId = modelId.includes('/') ? modelId : modelId.toLowerCase()
  return MODEL_COST_MULTIPLIERS[normalizedId as keyof typeof MODEL_COST_MULTIPLIERS] || 1
}

// Получить лимиты для плана
export function getPlanLimits(planType: keyof typeof PRO_PLAN_LIMITS) {
  return PRO_PLAN_LIMITS[planType]
}

// Проверить доступность модели для плана
export function isModelAvailableForPlan(modelId: string, planType: keyof typeof PRO_PLAN_LIMITS): boolean {
  const modelCost = getModelCost(modelId)
  const planLimits = getPlanLimits(planType)
  return modelCost <= planLimits.max_model_cost
}

// Получить доступные модели для плана
export function getAvailableModelsForPlan(planType: keyof typeof PRO_PLAN_LIMITS): string[] {
  const planLimits = getPlanLimits(planType)
  return Object.keys(MODEL_COST_MULTIPLIERS).filter(modelId => 
    MODEL_COST_MULTIPLIERS[modelId as keyof typeof MODEL_COST_MULTIPLIERS] <= planLimits.max_model_cost
  )
}

// Проверить лимиты PRO пользователя
export async function checkProLimits(userId: string, modelId: string): Promise<ProLimitCheck> {
  try {
    // Получаем данные пользователя
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('pro_plan_type, pro_credits_remaining, is_pro, pro_expires_at')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return { allowed: false, reason: 'USER_NOT_FOUND' }
    }

    // Проверяем, что пользователь PRO и подписка активна
    if (!user.is_pro || !user.pro_plan_type || !user.pro_expires_at) {
      return { allowed: false, reason: 'NOT_PRO_USER' }
    }

    // Проверяем, что подписка не истекла
    if (new Date(user.pro_expires_at) < new Date()) {
      return { allowed: false, reason: 'SUBSCRIPTION_EXPIRED' }
    }

    const planType = user.pro_plan_type as keyof typeof PRO_PLAN_LIMITS
    const planLimits = getPlanLimits(planType)
    const modelCost = getModelCost(modelId)

    // Проверяем доступность модели для плана
    if (!isModelAvailableForPlan(modelId, planType)) {
      return {
        allowed: false,
        reason: 'MODEL_NOT_AVAILABLE_FOR_PLAN',
        model_cost: modelCost,
        plan_max_cost: planLimits.max_model_cost
      }
    }

    // Проверяем остаток кредитов
    if (user.pro_credits_remaining < modelCost) {
      return {
        allowed: false,
        reason: 'INSUFFICIENT_CREDITS',
        remaining: user.pro_credits_remaining,
        needed: modelCost,
        model_cost: modelCost
      }
    }

    // Проверяем дневные лимиты
    const today = new Date().toISOString().split('T')[0]
    const { data: dailyUsage, error: dailyError } = await supabaseAdmin
      .from('pro_usage_monitoring')
      .select('messages_count, tokens_used')
      .eq('user_id', userId)
      .eq('date', today)
      .single()

    if (!dailyError && dailyUsage) {
      // Проверяем лимит сообщений
      if (dailyUsage.messages_count >= planLimits.daily_messages) {
        return {
          allowed: false,
          reason: 'DAILY_MESSAGE_LIMIT_EXCEEDED',
          limit: planLimits.daily_messages,
          used: dailyUsage.messages_count
        }
      }

      // Проверяем лимит токенов
      if (dailyUsage.tokens_used >= planLimits.daily_tokens) {
        return {
          allowed: false,
          reason: 'DAILY_TOKEN_LIMIT_EXCEEDED',
          limit: planLimits.daily_tokens,
          used: dailyUsage.tokens_used
        }
      }
    }

    return { 
      allowed: true, 
      model_cost: modelCost,
      plan_max_cost: planLimits.max_model_cost
    }
  } catch (error) {
    console.error('Error checking PRO limits:', error)
    return { allowed: false, reason: 'SYSTEM_ERROR' }
  }
}

// Обновить использование PRO
export async function updateProUsage(
  userId: string, 
  chatId: string, 
  modelId: string, 
  tokensUsed: number, 
  messageLength: number
): Promise<void> {
  try {
    const creditsSpent = getModelCost(modelId)
    const today = new Date().toISOString().split('T')[0]

    // Обновляем кредиты пользователя
    const { error: userError } = await supabaseAdmin
      .from('users')
      .update({ 
        pro_credits_remaining: supabaseAdmin.sql`GREATEST(0, COALESCE(pro_credits_remaining, 0) - ${creditsSpent})`
      })
      .eq('id', userId)

    if (userError) {
      console.error('Error updating user credits:', userError)
    }

    // Добавляем запись в лог использования
    const { error: logError } = await supabaseAdmin
      .from('pro_usage_log')
      .insert({
        user_id: userId,
        chat_id: chatId,
        model_id: modelId,
        tokens_used: tokensUsed,
        credits_spent: creditsSpent,
        message_length: messageLength,
        model_cost_multiplier: creditsSpent
      } as any)

    if (logError) {
      console.error('Error adding usage log:', logError)
    }

    // Обновляем дневной мониторинг
    const { data: existingMonitoring, error: monitoringError } = await supabaseAdmin
      .from('pro_usage_monitoring')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single()

    if (monitoringError && monitoringError.code !== 'PGRST116') {
      console.error('Error checking monitoring:', monitoringError)
      return
    }

    if (existingMonitoring) {
      // Обновляем существующую запись
      const { error: updateError } = await supabaseAdmin
        .from('pro_usage_monitoring')
        .update({
          messages_count: (existingMonitoring as any).messages_count + 1,
          tokens_used: (existingMonitoring as any).tokens_used + tokensUsed,
          credits_spent: (existingMonitoring as any).credits_spent + creditsSpent
        } as any)
        .eq('id', (existingMonitoring as any).id)

      if (updateError) {
        console.error('Error updating monitoring:', updateError)
      }
    } else {
      // Создаем новую запись
      const { error: insertError } = await supabaseAdmin
        .from('pro_usage_monitoring')
        .insert({
          user_id: userId,
          date: today,
          messages_count: 1,
          tokens_used: tokensUsed,
          credits_spent: creditsSpent
        } as any)

      if (insertError) {
        console.error('Error creating monitoring:', insertError)
      }
    }

    // Проверяем лимиты и отправляем предупреждения
    await checkAndSendWarnings(userId, today)
  } catch (error) {
    console.error('Error updating PRO usage:', error)
  }
}

// Проверить лимиты и отправить предупреждения
async function checkAndSendWarnings(userId: string, date: string): Promise<void> {
  try {
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('pro_plan_type')
      .eq('id', userId)
      .single()

    if (!user?.pro_plan_type) return

    const planType = (user as any).pro_plan_type as keyof typeof PRO_PLAN_LIMITS
    const planLimits = getPlanLimits(planType)

    const { data: dailyUsage } = await supabaseAdmin
      .from('pro_usage_monitoring')
      .select('messages_count, tokens_used')
      .eq('user_id', userId)
      .eq('date', date)
      .single()

    if (!dailyUsage) return

    // Проверяем лимиты и отправляем предупреждения
    const messageUsagePercentage = (dailyUsage as any).messages_count / planLimits.daily_messages
    const tokenUsagePercentage = (dailyUsage as any).tokens_used / planLimits.daily_tokens

    if (messageUsagePercentage > WARNING_LEVELS.WARNING || tokenUsagePercentage > WARNING_LEVELS.WARNING) {
      // Здесь можно добавить отправку уведомления пользователю
      console.log(`Warning: User ${userId} is approaching limits`)
    }

    if (messageUsagePercentage >= WARNING_LEVELS.BLOCK || tokenUsagePercentage >= WARNING_LEVELS.BLOCK) {
      // Здесь можно добавить временное ограничение доступа
      console.log(`Block: User ${userId} has exceeded limits`)
    }
  } catch (error) {
    console.error('Error checking warnings:', error)
  }
}

// Сбросить кредиты при продлении подписки
export async function resetProCredits(userId: string, planType: keyof typeof PRO_PLAN_LIMITS): Promise<void> {
  try {
    const planLimits = getPlanLimits(planType)
    
    const { error } = await supabaseAdmin
      .from('users')
      .update({
        pro_plan_type: planType,
        pro_credits_remaining: planLimits.credits,
        pro_credits_total: planLimits.credits,
        pro_usage_warnings: 0,
        pro_last_reset_date: new Date().toISOString()
      } as any)
      .eq('id', userId)

    if (error) {
      console.error('Error resetting PRO credits:', error)
    }
  } catch (error) {
    console.error('Error resetting PRO credits:', error)
  }
}
