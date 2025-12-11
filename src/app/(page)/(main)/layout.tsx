import MainLayout from '~/components/layouts/main-layout'
import '~/styles/globals.css'

interface LayoutProps {
  children: React.ReactNode
}

function Layout({ children }: Readonly<LayoutProps>) {
  return <MainLayout>{children}</MainLayout>
}

export default Layout
