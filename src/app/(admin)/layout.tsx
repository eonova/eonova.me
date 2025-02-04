'use client'
import { redirect } from 'next/navigation'
import AdminHeader from '~/components/admin/admin-header'
import AdminSidebar from '~/components/admin/admin-sidebar'
import { SidebarProvider } from '~/components/base/sidebar'
import { getCurrentUser } from '~/lib/auth'

interface LayoutProps {
  params: Promise<{
    locale: string
  }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
  children: React.ReactNode
}

async function Layout(props: LayoutProps) {
  const { children } = props
  const session = await getCurrentUser()

  if (!session || session.role !== 'admin') {
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
