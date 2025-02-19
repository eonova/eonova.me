'use client'

import type { ToasterProps } from '~/components/base/toaster'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider, useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Suspense } from 'react'
import { Toaster } from '~/components/base/toaster'
import { TooltipProvider } from '~/components/base/tooltip'
import PageProgress from '~/components/page-progress'
import { TRPCReactProvider } from '~/trpc/react'
import Debug from './debug'

const SmoothScroll = dynamic(() => import('../components/lenis-provider').then(mod => mod.LenisProvider), {
  ssr: false, // 禁用 SSR
})

interface ProvidesProps {
  children: React.ReactNode
}

function Providers(props: ProvidesProps) {
  const { children } = props
  const { theme } = useTheme()

  return (
    <NuqsAdapter>
      <TRPCReactProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme='system'
          enableSystem
          enableColorScheme
          disableTransitionOnChange
        >
          <SessionProvider>
            <TooltipProvider>
              <SmoothScroll>
                {children}
              </SmoothScroll>
              <Toaster
                toastOptions={{
                  duration: 2500,
                }}
                visibleToasts={5}
                theme={theme as ToasterProps['theme']}
                expand
              />
              <Suspense>
                <Debug />
              </Suspense>
              <PageProgress />
            </TooltipProvider>
          </SessionProvider>
        </ThemeProvider>
      </TRPCReactProvider>
    </NuqsAdapter>
  )
}

export default Providers
