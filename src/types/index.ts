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
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
  created_at?: string
  model?: string
  chat_id?: string
  user_id?: string
  tokens_used?: number
}

export interface AIModel {
  id: string
  name: string
  provider: 'openai' | 'anthropic' | 'deepseek' | 'openrouter' | 'grok' | 'google'
  is_free: boolean
  max_tokens?: number
  daily_limit?: number
  description?: string
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
