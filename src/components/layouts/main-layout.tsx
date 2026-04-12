'use client'
import Footer from '~/components/layouts/footer'
import Header from '~/components/layouts/header'
import MobileHeader from '~/components/layouts/mobile-header'
import MobileNavAside from '~/components/layouts/mobile-sidebar'
import { DiaProvider } from '~/hooks/use-dia'
import { NavProvider } from '~/hooks/use-nav'
import GradientBackground from '../shared/gradient-background'
import Dia from './internal/dia'
import MobileDock from './mobile-dock'
import SideDock from './side-dock'

interface LayoutProps {
  children: React.ReactNode
}

function Layout(props: LayoutProps) {
  const { children } = props

  return (
    <>
      <DiaProvider>
        <NavProvider>
          <Header />
          <MobileHeader />
          <main className="mx-auto mb-16 w-full max-w-[900px] px-7 py-24 sm:px-8">{children}</main>
          <MobileNavAside />
          <SideDock />
          <MobileDock />
          <Dia />
        </NavProvider>
      </DiaProvider>
      <Footer />
      <GradientBackground className="absolute top-0 left-1/2 -z-10 -translate-x-1/2" />
      <GradientBackground isBottom className="absolute -bottom-6 left-1/2 -z-10 -translate-x-1/2 rotate-180" />
    </>
  )
}

export default Layout
