import Link from "next/link";

import { FOOTER_LINKS } from '~/config/links'

interface FooterProps {

}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className='bg-background/30 relative mx-auto mb-6 flex max-w-5xl flex-col rounded-2xl p-8 shadow-sm saturate-100 backdrop-blur-[10px]'>
      <div className='mt-12 grid grid-cols-2 sm:grid-cols-3'>
        {FOOTER_LINKS.map((list) => (
          <div key={list.id} className='mb-10 flex flex-col items-start gap-4 pr-4'>
            {list.links.map((link) => {
              const { href, key } = link

              return (
                <Link key={href} href={href} >
                  {key}
                </Link>
              )
            })}
          </div>
        ))}
      </div>
      <div className='mt-20 flex items-center justify-between text-sm'>
        <div>&copy; {new Date().getFullYear()}
          <Link href='https://github.com/ileostar' className='ml-1'>
            LeoStar
          </Link>
        </div>
        <Link
          href='https://git.new/honghong-me'
          className='flex items-center justify-center overflow-hidden rounded-md border'
        >
          111
        </Link>
      </div>
    </footer>

  );
}

export default Footer;
