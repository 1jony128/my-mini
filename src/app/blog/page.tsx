import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Блог ChatAIPRO - Статьи об ИИ и чат-ботах',
  description: 'Читайте статьи о чате GPT без VPN, искусственном интеллекте, чат-ботах и современных технологиях ИИ.',
  keywords: 'блог чат гпт, статьи ии, чат бот статьи, gpt без vpn статьи, искусственный интеллект блог',
  openGraph: {
    title: 'Блог ChatAIPRO - Статьи об ИИ и чат-ботах',
    description: 'Читайте статьи о чате GPT без VPN, искусственном интеллекте и современных технологиях ИИ.',
    url: 'https://aichat-pro.ru/blog',
    siteName: 'ChatAIPRO',
    locale: 'ru_RU',
    type: 'website',
  },
}

const blogPosts = [
  {
    id: 'chat-gpt-bez-vpn',
    title: 'Чат GPT без VPN: Полное руководство',
    description: 'Узнайте, как получить доступ к GPT-4 и другим ИИ моделям без использования VPN. Полное руководство по использованию ChatAIPRO.',
    date: '2025-01-27',
    readTime: '5 мин',
    tags: ['GPT-4', 'VPN', 'ИИ', 'ChatAIPRO'],
    image: '/blog/chat-gpt-bez-vpn.jpg',
    slug: 'chat-gpt-bez-vpn'
  },
  {
    id: 'ai-models-comparison',
    title: 'Сравнение ИИ моделей: GPT-4 vs Claude vs DeepSeek',
    description: 'Подробное сравнение лучших ИИ моделей. Какая модель подходит для ваших задач?',
    date: '2025-01-26',
    readTime: '7 мин',
    tags: ['GPT-4', 'Claude', 'DeepSeek', 'Сравнение'],
    image: '/blog/ai-models-comparison.jpg',
    slug: 'ai-models-comparison'
  },
  {
    id: 'free-ai-chat',
    title: 'Бесплатный чат с ИИ: Как начать общение',
    description: 'Пошаговое руководство по началу работы с бесплатным чатом ИИ. Советы и рекомендации.',
    date: '2025-01-25',
    readTime: '4 мин',
    tags: ['Бесплатно', 'ИИ', 'Начало работы'],
    image: '/blog/free-ai-chat.jpg',
    slug: 'free-ai-chat'
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background">
      {/* Header */}
      <header className="relative z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-text-primary">ChatAIPRO</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="px-6 py-2 text-text-primary hover:text-primary transition-colors"
              >
                Главная
              </Link>
              <Link 
                href="/chat"
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all font-medium"
              >
                Перейти в чат
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-6">
              Блог{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ChatAIPRO
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary mb-8 leading-relaxed">
              Статьи об искусственном интеллекте, чат-ботах и современных технологиях ИИ
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-background rounded-2xl border border-border hover:border-primary transition-all overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <h2 className="text-xl font-bold text-text-primary mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-text-secondary mb-4 line-clamp-3">
                    {post.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-text-secondary mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors font-medium"
                  >
                    <span>Читать статью</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-text-primary mb-6">
              Готовы попробовать чат с ИИ?
            </h2>
            <p className="text-xl text-text-secondary mb-8">
              Начните общение с искусственным интеллектом прямо сейчас
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                href="/chat"
                className="group px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl transition-all font-semibold text-lg flex items-center space-x-2"
              >
                <span>Начать чат</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/gpt-bez-vpn"
                className="px-8 py-4 border-2 border-border hover:border-primary text-text-primary hover:text-primary rounded-2xl transition-all font-semibold text-lg"
              >
                Узнать больше
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary">ChatAIPRO</h3>
            </div>
            <p className="text-text-secondary mb-6">
              © 2025 ChatAIPRO. Чат GPT без VPN - лучший выбор для общения с ИИ.
            </p>
            <div className="flex items-center justify-center space-x-6">
              <Link href="/" className="text-text-secondary hover:text-primary transition-colors">
                Главная
              </Link>
              <Link href="/blog" className="text-text-primary font-medium">
                Блог
              </Link>
              <Link href="/chat" className="text-text-secondary hover:text-primary transition-colors">
                Чат
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
