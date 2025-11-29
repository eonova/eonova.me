import { env } from '~/lib/env'
import { publicProcedure } from '../root'
import { listNeoShelfInputSchema, listNeoShelfOutputSchema } from '../schemas/neodb.schema'

type NeoDBType = 'wishlist' | 'progress' | 'complete'

interface NeoItem {
  uuid: string
  url: string
  api_url: string
  category: string
  parent_uuid: string | null
  display_title: string
  external_resources: Array<{ url: string }>
  title: string
  description: string
  localized_title: Array<{ lang: string, text: string }>
  localized_description: Array<{ lang: string, text: string }>
  cover_image_url: string
  rating: number
  rating_count: number
  rating_distribution: number[]
  tags: string[]
  brief: string
}

interface NeoShelfItem {
  shelf_type: string
  visibility: number
  post_id: number
  item: NeoItem
  created_time: string
  comment_text: string | null
  rating_grade: number | null
  tags: string[]
}

interface NeoShelfResponse {
  data: NeoShelfItem[]
  pages: number
  count: number
}

function validateNeoItem(raw: NeoShelfItem) {
  return {
    title: raw.item.display_title || raw.item.title || '',
    detailUrl: raw.item.url || '',
    apiUrl: raw.item.api_url,
    coverUrl: raw.item.cover_image_url,
    brief: raw.item.brief,
    category: raw.item.category || '',
    createdTime: raw.created_time || '',
    comment: raw.comment_text === null ? undefined : raw.comment_text,
    rating: typeof raw.item.rating === 'number' ? raw.item.rating : undefined,
    ratingGrade: typeof raw.rating_grade === 'number' ? raw.rating_grade : undefined,
    tags: Array.isArray(raw.tags) ? raw.tags : undefined,
  }
}

async function fetchShelf(type: NeoDBType, category: string, page: number, pageSize: number) {
  const endpoint = new URL(`https://neodb.social/api/me/shelf/${type}`)
  endpoint.searchParams.append('category', category)
  endpoint.searchParams.append('page', page.toString())
  endpoint.searchParams.append('page_size', pageSize.toString())

  const accessToken = env.NEODB_TOKEN
  const res = await fetch(endpoint.toString(), {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) {
    return { items: [], pages: 0, count: 0 }
  }

  const data = (await res.json()) as NeoShelfResponse
  return {
    items: Array.isArray(data.data) ? data.data.map(validateNeoItem) : [],
    pages: typeof data.pages === 'number' ? data.pages : 0,
    count: typeof data.count === 'number' ? data.count : 0,
  }
}

export const listNeoDBShelf = publicProcedure
  .input(listNeoShelfInputSchema)
  .output(listNeoShelfOutputSchema)
  .handler(async ({ input }) => {
    const page = input.page ?? 1
    const type = input.types[0]!

    const { items, pages } = await fetchShelf(type, input.category, page, input.pageSize)
    const nextCursor = page < pages ? page + 1 : undefined

    return {
      items,
      nextCursor,
    }
  })
