'use client'

import { useTheme } from 'next-themes'
import { useEffect, useMemo, useState } from 'react'
import { useDiaStore } from '~/stores/dia'
import { cn } from '~/utils/cn'
import '~/styles/page/dia.css'

interface DiaProps {
  className?: string
}

function Dia({ className }: DiaProps) {
  const diaStore = useDiaStore()
  const [showDia, setShowDia] = useState(false)

  const { theme } = useTheme()

  // Mock theme configuration since we don't have the app store
  const themeConfig = theme === 'dark'
    ? {
        header_gradient_css: 'linear-gradient(to bottom, #201C35, #482411)',
        gradient: {
          color_2: '#25b0cc',
          color_3: '#3f60de',
        },
      }
    : {
        header_gradient_css: 'linear-gradient(to bottom, #CDBBDB, #F0BAA9)',
        gradient: {
          color_2: '#25b0cc',
          color_3: '#3f60de',
        },
      }

  const cssVariables = useMemo(() => ({
    '--aurora-dia--linear-gradient': themeConfig.header_gradient_css,
    '--aurora-dia--linear-gradient-hover': `linear-gradient(to bottom, #5433ff, #ff0099)`,
    '--aurora-dia--platform-light': '#ff0099',
  } as React.CSSProperties), [themeConfig])

  const initializeBot = () => {
    // Mock aurora_bot_enable as true since we don't have app store
    const aurora_bot_enable = true
    if (!aurora_bot_enable)
      return

    diaStore.initializeBot({
      tips: diaStore.aurora_bot.tips,
    })
    setTimeout(() => {
      setShowDia(true)
    }, 500)
  }

  useEffect(() => {
    initializeBot()
  }, [])

  if (!showDia)
    return null

  return (
    <>
      <div id="bot-container" className={cn('fixed z-[1000] left-[20px] bottom-0', className)}>
        <div id="Aurora-Dia--body" style={cssVariables}>
          <div id="Aurora-Dia--tips-wrapper">
            <div id="Aurora-Dia--tips" className="Aurora-Dia--tips">早上好呀～</div>
          </div>
          <div id="Aurora-Dia" className="Aurora-Dia">
            <div id="Aurora-Dia--eyes" className="Aurora-Dia--eyes">
              <div id="Aurora-Dia--left-eye" className="Aurora-Dia--eye left"></div>
              <div id="Aurora-Dia--right-eye" className="Aurora-Dia--eye right"></div>
            </div>
          </div>
          <div className="Aurora-Dia--platform"></div>
        </div>
      </div>
    </>
  )
}

export default Dia
