import { allNotes, allPosts } from 'content-collections'
import { NextResponse } from 'next/server'
import RSS from 'rss'

import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from '~/config/constants'

export function GET() {
  const feed = new RSS({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site_url: SITE_URL,
    feed_url: `${SITE_URL}/rss.xml`,
    language: 'en-US',
    image_url: `${SITE_URL}/images/og.png`,
  })

  const posts = allPosts
  const notes = allNotes

  for (const post of posts) {
    const { title, summary, date, slug } = post

    feed.item({
      title,
      url: `${SITE_URL}/posts/${slug}`,
      date,
      description: summary,
      author: SITE_NAME,
    })
  }

  for (const note of notes) {
    const { title, summary, date, slug } = note

    feed.item({
      title,
      url: `${SITE_URL}/notes/${slug}`,
      date,
      description: summary,
      author: SITE_NAME,
    })
  }

  return new NextResponse(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
