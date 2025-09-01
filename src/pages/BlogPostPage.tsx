import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, User, Clock, Share2, BookOpen } from 'lucide-react'

export default function BlogPostPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Мок данные для статьи
  const post = {
    id: id || '1',
    title: 'Как ИИ изменит нашу жизнь в 2024 году',
    content: `
      <p>Искусственный интеллект продолжает стремительно развиваться, и 2024 год обещает стать переломным моментом в истории технологий. В этой статье мы рассмотрим ключевые тенденции и их влияние на нашу повседневную жизнь.</p>
      
      <h2>1. Персонализированные ИИ-ассистенты</h2>
      <p>Одной из самых значимых тенденций 2024 года станет появление действительно персонализированных ИИ-ассистентов. Эти системы будут не просто отвечать на вопросы, но и предугадывать потребности пользователей, адаптироваться к их стилю жизни и предпочтениям.</p>
      
      <h2>2. ИИ в здравоохранении</h2>
      <p>Медицинская отрасль переживает революцию благодаря ИИ. От диагностики заболеваний до разработки новых лекарств - искусственный интеллект становится незаменимым инструментом для врачей и исследователей.</p>
      
      <h2>3. Автоматизация рабочих процессов</h2>
      <p>Компании все чаще используют ИИ для автоматизации рутинных задач, что позволяет сотрудникам сосредоточиться на более творческой и стратегической работе. Это приводит к повышению производительности и удовлетворенности от работы.</p>
      
      <h2>4. ИИ в образовании</h2>
      <p>Персонализированное обучение становится реальностью благодаря ИИ. Системы могут адаптировать учебные материалы под индивидуальные потребности каждого студента, что значительно повышает эффективность обучения.</p>
      
      <h2>Заключение</h2>
      <p>2024 год станет годом, когда ИИ перестанет быть просто технологией будущего и станет неотъемлемой частью нашей повседневной жизни. Важно быть готовыми к этим изменениям и использовать возможности, которые предоставляет искусственный интеллект.</p>
    `,
    author: 'Команда ChatAI',
    date: '2024-01-15',
    readTime: '5 мин',
    category: 'Технологии',
    tags: ['ИИ', 'Технологии', '2024', 'Будущее']
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.title,
        url: window.location.href
      })
    } else {
      // Fallback для браузеров без поддержки Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert('Ссылка скопирована в буфер обмена!')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border bg-background">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/blog')}
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

        <button
          onClick={handleShare}
          className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors text-text-primary"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <header className="mb-8">
          {/* Category */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-text-primary mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center justify-between text-text-secondary mb-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{new Date(post.date).toLocaleDateString('ru-RU')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-muted text-text-secondary text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-8">
          <div className="h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-primary/50" />
          </div>
        </div>

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none text-text-primary"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">Поделиться статьей</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Поделиться</span>
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      <section className="bg-background-secondary border-t border-border py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-text-primary mb-8">Похожие статьи</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <article
                key={i}
                className="bg-background rounded-xl border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/blog/${i + 1}`)}
              >
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  GPT-4 vs Claude: Сравнение возможностей
                </h3>
                <p className="text-text-secondary mb-4 line-clamp-2">
                  Детальное сравнение двух ведущих языковых моделей и их сильных сторон.
                </p>
                <div className="flex items-center justify-between text-sm text-text-secondary">
                  <span>Команда ChatAI</span>
                  <span>7 мин</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
