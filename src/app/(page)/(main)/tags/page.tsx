import type { Metadata } from 'next'
import type { WebPage, WithContext } from 'schema-dts'
import { allPosts } from 'content-collections'
import Link from 'next/link'
import { Badge } from '~/components/base/badge'
import JsonLd from '~/components/shared/json-ld'
import PageTitle from '~/components/shared/page-title'
import { MY_NAME } from '~/config/constants'
import { createMetadata } from '~/lib/metadata'
import { getBaseUrl } from '~/utils'

const title = '标签'
const description = '标签内容'

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title,
    description,
    pathname: '/tags',
  })
}

export default function TagsPage() {
  const tags = new Set<string>()

  allPosts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach(tag => tags.add(tag))
    }
  })

  const sortedTags = Array.from(tags).sort()

  const jsonLd: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': title,
    'description': description,
    'url': `${getBaseUrl()}/tags`,
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
      <div className="flex flex-wrap gap-4">
        {sortedTags.length > 0
          ? (
              sortedTags.map(tag => (
                <Link key={tag} href={`/tags/${tag}`}>
                  <Badge variant="secondary" className="px-4 py-2 text-base hover:bg-secondary/80">
                    #
                    {tag}
                  </Badge>
                </Link>
              ))
            )
          : (
              <p className="text-muted-foreground">No tags found.</p>
            )}
      </div>
    </>
  )
}
