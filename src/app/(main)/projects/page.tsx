import type { Metadata } from 'next'
import type { CollectionPage, WithContext } from 'schema-dts'

import { allProjects } from 'mdx/generated'
import BackgroundFont from '~/components/background-font'

import PageTitle from '~/components/page-title'
import ProjectCards from '~/components/project-cards'
import { SITE_NAME, SITE_URL } from '~/config/constants'

export async function generateMetadata(): Promise<Metadata> {
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
      url,
      title,
      description,
    },
    twitter: {
      title,
      description,
    },
  }
}

async function Page() {
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
      <BackgroundFont className="text-7xl text-gray-500/50 dark:text-white/50" lineHeight="1.2">2025年</BackgroundFont>
      <ProjectCards projects={projects} />
    </>
  )
}

export default Page
