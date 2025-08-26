import { NextRequest, NextResponse } from 'next/server'
import { checkDailyLimits } from '@/lib/daily-limits'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Проверяем аутентификацию
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Получаем данные пользователя
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('is_pro, pro_plan_type')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
    }

    // Проверяем дневные лимиты
    const dailyLimitCheck = await checkDailyLimits(user.id, userData.is_pro || false)

    // Получаем информацию о токенах
    const today = new Date().toISOString().split('T')[0]
    const { data: dailyUsage } = await supabaseAdmin
      .from('daily_usage')
      .select('tokens_used')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    const limits = (userData.is_pro || false) ? { requests: 100, tokens: 25000 } : { requests: 20, tokens: 5000 }
    const tokensUsed = dailyUsage?.tokens_used || 0

    return NextResponse.json({
      isPro: userData.is_pro || false,
      proPlanType: userData.pro_plan_type,
      dailyLimits: {
        allowed: dailyLimitCheck.allowed,
        limit: dailyLimitCheck.limit,
        used: dailyLimitCheck.used,
        remaining: dailyLimitCheck.remaining,
        reason: dailyLimitCheck.reason
      },
      dailyTokens: {
        limit: limits.tokens,
        used: tokensUsed,
        remaining: Math.max(0, limits.tokens - tokensUsed)
      }
    })

  } catch (error) {
    console.error('Ошибка получения дневных лимитов:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
