import type { SatoriOptions } from 'next/dist/compiled/@vercel/og/satori'

import fs from 'node:fs/promises'
import path from 'node:path'

import { cache } from 'react'

const getFontPath = (fontName: string) => path.join(process.cwd(), 'public', 'fonts', fontName)

const getHappyWorldFont = cache(async () => {
  const response = await fs.readFile(getFontPath('HappyWorld.otf'))
  const font = Uint8Array.from(response).buffer

  return font
})

export async function getOGImageFonts(_title: string): Promise<SatoriOptions['fonts']> {
  const [happyWorldFontData] = await Promise.all([
    getHappyWorldFont(),
  ])

  return [
    {
      name: 'Noto Sans SC',
      data: happyWorldFontData,
      style: 'normal',
      weight: 400,
    },
  ]
}
