import type { Metadata } from 'next'

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '~/config/constants'

/**
 * 生成结构化数据
 */
export function generateStructuredData(type: 'article' | 'website' | 'person' | 'organization', data: any) {
  const baseStructuredData = {
    '@context': 'https://schema.org',
  }

  switch (type) {
    case 'article':
      return {
        ...baseStructuredData,
        '@type': 'Article',
        'headline': data.title,
        'description': data.description,
        'author': {
          '@type': 'Person',
          'name': data.author || SITE_NAME,
        },
        'publisher': {
          '@type': 'Organization',
          'name': SITE_NAME,
          'logo': {
            '@type': 'ImageObject',
            'url': `${SITE_URL}/images/logo.png`,
          },
        },
        'datePublished': data.publishedAt,
        'dateModified': data.modifiedAt || data.publishedAt,
        'image': data.image ? `${SITE_URL}${data.image}` : `${SITE_URL}/images/og.png`,
        'url': `${SITE_URL}${data.url}`,
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': `${SITE_URL}${data.url}`,
        },
      }

    case 'website':
      return {
        ...baseStructuredData,
        '@type': 'WebSite',
        'name': SITE_NAME,
        'description': SITE_DESCRIPTION,
        'url': SITE_URL,
        'potentialAction': {
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': `${SITE_URL}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      }

    case 'person':
      return {
        ...baseStructuredData,
        '@type': 'Person',
        'name': data.name || SITE_NAME,
        'url': SITE_URL,
        'image': data.image || `${SITE_URL}/images/avatar.png`,
        'sameAs': data.socialLinks || [],
        'jobTitle': data.jobTitle,
        'worksFor': data.organization,
      }

    default:
      return baseStructuredData
  }
}

/**
 * 生成优化的元数据
 */
export function generateMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedAt,
  modifiedAt,
  tags,
  author,
}: {
  title: string
  description: string
  image?: string
  url: string
  type?: 'website' | 'article'
  publishedAt?: string
  modifiedAt?: string
  tags?: string[]
  author?: string
}): Metadata {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`
  const fullUrl = `${SITE_URL}${url}`
  const imageUrl = image ? `${SITE_URL}${image}` : `${SITE_URL}/images/og.png`

  return {
    title: fullTitle,
    description,
    keywords: tags?.join(', '),
    authors: author ? [{ name: author }] : undefined,
    creator: author || SITE_NAME,
    publisher: SITE_NAME,

    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'zh_CN',
      type: type === 'article' ? 'article' : 'website',
      ...(type === 'article' && publishedAt && {
        publishedTime: publishedAt,
        modifiedTime: modifiedAt || publishedAt,
        authors: [author || SITE_NAME],
        tags,
      }),
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: '@030Eonova',
    },

    // 规范链接
    alternates: {
      canonical: fullUrl,
    },

    // 机器人指令
    robots: {
      index: true,
      follow: true,
      googleBot: {
        'index': true,
        'follow': true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

/**
 * 生成面包屑导航结构化数据
 */
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string, url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': `${SITE_URL}${item.url}`,
    })),
  }
}

/**
 * 生成FAQ结构化数据
 */
export function generateFAQStructuredData(faqs: Array<{ question: string, answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  }
}

/**
 * 性能监控工具
 */
export const performanceUtils = {
  // 测量首次内容绘制时间
  measureFCP: () => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            console.log('FCP:', entry.startTime)
          }
        }
      })
      observer.observe({ entryTypes: ['paint'] })
    }
  },

  // 测量最大内容绘制时间
  measureLCP: () => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log('LCP:', lastEntry.startTime)
      })
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    }
  },

  // 测量累积布局偏移
  measureCLS: () => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      let clsValue = 0
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        }
        console.log('CLS:', clsValue)
      })
      observer.observe({ entryTypes: ['layout-shift'] })
    }
  },
}
