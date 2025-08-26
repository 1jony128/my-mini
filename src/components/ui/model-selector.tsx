'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Check, AlertCircle, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Model {
  id: string
  name: string
  provider: string
  is_free: boolean
  max_tokens: number
  daily_limit: number
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

  const selectedModelData = models.find(m => m.id === selectedModel)

  // Проверяем доступность моделей
  useEffect(() => {
    const checkModelAvailability = async () => {
      const status: Record<string, 'available' | 'unavailable' | 'unknown'> = {}
      
      // Проверяем только первые несколько моделей для производительности
      const modelsToCheck = models.slice(0, 5)
      
      for (const model of modelsToCheck) {
        try {
          const response = await fetch('/api/models/check', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ modelId: model.id })
          })
          
          status[model.id] = response.ok ? 'available' : 'unavailable'
        } catch (error) {
          status[model.id] = 'unknown'
        }
      }
      
      setModelStatus(status)
    }

    checkModelAvailability()
  }, [models])

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
            <div className="p-2">
              {models.map((model) => (
                <motion.button
                  key={model.id}
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                  onClick={() => {
                    onModelChange(model.id)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-md text-left transition-colors ${
                    selectedModel === model.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-text-primary">
                        {model.name}
                      </span>
                      {modelStatus[model.id] && (
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(modelStatus[model.id])}
                          <span className="text-xs text-text-secondary">
                            {getStatusText(modelStatus[model.id])}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-text-secondary">
                        {model.is_free ? 'Бесплатно' : 'PRO'}
                      </span>
                      <span className="text-xs text-text-secondary">
                        {model.max_tokens.toLocaleString()} токенов
                      </span>
                      {model.daily_limit > 0 && (
                        <span className="text-xs text-text-secondary">
                          {model.daily_limit} в день
                        </span>
                      )}
                    </div>
                  </div>
                  {selectedModel === model.id && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
