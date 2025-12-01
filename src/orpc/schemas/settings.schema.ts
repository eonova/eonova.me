import { z } from 'zod'

export const getSettingsOutputSchema = z.object({
  diaEnabled: z.boolean(),
})

export const updateSettingsInputSchema = z.object({
  diaEnabled: z.boolean(),
})
