import type { Metadata, ResolvingMetadata } from 'next'
import type { SoftwareApplication, WithContext } from 'schema-dts'

import { allProjects } from 'content-collections'
import { notFound } from 'next/navigation'

import { BlurImage } from '~/components/base/blur-image'
import Mdx from '~/components/modules/mdx'

import Header from '~/components/pages/projects/header'
import { SITE_NAME, SITE_URL } from '~/config/constants'
import { getProjectBySlug } from '~/lib/content'

interface PageProps {
  params: Promise<{
    slug: string
    locale: string
  }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata(
  props: Readonly<PageProps>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await props.params
  const previousOpenGraph = (await parent).openGraph ?? {}
  const previousTwitter = (await parent).twitter ?? {}

  const project = getProjectBySlug(slug)

  if (!project) {
    return {}
  }

  const { name, description } = project
  const url = `/projects/${slug}`

  return {
    title: name,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...previousOpenGraph,
      url,
      title: name,
      description,
      images: [
        {
          url: `/images/projects/${slug}.png`,
          width: 1280,
          height: 832,
          alt: description,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      ...previousTwitter,
      title: name,
      description,
      images: [
        {
          url: `/images/projects/${slug}.png`,
          width: 1280,
          height: 832,
          alt: description,
        },
      ],
    },
  }
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

  const { name, code, description, github } = project

  const jsonLd: WithContext<SoftwareApplication> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    'applicationCategory': 'WebApplication',
    'author': {
      '@type': 'Person',
      'name': SITE_NAME,
      'url': SITE_URL,
    },
    'sameAs': [github],
    'screenshot': `${SITE_URL}/images/projects/${slug}.png`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
