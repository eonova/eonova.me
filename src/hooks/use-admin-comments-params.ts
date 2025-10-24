import type { SingleParser } from 'nuqs'

import type { comments } from '~/db'
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsTimestamp,

  useQueryStates,
} from 'nuqs'
import { z } from 'zod'

import { COMMENT_TYPES } from '~/config/constants'
import { getSortingStateParser } from '~/lib/data-table'

export function useAdminCommentsParams() {
  return useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
    body: parseAsString.withDefault(''),
    parentId: parseAsArrayOf(z.enum(COMMENT_TYPES) as unknown as SingleParser<'comment' | 'reply'>).withDefault([]),
    createdAt: parseAsArrayOf(parseAsTimestamp).withDefault([]),
    sort: getSortingStateParser<typeof comments.$inferSelect>().withDefault([
      { id: 'createdAt', desc: true },
    ]),
  })
}
