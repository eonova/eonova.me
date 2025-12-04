import type { Metadata } from 'next'
import type { SoftwareSourceCode, WithContext } from 'schema-dts'

import { allProjects } from 'content-collections'
import { notFound } from 'next/navigation'

import { BlurImage } from '~/components/base/blur-image'
import Mdx from '~/components/modules/mdx'

import Header from '~/components/pages/projects/header'
import JsonLd from '~/components/shared/json-ld'
import { MY_NAME, SITE_URL } from '~/config/constants'
import { createMetadata } from '~/config/metadata'
import { getProjectBySlug } from '~/lib/content'
import { getBaseUrl } from '~/utils/get-base-url'

interface PageProps {
  params: Promise<{
    slug: string
    locale: string
  }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata(
  props: Readonly<PageProps>,
): Promise<Metadata> {
  const { slug } = await props.params

  const project = getProjectBySlug(slug)

  if (!project) {
    return {}
  }

  const { name, description } = project

  return createMetadata({
    pathname: `/projects/${slug}`,
    title: name,
    description,
  })
}

export const dynamic = 'force-static'

export function generateStaticParams() {
  return allProjects.map(p => ({ slug: p.slug }))
}

async function Page(props: PageProps) {
  const { slug } = await props.params

  const project = allProjects.find(p => p.slug === slug)
  const localizedPath = `/projects/${slug}`
  const url = `${SITE_URL}${localizedPath}`

  if (!project) {
    notFound()
  }

  const { name, code, description, github, dateCreated } = project

  const baseUrl = getBaseUrl()
  const jsonLd: WithContext<SoftwareSourceCode> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name,
    description,
    url,
    'codeRepository': github,
    'license': 'https://opensource.org/licenses/MIT',
    'programmingLanguage': 'TypeScript',
    dateCreated,
    'author': {
      '@type': 'Person',
      'name': MY_NAME,
      'url': baseUrl,
    },
    'thumbnailUrl': `${baseUrl}/images/projects/${slug}.png`,
  }

  return (
    <>
      <JsonLd json={jsonLd} />
      <div className="mx-auto max-w-3xl">
        <Header {...project} />
        <BlurImage
          src={`/images/projects/${slug}.png`}
          width={600}
          height={450}
          alt={name}
          className="my-12 rounded-lg"
          lazy={false}
        />
        <Mdx code={code} />
      </div>
    </>
  )
}

export default Page
