import { themeConfig } from '@/config'

// Profile links kept in sync with SocialLink.astro
const sameAs = ['https://github.com/leamandeep', 'https://linkedin.com/in/leamandeep']

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person' as const,
  name: themeConfig.site.author,
  url: themeConfig.site.website,
  description: themeConfig.site.description,
  email: 'mailto:deep.aman6174@gmail.com',
  sameAs
}

export function blogPostingJsonLd(params: {
  title: string
  description: string
  publishDate: Date
  updatedDate?: Date
  tags: string[]
  url: URL
  image: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting' as const,
    headline: params.title,
    description: params.description,
    image: params.image,
    datePublished: params.publishDate.toISOString(),
    dateModified: (params.updatedDate ?? params.publishDate).toISOString(),
    inLanguage: themeConfig.site.language,
    keywords: params.tags.join(', '),
    author: personJsonLd,
    publisher: {
      '@type': 'Organization',
      name: themeConfig.site.author,
      url: themeConfig.site.website
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': params.url.toString()
    }
  }
}
