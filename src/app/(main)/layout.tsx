import MainLayout from '~/components/main-layout'

interface LayoutProps {
  children: React.ReactNode
}

function Layout(props: LayoutProps) {
  const { children } = props

  return <MainLayout>{children}</MainLayout>
}

export default Layout
