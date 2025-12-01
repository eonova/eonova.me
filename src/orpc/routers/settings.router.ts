import { createId } from '@paralleldrive/cuid2'
import { eq, settings } from '~/db'

import { protectedProcedure } from '../root'
import { emptyOutputSchema } from '../schemas/common.schema'
import { getSettingsOutputSchema, updateSettingsInputSchema } from '../schemas/settings.schema'

export const getSettings = protectedProcedure
  .output(getSettingsOutputSchema)
  .handler(async ({ context }) => {
    const result = await context.db.query.settings.findFirst({
      where: eq(settings.userId, context.session.user.id),
    })

    if (!result) {
      return { diaEnabled: true }
    }

    return { diaEnabled: result.diaEnabled }
  })

export const updateSettings = protectedProcedure
  .input(updateSettingsInputSchema)
  .output(emptyOutputSchema)
  .handler(async ({ context, input }) => {
    const existing = await context.db.query.settings.findFirst({
      where: eq(settings.userId, context.session.user.id),
    })

    if (existing) {
      await context.db
        .update(settings)
        .set({ diaEnabled: input.diaEnabled })
        .where(eq(settings.userId, context.session.user.id))
    }
    else {
      await context.db.insert(settings).values({
        id: createId(),
        userId: context.session.user.id,
        diaEnabled: input.diaEnabled,
      })
    }
  })
