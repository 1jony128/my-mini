// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { getPayment, verifyWebhookSignature } from '@/lib/yookassa'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-yookassa-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Отсутствует подпись' },
        { status: 400 }
      )
    }

    // Проверяем подпись webhook
    const isValid = verifyWebhookSignature(
      body,
      signature,
      process.env.YOOKASSA_WEBHOOK_SECRET!
    )

    if (!isValid) {
      return NextResponse.json(
        { error: 'Неверная подпись' },
        { status: 400 }
      )
    }

    const event = JSON.parse(body)

    // Обрабатываем только события успешной оплаты
    if (event.event === 'payment.succeeded') {
      const paymentId = event.object.id

      // Получаем информацию о платеже из YooKassa
      const payment = await getPayment(paymentId)

      if (payment.status === 'succeeded') {
        // Находим платеж в нашей базе
        const { data: paymentRecord } = await supabaseAdmin
          .from('payments')
          .select('*')
          .eq('yookassa_payment_id', paymentId)
          .single()

        if (!paymentRecord) {
          return NextResponse.json(
            { error: 'Платеж не найден' },
            { status: 404 }
          )
        }

        // Обновляем статус платежа
        await supabaseAdmin
          .from('payments')
          .update({ status: 'succeeded' })
          .eq('id', paymentRecord.id)

        const userId = paymentRecord.user_id
        const type = paymentRecord.type

        if (type === 'subscription') {
          // Активируем подписку
          const plan = paymentRecord.metadata.plan
          const expiresAt = new Date()
          expiresAt.setMonth(expiresAt.getMonth() + (plan === 'yearly' ? 12 : 1))

          await supabaseAdmin
            .from('subscriptions')
            .insert([
              {
                user_id: userId,
                status: 'active',
                plan,
                yookassa_payment_id: paymentId,
                expires_at: expiresAt.toISOString(),
              },
            ])

          // Обновляем статус пользователя
          await supabaseAdmin
            .from('users')
            .update({ is_pro: true })
            .eq('id', userId)

        } else if (type === 'tokens') {
          // Добавляем токены к балансу пользователя
          const tokens = paymentRecord.metadata.tokens
          
          await supabaseAdmin
            .from('users')
            .update({
              tokens_balance: supabaseAdmin.rpc('increment', {
                amount: tokens,
              }),
            })
            .eq('id', userId)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Ошибка обработки webhook:', error)
    return NextResponse.json(
      { error: 'Ошибка обработки webhook' },
      { status: 500 }
    )
  }
}
