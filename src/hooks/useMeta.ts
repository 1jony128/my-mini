import { useEffect } from 'react'

interface MetaOptions {
  title?: string
  description?: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogUrl?: string
}

export function useMeta(options: MetaOptions) {
  useEffect(() => {
    // Обновляем title
    if (options.title) {
      document.title = options.title
    }

    // Обновляем description
    if (options.description) {
      const descriptionMeta = document.querySelector('meta[name="description"]')
      if (descriptionMeta) {
        descriptionMeta.setAttribute('content', options.description)
      }
    }

    // Обновляем keywords
    if (options.keywords) {
      const keywordsMeta = document.querySelector('meta[name="keywords"]')
      if (keywordsMeta) {
        keywordsMeta.setAttribute('content', options.keywords)
      }
    }

    // Обновляем Open Graph title
    if (options.ogTitle) {
      const ogTitleMeta = document.querySelector('meta[property="og:title"]')
      if (ogTitleMeta) {
        ogTitleMeta.setAttribute('content', options.ogTitle)
      }
    }

    // Обновляем Open Graph description
    if (options.ogDescription) {
      const ogDescMeta = document.querySelector('meta[property="og:description"]')
      if (ogDescMeta) {
        ogDescMeta.setAttribute('content', options.ogDescription)
      }
    }

    // Обновляем Open Graph URL
    if (options.ogUrl) {
      const ogUrlMeta = document.querySelector('meta[property="og:url"]')
      if (ogUrlMeta) {
        ogUrlMeta.setAttribute('content', options.ogUrl)
      }
    }

    // Обновляем Twitter meta
    if (options.title) {
      const twitterTitleMeta = document.querySelector('meta[name="twitter:title"]')
      if (twitterTitleMeta) {
        twitterTitleMeta.setAttribute('content', options.title)
      }
    }

    if (options.description) {
      const twitterDescMeta = document.querySelector('meta[name="twitter:description"]')
      if (twitterDescMeta) {
        twitterDescMeta.setAttribute('content', options.description)
      }
    }
  }, [options.title, options.description, options.keywords, options.ogTitle, options.ogDescription, options.ogUrl])
}
