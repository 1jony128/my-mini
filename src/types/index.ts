export interface User {
  id: string
  email: string
  created_at: string
  tokens_balance: number
  is_pro: boolean
  daily_tokens_used: number
  last_daily_reset: string
}

export interface Chat {
  id: string
  user_id: string
  title: string
  model: string
  created_at: string
  updated_at: string
  last_message?: string
}

export interface Message {
  id: string
  chat_id: string
  user_id: string
  content: string
  role: 'user' | 'assistant'
  model: string
  tokens_used: number
  created_at: string
  timestamp?: Date
  formatted_time?: string
}

export interface AIModel {
  id: string
  name: string
  provider: 'openai' | 'anthropic' | 'deepseek' | 'openrouter' | 'grok'
  is_free: boolean
  max_tokens: number
  daily_limit: number
}

export interface Subscription {
  id: string
  user_id: string
  status: 'active' | 'cancelled' | 'expired'
  plan: 'monthly' | 'yearly'
  created_at: string
  expires_at: string
  yookassa_payment_id: string
}

export interface TokenPackage {
  id: string
  name: string
  tokens: number
  price: number
  description: string
}

export interface Payment {
  id: string
  user_id: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed'
  type: 'subscription' | 'tokens'
  yookassa_payment_id: string
  created_at: string
}
