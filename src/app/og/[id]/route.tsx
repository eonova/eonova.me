import fs from 'node:fs/promises'

import path from 'node:path'
import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'
import { NextResponse } from 'next/server'

import OGImage from '~/components/shared/og-image'
import { getPostBySlug } from '~/lib/content'
import { getOGImageFonts } from '~/lib/fonts'
import { getPathnames } from '~/utils/get-pathnames'

interface OGRouteProps {
  params: Promise<{
    id: string
  }>
}
export async function GET(_request: Request, props: OGRouteProps) {
  const { params } = props
  const { id } = await params
  const normalizedSlug = id.split('/')
  const pathname = `/${normalizedSlug.join('/')}`

  if (pathname === '/') {
    return generateIndexOGImage()
  }

  if (pathname.startsWith('/blog/')) {
    return generateBlogOGImage(normalizedSlug)
  }

  if (pathname.startsWith('/projects/')) {
    return generateProjectOGImage(normalizedSlug)
  }

  return generatePageOGImage(normalizedSlug, pathname)
}

async function generateIndexOGImage() {
  const imageBuffer = await fs.readFile(path.join(process.cwd(), 'public', 'images', 'banner.png'))

  return new NextResponse(new Uint8Array(imageBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'no-cache, no-store',
    },
  })
}

async function generateBlogOGImage(slugs: string[]) {
  const postSlug = slugs.at(-1)
  if (!postSlug)
    notFound()

  const post = getPostBySlug(postSlug)
  if (!post)
    notFound()

  return generateOGImage(post.title, '/blog')
}

async function generatePageOGImage(slugs: string[], pathname: string) {
  const pageSlug = slugs.at(-1)
  if (!pageSlug)
    notFound()

  return generateOGImage(pageSlug, pathname)
}

async function generateProjectOGImage(slugs: string[]) {
  const projectSlug = slugs.at(-1)
  if (!projectSlug)
    notFound()

  const imageBuffer = await fs.readFile(
    path.join(process.cwd(), 'public', 'images', 'projects', projectSlug, 'cover.png'),
  )

  return new NextResponse(new Uint8Array(imageBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'no-cache, no-store',
    },
  })
}

async function generateOGImage(title: string, url: string) {
  const fonts = await getOGImageFonts(title)

  return new ImageResponse(<OGImage title={title} url={url} />, {
    width: 1200,
    height: 630,
    fonts,
  })
}

export function generateStaticParams(): Array<{ slug: string[] }> {
  const pathnames = getPathnames({ includeProtectedRoutes: true })

  return pathnames.map(pathname => ({
    slug: [...pathname.split('/'), 'image.webp'].filter(Boolean),
  }))
}
