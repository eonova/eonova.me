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
    title: '列表1',
    list: [
      'https://music.163.com/#/playlist?id=2943811283',
      'https://music.163.com/#/playlist?id=2297706586',
    ],
  },
  {
    title: '列表2',
    list: [
      'https://music.163.com/#/playlist?id=2031842656',
    ],
  },
]

export const MUSIC_API = 'https://api.injahow.cn/meting/'
