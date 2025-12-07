import type { IconType } from '@icons-pack/react-simple-icons'
import type { ReactNode } from 'react'

import { SiGithub, SiInstagram, SiRss, SiX, SiYoutube } from '@icons-pack/react-simple-icons'
import {
  Archive,
  BellElectric,
  ChartColumnStacked,
  FlameIcon,
  Images,
  Link2,
  ListCollapse,
  MessageCircleIcon,
  MessageSquareMore,
  Notebook,
  PencilIcon,
  TagIcon,
  UserCircleIcon,
} from 'lucide-react'
import {
  SITE_GITHUB_URL,
  SITE_INSTAGRAM_URL,
  SITE_X_URL,
  SITE_YOUTUBE_URL,
} from './constants'

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
    href: '/posts',
    key: 'posts',
    text: '文章',
    subMenu: [
      {
        icon: <ChartColumnStacked className="size-5" />,
        href: '/categories',
        key: 'categories',
        text: '分类',
      },
      {
        icon: <TagIcon className="size-5" />,
        href: '/tags',
        key: 'tags',
        text: '标签',
      },
    ],
  },
  {
    icon: <Notebook className="size-5" />,
    href: `/notes`,
    key: 'notes',
    text: '手记',
  },
  {
    icon: <Archive className="size-5" />,
    href: '/archive',
    key: 'archive',
    text: '归档',
    subMenu: [
      {
        icon: <Archive className="size-5" />,
        href: '/archive/posts',
        key: 'archive-posts',
        text: '文章',
      },
      {
        icon: <Notebook className="size-5" />,
        href: '/archive/notes',
        key: 'archive-notes',
        text: '手记',
      },
    ],
  },
  {
    icon: <MessageSquareMore className="size-5" />,
    href: '/talk',
    key: 'talk',
    text: '说说',
  },
  {
    icon: <BellElectric className="size-5" />,
    href: '/neodb',
    key: 'recreation',
    text: '书架',
  },
  {
    icon: <ListCollapse className="size-5" />,
    href: '#',
    key: 'more',
    text: '我的',
    subMenu: [
      {
        icon: <TagIcon className="size-5" />,
        href: '/tags',
        key: 'tags',
        text: '标签',
      },
      {
        icon: <Images className="size-5" />,
        href: '/album',
        key: 'album',
        text: '相册',
      },
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
        icon: <UserCircleIcon className="size-5" />,
        href: '/friends',
        key: 'friends',
        text: '朋友',
      },
    ],
  },
  {
    icon: <MessageCircleIcon className="size-5" />,
    href: '/guestbook',
    key: 'guestbook',
    text: '留言',
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
      { href: '/posts', key: '文章' },
      { href: '/notes', key: '手记' },
      { href: '/album', key: '相册' },
      { href: '/neodb', key: '书架' },
      { href: '/talk', key: '说说' },
    ],
  },
  {
    id: 2,
    links: [
      { href: '/archive', key: '归档' },
      { href: '/project', key: '项目' },
      { href: '/links', key: '收藏' },
      { href: '/guestbook', key: '留言' },
      { href: '/about', key: '关于' },
    ],
  },
  {
    id: 3,
    links: [
      { href: '/rss.xml', key: 'RSS' },
      { href: SITE_INSTAGRAM_URL, key: 'Instagram' },
      { href: SITE_GITHUB_URL, key: 'Github' },
      { href: SITE_YOUTUBE_URL, key: 'Youtube' },
      { href: SITE_X_URL, key: 'Twitter' },
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
  {
    href: '/rss.xml',
    title: 'RSS',
    icon: SiRss,
  },
]

type AccountSidebarLinks = Array<{
  href: string
  text: string
}>

export const ACCOUNT_SIDEBAR_LINKS: AccountSidebarLinks = [
  {
    href: '/account',
    text: '个人资料',
  },
  {
    href: '/account/settings',
    text: '通知设置',
  },
]
