import type {Page} from '@playwright/test';
import {expect, test} from '../fixtures/sandbox-test';

const REACTIVE_LABEL = 'Postal code (Reactive Forms)';
const SIGNAL_LABEL = 'Postal code (Signal Forms)';
const MESSAGE_TABLE_ROW_COUNT = 8;
const SINGLE_RESULT_ROW_COUNT = 2;

async function openTab(page: Page, tab_name: string): Promise<void> {
  await page.getByRole('tab', {name: tab_name}).click();
  await expect(page.getByRole('tab', {name: tab_name})).toHaveAttribute('aria-selected', 'true');
}

async function selectOption(page: Page, field_name: string, option_name: string): Promise<void> {
  await page.getByRole('combobox', {name: field_name}).click();
  await page.getByRole('option', {name: option_name, exact: true}).click();
}

async function typeInBothFields(page: Page, post_code: string): Promise<void> {
  await page.getByLabel(REACTIVE_LABEL).fill(post_code);
  await page.getByLabel(SIGNAL_LABEL).fill(post_code);
}

async function expectBothErrors(page: Page, expected_message: string): Promise<void> {
  await expect(page.getByLabel(REACTIVE_LABEL)).toHaveAccessibleDescription(expected_message);
  await expect(page.getByLabel(SIGNAL_LABEL)).toHaveAccessibleDescription(expected_message);
}

