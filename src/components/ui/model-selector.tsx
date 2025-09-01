'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Check, AlertCircle, Zap, Crown, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSupabase } from '@/components/providers/supabase-provider'
import { getModelCost, isModelAvailableForPlan } from '@/lib/pro-credits'
import { ProUpgradeBanner } from './pro-upgrade-banner'
import { checkModelAvailability } from '@/api/models-check'

interface Model {
  id: string
  name: string
  provider: string
  is_free: boolean
  max_tokens?: number
  daily_limit?: number
}

interface ModelSelectorProps {
  models: Model[]
  selectedModel: string
  onModelChange: (modelId: string) => void
  isLoading?: boolean
}

export function ModelSelector({ models, selectedModel, onModelChange, isLoading = false }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [modelStatus, setModelStatus] = useState<Record<string, 'available' | 'unavailable' | 'unknown'>>({})
  const [userPlan, setUserPlan] = useState<string | null>(null)
  const [isPro, setIsPro] = useState(false)
  const [showProBanner, setShowProBanner] = useState(false)
  const { user, supabase } = useSupabase()

  const selectedModelData = models.find(m => m.id === selectedModel)

  // Получаем данные пользователя
  useEffect(() => {
    const getUserData = async () => {
      if (!user) return
      
      try {
        const { data: userData } = await supabase
          .from('users')
          .select('is_pro, pro_plan_type')
          .eq('id', user.id)
          .single()
        
        if (userData) {
          setIsPro((userData as any).is_pro || false)
          setUserPlan((userData as any).pro_plan_type)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    getUserData()
  }, [user, supabase])

  // Проверяем доступность моделей
  useEffect(() => {
    const checkModelsAvailability = async () => {
      const status: Record<string, 'available' | 'unavailable' | 'unknown'> = {}
      
      // Проверяем только первые несколько моделей для производительности
      const modelsToCheck = models.slice(0, 5)
      
      for (const model of modelsToCheck) {
        try {
          const result = await checkModelAvailability({ modelId: model.id })
          status[model.id] = result.available ? 'available' : 'unavailable'
        } catch (error) {
          status[model.id] = 'unknown'
        }
      }
      
      setModelStatus(status)
    }

    checkModelsAvailability()
  }, [models])

  // Проверяем доступность модели для плана
  const isModelAvailableForUser = (modelId: string): boolean => {
    if (!isPro || !userPlan) {
      return modelId === 'deepseek' || modelId === 'gpt-3.5-turbo' || modelId === 'claude-3-haiku' || modelId === 'gemini-pro'
    }
    
    return isModelAvailableForPlan(modelId, userPlan as any)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <Check className="w-4 h-4 text-success" />
      case 'unavailable':
        return <AlertCircle className="w-4 h-4 text-error" />
      default:
        return <Zap className="w-4 h-4 text-warning" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Доступна'
      case 'unavailable':
        return 'Недоступна'
      default:
        return 'Проверяется'
    }
  }

  const getModelCostDisplay = (modelId: string) => {
    const cost = getModelCost(modelId)
    if (cost === 1) return null
    
    return (
      <div className="flex items-center space-x-1">
        <Crown className="w-3 h-3 text-amber-500" />
        <span className="text-xs text-amber-600 font-medium">{cost}x</span>
      </div>
    )
  }

  const getModelAvailabilityIcon = (modelId: string) => {
    if (!isModelAvailableForUser(modelId)) {
      return <Lock className="w-3 h-3 text-gray-400" />
    }
    return null
  }

  const handleModelChange = (modelId: string) => {
    const model = models.find(m => m.id === modelId)
    
    // Если выбрана платная модель и пользователь не PRO
    if (model && !model.is_free && !isPro) {
      setShowProBanner(true)
      return // Не меняем модель
    }
    
    // Если все ок, меняем модель
    onModelChange(modelId)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center justify-between w-full px-3 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
      >
        <div className="flex items-center space-x-2">
          {selectedModelData && (
            <>
              <span className="text-sm font-medium text-text-primary">
                {selectedModelData.name}
              </span>
              {getModelCostDisplay(selectedModel)}
              {getModelAvailabilityIcon(selectedModel)}
              {modelStatus[selectedModel] && (
                <div className="flex items-center space-x-1">
                  {getStatusIcon(modelStatus[selectedModel])}
                  <span className="text-xs text-text-secondary">
                    {getStatusText(modelStatus[selectedModel])}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            {models.map((model) => {
              const isAvailable = isModelAvailableForUser(model.id)
              const isSelected = model.id === selectedModel
              
              return (
                <motion.button
                  key={model.id}
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                  onClick={() => {
                    if (isAvailable) {
                      handleModelChange(model.id)
                    }
                  }}
                  disabled={!isAvailable}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  } ${!isAvailable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {model.name}
                    </span>
                    {getModelCostDisplay(model.id)}
                    {getModelAvailabilityIcon(model.id)}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isSelected && <Check className="w-4 h-4" />}
                    {modelStatus[model.id] && (
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(modelStatus[model.id])}
                        <span className="text-xs">
                          {getStatusText(modelStatus[model.id])}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* PRO Upgrade Banner */}
      <ProUpgradeBanner
        isVisible={showProBanner}
        onClose={() => setShowProBanner(false)}
        selectedModel={models.find(m => !m.is_free)?.name}
      />
    </div>
  )
}
