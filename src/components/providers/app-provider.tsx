// @ts-nocheck
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSupabase } from './supabase-provider'
import { Chat, Message } from '@/types'
import { chatStorage, messageStorage } from '@/lib/localStorage'
import { supabase } from '@/lib/supabase'

interface AppContextType {
  chats: Chat[]
  userTokens: number
  isPro: boolean
  isLoading: boolean
  refreshChats: () => Promise<void>
  refreshUserData: () => Promise<void>
  updateChats: (newChats: Chat[]) => void
  updateUserData: (tokens: number, isPro: boolean) => void
  canCreateChat: () => boolean
  updateChatTitle: (chatId: string, newTitle: string) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useSupabase()
  const [chats, setChats] = useState<Chat[]>([])
  const [userTokens, setUserTokens] = useState(1250)
  const [isPro, setIsPro] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Загружаем данные только один раз при инициализации
  useEffect(() => {
    if (user && !isInitialized && !isLoading) {
      loadInitialData()
    }
  }, [user, isInitialized, isLoading])

  const loadInitialData = async () => {
    if (!user || isInitialized || isLoading) return
    
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

  const updateChats = (newChats: Chat[]) => {
    setChats(newChats)
    chatStorage.setChats(newChats)
  }

  const updateUserData = (tokens: number, isPro: boolean) => {
    setUserTokens(tokens)
    setIsPro(isPro)
  }

  const canCreateChat = () => {
    // Бесплатные пользователи могут создать максимум 10 чатов
    if (!isPro && chats.length >= 10) {
      return false
    }
    return true
  }

  const updateChatTitle = async (chatId: string, newTitle: string) => {
    try {
      // Находим текущий чат
      const currentChat = chats.find(chat => chat.id === chatId)
      if (!currentChat) {
        throw new Error('Чат не найден')
      }

      // Проверяем, изменилось ли название
      if (currentChat.title === newTitle) {
        // Название не изменилось, просто обновляем локальное состояние
        return
      }

      const { error } = await supabase
        .from('chats')
        .update({ title: newTitle })
        .eq('id', chatId)

      if (error) {
        console.error('Ошибка обновления названия чата:', error)
        throw error
      }

      // Обновляем локальное состояние
      const updatedChats = chats.map(chat => 
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
      updateChats(updatedChats)
    } catch (error) {
      console.error('Ошибка обновления названия чата:', error)
      throw error
    }
  }

  const value: AppContextType = {
    chats,
    userTokens,
    isPro,
    isLoading,
    refreshChats,
    refreshUserData,
    updateChats,
    updateUserData,
    canCreateChat,
    updateChatTitle
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
