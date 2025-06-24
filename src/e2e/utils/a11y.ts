import { AxeBuilder } from '@axe-core/playwright'
import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

import { A11Y_TAGS } from '../constants'

interface A11yOptions {
  page: Page
  disableRules?: string[]
  includeTags?: string[]
  excludeSelectors?: string[]
  includeSelectors?: string[]
}

export async function a11y(options: A11yOptions) {
  const {
    page,
    disableRules = ['color-contrast'],
    includeTags = A11Y_TAGS,
    excludeSelectors = [],
    includeSelectors = [],
  } = options

  let axeBuilder = new AxeBuilder({ page }).disableRules(disableRules).withTags(includeTags)

  // Add exclusions if provided
  if (excludeSelectors.length > 0) {
    axeBuilder = axeBuilder.exclude(excludeSelectors)
  }

  // Add inclusions if provided
  if (includeSelectors.length > 0) {
    axeBuilder = axeBuilder.include(includeSelectors)
  }

  const { violations } = await axeBuilder.analyze()

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
