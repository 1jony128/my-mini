// YooKassa API configuration
const YOOKASSA_API_URL = 'https://api.yookassa.ru/v3'
const shopId = process.env.YOOKASSA_SHOP_ID || 'placeholder'
const secretKey = process.env.YOOKASSA_SECRET_KEY || 'placeholder'

// Basic auth header
const authHeader = `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString('base64')}`

export interface CreatePaymentParams {
  amount: number
  currency: string
  description: string
  metadata: {
    user_id: string
    type: 'subscription' | 'tokens'
    package_id?: string
  }
  returnUrl: string
}

export async function createPayment(params: CreatePaymentParams) {
  try {
    const response = await fetch(`${YOOKASSA_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Idempotence-Key': `${Date.now()}-${Math.random()}`,
      },
      body: JSON.stringify({
        amount: {
          value: params.amount.toString(),
          currency: params.currency,
        },
        confirmation: {
          type: 'redirect',
          return_url: params.returnUrl,
        },
        capture: true,
        description: params.description,
        metadata: params.metadata,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const payment = await response.json()
    return payment
  } catch (error) {
    console.error('Ошибка создания платежа:', error)
    throw new Error('Ошибка при создании платежа')
  }
}

export async function getPayment(paymentId: string) {
  try {
    const response = await fetch(`${YOOKASSA_API_URL}/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const payment = await response.json()
    return payment
  } catch (error) {
    console.error('Ошибка получения платежа:', error)
    throw new Error('Ошибка при получении платежа')
  }
}

export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  // Простая проверка подписи (в продакшене использовать более надежный метод)
  const expectedSignature = require('crypto')
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')
  
  return signature === expectedSignature
}
