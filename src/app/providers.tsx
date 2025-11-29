'use client'
import { ThemeProvider } from 'next-themes'
import dynamic from 'next/dynamic'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from '~/components/base/sonner'
import { TooltipProvider } from '~/components/base/tooltip'
import { PHProvider } from '~/components/layouts/posthog-provider'
import PageProgress from '~/components/shared/page-progress'
import { ORPCQueryProvider } from '~/orpc/tanstack-query/client'

const SmoothScroll = dynamic(
  () => import('../components/layouts/lenis-provider').then(mod => mod.LenisProvider),
  {
    ssr: false, // 禁用 SSR
  },
)

interface ProvidesProps {
  children: React.ReactNode
}

function Providers(props: ProvidesProps) {
  const { children } = props

  return (
    <PHProvider>
      <ORPCQueryProvider>
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            enableColorScheme
            disableTransitionOnChange
          >
            <TooltipProvider>
              <SmoothScroll>{children}</SmoothScroll>
              <Toaster
                toastOptions={{
                  duration: 2500,
                }}
                visibleToasts={5}
                expand
              />
              <PageProgress />
            </TooltipProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </ORPCQueryProvider>
    </PHProvider>
  )
}

export default Providers
