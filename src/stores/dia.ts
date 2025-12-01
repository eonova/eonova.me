import type { DiaConfig } from '~/plugins/aurora-dia'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { AuroraDia } from '~/plugins/aurora-dia'

interface DiaState {
  dia: AuroraDia
  aurora_bot: {
    enable: boolean
    bot_type: string
    tips?: { [key: string]: { selector: string, text: string | string[] } }
  }
  initializeBot: (configs: DiaConfig) => void
  activateMotion: (leftEye: HTMLElement, rightEye: HTMLElement, eyesEl: HTMLElement) => void
  setEnable: (enable: boolean) => void
}

export const useDiaStore = create<DiaState>()(
  persist(
    (set, get) => ({
      dia: new AuroraDia(),
      aurora_bot: {
        enable: true, // Default to true, will be overwritten by persisted state or settings query
        bot_type: 'dia',
      },
      initializeBot: (configs: DiaConfig) => {
        const { dia } = get()
        dia.installSoftware(configs)
        dia.on()
      },
      activateMotion: (leftEye: HTMLElement, rightEye: HTMLElement, eyesEl: HTMLElement) => {
        const { dia } = get()
        dia.activateMotion(leftEye, rightEye, eyesEl)
      },
      setEnable: (enable: boolean) => {
        set(state => ({
          aurora_bot: {
            ...state.aurora_bot,
            enable,
          },
        }))
      },
    }),
    {
      name: 'dia-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        aurora_bot: {
          enable: state.aurora_bot.enable,
          bot_type: state.aurora_bot.bot_type,
        },
      }),
      // Re-instantiate AuroraDia on rehydration isn't needed as it's initialized in state creation
      // But we need to ensure dia instance is preserved as it's not persisted
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState as Partial<DiaState>,
        dia: currentState.dia, // Ensure we keep the class instance
      }),
    },
  ),
)
