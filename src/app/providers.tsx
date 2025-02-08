'use client'

import type { ToasterProps } from '~/components/base/toaster'
import { SessionProvider } from 'next-auth/react'
import { AppProgressBar as LoadingProgressBar } from 'next-nprogress-bar'
import { ThemeProvider, useTheme } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Suspense } from 'react'
import { Analytics } from "@vercel/analytics/react"
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
  const { theme = 'system' } = useTheme()

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
              {flags.analytics ? <Analytics /> : null}
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
              <LoadingProgressBar
                height="2px"
                color="#6dc580d7"
                options={{ showSpinner: false }}
                shallowRouting
              />
            </TooltipProvider>
          </SessionProvider>
        </ThemeProvider>
      </TRPCReactProvider>
    </NuqsAdapter>
  )
}

export default Providers
