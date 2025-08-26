'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSupabase } from '@/components/providers/supabase-provider'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Zap, Crown } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PaymentSuccessPage() {
  const { user } = useSupabase()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const paymentId = searchParams.get('payment_id')

  useEffect(() => {
    if (paymentId) {
      verifyPayment()
    } else {
      setLoading(false)
    }
  }, [paymentId])

  const verifyPayment = async () => {
    try {
      const response = await fetch(`/api/payments/verify?payment_id=${paymentId}`)
      if (response.ok) {
        const data = await response.json()
        setPaymentData(data)
        toast.success('Токены успешно зачислены!')
      } else {
        toast.error('Ошибка верификации платежа')
      }
    } catch (error) {
      console.error('Ошибка верификации:', error)
      toast.error('Ошибка верификации платежа')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Проверяем платеж...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            Оплата прошла успешно!
          </h1>
          <p className="text-lg text-text-secondary">
            {paymentData?.type === 'subscription' 
              ? 'Ваша подписка PRO активирована' 
              : 'Ваши токены зачислены на баланс'
            }
          </p>
        </motion.div>

        {paymentData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-background-secondary rounded-xl p-6 border border-border mb-8"
          >
            {paymentData.type === 'subscription' ? (
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Crown className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    Подписка PRO активирована
                  </h3>
                  <p className="text-lg font-medium text-secondary">
                    {paymentData.subscription_type === 'weekly' ? 'На 1 неделю' : 
                     paymentData.subscription_type === 'monthly' ? 'На 1 месяц' : 'На 1 год'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    Зачислено токенов
                  </h3>
                  <p className="text-2xl font-bold text-primary">
                    {paymentData.tokens_amount?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-secondary">Сумма:</span>
                <span className="font-medium text-text-primary ml-2">
                  {paymentData.price}₽
                </span>
              </div>
              <div>
                <span className="text-text-secondary">Статус:</span>
                <span className="font-medium text-success ml-2">
                  Оплачено
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/chat')}
            className="w-full py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowRight className="w-5 h-5" />
            <span>Перейти в чат</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/profile')}
            className="w-full py-4 bg-muted text-text-primary rounded-xl font-semibold hover:bg-accent transition-colors"
          >
            Посмотреть профиль
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-text-secondary">
            {paymentData?.type === 'subscription'
              ? 'Спасибо за подписку! Теперь у вас есть неограниченный доступ ко всем функциям.'
              : 'Спасибо за покупку! Теперь вы можете использовать токены для общения с ИИ.'
            }
          </p>
        </motion.div>
      </div>
    </div>
  )
}
