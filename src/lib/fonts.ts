import type { SatoriOptions } from 'next/dist/compiled/@vercel/og/satori'

import fs from 'node:fs/promises'
import path from 'node:path'

import { cache } from 'react'

const getFontPath = (fontName: string) => path.join(process.cwd(), 'public', 'fonts', fontName)

const getRegularFont = cache(async () => {
  const response = await fs.readFile(getFontPath('Geist-Regular.otf'))
  const font = Uint8Array.from(response).buffer

  return font
})

const getMediumFont = cache(async () => {
  const response = await fs.readFile(getFontPath('Geist-Medium.otf'))
  const font = Uint8Array.from(response).buffer

  return font
})

const getSemiBoldFont = cache(async () => {
  const response = await fs.readFile(getFontPath('Geist-SemiBold.otf'))
  const font = Uint8Array.from(response).buffer

  return font
})

const getFallbackFont = cache(async () => {
  const response = await fs.readFile(getFontPath('DingTalk.otf'))
  const font = Uint8Array.from(response).buffer

  return font
})

export async function getOGImageFonts(_title: string): Promise<SatoriOptions['fonts']> {
  const [regularFontData, mediumFontData, semiBoldFontData, fallbackFontData] = await Promise.all([
    getRegularFont(),
    getMediumFont(),
    getSemiBoldFont(),
    getFallbackFont(),
  ])

  return [
    {
      name: 'Geist Sans',
      data: regularFontData,
      style: 'normal',
      weight: 400,
    },
    {
      name: 'Geist Sans',
      data: mediumFontData,
      style: 'normal',
      weight: 500,
    },
    {
      name: 'Geist Sans',
      data: semiBoldFontData,
      style: 'normal',
      weight: 600,
    },
    {
      name: 'Noto Sans TC',
      data: fallbackFontData,
      style: 'normal',
      weight: 400,
    },
    {
      name: 'Noto Sans SC',
      data: fallbackFontData,
      style: 'normal',
      weight: 400,
    },
  ]
}
