// @ts-nocheck
'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
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

export default function ChatPage() {
  const { id } = useParams()
  const { user, loading } = useSupabase()
  const [chat, setChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [selectedModel, setSelectedModel] = useState('deepseek/deepseek-r1:free')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')
  const [models, setModels] = useState<Array<{ id: string; name: string; provider: string; is_free: boolean }>>([])
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  // Используем данные из app-provider
  const appContext = useApp()
  const { chats: appChats, isLoading: appIsLoading } = appContext || {}

  // Синхронизируем данные из app-provider с локальным состоянием
  useEffect(() => {
    if (appChats && !appIsLoading) {
      setChats(appChats)
    }
  }, [appChats, appIsLoading])

  useEffect(() => {
    if (user && id) {
      loadChat()
      loadMessages()
    }
  }, [user, id])

  useEffect(() => {
    if (user && models.length === 0 && !isLoadingModels) {
      loadModels()
    }
  }, [user, models.length, isLoadingModels])

  const loadChat = async () => {
    try {
      const { data: chat, error } = await supabase
        .from('chats')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id || '')
        .single()

      if (error) {
        toast.error('Чат не найден')
        router.push('/dashboard')
      } else {
        setChat(data)
        if (data.model) {
          setSelectedModel(data.model)
        }
      }
    } catch (error) {
      toast.error('Ошибка загрузки чата')
    }
  }

  const loadMessages = async () => {
    try {
      // Сначала загружаем из localStorage для быстрого отображения
      const cachedMessages = messageStorage.getMessages(id as string)
      if (cachedMessages.length > 0) {
        setMessages(cachedMessages)
      }

      // Затем загружаем свежие данные с сервера
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', id)
        .order('created_at', { ascending: true })

      if (error) {
        toast.error('Ошибка загрузки сообщений')
      } else {
        const freshMessages = data || []
        setMessages(freshMessages)
        // Сохраняем в localStorage
        messageStorage.setMessages(id as string, freshMessages)
      }
    } catch (error) {
      toast.error('Ошибка загрузки сообщений')
    }
  }

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

    // Добавляем сообщение пользователя сразу
    setMessages(prev => [...prev, userMessage])
    const currentInput = inputMessage
    setInputMessage('')
    
    // Сразу показываем индикатор печатания
    setIsLoading(true)
    setIsStreaming(true)
    setStreamingMessage('')

    try {
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
          chatId: id,
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

      // Добавляем ответ AI только если он не пустой
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
        messageStorage.setMessages(id as string, updatedMessages)
        
        // Очищаем streamingMessage после добавления в messages
        setStreamingMessage('')
      }

      // Обновляем заголовок чата если это первое сообщение
      if (messages.length === 0) {
        await supabase
          .from('chats')
          .update({
            title: currentInput.slice(0, 50) + (currentInput.length > 50 ? '...' : ''),
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
      } else {
        await supabase
          .from('chats')
          .update({
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
      }

    } catch (error) {
      console.error('Ошибка отправки сообщения:', error)
      toast.error('Ошибка при отправке сообщения')
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      setStreamingMessage('')
    }
  }

  const handleClearChat = async () => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('chat_id', id)

      if (error) {
        toast.error('Ошибка очистки чата')
      } else {
        setMessages([])
        // Очищаем сообщения из localStorage
        messageStorage.clearMessages(id as string)
        toast.success('Чат очищен')
      }
    } catch (error) {
      toast.error('Ошибка очистки чата')
    }
  }

  const handleExportChat = () => {
    const chatContent = messages
      .map(msg => `${msg.role === 'user' ? 'Вы' : 'ИИ'}: ${msg.content}`)
      .join('\n\n')
    
    const blob = new Blob([chatContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleBack = () => {
    router.push('/profile')
  }

  const handleNewChat = () => {
            router.push('/chat')
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
        if (chatId === id) {
          router.push('/chat/new')
        }
        toast.success('Чат удален')
      }
    } catch (error) {
      toast.error('Ошибка удаления чата')
    }
  }

  if (loading || appIsLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ChatSidebar
        currentChatId={id as string}
        onNewChat={handleNewChat}
        onChatSelect={handleChatSelect}
        onDeleteChat={handleDeleteChat}
        onSettings={() => router.push('/settings')}
        onUpgrade={() => router.push('/upgrade')}
        onProfile={() => router.push('/profile')}
                  userTokens={userTokens}
        isPro={false}
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
          onClearChat={handleClearChat}
          onExportChat={handleExportChat}
          onBack={handleBack}
          isMobile={false}
        />
      </div>
    </div>
  )
}
