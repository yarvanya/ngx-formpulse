import {expect, test} from './fixtures/accessibility';

const REPOSITORY_URL = 'https://github.com/yarvanya/ngx-formpulse';

test.describe('Home page', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
  });

  test('introduces FormPulse', async ({page}) => {
    await expect(page).toHaveTitle('FormPulse: typed validators for Angular forms');
    await expect(page.getByRole('heading', {level: 1, name: 'FormPulse'})).toBeVisible();
    await expect(page.getByText('npm install ngx-formpulse')).toBeVisible();
  });

  test('marks Home as the current page', async ({page}) => {
    const mainNavigation = page.getByRole('navigation', {name: 'Main'});
    await expect(mainNavigation.getByRole('link', {name: 'Home'})).toHaveAttribute('aria-current', 'page');
  });

  test('opens the source code in a new tab', async ({page}) => {
    const repositoryLink = page.getByRole('contentinfo').getByRole('link', {name: 'Source code on GitHub (opens in a new tab)'});
    await expect(repositoryLink).toHaveAttribute('href', REPOSITORY_URL);
    await expect(repositoryLink).toHaveAttribute('target', '_blank');
    await expect(repositoryLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('offers a skip link to the main content', async ({page}) => {
    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', {name: 'Skip to main content'});
    await expect(skipLink).toBeFocused();
    await skipLink.press('Enter');
    await expect(page.getByRole('main')).toBeFocused();
  });

  test('navigates to Getting started', async ({page}) => {
    await page.getByRole('main').getByRole('link', {name: 'Get started'}).click();
    await expect(page).toHaveURL(/\/getting-started$/);
    await expect(page.getByRole('heading', {level: 1, name: 'Getting started'})).toBeVisible();
  });

  test('has no accessibility violations', async ({expectNoAccessibilityViolations}) => {
    await expectNoAccessibilityViolations();
  });
});
