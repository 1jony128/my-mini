'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type SupabaseContextType = {
  user: User | null
  loading: boolean
}

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  loading: true,
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
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        // Также проверяем сессию
        const { data: { session } } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Ошибка получения пользователя:', error)
        }
        
        // Используем пользователя из сессии, если getUser не сработал
        setUser(user || session?.user || null)
        setLoading(false)
      } catch (error) {
        console.error('Ошибка аутентификации:', error)
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // console.log('SupabaseProvider - auth state change:', event, session?.user?.email)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // console.log('SupabaseProvider - rendering with user:', user?.email, 'loading:', loading)

  return (
    <SupabaseContext.Provider value={{ user, loading }}>
      {children}
    </SupabaseContext.Provider>
  )
}
