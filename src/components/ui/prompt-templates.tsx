'use client'

import { motion } from 'framer-motion'
import { FileText, Eye, GraduationCap, ChefHat } from 'lucide-react'

interface PromptTemplatesProps {
  onSelectTemplate: (prompt: string) => void
}

const templates = [
  {
    id: 1,
    icon: FileText,
    iconColor: 'text-blue-500',
    text: 'Напиши доклад на тему',
    prompt: 'Напиши доклад на тему '
  },
  {
    id: 2,
    icon: Eye,
    iconColor: 'text-red-500',
    text: 'Расскажи что-нибудь интересное',
    prompt: 'Расскажи что-нибудь интересное'
  },
  {
    id: 3,
    icon: GraduationCap,
    iconColor: 'text-blue-500',
    text: 'Что может делать ChatGPT',
    prompt: 'Что может делать ChatGPT? Расскажи подробно о возможностях и ограничениях.'
  },
  {
    id: 4,
    icon: ChefHat,
    iconColor: 'text-green-500',
    text: 'Рецепт из того, что есть у меня в холодильнике',
    prompt: 'Придумай рецепт из того, что есть у меня в холодильнике. У меня есть: '
  }
]

export function PromptTemplates({ onSelectTemplate }: PromptTemplatesProps) {
  return (
    <div className="w-full">
      <h3 className="text-lg font-medium text-foreground mb-4 text-center">
        Попробуйте один из шаблонов
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {templates.map((template, index) => (
          <motion.button
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectTemplate(template.prompt)}
            className="flex flex-col items-center p-4 bg-background-secondary rounded-lg border border-border hover:bg-muted transition-colors cursor-pointer group"
          >
            <div className={`w-8 h-8 mb-3 ${template.iconColor} group-hover:scale-110 transition-transform`}>
              <template.icon className="w-full h-full" />
            </div>
            <p className="text-sm text-foreground text-center leading-tight">
              {template.text}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
