'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useUser } from './supabase-provider'
import { supabase } from '@/lib/supabase'
import { Chat as ChatType, Message } from '@/types'
import { chatStorage, messageStorage } from '@/lib/localStorage'

interface AppContextType {
  chats: ChatType[]
  userTokens: number
  isPro: boolean
  isLoading: boolean
  refreshChats: () => Promise<void>
  refreshUserData: () => Promise<void>
  updateChats: (newChats: ChatType[]) => void
  updateUserData: (tokens: number, isPro: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useUser()
  const [chats, setChats] = useState<ChatType[]>([])
  const [userTokens, setUserTokens] = useState(1250)
  const [isPro, setIsPro] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Загружаем данные только один раз при инициализации
  useEffect(() => {
    if (user && !isInitialized) {
      loadInitialData()
    }
  }, [user, isInitialized])

  const loadInitialData = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      // Загружаем чаты и данные пользователя параллельно
      await Promise.all([
        loadChats(),
        loadUserData()
      ])
      setIsInitialized(true)
    } catch (error) {
      console.error('Ошибка загрузки начальных данных:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadChats = async () => {
    try {
      // Сначала загружаем из localStorage для быстрого отображения
      const cachedChats = chatStorage.getChats()
      if (cachedChats.length > 0) {
        setChats(cachedChats)
      }

      // Затем загружаем свежие данные с сервера
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('Ошибка загрузки чатов:', error)
      } else {
        const freshChats = data || []
        setChats(freshChats)
        chatStorage.setChats(freshChats)
      }
    } catch (error) {
      console.error('Ошибка загрузки чатов:', error)
    }
  }

  const loadUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('tokens_balance, is_pro, daily_tokens_used')
        .eq('id', user?.id)
        .single()

      if (error) {
        console.error('Ошибка загрузки данных пользователя:', error)
      } else {
        setUserTokens(data?.tokens_balance || 1250)
        setIsPro(data?.is_pro || false)
      }
    } catch (error) {
      console.error('Ошибка загрузки данных пользователя:', error)
    }
  }

  const refreshChats = async () => {
    await loadChats()
  }

  const refreshUserData = async () => {
    await loadUserData()
  }

  const updateChats = (newChats: ChatType[]) => {
    setChats(newChats)
    chatStorage.setChats(newChats)
  }

  const updateUserData = (tokens: number, isPro: boolean) => {
    setUserTokens(tokens)
    setIsPro(isPro)
  }

  const value: AppContextType = {
    chats,
    userTokens,
    isPro,
    isLoading,
    refreshChats,
    refreshUserData,
    updateChats,
    updateUserData
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
