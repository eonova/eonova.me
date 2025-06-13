import { redirect } from 'next/navigation'
import { SidebarProvider } from '~/components/base'
import AdminHeader from '~/components/pages/admin/admin-header'
import AdminSidebar from '~/components/pages/admin/admin-sidebar'
import { getSession } from '~/lib/auth'

interface LayoutProps {
  children: React.ReactNode
}

async function Layout({ children }: Readonly<LayoutProps>) {
  const session = await getSession()

  if (!session || session.user.role !== 'admin') {
    redirect('/')
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className="flex w-full flex-col overflow-x-hidden px-4">
        <AdminHeader />
        <main className="py-6">{children}</main>
      </div>
    </SidebarProvider>
  )
}

export default Layout
