import type { DoubanUser } from '~/types/douban';

export function mapDoubanUser(raw: any): DoubanUser {
  return {
    id: raw.id,
    profilePath: raw.domain,
    displayName: raw.name,
    avatarUrl: raw.thumbnail,
    stats: {
      movie: {
        do: raw.movie_do,
        wish: raw.movie_wish,
        collect: raw.movie_collect,
      },
      book: {
        do: 0,
        wish: 0,
        collect: 0,
      },
    },
    timestamps: {
      publishedAt: new Date(raw.publish_at * 1000),
      lastSyncedAt: new Date(raw.sync_at * 1000),
      lastCheckedAt: new Date(raw.check_at * 1000),
    },
  };
}
