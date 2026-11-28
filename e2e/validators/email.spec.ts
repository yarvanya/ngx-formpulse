import type {Page} from '@playwright/test';
import {expect, test} from '../fixtures/sandbox-test';

const REACTIVE_LABEL = 'Email (Reactive Forms)';
const SIGNAL_LABEL = 'Email (Signal Forms)';
const ENGLISH_MESSAGE = 'Enter a valid email address, e.g. name@example.com.';
const MESSAGE_TABLE_ROW_COUNT = 8;

async function openTab(page: Page, tab_name: string): Promise<void> {
  await page.getByRole('tab', {name: tab_name}).click();
  await expect(page.getByRole('tab', {name: tab_name})).toHaveAttribute('aria-selected', 'true');
}

async function selectOption(page: Page, field_name: string, option_name: string): Promise<void> {
  await page.getByRole('combobox', {name: field_name}).click();
  await page.getByRole('option', {name: option_name, exact: true}).click();
}

async function typeInBothFields(page: Page, email_address: string): Promise<void> {
  await page.getByLabel(REACTIVE_LABEL).fill(email_address);
  await page.getByLabel(SIGNAL_LABEL).fill(email_address);
}

async function expectBothErrors(page: Page, expected_message: string): Promise<void> {
  await expect(page.getByLabel(REACTIVE_LABEL)).toHaveAccessibleDescription(expected_message);
  await expect(page.getByLabel(SIGNAL_LABEL)).toHaveAccessibleDescription(expected_message);
}

test.describe('fpEmail page', () => {
  test.beforeEach(async ({openPage}) => {
    await openPage('/validators/email');
  });

  test('is reachable from the navigation', async ({page, openPage}) => {
    await openPage('/');
    await page.getByRole('navigation', {name: 'Main'}).getByRole('link', {name: 'fpEmail'}).click();
    await expect(page).toHaveTitle('fpEmail | FormPulse');
    await expect(page.getByRole('heading', {level: 1, name: 'fpEmail'})).toBeVisible();
  });

  test('offers Description, API and Examples tabs', async ({page}) => {
    await expect(page.getByRole('tab')).toHaveText(['Description', 'API', 'Examples']);
    await expect(page.getByRole('heading', {level: 2, name: 'What it does'})).toBeVisible();
  });

  test('links the standards in a new tab', async ({page}) => {
    const standardLink = page.getByRole('complementary', {name: 'Standards'}).getByRole('link', {name: 'RFC 5322 (opens in a new tab)'});
    await expect(standardLink).toHaveAttribute('target', '_blank');
    await expect(page.getByText('FormPulse checks the format, not that the mailbox exists.')).toBeVisible();
  });

  test('documents the rules, the comparison and the messages', async ({page}) => {
    await openTab(page, 'API');
    await expect(page.getByRole('table', {name: 'FpEmailOptions'})).toContainText('strict');
    await expect(page.getByRole('heading', {level: 2, name: 'Rules'})).toBeVisible();
    await expect(page.getByRole('table', {name: 'Email rules compared'})).toContainText('Top-level domain required (user@company)');
    const messagesTable = page.getByRole('table', {name: 'Built-in fpEmail messages'});
    await expect(messagesTable.getByRole('row')).toHaveCount(MESSAGE_TABLE_ROW_COUNT);
    await expect(messagesTable).toContainText('Введіть коректну адресу електронної пошти, наприклад name@example.com.');
  });

  test.describe('Examples', () => {
    test.beforeEach(async ({page}) => {
      await openTab(page, 'Examples');
    });

    test('accepts a valid address in both form systems', async ({page}) => {
      await typeInBothFields(page, 'ivan.petrenko+news@example.com.ua');
      await expect(page.getByLabel(REACTIVE_LABEL)).toHaveAttribute('aria-invalid', 'false');
      await expect(page.getByLabel(SIGNAL_LABEL)).toHaveAttribute('aria-invalid', 'false');
      await expectBothErrors(page, '');
    });

    test('rejects an address without a top-level domain', async ({page}) => {
      await typeInBothFields(page, 'name@company');
      await expect(page.getByLabel(REACTIVE_LABEL)).toHaveAttribute('aria-invalid', 'true');
      await expectBothErrors(page, ENGLISH_MESSAGE);
    });

    test('rejects two dots in a row', async ({page}) => {
      await typeInBothFields(page, 'na..me@example.com');
      await expectBothErrors(page, ENGLISH_MESSAGE);
    });

    test('switches between tolerant and strict matching', async ({page}) => {
      await typeInBothFields(page, ' name@example.com ');
      await expectBothErrors(page, '');
      await page.getByRole('switch', {name: 'Strict matching'}).click();
      await expectBothErrors(page, ENGLISH_MESSAGE);
      await expect(page.getByRole('figure').filter({hasText: 'Signal Forms'})).toContainText('fpEmail(path.email, {strict: true})');
    });

    test('shows the message in the selected language', async ({page}) => {
      await selectOption(page, 'Message language', 'Ukrainian');
      await typeInBothFields(page, 'name@company');
      await expectBothErrors(page, 'Введіть коректну адресу електронної пошти, наприклад name@example.com.');
      await expect(page.getByRole('figure').filter({hasText: 'Reactive Forms'})).toContainText('fpEmail({locale: FpLocale.Uk})');
    });

    test('applies a test case to both fields', async ({page}) => {
      await page.getByRole('button', {name: 'Apply case: surrounding spaces in strict mode'}).click();
      await expect(page.getByRole('switch', {name: 'Strict matching'})).toBeChecked();
      await expect(page.getByLabel(REACTIVE_LABEL)).toHaveValue(' name@example.com ');
      await expect(page.getByLabel(SIGNAL_LABEL)).toHaveValue(' name@example.com ');
      await expectBothErrors(page, ENGLISH_MESSAGE);
    });

    test('copies a code example', async ({page, context}) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      await page.getByRole('button', {name: 'Copy Reactive Forms code'}).click();
      await expect(page.getByRole('button', {name: 'Copied Reactive Forms code'})).toBeVisible();
      const copiedText = await page.evaluate(async () => navigator.clipboard.readText());
      expect(copiedText).toContain('fpEmail()');
    });

    test('shows a validity icon with a tooltip', async ({page}) => {
      await typeInBothFields(page, 'name@company');
      const reactiveFormField = page.locator('mat-form-field').filter({has: page.getByRole('textbox', {name: REACTIVE_LABEL})});
      await reactiveFormField.getByRole('img', {name: 'Validity: invalid'}).hover();
      await expect(page.locator('.mat-mdc-tooltip')).toHaveText('Invalid');
      await typeInBothFields(page, 'name@example.com');
      const signalFormField = page.locator('mat-form-field').filter({has: page.getByRole('textbox', {name: SIGNAL_LABEL})});
      await expect(signalFormField.getByRole('img', {name: 'Validity: valid'})).toBeVisible();
    });

    test('has no accessibility violations', async ({page, expectNoAccessibilityViolations}) => {
      await typeInBothFields(page, 'name@company');
      await expectNoAccessibilityViolations();
    });
  });

  test('has no accessibility violations on the Description and API tabs', async ({page, expectNoAccessibilityViolations}) => {
    await expectNoAccessibilityViolations();
    await openTab(page, 'API');
    await expectNoAccessibilityViolations();
  });
});
