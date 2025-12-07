'use client'

import type { DiaConfig } from '~/plugins/aurora-dia'
import { createContext, use, useEffect, useMemo, useRef, useState } from 'react'
import { useSettings } from '~/hooks/queries/settings.query'
import { useSession } from '~/lib/auth-client'
import { AuroraDia } from '~/plugins/aurora-dia'

interface DiaContextValue {
  aurora_bot: {
    enable: boolean
    bot_type: string
    tips?: { [key: string]: { selector: string, text: string | string[] } }
  }
  initializeBot: (configs: DiaConfig) => void
  activateMotion: (leftEye: HTMLElement, rightEye: HTMLElement, eyesEl: HTMLElement) => void
  setEnable: (enable: boolean) => void
}

const DIA_STORAGE_KEY = 'dia-storage'

const DiaContext = createContext<DiaContextValue | null>(null)

export function DiaProvider({ children }: { children: React.ReactNode }) {
  const diaRef = useRef<AuroraDia>(new AuroraDia())
  const [auroraBotEnable, setAuroraBotEnable] = useState<boolean>(true)
  const [botType, setBotType] = useState<string>('dia')
  const [tips, setTips] = useState<{ [key: string]: { selector: string, text: string | string[] } } | undefined>(undefined)

  const { data: session } = useSession()
  const { data: settings } = useSettings()

  // Sync with server settings
  useEffect(() => {
    if (session?.user && settings) {
      setAuroraBotEnable(settings.diaEnabled)
    }
  }, [session, settings])

  // hydrate from localStorage
  useEffect(() => {
    if (typeof window === 'undefined')
      return
    try {
      const raw = localStorage.getItem(DIA_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as { aurora_bot?: { enable?: boolean, bot_type?: string } }
        if (parsed?.aurora_bot?.enable !== undefined)
          setAuroraBotEnable(parsed.aurora_bot.enable)
        if (parsed?.aurora_bot?.bot_type)
          setBotType(parsed.aurora_bot.bot_type)
      }
    }
    catch {}
  }, [])

  // persist selected fields
  useEffect(() => {
    if (typeof window === 'undefined')
      return
    const payload = {
      aurora_bot: {
        enable: auroraBotEnable,
        bot_type: botType,
      },
    }
    try {
      localStorage.setItem(DIA_STORAGE_KEY, JSON.stringify(payload))
    }
    catch {}
  }, [auroraBotEnable, botType])

  const initializeBot = (configs: DiaConfig) => {
    const dia = diaRef.current
    if (!dia)
      return
    if (configs?.tips)
      setTips(configs.tips)
    dia.installSoftware({ ...configs })
    dia.on()
  }

  const activateMotion = (leftEye: HTMLElement, rightEye: HTMLElement, eyesEl: HTMLElement) => {
    const dia = diaRef.current
    if (!dia)
      return
    dia.activateMotion(leftEye, rightEye, eyesEl)
  }

  const setEnable = (enable: boolean) => {
    setAuroraBotEnable(enable)
  }

  const value = useMemo<DiaContextValue>(() => ({
    aurora_bot: {
      enable: auroraBotEnable,
      bot_type: botType,
      tips,
    },
    initializeBot,
    activateMotion,
    setEnable,
  }), [auroraBotEnable, botType, tips])

  return <DiaContext value={value}>{children}</DiaContext>
}

export function useDia() {
  const ctx = use(DiaContext)
  if (!ctx)
    throw new Error('useDia must be used within DiaProvider')
  return ctx
}
