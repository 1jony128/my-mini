'use client'


import { Crown, X, Zap, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

interface ProUpgradeBannerProps {
  isVisible: boolean
  onClose: () => void
  onSwitchToFreeModel: () => void
  selectedModel?: string
}

export function ProUpgradeBanner({ isVisible, onClose, onSwitchToFreeModel, selectedModel }: ProUpgradeBannerProps) {

  const handleClose = () => {
    onClose()
  }

  const handleLater = () => {
    onSwitchToFreeModel()
    onClose()
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-lg shadow-lg mb-4 relative overflow-hidden"
      >
        {/* Фоновые элементы */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        
        {/* Кнопка закрытия */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-bold">Обновитесь до PRO</h3>
                <div className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                  РЕКОМЕНДУЕТСЯ
                </div>
              </div>
              
              {selectedModel && (
                <p className="text-white/90 mb-3">
                  Модель <strong>{selectedModel}</strong> доступна только для PRO пользователей
                </p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Check className="w-4 h-4 text-green-300" />
                  <span>Все модели ИИ</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Check className="w-4 h-4 text-green-300" />
                  <span>Безлимитные токены</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Check className="w-4 h-4 text-green-300" />
                  <span>Приоритетная поддержка</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Link
                  to="/upgrade"
                  className="bg-white text-amber-600 px-4 py-2 rounded-lg font-semibold hover:bg-white/90 transition-colors flex items-center space-x-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Обновить до PRO</span>
                </Link>
                
                <button
                  onClick={handleLater}
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Позже
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
