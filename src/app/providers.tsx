'use client'

import type { ToasterProps } from '~/components/base/toaster'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider, useTheme } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Suspense } from 'react'
import UmamiAnalytics from '~/components/analytics'
import { Toaster } from '~/components/base/toaster'
import { TooltipProvider } from '~/components/base/tooltip'
import PageProgress from '~/components/page-progress'
import { flags } from '~/lib/env'
import { TRPCReactProvider } from '~/trpc/react'
import Debug from './debug'

interface ProvidesProps {
  children: React.ReactNode
}

function Providers(props: ProvidesProps) {
  const { children } = props
  const { theme = 'dark' } = useTheme()

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
          <SessionProvider>
            <TooltipProvider>
              {children}
              {flags.analytics && <UmamiAnalytics />}
              <VercelAnalytics />
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
