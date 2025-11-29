import { redirect } from 'next/navigation'
import MainLayout from '~/components/layouts/main-layout'
import PageHeader from '~/components/layouts/page-header'
import AccountMobileNav from '~/components/modules/account/account-mobile-nav'
import AccountSidebar from '~/components/modules/account/account-sidebar'
import { getSession } from '~/lib/auth'

async function Layout(props: LayoutProps<'/'>) {
  const { children } = props

  const session = await getSession()

  if (!session) {
    redirect('/')
  }

  const title = '账户'
  const description = '账户'

  return (
    <MainLayout>
      <div className="flex items-center justify-between">
        <PageHeader title={title} description={description} />
        <AccountMobileNav />
      </div>
      <div className="gap-10 md:flex">
        <AccountSidebar />
        <div className="w-full space-y-12">{children}</div>
      </div>
    </MainLayout>
  )
}

export default Layout
