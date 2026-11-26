import {expect, test} from './fixtures/sandbox-test';

test.describe('Getting started page', () => {
  test.beforeEach(async ({openPage}) => {
    await openPage('/getting-started');
  });

  test('explains installation and the English default', async ({page}) => {
    await expect(page).toHaveTitle('Getting started | FormPulse');
    await expect(page.getByRole('heading', {level: 2, name: '1. Install'})).toBeVisible();
    await expect(page.getByText('every error message is English by default')).toBeVisible();
  });

  test('shows the optional locale configuration', async ({page}) => {
    await expect(page.getByText('provideFormPulse({locale: FpLocale.Uk, locales: [fpLocaleUk]})')).toBeVisible();
  });

  test('marks Getting started as the current page', async ({page}) => {
    const mainNavigation = page.getByRole('navigation', {name: 'Main'});
    await expect(mainNavigation.getByRole('link', {name: 'Getting started'})).toHaveAttribute('aria-current', 'page');
  });

  test('has no accessibility violations', async ({expectNoAccessibilityViolations}) => {
    await expectNoAccessibilityViolations();
  });
});
