// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyPayment } from '@/lib/yookassa'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentId, orderId } = body

    if (!paymentId || !orderId) {
      return NextResponse.json(
        { error: 'ID платежа и заказа обязательны' },
        { status: 400 }
      )
    }

    // Получаем заказ из базы данных
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Заказ не найден' },
        { status: 404 }
      )
    }

    // Проверяем статус платежа в YooKassa
    const yookassaResponse = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    })

    if (!yookassaResponse.ok) {
      return NextResponse.json(
        { error: 'Ошибка проверки платежа в YooKassa' },
        { status: 500 }
      )
    }

    const paymentData = await yookassaResponse.json()

    // Обновляем статус заказа
    let orderStatus = 'pending'
    if (paymentData.status === 'succeeded') {
      orderStatus = 'completed'
    } else if (paymentData.status === 'canceled') {
      orderStatus = 'cancelled'
    } else if (paymentData.status === 'failed') {
      orderStatus = 'failed'
    }

    await supabaseAdmin
      .from('orders')
      .update({ 
        status: orderStatus,
        payment_id: paymentId
      } as any)
      .eq('id', orderId)

    // Если платеж успешен, обновляем статус пользователя
    if (paymentData.status === 'succeeded') {
      // Преобразуем тип заказа в тип плана
      const planType = (order as any).type === 'sale20' ? 'weekly' :
                      (order as any).type === 'month' ? 'monthly' :
                      (order as any).type === 'year' ? 'yearly' : 'monthly';

      const { error: userUpdateError } = await supabaseAdmin
        .from('users')
        .update({ 
          is_pro: true,
          pro_plan_type: planType,
          pro_expires_at: getExpirationDate((order as any).type)
        } as any)
        .eq('id', (order as any).user_id)

      if (userUpdateError) {
        console.error('Ошибка обновления пользователя:', userUpdateError)
      }
    }

    return NextResponse.json({
      success: true,
      status: paymentData.status,
      orderStatus: orderStatus
    })

  } catch (error) {
    console.error('Ошибка верификации платежа:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

function getExpirationDate(type: string): string {
  const now = new Date()
  
  switch (type) {
    case 'month':
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
    case 'year':
      return new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString()
    case 'sale20':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
    default:
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
  }
}
