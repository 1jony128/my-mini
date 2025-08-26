import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { packageId, tokens, price, userId, type, plan } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'ID пользователя не указан' },
        { status: 400 }
      )
    }

    // Для покупки токенов
    if (type === 'tokens' || (!type && packageId)) {
      if (!packageId || !tokens || !price) {
        return NextResponse.json(
          { error: 'Не все параметры для покупки токенов указаны' },
          { status: 400 }
        )
      }
    }

    // Для подписки
    if (type === 'subscription') {
      if (!plan || !price) {
        return NextResponse.json(
          { error: 'Не все параметры для подписки указаны' },
          { status: 400 }
        )
      }
    }

    // Создаем запись о платеже в базе данных
    const paymentRecord = {
      user_id: userId,
      price: price,
      status: 'pending',
      created_at: new Date().toISOString()
    }

    // Добавляем специфичные поля в зависимости от типа платежа
    if (type === 'subscription') {
      paymentRecord.package_id = `subscription_${plan}`
      paymentRecord.tokens_amount = 0
      paymentRecord.subscription_type = plan
    } else {
      paymentRecord.package_id = packageId
      paymentRecord.tokens_amount = tokens
    }

    const { data: paymentData, error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert(paymentRecord)
      .select()
      .single()

    if (paymentError) {
      console.error('Ошибка создания платежа:', paymentError)
      return NextResponse.json(
        { error: 'Ошибка создания платежа' },
        { status: 500 }
      )
    }

    // Создаем платеж в YooKassa
    const yookassaResponse = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': paymentData.id,
        'Authorization': `Basic ${Buffer.from(`${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`).toString('base64')}`
      },
      body: JSON.stringify({
        amount: {
          value: price.toString(),
          currency: 'RUB'
        },
        capture: true,
        confirmation: {
          type: 'redirect',
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payments/success?payment_id=${paymentData.id}`
        },
        description: type === 'subscription' 
          ? `Подписка PRO на ${plan === 'monthly' ? 'месяц' : 'год'}`
          : `Покупка ${tokens.toLocaleString()} токенов`,
        metadata: {
          payment_id: paymentData.id,
          user_id: userId,
          package_id: type === 'subscription' ? `subscription_${plan}` : packageId,
          tokens_amount: type === 'subscription' ? 0 : tokens,
          type: type || 'tokens'
        }
      })
    })

    if (!yookassaResponse.ok) {
      const errorData = await yookassaResponse.json()
      console.error('Ошибка YooKassa:', errorData)
      
      // Обновляем статус платежа на failed
      await supabaseAdmin
        .from('payments')
        .update({ status: 'failed' })
        .eq('id', paymentData.id)

      return NextResponse.json(
        { error: 'Ошибка создания платежа в YooKassa' },
        { status: 500 }
      )
    }

    const yookassaData = await yookassaResponse.json()

    // Обновляем запись платежа с ID от YooKassa
    await supabaseAdmin
      .from('payments')
      .update({ 
        yookassa_payment_id: yookassaData.id,
        status: 'created'
      })
      .eq('id', paymentData.id)

    return NextResponse.json({
      paymentUrl: yookassaData.confirmation.confirmation_url,
      paymentId: paymentData.id
    })

  } catch (error) {
    console.error('Ошибка создания платежа:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
