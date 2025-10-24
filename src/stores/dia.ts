import type { DiaConfig } from '~/utils/aurora-dia'
import { create } from 'zustand'
import { AuroraDia } from '~/utils/aurora-dia'

interface DiaState {
  dia: AuroraDia
  aurora_bot: {
    enable: boolean
    bot_type: string
    tips?: { [key: string]: { selector: string, text: string | string[] } }
  }
  initializeBot: (configs: DiaConfig) => void
  activateMotion: (leftEye: HTMLElement, rightEye: HTMLElement, eyesEl: HTMLElement) => void
}

export const useDiaStore = create<DiaState>((_set, get) => ({
  dia: new AuroraDia(),
  aurora_bot: {
    enable: true,
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
}))
