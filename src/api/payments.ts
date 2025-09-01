import { supabase } from '@/lib/supabase'

interface PaymentCreateRequest {
  price: number
  userId: string
  type: string
  plan: string
  accessToken: string
}

interface PaymentCreateResponse {
  paymentUrl: string
  paymentId: string
  orderId: string
}

export async function createPayment(request: PaymentCreateRequest): Promise<PaymentCreateResponse> {
  const { price, userId, type, plan, accessToken } = request

  if (!userId) {
    throw new Error('ID пользователя не указан')
  }

  let orderType = 'month'
  if (type === 'subscription') {
    if (plan === 'monthly' || plan === 'month') orderType = 'month'
    else if (plan === 'yearly' || plan === 'year') orderType = 'year'
    else if (plan === 'weekly' || plan === 'sale20') orderType = 'sale20'
  }

  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({ user_id: userId, type: orderType, status: 'pending', amount: price } as any)
    .select()
    .single()

  if (orderError || !orderData) {
    throw new Error('Ошибка создания заказа')
  }

  const edgeFunctionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/payment-init`

  const edgeFunctionResponse = await fetch(edgeFunctionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || ''
    },
    body: JSON.stringify({ orderId: (orderData as any).id, paymentSelect: 'bank_card' })
  })

  if (!edgeFunctionResponse.ok) {
    await supabase.from('orders').update({ status: 'failed' } as any).eq('id', (orderData as any).id)
    throw new Error('Ошибка инициализации платежа')
  }

  const responseData = await edgeFunctionResponse.json()
  if (!responseData.succeeded) {
    await supabase.from('orders').update({ status: 'failed' } as any).eq('id', (orderData as any).id)
    throw new Error('Ошибка создания платежа')
  }

  return {
    paymentUrl: responseData.data.url,
    paymentId: (orderData as any).id,
    orderId: (orderData as any).id
  }
}
