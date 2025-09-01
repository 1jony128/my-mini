import { Chat, Message } from '@/types'

const CHATS_KEY = 'ai-chat-chats'
const MESSAGES_KEY = 'ai-chat-messages'

export const chatStorage = {
  getChats: (): Chat[] => {
    try {
      const stored = localStorage.getItem(CHATS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading chats from localStorage:', error)
      return []
    }
  },

  setChats: (chats: Chat[]): void => {
    try {
      localStorage.setItem(CHATS_KEY, JSON.stringify(chats))
    } catch (error) {
      console.error('Error saving chats to localStorage:', error)
    }
  }
}

export const messageStorage = {
  getMessages: (chatId: string): Message[] => {
    try {
      const key = `${MESSAGES_KEY}-${chatId}`
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading messages from localStorage:', error)
      return []
    }
  },

  setMessages: (chatId: string, messages: Message[]): void => {
    try {
      const key = `${MESSAGES_KEY}-${chatId}`
      localStorage.setItem(key, JSON.stringify(messages))
    } catch (error) {
      console.error('Error saving messages to localStorage:', error)
    }
  },

  clearMessages: (chatId: string): void => {
    try {
      const key = `${MESSAGES_KEY}-${chatId}`
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error clearing messages from localStorage:', error)
    }
  }
}
