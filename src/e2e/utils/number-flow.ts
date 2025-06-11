import type { Locator } from '@playwright/test'

export async function getNumberFlow(locator: Locator) {
  // @ts-expect-error -- internal property
  return await locator.evaluate(flow => flow._internals.ariaLabel)
}
