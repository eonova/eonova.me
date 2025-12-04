import type { Metadata } from 'next'
import type { CollectionPage, WithContext } from 'schema-dts'
import BackgroundFont from '~/components/shared/background-font'
import JsonLd from '~/components/shared/json-ld'
import PageTitle from '~/components/shared/page-title'
import ProjectCards from '~/components/shared/project-cards'
import { SITE_NAME } from '~/config/constants'
import { createMetadata } from '~/config/metadata'
import { getLatestProjects } from '~/lib/content'
import { getBaseUrl, groupAndSortByYear } from '~/utils'

const title = '项目'
const description = '我的项目清单。所有东西都是用 ❤️ 制作'
const url = '/projects'

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    pathname: '/projects',
    title,
    description,
  })
}

export const dynamic = 'force-static'

async function Page() {
  const projects = getLatestProjects()

  const jsonLd: WithContext<CollectionPage> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': url,
    'name': title,
    description,
    url,
    'mainEntity': {
      '@type': 'ItemList',
      'itemListElement': projects.map((project, index) => ({
        '@type': 'SoftwareSourceCode',
        'name': project.name,
        'description': project.description,
        'url': `${url}/${project.slug}`,
        'position': index + 1,
      })),
    },
    'isPartOf': {
      '@type': 'WebSite',
      'name': SITE_NAME,
      'url': getBaseUrl(),
    },
  }

  const groupedData = groupAndSortByYear(projects)
  return (
    <>
      <JsonLd json={jsonLd} />
      <PageTitle title={title} description={description} />
      {Object.entries(groupedData)
        .reverse()
        .map(([year, projects], idx) => (
          <div className={idx !== 0 ? 'mt-5' : ''} key={year + idx}>
            <BackgroundFont
              className="text-7xl text-gray-500/50 dark:text-white/50"
              lineHeight="1.1"
            >
              {year}
            </BackgroundFont>
            <ProjectCards projects={projects} />
          </div>
        ))}
    </>
  )
}

export default Page
