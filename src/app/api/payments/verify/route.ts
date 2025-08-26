import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { resetProCredits } from '@/lib/pro-credits'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get('payment_id')

    if (!paymentId) {
      return NextResponse.json(
        { error: 'ID платежа не указан' },
        { status: 400 }
      )
    }

    // Получаем данные платежа из базы
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single()

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: 'Платеж не найден' },
        { status: 404 }
      )
    }

    // Проверяем статус платежа в YooKassa
    const yookassaResponse = await fetch(`https://api.yookassa.ru/v3/payments/${payment.yookassa_payment_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`).toString('base64')}`
      }
    })

    if (!yookassaResponse.ok) {
      return NextResponse.json(
        { error: 'Ошибка проверки платежа в YooKassa' },
        { status: 500 }
      )
    }

    const yookassaData = await yookassaResponse.json()

    // Если платеж успешен и еще не обработан
    if (yookassaData.status === 'succeeded' && payment.status !== 'completed') {
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select('tokens_balance, is_pro')
        .eq('id', payment.user_id)
        .single()

      if (userError) {
        return NextResponse.json(
          { error: 'Пользователь не найден' },
          { status: 404 }
        )
      }

      // Проверяем тип платежа
      const isSubscription = payment.package_id?.startsWith('subscription_')
      
      if (isSubscription) {
        // Обработка подписки
        const subscriptionType = payment.subscription_type || 'weekly'
        const subscriptionEndDate = new Date()
        
        if (subscriptionType === 'weekly') {
          subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 7)
        } else if (subscriptionType === 'monthly') {
          subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1)
        } else {
          subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1)
        }

        // Обновляем статус PRO пользователя
        const { error: updateError } = await supabaseAdmin
          .from('users')
          .update({ 
            is_pro: true,
            pro_expires_at: subscriptionEndDate.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', payment.user_id)

        if (updateError) {
          return NextResponse.json(
            { error: 'Ошибка обновления статуса PRO' },
            { status: 500 }
          )
        }

        // Сбрасываем кредиты для нового плана
        await resetProCredits(payment.user_id, subscriptionType)
      } else {
        // Обработка покупки токенов
        const newBalance = (user.tokens_balance || 0) + payment.tokens_amount

        // Обновляем баланс пользователя
        const { error: updateError } = await supabaseAdmin
          .from('users')
          .update({ 
            tokens_balance: newBalance,
            updated_at: new Date().toISOString()
          })
          .eq('id', payment.user_id)

        if (updateError) {
          return NextResponse.json(
            { error: 'Ошибка обновления баланса' },
            { status: 500 }
          )
        }
      }

      // Обновляем статус платежа
      await supabaseAdmin
        .from('payments')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', paymentId)

      return NextResponse.json({
        success: true,
        type: isSubscription ? 'subscription' : 'tokens',
        tokens_amount: payment.tokens_amount,
        price: payment.price,
        new_balance: isSubscription ? null : newBalance,
        subscription_type: isSubscription ? payment.subscription_type : null
      })
    }

    // Если платеж еще в процессе
    if (yookassaData.status === 'pending') {
      return NextResponse.json({
        success: false,
        status: 'pending',
        message: 'Платеж обрабатывается'
      })
    }

    // Если платеж не прошел
    if (yookassaData.status === 'canceled' || yookassaData.status === 'failed') {
      await supabaseAdmin
        .from('payments')
        .update({ 
          status: 'failed',
          completed_at: new Date().toISOString()
        })
        .eq('id', paymentId)

      return NextResponse.json({
        success: false,
        status: 'failed',
        message: 'Платеж не прошел'
      })
    }

    return NextResponse.json({
      success: true,
      tokens_amount: payment.tokens_amount,
      price: payment.price
    })

  } catch (error) {
    console.error('Ошибка верификации платежа:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