test.describe('fpPostCode page', () => {
  test.beforeEach(async ({openPage}) => {
    await openPage('/validators/post-code');
  });

  test('is reachable from the navigation', async ({page, openPage}) => {
    await openPage('/');
    await page.getByRole('navigation', {name: 'Main'}).getByRole('link', {name: 'fpPostCode'}).click();
    await expect(page).toHaveTitle('fpPostCode | FormPulse');
    await expect(page.getByRole('heading', {level: 1, name: 'fpPostCode'})).toBeVisible();
  });

  test('offers Description, API and Examples tabs', async ({page}) => {
    await expect(page.getByRole('tab')).toHaveText(['Description', 'API', 'Examples']);
    await expect(page.getByRole('tab', {name: 'Description'})).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('heading', {level: 2, name: 'What it does'})).toBeVisible();
  });

  test('documents the API in tables', async ({page}) => {
    await openTab(page, 'API');
    await expect(page.getByRole('table', {name: 'FpPostCodeOptions'})).toContainText('strict');
    await expect(page.getByRole('table', {name: 'FpPostCodeError'})).toContainText('examples');
    await expect(page.getByRole('table', {name: 'FpFormPulseConfig'})).toContainText('locales');
    await expect(page.getByRole('table', {name: 'FpLocale'})).toContainText('FpLocale.Uk');
  });

  test('lists the built-in message of every language', async ({page}) => {
    await openTab(page, 'API');
    const messagesTable = page.getByRole('table', {name: 'Built-in fpPostCode messages'});
    await expect(messagesTable.getByRole('row')).toHaveCount(MESSAGE_TABLE_ROW_COUNT);
    await expect(messagesTable).toContainText('Введіть коректний поштовий індекс, наприклад 15432.');
  });

  test('searches the FpCountry enum', async ({page}) => {
    await openTab(page, 'API');
    await page.getByRole('button', {name: 'Enums'}).click();
    await page.getByLabel('Search FpCountry').fill('ukraine');
    const countryTable = page.getByRole('table', {name: 'FpCountry'});
    await expect(countryTable.getByRole('row')).toHaveCount(SINGLE_RESULT_ROW_COUNT);
    await expect(countryTable).toContainText('FpCountry.UA');
    await expect(countryTable).toContainText('15432, 01055, 01001');
  });

  test('skips to the main content without leaving the page', async ({page}) => {
    await page.keyboard.press('Tab');
    await page.getByRole('link', {name: 'Skip to main content'}).press('Enter');
    await expect(page.getByRole('main')).toBeFocused();
    await expect(page).toHaveURL(/\/validators\/post-code$/);
  });

  test('highlights the code examples', async ({page}) => {
    await expect(page.getByRole('figure').filter({hasText: 'Reactive Forms'}).getByText('import').first()).toHaveClass(/token keyword/);
  });

  test('credits the data source in a new tab', async ({page}) => {
    const sourceLink = page.getByRole('complementary', {name: 'Data source'}).getByRole('link', {name: 'Google libaddressinput (opens in a new tab)'});
    await expect(sourceLink).toHaveAttribute('target', '_blank');
    await expect(page.getByText('FormPulse checks the format, not that the value exists.')).toBeVisible();
  });

  test.describe('Examples', () => {
    test.beforeEach(async ({page}) => {
      await openTab(page, 'Examples');
    });

    test('accepts a valid Ukrainian postal code in both form systems', async ({page}) => {
      await typeInBothFields(page, '01001');
      await expect(page.getByLabel(REACTIVE_LABEL)).toHaveAttribute('aria-invalid', 'false');
      await expect(page.getByLabel(SIGNAL_LABEL)).toHaveAttribute('aria-invalid', 'false');
      await expectBothErrors(page, '');
    });

    test('rejects an invalid Ukrainian postal code with an example', async ({page}) => {
      await typeInBothFields(page, '0100');
      await expect(page.getByLabel(REACTIVE_LABEL)).toHaveAttribute('aria-invalid', 'true');
      await expectBothErrors(page, 'Enter a valid postal code, e.g. 15432.');
    });

    test('switches to another country', async ({page}) => {
      await selectOption(page, 'Country', 'Poland (PL)');
      await typeInBothFields(page, '00950');
      await expectBothErrors(page, 'Enter a valid postal code, e.g. 00-950.');
      await typeInBothFields(page, '00-950');
      await expectBothErrors(page, '');
    });

    test('validates any country', async ({page}) => {
      await selectOption(page, 'Country', 'Any country');
      await typeInBothFields(page, '%%%');
      await expectBothErrors(page, 'Enter a valid postal code.');
      await expect(page.getByRole('figure').filter({hasText: 'Reactive Forms'})).toContainText('fpPostCode()');
    });

    test('switches between tolerant and strict matching', async ({page}) => {
      await selectOption(page, 'Country', 'United Kingdom (GB)');
      await typeInBothFields(page, 'sw1a 1aa');
      await expectBothErrors(page, '');
      await page.getByRole('switch', {name: 'Strict matching'}).click();
      await expectBothErrors(page, 'Enter a valid postal code, e.g. EC1Y 8SY.');
      await expect(page.getByRole('figure').filter({hasText: 'Signal Forms'})).toContainText('fpPostCode(path.postCode, FpCountry.GB, {strict: true})');
    });

    test('shows the message in the selected language', async ({page}) => {
      await selectOption(page, 'Message language', 'Ukrainian');
      await typeInBothFields(page, '0100');
      await expectBothErrors(page, 'Введіть коректний поштовий індекс, наприклад 15432.');
      await expect(page.getByRole('figure').filter({hasText: 'Reactive Forms'})).toContainText('fpPostCode(FpCountry.UA, {locale: FpLocale.Uk})');
    });

    test('applies a test case to both fields', async ({page}) => {
      await page.getByRole('button', {name: 'Apply case: Dutch postal code with one letter'}).click();
      await expect(page.getByRole('combobox', {name: 'Country'})).toContainText('Netherlands (NL)');
      await expect(page.getByLabel(REACTIVE_LABEL)).toHaveValue('1234 A');
      await expect(page.getByLabel(SIGNAL_LABEL)).toHaveValue('1234 A');
      await expectBothErrors(page, 'Enter a valid postal code, e.g. 1234 AB.');
    });

    test('copies a code example', async ({page, context}) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      await page.getByRole('button', {name: 'Copy Reactive Forms code'}).click();
      await expect(page.getByRole('button', {name: 'Copied Reactive Forms code'})).toBeVisible();
      const copiedText = await page.evaluate(async () => navigator.clipboard.readText());
      expect(copiedText).toContain('fpPostCode(FpCountry.UA)');
    });

    test('has no accessibility violations', async ({page, expectNoAccessibilityViolations}) => {
      await typeInBothFields(page, '0100');
      await expectNoAccessibilityViolations();
    });
  });

  test('has no accessibility violations on the Description and API tabs', async ({page, expectNoAccessibilityViolations}) => {
    await expectNoAccessibilityViolations();
    await openTab(page, 'API');
    await expectNoAccessibilityViolations();
  });
});
