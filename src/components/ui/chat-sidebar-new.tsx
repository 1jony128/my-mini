import { useState, useEffect } from 'react'
import { Plus, MessageSquare, Trash2, Settings, User, X, Zap, Sparkles, Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Chat } from '@/types'
import { chatStorage } from '@/lib/localStorage'
import { useApp } from '@/components/providers/app-provider'
import { useTheme } from '@/components/providers/theme-provider'
import toast from 'react-hot-toast'

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
  canCreateChat?: () => boolean
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
  onClose,
  canCreateChat
}: ChatSidebarProps) {
  const { chats, updateChats, updateChatTitle } = useApp()
  const { theme, toggleTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null)



  const handleDeleteChat = async (chatId: string) => {
    // Находим чат для отображения названия в подтверждении
    const chatToDelete = chats.find(chat => chat.id === chatId)
    const chatTitle = chatToDelete?.title || 'Новый чат'
    
    // Показываем подтверждение
    const confirmed = window.confirm(
      `Вы уверены, что хотите удалить чат "${chatTitle}"?\n\nЭто действие нельзя отменить.`
    )
    
    if (!confirmed) {
      return
    }

    try {
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId)

      if (error) {
        console.error('Ошибка удаления чата:', error)
        toast.error('Ошибка удаления чата')
      } else {
        const updatedChats = chats.filter(chat => chat.id !== chatId)
        updateChats(updatedChats)
        onDeleteChat(chatId)
        toast.success('Чат успешно удален')
      }
    } catch (error) {
      console.error('Ошибка удаления чата:', error)
      toast.error('Ошибка удаления чата')
    }
  }

  const handleEditChat = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId)
    setEditingTitle(currentTitle)
  }

  const handleSaveEdit = async () => {
    if (!editingChatId || !editingTitle.trim()) return

    try {
      await updateChatTitle(editingChatId, editingTitle.trim())
      setEditingChatId(null)
      setEditingTitle('')
    } catch (error) {
      console.error('Ошибка сохранения названия чата:', error)
      // В случае ошибки возвращаем исходное название
      const currentChat = chats.find(chat => chat.id === editingChatId)
      if (currentChat) {
        setEditingTitle(currentChat.title || 'Новый чат')
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingChatId(null)
    setEditingTitle('')
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
              onClick={() => {
                if (canCreateChat && !canCreateChat()) {
                  toast.error('Достигнут лимит чатов (10) для бесплатного плана. Перейдите на PRO для создания неограниченного количества чатов.')
                  return
                }
                onNewChat()
              }}
              className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg transition-colors ${
                canCreateChat && !canCreateChat() 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-background'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-text-secondary" />
              <span className="text-sm text-text-primary">Новый чат</span>
              {canCreateChat && !canCreateChat() && (
                <span className="text-xs text-text-secondary ml-auto">(10/10)</span>
              )}
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
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleTheme}
              className="w-full flex items-center space-x-3 p-3 text-left hover:bg-background rounded-lg transition-colors cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-text-secondary" />
              ) : (
                <Moon className="w-4 h-4 text-text-secondary" />
              )}
              <span className="text-sm text-text-primary">
                {theme === 'dark' ? 'Светлая тема' : 'Темная тема'}
              </span>
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
                  onMouseEnter={() => setHoveredChatId(chat.id)}
                  onMouseLeave={() => setHoveredChatId(null)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      {editingChatId === chat.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveEdit()
                              } else if (e.key === 'Escape') {
                                handleCancelEdit()
                              }
                            }}
                            className="flex-1 text-sm bg-transparent border-none outline-none"
                            autoFocus
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSaveEdit()
                            }}
                            className="p-1 rounded hover:bg-black/10 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCancelEdit()
                            }}
                            className="p-1 rounded hover:bg-black/10 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-sm font-medium truncate">
                            {chat.title || 'Новый чат'}
                          </h3>
                          <p className="text-xs opacity-70 truncate">
                            {new Date(chat.updated_at).toLocaleDateString('ru-RU')}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      {editingChatId !== chat.id && hoveredChatId === chat.id && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditChat(chat.id, chat.title || 'Новый чат')
                          }}
                          className="p-1 rounded hover:bg-black/10 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </motion.button>
                      )}
                      {hoveredChatId === chat.id && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
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
                      )}
                    </div>
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
