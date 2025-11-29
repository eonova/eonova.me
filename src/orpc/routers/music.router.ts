import type { MusicPlaylist } from '~/config/music'
import { ORPCError } from '@orpc/client'
import { MUSIC_API, musicConfig } from '~/config/music'
import { publicProcedure } from '../root'

// 扁平化数组
function flattenArray(arr: any[]) {
  return arr.reduce((acc, val) => {
    if (Array.isArray(val))
      acc.push(...flattenArray(val))
    else
      acc.push(val)
    return acc
  }, [])
}

async function queryPlaylistSongs(config: MusicPlaylist[]) {
  const handleConfig = await Promise.all(
    config.map(async (playlist) => {
      const playlistSongs = await Promise.all(
        playlist.list.map(async (url) => {
          const requestUrl = `${MUSIC_API}?server=netease&type=playlist&id=${url.split('=')[1] ?? url.split('/')[5]}`
          const res = await fetch(requestUrl)
          if (!res.ok)
            throw new Error(`Failed to fetch playlist: ${res.statusText}`)
          const data = await res.json()
          return data
        }),
      )

      return {
        title: playlist.title,
        list: flattenArray(playlistSongs),
      }
    }),
  )

  return handleConfig
}

export const listAllPlaylistSongs = publicProcedure.handler(async () => {
  try {
    const songs = await queryPlaylistSongs(musicConfig)
    return songs
  }
  catch (error) {
    throw new ORPCError('INTERNAL_SERVER_ERROR', { message: `获取播放列表标题失败: ${error}` })
  }
})
