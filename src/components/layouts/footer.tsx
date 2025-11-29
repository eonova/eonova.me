import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'
import { SITE_GITHUB_URL } from '~/config/constants'

import { FOOTER_LINKS } from '~/config/links'
import NowPlaying from './now-playing'

const Footer: React.FC = () => {
  return (
    <footer className="bg-background/30 relative mx-4 mb-6 flex max-w-[900px] flex-col rounded-2xl p-8 shadow-sm saturate-100 backdrop-blur-[10px] sm:w-full md:mx-auto">
      <NowPlaying />
      <div className="mt-12 grid grid-cols-2 sm:grid-cols-3">
        {FOOTER_LINKS.map(list => (
          <div key={list.id} className="mb-10 flex flex-col items-start gap-4 pr-4">
            {list.links.map((link) => {
              const { href, key } = link

              return (
                <Link key={href} href={href}>
                  {key}
                </Link>
              )
            })}
          </div>
        ))}
      </div>
      <div className="mt-20 flex flex-col items-center justify-between text-sm md:flex-row">
        <div>
          &copy;
          {' '}
          {new Date().getFullYear() === 2025
            ? new Date().getFullYear()
            : `2025-${new Date().getFullYear()}`}
          <Link href={SITE_GITHUB_URL} className="ml-1">
            Eonova
          </Link>
        </div>
        <Link href="https://www.upyun.com/?utm_source=lianmeng&utm_medium=referral">
          <div className="flex items-center text-sm">
            本网站由 &nbsp;
            <Image src="/images/upyun-logo.png" width={50} height={12} alt="upyun logo" />
            {' '}
            &nbsp;
            提供CDN 加速/云存储服务
          </div>
        </Link>
      </div>
    </footer>
  )
}

export default memo(Footer)
