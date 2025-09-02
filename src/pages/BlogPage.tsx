import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, User, Clock, BookOpen } from 'lucide-react'
import { useMeta } from '@/hooks/useMeta'

export default function BlogPage() {
  // SEO мета-теги для страницы блога
  useMeta({
    title: "Блог об ИИ - ChatAI PRO | Новости искусственного интеллекта",
    description: "Читайте последние новости и статьи об искусственном интеллекте, GPT-4, Claude, DeepSeek. Обзоры ИИ-моделей, советы и гайды.",
    keywords: "блог об ии, новости искусственного интеллекта, обзоры gpt-4, статьи о claude, deepseek обзор, chatgpt новости, ии технологии",
    ogTitle: "Блог об ИИ - ChatAI PRO",
    ogDescription: "Читайте последние новости и статьи об искусственном интеллекте, GPT-4, Claude, DeepSeek.",
    ogUrl: "https://aichat-pro.ru/blog"
  })
  const navigate = useNavigate()

  const blogPosts = [
    {
      id: '1',
      title: 'Как ИИ изменит нашу жизнь в 2024 году',
      excerpt: 'Обзор последних достижений в области искусственного интеллекта и их влияние на повседневную жизнь.',
      author: 'Команда ChatAI',
      date: '2024-01-15',
      readTime: '5 мин',
      image: '/api/placeholder/400/200',
      category: 'Технологии'
    },
    {
      id: '2',
      title: 'GPT-4 vs Claude: Сравнение возможностей',
      excerpt: 'Детальное сравнение двух ведущих языковых моделей и их сильных сторон.',
      author: 'Команда ChatAI',
      date: '2024-01-10',
      readTime: '7 мин',
      image: '/api/placeholder/400/200',
      category: 'Сравнения'
    },
    {
      id: '3',
      title: 'Безопасность в эпоху ИИ: Что нужно знать',
      excerpt: 'Важные аспекты безопасности при использовании искусственного интеллекта.',
      author: 'Команда ChatAI',
      date: '2024-01-05',
      readTime: '6 мин',
      image: '/api/placeholder/400/200',
      category: 'Безопасность'
    },
    {
      id: '4',
      title: 'Продуктивность с помощью ИИ: Практические советы',
      excerpt: 'Как использовать ИИ для повышения личной и профессиональной продуктивности.',
      author: 'Команда ChatAI',
      date: '2023-12-28',
      readTime: '8 мин',
      image: '/api/placeholder/400/200',
      category: 'Продуктивность'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border bg-background">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors text-text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">Блог</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Блог о ИИ и технологиях
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Узнавайте о последних новостях в мире искусственного интеллекта, 
            полезных советах и практических применениях ИИ.
          </p>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-background-secondary rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/blog/${post.id}`)}
            >
              {/* Image */}
              <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-primary/50" />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category */}
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                    {post.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-text-primary mb-3 line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-text-secondary mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-sm text-text-secondary">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors">
            Загрузить еще
          </button>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-background-secondary border-t border-border py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-text-primary mb-4">
            Подпишитесь на обновления
          </h3>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Получайте уведомления о новых статьях и последних новостях в мире ИИ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Ваш email"
              className="flex-1 px-4 py-3 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors">
              Подписаться
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
