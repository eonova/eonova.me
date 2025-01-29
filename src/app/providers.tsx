'use client'

import type { ToasterProps } from '~/components/base/toaster'
import { AppProgressBar as LoadingProgressBar } from 'next-nprogress-bar'
import { ThemeProvider, useTheme } from 'next-themes'
import { Toaster } from '~/components/base/toaster'
import { TooltipProvider } from '~/components/base/tooltip'
import PageProgress from '~/components/page-progress'

interface ProvidesProps {
  children: React.ReactNode
}

function Providers(props: ProvidesProps) {
  const { children } = props
  const { theme = 'system' } = useTheme()

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
      disableTransitionOnChange
    >
      <TooltipProvider>
        {children}
        <Toaster
          toastOptions={{
            duration: 2500,
          }}
          visibleToasts={5}
          theme={theme as ToasterProps['theme']}
          expand
        />
        <PageProgress />
        <LoadingProgressBar
          height="2px"
          color="#6dc580d7"
          options={{ showSpinner: false }}
          shallowRouting
        />
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default Providers
