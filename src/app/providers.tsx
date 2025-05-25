'use client'

import { ThemeProvider } from 'next-themes'
import dynamic from 'next/dynamic'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from '~/components/base/toaster'
import { TooltipProvider } from '~/components/base/tooltip'
import PageProgress from '~/components/shared/page-progress'
import { TRPCReactProvider } from '~/trpc/react'

const SmoothScroll = dynamic(() => import('../components/layouts/lenis-provider').then(mod => mod.LenisProvider), {
  ssr: false, // 禁用 SSR
})

interface ProvidesProps {
  children: React.ReactNode
}

function Providers(props: ProvidesProps) {
  const { children } = props

  return (
    <NuqsAdapter>
      <TRPCReactProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme
          disableTransitionOnChange
        >
          <TooltipProvider>
            <SmoothScroll>
              {children}
            </SmoothScroll>
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
      </TRPCReactProvider>
    </NuqsAdapter>
  )
}

export default Providers
