// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createPayment } from '@/lib/yookassa'

export const runtime = 'nodejs'

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

    // Определяем тип заказа для Edge Function
    let orderType = 'month' // по умолчанию
    if (type === 'subscription') {
      if (plan === 'monthly' || plan === 'month') {
        orderType = 'month'
      } else if (plan === 'yearly' || plan === 'year') {
        orderType = 'year'
      } else if (plan === 'weekly' || plan === 'sale20') {
        orderType = 'sale20'
      }
    }

    // Создаем заказ в таблице orders
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId,
        type: orderType,
        status: 'pending',
        amount: price
      } as any)
      .select()
      .single()

    if (orderError) {
      console.error('Ошибка создания заказа:', orderError)
      return NextResponse.json(
        { error: 'Ошибка создания заказа' },
        { status: 500 }
      )
    }

    // Получаем токен сессии для авторизации
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Токен авторизации не найден' },
        { status: 401 }
      )
    }

    // Вызываем Supabase Edge Function
    const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/payment-init`
    
    const edgeFunctionResponse = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      },
      body: JSON.stringify({
        orderId: (orderData as any).id,
        paymentSelect: 'bank_card'
      })
    })

    if (!edgeFunctionResponse.ok) {
      const errorData = await edgeFunctionResponse.json()
      console.error('Ошибка Edge Function:', errorData)
      
      // Обновляем статус заказа на failed
      await supabaseAdmin
        .from('orders')
        .update({ status: 'failed' } as any)
        .eq('id', (orderData as any).id)

      return NextResponse.json(
        { error: 'Ошибка инициализации платежа' },
        { status: 500 }
      )
    }

    const responseData = await edgeFunctionResponse.json()

    if (!responseData.succeeded) {
      console.error('Ошибка в ответе Edge Function:', responseData)
      
      // Обновляем статус заказа на failed
      await supabaseAdmin
        .from('orders')
        .update({ status: 'failed' } as any)
        .eq('id', (orderData as any).id)

      return NextResponse.json(
        { error: 'Ошибка создания платежа' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      paymentUrl: responseData.data.url,
      paymentId: (orderData as any).id,
      orderId: (orderData as any).id
    })

  } catch (error) {
    console.error('Ошибка создания платежа:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
