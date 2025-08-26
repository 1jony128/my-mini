'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, FileText, Shield } from 'lucide-react'
import Link from 'next/link'

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
}

export function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)

  const handleAccept = () => {
    if (acceptedTerms && acceptedPrivacy) {
      onAccept()
      onClose()
    }
  }

  const handleClose = () => {
    setAcceptedTerms(false)
    setAcceptedPrivacy(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="bg-primary rounded-lg flex items-center justify-center w-8 h-8">
                  <Shield className="text-white w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-text-primary">Согласие с условиями</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Перед покупкой PRO подписки
                </h3>
                <p className="text-text-secondary">
                  Пожалуйста, ознакомьтесь и согласитесь с нашими условиями использования и политикой конфиденциальности
                </p>
              </div>

              {/* Terms Checkbox */}
              <div className="bg-background-secondary rounded-xl p-4 border border-border">
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => setAcceptedTerms(!acceptedTerms)}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      acceptedTerms 
                        ? 'bg-primary border-primary' 
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    {acceptedTerms && <CheckCircle className="w-4 h-4 text-white" />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="font-medium text-text-primary">
                        Пользовательское соглашение
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mb-3">
                      Я соглашаюсь с условиями использования сервиса AI Chat Pro
                    </p>
                    <Link
                      href="/terms"
                      target="_blank"
                      className="text-sm text-primary hover:underline"
                    >
                      Читать полное соглашение →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Privacy Checkbox */}
              <div className="bg-background-secondary rounded-xl p-4 border border-border">
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => setAcceptedPrivacy(!acceptedPrivacy)}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      acceptedPrivacy 
                        ? 'bg-primary border-primary' 
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    {acceptedPrivacy && <CheckCircle className="w-4 h-4 text-white" />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="font-medium text-text-primary">
                        Политика конфиденциальности
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mb-3">
                      Я соглашаюсь с политикой обработки персональных данных
                    </p>
                    <Link
                      href="/privacy"
                      target="_blank"
                      className="text-sm text-primary hover:underline"
                    >
                      Читать политику конфиденциальности →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-text-primary mb-1">Важно</h4>
                    <p className="text-sm text-text-secondary">
                      Нажимая "Продолжить", вы подтверждаете, что прочитали и согласны с условиями. 
                      Подписка будет автоматически продлеваться до отмены.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-border">
              <button
                onClick={handleClose}
                className="px-6 py-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                Отмена
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAccept}
                disabled={!acceptedTerms || !acceptedPrivacy}
                className={`px-6 py-2 rounded-xl font-semibold transition-colors ${
                  acceptedTerms && acceptedPrivacy
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'bg-muted text-text-secondary cursor-not-allowed'
                }`}
              >
                Продолжить
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
