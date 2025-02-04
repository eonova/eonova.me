import { SITE_URL } from '~/config/constants'

export function getDefaultUser(id: string) {
  return {
    defaultName: `user ${id.slice(0, 6)}`,
    defaultImage: `${SITE_URL}/api/avatar/${id}`,
  }
}
