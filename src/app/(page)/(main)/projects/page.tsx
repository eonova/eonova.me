import type { Metadata, ResolvingMetadata } from 'next'
import type { CollectionPage, WithContext } from 'schema-dts'

import { allProjects } from 'content-collections'
import BackgroundFont from '~/components/background-font'

import PageTitle from '~/components/page-title'
import ProjectCards from '~/components/project-cards'
import { SITE_NAME, SITE_URL } from '~/config/constants'
import { groupAndSortByYear } from '~/utils/group-sort-by-year'

const title = '项目'
const description = '我的项目清单。所有东西都是用 ❤️ 制作'
const url = '/projects'

export async function generateMetadata(
  _props: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const previousOpenGraph = (await parent).openGraph ?? {}
  const previousTwitter = (await parent).twitter ?? {}

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

async function Page() {
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

  const groupedData = groupAndSortByYear(projects)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/cn-fontsource-ding-talk-jin-bu-ti-regular/font.css"></link>
      <PageTitle
        title={title}
        description={description}
      />
      {Object.entries(groupedData).reverse().map(([year, projects], idx) => (
        <div className={idx !== 0 ? 'mt-5' : ''} key={year + idx}>
          <BackgroundFont className="text-7xl text-gray-500/50 dark:text-white/50" lineHeight="1.1">{year}</BackgroundFont>
          <ProjectCards projects={projects} />
        </div>
      ))}
    </>
  )
}

export default Page
