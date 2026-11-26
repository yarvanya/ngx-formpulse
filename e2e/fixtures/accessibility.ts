import AxeBuilder from '@axe-core/playwright';
import {expect, type Page, test as base} from '@playwright/test';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

export interface AccessibilityFixtures {
  readonly expectNoAccessibilityViolations: () => Promise<void>;
}

async function scanPage(page: Page): Promise<void> {
  const scanResults = await new AxeBuilder({page}).withTags(WCAG_TAGS).analyze();
  expect(scanResults.violations).toEqual([]);
}

export const test = base.extend<AccessibilityFixtures>({
  expectNoAccessibilityViolations: async ({page}, use) => {
    await use(async () => {
      await scanPage(page);
    });
  }
});

export {expect};
