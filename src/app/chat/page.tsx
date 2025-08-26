'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/components/providers/supabase-provider'
import { useApp } from '@/components/providers/app-provider'
import { Menu } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { ChatInterface } from '@/components/ui/chat-interface'
import { ChatSidebar } from '@/components/ui/chat-sidebar-new'
import { Message, Chat as ChatType } from '@/types'
import { chatStorage, messageStorage } from '@/lib/localStorage'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function HomePage() {
  const { user, loading } = useUser()
  const { chats, userTokens, isPro, refreshChats, updateChats } = useApp()
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
  const router = useRouter()

  // Отладочная информация (убираем для чистоты консоли)

 

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Если пользователь не авторизован, показываем загрузку или перенаправляем
  if (!user && !loading) {
    router.replace('/')
    return null
  }

  useEffect(() => {
    // Загружаем модели через API только один раз
    const loadModels = async () => {
      try {
        const response = await fetch('/api/models')
        if (response.ok) {
          const modelsData = await response.json()
          setModels(modelsData)
        }
      } catch (error) {
        console.error('Ошибка загрузки моделей:', error)
      }
    }

    if (user && models.length === 0) {
      loadModels()
    }
  }, [user, models.length])




  if (loading) {
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
        const { data: chatData, error: chatError } = await supabase
          .from('chats')
          .insert({
            user_id: user.id,
            title: currentInput.slice(0, 50) + (currentInput.length > 50 ? '...' : ''),
            model: selectedModel,
          })
          .select()
          .single()

        if (chatError) {
          console.error('Ошибка создания чата:', chatError)
          toast.error('Ошибка создания чата')
          return
        }

        chatId = chatData.id
        setCurrentChatId(chatId)
        
        // Обновляем список чатов через контекст
        await refreshChats()
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
    setMessages([])
    setSelectedChatId(undefined)
    setCurrentChatId(null)
    setStreamingMessage('')
    setInputMessage('')
  }

  const handleSelectChat = async (chatId: string) => {
    setSelectedChatId(chatId)
    setCurrentChatId(chatId)
    
    // Сначала загружаем сообщения из localStorage для быстрого отображения
    const cachedMessages = messageStorage.getMessages(chatId)
    if (cachedMessages.length > 0) {
      setMessages(cachedMessages)
    }

    // Затем загружаем свежие сообщения с сервера
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Ошибка загрузки сообщений:', error)
      } else {
        const freshMessages = data || []
        setMessages(freshMessages)
        // Сохраняем в localStorage
        messageStorage.setMessages(chatId, freshMessages)
      }
    } catch (error) {
      console.error('Ошибка загрузки сообщений:', error)
    }
  }

  const handleDeleteChat = (chatId: string) => {
    if (selectedChatId === chatId) {
      setSelectedChatId(undefined)
      setMessages([])
    }
    // Обновляем список чатов через контекст
    const updatedChats = chats.filter(chat => chat.id !== chatId)
    updateChats(updatedChats)
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
          currentChatId={selectedChatId}
          onChatSelect={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          onSettings={() => router.push('/settings')}
          onUpgrade={() => router.push('/upgrade')}
          onProfile={() => router.push('/profile')}
          userTokens={userTokens}
          isPro={isPro}
          selectedModel={selectedModel}
          onModelSelect={setSelectedModel}
          models={models}
          isMobile={isMobile}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
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
          currentChatId={selectedChatId}
          onChatSelect={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          onSettings={() => router.push('/settings')}
          onUpgrade={() => router.push('/upgrade')}
          onProfile={() => router.push('/profile')}
          userTokens={userTokens}
          isPro={isPro}
          selectedModel={selectedModel}
          onModelSelect={setSelectedModel}
          models={models}
          isMobile={true}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}
