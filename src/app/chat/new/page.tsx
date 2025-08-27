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
import { Send, Mic, Copy, Check, ArrowLeft, Edit3, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { ReactMarkdown } from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { supabase } from '@/lib/supabase'
import { messageStorage } from '@/lib/localStorage'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function NewChatPage() {
  const { user, loading } = useSupabase()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('deepseek/deepseek-r1:free')
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')
  const [models, setModels] = useState<Array<{ id: string; name: string; provider: string; is_free: boolean }>>([])
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

  useEffect(() => {
    if (user && models.length === 0 && !isLoadingModels) {
      loadModels()
    }
  }, [user, models.length, isLoadingModels])



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

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !user) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputMessage
    setInputMessage('')
    setIsLoading(true)
    setIsStreaming(true)
    setStreamingMessage('')

    try {
      // Создаем чат в Supabase при первом сообщении
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

      // Получаем токен сессии
      const { data: { session } } = await supabase.auth.getSession()
      
      // Отправляем сообщение в AI
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model: selectedModel,
          chatId: chatData.id,
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

      // Добавляем ответ AI
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, aiMessage])
      toast.success('Ответ получен!')

      // Перенаправляем на реальный чат
      router.replace(`/chat/${chatData.id}`)

    } catch (error) {
      console.error('Ошибка отправки сообщения:', error)
      toast.error('Ошибка отправки сообщения')
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      setStreamingMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
    setStreamingMessage('')
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

  const handleNewChat = () => {
    // Уже на странице нового чата, просто очищаем сообщения
    setMessages([])
    setStreamingMessage('')
  }

  const handleChatSelect = (chatId: string) => {
    router.push(`/chat/${chatId}`)
  }

  const handleDeleteChat = async (chatId: string) => {
    try {
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId)
        .eq('user_id', user?.id)

      if (error) {
        toast.error('Ошибка удаления чата')
      } else {
        setChats(prev => prev.filter(chat => chat.id !== chatId))
        toast.success('Чат удален')
      }
    } catch (error) {
      toast.error('Ошибка удаления чата')
    }
  }

  const handleBack = () => {
    router.push('/profile')
  }



  useEffect(() => {
    // Загружаем модели через API
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

    if (user) {
      loadModels()
    }
  }, [user])

  if (loading || appIsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Загрузка...</div>
      </div>
    )
  }

  if (!user) {
    console.log('No user, redirecting to login')
    router.replace('/auth/login')
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Перенаправление на вход...</div>
      </div>
    )
  }

  console.log('User authenticated, showing chat')

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ChatSidebar
        currentChatId={undefined}
        onNewChat={handleNewChat}
        onChatSelect={handleChatSelect}
        onDeleteChat={handleDeleteChat}
        onSettings={() => router.push('/settings')}
        onUpgrade={() => router.push('/upgrade')}
        onProfile={() => router.push('/profile')}
                            userTokens={userTokens}
          isPro={isPro}
        selectedModel={selectedModel}
        onModelSelect={setSelectedModel}
        models={models}
      />
      
      {/* Chat Interface */}
      <div className="flex-1">
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
          onBack={handleBack}
        />
      </div>
    </div>
  )
}
