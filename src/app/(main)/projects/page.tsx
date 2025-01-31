import type { Metadata, ResolvingMetadata } from 'next'
import type { CollectionPage, WithContext } from 'schema-dts'

import { allProjects } from 'mdx/generated'
import PageTitle from '~/components/page-title'

import ProjectCards from '~/components/project-cards'
import { SITE_NAME, SITE_URL } from '~/config/constants'

interface PageProps {
  params: Promise<{
    locale: string
  }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata(parent: ResolvingMetadata): Promise<Metadata> {
  const previousOpenGraph = (await parent).openGraph ?? {}
  const previousTwitter = (await parent).twitter ?? {}
  const title = '项目'
  const description = '我的项目清单。所有东西都是用 ❤️ 制作'
  const url = '/projects'

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...previousOpenGraph,
      url,
      title,
      description,
    },
    twitter: {
      ...previousTwitter,
      title,
      description,
    },
  }
}

async function Page(props: PageProps) {
  const title = '项目'
  const description = '我的项目清单。所有东西都是用 ❤️ 制作'
  const url = '/projects'

  const projects = allProjects

  const jsonLd: WithContext<CollectionPage> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': url,
    'name': title,
    description,
    url,
    'isPartOf': {
      '@type': 'WebSite',
      'name': SITE_NAME,
      'url': SITE_URL,
    },
    'hasPart': allProjects.map(project => ({
      '@type': 'SoftwareApplication',
      'name': project.name,
      'description': project.description,
      'url': `${url}/${project.slug}`,
      'applicationCategory': 'WebApplication',
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageTitle
        title={title}
        description={description}
      />
      <ProjectCards projects={projects} />
    </>
  )
}

export default Page
