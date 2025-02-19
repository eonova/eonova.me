import type { IconType } from '@icons-pack/react-simple-icons'
import {
  SiGithub,
  SiInstagram,
  SiX,
  SiYoutube,
} from '@icons-pack/react-simple-icons'
import {
  Archive,
  FlameIcon,
  Images,
  Link2,
  ListCollapse,
  MessageCircleIcon,
  MessageSquareMore,
  Notebook,
  PencilIcon,
  UserCircleIcon,
} from 'lucide-react'

import {
  SITE_GITHUB_URL,
  SITE_INSTAGRAM_URL,
  SITE_X_URL,
  SITE_YOUTUBE_URL,
} from './constants'
import type { ReactNode } from 'react'

type SocialLinks = Array<{
  href: string
  title: string
  icon: IconType
}>
export interface IHeaderMenu {
  text: string
  href: string
  key: string
  icon?: ReactNode
  subMenu?: Omit<IHeaderMenu, 'exclude'>[]
}
export const HEADER_LINKS: IHeaderMenu[] = [
  {
    icon: <PencilIcon className="size-5" />,
    href: '/blog',
    key: 'blog',
    text: '文稿'
  },
  {
    icon: <Notebook className="size-5" />,
    href: '/notes',
    key: 'notes',
    text: '手记',
  },
  {
    icon: <Archive className="size-5" />,
    href: '/archive',
    key: 'archive',
    text: '归档',
  },
  {
    icon: <MessageSquareMore className="size-5" />,
    href: '/talk',
    key: 'talk',
    text: '碎碎念',
  },
  {
    icon: <MessageCircleIcon className="size-5" />,
    href: '/guestbook',
    key: 'guestbook',
    text: '留言板',
  },
  {
    icon: <ListCollapse className="size-5" />,
    href: '#',
    key: 'more',
    text: '我的',
    subMenu: [
      {
        icon: <FlameIcon className="size-5" />,
        href: '/projects',
        key: 'projects',
        text: '项目',
      },
      {
        icon: <Link2 className="size-5" />,
        href: '/links',
        key: 'links',
        text: '收藏',
      },
      {
        icon: <Images className="size-5" />,
        href: '/album',
        key: 'album',
        text: '相册',
      },
    ]
  },
  {
    icon: <UserCircleIcon className="size-5" />,
    href: '/about',
    key: 'about',
    text: '关于',
  },
] as const

export const FOOTER_LINKS = [
  {
    id: 1,
    links: [
      { href: '/', key: '首页' },
      { href: '/blog', key: '博客' },
      { href: '/about', key: '关于' },
      { href: '/album', key: '相册' },
    ],
  },
  {
    id: 2,
    links: [
      { href: '/guestbook', key: '留言板' },
      { href: '/project', key: '项目' },
      { href: '/links', key: '收藏夹' },
      { href: '/rss.xml', key: 'RSS订阅' },
    ],
  },
  {
    id: 3,
    links: [
      { href: SITE_INSTAGRAM_URL, key: 'instagram' },
      { href: SITE_GITHUB_URL, key: 'github' },
      { href: SITE_YOUTUBE_URL, key: 'youtube' },
      { href: SITE_X_URL, key: 'twitter' },
    ],
  },
] as const

export const SOCIAL_LINKS: SocialLinks = [
  {
    href: SITE_GITHUB_URL,
    title: 'GitHub',
    icon: SiGithub,
  },
  {
    href: SITE_INSTAGRAM_URL,
    title: 'Instagram',
    icon: SiInstagram,
  },
  {
    href: SITE_X_URL,
    title: 'X',
    icon: SiX,
  },
  {
    href: SITE_YOUTUBE_URL,
    title: 'YouTube',
    icon: SiYoutube,
  },
]
