import Link from 'next/link'
import { FOOTER_LINKS } from '~/config/links'

import { flags } from '~/lib/env'
import NowPlaying from './now-playing'

const Footer: React.FC = () => {
  return (
    <footer className="bg-background/30 relative mx-4 md:mx-auto  mb-6 flex max-w-5xl flex-col rounded-2xl p-8 shadow-sm saturate-100 backdrop-blur-[10px]">
      {flags.spotify ? <NowPlaying /> : null}
      <div className="mt-12 grid grid-cols-2 sm:grid-cols-3">
        {FOOTER_LINKS.map(list => (
          <div
            key={list.id}
            className="mb-10 flex flex-col items-start gap-4 pr-4"
          >
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
      <div className="mt-20 flex items-center justify-between text-sm">
        <div>
          &copy;
          {' '}
          {new Date().getFullYear()}
          <Link href="https://github.com/ileostar" className="ml-1">
            LeoStar
          </Link>
        </div>
        <Link
          target="black"
          href="https://beian.miit.gov.cn/#/Integrated/index"
        >
          <button type="button" className="cursor-pointer font-semibold overflow-hidden relative z-100 border rounded-full border-gray-600 dark:border-white/80 group px-2.5 py-0.5">
            <span className="relative z-10 text-gray-600 dark:text-white/80 group-hover:text-white dark:group-hover:text-black text-sm duration-500">粤ICP备2022128395号-2</span>
            <span className="absolute w-full h-full bg-gray-600 dark:bg-white/80 -left-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:left-0 duration-500"></span>
            <span className="absolute w-full h-full bg-gray-600 dark:bg-white/80 -right-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:right-0 duration-500"></span>
          </button>
        </Link>
      </div>
    </footer>
  )
}

export default Footer
