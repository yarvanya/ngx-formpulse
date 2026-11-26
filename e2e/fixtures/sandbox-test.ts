import AxeBuilder from '@axe-core/playwright';
import {expect, type Page, test as base} from '@playwright/test';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

export interface SandboxFixtures {
  readonly openPage: (page_path: string) => Promise<void>;
  readonly expectNoAccessibilityViolations: () => Promise<void>;
}

async function openHydratedPage(page: Page, page_path: string): Promise<void> {
  await page.goto(page_path);
  await page.waitForFunction(() => document.documentElement.dataset['appReady'] === 'true');
}

async function scanPage(page: Page): Promise<void> {
  await page.waitForFunction(() => document.getAnimations().every((running_animation) => running_animation.playState !== 'running'));
  const scanResults = await new AxeBuilder({page}).withTags(WCAG_TAGS).analyze();
  expect(scanResults.violations).toEqual([]);
}

export const test = base.extend<SandboxFixtures>({
  openPage: async ({page}, use) => {
    await use(async (page_path) => {
      await openHydratedPage(page, page_path);
    });
  },
  expectNoAccessibilityViolations: async ({page}, use) => {
    await use(async () => {
      await scanPage(page);
    });
  }
});

export {expect};
