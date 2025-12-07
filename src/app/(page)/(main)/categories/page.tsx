import type { Metadata } from 'next'
import type { WebPage, WithContext } from 'schema-dts'
import { allPosts } from 'content-collections'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/base/card'
import JsonLd from '~/components/shared/json-ld'
import PageTitle from '~/components/shared/page-title'
import { MY_NAME } from '~/config/constants'
import { CATEGORIES } from '~/config/posts'
import { createMetadata } from '~/lib/metadata'
import { getBaseUrl } from '~/utils'

const title = '分类'
const description = '分类内容'

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title,
    description,
    pathname: '/categories',
  })
}

export default function CategoriesPage() {
  const jsonLd: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': title,
    'description': description,
    'url': `${getBaseUrl()}/categories`,
    'isPartOf': {
      '@type': 'WebSite',
      'name': MY_NAME,
      'url': getBaseUrl(),
    },
  }
  return (
    <>
      <JsonLd json={jsonLd} />
      <PageTitle title={title} description={description} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {CATEGORIES.map((category) => {
          const count = allPosts.filter(post => post.categories?.includes(category.label)).length

          return (
            <Link key={category.label} href={`/categories/${category.label}`}>
              <Card className="h-full transition-colors hover:bg-accent/50">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {category.icon}
                  </div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-sm capitalize text-muted-foreground">{category.label}</p>
                    <span className="text-sm font-medium text-muted-foreground">
                      {count}
                      {' '}
                      posts
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </>
  )
}
