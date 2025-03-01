import type { BangumiUserProfile } from "~/types/bangumi";

export function mapBangumiUser(profile?: BangumiUserProfile) {
  return profile ? {
    id: profile.id.toString(),
    name: profile.nickname || profile.username,
    avatar: profile.avatar,
    joinDate: new Date(profile.joinedAt).toLocaleDateString(),
    socialLinks: Object.entries(profile.social || {})
      .filter(([, value]) => !!value)
      .map(([key, value]) => `${key}:${value}`)
  } : null
}
