'use client'

import { useSupabase } from '@/components/providers/supabase-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function TestPage() {
  const { user, loading } = useSupabase()
  const router = useRouter()

  console.log('TestPage - user:', user?.email, 'loading:', loading)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-text-primary">Тестовая страница</h1>
        <p className="text-text-secondary">
          Пользователь: {user ? user.email : 'Не авторизован'}
        </p>
        <p className="text-text-secondary">
          Загрузка: {loading ? 'Да' : 'Нет'}
        </p>
        <div className="space-x-4">
          <button 
            onClick={() => router.push('/chat')}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Перейти на главную
          </button>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-secondary text-white rounded-lg"
          >
            Перейти на лендинг
          </button>
        </div>
      </div>
    </div>
  )
}
