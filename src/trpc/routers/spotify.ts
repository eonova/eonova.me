import { TRPCError } from '@trpc/server'
import { env } from '~/lib/env'
import { ratelimit } from '~/lib/kv'
import { getIp } from '~/utils'
import { createTRPCRouter, publicProcedure } from '../init'

const CLIENT_ID = env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET
const REFRESH_TOKEN = env.SPOTIFY_REFRESH_TOKEN

// eslint-disable-next-line node/prefer-global/buffer
const BASIC = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing'
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'

async function getAccessToken() {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 3000) // 3秒超时

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${BASIC}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: REFRESH_TOKEN,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Spotify token API error: ${response.status}`)
    }

    const data = await response.json()
    return data.access_token as string
  }
  catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Spotify token request timed out')
    }

    throw error
  }
}

const getKey = (id: string) => `spotify:${id}`

export const spotifyRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const ip = getIp(ctx.headers)

    const { success } = await ratelimit.limit(getKey(ip))

    if (!success)
      throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })

    try {
      const accessToken = await getAccessToken()

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3秒超时

      try {
        const response = await fetch(NOW_PLAYING_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (response.status === 204) {
          return {
            isPlaying: false,
            songUrl: null,
            name: null,
            artist: null,
          }
        }

        if (!response.ok) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Spotify API error: ${response.status}`,
          })
        }

        const song = await response.json()

        return {
          isPlaying: song.is_playing as boolean,
          songUrl: (song.item?.external_urls?.spotify as string) || null,
          name: (song.item?.name as string) || null,
          artist:
            (song.item?.artists
              ?.map((artist: { name: string }) => artist.name)
              .join(', ') as string) || null,
        }
      }
      catch (error) {
        clearTimeout(timeoutId)

        if (error instanceof Error && error.name === 'AbortError') {
          throw new TRPCError({
            code: 'TIMEOUT',
            message: 'Spotify API request timed out',
          })
        }

        throw error
      }
    }
    catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch Spotify data',
      })
    }
  }),
})
