'use client'

import { Link } from 'react-router-dom'

interface TermsModalProps {
  isVisible: boolean
  onAccept: () => void
  onDecline: () => void
}

export function TermsModal({ isVisible, onAccept, onDecline }: TermsModalProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background p-6 rounded-lg max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">Условия использования</h3>
        <p className="text-text-secondary mb-4">
          Пожалуйста, ознакомьтесь с нашими условиями использования
        </p>
        <div className="flex space-x-2">
          <Link
            to="/terms"
            className="px-4 py-2 bg-muted text-text-primary rounded-lg hover:bg-accent"
          >
            Читать
          </Link>
          <button
            onClick={onAccept}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Принять
          </button>
          <button
            onClick={onDecline}
            className="px-4 py-2 bg-muted text-text-primary rounded-lg hover:bg-accent"
          >
            Отклонить
          </button>
        </div>
      </div>
    </div>
  )
}
