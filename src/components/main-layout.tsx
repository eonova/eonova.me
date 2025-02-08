'use client'
import Image from 'next/image'
import Footer from '~/components/layouts/footer'
import Header from '~/components/layouts/header'
import MobileNavAside from '~/components/layouts/mobile-sidebar'

interface LayoutProps {
  children: React.ReactNode
}

function Layout(props: LayoutProps) {
  const { children } = props

  return (
    <>
      <Header />
      <main className="mx-auto mb-16 max-w-5xl px-6 pt-28 sm:pt-24 sm:py-24 sm:px-8">
        {children}
      </main>
      <MobileNavAside />
      <Footer />
      <Image
        width={1512}
        height={550}
        className="absolute left-1/2 top-0 -z-10 -translate-x-1/2"
        src="/images/gradient-background-top.png"
        alt=""
        role="presentation"
        priority
      />
      <Image
        width={1512}
        height={447}
        className="absolute -bottom-6 left-1/2 -z-10 -translate-x-1/2"
        src="/images/gradient-background-bottom.png"
        alt=""
        role="presentation"
        priority
      />
    </>
  )
}

export default Layout
