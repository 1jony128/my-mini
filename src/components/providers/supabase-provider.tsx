'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type SupabaseContextType = {
  user: User | null
  loading: boolean
  supabase: typeof supabase
}

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  loading: true,
  supabase,
})

export const useUser = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useUser must be used within a SupabaseProvider')
  }
  return context
}

export const useSupabase = useUser // Для обратной совместимости

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Получаем начальную сессию
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        setLoading(false)
      } catch (error) {
        console.error('Ошибка получения сессии:', error)
        setLoading(false)
      }
    }

    getInitialSession()

    // Подписываемся на изменения состояния аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // console.log('SupabaseProvider - rendering with user:', user?.email, 'loading:', loading)

  return (
    <SupabaseContext.Provider value={{ user, loading, supabase }}>
      {children}
    </SupabaseContext.Provider>
  )
}
