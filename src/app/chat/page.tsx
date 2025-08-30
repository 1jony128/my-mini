// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/providers/supabase-provider'
import { useApp } from '@/components/providers/app-provider'
import { ChatSidebar } from '@/components/ui/chat-sidebar-new'
import { ModelSelector } from '@/components/ui/model-selector'
import { AI_MODELS } from '@/lib/ai-models'
import { Message, Chat } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, Copy, Check, ArrowLeft, Edit3, Trash2, Menu } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { ReactMarkdown } from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { supabase } from '@/lib/supabase'
import { messageStorage } from '@/lib/localStorage'
import { ChatInterface } from '@/components/ui/chat-interface'

export default function HomePage() {
  const { user, loading } = useSupabase()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')
  const [selectedModel, setSelectedModel] = useState('deepseek')
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>()
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [models, setModels] = useState<Array<{ id: string; name: string; provider: string; is_free: boolean }>>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [userTokens, setUserTokens] = useState(1250)
  const [isPro, setIsPro] = useState(false)
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const router = useRouter()

  // Используем данные из app-provider
  const appContext = useApp()
  const { chats: appChats, userTokens: appUserTokens, isPro: appIsPro, isLoading: appIsLoading } = appContext || {}

  // Синхронизируем данные из app-provider с локальным состоянием
  useEffect(() => {
    if (appChats && !appIsLoading) {
      setChats(appChats)
    }
  }, [appChats, appIsLoading])

  useEffect(() => {
    if (appUserTokens !== undefined && !appIsLoading) {
      setUserTokens(appUserTokens)
    }
  }, [appUserTokens, appIsLoading])

  useEffect(() => {
    if (appIsPro !== undefined && !appIsLoading) {
      setIsPro(appIsPro)
    }
  }, [appIsPro, appIsLoading])

  // Функции для работы с чатами
  const refreshChats = async () => {
    // Используем функцию из app-provider
    if (appContext?.refreshChats) {
      await appContext.refreshChats()
    }
  }

  const updateChats = (newChats: Chat[]) => {
    setChats(newChats)
  }

  const canCreateChat = () => {
    return isPro || chats.length < 10
  }

  // Отладочная информация (убираем для чистоты консоли)

 

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Закрываем сайдбар при изменении размера экрана на десктоп
  useEffect(() => {
    if (!isMobile && isSidebarOpen) {
      setIsSidebarOpen(false)
    }
  }, [isMobile, isSidebarOpen])

  // Если пользователь не авторизован, показываем загрузку или перенаправляем
  if (!user && !loading) {
    router.replace('/')
    return null
  }

  useEffect(() => {
    // Загружаем модели через API только один раз
    const loadModels = async () => {
      if (isLoadingModels) return
      setIsLoadingModels(true)
      try {
        const response = await fetch('/api/models')
        if (response.ok) {
          const modelsData = await response.json()
          setModels(modelsData)
        }
      } catch (error) {
        console.error('Ошибка загрузки моделей:', error)
      } finally {
        setIsLoadingModels(false)
      }
    }

    if (user && models.length === 0 && !isLoadingModels) {
      loadModels()
    }
  }, [user, models.length, isLoadingModels])




  if (loading || appIsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-lg">Загрузка...</div>
      </div>
    )
  }

  // Если пользователь не авторизован после загрузки, перенаправляем
  if (!user) {
    router.replace('/')
    return null
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !user) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    }

    const currentInput = inputMessage
    setInputMessage('')
    
    // СРАЗУ добавляем сообщение пользователя в UI
    setMessages(prev => [...prev, userMessage])
    setIsStreaming(true)
    setStreamingMessage('')
    
    // Показываем индикатор загрузки
    setIsLoading(true)
    setError(null) // Очищаем предыдущие ошибки

    try {
      let chatId = currentChatId

      // Создаем чат только если его еще нет
      if (!chatId) {
        // Проверяем лимит чатов для бесплатных пользователей
        if (!canCreateChat()) {
          toast.error('Достигнут лимит чатов (10) для бесплатного плана. Перейдите на PRO для создания неограниченного количества чатов.')
          // Удаляем сообщение пользователя при ошибке
          setMessages(prev => prev.filter(msg => msg.id !== userMessage.id))
          setIsLoading(false)
          setIsStreaming(false)
          return
        }

        // Создаем новый чат
        const { data: chatData, error: chatError } = await supabase
          .from('chats')
          .insert({
            user_id: user.id,
            title: currentInput.slice(0, 50) + (currentInput.length > 50 ? '...' : ''),
            model: selectedModel
          } as any)
          .select()
          .single()

        if (chatError) {
          console.error('Ошибка создания чата:', chatError)
          toast.error('Ошибка создания чата')
          // Удаляем сообщение пользователя при ошибке
          setMessages(prev => prev.filter(msg => msg.id !== userMessage.id))
          setIsLoading(false)
          setIsStreaming(false)
          return
        }

        chatId = chatData.id
        setCurrentChatId(chatId)
        setSelectedChatId(chatId)
        
        // СРАЗУ добавляем новый чат в начало списка локально
        const newChat: Chat = {
          id: chatData.id,
          user_id: user.id,
          title: chatData.title,
          model: chatData.model,
          created_at: chatData.created_at,
          updated_at: chatData.updated_at
        }
        setChats(prev => [newChat, ...prev])
        
        // Обновляем список чатов в фоне для синхронизации
        refreshChats()
      }

      // Получаем токен сессии
      const { data: { session } } = await supabase.auth.getSession()
      
      // Отправляем сообщение в AI через API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model: selectedModel,
          chatId: chatId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        const errorMessage = errorData.error || 'Ошибка API'
        
        // Если ошибка 403 (платная модель для бесплатного пользователя), показываем плашку
        if (response.status === 403 && errorMessage.includes('PRO пользователей')) {
          // Удаляем сообщение пользователя
          setMessages(prev => prev.filter(msg => msg.id !== userMessage.id))
          // Показываем плашку PRO (это будет обработано в ChatInterface)
          setIsLoading(false)
          setIsStreaming(false)
          return
        }
        
        setError(errorMessage)
        // Удаляем сообщение пользователя при ошибке
        setMessages(prev => prev.filter(msg => msg.id !== userMessage.id))
        throw new Error(errorMessage)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Не удалось получить поток')
      }

      let aiResponse = ''
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              break
            }
            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                aiResponse += parsed.content
                setStreamingMessage(aiResponse)
              }
            } catch (e) {
              // Игнорируем ошибки парсинга
            }
          }
        }
      }

      // Добавляем ответ AI в messages только после завершения стриминга
      if (aiResponse.trim()) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date(),
        }

        const updatedMessages = [...messages, userMessage, aiMessage]
        setMessages(updatedMessages)
        
        // Сохраняем сообщения в localStorage
        if (chatId) {
          messageStorage.setMessages(chatId, updatedMessages)
        }
        
        // Перемещаем чат в начало списка, так как он был обновлен
        setChats(prev => {
          const chatIndex = prev.findIndex(chat => chat.id === chatId)
          if (chatIndex > 0) {
            const updatedChats = [...prev]
            const [movedChat] = updatedChats.splice(chatIndex, 1)
            // Обновляем updated_at для чата
            movedChat.updated_at = new Date().toISOString()
            return [movedChat, ...updatedChats]
          }
          return prev
        })
        
        // Очищаем streamingMessage после добавления в messages
        setStreamingMessage('')
      }

    } catch (error) {
      console.error('Ошибка отправки сообщения:', error)
      // Не показываем toast для ошибок лимитов, так как у нас есть красивое сообщение
      if (!error?.message?.includes('лимит')) {
        toast.error('Ошибка отправки сообщения')
      }
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      setStreamingMessage('')
    }
  }

  const handleNewChat = () => {
    // Проверяем лимит чатов для бесплатных пользователей
    if (!canCreateChat()) {
      toast.error('Достигнут лимит чатов (10) для бесплатного плана. Перейдите на PRO для создания неограниченного количества чатов.')
      return
    }

    // Очищаем текущий чат
    setSelectedChatId(undefined)
    setCurrentChatId(null)
    setMessages([])
    setInputMessage('')
    setError(null)
    
    // Закрываем сайдбар на мобильных устройствах при создании нового чата
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }

  const handleSelectChat = async (chatId: string) => {
    try {
      setSelectedChatId(chatId)
      setCurrentChatId(chatId)
      setMessages([])
      setError(null)
      
      // Закрываем сайдбар на мобильных устройствах при выборе чата
      if (isMobile) {
        setIsSidebarOpen(false)
      }

      // Загружаем сообщения для выбранного чата
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (messagesError) {
        console.error('Ошибка загрузки сообщений:', messagesError)
        toast.error('Ошибка загрузки сообщений')
        return
      }

      if (messagesData) {
        setMessages(messagesData as Message[])
      }
    } catch (error) {
      console.error('Ошибка выбора чата:', error)
      toast.error('Ошибка выбора чата')
    }
  }

  const handleDeleteChat = async (chatId: string) => {
    try {
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId)

      if (error) {
        console.error('Ошибка удаления чата:', error)
        toast.error('Ошибка удаления чата')
        return
      }

      // Обновляем список чатов
      const updatedChats = chats.filter(chat => chat.id !== chatId)
      setChats(updatedChats)

      // Если удаляемый чат был выбран, очищаем сообщения
      if (selectedChatId === chatId) {
        setSelectedChatId(undefined)
        setCurrentChatId(null)
        setMessages([])
      }

      toast.success('Чат удален')
    } catch (error) {
      console.error('Ошибка удаления чата:', error)
      toast.error('Ошибка удаления чата')
    }
  }

  const handleUpdateChatTitle = async (chatId: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from('chats')
        .update({ title: newTitle })
        .eq('id', chatId)

      if (error) {
        console.error('Ошибка обновления названия чата:', error)
        toast.error('Ошибка обновления названия чата')
        return
      }

      // Обновляем чат в локальном состоянии
      setChats(prev => prev.map(chat => 
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      ))

      toast.success('Название чата обновлено')
    } catch (error) {
      console.error('Ошибка обновления названия чата:', error)
      toast.error('Ошибка обновления названия чата')
    }
  }

  const clearChat = () => {
    setMessages([])
    setStreamingMessage('')
    // Очищаем сообщения из localStorage
    if (selectedChatId) {
      messageStorage.clearMessages(selectedChatId)
    }
  }

  const exportChat = () => {
    const chatContent = messages
      .map(msg => `${msg.role === 'user' ? 'Вы' : 'AI'}: ${msg.content}`)
      .join('\n\n')

    const blob = new Blob([chatContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Боковая панель с чатами (только для десктопа) */}
      {!isMobile && (
        <ChatSidebar
          chats={chats}
          currentChatId={currentChatId}
          onChatSelect={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          onUpdateChatTitle={handleUpdateChatTitle}
          onSettings={() => router.push('/settings')}
          onProfile={() => router.push('/profile')}
          onUpgrade={() => router.push('/upgrade')}
          isPro={isPro}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          canCreateChat={canCreateChat}
        />
      )}

      {/* Основной интерфейс чата */}
      <div className="flex-1">
        {/* Мобильная кнопка меню */}
        {isMobile && (
          <div className="absolute top-2 left-2 z-30">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 rounded-lg bg-background border border-border hover:bg-muted transition-colors shadow-sm"
            >
              <Menu className="w-3.5 h-3.5 text-text-primary" />
            </button>
          </div>
        )}
        
        <ChatInterface
          messages={messages}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          isStreaming={isStreaming}
          streamingMessage={streamingMessage}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          models={models}
          onClearChat={clearChat}
          onExportChat={exportChat}
          onBack={() => router.push('/profile')}
          userTokens={userTokens}
          isPro={isPro}
          isMobile={isMobile}
          error={error}
        />
      </div>

      {/* Мобильная сайдбара */}
      {isMobile && (
        <ChatSidebar
          chats={chats}
          currentChatId={currentChatId}
          onChatSelect={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          onUpdateChatTitle={handleUpdateChatTitle}
          onSettings={() => router.push('/settings')}
          onProfile={() => router.push('/profile')}
          onUpgrade={() => router.push('/upgrade')}
          isPro={isPro}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          canCreateChat={canCreateChat}
        />
      )}
    </div>
  )
}
