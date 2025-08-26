'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Plus, Trash2, Settings, Crown } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Chat } from '@/types'
import toast from 'react-hot-toast'

interface ChatListProps {
  onNewChat: () => void
  onSelectChat: (chatId: string) => void
  selectedChatId?: string
}

export function ChatList({ onNewChat, onSelectChat, selectedChatId }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadChats()
  }, [])

  const loadChats = async () => {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('Ошибка загрузки чатов:', error)
        toast.error('Ошибка загрузки чатов')
      } else {
        setChats(data || [])
      }
    } catch (error) {
      console.error('Ошибка загрузки чатов:', error)
      toast.error('Ошибка загрузки чатов')
    } finally {
      setLoading(false)
    }
  }

  const deleteChat = async (chatId: string) => {
    try {
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId)

      if (error) {
        console.error('Ошибка удаления чата:', error)
        toast.error('Ошибка удаления чата')
      } else {
        setChats(prev => prev.filter(chat => chat.id !== chatId))
        toast.success('Чат удален')
        
        // Если удаляем выбранный чат, перенаправляем на новый
        if (selectedChatId === chatId) {
          router.push('/chat/new')
        }
      }
    } catch (error) {
      console.error('Ошибка удаления чата:', error)
      toast.error('Ошибка удаления чата')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return 'Только что'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}ч назад`
    } else {
      return date.toLocaleDateString('ru-RU')
    }
  }

  return (
    <div className="w-80 bg-white/5 backdrop-blur-sm border-r border-white/10 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Чаты</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewChat}
            className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            <Plus className="w-5 h-5 text-white" />
          </motion.button>
        </div>
        
        {/* User Info */}
        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <Crown className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">AI Chat Pro</p>
            <p className="text-xs text-white/60">1250 токенов</p>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full"
            />
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center text-white/60 mt-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Нет чатов</p>
            <p className="text-sm">Создайте новый чат</p>
          </div>
        ) : (
          <AnimatePresence>
            {chats.map((chat, index) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`mb-2 p-3 rounded-lg cursor-pointer transition-all ${
                  selectedChatId === chat.id
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
                onClick={() => onSelectChat(chat.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">
                      {chat.title}
                    </h3>
                    <p className="text-xs text-white/60 mt-1">
                      {formatDate(chat.updated_at)}
                    </p>
                    <p className="text-xs text-purple-400 mt-1">
                      {chat.model}
                    </p>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteChat(chat.id)
                    }}
                    className="p-1 text-white/40 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/settings')}
          className="w-full flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Settings className="w-5 h-5 text-white/60" />
          <span className="text-sm text-white/60">Настройки</span>
        </motion.button>
      </div>
    </div>
  )
}

