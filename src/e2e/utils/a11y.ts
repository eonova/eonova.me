import type { Page } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'
import { expect } from '@playwright/test'

import { A11Y_TAGS } from '../constants'

interface Options {
  page: Page
}

export async function a11y(options: Options) {
  const { page } = options

  const { violations } = await new AxeBuilder({ page })
    .disableRules(['color-contrast'])
    .withTags(A11Y_TAGS)
    .analyze()

  if (violations.length > 0) {
    console.log(
      violations
        .map((violation) => {
          return `
==================================================
Description: ${violation.description}
Impact: ${violation.impact}
Help: ${violation.help}
Help URL: ${violation.helpUrl}
Failure Summary: ${violation.nodes[0]?.failureSummary}
HTML: ${violation.nodes[0]?.html}
==================================================
      `
        })
        .join('\n'),
    )
  }

  expect(violations).toHaveLength(0)
}
