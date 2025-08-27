import { NextRequest, NextResponse } from 'next/server'
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
      .select('is_pro, pro_plan_type, pro_credits_remaining, pro_credits_total, pro_expires_at')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
    }

    if (!(userData as any).is_pro) {
      return NextResponse.json({ error: 'Требуется PRO подписка' }, { status: 403 })
    }

    // Получаем статистику за сегодня
    const today = new Date().toISOString().split('T')[0]
    const { data: todayUsage, error: todayError } = await supabaseAdmin
      .from('pro_usage_monitoring')
      .select('messages_count, tokens_used, credits_spent')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    // Получаем статистику за последние 7 дней
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const { data: weeklyUsage, error: weeklyError } = await supabaseAdmin
      .from('pro_usage_monitoring')
      .select('messages_count, tokens_used, credits_spent')
      .eq('user_id', user.id)
      .gte('date', sevenDaysAgo.toISOString().split('T')[0])

    // Получаем последние 10 записей использования
    const { data: recentUsage, error: recentError } = await supabaseAdmin
      .from('pro_usage_log')
      .select(`
        id,
        model_id,
        tokens_used,
        credits_spent,
        message_length,
        created_at,
        chats(title)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    // Вычисляем общую статистику за неделю
    const weeklyStats = weeklyUsage?.reduce((acc, day) => ({
      messages_count: acc.messages_count + ((day as any).messages_count || 0),
      tokens_used: acc.tokens_used + ((day as any).tokens_used || 0),
      credits_spent: acc.credits_spent + ((day as any).credits_spent || 0)
    }), { messages_count: 0, tokens_used: 0, credits_spent: 0 }) || { messages_count: 0, tokens_used: 0, credits_spent: 0 }

    return NextResponse.json({
      user: {
        is_pro: (userData as any).is_pro,
        plan_type: (userData as any).pro_plan_type,
        credits_remaining: (userData as any).pro_credits_remaining,
        credits_total: (userData as any).pro_credits_total,
        expires_at: (userData as any).pro_expires_at
      },
      today: todayUsage || { messages_count: 0, tokens_used: 0, credits_spent: 0 },
      weekly: weeklyStats,
      recent_usage: recentUsage || []
    })
  } catch (error) {
    console.error('Error fetching PRO usage:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
