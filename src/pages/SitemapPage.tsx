import { useEffect } from 'react'

export default function SitemapPage() {
  useEffect(() => {
    // Перенаправляем на статический sitemap.xml
    window.location.href = '/sitemap.xml'
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Перенаправление на Sitemap</h1>
        <p className="text-text-secondary">
          Перенаправляем на{' '}
          <a 
            href="/sitemap.xml" 
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            sitemap.xml
          </a>
        </p>
      </div>
    </div>
  )
}
