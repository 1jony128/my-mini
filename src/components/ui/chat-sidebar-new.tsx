import { useState, useEffect } from 'react'
import { Plus, MessageSquare, Trash2, Settings, User, X, Zap, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Chat } from '@/types'
import { chatStorage } from '@/lib/localStorage'

interface ChatSidebarProps {
  currentChatId?: string
  onChatSelect: (chatId: string) => void
  onNewChat: () => void
  onDeleteChat: (chatId: string) => void
  onSettings?: () => void
  onUpgrade?: () => void
  onProfile?: () => void
  userTokens?: number
  isPro?: boolean
  selectedModel?: string
  onModelSelect?: (modelId: string) => void
  models?: Array<{ id: string; name: string; provider: string; is_free: boolean }>
  isMobile?: boolean
  isOpen?: boolean
  onClose?: () => void
}

export function ChatSidebar({
  currentChatId,
  onChatSelect,
  onNewChat,
  onDeleteChat,
  onSettings,
  onUpgrade,
  onProfile,
  userTokens = 0,
  isPro = false,
  selectedModel,
  onModelSelect,
  models = [],
  isMobile = false,
  isOpen = false,
  onClose
}: ChatSidebarProps) {
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChats()
  }, [])

  const fetchChats = async () => {
    try {
      // Сначала загружаем из localStorage
      const cachedChats = chatStorage.getChats()
      if (cachedChats.length > 0) {
        setChats(cachedChats)
      }

      // Затем загружаем свежие данные с сервера
      const { data, error } = await supabase
        .from('chats')
        .select('*')
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
    } finally {
      setLoading(false)
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
      } else {
        const updatedChats = chats.filter(chat => chat.id !== chatId)
        setChats(updatedChats)
        chatStorage.setChats(updatedChats)
        onDeleteChat(chatId)
      }
    } catch (error) {
      console.error('Ошибка удаления чата:', error)
    }
  }

  const sidebarContent = (
    <div className={`${isMobile ? 'w-full' : 'w-80'} bg-background-secondary border-r border-border flex flex-col h-full`}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="bg-primary rounded-lg flex items-center justify-center w-8 h-8">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h2 className="font-bold text-text-primary text-lg">AI Chat Pro</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors text-text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary rounded-lg flex items-center justify-center w-8 h-8">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <h2 className="font-bold text-text-primary text-xl">AI Chat Pro</h2>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Tokens Section */}
        <div className="mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onProfile}
            className="w-full flex items-center space-x-3 p-4 bg-background rounded-lg border border-border hover:bg-muted transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-lg font-bold text-primary">
                {isPro ? 'PRO' : 'Free'}
              </p>
              <p className="text-sm text-text-secondary">
                {isPro ? 'Неограниченно' : 'Starter базовый план'}
              </p>
            </div>
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
          </motion.button>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-text-primary mb-3">Быстрые действия</h3>
          <div className="space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNewChat}
              className="w-full flex items-center space-x-3 p-3 text-left hover:bg-background rounded-lg transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-text-secondary" />
              <span className="text-sm text-text-primary">Новый чат</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSettings}
              className="w-full flex items-center space-x-3 p-3 text-left hover:bg-background rounded-lg transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-text-secondary" />
              <span className="text-sm text-text-primary">Настройки</span>
            </motion.button>
          </div>
        </div>

        {/* Chat List */}
        <div>
          <h3 className="text-sm font-medium text-text-primary mb-3">Чаты</h3>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center text-text-secondary mt-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Нет чатов</p>
              <p className="text-sm">Создайте новый чат</p>
            </div>
          ) : (
            <AnimatePresence>
              {chats.map((chat) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`mb-2 p-3 rounded-lg cursor-pointer transition-all ${
                    currentChatId === chat.id
                      ? 'bg-primary text-white'
                      : 'bg-background hover:bg-muted text-text-primary border border-border'
                  }`}
                  onClick={() => onChatSelect(chat.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate">
                        {chat.title || 'Новый чат'}
                      </h3>
                      <p className="text-xs opacity-70 truncate">
                        {new Date(chat.updated_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteChat(chat.id)
                      }}
                      className="p-1 rounded hover:bg-black/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-text-secondary text-center">
          AI Chat Pro v1.0
        </div>
      </div>
    </div>
  )

  // Мобильная версия с оверлеем
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full z-50"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )
  }

  // Десктопная версия
  return sidebarContent
}
