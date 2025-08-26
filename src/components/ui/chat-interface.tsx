'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Mic, Sparkles, Bot, User, Loader2, Copy, Check, Crown } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
  created_at?: string
}

interface ChatInterfaceProps {
  messages: Message[]
  inputMessage: string
  setInputMessage: (message: string) => void
  onSendMessage: () => void
  isLoading: boolean
  isStreaming: boolean
  streamingMessage: string
  selectedModel: string
  onModelChange: (model: string) => void
  models: Array<{ id: string; name: string; provider: string; is_free: boolean }>
  onClearChat: () => void
  onExportChat: () => void
  onBack: () => void
  userTokens?: number
  isPro?: boolean
  isMobile?: boolean
  error?: string | null
}

export function ChatInterface({
  messages,
  inputMessage,
  setInputMessage,
  onSendMessage,
  isLoading,
  isStreaming,
  streamingMessage,
  selectedModel,
  onModelChange,
  models,
  onClearChat,
  onExportChat,
  onBack,
  userTokens = 0,
  isPro = false,
  isMobile = false,
  error = null
}: ChatInterfaceProps) {
  const [isTyping, setIsTyping] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const copyToClipboard = async (text: string, type: 'message' | 'code', id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'message') {
        setCopiedMessageId(id)
        setTimeout(() => setCopiedMessageId(null), 2000)
      } else {
        setCopiedCodeId(id)
        setTimeout(() => setCopiedCodeId(null), 2000)
      }
      toast.success('Скопировано!')
    } catch (error) {
      toast.error('Ошибка копирования')
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSendMessage()
    }
  }

  // Автоматический скролл при новых сообщениях или стриминге
  useEffect(() => {
    scrollToBottom()
  }, [messages, isStreaming, streamingMessage])

  const getMessageTimestamp = (message: Message): string => {
    // Приоритет: created_at -> timestamp -> текущее время
    if (message.created_at) {
      return message.created_at
    }
    
    if (message.timestamp) {
      // Если timestamp это объект Date, конвертируем в строку
      if (message.timestamp instanceof Date) {
        return message.timestamp.toISOString()
      }
      // Если timestamp это строка, возвращаем как есть
      if (typeof message.timestamp === 'string') {
        return message.timestamp
      }
    }
    
    // Если ничего нет, возвращаем текущее время
    return new Date().toISOString()
  }

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    const diffInDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    
    if (diffInHours < 1) {
      // Меньше часа - показываем минуты
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `${diffInMinutes} мин назад`
    } else if (diffInHours < 24) {
      // Меньше дня - показываем часы и минуты
      return date.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } else if (diffInDays < 7) {
      // Меньше недели - показываем день недели и время
      return date.toLocaleDateString('ru-RU', { 
        weekday: 'short',
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } else {
      // Больше недели - показываем полную дату
      return date.toLocaleDateString('ru-RU', { 
        day: '2-digit', 
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  }

  useEffect(() => {
    setIsTyping(inputMessage.length > 0)
  }, [inputMessage])

  return (
    <div className="flex flex-col h-screen bg-background">

      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`flex items-center justify-between border-b border-border bg-background ${
          isMobile ? 'p-2' : 'p-6'
        }`}
      >


        <div className={`flex items-center space-x-4 ${isMobile ? 'space-x-1' : ''}`}>
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className={`bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary ${
              isMobile ? 'px-2 py-1 text-xs' : 'px-4 py-2'
            }`}
          >
            {models.length === 0 ? (
              <option>Загрузка моделей...</option>
            ) : (
              models.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))
            )}
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExportChat}
            disabled={messages.length === 0}
            className={`rounded-lg bg-muted hover:bg-accent transition-colors disabled:opacity-50 text-text-primary ${
              isMobile ? 'p-1' : 'p-2'
            }`}
          >
            <svg className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClearChat}
            disabled={messages.length === 0}
            className={`rounded-lg bg-muted hover:bg-accent transition-colors disabled:opacity-50 text-text-primary ${
              isMobile ? 'p-1' : 'p-2'
            }`}
          >
            <svg className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </motion.button>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-text-secondary mt-20"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-24 h-24 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2 text-text-primary">Добро пожаловать в AI Chat!</h2>
              <p className="text-lg">Выберите модель и начните общение с ИИ</p>
            </motion.div>
          )}

          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: message.role === 'user' ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} group`}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`max-w-[75%] px-6 py-4 rounded-2xl shadow-md relative ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-background-secondary text-text-primary border border-border'
                }`}
              >
                {/* Кнопка копирования сообщения */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-2 right-2 p-1 rounded-lg bg-black/10 hover:bg-black/20 transition-colors opacity-0 group-hover:opacity-100"
                  onClick={() => copyToClipboard(message.content, 'message', message.id)}
                >
                  {copiedMessageId === message.id ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4 text-white" />
                  )}
                </motion.button>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">
                    {message.role === 'user' ? 'Вы' : selectedModel}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    message.role === 'user' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-black/10 text-text-secondary'
                  }`}>
                    {formatMessageTime(getMessageTimestamp(message))}
                  </span>
                </div>
                
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '')
                      const codeId = `${message.id}-${index}-${Math.random()}`
                      
                      return !inline && match ? (
                        <div className="relative">
                          {/* Кнопка копирования кода */}
                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute top-2 right-2 p-1 rounded-lg bg-black/20 hover:bg-black/30 transition-colors opacity-0 group-hover:opacity-100 z-10"
                            onClick={() => copyToClipboard(String(children).replace(/\n$/, ''), 'code', codeId)}
                          >
                            {copiedCodeId === codeId ? (
                              <Check className="w-3 h-3 text-success" />
                            ) : (
                              <Copy className="w-3 h-3 text-white" />
                            )}
                          </motion.button>
                          
                          <SyntaxHighlighter
                            style={tomorrow}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-lg my-2"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className={`${className} bg-black/20 px-1 py-0.5 rounded text-xs`} {...props}>
                          {children}
                        </code>
                      )
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </motion.div>
            </motion.div>
          ))}

                    {isStreaming && !streamingMessage && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[75%] px-6 py-4 rounded-2xl bg-background-secondary text-text-primary border border-border shadow-md">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-sm font-semibold">{selectedModel}</span>
                  <span className="text-xs opacity-70 bg-black/10 px-2 py-1 rounded-full">
                    {new Date().toLocaleTimeString('ru-RU', { 
                      hour: '2-digit', 
                      minute: '2-digit', 
                      second: '2-digit' 
                    })}
                  </span>
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-success rounded-full"
                  />
                </div>
                
                <div className="text-sm leading-relaxed">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-text-secondary">AI печатает...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {streamingMessage && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[75%] px-6 py-4 rounded-2xl bg-background-secondary text-text-primary border border-border shadow-md">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-sm font-semibold">{selectedModel}</span>
                  <span className="text-xs opacity-70 bg-black/10 px-2 py-1 rounded-full">
                    {new Date().toLocaleTimeString('ru-RU', { 
                      hour: '2-digit', 
                      minute: '2-digit', 
                      second: '2-digit' 
                    })}
                  </span>
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-success rounded-full"
                  />
                </div>
                
                <div className="text-sm leading-relaxed">
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={tomorrow}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-lg my-2"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={`${className} text-white bg-black/20 px-1 py-0.5 rounded text-xs`} {...props}>
                            {children}
                          </code>
                        )
                      },
                    }}
                  >
                    {streamingMessage}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Невидимый элемент для автоматического скролла */}
        <div ref={messagesEndRef} />

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center p-6"
          >
            <div className="max-w-md bg-error/10 border border-error/20 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-error mb-2">Лимит превышен</h3>
              <p className="text-sm text-text-secondary mb-4">{error}</p>
              <div className="flex items-center justify-center space-x-2 text-info text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Завтра лимиты обновятся автоматически</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`border-t border-border bg-background ${isMobile ? 'p-2' : 'p-6'}`}
      >
        <div className={`flex ${isMobile ? 'space-x-1' : 'space-x-4'}`}>
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Напишите сообщение..."
              className={`w-full bg-background border border-border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary text-text-primary placeholder-text-secondary shadow-sm ${
                isMobile ? 'p-2 pr-12 text-sm' : 'p-4 pr-20'
              }`}
              rows={1}
              disabled={isLoading}
            />
          
          </div>

          <motion.button
            id='send'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className={`h-full   bg-primary hover:bg-primary-dark rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-white ${
              isMobile ? 'p-2' : 'p-3'
            }`}
          >
            {isLoading ? (
              <Loader2 className={`text-white animate-spin ${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
            ) : (
              <Send className={`text-white ${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
            )}
          </motion.button>

          <motion.button
            id='voice'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={` h-full  bg-muted hover:bg-accent rounded-2xl transition-colors text-text-primary ${
              isMobile ? 'p-2' : 'p-3'
            }`}
          >
            <Mic className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
          </motion.button>
        </div>

                  <div className={`flex justify-between items-center mt-4 text-text-secondary ${
            isMobile ? 'text-xs' : 'text-sm'
          }`}>
            <span className={isMobile ? 'truncate max-w-[120px]' : ''}>
              {models.find(m => m.id === selectedModel)?.name || 'Загрузка...'}
            </span>
            {isPro && (
              <span className="flex items-center space-x-1">
                <Crown className="w-3 h-3 text-secondary" />
                <span>PRO</span>
              </span>
            )}
          </div>
      </motion.div>
    </div>
  )
}
