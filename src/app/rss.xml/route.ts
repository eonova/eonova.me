import { NextResponse } from 'next/server'
import RSS from 'rss'
import { MY_NAME, SITE_DESCRIPTION, SITE_NAME } from '~/config/constants'
import { getAllNotes, getAllPosts } from '~/lib/content'
import { getBaseUrl } from '~/utils'

export const dynamic = 'force-static'

export async function GET(_request: Request) {
  const baseUrl = getBaseUrl()
  const allPosts = await getAllPosts()
  const allNotes = await getAllNotes()
  const feed = new RSS({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site_url: baseUrl,
    feed_url: `${baseUrl}/rss.xml`,
    language: 'en',
    image_url: `${baseUrl}/og/image.webp`,
    copyright: `© ${new Date().getFullYear()} ${MY_NAME}. All rights reserved.`,
    webMaster: 'me@nelsonlai.dev',
  })
  for (const post of allPosts) {
    feed.item({
      title: post.title,
      url: `${baseUrl}/posts/${post.slug}`,
      date: post.date ?? '',
      description: post.intro ?? '',
      author: MY_NAME,
    })
  }

  for (const note of allNotes) {
    feed.item({
      title: note.title,
      url: `${baseUrl}/notes/${note.slug}`,
      date: note.date ?? '',
      description: note.intro ?? '',
      author: MY_NAME,
    })
  }

  return new NextResponse(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
