import { Album, Contact, LayoutDashboardIcon, MessagesSquareIcon, Podcast, UsersIcon } from 'lucide-react'

export const ADMIN_SIDEBAR_LINKS = [
  {
    titleKey: 'general',
    links: [
      {
        titleKey: '仪表盘',
        url: '/admin',
        icon: LayoutDashboardIcon,
      },
      {
        titleKey: '用户',
        url: '/admin/users',
        icon: UsersIcon,
      },
      {
        titleKey: '评论',
        url: '/admin/comments',
        icon: MessagesSquareIcon,
      },
      {
        titleKey: '相册',
        url: '/admin/album',
        icon: Album,
      },
      {
        titleKey: '碎碎念',
        url: '/admin/talk',
        icon: Podcast,
      },
      {
        titleKey: '友链',
        url: '/admin/friends',
        icon: Contact,
      },
    ],
  },
] as const

export type SidebarGroup = (typeof ADMIN_SIDEBAR_LINKS)[number]
export type SidebarLink = SidebarGroup['links'][number]
