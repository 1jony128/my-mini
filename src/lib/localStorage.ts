import { Chat, Message } from '@/types'

// Ключи для localStorage
const CHATS_KEY = 'chatAIPRO_chats'
const MESSAGES_KEY = 'chatAIPRO_messages_'
const USER_PREFIX = 'chatAIPRO_user_'

// Утилиты для работы с чатами
export const chatStorage = {
  // Получить чаты из localStorage
  getChats: (): Chat[] => {
    try {
      const cached = localStorage.getItem(CHATS_KEY)
      return cached ? JSON.parse(cached) : []
    } catch (error) {
      console.error('Ошибка чтения чатов из localStorage:', error)
      return []
    }
  },

  // Сохранить чаты в localStorage
  setChats: (chats: Chat[]): void => {
    try {
      localStorage.setItem(CHATS_KEY, JSON.stringify(chats))
    } catch (error) {
      console.error('Ошибка сохранения чатов в localStorage:', error)
    }
  },

  // Добавить новый чат
  addChat: (chat: Chat): void => {
    try {
      const chats = chatStorage.getChats()
      const updatedChats = [chat, ...chats]
      chatStorage.setChats(updatedChats)
    } catch (error) {
      console.error('Ошибка добавления чата в localStorage:', error)
    }
  },

  // Обновить чат
  updateChat: (chatId: string, updates: Partial<Chat>): void => {
    try {
      const chats = chatStorage.getChats()
      const updatedChats = chats.map(chat => 
        chat.id === chatId ? { ...chat, ...updates } : chat
      )
      chatStorage.setChats(updatedChats)
    } catch (error) {
      console.error('Ошибка обновления чата в localStorage:', error)
    }
  },

  // Удалить чат
  deleteChat: (chatId: string): void => {
    try {
      const chats = chatStorage.getChats()
      const updatedChats = chats.filter(chat => chat.id !== chatId)
      chatStorage.setChats(updatedChats)
      
      // Также удаляем сообщения этого чата
      messageStorage.deleteMessages(chatId)
    } catch (error) {
      console.error('Ошибка удаления чата из localStorage:', error)
    }
  }
}

// Утилиты для работы с сообщениями
export const messageStorage = {
  // Получить сообщения чата из localStorage
  getMessages: (chatId: string): Message[] => {
    try {
      const cached = localStorage.getItem(`${MESSAGES_KEY}${chatId}`)
      return cached ? JSON.parse(cached) : []
    } catch (error) {
      console.error('Ошибка чтения сообщений из localStorage:', error)
      return []
    }
  },

  // Сохранить сообщения чата в localStorage
  setMessages: (chatId: string, messages: Message[]): void => {
    try {
      localStorage.setItem(`${MESSAGES_KEY}${chatId}`, JSON.stringify(messages))
    } catch (error) {
      console.error('Ошибка сохранения сообщений в localStorage:', error)
    }
  },

  // Добавить сообщение к чату
  addMessage: (chatId: string, message: Message): void => {
    try {
      const messages = messageStorage.getMessages(chatId)
      const updatedMessages = [...messages, message]
      messageStorage.setMessages(chatId, updatedMessages)
    } catch (error) {
      console.error('Ошибка добавления сообщения в localStorage:', error)
    }
  },

  // Очистить сообщения чата
  clearMessages: (chatId: string): void => {
    try {
      localStorage.removeItem(`${MESSAGES_KEY}${chatId}`)
    } catch (error) {
      console.error('Ошибка очистки сообщений из localStorage:', error)
    }
  },

  // Удалить сообщения чата
  deleteMessages: (chatId: string): void => {
    try {
      localStorage.removeItem(`${MESSAGES_KEY}${chatId}`)
    } catch (error) {
      console.error('Ошибка удаления сообщений из localStorage:', error)
    }
  }
}

// Утилиты для работы с настройками пользователя
export const userStorage = {
  // Получить настройки пользователя
  getUserSettings: (userId: string): any => {
    try {
      const cached = localStorage.getItem(`${USER_PREFIX}${userId}`)
      return cached ? JSON.parse(cached) : {}
    } catch (error) {
      console.error('Ошибка чтения настроек пользователя из localStorage:', error)
      return {}
    }
  },

  // Сохранить настройки пользователя
  setUserSettings: (userId: string, settings: any): void => {
    try {
      localStorage.setItem(`${USER_PREFIX}${userId}`, JSON.stringify(settings))
    } catch (error) {
      console.error('Ошибка сохранения настроек пользователя в localStorage:', error)
    }
  },

  // Очистить все данные пользователя
  clearUserData: (userId: string): void => {
    try {
      localStorage.removeItem(`${USER_PREFIX}${userId}`)
      // Также очищаем чаты и сообщения
      localStorage.removeItem(CHATS_KEY)
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(MESSAGES_KEY)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Ошибка очистки данных пользователя из localStorage:', error)
    }
  }
}

// Общие утилиты
export const storageUtils = {
  // Очистить все данные приложения
  clearAll: (): void => {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('chatAIPRO_')) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Ошибка очистки localStorage:', error)
    }
  },

  // Получить размер данных в localStorage
  getSize: (): number => {
    try {
      let size = 0
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('chatAIPRO_')) {
          size += localStorage.getItem(key)?.length || 0
        }
      })
      return size
    } catch (error) {
      console.error('Ошибка подсчета размера localStorage:', error)
      return 0
    }
  }
}
