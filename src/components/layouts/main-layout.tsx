'use client'
import Footer from '~/components/layouts/footer'
import Header from '~/components/layouts/header'
import MobileNavAside from '~/components/layouts/mobile-sidebar'
import GradientBackground from '../shared/gradient-background'
import Dia from './dia'
import Dock from './dock'

interface LayoutProps {
  children: React.ReactNode
}

function Layout(props: LayoutProps) {
  const { children } = props

  return (
    <>
      <Header />
      <main className="mx-auto mb-16 w-full max-w-[900px] px-6 py-24 sm:px-8">{children}</main>
      <MobileNavAside />
      <Footer />
      <Dock />
      <Dia />
      <GradientBackground className="absolute top-0 left-1/2 -z-10 -translate-x-1/2" />
      <GradientBackground isBottom className="absolute -bottom-6 left-1/2 -z-10 -translate-x-1/2 rotate-180" />
    </>
  )
}

export default Layout
