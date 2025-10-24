/** 定义合法的播放列表URL前缀 */
type PlaylistUrlPrefix =
  | 'https://y.qq.com/n/ryqq/playlist/'
  | 'https://music.163.com/#/playlist?id='

export interface MusicPlaylist {
  title: string
  list: `${PlaylistUrlPrefix}${string}`[]
}

export const musicConfig: MusicPlaylist[] = [
  {
    title: '新世纪',
    list: [
      'https://music.163.com/#/playlist?id=13909889475',
    ],
  },
  {
    title: '纯音乐',
    list: [
      'https://music.163.com/#/playlist?id=8156201047',
    ],
  },
]

// export const MUSIC_API = 'https://api.injahow.cn/meting/'
export const MUSIC_API = 'https://api.i-meto.com/meting/'
